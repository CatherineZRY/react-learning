# Zustand 状态管理指南

## 简介

Zustand 是一个轻量级的 React 状态管理库，它提供了简单、直观的状态管理解决方案。与 Redux 和 Context API 相比，Zustand 具有更少的模板代码、更好的性能和更简单的使用方式。

### 主要特点

- **轻量级**：体积仅约 1KB，无依赖
- **零模板代码**：无需 Provider 包装，无需 reducer 和 action
- **TypeScript 友好**：完全支持 TypeScript
- **React 外可用**：可以在 React 组件外访问和修改状态
- **性能优化**：通过选择器精确控制组件重渲染
- **灵活扩展**：支持中间件和自定义功能

## 安装

```bash
npm install zustand
# 或
yarn add zustand
# 或
pnpm add zustand
```

## 基本使用

### 1. 创建 Store

```javascript
import { create } from 'zustand';

const useStore = create((set) => ({
  // 状态
  count: 0,
  user: null,
  
  // 修改状态的方法
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setUser: (user) => set({ user }),
  reset: () => set({ count: 0, user: null })
}));
```

### 2. 在组件中使用

```javascript
import React from 'react';

function Counter() {
  // 使用选择器获取特定状态
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);
  const decrement = useStore((state) => state.decrement);
  
  return (
    <div>
      <h2>计数器: {count}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </div>
  );
}

function UserProfile() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  
  return (
    <div>
      {user ? (
        <p>欢迎，{user.name}！</p>
      ) : (
        <button onClick={() => setUser({ name: '张三' })}>
          登录
        </button>
      )}
    </div>
  );
}
```

## 核心概念

### 1. 选择器 (Selectors)

选择器是 Zustand 性能优化的关键。只有选择的状态发生变化时，组件才会重新渲染。

```javascript
// ✅ 推荐：只选择需要的状态
const username = useStore((state) => state.user?.name);

// ❌ 避免：选择整个对象会导致不必要的重渲染
const user = useStore((state) => state.user);
```

### 2. 浅比较 (Shallow Comparison)

当需要选择多个值时，使用 `shallow` 来避免不必要的重渲染：

```javascript
import { shallow } from 'zustand/shallow';

const { name, age } = useStore(
  (state) => ({ name: state.user?.name, age: state.user?.age }),
  shallow
);
```

### 3. 在组件外使用

```javascript
// 获取当前状态
const currentState = useStore.getState();
console.log(currentState.count);

// 修改状态
useStore.getState().increment();

// 订阅状态变化
const unsubscribe = useStore.subscribe(
  (state) => console.log('状态变化:', state)
);
```

## 高级功能

### 1. 持久化存储

```javascript
import { persist } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    (set) => ({
      theme: 'light',
      language: 'zh-CN',
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      setLanguage: (language) => set({ language })
    }),
    {
      name: 'settings-storage', // localStorage 的 key
      // 可选：自定义存储
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
);
```

### 2. 状态订阅

```javascript
import { subscribeWithSelector } from 'zustand/middleware';

const useStore = create(
  subscribeWithSelector((set) => ({
    count: 0,
    user: null,
    increment: () => set((state) => ({ count: state.count + 1 }))
  }))
);

// 订阅特定状态变化
const unsubscribe = useStore.subscribe(
  (state) => state.count,
  (count, prevCount) => {
    console.log(`计数从 ${prevCount} 变为 ${count}`);
  }
);
```

### 3. 开发者工具

```javascript
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 }), 'increment'),
      decrement: () => set((state) => ({ count: state.count - 1 }), 'decrement')
    }),
    {
      name: 'counter-store' // 在 Redux DevTools 中显示的名称
    }
  )
);
```

### 4. 异步操作

```javascript
const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,
  
  fetchUser: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/users/${userId}`);
      const user = await response.json();
      set({ user, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  updateUser: async (userData) => {
    const currentUser = get().user;
    if (!currentUser) return;
    
    set({ loading: true });
    try {
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const updatedUser = await response.json();
      set({ user: updatedUser, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));
```

## 最佳实践

### 1. 按功能域拆分 Store

```javascript
// stores/authStore.js
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false })
}));

// stores/settingsStore.js
export const useSettingsStore = create((set) => ({
  theme: 'light',
  language: 'zh-CN',
  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  }))
}));

// stores/notificationStore.js
export const useNotificationStore = create((set) => ({
  notifications: [],
  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, { ...notification, id: Date.now() }]
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  }))
}));
```

### 2. 使用 TypeScript

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false })
}));
```

### 3. 创建自定义 Hook

```javascript
// hooks/useAuth.js
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  
  return { user, isAuthenticated, login, logout };
}

// hooks/useIsAdmin.js
export function useIsAdmin() {
  return useAuthStore((state) => state.user?.role === 'admin');
}
```

