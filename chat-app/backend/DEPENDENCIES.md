# 项目依赖说明文档

本文档详细说明了后端项目所使用的各个依赖包及其作用。

## 核心依赖

### Express
- **用途**: Node.js Web 应用框架
- **主要功能**:
  - 路由管理
  - 中间件支持
  - 静态文件服务
  - API构建
- **示例**:
```javascript
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Hello World'));
```

### Mongoose
- **用途**: MongoDB对象建模工具
- **主要功能**:
  - 数据模型定义
  - 数据验证
  - 查询构建
  - 中间件支持
- **示例**:
```javascript
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: String,
  email: String
});
```

## 安全相关

### Dotenv
- **用途**: 环境变量管理
- **主要功能**:
  - 从.env文件加载环境变量
  - 保护敏感信息
- **示例**:
```javascript
require('dotenv').config();
const dbUri = process.env.MONGODB_URI;
```

### JsonWebToken
- **用途**: JWT认证实现
- **主要功能**:
  - 生成JWT令牌
  - 验证令牌
  - 用户身份认证
- **示例**:
```javascript
const jwt = require('jsonwebtoken');
const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
```

### Bcryptjs
- **用途**: 密码加密
- **主要功能**:
  - 密码哈希
  - 密码验证
  - 安全存储
- **示例**:
```javascript
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash(password, 10);
```

### Cookie-parser
- **用途**: Cookie解析
- **主要功能**:
  - 解析请求中的cookies
  - Cookie管理
- **示例**:
```javascript
const cookieParser = require('cookie-parser');
app.use(cookieParser());
```

## 文件和实时通信

### Cloudinary
- **用途**: 云媒体管理
- **主要功能**:
  - 图片上传
  - 图片优化
  - 媒体文件存储
- **示例**:
```javascript
const cloudinary = require('cloudinary').v2;
await cloudinary.uploader.upload(imagePath);
```

### Socket.io
- **用途**: WebSocket实现
- **主要功能**:
  - 实时双向通信
  - 事件广播
  - 房间管理
- **示例**:
```javascript
const io = require('socket.io')(server);
io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    io.emit('message', msg);
  });
});
```

## 安装说明

可以通过以下命令安装所有依赖：

```bash
npm i express mongoose dotenv jsonwebtoken bcryptjs cookie-parser cloudinary socket.io
```

## 注意事项

1. 确保创建 `.env` 文件并配置必要的环境变量
2. 在使用 Cloudinary 之前需要注册账号并获取API密钥
3. 妥善保管所有密钥和敏感信息
4. 建议在开发环境和生产环境使用不同的环境变量配置 