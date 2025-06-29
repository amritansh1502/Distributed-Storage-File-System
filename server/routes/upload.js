const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const FileModel = require('../models/file.models.js');
const { handleFileUpload } = require('../controllers/uploadController');

const router = express.Router();

// Configure Multer for temp uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'chunks/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Accept `io` via a wrapper function
const authMiddleware = require('../middleware/auth');

module.exports = function(io) {
  // @route   POST /api/upload
  // @desc    Upload and chunk a file
  router.post('/upload', authMiddleware, upload.single('file'), (req, res) => handleFileUpload(req, res, io));

  // @route   GET /api/status/:id
  // @desc    Get upload status and progress
  router.get('/status/:id', authMiddleware, async (req, res) => {
    const fileId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ error: 'Invalid file ID' });
    }

    try {
      const file = await FileModel.findById(fileId);
      if (!file) return res.status(404).json({ error: 'File not found' });

      // Check if the file belongs to the authenticated user
      if (file.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json({
        fileId: file._id,
        originalName: file.originalName,
        savedName: file.savedName,
        status: file.status,
        progress: file.progress
      });
    } catch (err) {
      console.error('Status route error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
};
