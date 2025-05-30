import Heading from "./Heading";
import List from "./List";

function App() {
  return (
    <div>
      {/* 可以使用闭合标签来调用组件，也可以使用自闭合标签来调用组件 */}
      <Heading />
      <List />
    </div>
  )
}

export default App;
