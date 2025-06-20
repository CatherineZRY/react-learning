import React, { useState, useEffect, useRef } from 'react'

function App() {
  const [logs, setLogs] = useState([])
  const [traditionalItems, setTraditionalItems] = useState(['传统项目 1', '传统项目 2', '传统项目 3'])
  const [reactItems, setReactItems] = useState(['React项目 1', 'React项目 2', 'React项目 3'])
  const [eventCount, setEventCount] = useState({ traditional: 0, react: 1 })

  const traditionalContainerRef = useRef(null)

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const clearLogs = () => {
    setLogs([])
  }

  // 传统方式：每个元素都绑定事件
  useEffect(() => {
    const container = traditionalContainerRef.current
    if (!container) return

    // 清除所有现有的监听器
    const items = container.querySelectorAll('.list-item')

    // 为每个项目单独添加事件监听器
    const handleItemClick = (e) => {
      addLog(`🟡 传统方式 - 点击了: ${e.target.textContent}`)
    }

    items.forEach((item, index) => {
      item.addEventListener('click', handleItemClick)
    })

    // 更新事件监听器数量
    setEventCount(prev => ({ ...prev, traditional: items.length }))

    // 清理函数
    return () => {
      items.forEach(item => {
        item.removeEventListener('click', handleItemClick)
      })
    }
  }, [traditionalItems])

  // React方式：事件代理到根节点
  const handleReactItemClick = (e) => {
    if (e.target.classList.contains('list-item')) {
      addLog(`🔵 React代理 - 点击了: ${e.target.textContent}`)
      addLog(`   事件触发元素: ${e.target.tagName}`)
      addLog(`   事件代理容器: ${e.currentTarget.className}`)
    }
  }

  const addTraditionalItem = () => {
    const newItem = `传统项目 ${traditionalItems.length + 1}`
    setTraditionalItems(prev => [...prev, newItem])
    addLog(`➕ 添加传统项目: ${newItem}`)
  }

  const removeTraditionalItem = () => {
    if (traditionalItems.length > 0) {
      const removed = traditionalItems[traditionalItems.length - 1]
      setTraditionalItems(prev => prev.slice(0, -1))
      addLog(`➖ 移除传统项目: ${removed}`)
    }
  }

  const addReactItem = () => {
    const newItem = `React项目 ${reactItems.length + 1}`
    setReactItems(prev => [...prev, newItem])
    addLog(`➕ 添加React项目: ${newItem}`)
  }

  const removeReactItem = () => {
    if (reactItems.length > 0) {
      const removed = reactItems[reactItems.length - 1]
      setReactItems(prev => prev.slice(0, -1))
      addLog(`➖ 移除React项目: ${removed}`)
    }
  }

  return (
    <div className="demo-container">
      <h1>🎯 React 事件代理机制深度解析</h1>

      {/* 架构图 */}
      <div className="architecture-diagram">
        <h3>React 事件代理架构图</h3>
        <div className="diagram-level level-document">
          📄 Document Level - 原生事件最终冒泡到这里
        </div>
        <div className="diagram-level level-root">
          🏠 React Root Container (#root) - 所有React合成事件在这里统一处理
        </div>
        <div className="diagram-level level-components">
          🧩 React Components - 组件中定义的事件处理器，通过事件代理机制触发
        </div>
      </div>

      {/* 为什么使用事件代理 */}
      <div className="section">
        <h2>🤔 为什么React要将事件绑定到根节点？</h2>
        <div className="advantage-list">
          <h4>主要优势：</h4>
          <ul>
            <li><span className="highlight">性能优化</span>：无论有多少个组件，只需要在根节点绑定一个监听器</li>
            <li><span className="highlight">内存效率</span>：避免了为每个DOM元素创建事件监听器，减少内存占用</li>
            <li><span className="highlight">动态管理</span>：新增或删除组件时，不需要手动管理事件监听器</li>
            <li><span className="highlight">统一处理</span>：所有事件都经过React的统一处理逻辑，确保一致性</li>
            <li><span className="highlight">跨浏览器兼容</span>：在根节点统一处理，更容易实现跨浏览器兼容</li>
            <li><span className="highlight">事件池优化</span>：可以复用事件对象，减少垃圾回收压力</li>
          </ul>
        </div>
      </div>

      {/* 对比演示 */}
      <div className="section">
        <h2>📊 传统方式 vs React事件代理对比</h2>
        <div className="comparison-grid">
          {/* 传统方式 */}
          <div className="traditional-demo">
            <h3>🟡 传统方式 (每个元素绑定)</h3>
            <p>当前事件监听器数量: <strong>{eventCount.traditional}个</strong></p>

            <button className="add-btn" onClick={addTraditionalItem}>
              添加项目
            </button>
            <button className="remove-btn" onClick={removeTraditionalItem}>
              移除项目
            </button>

            <div className="list-container" ref={traditionalContainerRef}>
              {traditionalItems.map((item, index) => (
                <div key={index} className="list-item">
                  {item}
                </div>
              ))}
            </div>

            <div className="performance-stats">
              <strong>性能特点：</strong>
              <ul>
                <li>每个项目都有独立的事件监听器</li>
                <li>添加项目时需要重新绑定事件</li>
                <li>内存使用量随项目数量线性增长</li>
                <li>需要手动管理事件的添加和移除</li>
              </ul>
            </div>
          </div>

          {/* React方式 */}
          <div className="react-demo">
            <h3>🔵 React方式 (事件代理)</h3>
            <p>当前事件监听器数量: <strong>{eventCount.react}个</strong> (固定)</p>

            <button className="add-btn" onClick={addReactItem}>
              添加项目
            </button>
            <button className="remove-btn" onClick={removeReactItem}>
              移除项目
            </button>

            <div className="list-container" onClick={handleReactItemClick}>
              {reactItems.map((item, index) => (
                <div key={index} className="list-item">
                  {item}
                </div>
              ))}
            </div>

            <div className="performance-stats">
              <strong>性能特点：</strong>
              <ul>
                <li>只有一个事件监听器在根容器上</li>
                <li>添加项目无需重新绑定事件</li>
                <li>内存使用量恒定，不随项目数量变化</li>
                <li>React自动管理事件生命周期</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 事件代理工作原理 */}
      <div className="section">
        <h2>⚙️ 事件代理工作原理</h2>
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
          <h4>Step 1: 事件绑定阶段</h4>
          <pre style={{ background: '#fff', padding: '10px', borderRadius: '4px' }}>
            {`// React在渲染时会做这样的事情（简化版）
document.getElementById('root').addEventListener('click', (nativeEvent) => {
  // 1. 找到触发事件的DOM元素
  const targetElement = nativeEvent.target;
  
  // 2. 向上查找React组件树，找到对应的事件处理器
  const syntheticEvent = createSyntheticEvent(nativeEvent);
  
  // 3. 执行对应的React事件处理器
  dispatchEvent(syntheticEvent, targetElement);
});`}
          </pre>

          <h4>Step 2: 事件触发阶段</h4>
          <ol>
            <li>用户点击DOM元素</li>
            <li>浏览器原生事件开始冒泡</li>
            <li>事件冒泡到React根容器</li>
            <li>React识别出触发事件的组件</li>
            <li>React创建合成事件对象</li>
            <li>React调用相应的事件处理函数</li>
          </ol>
        </div>
      </div>

      {/* 性能对比 */}
      <div className="section">
        <h2>📈 性能对比数据</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="performance-stats">
            <h4>🟡 传统方式</h4>
            <ul>
              <li>事件监听器数量: {traditionalItems.length} 个</li>
              <li>内存使用: 随元素数量增长</li>
              <li>管理复杂度: 高（需手动绑定/解绑）</li>
              <li>动态添加成本: 每次都需要重新绑定</li>
            </ul>
          </div>
          <div className="performance-stats">
            <h4>🔵 React事件代理</h4>
            <ul>
              <li>事件监听器数量: 1 个（固定）</li>
              <li>内存使用: 恒定</li>
              <li>管理复杂度: 低（React自动管理）</li>
              <li>动态添加成本: 几乎为0</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 日志区域 */}
      <div className="section">
        <h2>📝 事件执行日志</h2>
        <button className="clear-btn" onClick={clearLogs}>
          清除日志
        </button>
        <div className="log-area">
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
          {logs.length === 0 && (
            <div>点击上方的项目来查看两种方式的事件处理差异...</div>
          )}
        </div>
      </div>

      {/* 总结 */}
      <div className="section">
        <h2>💡 总结</h2>
        <div className="advantage-list">
          <h4>React事件代理的核心价值：</h4>
          <ul>
            <li><strong>扩展性</strong>：无论应用有多复杂，事件处理的开销都是O(1)</li>
            <li><strong>可维护性</strong>：开发者无需关心事件监听器的生命周期管理</li>
            <li><strong>一致性</strong>：所有事件都经过相同的处理流程，行为更可预测</li>
            <li><strong>性能</strong>：在大型应用中显著减少内存使用和提高响应速度</li>
            <li><strong>功能增强</strong>：为React的合成事件系统提供了基础，支持事件池、跨浏览器兼容等特性</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App 