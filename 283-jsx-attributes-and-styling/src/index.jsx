import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

// 封装IntersectionObserver逻辑到一个组件中
function FoodList() {
  const containerRef = useRef(null);
  const baconRef = useRef(null);
  const [observer, setObserver] = useState(null);

  const itemStyle = {
    color: 'blue',
    fontSize: '20px',
    height: '40px',
  }

  const showContainerStyle = {
    backgroundColor: 'yellow',
    padding: '10px',
    border: '1px solid black',
    height: '100px',
    overflow: 'scroll',
  }

  // 在组件挂载后创建观察者
  useEffect(() => {
    if (containerRef.current && baconRef.current) {
      console.log('创建观察者和设置观察目标');

      const options = {
        threshold: 1,
        rootMargin: '0px',
        root: containerRef.current // 使用容器作为root
      };

      // 创建观察者实例
      const observerInstance = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 如果元素在可视区域内，则设置背景颜色为绿色
            console.log('元素在可视区域内');
            entry.target.style.backgroundColor = 'green';
          } else {
            // 如果元素不在可视区域内，则设置背景颜色为红色
            console.log('元素不在可视区域内');
            entry.target.style.backgroundColor = 'red';
          }
        });
      }, options);

      // 开始观察
      observerInstance.observe(baconRef.current);
      setObserver(observerInstance);

      // 组件卸载时清理
      return () => {
        observerInstance.disconnect();
      };
    }
  }, [containerRef.current, baconRef.current]);

  return (
    <div style={showContainerStyle} ref={containerRef}>
      {/* 在JSX中，class属性被写成className，html的属性都需要使用驼峰命名法 */}
      <h1 className="heading" contentEditable="true" spellCheck="false">My Favourite Foods</h1>
      <ul>
        {/* 在JSX中，style属性需要使用驼峰命名法 */}
        {/* 行内样式也需要按照js的语法来写 */}
        <li style={itemStyle} ref={baconRef}>Bacon</li>
        <li style={itemStyle}>Jamon</li>
        <li style={itemStyle}>Noodles</li>
      </ul>
    </div>
  );
}

ReactDOM.render(
  <FoodList />,
  document.getElementById("root")
);

// If you're running this locally in VS Code use the commands:
// npm install
// to install the node modules and
// npm run dev
// to launch your react project in your browser
