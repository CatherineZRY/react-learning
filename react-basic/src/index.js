// 项目入口

// React必要的两个核心包
import React from 'react';
import ReactDOM from 'react-dom/client';

// 导入根组件
import App from './App';

// 把App渲染到id为root（真实位置在public文件夹的index.html中）的dom节点上
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
  // 开启严格模式
  // <React.StrictMode> 
  //   <App />
  // </React.StrictMode>
);

