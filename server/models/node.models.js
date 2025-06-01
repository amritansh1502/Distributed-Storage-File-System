const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  nodeId: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline',
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Node', nodeSchema);
