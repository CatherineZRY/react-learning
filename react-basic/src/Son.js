
// 父子间通信需要采用props参数进行接收，props参数接收到的时一个对象，其中包括了父组件传递的属性（例如：name）
function Son(props) {
  // props是一个只读对象
  return (
    <div>
      <span>this is child</span>
      <span>My name is {props?.name ? props.name : '--'}. </span>
      <span>My age is {props?.age ? props.age : '--'}. </span>
      <button onClick={() => props.cb()}>click child</button>
    </div>
  )
}

export default Son