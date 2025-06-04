// server/state/nodeStatus.js
import { STORAGE_NODES } from "../config/constants";

const nodeStatus = {};
STORAGE_NODES.forEach(node => {
  nodeStatus[node] = {
    alive: true,
    lastPing: null
  };
});

module.exports = nodeStatus;
