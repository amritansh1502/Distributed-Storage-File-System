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
} = require('../config/constants.js');

exports.handleFileUpload = async (req, res) => {
  try {
    const file = req.file;
    const filePath = file.path;
    const fileName = file.filename;
    const originalName = file.originalname;
    const IV = crypto.randomBytes(16);
    const readStream = fs.createReadStream(filePath, { highWaterMark: CHUNK_SIZE });

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

    let index = 0;
    const chunkLocations = [];

    readStream.on('data', (chunk) => {
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), IV);
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

      chunkLocations.push({
        chunkName,
        nodes: selectedNodes
      });

      index++;
    });

    readStream.on('end', async () => {
      fs.unlinkSync(filePath);

      const fileDoc = new FileModel({
        originalName,
        savedName: fileName,
        totalChunks: index,
        chunkLocations,
        iv: IV.toString('hex')
      });

      await fileDoc.save();

      res.status(200).json({
        message: 'File uploaded and replicated',
        chunks: index,
        chunkLocations
      });
    });

    readStream.on('error', (err) => {
      console.error('Chunking error:', err);
      res.status(500).json({ error: 'Failed to chunk file' });
    });

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
