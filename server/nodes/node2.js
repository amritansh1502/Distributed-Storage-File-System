const http = require('http');
const io = require('socket.io-client');
const serverUrl = process.env.SERVER_URL || 'http://localhost:5000';
const socket = io(serverUrl);

const nodeId = 'node2';

setInterval(() => {
  socket.emit('nodePing', { nodeId });
  console.log(`[${nodeId}] Health ping sent`);
}, 5000);

// Simple HTTP server to keep the service alive on Render
const PORT = process.env.PORT || 3002;
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(`${nodeId} is running\n`);
});

server.listen(PORT, () => {
  console.log(`${nodeId} HTTP server listening on port ${PORT}`);
});
