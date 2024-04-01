import { useState } from "react"

// 父子间通信需要采用props参数进行接收，props参数接收到的时一个对象，其中包括了父组件传递的属性（例如：name）
function Son(props) {
  // props是一个只读对象
  const [childValue, setValue] = useState('')

  return (
    <div>
      <span>this is child</span>
      <span>My name is {props?.name ? props.name : '--'}. </span>
      <span>My age is {props?.age ? props.age : '--'}. </span>
      <button onClick={() => props.cb()}>click child</button>
      <div>
        {/* props.children是一个特殊的参数，可以从父组件传递出嵌套在子组件中的模板 */}
        {props.children}
      </div>
      <div>
        <label htmlFor="input1">input 1</label>
        <input name="input1" value={childValue}
          onChange={(e) => setValue(e.target.value)}></input>
        <button onClick={() => props.onPostMsg(childValue)}> Post Msg to Parent </button>
      </div>
      <div style={{ marginTop: '16px' }}>
        <label htmlFor="input2">input 2</label>
        <input name="input2"
          onChange={(e) => props.onPostMsg2(e.target.value)}></input>
      </div>
    </div >
  )
}

export default Son