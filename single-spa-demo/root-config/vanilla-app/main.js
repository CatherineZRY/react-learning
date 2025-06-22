// 原生 JavaScript 微应用 - SystemJS 6.x 兼容版本
System.register([], function (exports) {
  'use strict';

  let vanillaRootComponent = null;
  let chartInterval = null;
  let chartData = [];

  // Single-SPA 生命周期函数：bootstrap
  async function bootstrap(props) {
    console.log('⚡ 原生 JS 微应用正在启动...', props);
    return Promise.resolve();
  }

  // Single-SPA 生命周期函数：mount
  async function mount(props) {
    console.log('🔧 原生 JS 微应用正在挂载...', props);

    // 初始化图表数据
    chartData = [
      { name: '性能', value: 85 },
      { name: '用户体验', value: 92 },
      { name: '功能完整性', value: 78 },
      { name: '代码质量', value: 88 }
    ];

    // 创建原生 JS 应用的 HTML 结构
    const appContainer = document.createElement('div');
    appContainer.id = 'vanilla-micro-app';
    appContainer.innerHTML = `
        <div style="
            padding: 20px;
            background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%);
            border-radius: 10px;
            color: white;
            margin-bottom: 20px;
        ">
            <h2>⚡ 原生 JavaScript 微应用 (SystemJS 6.x 兼容版)</h2>
            <p>这是使用 SystemJS 6.x System.register 格式开发的原生 JavaScript 微应用</p>
            <div style="margin-top: 20px;">
                <h3>技术特性：</h3>
                <ul>
                    <li>✅ SystemJS 6.x System.register 格式</li>
                    <li>✅ 浏览器原生支持，无需转译</li>
                    <li>✅ const/let 块级作用域</li>
                    <li>✅ 箭头函数</li>
                    <li>✅ 模板字符串</li>
                    <li>✅ 解构赋值</li>
                    <li>✅ async/await</li>
                    <li>✅ 可选链操作符</li>
                    <li>✅ 无框架依赖</li>
                </ul>
            </div>
            
            <div style="margin-top: 20px;">
                <h4>主题切换：</h4>
                <div style="margin-bottom: 15px;">
                    <button id="theme-light" style="
                        background: rgba(255,255,255,0.2);
                        border: 2px solid white;
                        color: white;
                        padding: 8px 16px;
                        border-radius: 4px;
                        margin-right: 10px;
                        cursor: pointer;
                    ">浅色主题</button>
                    <button id="theme-dark" style="
                        background: rgba(255,255,255,0.2);
                        border: 2px solid white;
                        color: white;
                        padding: 8px 16px;
                        border-radius: 4px;
                        margin-right: 10px;
                        cursor: pointer;
                    ">深色主题</button>
                    <button id="theme-colorful" style="
                        background: rgba(255,255,255,0.8);
                        border: 2px solid white;
                        color: #333;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                    ">彩色主题</button>
                </div>
                <p style="font-size: 14px; opacity: 0.8;">
                    当前主题: <span id="current-theme">彩色主题</span>
                </p>
            </div>
            
            <div style="margin-top: 20px;">
                <h4>动态数据图表：</h4>
                <div id="chart-container" style="
                    background: rgba(255,255,255,0.1);
                    padding: 15px;
                    border-radius: 8px;
                    margin: 10px 0;
                ">
                    <div id="chart-bars"></div>
                    <p style="font-size: 12px; margin-top: 10px; opacity: 0.7;">
                        数据每3秒自动更新
                    </p>
                </div>
            </div>
            
            <div style="margin-top: 20px;">
                <h4>计数器功能：</h4>
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin: 10px 0;
                ">
                    <button id="counter-decrease" style="
                        background: rgba(255,255,255,0.2);
                        border: 2px solid white;
                        color: white;
                        padding: 8px 12px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 18px;
                    ">-</button>
                    <span id="counter-display" style="
                        background: rgba(255,255,255,0.2);
                        padding: 8px 20px;
                        border-radius: 4px;
                        font-size: 24px;
                        font-weight: bold;
                        min-width: 60px;
                        text-align: center;
                    ">0</span>
                    <button id="counter-increase" style="
                        background: rgba(255,255,255,0.2);
                        border: 2px solid white;
                        color: white;
                        padding: 8px 12px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 18px;
                    ">+</button>
                    <button id="counter-reset" style="
                        background: rgba(255,255,255,0.2);
                        border: 2px solid white;
                        color: white;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        margin-left: 10px;
                    ">重置</button>
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
      counter: 0,
      theme: 'colorful'
    };

    // 使用解构赋值获取 DOM 元素
    const counterDisplay = document.getElementById('counter-display');
    const counterIncrease = document.getElementById('counter-increase');
    const counterDecrease = document.getElementById('counter-decrease');
    const counterReset = document.getElementById('counter-reset');
    const themeLightBtn = document.getElementById('theme-light');
    const themeDarkBtn = document.getElementById('theme-dark');
    const themeColorfulBtn = document.getElementById('theme-colorful');
    const currentThemeSpan = document.getElementById('current-theme');
    const chartBars = document.getElementById('chart-bars');

    // 渲染图表 - 使用箭头函数
    const renderChart = () => {
      if (chartBars) {
        chartBars.innerHTML = chartData.map(item => `
                <div style="
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;
                ">
                    <span style="
                        width: 80px;
                        font-size: 12px;
                        color: rgba(255,255,255,0.9);
                    ">${item.name}:</span>
                    <div style="
                        flex: 1;
                        height: 20px;
                        background: rgba(255,255,255,0.2);
                        border-radius: 10px;
                        margin: 0 10px;
                        position: relative;
                        overflow: hidden;
                    ">
                        <div style="
                            height: 100%;
                            width: ${item.value}%;
                            background: linear-gradient(90deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.8) 100%);
                            border-radius: 10px;
                            transition: width 0.3s ease;
                        "></div>
                    </div>
                    <span style="
                        width: 35px;
                        font-size: 12px;
                        color: rgba(255,255,255,0.9);
                    ">${item.value}%</span>
                </div>
            `).join('');
      }
    };

    // 更新计数器显示 - 使用箭头函数
    const updateCounter = () => {
      if (counterDisplay) {
        counterDisplay.textContent = state.counter;
      }
    };

    // 主题切换函数 - 使用箭头函数
    const switchTheme = (theme) => {
      state.theme = theme;
      if (currentThemeSpan) {
        const themeNames = {
          light: '浅色主题',
          dark: '深色主题',
          colorful: '彩色主题'
        };
        currentThemeSpan.textContent = themeNames[theme];
      }

      const container = appContainer.querySelector('div');
      if (container) {
        const gradients = {
          light: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          dark: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
          colorful: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)'
        };

        const textColors = {
          light: '#333',
          dark: 'white',
          colorful: 'white'
        };

        container.style.background = gradients[theme];
        container.style.color = textColors[theme];
      }
    };

    // 事件处理函数 - 使用箭头函数
    const handleCounterIncrease = () => {
      state.counter++;
      updateCounter();
    };

    const handleCounterDecrease = () => {
      state.counter--;
      updateCounter();
    };

    const handleCounterReset = () => {
      state.counter = 0;
      updateCounter();
    };

    const handleThemeLight = () => switchTheme('light');
    const handleThemeDark = () => switchTheme('dark');
    const handleThemeColorful = () => switchTheme('colorful');

    // 添加事件监听 - 使用现代语法和可选链
    counterIncrease?.addEventListener('click', handleCounterIncrease);
    counterDecrease?.addEventListener('click', handleCounterDecrease);
    counterReset?.addEventListener('click', handleCounterReset);
    themeLightBtn?.addEventListener('click', handleThemeLight);
    themeDarkBtn?.addEventListener('click', handleThemeDark);
    themeColorfulBtn?.addEventListener('click', handleThemeColorful);

    // 启动图表数据自动更新 - 使用箭头函数
    chartInterval = setInterval(() => {
      chartData = chartData.map(item => ({
        name: item.name,
        value: Math.max(20, Math.min(100, item.value + (Math.random() - 0.5) * 20))
      }));
      renderChart();
    }, 3000);

    // 初始渲染
    renderChart();
    updateCounter();

    // 保存组件引用
    vanillaRootComponent = {
      appContainer,
      state,
      elements: {
        counterDisplay,
        counterIncrease,
        counterDecrease,
        counterReset,
        themeLightBtn,
        themeDarkBtn,
        themeColorfulBtn,
        currentThemeSpan,
        chartBars
      },
      handlers: {
        handleCounterIncrease,
        handleCounterDecrease,
        handleCounterReset,
        handleThemeLight,
        handleThemeDark,
        handleThemeColorful
      },
      cleanup: () => {
        // 清理事件监听器
        counterIncrease?.removeEventListener('click', handleCounterIncrease);
        counterDecrease?.removeEventListener('click', handleCounterDecrease);
        counterReset?.removeEventListener('click', handleCounterReset);
        themeLightBtn?.removeEventListener('click', handleThemeLight);
        themeDarkBtn?.removeEventListener('click', handleThemeDark);
        themeColorfulBtn?.removeEventListener('click', handleThemeColorful);

        // 清理定时器
        if (chartInterval) {
          clearInterval(chartInterval);
          chartInterval = null;
        }
      }
    };

    console.log('✅ 原生 JS 微应用挂载完成');
    return Promise.resolve();
  }

  // Single-SPA 生命周期函数：unmount
  async function unmount(props) {
    console.log('🔄 原生 JS 微应用正在卸载...', props);

    // 清理资源
    if (vanillaRootComponent) {
      vanillaRootComponent.cleanup();
      vanillaRootComponent.appContainer?.remove();
      vanillaRootComponent = null;
    }

    // 清理定时器
    if (chartInterval) {
      clearInterval(chartInterval);
      chartInterval = null;
    }

    // 清空容器
    if (props.domElement) {
      props.domElement.innerHTML = '<div class="loading">🚀 正在加载微前端应用...</div>';
    }

    console.log('✅ 原生 JS 微应用卸载完成');
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