import ContextSon from './ContextSon'
import { createContext } from 'react'

export const MsgContext = createContext() // 在顶层组件中创建一个上下文对象（全局）

function ContextParent() {
  const msg = 'this is a app msg';
  return (
    <div>
      <h2>Context Parent</h2>
      {/* 在provider中，通过value属性去传递数据 */}
      <MsgContext.Provider value={msg}>
        <ContextSon />
      </MsgContext.Provider>
      {/* <ContextSon /> */}
    </div>
  )
}

export default ContextParent
