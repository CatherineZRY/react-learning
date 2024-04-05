import { useContext } from 'react'
import { MsgContext } from './ContextParent'

function ContextSon2() {
  const msg = useContext(MsgContext)
  return (
    <div>
      <h4>Context Son</h4>
      {/* <span>{MsgContext}</span> */}
      <span>cuerrnet msg: {msg}</span>
    </div>
  )
}

export default ContextSon2