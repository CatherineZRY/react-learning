import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

// 主应用组件
function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [messages, setMessages] = useState([]);

  // 监听来自其他微应用的消息
  useEffect(() => {
    const handleCustomEvent = (event) => {
      const { type, data, from } = event.detail;
      const newMessage = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        type,
        data,
        from
      };
      setMessages(prev => [newMessage, ...prev.slice(0, 9)]); // 保留最新10条消息
    };

    // 监听用户登录事件
    window.addEventListener('user-login', handleCustomEvent);
    window.addEventListener('user-logout', handleCustomEvent);
    window.addEventListener('micro-app-message', handleCustomEvent);

    return () => {
      window.removeEventListener('user-login', handleCustomEvent);
      window.removeEventListener('user-logout', handleCustomEvent);
      window.removeEventListener('micro-app-message', handleCustomEvent);
    };
  }, []);

  // 发送消息到其他微应用
  const sendMessage = (type, data) => {
    window.dispatchEvent(new CustomEvent(type, {
      detail: {
        type,
        data,
        from: '@company/react-micro-app',
        timestamp: new Date().toISOString()
      }
    }));
  };

  // 模拟用户登录
  const handleLogin = () => {
    const user = {
      id: 123,
      name: 'React用户',
      email: 'react@example.com',
      role: 'admin'
    };
    setUserInfo(user);
    sendMessage('user-login', user);
  };

  // 模拟用户登出
  const handleLogout = () => {
    setUserInfo(null);
    sendMessage('user-logout', { message: 'React用户已登出' });
  };

  return (
    <Router basename="/react-app">
      <div style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px'
      }}>
        <AppHeader userInfo={userInfo} onLogin={handleLogin} onLogout={handleLogout} />
        <AppNavigation />
        <AppRoutes sendMessage={sendMessage} />
        <MessagePanel messages={messages} />
      </div>
    </Router>
  );
}

