// React 微应用 - SystemJS 6.x 兼容版本
System.register([], function (exports) {
  'use strict';

  let reactRootComponent = null;
  let timeInterval = null;

  // Single-SPA 生命周期函数：bootstrap
  async function bootstrap(props) {
    console.log('⚛️ React 微应用正在启动...', props);
    return Promise.resolve();
  }

  // Single-SPA 生命周期函数：mount
  async function mount(props) {
    console.log('🔧 React 微应用正在挂载...', props);

    // 创建 React 应用的 HTML 结构
    const appContainer = document.createElement('div');
    appContainer.id = 'react-micro-app';
    appContainer.innerHTML = `
        <div style="
            padding: 20px;
            background: linear-gradient(135deg, #61dafb 0%, #21232a 100%);
            border-radius: 10px;
            color: white;
            margin-bottom: 20px;
        ">
            <h2>⚛️ React 微应用 (SystemJS 6.x 兼容版)</h2>
            <p>这是使用 SystemJS 6.x System.register 格式开发的 React 微应用</p>
            <div style="margin-top: 20px;">
                <h3>技术特性：</h3>
                <ul>
                    <li>✅ SystemJS 6.x System.register 格式</li>
                    <li>✅ 浏览器原生支持，无需转译</li>
                    <li>✅ const/let 块级作用域</li>
                    <li>✅ 箭头函数</li>
                    <li>✅ 模板字符串</li>
                    <li>✅ async/await</li>
                    <li>✅ 解构赋值</li>
                    <li>✅ 可选链操作符</li>
                </ul>
            </div>
            <div style="margin-top: 20px;">
                <h4>计数器功能：</h4>
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin: 15px 0;
                ">
                    <button id="react-decrease" style="
                        background: rgba(255,255,255,0.2);
                        border: 2px solid white;
                        color: white;
                        padding: 10px 15px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 18px;
                        transition: all 0.3s ease;
                    ">-</button>
                    <span id="react-counter" style="
                        background: rgba(255,255,255,0.2);
                        padding: 10px 25px;
                        border-radius: 6px;
                        font-size: 28px;
                        font-weight: bold;
                        min-width: 80px;
                        text-align: center;
                    ">0</span>
                    <button id="react-increase" style="
                        background: rgba(255,255,255,0.2);
                        border: 2px solid white;
                        color: white;
                        padding: 10px 15px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 18px;
                        transition: all 0.3s ease;
                    ">+</button>
                    <button id="react-reset" style="
                        background: rgba(255,255,255,0.2);
                        border: 2px solid white;
                        color: white;
                        padding: 10px 20px;
                        border-radius: 6px;
                        cursor: pointer;
                        margin-left: 15px;
                        transition: all 0.3s ease;
                    ">重置</button>
                </div>
            </div>
            <div style="margin-top: 20px;">
                <h4>实时时间：</h4>
                <div style="
                    background: rgba(255,255,255,0.1);
                    padding: 15px;
                    border-radius: 8px;
                    margin: 10px 0;
                ">
                    <p style="font-size: 24px; margin: 0; font-family: 'Courier New', monospace;">
                        <span id="react-time">${new Date().toLocaleTimeString('zh-CN')}</span>
                    </p>
                    <p style="font-size: 14px; margin: 5px 0 0 0; opacity: 0.8;">
                        每秒自动更新
                    </p>
                </div>
            </div>
            <div style="margin-top: 15px; font-size: 12px; opacity: 0.7;">
                <p>应用状态: <span style="color: #4CAF50;">✅ 运行中</span></p>
                <p>挂载时间: ${new Date().toLocaleTimeString('zh-CN')}</p>
                <p>模块格式: SystemJS 6.x System.register</p>
            </div>
        </div>
    `;

    // 挂载到容器
    if (props.domElement) {
      props.domElement.innerHTML = '';
      props.domElement.appendChild(appContainer);
    }

    // 应用状态 - 使用现代语法
    const state = {
      counter: 0
    };

    // 使用解构赋值获取 DOM 元素
    const counterDisplay = document.getElementById('react-counter');
    const increaseBtn = document.getElementById('react-increase');
    const decreaseBtn = document.getElementById('react-decrease');
    const resetBtn = document.getElementById('react-reset');
    const timeDisplay = document.getElementById('react-time');

    // 更新计数器显示
    const updateCounter = () => {
      if (counterDisplay) {
        counterDisplay.textContent = state.counter;
      }
    };

    // 更新时间显示
    const updateTime = () => {
      if (timeDisplay) {
        timeDisplay.textContent = new Date().toLocaleTimeString('zh-CN');
      }
    };

    // 事件处理函数 - 使用箭头函数
    const handleIncrease = () => {
      state.counter++;
      updateCounter();
    };

    const handleDecrease = () => {
      state.counter--;
      updateCounter();
    };

    const handleReset = () => {
      state.counter = 0;
      updateCounter();
    };

    // 添加事件监听 - 使用现代语法
    increaseBtn?.addEventListener('click', handleIncrease);
    decreaseBtn?.addEventListener('click', handleDecrease);
    resetBtn?.addEventListener('click', handleReset);

    // 启动时间更新定时器
    timeInterval = setInterval(updateTime, 1000);

    // 初始化显示
    updateCounter();
    updateTime();

    // 保存组件引用
    reactRootComponent = {
      appContainer,
      state,
      elements: {
        counterDisplay,
        increaseBtn,
        decreaseBtn,
        resetBtn,
        timeDisplay
      },
      handlers: {
        handleIncrease,
        handleDecrease,
        handleReset
      },
      cleanup: () => {
        // 清理事件监听器
        increaseBtn?.removeEventListener('click', handleIncrease);
        decreaseBtn?.removeEventListener('click', handleDecrease);
        resetBtn?.removeEventListener('click', handleReset);

        // 清理定时器
        if (timeInterval) {
          clearInterval(timeInterval);
          timeInterval = null;
        }
      }
    };

    console.log('✅ React 微应用挂载完成');
    return Promise.resolve();
  }

  // Single-SPA 生命周期函数：unmount
  async function unmount(props) {
    console.log('🔄 React 微应用正在卸载...', props);

    // 清理资源
    if (reactRootComponent) {
      reactRootComponent.cleanup();
      reactRootComponent.appContainer?.remove();
      reactRootComponent = null;
    }

    // 清理定时器
    if (timeInterval) {
      clearInterval(timeInterval);
      timeInterval = null;
    }

    // 清空容器
    if (props.domElement) {
      props.domElement.innerHTML = '<div class="loading">🚀 正在加载微前端应用...</div>';
    }

    console.log('✅ React 微应用卸载完成');
    return Promise.resolve();
  }

  // SystemJS 6.x 导出格式
  return {
    execute: function () {
      exports('bootstrap', bootstrap);
      exports('mount', mount);
      exports('unmount', unmount);
    }
  };
}); 