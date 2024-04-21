import { createSlice } from "@reduxjs/toolkit"
import axiox from "axios"

const channekStore = createSlice({
  // store的名称
  name: 'channel',
  // 初始状态数据
  initialState: {
    channelList: []
  },
  // 修改数据的方法
  reducers: {
    setChannels(state, actions) {
      state.channelList = actions.payload;
    }
  }
})

// 解构出创建action对象的函数
const { setChannels } = channekStore.actions;
// 获取reducer对象的函数
const channelReducer = channekStore.reducer;


// 异步请求
const fetchChannelList = () => {
  return async (dispatch) => {
    const res = await axiox.get('http://geek.itheima.net/v1_0/channels')
    dispatch(setChannels(res.data.data.channels))
  }
}

// 导出创建action对象的函数和reducer函数
export { setChannels, fetchChannelList };
export default channelReducer