const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  originalName: String,
  savedName: String,
  totalChunks: Number,
  chunkLocations: [
    {
      chunkName: String,
      nodes: [String]
    }
  ],
  uploadDate: {
    type: Date,
    default: Date.now
  },
  iv: String
});

module.exports = mongoose.model('File', FileSchema);
