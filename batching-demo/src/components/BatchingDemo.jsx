import React, { useState, useEffect } from 'react';
import './BatchingDemo.css';

export default function BatchingDemo() {
  const [number, setNumber] = useState(0);
  const [renderCount, setRenderCount] = useState(0);
  const [logs, setLogs] = useState([]);

  // 每次渲染时增加渲染计数
  useEffect(() => {
    setRenderCount(prev => prev + 1);
    console.log('组件重新渲染了，当前number值:', number);
  });

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  // 演示批量更新 - 同一事件中的多次setState会被批量处理
  const handleBatchedUpdates = () => {
    console.log('开始批量更新...');
    addLog(`开始点击 +3 按钮，当前值: ${number}`);

    setNumber(number + 1);
    console.log('第一次setNumber调用，期望值:', number + 1);
    addLog(`第一次调用 setNumber(${number} + 1)`);

    setNumber(number + 1);
    console.log('第二次setNumber调用，期望值:', number + 1, '(注意：仍然是基于初始值)');
    addLog(`第二次调用 setNumber(${number} + 1)`);

    setNumber(number + 1);
    console.log('第三次setNumber调用，期望值:', number + 1, '(注意：仍然是基于初始值)');
    addLog(`第三次调用 setNumber(${number} + 1)`);

    console.log('批量更新结束，等待React重新渲染...');
    addLog('批量更新结束，等待React重新渲染...');
  };

  // 正确的累加方式 - 使用函数式更新
  const handleCorrectUpdates = () => {
    console.log('开始正确的累加更新...');
    addLog(`开始点击正确的 +3 按钮，当前值: ${number}`);

    setNumber(prev => {
      console.log('第一次函数式更新，prev:', prev, '新值:', prev + 1);
      addLog(`第一次函数式更新: ${prev} + 1 = ${prev + 1}`);
      return prev + 1;
    });

    setNumber(prev => {
      console.log('第二次函数式更新，prev:', prev, '新值:', prev + 1);
      addLog(`第二次函数式更新: ${prev} + 1 = ${prev + 1}`);
      return prev + 1;
    });

    setNumber(prev => {
      console.log('第三次函数式更新，prev:', prev, '新值:', prev + 1);
      addLog(`第三次函数式更新: ${prev} + 1 = ${prev + 1}`);
      return prev + 1;
    });

    console.log('正确的累加更新结束');
    addLog('正确的累加更新结束');
  };

  // 异步更新演示
  const handleAsyncUpdates = () => {
    console.log('开始异步更新...');
    addLog(`开始异步更新，当前值: ${number}`);

    setTimeout(() => {
      setNumber(prev => prev + 1);
      addLog(`setTimeout 中第一次更新: ${number} + 1`);

      setTimeout(() => {
        setNumber(prev => prev + 1);
        addLog(`setTimeout 中第二次更新`);

        setTimeout(() => {
          setNumber(prev => prev + 1);
          addLog(`setTimeout 中第三次更新`);
        }, 100);
      }, 100);
    }, 100);
  };

  const clearLogs = () => {
    setLogs([]);
    setRenderCount(0);
  };

  return (
    <div className="batching-demo">
      <div className="demo-header">
        <h1>React 批量更新机制演示</h1>
        <div className="current-state">
          <h2>当前状态</h2>
          <p><strong>数字值:</strong> {number}</p>
          <p><strong>渲染次数:</strong> {renderCount}</p>
        </div>
      </div>

      <div className="demo-section">
        <h3>1. 错误的方式 - 批量更新问题</h3>
        <p>在同一个事件处理函数中多次调用 <code>setNumber(number + 1)</code></p>
        <button onClick={handleBatchedUpdates} className="btn btn-warning">
          +3 (错误方式)
        </button>
        <div className="explanation">
          <p><strong>问题:</strong> 三次 <code>setNumber(number + 1)</code> 都使用相同的 <code>number</code> 值，
            因为React会批量处理这些更新，所以最终只增加 1。</p>
        </div>
      </div>

      <div className="demo-section">
        <h3>2. 正确的方式 - 函数式更新</h3>
        <p>使用函数式更新 <code>setNumber(prev =&gt; prev + 1)</code></p>
        <button onClick={handleCorrectUpdates} className="btn btn-success">
          +3 (正确方式)
        </button>
        <div className="explanation">
          <p><strong>解决方案:</strong> 使用函数式更新，每次都基于最新的状态值进行计算。</p>
        </div>
      </div>

      <div className="demo-section">
        <h3>3. 异步更新演示</h3>
        <p>在 setTimeout 中进行更新</p>
        <button onClick={handleAsyncUpdates} className="btn btn-info">
          +3 (异步方式)
        </button>
        <div className="explanation">
          <p><strong>说明:</strong> 在 React 18 中，即使是异步更新也会被自动批量处理。</p>
        </div>
      </div>

      <div className="demo-section">
        <h3>操作日志</h3>
        <button onClick={clearLogs} className="btn btn-secondary">清空日志</button>
        <div className="logs">
          {logs.map((log, index) => (
            <div key={index} className="log-entry">{log}</div>
          ))}
        </div>
      </div>

      <div className="theory-section">
        <h3>React 批量更新机制原理</h3>
        <div className="theory-content">
          <h4>为什么会发生批量更新？</h4>
          <ul>
            <li><strong>性能优化:</strong> React 将多个状态更新合并为一次重新渲染，避免不必要的渲染。</li>
            <li><strong>状态一致性:</strong> 确保在同一个事件处理函数中，所有的 setState 看到的是同一个状态快照。</li>
            <li><strong>React 18 自动批量处理:</strong> 即使在 Promise、setTimeout 等异步操作中也会批量更新。</li>
          </ul>

          <h4>何时会触发重新渲染？</h4>
          <ul>
            <li>当前事件处理函数执行完毕后</li>
            <li>所有的状态更新都被收集完毕后</li>
            <li>React 合并所有更新，进行一次重新渲染</li>
          </ul>

          <h4>如何解决连续累加问题？</h4>
          <ul>
            <li><strong>函数式更新:</strong> <code>setState(prev =&gt; prev + 1)</code></li>
            <li><strong>使用 useReducer:</strong> 对于复杂的状态逻辑</li>
            <li><strong>分离更新:</strong> 将更新分散到不同的事件处理函数中</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 