# React No SSR Demo

## 项目介绍

本项目是一个 React CSR 的 Demo，用于演示 React CSR 和 SSR 的基本原理，配合这篇文章食用更佳：[《一起从零实现React SSR服务端渲染》](https://juejin.cn/post/7316097536548552743)。

## 快速开始

### 1. 安装依赖

```bash
# 建议使用 node v18.x 进行安装
npm install
```

### 2. 本地开发

```bash
npm run dev
```

注意：
csr渲染时脚本为：
webpack serve --config webpack\\client.config.js --mode development
ssr渲染时脚本为：
webpack serve --config webpack\\client.config.js --mode development

### 3. 构建

```bash
npm run build
```
