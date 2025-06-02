import React from "react";

// 使用类组件的原因：
// 主要是需要组件的state，在函数组件中，可以使用useState来管理状态，但是在类组件中，需要使用this.state来管理状态
class ClassComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      count: 0
    };
    this.increase = this.increase.bind(this);
  }

  increase() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div>
        <h1>{this.state.count}</h1>
        <button onClick={this.increase}>+</button>
      </div>
    );
  }
}

export default ClassComponent;
