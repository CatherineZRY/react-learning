/*
 * React状态更新核心概念笔记
 * 
 * 1. 状态更新的异步性：
 *    - setState/useState的更新函数是异步的，不会立即反映在状态变量中
 *    - 调用setXxx()后，xxx变量不会立即更新，需要等到下次重新渲染
 * 
 * 2. 批处理机制：
 *    - React会将多个状态更新合并成一次重新渲染
 *    - 这样可以提高性能，避免频繁的DOM操作
 * 
 * 3. 闭包特性：
 *    - 函数内部捕获的是调用时的状态值，不是最新值
 *    - 即使状态已经"更新"，函数内的变量仍然是旧值
 * 
 * 4. 正确的处理方式：
 *    - 如果需要在同一函数中使用新值，应该直接使用这个新值
 *    - 不要依赖状态变量，因为它还没有更新
 *    - 示例：const newValue = "xxx"; setState(newValue); doSomething(newValue);
 * 
 * 5. 监听状态变化的方法：
 *    - 使用useEffect监听状态变化：useEffect(() => {}, [stateVariable])
 *    - 函数式更新：setState(prevState => { 使用prevState })
 */

import React from "react";

function App() {
  const [initialName, setInitialName] = React.useState("John");
  const [name, setName] = React.useState(initialName);
  const [submittedName, setSubmittedName] = React.useState("");

  function handleChange(event) {
    console.log(event.target.value);
    setName(event.target.value);
  }

  function handleReset() {
    // 正确做法：使用局部变量存储新值
    const newInitialName = "John1234";
    setInitialName(newInitialName);
    console.log('initialName:', newInitialName); // 打印新值，而非状态变量
    setName(newInitialName); // 使用新值，而非状态变量

    // 错误做法（已修正）：
    // setInitialName("John1234");
    // console.log('initialName:', initialName); // 这里会打印旧值！
    // setName(initialName); // 这里使用的是旧值！
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmittedName(event.target.elements[0].value);
  }

  return (
    <div className="container">
      <h1>Hello {submittedName}</h1>
      <form onSubmit={handleSubmit}>
        <input type="text"
          value={name}
          placeholder="What's your name?"
          onChange={handleChange} />
        <button onClick={handleReset} type="button">Reset to New Name</button>
        <button style={{ marginLeft: "10px" }} type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
