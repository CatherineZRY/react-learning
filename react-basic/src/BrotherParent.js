import { useState } from 'react'
import Brother1 from './Brother1'
import Brother2 from './Brother2'

function BrotherParent() {
  const [name, setName] = useState('')
  return (
    <div>
      <h2>
        This is a brother parent component
      </h2>
      <Brother1 name={name}
        setName={setName} />
      <Brother2 name={name} />
    </div>
  )
}

export default BrotherParent