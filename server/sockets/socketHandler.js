const NodeModel = require('../models/node.models.js');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('[SOCKET] Client connected');

    // Node sends health ping
    socket.on('nodePing', async ({ nodeId }) => {
      const normalizedNodeId = nodeId.toLowerCase();
      console.log(`[PING] Received from node: ${normalizedNodeId}`);

      try {
        // Upsert node status in DB
        const updatedNode = await NodeModel.findOneAndUpdate(
          { nodeId: normalizedNodeId },
          {
            $set: {
              status: 'online',
              lastSeen: new Date(),
            },
          },
          { upsert: true, new: true }
        );

        // Emit individual update to frontend
        io.emit('nodeHealthUpdate', {
          nodeId: updatedNode.nodeId,
          status: 'online',
          lastSeen: updatedNode.lastSeen,
        });
      } catch (err) {
        console.error('[ERROR] nodePing handling failed:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('[SOCKET] Client disconnected');
    });
  });

  // Periodic node health check (every 10 sec)
  setInterval(async () => {
    const now = Date.now();

    try {
      const nodes = await NodeModel.find({});
      const updatedStatuses = [];

      for (const node of nodes) {
        const lastSeen = new Date(node.lastSeen).getTime();
        const isOnline = now - lastSeen < 10000;

        if (!isOnline && node.status !== 'offline') {
          node.status = 'offline';
          await node.save();

          // Trigger auto re-replication logic
          console.log(`[FAILURE DETECTED] Node ${node.nodeId} marked offline.`);
         const reReplicateChunks = require('../utils/replicationUtils');
         await reReplicateChunks(node.nodeId, io);
        }

        updatedStatuses.push({
          nodeId: node.nodeId.toLowerCase(),
          status: isOnline ? 'online' : 'offline',
          lastSeen: node.lastSeen,
        });
      }

      // Emit full node status list
      io.emit('nodeHealthStatus', updatedStatuses);
    } catch (err) {
      console.error('[ERROR] Checking node health:', err);
    }
  }, 10000);
};