// 应用头部
function AppHeader({ userInfo, onLogin, onLogout }) {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h1 style={{ margin: '0 0 10px 0' }}>⚛️ React 微应用</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0 }}>
          这是一个使用 SystemJS 构建的 React 微前端应用
        </p>
        <div>
          {userInfo ? (
            <div style={{ textAlign: 'right' }}>
              <span>欢迎, {userInfo.name}!</span>
              <button
                onClick={onLogout}
                style={{
                  marginLeft: '10px',
                  padding: '5px 10px',
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                登出
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              style={{
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              登录
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

// 导航组件
function AppNavigation() {
  const location = useLocation();

  const navStyle = {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    padding: '10px',
    background: '#f5f5f5',
    borderRadius: '6px'
  };

  const linkStyle = (isActive) => ({
    padding: '8px 16px',
    textDecoration: 'none',
    borderRadius: '4px',
    background: isActive ? '#2196f3' : 'transparent',
    color: isActive ? 'white' : '#333',
    border: isActive ? 'none' : '1px solid #ddd'
  });

  return (
    <nav style={navStyle}>
      <Link to="/" style={linkStyle(location.pathname === '/react-app/' || location.pathname === '/')}>
        首页
      </Link>
      <Link to="/products" style={linkStyle(location.pathname === '/react-app/products' || location.pathname === '/products')}>
        产品列表
      </Link>
      <Link to="/profile" style={linkStyle(location.pathname === '/react-app/profile' || location.pathname === '/profile')}>
        用户资料
      </Link>
      <Link to="/settings" style={linkStyle(location.pathname === '/react-app/settings' || location.pathname === '/settings')}>
        设置
      </Link>
    </nav>
  );
}

// 路由配置
function AppRoutes({ sendMessage }) {
  return (
    <main style={{ minHeight: '300px', marginBottom: '20px' }}>
      <Routes>
        <Route path="/" element={<HomePage sendMessage={sendMessage} />} />
        <Route path="/products" element={<ProductsPage sendMessage={sendMessage} />} />
        <Route path="/profile" element={<ProfilePage sendMessage={sendMessage} />} />
        <Route path="/settings" element={<SettingsPage sendMessage={sendMessage} />} />
      </Routes>
    </main>
  );
}

// 首页
function HomePage({ sendMessage }) {
  return (
    <div style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2>🏠 React 微应用首页</h2>
      <p>这是一个完整的 React 微前端应用示例，展示了以下特性：</p>
      <ul>
        <li>✅ 使用 SystemJS 格式构建</li>
        <li>✅ 支持 React Router 路由</li>
        <li>✅ 通过 CustomEvent 与其他微应用通信</li>
        <li>✅ 支持独立开发和生产部署</li>
        <li>✅ 完整的错误边界处理</li>
      </ul>
      <button
        onClick={() => sendMessage('micro-app-message', {
          message: '来自React应用首页的问候！',
          page: 'home'
        })}
        style={{
          padding: '10px 20px',
          background: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        发送消息给其他微应用
      </button>
    </div>
  );
}

// 产品页面
function ProductsPage({ sendMessage }) {
  const [products] = useState([
    { id: 1, name: 'React 组件库', price: '免费', description: '高质量的 React 组件' },
    { id: 2, name: 'SystemJS 打包工具', price: '¥299', description: '微前端构建解决方案' },
    { id: 3, name: 'Single-SPA 培训', price: '¥999', description: '专业的微前端培训课程' }
  ]);

  return (
    <div style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2>📦 产品列表</h2>
      <div style={{ display: 'grid', gap: '15px' }}>
        {products.map(product => (
          <div key={product.id} style={{
            padding: '15px',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            background: '#fafafa'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{product.name}</h3>
            <p style={{ margin: '0 0 10px 0', color: '#666' }}>{product.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold', color: '#4caf50' }}>{product.price}</span>
              <button
                onClick={() => sendMessage('product-selected', {
                  product: product,
                  from: 'react-products-page'
                })}
                style={{
                  padding: '6px 12px',
                  background: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                选择产品
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 用户资料页面
function ProfilePage({ sendMessage }) {
  const [profile, setProfile] = useState({
    name: 'React 开发者',
    email: 'developer@react.com',
    bio: '专注于微前端架构和 React 生态系统'
  });

  const handleSave = () => {
    sendMessage('profile-updated', {
      profile: profile,
      timestamp: new Date().toISOString()
    });
    alert('资料已保存并通知其他微应用！');
  };

  return (
    <div style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2>👤 用户资料</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>姓名:</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>邮箱:</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>简介:</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows={3}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              resize: 'vertical'
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            background: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          保存资料
        </button>
      </form>
    </div>
  );
}

// 设置页面
function SettingsPage({ sendMessage }) {
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    language: 'zh-CN'
  });

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    sendMessage('settings-changed', {
      settings: newSettings,
      changedKey: key,
      changedValue: value
    });
  };

  return (
    <div style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2>⚙️ 应用设置</h2>

      <div style={{ marginBottom: '20px' }}>
        <h3>主题设置</h3>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <input
              type="radio"
              name="theme"
              value="light"
              checked={settings.theme === 'light'}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              style={{ marginRight: '8px' }}
            />
            浅色主题
          </label>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={settings.theme === 'dark'}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              style={{ marginRight: '8px' }}
            />
            深色主题
          </label>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>通知设置</h3>
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) => handleSettingChange('notifications', e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          启用通知
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>语言设置</h3>
        <select
          value={settings.language}
          onChange={(e) => handleSettingChange('language', e.target.value)}
          style={{
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          <option value="zh-CN">中文 (简体)</option>
          <option value="zh-TW">中文 (繁体)</option>
          <option value="en-US">English</option>
          <option value="ja-JP">日本語</option>
        </select>
      </div>

      <div style={{
        padding: '15px',
        background: '#e3f2fd',
        borderRadius: '6px',
        border: '1px solid #2196f3'
      }}>
        <strong>💡 提示:</strong> 设置更改会自动通知其他微应用，实现跨应用的设置同步。
      </div>
    </div>
  );
}

// 消息面板
function MessagePanel({ messages }) {
  if (messages.length === 0) return null;

  return (
    <div style={{
      background: '#f5f5f5',
      padding: '15px',
      borderRadius: '8px',
      marginTop: '20px'
    }}>
      <h3 style={{ margin: '0 0 15px 0' }}>📨 微应用通信日志</h3>
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {messages.map(message => (
          <div key={message.id} style={{
            padding: '8px',
            margin: '5px 0',
            background: 'white',
            borderRadius: '4px',
            fontSize: '12px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ fontWeight: 'bold', color: '#2196f3' }}>
              [{message.timestamp}] {message.type}
            </div>
            <div style={{ color: '#666' }}>
              来源: {message.from}
            </div>
            <div style={{ marginTop: '4px' }}>
              {typeof message.data === 'object' ? JSON.stringify(message.data, null, 2) : message.data}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App; 