const io = require('socket.io-client');
const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
const socket = io(serverUrl);


const nodeId = 'node2';

setInterval(() => {
  socket.emit('nodePing', { nodeId });
  console.log(`[${nodeId}] Health ping sent`);
}, 5000);
