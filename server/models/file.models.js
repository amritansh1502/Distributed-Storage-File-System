const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  originalName: String,
  savedName: String,
  totalChunks: Number,
  chunkLocations: [
    {
      chunkName: String,
      nodes: [String],
      iv: String
    }
  ],
  uploadDate: {
    type: Date,
    default: Date.now
  },
  iv: String,
  status: {
    type: String,
    enum: ['processing', 'complete'],
    default: 'processing'
  },
  progress: {
    type: Number,
    default: 0 // 0 to 100%
  }
});

module.exports = mongoose.model('File', FileSchema);
