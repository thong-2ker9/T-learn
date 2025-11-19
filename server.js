const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Store rooms and users
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join room
  socket.on('join-room', ({ roomId, userId, userType }) => {
    socket.join(roomId);
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(socket.id);
    
    console.log(`${userType} joined room: ${roomId}`);
    
    // Notify others in the room
    socket.to(roomId).emit('user-joined', { userId, userType });
  });

  // Leave room
  socket.on('leave-room', ({ roomId }) => {
    socket.leave(roomId);
    const room = rooms.get(roomId);
    if (room) {
      room.delete(socket.id);
      if (room.size === 0) {
        rooms.delete(roomId);
      }
    }
    
    console.log(`User left room: ${roomId}`);
  });

  // Send message
  socket.on('send-message', ({ roomId, message }) => {
    console.log(`Message in room ${roomId}:`, message);
    
    // Broadcast to all users in the room including sender
    io.to(roomId).emit('receive-message', message);
  });

  // Typing indicator
  socket.on('typing', ({ roomId, userId, isTyping }) => {
    socket.to(roomId).emit('typing', { userId, isTyping });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove from all rooms
    rooms.forEach((users, roomId) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        if (users.size === 0) {
          rooms.delete(roomId);
        }
      }
    });
  });
});