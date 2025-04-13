const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (you can restrict this to your frontend URL)
  },
});

app.use(cors()); // Enable CORS for cross-origin requests

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle joining a room
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // Handle sending a message
  socket.on('send_message', (data) => {
    io.to(data.room).emit('receive_message', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server
const PORT = 3000; // You can change the port if needed
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});