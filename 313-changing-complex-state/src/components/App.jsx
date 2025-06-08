import React from "react";

function App() {
  const [fullName, setFullName] = React.useState({
    fName: "",
    lName: ""
  });

  function handleChange(event) {
    const { name, value } = event.target;
    // 注意：
    // 1. 使用局部变量存储新值，不要直接在setFullName中使用event（event有可能会已经被回收而无法获取到）
    // 2. setFullName中支持接收一个函数，函数中接收prevValue，返回新的状态值；也同样支持接收一个对象，对象中包含多个状态值
    setFullName(prevValue => ({
      ...prevValue,
      [name]: value
    }));
  }

  return (
    <div className="container">
      <h1>Hello {fullName.fName} {fullName.lName}</h1>
      <form>
        {/* 使用value会将input框变为一个受控组件，而value为undefined时，input框会变为非受控组件 */}
        {/* react中，受控组件和非受控组件的值是不同的，受控组件的值是value，非受控组件的值是defaultValue，并且不允许切换 */}
        <input
          name="fName"
          placeholder="First Name"
          onChange={handleChange}
        />
        <input
          name="lName"
          placeholder="Last Name"
          onChange={handleChange}
        />
        <button>Submit</button>
      </form>
    </div>
  );
}

export default App;
