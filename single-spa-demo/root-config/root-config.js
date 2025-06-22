// Single-SPA 基座应用配置 - SystemJS 6.x 版本

// 等待DOM加载完成
const waitForElement = (selector) => {
  return new Promise((resolve) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
};

// 在DOM准备好后注册应用
const registerApps = async () => {
  console.log('开始注册 Single-SPA 应用...');

  // 确保Single-SPA已加载
  if (typeof singleSpa === 'undefined') {
    console.error('Single-SPA 未加载，请检查脚本引入');
    return;
  }

  console.log('✅ Single-SPA 已加载:', singleSpa);
  console.log('✅ SystemJS 已加载:', typeof System !== 'undefined');

  try {
    // 等待容器元素加载完成
    const containerElement = await waitForElement('#micro-frontend-container');
    console.log('✅ 容器元素已找到:', containerElement);

    // 注册 React 微应用
    singleSpa.registerApplication({
      name: 'react-app',
      app: async () => {
        console.log('正在加载 React 应用...');
        try {
          return await System.import('react-app');
        } catch (err) {
          console.error('加载 React 应用失败:', err);
          throw err;
        }
      },
      activeWhen: (location) => {
        const isActive = location.pathname.startsWith('/react-app');
        console.log('React 应用激活检查:', location.pathname, '→', isActive);
        return isActive;
      },
      customProps: {
        domElement: containerElement,
        title: 'React 微应用'
      }
    });
    console.log('✅ React 应用已注册');

    // 注册 Vue 微应用
    singleSpa.registerApplication({
      name: 'vue-app-test',
      app: async () => {
        console.log('正在加载 Vue 应用...');
        try {
          return await System.import('vue-app-test');
        } catch (err) {
          console.error('加载 Vue 应用失败:', err);
          throw err;
        }
      },
      activeWhen: (location) => {
        const isActive = location.pathname.startsWith('/vue-app');
        console.log('Vue 应用激活检查:', location.pathname, '→', isActive);
        return isActive;
      },
      customProps: {
        domElement: containerElement,
        title: 'Vue 微应用'
      }
    });
    console.log('✅ Vue 应用已注册');

    // 注册原生 JavaScript 微应用
    singleSpa.registerApplication({
      name: 'vanilla-app',
      app: async () => {
        console.log('正在加载原生 JS 应用...');
        try {
          return await System.import('vanilla-app');
        } catch (err) {
          console.error('加载原生 JS 应用失败:', err);
          throw err;
        }
      },
      activeWhen: (location) => {
        const isActive = location.pathname.startsWith('/vanilla-app');
        console.log('原生 JS 应用激活检查:', location.pathname, '→', isActive);
        return isActive;
      },
      customProps: {
        domElement: containerElement,
        title: '原生 JS 微应用'
      }
    });
    console.log('✅ 原生 JS 应用已注册');

    // 启动 Single-SPA
    singleSpa.start({
      urlRerouteOnly: true
    });
    console.log('🚀 Single-SPA 已启动');

    // 初始路由处理
    if (window.location.pathname === '/') {
      console.log('当前在根路径，准备跳转到默认应用');
      window.history.replaceState({}, '', '/react-app');
    }

    console.log('✅ Single-SPA 基座应用启动完成');
    console.log('已注册的微应用：', ['react-app', 'vue-app', 'vanilla-app']);

    // 显示当前应用状态
    setTimeout(() => {
      console.log('当前应用状态:', singleSpa.getAppStatus());
    }, 1000);

  } catch (error) {
    console.error('注册应用时出错:', error);
  }
};

// 监听DOM加载完成事件
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', registerApps);
} else {
  // DOM已经加载完成
  registerApps();
} 