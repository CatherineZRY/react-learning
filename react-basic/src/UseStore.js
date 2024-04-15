import { useDispatch, useSelector } from "react-redux"
import { decrement, increment } from "./store/modules/counterStore";

function UseStore() {
  // useSelector中需要传入一个回调函数，需要在整个store的总体state中回去到当前所需的state（counter是reducer函数注册在store时的名称）
  const { count } = useSelector(state => state.counter)
  //得到dispatch函数
  const dispatch = useDispatch();

  return (
    <div>
      <h2>redux Demo</h2>
      <span>show cur state is {count}</span>
      <div>
        <button onClick={() => dispatch(decrement())}>Decrement</button>
        <button onClick={() => dispatch(decrement({ number: 3 }))}>Decrement 3</button>
        <button onClick={() => dispatch(increment())}>Increment</button>
        <button onClick={() => dispatch(increment({ number: 10 }))}>Increment 10</button>
      </div>
    </div>
  )
}

export default UseStore