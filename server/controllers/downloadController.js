const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { PassThrough } = require('stream');
const FileModel = require('../models/file.models');
const { CHUNKS_DIR, encryptionKey } = require('../config/constants');

exports.handleFileDownload = async (req, res) => {
  try {
    const { fileId } = req.params;
    if (!fileId) {
      console.error('Download error: File ID is required');
      return res.status(400).json({ error: 'File ID is required' });
    }

    const fileDoc = await FileModel.findById(fileId);
    if (!fileDoc) {
      console.error(`Download error: File not found for ID ${fileId}`);
      return res.status(404).json({ error: 'File not found' });
    }

    if (fileDoc.status !== 'complete') {
      console.error(`Download error: File upload not complete for ID ${fileId}`);
      return res.status(400).json({ error: 'File upload not complete' });
    }

    let chunkLocations = fileDoc.chunkLocations;

    console.log('Chunk locations from DB:', chunkLocations);

    // Group chunkLocations by chunk index to avoid duplicates
    const chunkMap = new Map();
    for (const chunk of chunkLocations) {
      const index = parseInt(chunk.chunkName.match(/-chunk-(\d+)$/)[1], 10);
      if (!chunkMap.has(index)) {
        chunkMap.set(index, chunk);
      }
    }

    // Convert map values to array and sort by chunk index
    chunkLocations = Array.from(chunkMap.values()).sort((a, b) => {
      const aIndex = parseInt(a.chunkName.match(/-chunk-(\d+)$/)[1], 10);
      const bIndex = parseInt(b.chunkName.match(/-chunk-(\d+)$/)[1], 10);
      return aIndex - bIndex;
    });

    // Set content disposition and content type based on original file extension
    const ext = path.extname(fileDoc.originalName).toLowerCase();
    let contentType = 'application/octet-stream';
    switch (ext) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.txt':
        contentType = 'text/plain';
        break;
      // Add more types as needed
    }

    res.setHeader('Content-Disposition', `attachment; filename="${fileDoc.originalName}"`);
    res.setHeader('Content-Type', contentType);

    for (const chunkInfo of chunkLocations) {
      // Find chunk file path
      let chunkPath = null;
      for (const node of chunkInfo.nodes) {
        const possiblePath = path.join(CHUNKS_DIR, node, chunkInfo.chunkName);
        if (fs.existsSync(possiblePath)) {
          chunkPath = possiblePath;
          break;
        }
      }

      if (!chunkPath) {
        console.error(`Chunk ${chunkInfo.chunkName} not found on any node`);
        res.end();
        return;
      }

      console.log(`Streaming chunk ${chunkInfo.chunkName} from ${chunkPath}`);
      const encryptedBuffer = fs.readFileSync(chunkPath);
if (!chunkInfo.iv) {
  console.error(`Missing IV for chunk ${chunkInfo.chunkName}`);
  res.end();
  return;
}

const chunkIV = Buffer.from(chunkInfo.iv, 'hex');

try {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), chunkIV);
  const decryptedBuffer = Buffer.concat([
    decipher.update(encryptedBuffer),
    decipher.final()
  ]);

  // Write decrypted chunk to response
  res.write(decryptedBuffer);
} catch (error) {
  console.error(`Failed to decrypt chunk ${chunkInfo.chunkName}`, error);
  res.end();
  return;
}
    }

    // End response after all chunks are written
    res.end();
    console.log(`File download completed for file ID ${fileId}`);
  } catch (err) {
    console.error('Download error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Server error during file download' });
    } else {
      res.end();
    }
  }
};

exports.listFiles = async (req, res) => {
  try {
    const files = await FileModel.find({ status: 'complete' }).select('_id originalName').exec();
    res.status(200).json(files);
  } catch (err) {
    console.error('Error fetching files:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
