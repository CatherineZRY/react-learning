import List from './List';
import If from './If';
import ComplexIf from './ComplexIf';
import Event from './Event';
import State from './State';
import Style from './Style';
import FromControl from './FormControl';
import GetDom from './GetDom';
import Parent from './Parent';
import BrotherParent from './BrotherParent';
import ContextParent from './ContextParent';
import Effect from './Effect';
import Hook from './Hook';
import UseStore from './UseStore'

// 根组件
const count = 300
const divColor = 'red';

function getName() {
  return 'jack'
}

function App() {
  return (
    <div className="App">
      {/* 如果使用其他变量，则html中直接使用的字符串会失效 */}
      {/* this is App */}
      {/* 使用引号传递字符串 */}
      {'this is App1'}
      {/* 使用js变量 */}
      {'this is a count:' + count}
      {/* 函数调用 */}
      {getName()}
      {/* 方法调用 */}
      {new Date().getDate()}
      {/* 使用js对象 */}
      <div style={{ color: divColor }}>this is a div</div>
      <List />
      <If />
      <ComplexIf />
      <Event />
      <State />
      <Style />
      <FromControl />
      <GetDom />
      <Parent />
      <BrotherParent />
      <ContextParent />
      <Effect />
      <Hook />
      <UseStore />
    </div>
  );
}

export default App;
