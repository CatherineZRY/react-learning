import "./envconfig.js"; // 加载环境变量（由于js的语言特性，import的模块会自动执行，等到所有import执行完毕后，才会执行import下面的代码）
import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import connectDB from "./lib/db.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app, server } from "./lib/socket.js";

const PORT = process.env.PORT;

app.use(express.json({ limit: '10mb' })); // 通常默认是100kb
app.use(cookieParser());
// 允许跨域(便于本地测试)
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});


