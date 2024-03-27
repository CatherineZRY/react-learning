import { useRef } from "react"

function GetDom() {
  const inputRef = useRef(null); // 生成ref对象，绑定到dom标签上
  const showDom = (domEl) => {
    // 在dom元素被渲染完成后，domEl.current可以获取dom元素
    console.log(domEl)
  }

  return (
    <div>
      <input type="text" ref={inputRef}></input>
      <button onClick={() => showDom(inputRef)}>Get Input Dom</button>
    </div>
  )
}

export default GetDom