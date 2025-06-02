import React, { useState } from "react";

// 使用函数组件的原因：
// 主要可以方便的使用hooks，hooks是函数组件的特性，类组件不能使用
function FunctionalComponent() {
  const [count, setCount] = useState(0);

  function increase() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increase}>+</button>
    </div>
  );
}

export default FunctionalComponent;
