# Single-SPA 微前端框架演示

## 📖 项目简介

这是一个完整的 Single-SPA 微前端框架演示项目，展示了如何使用 Single-SPA 来管理和集成多个不同技术栈的微应用。

## 🌐 HTTP 服务器工作机制详解

### 文件加载流程

```
1. 浏览器访问 http://localhost:8080/
   ↓
2. http-server 查找默认文件（按优先级）:
   - index.html    ← 找到了！
   - index.htm
   - default.html  
   - default.htm
   ↓
3. 返回 index.html 给浏览器
   ↓
4. 浏览器解析 HTML，发现脚本标签:
   <script src="https://unpkg.com/systemjs@6.8.3/dist/system.min.js"></script>
   <script src="https://unpkg.com/single-spa@5.9.3/lib/system/single-spa.min.js"></script>
   <script type="systemjs-module" src="./root-config.js"></script>
   ↓
5. 浏览器依次请求这些资源:
   - SystemJS 库（外部CDN）
   - Single-SPA 库（外部CDN）  
   - root-config.js（本地文件）
   ↓
6. root-config.js 动态加载微应用:
   - ./react-app/main.js
   - ./vue-app/main.js
   - ./vanilla-app/main.js
```

### http-server 命令详解

```bash
npx http-server . -p 8080 -c-1 --cors -o
```

| 参数 | 说明 |
|------|------|
| `npx` | 运行 npm 包，无需全局安装 |
| `http-server` | 静态文件服务器包名 |
| `.` | 当前目录作为服务根目录 |
| `-p 8080` | 监听端口 8080 |
| `-c-1` | 禁用缓存（开发时有用） |
| `--cors` | 启用跨域资源共享 |
| `-o` | 启动后自动打开浏览器 |

### package.json 字段说明

```json
{
  "main": "root-config.js",  // Node.js 模块入口（不影响 HTTP 服务器）
  "type": "module"           // 启用 ES6 模块语法
}
```

**重要提示**：
- `"main"` 字段只在 Node.js 环境中有效
- HTTP 服务器总是优先查找 `index.html` 
- 浏览器需要 HTML 文件作为入口点

## 🎯 Single-SPA 核心概念

### 什么是 Single-SPA？

Single-SPA 是一个为前端微服务化而生的 JavaScript 框架，它允许您在同一页面上使用多个前端框架，这些应用可以独立开发、独立部署。

### 核心特性

- ✅ **技术栈无关**：支持 React、Vue、Angular、原生 JS 等任何前端技术
- ✅ **独立开发部署**：每个微应用可以独立开发、测试和部署
- ✅ **运行时集成**：在浏览器中动态加载和集成微应用
- ✅ **生命周期管理**：提供完整的应用生命周期管理
- ✅ **路由驱动**：基于路由来激活/卸载不同的微应用

## 🏗️ 项目结构

```
single-spa-demo/
├── root-config/              # 基座应用（主应用）
│   ├── index.html           # 主页面 ← HTTP 服务器的入口文件
│   ├── root-config.js       # Single-SPA 配置文件
│   ├── package.json         # 项目配置
│   ├── react-app/           # React 微应用
│   │   └── main.js
│   ├── vue-app/             # Vue 微应用
│   │   └── main.js
│   └── vanilla-app/         # 原生 JS 微应用
│       └── main.js
```

## 🔧 Single-SPA 核心 API

### 1. 注册微应用

```javascript
import { registerApplication } from 'single-spa';

registerApplication({
  name: 'app-name',                    // 应用名称
  app: () => System.import('./app'),   // 应用加载函数
  activeWhen: '/app-route',            // 激活条件
  customProps: {                       // 自定义属性
    domElement: document.getElementById('container')
  }
});
```

### 2. 微应用生命周期

每个微应用必须导出三个生命周期函数：

```javascript
// 启动时调用一次（可选）
export async function bootstrap(props) {
  // 初始化工作
  console.log('应用启动', props);
}

// 每次激活时调用
export async function mount(props) {
  // 挂载应用到 DOM
  console.log('应用挂载', props);
}

// 每次卸载时调用
export async function unmount(props) {
  // 清理资源，卸载应用
  console.log('应用卸载', props);
}
```

### 3. 启动 Single-SPA

```javascript
import { start } from 'single-spa';

start({
  urlRerouteOnly: true  // 只在 URL 改变时重新路由
});
```

## 🚀 运行项目

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

项目将在 http://localhost:8080 启动

### 3. 体验功能

- 点击导航栏中的不同链接切换微应用
- 观察浏览器控制台中的生命周期日志
- 体验每个微应用的独特功能：
  - **React 应用**：计数器和实时时间
  - **Vue 应用**：响应式表单和待办事项
  - **原生 JS 应用**：动态图表和主题切换

## 📋 技术实现要点

### 1. 路由管理

Single-SPA 基于路由来管理微应用的激活和卸载：

```javascript
// 不同的 activeWhen 配置方式
activeWhen: '/react-app'              // 精确匹配
activeWhen: ['/app1', '/app2']        // 多路径匹配
activeWhen: (location) => location.pathname.startsWith('/admin')  // 函数判断
```

### 2. 应用间通信

```javascript
// 使用自定义事件进行通信
window.dispatchEvent(new CustomEvent('app-communication', {
  detail: { message: 'Hello from micro app' }
}));

// 监听事件
window.addEventListener('app-communication', (event) => {
  console.log(event.detail.message);
});
```

### 3. 资源隔离

- **样式隔离**：使用 CSS Modules 或 styled-components
- **JavaScript 隔离**：避免全局变量污染
- **状态隔离**：每个应用维护自己的状态

## 🔍 Single-SPA vs 其他方案

### 优势

- 🎯 **纯前端解决方案**：不需要服务端配合
- 🔧 **配置简单**：API 简洁，上手容易  
- 🚀 **性能好**：运行时动态加载，按需激活
- 🔄 **技术栈灵活**：支持任意前端技术栈

### 适用场景

- 大型单页应用的拆分
- 多团队协作开发
- 渐进式微前端改造
- 技术栈多样化的项目

## 🛠️ 最佳实践

### 1. 应用拆分原则

- 按业务功能拆分
- 按团队职责拆分
- 避免过度拆分

### 2. 依赖管理

```javascript
// 共享依赖配置
const importMap = {
  "react": "https://unpkg.com/react@17/umd/react.production.min.js",
  "react-dom": "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"
};
```

### 3. 错误处理

```javascript
registerApplication({
  name: 'my-app',
  app: () => System.import('./app').catch(err => {
    console.error('加载应用失败:', err);
    // 返回降级应用
    return import('./fallback-app');
  }),
  activeWhen: '/my-app'
});
```

## 🔮 扩展功能

- **应用预加载**：提前加载可能需要的应用
- **CSS 隔离**：使用 Shadow DOM 或 CSS-in-JS
- **状态共享**：通过事件总线或状态管理库
- **错误边界**：优雅处理微应用错误

## 📚 相关资源

- [Single-SPA 官方文档](https://single-spa.js.org/)
- [微前端实践指南](https://micro-frontends.org/)
- [Single-SPA GitHub](https://github.com/single-spa/single-spa)

---

这个 Demo 展示了 Single-SPA 的核心功能和实现方式，为您深入理解微前端架构提供了实践基础。 