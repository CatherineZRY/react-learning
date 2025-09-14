import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// 定义 state 的类型
export interface HomeState {
  name: string;
  list: number[];
  loading: boolean;
  error: string | null;
}

// 初始状态
const initialState: HomeState = {
  name: 'sanyuan',
  list: [],
  loading: false,
  error: null,
};

// 创建异步 thunk action
export const getHomeList = createAsyncThunk('home/getHomeList', async () => {
  // 模拟异步请求
  return new Promise<{ data: { data: number[] } }>(resolve => {
    setTimeout(() => {
      const startIndex = Math.floor(Math.random() * 100);
      const endIndex = startIndex + 10;
      const list = [];
      for (let i = startIndex; i <= endIndex; i++) {
        list.push(i);
      }
      resolve({
        data: {
          data: list,
        },
      });
    }, 1000);
  }).then(res => {
    console.log('获取到的数据:', res.data.data);
    return res.data.data;
  });
});

// 创建 slice
const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    // 同步 action - 直接修改列表
    changeList: (state, action: PayloadAction<number[]>) => {
      state.list = action.payload;
    },
    // 重置状态
    resetState: state => {
      state.list = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    // 处理异步 action 的状态
    builder
      .addCase(getHomeList.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHomeList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.error = null;
      })
      .addCase(getHomeList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取数据失败';
      });
  },
});

// 导出 action creators
export const { changeList, resetState } = homeSlice.actions;

// 导出 reducer
export default homeSlice.reducer;
