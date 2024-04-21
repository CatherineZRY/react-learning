import { useDispatch, useSelector } from "react-redux"
import { decrement, increment } from "./store/modules/counterStore";
import { useEffect } from "react";
import { fetchChannelList } from './store/modules/channelStore'

function UseStore() {
  // useSelector中需要传入一个回调函数，需要在整个store的总体state中回去到当前所需的state（counter是reducer函数注册在store时的名称）
  const { count } = useSelector(state => state.counter)
  const { channelList } = useSelector(state => state.channel)
  //得到dispatch函数
  const dispatch = useDispatch();
  // 使用useEffect触发异步请求
  useEffect(() => {
    console.log('get async data...')
    dispatch(fetchChannelList())
  }, [dispatch]);

  return (
    <div>
      <h2>redux Demo</h2>
      <div>
        <h3>simple reducer demo</h3>
        <span>show cur state is {count}</span>
        <div>
          <button onClick={() => dispatch(decrement())}>Decrement</button>
          <button onClick={() => dispatch(decrement({ number: 3 }))}>Decrement 3</button>
          <button onClick={() => dispatch(increment())}>Increment</button>
          <button onClick={() => dispatch(increment({ number: 10 }))}>Increment 10</button>
        </div>
      </div>
      <div>
        <h3>async reducer demo</h3>
        <ul>
          {channelList.map((item) => (<li key={item.id}>{item.name}</li>))}
        </ul>
      </div>
    </div>
  )
}

export default UseStore