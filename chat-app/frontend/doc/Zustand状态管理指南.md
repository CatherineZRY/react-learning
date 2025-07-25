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

## 快速开始

### 创建第一个 Store

```javascript
import { create } from 'zustand';

const useCounterStore = create((set) => ({
  // 状态
  count: 0,
  
  // 修改状态的方法
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 })
}));
```

### 在组件中使用

```javascript
import React from 'react';

function Counter() {
  // 使用选择器获取特定状态和方法
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);
  
  return (
    <div>
      <h2>计数器: {count}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
      <button onClick={reset}>重置</button>
    </div>
  );
}
```

## 核心 API 详解

### 1. create - 创建 Store

`create` 是创建 Zustand store 的核心函数。

#### 基本语法

```javascript
import { create } from 'zustand';

const useStore = create((set, get) => ({
  // 状态定义
  state1: initialValue1,
  state2: initialValue2,
  
  // 方法定义
  action1: (params) => {
    // 使用 set 更新状态
    // 使用 get 获取当前状态
  }
}));
```

#### 参数说明

- **set**: 用于更新状态的函数
- **get**: 用于获取当前状态的函数

### 2. set - 更新状态

`set` 函数是更新 store 状态的主要方式。

#### 直接设置状态

```javascript
const useStore = create((set) => ({
  user: null,
  theme: 'light',
  
  // 直接设置新状态
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme })
}));
```

#### 基于当前状态更新

```javascript
const useStore = create((set) => ({
  count: 0,
  items: [],
  
  // 使用函数形式，接收当前状态
  increment: () => set((state) => ({ count: state.count + 1 })),
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  }))
}));
```

#### 部分更新

```javascript
const useStore = create((set) => ({
  user: {
    name: '',
    email: '',
    age: 0
  },
  
  // 只更新用户的部分信息
  updateUserName: (name) => set((state) => ({
    user: { ...state.user, name }
  })),
  
  // 批量更新多个状态
  updateUserInfo: (name, email) => set((state) => ({
    user: { ...state.user, name, email },
    lastUpdated: new Date()
  }))
}));
```

#### set 的第二个参数（调试信息）

```javascript
const useStore = create((set) => ({
  count: 0,
  increment: () => set(
    (state) => ({ count: state.count + 1 }),
    false, // 是否替换整个状态（默认 false）
    'increment' // 调试信息，在 DevTools 中显示
  )
}));
```

### 3. get - 获取当前状态

`get` 方法允许在 store 内部获取当前的完整状态。

#### 基本用法

```javascript
const useStore = create((set, get) => ({
  count: 0,
  multiplier: 2,
  
  // 获取当前状态进行计算
  getTotal: () => {
    const { count, multiplier } = get();
    return count * multiplier;
  },
  
  // 在异步操作中获取最新状态
  incrementAsync: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const currentCount = get().count;
    set({ count: currentCount + 1 });
  }
}));
```

#### 条件逻辑处理

```javascript
const useStore = create((set, get) => ({
  items: [],
  maxItems: 10,
  
  addItem: (item) => {
    const { items, maxItems } = get();
    
    if (items.length >= maxItems) {
      console.warn('已达到最大数量限制');
      return false;
    }
    
    set({ items: [...items, item] });
    return true;
  }
}));
```

### 4. getState - 在组件外获取状态

`getState` 方法允许在 React 组件外部访问 store 的状态。

```javascript
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}));

// 在组件外部获取状态
const currentState = useStore.getState();
console.log('当前计数:', currentState.count);

// 在普通 JavaScript 函数中使用
function logCurrentCount() {
  const { count } = useStore.getState();
  console.log('计数值:', count);
}

// 在工具函数中使用
export function isCountEven() {
  return useStore.getState().count % 2 === 0;
}
```

### 5. setState - 直接设置状态

`setState` 方法允许直接设置 store 的状态，常用于测试或初始化。

```javascript
const useStore = create((set) => ({
  count: 0,
  user: null,
  increment: () => set((state) => ({ count: state.count + 1 }))
}));

// 直接设置状态
useStore.setState({ count: 10 });

// 基于当前状态设置
useStore.setState((state) => ({ count: state.count + 5 }));

// 部分更新
useStore.setState({ user: { name: '张三', id: 1 } });

// 在测试中重置状态
beforeEach(() => {
  useStore.setState({ count: 0, user: null });
});
```

### 6. 在组件外调用 Actions

可以通过 `getState()` 获取 store 中的 action 方法来修改状态。

