
function Event() {
  // 回调函数建议写在组件内部
  // const buttonClick = (e) => {
  //   console.log(e) // 默认传递的为事件对象本身
  //   console.log('button is clicked...')
  //   isClicked = !isClicked
  // }
  const buttonClick = (e, name) => {
    console.log(e)
    console.log(name)
    console.log('button is clicked...')
  }


  return (
    <div>
      {/* 回调函数不需要传递标准的 */}
      {/* <button onClick={buttonClick}>button</button> */}
      <button onClick={(e) => buttonClick(e, 'tom')}>button</button>
    </div>
  )
}

// function buttonClick() {
//   console.log('button is clicked...')
//   isClicked = !isClicked
// }

export default Event