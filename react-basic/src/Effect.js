import { useEffect, useState } from 'react'

function Effect() {
  const [renderFinished, setStatus] = useState(false)
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const [showSon, setShowSon] = useState(true);
  // useEffect是一个react hook函数，可以用于在react组件中创建不是由事件引起，而是由渲染本身引起的操作，例如发送请求，改写DOM等
  // useEffect由两个参数：
  // （1）回调函数
  // （2）依赖项数组（根据依赖项函数的不同情况，副作用函数触发回调函数的时机也会有不同
  //     1、没有依赖项数组：组件初始化渲染 + 组件更新时执行
  //     2、空数组依赖：只在组件初始渲染时支持一次
  //     3、添加特定的依赖项：组件初始渲染 + 特定依赖项（需要是state对象）变化时执行
  useEffect(() => {
    console.log('render has worked out.')
    setStatus(true)
  }, [name]);

  return (
    <div>
      <h2>Effect Demo</h2>
      {renderFinished && <div>Render has worked out</div>}
      <div>
        <span>current count: {count}</span>
        <button onClick={() => setCount(count + 1)}>Add Count</button>
      </div>
      <div>
        <span>current name: {name || '--'}</span>
        <input value={name}
          onChange={(e) => setName(e.target.value)}></input>
      </div>
      {
        showSon &&
        <div>
          <EffectSon />
          <button onClick={() => setShowSon(false)}>clear son</button>
        </div>
      }
    </div>
  )
}

function EffectSon() {
  const timer = null;
  useEffect(() => {
    // 开启定时器
    const timer = setInterval(() => {
      console.log('interval working...')
    }, 1000);

    // 返回清除副作用函数（组件销毁时自动触发）
    return () => {
      clearInterval(timer)
    }
  }, [])
  return (
    <div>
      this is effect son
    </div>
  )
}

export default Effect