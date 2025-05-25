// If you're running this locally in VS Code use the commands:
// npm install
// to install the node modules and
// npm run dev
// to launch your react project in your browser
import React from 'react';
import ReactDOM from 'react-dom';

// 使用ReactDOM.render()渲染组件
// 在17.0版本中，ReactDOM.render()已经被弃用，推荐使用ReactDOM.render(element, container)
// 在18.0版本中，ReactDOM.render()已经被弃用，推荐使用ReactDOM.createRoot(container).render(element)
ReactDOM.render(
  // 第一个参数：要渲染的元素（只允许加载一个根元素）
  <div>
    <h1>Hello, world!</h1>
    <p>This is a paragraph.</p>
  </div>,
  // 第二个参数：要渲染到的容器
  document.getElementById('root')
);

