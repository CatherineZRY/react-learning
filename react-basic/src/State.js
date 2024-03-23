import { useState } from "react"

function State() {
  // react中不支持双向绑定，因此需要使用useState
  let [count, setCount] = useState(0)
  const handleClick = () => {
    // 调用stats的set方法时会实现同时重新渲染页面
    setCount(count + 1)
  }
  return (
    <div>
      <div>current count: {count}</div>
      <button onClick={() => handleClick()}>Add Count</button>
    </div>
  )
}

export default State