```javascript
const useStore = create((set) => ({
  count: 0,
  message: '',
  increment: () => set((state) => ({ count: state.count + 1 })),
  setMessage: (message) => set({ message })
}));

// 在组件外部调用 action
useStore.getState().increment();
useStore.getState().setMessage('Hello from outside!');

// 或者创建一个专门的外部 API
export const storeAPI = {
  increment: () => useStore.getState().increment(),
  setMessage: (msg) => useStore.getState().setMessage(msg),
  getCurrentCount: () => useStore.getState().count
};
```

### 7. subscribe - 订阅状态变化

`subscribe` 方法允许监听 store 状态的变化。

#### 基本订阅

```javascript
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}));

// 订阅所有状态变化
const unsubscribe = useStore.subscribe(
  (state, prevState) => {
    console.log('状态变化:', { 
      from: prevState.count, 
      to: state.count 
    });
  }
);

// 取消订阅
unsubscribe();
```

#### 监听特定状态

```javascript
import { subscribeWithSelector } from 'zustand/middleware';

const useStore = create(
  subscribeWithSelector((set) => ({
    count: 0,
    user: null,
    increment: () => set((state) => ({ count: state.count + 1 })),
    setUser: (user) => set({ user })
  }))
);

// 只监听 count 的变化
const unsubscribeCount = useStore.subscribe(
  (state) => state.count,
  (count, prevCount) => {
    console.log(`计数从 ${prevCount} 变为 ${count}`);
  }
);

// 监听用户登录状态
const unsubscribeUser = useStore.subscribe(
  (state) => !!state.user,
  (isLoggedIn) => {
    console.log('用户登录状态:', isLoggedIn ? '已登录' : '未登录');
  }
);
```

### 8. destroy - 清理订阅

清理 store 的所有订阅者。

```javascript
const useStore = create((set) => ({
  data: [],
  loading: false
}));

// 清理所有订阅
useStore.destroy();

// 注意：destroy 只是清理订阅，store 本身仍然可以使用
const state = useStore.getState(); // 仍然可以访问状态
```

### 9. 选择器 (Selectors)

选择器是优化性能的关键，只选择需要的状态。

#### 基本选择器

```javascript
const useStore = create((set) => ({
  user: { name: '张三', age: 25, email: 'zhang@example.com' },
  theme: 'light',
  notifications: []
}));

// 组件中的用法
function UserProfile() {
  // ✅ 只选择需要的字段
  const userName = useStore((state) => state.user.name);
  const userAge = useStore((state) => state.user.age);
  
  // ❌ 选择整个对象会导致不必要的重渲染
  // const user = useStore((state) => state.user);
  
  return <div>{userName} ({userAge}岁)</div>;
}
```

#### 计算选择器

```javascript
const useStore = create((set) => ({
  items: [
    { id: 1, name: '苹果', price: 5, quantity: 2 },
    { id: 2, name: '香蕉', price: 3, quantity: 5 }
  ]
}));

function ShoppingCart() {
  // 计算总价
  const total = useStore((state) => 
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );
  
  // 计算商品数量
  const itemCount = useStore((state) => state.items.length);
  
  return (
    <div>
      <p>商品数量: {itemCount}</p>
      <p>总价: ¥{total}</p>
    </div>
  );
}
```

#### 浅比较选择器

```javascript
import { shallow } from 'zustand/shallow';

function UserComponent() {
  // 使用 shallow 避免不必要的重渲染
  const { name, age, email } = useStore(
    (state) => ({ 
      name: state.user.name, 
      age: state.user.age, 
      email: state.user.email 
    }),
    shallow
  );
  
  return (
    <div>
      <p>姓名: {name}</p>
      <p>年龄: {age}</p>
      <p>邮箱: {email}</p>
    </div>
  );
}
```

## 异步操作处理

### 基本异步操作

