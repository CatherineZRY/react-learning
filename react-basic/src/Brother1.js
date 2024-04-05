function Brother1(props) {

  return (
    <div>
      <h3>This is brother1</h3>
      <input value={props.name}
        onChange={(e) => props.setName(e.target.value)}>
      </input>
    </div>
  )
}

export default Brother1