import { useState } from 'react'
import Son from './Son'

function Parent() {
  const childName = 'test1'
  const [childMsg, setChildMsg] = useState('')
  const [childMsg2, setChildMsg2] = useState('')
  const getChildMsg = (msg) => {
    setChildMsg(msg)
  }
  const getChildMsg2 = (msg) => {
    setChildMsg2(msg)
  }
  return (
    <div>
      <div>
        <span>This is parent</span>
      </div>
      <div>
        <span>There is a son:</span>
      </div>
      <div style={{ marginLeft: '16px' }}>
        <Son name={childName}
          age={20}
          cb={() => alert('this is a function')}
          onPostMsg={getChildMsg}
          onPostMsg2={getChildMsg2}>
          <span>child's child</span>
        </Son>
      </div>
      {
        childMsg &&
        <div>
          <span>This is child msg:</span>
          <span>{childMsg}</span>
        </div>
      }
      {
        childMsg2 &&
        <div>
          <span>This is child msg2:</span>
          <span>{childMsg2}</span>
        </div>
      }
    </div>
  )
}
export default Parent