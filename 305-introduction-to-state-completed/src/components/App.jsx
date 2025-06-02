import React from "react";


function App() {
  const [isDone, setIsDone] = React.useState(false); // 也可以直接写成 useState(false)，导包的时候需要单独导入useState
  // useState的两个返回值：
  // 1. 当前状态
  // 2. 更新状态的函数

  function strike() {
    console.log("strike");
    setIsDone(true);
  }

  function unStrike() {
    console.log("unStrike");
    setIsDone(false);
  }

  return (
    <div>
      <p style={isDone ? { textDecoration: "line-through" } : null}>Buy milk</p>
      <button onClick={strike}>Change to strike through</button>
      <button onClick={unStrike}>Change back</button>
    </div>
  );
}

export default App;
