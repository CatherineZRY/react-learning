# 🚀 Single-SPA 生产环境部署指南

## 📋 真实项目架构

### 1. 典型的微前端部署架构

```
生产环境架构：

┌─────────────────────────────────────────────────────────────┐
│                    CDN / 静态资源服务                          │
│  https://cdn.example.com/                                 │
├─────────────────────────────────────────────────────────────┤
│  ├── shell/                     (基座应用)                  │
│  │   ├── index.html                                        │
│  │   ├── shell.js                                          │
│  │   └── importmap.json                                    │
│  ├── react-app/                 (React 微应用)             │
│  │   ├── main.js                                           │
│  │   ├── main.css                                          │
│  │   └── chunk-vendors.js                                  │
│  ├── vue-app/                   (Vue 微应用)               │
│  │   ├── main.js                                           │
│  │   ├── main.css                                          │
│  │   └── chunk-vendors.js                                  │
│  └── angular-app/               (Angular 微应用)           │
│      ├── main.js                                           │
│      ├── main.css                                          │
│      └── polyfills.js                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    反向代理 (Nginx)                          │
│  https://app.example.com/                                 │
├─────────────────────────────────────────────────────────────┤
│  ├── /                          → CDN shell 应用           │
│  ├── /react-app/*               → CDN react-app           │
│  ├── /vue-app/*                 → CDN vue-app             │
│  ├── /angular-app/*             → CDN angular-app         │
│  └── /api/*                     → 后端 API 服务           │
└─────────────────────────────────────────────────────────────┘
```

### 2. 各微应用的独立构建和部署

#### React 微应用 (独立仓库)
```bash
# react-micro-app/
├── package.json
├── webpack.config.js           # 配置 SystemJS 输出
├── src/
│   ├── index.js               # 入口文件
│   ├── App.jsx
│   └── bootstrap.js           # Single-SPA 生命周期
└── dist/                      # 构建输出
    ├── main.js                # SystemJS 格式
    └── main.css
```

#### Vue 微应用 (独立仓库)
```bash
# vue-micro-app/
├── package.json
├── vue.config.js              # 配置 SystemJS 输出
├── src/
│   ├── main.js               # 入口文件
│   ├── App.vue
│   └── single-spa-config.js   # Single-SPA 生命周期
└── dist/                      # 构建输出
    ├── main.js                # SystemJS 格式
    └── main.css
```

## 🔧 SystemJS Register 的真实实现

### 1. React 微应用的实际构建配置

#### webpack.config.js (React 微应用)
```javascript
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => ({
  mode: argv.mode || 'development',
  entry: './src/index.js',
  
  // 关键配置：输出为 SystemJS 格式
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'system',  // 输出 SystemJS 格式
    clean: true
  },
  
  externals: {
    // 外部依赖，由基座应用提供
    'react': 'react',
    'react-dom': 'react-dom',
    'single-spa': 'single-spa'
  },
  
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  
  plugins: [
    new CleanWebpackPlugin()
  ]
});
```

#### src/index.js (React 微应用入口)
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import App from './App';

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: App,
  errorBoundary(err, info, props) {
    return <div>Error in React App: {err.message}</div>;
  }
});

// 导出 Single-SPA 生命周期函数
export const { bootstrap, mount, unmount } = lifecycles;
```

### 2. 构建后的实际输出

#### 构建后的 main.js (简化版本)
```javascript
System.register(['react', 'react-dom', 'single-spa-react'], function (exports) {
  'use strict';
  
  var React, ReactDOM, singleSpaReact;
  
  return {
    setters: [
      function (module) {
        React = module.default || module;
      },
      function (module) {
        ReactDOM = module.default || module;
      },
      function (module) {
        singleSpaReact = module.default || module;
      }
    ],
    execute: function () {
      // 应用组件代码
      const App = function() {
        return React.createElement('div', null, 
          React.createElement('h1', null, 'React 微应用'),
          React.createElement('p', null, '这是一个独立构建的 React 微应用')
        );
      };
      
      // Single-SPA 生命周期配置
      const lifecycles = singleSpaReact({
        React,
        ReactDOM,
        rootComponent: App,
        errorBoundary: function(err, info, props) {
          return React.createElement('div', null, 'Error: ' + err.message);
        }
      });
      
      // 导出生命周期函数
      exports('bootstrap', lifecycles.bootstrap);
      exports('mount', lifecycles.mount);
      exports('unmount', lifecycles.unmount);
    }
  };
});
```

### 3. 基座应用的 Import Map 配置

#### importmap.json (动态加载配置)
```json
{
  "imports": {
    "react": "https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js",
    "react-dom": "https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js",
    "single-spa": "https://cdn.jsdelivr.net/npm/single-spa@5/lib/system/single-spa.min.js",
    "single-spa-react": "https://cdn.jsdelivr.net/npm/single-spa-react@5/lib/system/single-spa-react.min.js",
    
    "@company/react-app": "https://cdn.example.com/react-app/main.js",
    "@company/vue-app": "https://cdn.example.com/vue-app/main.js",
    "@company/angular-app": "https://cdn.example.com/angular-app/main.js"
  }
}
```

#### 基座应用的注册 (root-config.js)
```javascript
import { registerApplication, start } from 'single-spa';