```javascript
const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,
  
  fetchUser: async (userId) => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('获取用户失败');
      
      const user = await response.json();
      set({ user, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  updateUser: async (userData) => {
    const { user } = get();
    if (!user) return;
    
    set({ loading: true });
    
    try {
      const response = await fetch(`/api/users/${user.id}`, {
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

### 并发请求处理

```javascript
const useDataStore = create((set, get) => ({
  users: [],
  posts: [],
  comments: [],
  loading: false,
  
  fetchAllData: async () => {
    set({ loading: true });
    
    try {
      // 并发请求
      const [usersRes, postsRes, commentsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/posts'),
        fetch('/api/comments')
      ]);
      
      const [users, posts, comments] = await Promise.all([
        usersRes.json(),
        postsRes.json(),
        commentsRes.json()
      ]);
      
      set({ users, posts, comments, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));
```

### 分页加载

```javascript
const usePostsStore = create((set, get) => ({
  posts: [],
  page: 1,
  hasMore: true,
  loading: false,
  
  loadPosts: async () => {
    const { loading, page } = get();
    if (loading) return; // 防止重复请求
    
    set({ loading: true });
    
    try {
      const response = await fetch(`/api/posts?page=${page}&limit=10`);
      const data = await response.json();
      
      const { posts: currentPosts } = get();
      
      set({
        posts: [...currentPosts, ...data.posts],
        page: page + 1,
        hasMore: data.hasMore,
        loading: false
      });
    } catch (error) {
      set({ loading: false });
    }
  },
  
  resetPosts: () => set({ posts: [], page: 1, hasMore: true })
}));
```

## 中间件和高级功能

### 1. 持久化存储

```javascript
import { persist } from 'zustand/middleware';

const useSettingsStore = create(
  persist(
    (set) => ({
      theme: 'light',
      language: 'zh-CN',
      fontSize: 14,
      
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setFontSize: (fontSize) => set({ fontSize })
    }),
    {
      name: 'app-settings', // localStorage 的 key
      
      // 自定义存储引擎
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name)
      },
      
      // 部分持久化
      partialize: (state) => ({ 
        theme: state.theme, 
        language: state.language 
      }),
      
      // 版本管理和迁移
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          // 从版本 0 迁移到版本 1
          return { ...persistedState, fontSize: 14 };
        }
        return persistedState;
      }
    }
  )
);
```

### 2. 开发者工具集成

```javascript
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set(
        (state) => ({ count: state.count + 1 }),
        false,
        'increment' // action 名称
      ),
      decrement: () => set(
        (state) => ({ count: state.count - 1 }),
        false,
        'decrement'
      )
    }),
    {
      name: 'counter-store', // 在 DevTools 中显示的名称
      serialize: true, // 是否序列化状态
      trace: true // 启用调用栈追踪
    }
  )
);
```

### 3. 状态订阅中间件

```javascript
import { subscribeWithSelector } from 'zustand/middleware';

const useStore = create(
  subscribeWithSelector((set) => ({
    count: 0,
    user: null,
    increment: () => set((state) => ({ count: state.count + 1 })),
    setUser: (user) => set({ user })
  }))
);

// 监听特定状态变化
useStore.subscribe(
  (state) => state.count,
  (count, prevCount) => {
    if (count > 10) {
      console.log('计数超过了 10！');
    }
  }
);
```

### 4. 组合多个中间件

```javascript
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';

const useStore = create(
  devtools(
    persist(
      subscribeWithSelector((set) => ({
        // store 定义
      })),
      { name: 'my-store' }
    ),
    { name: 'MyStore' }
  )
);
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

// stores/uiStore.js
export const useUIStore = create((set) => ({
  sidebarOpen: false,
  theme: 'light',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme })
}));
```

### 2. 创建自定义 Hooks

```javascript
// hooks/useAuth.js
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  
  return { user, isAuthenticated, login, logout };
}

