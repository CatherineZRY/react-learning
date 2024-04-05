import { useState } from 'react'

function Hook() {
  const { value, toggle } = useToggle()
  return (
    <div>
      <h2>Hook Demo</h2>
      <div>
        {value && <span>toggle on</span>}
        <button onClick={toggle}>toggle</button>
      </div>
    </div>
  )
}

// hook：以use开头的函数，函数内部封装可以复用的逻辑，可以理解为一个工具方法
// 返回两个值：
// （1）只读值
// （2）修改此只读值的方法
function useToggle(initValue = true) {
  const [value, setValue] = useState(initValue)
  const toggle = () => setValue(!value)
  return {
    value,
    toggle
  }
}

export default Hook