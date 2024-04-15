import { createSlice } from "@reduxjs/toolkit"

const counterStore = createSlice({
  // store的名称
  name: 'counter',
  // 初始状态数据
  initialState: {
    count: 0
  },
  // 修改数据的方法
  reducers: {
    increment(state, actions) {
      state.count = state.count + (actions.payload?.number || 1);
    },
    decrement(state, actions) {
      state.count = state.count - (actions.payload?.number || 1);
    },
  }
})

// 解构出创建action对象的函数
const { increment, decrement } = counterStore.actions;
// 获取reducer对象的函数
const conterReducer = counterStore.reducer;
// 导出创建action对象的函数和reducer函数
export { increment, decrement };
export default conterReducer
