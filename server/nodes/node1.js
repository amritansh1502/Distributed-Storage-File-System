



const io = require('socket.io-client');

const socket = io('http://localhost:5000');


const nodeId = 'Node-1';

setInterval(() => {
  socket.emit('nodePing', { nodeId });
  console.log(`[${nodeId}] Health ping sent`);
}, 5000);