// hooks/usePermissions.js
export function usePermissions() {
  const user = useAuthStore((state) => state.user);
  
  return {
    isAdmin: user?.role === 'admin',
    canEdit: user?.permissions?.includes('edit'),
    canDelete: user?.permissions?.includes('delete')
  };
}
```

### 3. TypeScript 支持

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
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

### 4. 错误处理模式

```javascript
const useApiStore = create((set, get) => ({
  data: null,
  loading: false,
  error: null,
  
  fetchData: async (id) => {
    set({ loading: true, error: null });
    
    try {
      const response = await api.getData(id);
      set({ data: response.data, loading: false });
    } catch (error) {
      set({ 
        error: {
          message: error.message,
          code: error.code,
          timestamp: new Date().toISOString()
        }, 
        loading: false 
      });
    }
  },
  
  clearError: () => set({ error: null })
}));
```

## 实际应用示例

### 聊天应用 Store

```javascript
const useChatStore = create((set, get) => ({
  // 状态
  messages: [],
  users: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  
  // 获取用户列表
  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const response = await fetch('/api/users');
      const users = await response.json();
      set({ users, isUserLoading: false });
    } catch (error) {
      console.error('获取用户失败:', error);
      set({ isUserLoading: false });
    }
  },
  
  // 获取消息
  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const response = await fetch(`/api/messages/${userId}`);
      const messages = await response.json();
      set({ messages, isMessageLoading: false });
    } catch (error) {
      console.error('获取消息失败:', error);
      set({ isMessageLoading: false });
    }
  },
  
  // 选择用户
  setSelectedUser: (user) => {
    set({ selectedUser: user });
    // 自动加载该用户的消息
    if (user) {
      get().getMessages(user._id);
    }
  },
  
  // 发送消息
  sendMessage: async (messageText) => {
    const { selectedUser, messages } = get();
    
    if (!selectedUser) {
      console.error('请先选择聊天对象');
      return;
    }
    
    try {
      const response = await fetch(`/api/message/send/${selectedUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: messageText })
      });
      
      const newMessage = await response.json();
      set({ messages: [...messages, newMessage] });
    } catch (error) {
      console.error('发送消息失败:', error);
    }
  }
}));
```

### 购物车 Store

```javascript
const useShoppingStore = create((set, get) => ({
  items: [],
  total: 0,
  
  addItem: (product) => {
    const { items } = get();
    const existingItem = items.find(item => item.id === product.id);
    
    if (existingItem) {
      set({
        items: items.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      });
    } else {
      set({ items: [...items, { ...product, quantity: 1 }] });
    }
    
    get().calculateTotal();
  },
  
  removeItem: (productId) => {
    const { items } = get();
    set({ items: items.filter(item => item.id !== productId) });
    get().calculateTotal();
  },
  
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    
    const { items } = get();
    set({
      items: items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    });
    get().calculateTotal();
  },
  
  calculateTotal: () => {
    const { items } = get();
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    set({ total });
  },
  
  clearCart: () => set({ items: [], total: 0 })
}));
```

## 测试

### 基本测试

```javascript
import { renderHook, act } from '@testing-library/react';
import { useCounterStore } from '../stores/counterStore';

describe('useCounterStore', () => {
  beforeEach(() => {
    useCounterStore.setState({ count: 0 });
  });
  
  test('should increment count', () => {
    const { result } = renderHook(() => useCounterStore());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
  
  test('should handle async actions', async () => {
    const { result } = renderHook(() => useCounterStore());
    
    await act(async () => {
      await result.current.incrementAsync();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

### 模拟 API 测试

```javascript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json([{ id: 1, name: '张三' }]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('should fetch users', async () => {
  const { result } = renderHook(() => useUserStore());
  
  await act(async () => {
    await result.current.fetchUsers();
  });
  
  expect(result.current.users).toHaveLength(1);
  expect(result.current.users[0].name).toBe('张三');
});
```

## 性能优化

### 1. 选择器优化

```javascript
// ❌ 会导致不必要的重渲染
const user = useStore((state) => state.user);

// ✅ 只选择需要的字段
const userName = useStore((state) => state.user?.name);

// ✅ 使用浅比较
const { name, email } = useStore(
  (state) => ({ name: state.user?.name, email: state.user?.email }),
  shallow
);
```

### 2. 计算缓存

```javascript
import { useMemo } from 'react';

function ExpensiveComponent() {
  const items = useStore((state) => state.items);
  
  // 缓存计算结果
  const expensiveValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.complexCalculation(), 0);
  }, [items]);
  
  return <div>{expensiveValue}</div>;
}
```

### 3. 状态分割

```javascript
// 将大的 store 分割成小的 store
const useUserStore = create(...);
const useUIStore = create(...);
const useDataStore = create(...);

// 而不是一个巨大的 store
const useAppStore = create(...); // ❌
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
| 异步处理 | 简单 | 需要中间件 |

### vs Context API

| 特性 | Zustand | Context API |
|------|---------|-------------|
| 性能 | 优秀（选择器） | 一般（全量更新） |
| 使用复杂度 | 简单 | 中等 |
| 嵌套问题 | 无 | 可能存在 |
| 状态分割 | 容易 | 需要多个 Context |
| 跨组件通信 | 简单 | 复杂 |

### vs Jotai/Valtio

| 特性 | Zustand | Jotai | Valtio |
|------|---------|-------|---------|
| 思维模型 | Store 中心化 | 原子化 | 代理响应式 |
| 学习成本 | 低 | 中等 | 低 |
| 适用场景 | 通用 | 复杂状态 | 简单状态 |

## 总结

Zustand 是一个优秀的状态管理解决方案，特别适合：

- **中小型 React 应用**：轻量级，无过度设计
- **快速原型开发**：零模板代码，快速上手
- **性能敏感的应用**：精确的选择器控制重渲染
- **TypeScript 项目**：原生 TypeScript 支持
- **团队协作**：简单直观，易于维护

### 选择建议

- **简单应用**：直接使用基本的 create + set + get
- **中等复杂度**：添加持久化、订阅等中间件
- **复杂应用**：考虑状态分割和自定义 hooks
- **企业级应用**：结合 DevTools、测试和 TypeScript

Zustand 提供了一个完美平衡简单性和功能性的状态管理方案，是现代 React 应用的优秀选择。

## 参考资源

- [Zustand 官方文档](https://github.com/pmndrs/zustand)
- [Zustand 中文文档](https://awesomedevin.github.io/zustand-vue/docs/introduce/zustand)
- [React 状态管理最佳实践](https://react.dev/learn/managing-state)
- [Zustand 与其他状态管理库对比](https://github.com/pmndrs/zustand#comparison) 