require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');  // <--- Add this
const cors = require('cors');
const socketIo = require('socket.io');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));

app.use(express.json());

// Create HTTP server from express app
const server = http.createServer(app);

// Create socket.io instance from server
const io = new socketIo.Server(server, {
  cors: {
    origin: '*', // set your frontend url here
    methods: ['GET', 'POST'],
  },
});
const uploadRoutes = require('./routes/upload.js')(io); 
app.use('/api', uploadRoutes);

const downloadRoutes = require('./routes/download.js');
app.use('/api', downloadRoutes);

const filesRoutes = require('./routes/files.js');
app.use('/api', filesRoutes);

// Pass the io instance to your socket handler
require('./sockets/socketHandler')(io);

// Start listening on the HTTP server (not app)
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
