function Brother2(props) {
  return (
    <div>
      <h3>This is brother2</h3>
      <span>Current name is {props.name || '--'}</span>
    </div>
  )
}

export default Brother2