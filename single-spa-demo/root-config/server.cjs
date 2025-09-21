const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

// MIME类型映射
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  // 解析请求路径
  let pathname = req.url === '/' ? '/index.html' : req.url; // custom-event和postMessage通信对比测试

  let filePath = path.join(__dirname, pathname);

  // 获取文件扩展名
  let extname = path.extname(filePath).toLowerCase();

  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理OPTIONS请求
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // 检查文件是否存在
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // 文件不存在，返回404
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    // 读取文件
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }

      // 设置Content-Type
      let contentType = mimeTypes[extname] || 'text/plain';

      // 对于.js文件，设置为模块类型
      if (extname === '.js') {
        contentType = 'application/javascript; charset=utf-8';
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    });
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Single-SPA Demo 服务器已启动`);
  console.log(`📍 访问地址: http://localhost:${PORT}`);
  console.log(`⏰ 启动时间: ${new Date().toLocaleString('zh-CN')}`);
  console.log('');
  console.log('🔧 支持的功能:');
  console.log('  ✅ ES6 模块支持');
  console.log('  ✅ CORS 跨域支持');
  console.log('  ✅ 静态文件服务');
  console.log('');

  // 自动打开浏览器（Windows）
  const { exec } = require('child_process');
  exec(`start http://localhost:${PORT}`, (error) => {
    if (error) {
      console.log('请手动打开浏览器访问: http://localhost:8080');
    }
  });
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🛑 正在关闭服务器...');
  server.close(() => {
    console.log('✅ 服务器已关闭');
    process.exit(0);
  });
}); 