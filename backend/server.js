const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Enable CORS to allow requests from the frontend
app.use(cors({ origin: 'http://localhost:5173' })); // Replace with your frontend's URL

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Allow requests from your React app
    methods: ['GET', 'POST'],
  },
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle joining a room
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Handle sending messages
  socket.on('send_message', (data) => {
    io.to(data.room).emit('receive_message', { message: data.message });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Start the server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});