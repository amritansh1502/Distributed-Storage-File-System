

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const FileModel = require('../models/file.models.js');
const authMiddleware = require('../middleware/auth');
const { encryptionKey } = require('../config/constants');

exports.handleFileDownload = [
  authMiddleware,
  async (req, res) => {
    const { fileId } = req.params;

    try {
      const file = await FileModel.findById(fileId);
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }

      // Check if the file belongs to the authenticated user
      if (file.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Logic to stream or send the file chunks to the user
      const CHUNKS_DIR = path.resolve(__dirname, '../chunks');
      const chunks = file.chunkLocations;

      res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
      res.setHeader('Content-Type', 'application/octet-stream');

      // Stream chunks sequentially using streams to avoid memory issues and ensure proper concatenation
      for (const chunkInfo of chunks) {
        const chunkPath = path.join(CHUNKS_DIR, chunkInfo.nodes[0], chunkInfo.chunkName);
        if (fs.existsSync(chunkPath)) {
          await new Promise((resolve, reject) => {
            const readStream = fs.createReadStream(chunkPath);
            const decipher = crypto.createDecipheriv(
              'aes-256-cbc',
              Buffer.from(encryptionKey),
              Buffer.from(chunkInfo.iv, 'hex')
            );
            readStream.on('error', reject);
            decipher.on('error', reject);
            readStream.on('end', resolve);
            readStream.pipe(decipher).pipe(res, { end: false });
          });
        } else {
          console.error(`Chunk not found: ${chunkPath}`);
          return res.status(500).json({ error: 'Chunk missing on server' });
        }
      }
      res.end();
    } catch (err) {
      console.error('Download error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
];

exports.listFiles = [
  authMiddleware,
  async (req, res) => {
    try {
      const files = await FileModel.find({ userId: req.user._id }).select('originalName savedName uploadDate status progress');
      res.json({ files });
    } catch (err) {
      console.error('List files error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
];
