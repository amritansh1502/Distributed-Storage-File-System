const NodeModel = require('../models/node.models.js');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected');

    // When a node sends a health ping
    socket.on('nodePing', async ({ nodeId }) => {
      console.log(`[Socket] Health ping from ${nodeId}`);

      try {
        // Upsert node in DB
        await NodeModel.findOneAndUpdate(
          { nodeId },
          {
            $set: {
              status: 'online',
              lastSeen: new Date(),
            },
          },
          { upsert: true, new: true }
        );

        // Emit live update to frontend
        io.emit('nodeHealthUpdate', {
          nodeId,
          status: 'online',
          lastSeen: new Date(),
        });
      } catch (err) {
        console.error('Error handling nodePing:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  // Interval to check node health
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
        }

        updatedStatuses.push({
          nodeId: node.nodeId,
          status: isOnline ? 'online' : 'offline',
          lastSeen: node.lastSeen,
        });
      }

      // Emit the whole node status update to UI
      io.emit('nodeHealthStatus', updatedStatuses);
    } catch (err) {
      console.error('Error checking node statuses:', err);
    }
  }, 10000); // Every 10 seconds
};
