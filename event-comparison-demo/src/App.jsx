import React, { useState, useEffect, useRef } from 'react'

function App() {
  const [logs, setLogs] = useState([])
  const nativeRef = useRef(null)
  const nativeInnerRef = useRef(null)

  // 添加日志函数
  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  // 清除日志
  const clearLogs = () => {
    setLogs([])
  }

  // 原生事件监听器设置
  useEffect(() => {
    const outerElement = nativeRef.current
    const innerElement = nativeInnerRef.current

    if (outerElement && innerElement) {
      // 外层原生事件监听器
      const handleNativeOuterClick = (e) => {
        addLog('🔵 原生事件 - 外层点击')
      }

      // 内层原生事件监听器
      const handleNativeInnerClick = (e) => {
        addLog('🟡 原生事件 - 内层点击')
        // 演示阻止原生事件冒泡
        e.stopPropagation()
        addLog('⚠️ 原生事件冒泡已被阻止')
      }

      outerElement.addEventListener('click', handleNativeOuterClick)
      innerElement.addEventListener('click', handleNativeInnerClick)

      // 清理函数
      return () => {
        outerElement.removeEventListener('click', handleNativeOuterClick)
        innerElement.removeEventListener('click', handleNativeInnerClick)
      }
    }
  }, [])

  // React合成事件处理器
  const handleSyntheticOuterClick = (e) => {
    addLog('🟢 React合成事件 - 外层点击')
    addLog(`   事件类型: ${e.type}`)
    addLog(`   是否为合成事件: ${e.nativeEvent ? '是' : '否'}`)
  }

  const handleSyntheticInnerClick = (e) => {
    addLog('🟠 React合成事件 - 内层点击')
    addLog(`   currentTarget: ${e.currentTarget.className}`)
    addLog(`   target: ${e.target.className}`)
  }

  // 阻止合成事件冒泡
  const handleSyntheticInnerClickWithStop = (e) => {
    addLog('🟠 React合成事件 - 内层点击(阻止冒泡)')
    e.stopPropagation()
    addLog('⚠️ React合成事件冒泡已被阻止')
  }

  // 阻止原生事件冒泡
  const handleNativeStopClick = (e) => {
    addLog('🟡 原生事件 - 内层点击(阻止冒泡)')
    e.nativeEvent.stopImmediatePropagation()
    addLog('⚠️ 原生事件立即停止传播')
  }

  return (
    <div className="demo-container">
      <h1>React 合成事件 vs 原生事件 对比演示</h1>

      {/* 事件对比说明 */}
      <div className="event-comparison">
        <div className="comparison-item">
          <h4>🔵 React 合成事件 (SyntheticEvent)</h4>
          <ul>
            <li><span className="highlight">跨浏览器兼容</span>：统一的API接口</li>
            <li><span className="highlight">事件代理</span>：事件绑定在根容器上</li>
            <li><span className="highlight">对象池</span>：事件对象被复用以提高性能</li>
            <li><span className="highlight">阻止冒泡</span>：e.stopPropagation()</li>
            <li><span className="highlight">访问原生事件</span>：e.nativeEvent</li>
          </ul>
        </div>
        <div className="comparison-item">
          <h4>🟡 原生事件 (Native Event)</h4>
          <ul>
            <li><span className="highlight">直接绑定</span>：addEventListener绑定到DOM元素</li>
            <li><span className="highlight">浏览器差异</span>：不同浏览器可能有差异</li>
            <li><span className="highlight">内存管理</span>：需要手动移除监听器</li>
            <li><span className="highlight">阻止冒泡</span>：e.stopPropagation()</li>
            <li><span className="highlight">立即停止</span>：e.stopImmediatePropagation()</li>
          </ul>
        </div>
      </div>

      {/* 合成事件演示 */}
      <div className="section">
        <h3>🟢 React 合成事件演示</h3>
        <p>点击内层元素，观察事件冒泡行为：</p>

        <div className="nested-container" onClick={handleSyntheticOuterClick}>
          <strong>外层容器 (合成事件)</strong>
          <div className="inner-element" onClick={handleSyntheticInnerClick}>
            内层元素 (普通合成事件)
          </div>
          <div className="inner-element" onClick={handleSyntheticInnerClickWithStop}>
            内层元素 (阻止冒泡)
          </div>
        </div>
      </div>

      {/* 原生事件演示 */}
      <div className="section">
        <h3>🔵 原生事件演示</h3>
        <p>使用useEffect和addEventListener绑定原生事件：</p>

        <div className="nested-container" ref={nativeRef}>
          <strong>外层容器 (原生事件)</strong>
          <div className="inner-element" ref={nativeInnerRef}>
            内层元素 (原生事件 - 已阻止冒泡)
          </div>
        </div>
      </div>

      {/* 混合事件演示 */}
      <div className="section">
        <h3>🔄 混合事件演示</h3>
        <p>同时处理合成事件和原生事件：</p>

        <div className="nested-container" onClick={handleSyntheticOuterClick}>
          <strong>外层容器 (合成事件)</strong>
          <div className="inner-element" onClick={handleNativeStopClick}>
            内层元素 (阻止原生事件传播)
          </div>
        </div>
      </div>

      {/* 日志显示区域 */}
      <div className="section">
        <h3>📝 事件执行日志</h3>
        <button className="clear-btn" onClick={clearLogs}>
          清除日志
        </button>
        <div className="log-area">
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
          {logs.length === 0 && <div>点击上方的元素来查看事件执行顺序...</div>}
        </div>
      </div>

      {/* 代码示例说明 */}
      <div className="section">
        <h3>💡 关键概念总结</h3>

        <h4>如何阻止React合成事件冒泡：</h4>
        <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {`// 阻止React合成事件冒泡
const handleClick = (e) => {
  e.stopPropagation(); // 阻止React合成事件向上冒泡
}

// 阻止原生事件冒泡
const handleClick = (e) => {
  e.nativeEvent.stopPropagation(); // 阻止原生事件冒泡
  e.nativeEvent.stopImmediatePropagation(); // 立即停止原生事件传播
}`}
        </pre>

        <h4>主要区别：</h4>
        <ul>
          <li><strong>事件绑定方式</strong>：合成事件通过JSX属性绑定，原生事件通过addEventListener</li>
          <li><strong>事件对象</strong>：合成事件是React包装后的对象，原生事件是浏览器原生对象</li>
          <li><strong>性能优化</strong>：合成事件使用事件代理和对象池，原生事件直接绑定到DOM</li>
          <li><strong>兼容性</strong>：合成事件统一了跨浏览器差异，原生事件可能存在兼容性问题</li>
          <li><strong>生命周期</strong>：合成事件自动清理，原生事件需要手动清理</li>
        </ul>
      </div>
    </div>
  )
}

export default App 