const mongoose = require('mongoose');

const NodeSchema = new mongoose.Schema({
  nodeName: String,
  isHealthy: {
    type: Boolean,
    default: true
  },
  lastChecked: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Node', NodeSchema);
