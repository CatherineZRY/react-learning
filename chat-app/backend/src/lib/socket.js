import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express(); // 创建本项目的app对象，并提供index中使用（用于创建http服务器, 用于创建socket服务器）
const server = http.createServer(app); // 创建http服务器
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // 允许跨域
    methods: ['GET', 'POST'], // 允许的请求方法
  },
});

// used to store the socket id of the user
const userSocketMap = new Map(); // {userId: socketId}

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap.set(userId, socket.id);
  }

  // io.emit() 发送消息给所有连接的客户端
  io.emit('getOnlineUsers', Array.from(userSocketMap.keys()));

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected:', socket.id);
    userSocketMap.delete(userId);
    io.emit('getOnlineUsers', Array.from(userSocketMap.keys()));
  });
});

function getReceiverSocketId(userId) {
  return userSocketMap.get(userId);
}

export { io, app, server, getReceiverSocketId };
