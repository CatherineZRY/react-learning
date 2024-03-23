import { useState } from 'react'
import './style.css'

function Style() {
  const [color, setColor] = useState('aqua')
  const changeColor = (curColor) => {
    if (curColor === 'aqua') {
      setColor('red')
    } else {
      setColor('aqua')
    }
  }

  return (
    <div>
      <div className='style-test-class'>class style test</div>
      {/* 注意：行内样式的写法和传统html的写法不同，样式名称需要修改为驼峰的写法 */}
      <div style={{ color: color, fontSize: '50px' }}>inline style test</div>
      <button onClick={() => changeColor(color)}>Change Color</button>
    </div >
  )
}

export default Style