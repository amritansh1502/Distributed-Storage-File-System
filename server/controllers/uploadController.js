const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const FileModel = require('../models/file.models.js');
const {
  REPLICATION_FACTOR,
  STORAGE_NODES,
  CHUNKS_DIR,
  CHUNK_SIZE,
  encryptionKey
} = require('../config/constants');

exports.handleFileUpload = async (req, res, io) => {
  try {
    const file = req.file;
    const filePath = file.path;
    const fileName = file.filename;
    const originalName = file.originalname;
    const IV = crypto.randomBytes(16);

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.mimetype)) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    if (file.size > maxSize) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'File too large' });
    }

    // Initialize metadata
    const fileDoc = new FileModel({
      originalName,
      savedName: fileName,
      totalChunks: 0, // Will update later
      chunkLocations: [],
      iv: IV.toString('hex'),
      status: 'processing',
      progress: 0
    });

    await fileDoc.save(); // Save early to track progress

    const readStream = fs.createReadStream(filePath, { highWaterMark: CHUNK_SIZE });

    let index = 0;
    let uploadedSize = 0;
    const totalSize = file.size;
    const chunkLocations = [];

    for await (const chunk of readStream) {
      const chunkIV = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), chunkIV);
      const encrypted = Buffer.concat([cipher.update(chunk), cipher.final()]);

      const chunkName = `${fileName}-chunk-${index}`;
      const selectedNodes = [];

      while (selectedNodes.length < REPLICATION_FACTOR) {
        const node = STORAGE_NODES[Math.floor(Math.random() * STORAGE_NODES.length)];
        if (!selectedNodes.includes(node)) selectedNodes.push(node);
      }

      selectedNodes.forEach((node) => {
        const chunkPath = path.join(CHUNKS_DIR, node, chunkName);
        fs.writeFileSync(chunkPath, encrypted);
      });

      // Avoid duplicate chunk entries
      if (!chunkLocations.some(c => c.chunkName === chunkName)) {
        chunkLocations.push({ chunkName, nodes: selectedNodes, iv: chunkIV.toString('hex') });
      }

      uploadedSize += chunk.length;

      const percent = Math.min(100, Math.floor((uploadedSize / totalSize) * 100));
      await FileModel.updateOne({ savedName: fileName }, { progress: percent });

      io.emit('upload-progress', {
        fileName,
        progress: percent,
        chunk: index,
        replicatedTo: selectedNodes
      });

      index++;
    }

    fs.unlinkSync(filePath); // Delete temp upload

    await FileModel.updateOne(
      { savedName: fileName },
      {
        totalChunks: index,
        chunkLocations,
        progress: 100,
        status: 'complete'
      }
    );

    io.emit('upload-complete', {
      fileName,
      totalChunks: index,
      chunkLocations
    });

    res.status(200).json({
      message: 'File uploaded, encrypted, and replicated successfully.',
      fileId: fileDoc._id,
      chunks: index,
      chunkLocations
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