### 4. 状态重置

```javascript
const initialState = {
  count: 0,
  user: null,
  settings: { theme: 'light' }
};

const useStore = create((set) => ({
  ...initialState,
  
  // 其他方法...
  
  reset: () => set(initialState),
  resetCount: () => set({ count: initialState.count })
}));
```

## 实际应用示例

### 购物车管理

```javascript
const useCartStore = create((set, get) => ({
  items: [],
  total: 0,
  
  addItem: (product) => {
    const items = get().items;
    const existingItem = items.find(item => item.id === product.id);
    
    if (existingItem) {
      set((state) => ({
        items: state.items.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }));
    } else {
      set((state) => ({
        items: [...state.items, { ...product, quantity: 1 }]
      }));
    }
    
    // 更新总价
    get().calculateTotal();
  },
  
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter(item => item.id !== productId)
    }));
    get().calculateTotal();
  },
  
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    
    set((state) => ({
      items: state.items.map(item =>
        item.id === productId 
          ? { ...item, quantity }
          : item
      )
    }));
    get().calculateTotal();
  },
  
  calculateTotal: () => {
    const items = get().items;
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    set({ total });
  },
  
  clearCart: () => set({ items: [], total: 0 })
}));
```

### 表单状态管理

```javascript
const useFormStore = create((set, get) => ({
  formData: {},
  errors: {},
  isSubmitting: false,
  
  setField: (field, value) => {
    set((state) => ({
      formData: { ...state.formData, [field]: value },
      errors: { ...state.errors, [field]: null } // 清除错误
    }));
  },
  
  setError: (field, error) => {
    set((state) => ({
      errors: { ...state.errors, [field]: error }
    }));
  },
  
  validateForm: () => {
    const { formData } = get();
    const errors = {};
    
    if (!formData.email) {
      errors.email = '邮箱不能为空';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = '邮箱格式不正确';
    }
    
    if (!formData.password) {
      errors.password = '密码不能为空';
    } else if (formData.password.length < 6) {
      errors.password = '密码至少6位';
    }
    
    set({ errors });
    return Object.keys(errors).length === 0;
  },
  
  submitForm: async () => {
    if (!get().validateForm()) return;
    
    set({ isSubmitting: true });
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(get().formData)
      });
      
      if (response.ok) {
        set({ formData: {}, errors: {}, isSubmitting: false });
        return { success: true };
      } else {
        throw new Error('提交失败');
      }
    } catch (error) {
      set({ isSubmitting: false });
      return { success: false, error: error.message };
    }
  },
  
  resetForm: () => set({ formData: {}, errors: {}, isSubmitting: false })
}));
```

## 测试

### 单元测试

```javascript
// __tests__/store.test.js
import { renderHook, act } from '@testing-library/react';
import { useStore } from '../stores/useStore';

describe('useStore', () => {
  beforeEach(() => {
    // 重置状态
    useStore.getState().reset();
  });
  
  test('should increment count', () => {
    const { result } = renderHook(() => useStore());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
  
  test('should set user', () => {
    const user = { name: '张三', email: 'zhang@example.com' };
    
    act(() => {
      useStore.getState().setUser(user);
    });
    
    expect(useStore.getState().user).toEqual(user);
  });
});
```

## 与其他状态管理方案的比较

### vs Redux

| 特性 | Zustand | Redux |
|------|---------|-------|
| 包大小 | ~1KB | ~15KB |
| 模板代码 | 极少 | 较多 |
| 学习曲线 | 平缓 | 陡峭 |
| TypeScript 支持 | 原生支持 | 需要额外配置 |
| 中间件 | 可选 | 丰富 |
| 开发者工具 | 支持 | 优秀 |

### vs Context API

| 特性 | Zustand | Context API |
|------|---------|-------------|
| 性能 | 优秀（选择器） | 一般（全量更新） |
| 使用复杂度 | 简单 | 中等 |
| 嵌套问题 | 无 | 可能存在 |
| 状态分割 | 容易 | 需要多个 Context |

## 总结

Zustand 是一个优秀的状态管理解决方案，特别适合：

- 中小型 React 应用
- 需要简单直接的状态管理
- 追求性能优化的项目
- 希望减少模板代码的团队

通过本指南，您应该能够熟练使用 Zustand 来管理您的 React 应用状态。记住，选择合适的状态管理方案很重要，Zustand 提供了一个平衡简单性和功能性的优秀选择。

## 参考资源

- [Zustand 官方文档](https://github.com/pmndrs/zustand)
- [Zustand 中文文档](https://awesomedevin.github.io/zustand-vue/docs/introduce/zustand)
- [React 状态管理最佳实践](https://react.dev/learn/managing-state) 