import { configureStore } from '@reduxjs/toolkit';
import homeReducer from './Home/store';

// 使用 Redux Toolkit 的 configureStore，自动包含 thunk 中间件
const store = configureStore({
  reducer: {
    home: homeReducer,
  },
  // Redux Toolkit 默认包含 thunk 中间件，无需手动添加
});

// 导出类型以供 TypeScript 使用
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 导出创建的 store
export default store;
