import { useState } from "react"

function FromControl() {
  const [formValue, setValue] = useState('')

  return (
    <div>
      {/* 受控绑定表单 */}
      <input
        value={formValue}
        onChange={(e) => setValue(e.target.value)}></input>
      <div>
        <span>current value: {formValue ? formValue : '--'}</span>
      </div>
    </div>
  )
}

export default FromControl