const fs = require('fs');
const path = require('path');
const { CHUNKS_DIR, STORAGE_NODES } = require('../config/constants');
const FileModel = require('../models/file.models');

module.exports = async function reReplicateChunks(failedNodeId, io) {
  console.log(`[🛠️ Re-Replication] Starting re-replication for ${failedNodeId}...`);

  const files = await FileModel.find({ 'chunkLocations.nodes': failedNodeId });

  for (const file of files) {
    const updatedChunks = [];

    for (const chunk of file.chunkLocations) {
      if (chunk.nodes.includes(failedNodeId)) {
        const availableNodes = chunk.nodes.filter(n => n !== failedNodeId);
        const sourceNode = availableNodes[0]; // Pick one healthy source

        if (!sourceNode) {
          console.warn(`⚠️ No healthy copy found for chunk ${chunk.chunkName}`);
          continue;
        }

        // Pick a new target node
        const targetNodes = STORAGE_NODES.filter(n =>
          !chunk.nodes.includes(n)
        );
        const newTarget = targetNodes[Math.floor(Math.random() * targetNodes.length)];

        if (!newTarget) {
          console.warn(`⚠️ No target node available for ${chunk.chunkName}`);
          continue;
        }

        const sourcePath = path.join(CHUNKS_DIR, sourceNode, chunk.chunkName);
        const targetPath = path.join(CHUNKS_DIR, newTarget, chunk.chunkName);

        try {
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`✅ Re-replicated ${chunk.chunkName} → ${newTarget}`);

          // Update in DB
          chunk.nodes = [...availableNodes, newTarget];
          updatedChunks.push(chunk.chunkName);

          // Emit real-time update
          console.log(`Emitting re-replication event for ${chunk.chunkName} from ${sourceNode} to ${newTarget}`);
          io.emit('re-replication', {
            chunkName: chunk.chunkName,
            from: sourceNode,
            to: newTarget,
            fileName: file.savedName
          });
        } catch (err) {
          console.error(`❌ Failed to re-replicate ${chunk.chunkName}:`, err.message);
        }
      }
    }

    try {
      await file.save();
    } catch (err) {
      console.error('[ERROR] Saving file during re-replication:', err.message);
    }
  }
};