// 注册 React 微应用
registerApplication({
  name: '@company/react-app',
  app: () => System.import('@company/react-app'),  // 动态导入
  activeWhen: ['/react-app'],
  customProps: {
    apiBase: 'https://api.example.com',
    theme: 'dark'
  }
});

// 注册 Vue 微应用
registerApplication({
  name: '@company/vue-app',
  app: () => System.import('@company/vue-app'),   // 动态导入
  activeWhen: ['/vue-app'],
  customProps: {
    apiBase: 'https://api.example.com',
    locale: 'zh-CN'
  }
});

// 启动 Single-SPA
start({
  urlRerouteOnly: true
});
```

## 🚀 CI/CD 部署流程

### 1. 各微应用的独立部署

#### React 微应用的 CI/CD
```yaml
# .github/workflows/react-app-deploy.yml
name: Deploy React Micro App

on:
  push:
    branches: [main]
    paths: ['react-micro-app/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd react-micro-app
          npm ci
          
      - name: Build
        run: |
          cd react-micro-app
          npm run build
          
      - name: Deploy to CDN
        run: |
          # 上传到 CDN 或静态文件服务
          aws s3 sync react-micro-app/dist/ s3://cdn-bucket/react-app/
          
      - name: Update Import Map
        run: |
          # 更新 Import Map 中的版本信息
          curl -X POST https://api.example.com/importmap/update \
            -d '{"app": "@company/react-app", "url": "https://cdn.example.com/react-app/main.js?v='$(date +%s)'"}'
```

### 2. 版本管理和回滚

#### 版本化的 Import Map
```json
{
  "imports": {
    "@company/react-app": "https://cdn.example.com/react-app/v1.2.3/main.js",
    "@company/vue-app": "https://cdn.example.com/vue-app/v2.1.0/main.js",
    "@company/angular-app": "https://cdn.example.com/angular-app/v1.0.5/main.js"
  }
}
```

## 🔧 开发环境 vs 生产环境

### 开发环境
```javascript
// 本地开发时的 Import Map
{
  "imports": {
    "@company/react-app": "http://localhost:3001/main.js",
    "@company/vue-app": "http://localhost:3002/main.js",
    "@company/angular-app": "http://localhost:3003/main.js"
  }
}
```

### 生产环境
```javascript
// 生产环境的 Import Map
{
  "imports": {
    "@company/react-app": "https://cdn.example.com/react-app/main.js",
    "@company/vue-app": "https://cdn.example.com/vue-app/main.js",
    "@company/angular-app": "https://cdn.example.com/angular-app/main.js"
  }
}
```

## 💡 最佳实践

### 1. 构建优化
- 使用 Webpack 的 `externals` 避免重复打包公共依赖
- 启用代码分割和懒加载
- 使用 CDN 加速静态资源加载

### 2. 版本管理
- 每个微应用独立版本控制
- 使用语义化版本号
- 支持灰度发布和快速回滚

### 3. 监控和调试
- 集成错误监控 (Sentry)
- 性能监控和分析
- 开发环境的调试工具

### 4. 安全考虑
- CSP (Content Security Policy) 配置
- 资源完整性校验 (SRI)
- HTTPS 和安全头配置

这就是真实微前端项目的完整架构和部署方式！ 