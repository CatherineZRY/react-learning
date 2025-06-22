import React from 'react';
import { createRoot } from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import App from './App.jsx';
import './index.css';

// 错误边界组件
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React 微应用错误:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          background: '#f8d7da',
          color: '#721c24',
          borderRadius: '8px',
          margin: '20px'
        }}>
          <h3>⚠️ React 微应用发生错误</h3>
          <p><strong>错误信息:</strong> {this.state.error?.message}</p>
          <details>
            <summary>详细错误信息</summary>
            <pre>{this.state.error?.stack}</pre>
          </details>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '8px 16px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 包装后的应用组件
const WrappedApp = (props) => (
  <ErrorBoundary>
    <App {...props} />
  </ErrorBoundary>
);

// Single-SPA 生命周期配置
const lifecycles = singleSpaReact({
  React,
  ReactDOM: { createRoot }, // 使用新的 createRoot API
  rootComponent: WrappedApp,
  errorBoundary: (err, info, props) => (
    <div style={{
      padding: '20px',
      background: '#f8d7da',
      color: '#721c24',
      borderRadius: '8px',
      margin: '20px'
    }}>
      <h3>⚠️ Single-SPA 错误边界</h3>
      <p><strong>错误:</strong> {err.message}</p>
      <p><strong>应用:</strong> @company/react-micro-app</p>
      <details>
        <summary>错误详情</summary>
        <pre>{JSON.stringify(info, null, 2)}</pre>
      </details>
    </div>
  ),
  // 自定义渲染函数，支持 React 18
  renderFunction: (reactElement, domElement) => {
    if (!domElement._reactRoot) {
      domElement._reactRoot = createRoot(domElement);
    }
    domElement._reactRoot.render(reactElement);
  },
  // 自定义卸载函数
  unmountFunction: (domElement) => {
    if (domElement._reactRoot) {
      domElement._reactRoot.unmount();
      delete domElement._reactRoot;
    }
  }
});

// 导出 Single-SPA 生命周期函数
export const { bootstrap, mount, unmount } = lifecycles;

// 开发环境支持：如果不在 Single-SPA 环境中，直接渲染应用
if (import.meta.env.DEV && !window.singleSpaNavigate) {
  console.log('🔧 检测到开发环境，独立运行模式');

  const rootElement = document.getElementById('root');
  if (rootElement && !rootElement._reactRoot) {
    const root = createRoot(rootElement);
    root.render(<WrappedApp />);
    console.log('✅ React 应用已在独立模式下启动');
  }
}

// 导出应用信息（用于调试）
export const appInfo = {
  name: '@company/react-micro-app',
  version: '1.0.0',
  buildTool: 'Vite',
  framework: 'React',
  format: 'SystemJS'
};

// 在开发环境中暴露到全局对象，便于调试
if (import.meta.env.DEV) {
  window.__REACT_MICRO_APP__ = {
    ...appInfo,
    lifecycles,
    component: WrappedApp
  };
} 