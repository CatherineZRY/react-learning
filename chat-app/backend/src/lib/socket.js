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

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected:', socket.id);
  });
});

export { io, app, server };
