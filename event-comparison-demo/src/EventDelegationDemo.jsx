import React, { useState, useEffect } from 'react'

function EventDelegationDemo() {
  const [logs, setLogs] = useState([])
  const [listenerCount, setListenerCount] = useState(0)

  // 添加日志
  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  // 检测实际的事件监听器数量
  useEffect(() => {
    // 检查document上的事件监听器
    const checkListeners = () => {
      // 模拟检测（实际浏览器中可以用开发者工具看到）
      setListenerCount(1) // React在document上只绑定一个click监听器
      addLog('🔍 React已在document上绑定1个click事件监听器')
    }

    checkListeners()
  }, [])

  // 模态框数据
  const modals = [
    { id: 'modal1', title: '模态框 1', color: '#ff6b6b' },
    { id: 'modal2', title: '模态框 2', color: '#4ecdc4' },
    { id: 'modal3', title: '模态框 3', color: '#45b7d1' }
  ]

  // 事件处理函数 - 模态框1
  const handleModal1Click = (e) => {
    addLog('🎯 React找到并调用 handleModal1Click')
    addLog(`   点击的元素: ${e.target.tagName}`)
    addLog(`   模态框ID: modal1`)
  }

  // 事件处理函数 - 模态框2
  const handleModal2Click = (e) => {
    addLog('🎯 React找到并调用 handleModal2Click')
    addLog(`   点击的元素: ${e.target.tagName}`)
    addLog(`   模态框ID: modal2`)
  }

  // 事件处理函数 - 模态框3
  const handleModal3Click = (e) => {
    addLog('🎯 React找到并调用 handleModal3Click')
    addLog(`   点击的元素: ${e.target.tagName}`)
    addLog(`   模态框ID: modal3`)
  }

  // 演示原生事件监听器对比
  useEffect(() => {
    const nativeElement1 = document.getElementById('native-demo-1')
    const nativeElement2 = document.getElementById('native-demo-2')
    const nativeElement3 = document.getElementById('native-demo-3')

    const handler1 = () => addLog('🔵 原生事件监听器 1 被调用')
    const handler2 = () => addLog('🔵 原生事件监听器 2 被调用')
    const handler3 = () => addLog('🔵 原生事件监听器 3 被调用')

    if (nativeElement1) nativeElement1.addEventListener('click', handler1)
    if (nativeElement2) nativeElement2.addEventListener('click', handler2)
    if (nativeElement3) nativeElement3.addEventListener('click', handler3)

    addLog('🔵 添加了3个原生事件监听器到各自的DOM元素上')

    return () => {
      if (nativeElement1) nativeElement1.removeEventListener('click', handler1)
      if (nativeElement2) nativeElement2.removeEventListener('click', handler2)
      if (nativeElement3) nativeElement3.removeEventListener('click', handler3)
    }
  }, [])

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className="delegation-demo-container">
      <h2>🔄 React 事件代理机制深度解析</h2>

      <div className="explanation-panel">
        <h4>🧠 核心原理解释</h4>
        <div className="principle-grid">
          <div className="principle-item react-way">
            <h5>🟢 React 事件代理方式</h5>
            <ul>
              <li><strong>1个</strong> click 监听器在 document 上</li>
              <li>事件冒泡到 document 被 React 捕获</li>
              <li>React 根据 target 查找对应组件</li>
              <li>调用相应的事件处理函数</li>
              <li><span className="highlight">内存效率高</span></li>
            </ul>
          </div>
          <div className="principle-item native-way">
            <h5>🔵 原生事件绑定方式</h5>
            <ul>
              <li><strong>N个</strong> 监听器直接绑定到元素上</li>
              <li>每个元素都有自己的监听器</li>
              <li>事件在元素上直接触发</li>
              <li>需要手动管理监听器生命周期</li>
              <li><span className="highlight">内存占用较多</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="listener-info">
        <h4>📊 当前事件监听器统计</h4>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">React在document上的监听器:</span>
            <span className="stat-value react">{listenerCount} 个</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">原生监听器（对比）:</span>
            <span className="stat-value native">3 个</span>
          </div>
        </div>
      </div>

      <div className="demo-sections">
        <div className="demo-section">
          <h4>🟢 React 事件代理演示（3个组件，1个监听器）</h4>
          <p>虽然有3个 onClick 处理函数，但document上只有1个监听器</p>
          <div className="modals-grid">
            <div
              className="demo-modal"
              style={{ borderColor: modals[0].color }}
              onClick={handleModal1Click}
            >
              <h5>{modals[0].title}</h5>
              <p>onClick={'{handleModal1Click}'}</p>
            </div>
            <div
              className="demo-modal"
              style={{ borderColor: modals[1].color }}
              onClick={handleModal2Click}
            >
              <h5>{modals[1].title}</h5>
              <p>onClick={'{handleModal2Click}'}</p>
            </div>
            <div
              className="demo-modal"
              style={{ borderColor: modals[2].color }}
              onClick={handleModal3Click}
            >
              <h5>{modals[2].title}</h5>
              <p>onClick={'{handleModal3Click}'}</p>
            </div>
          </div>
        </div>

        <div className="demo-section">
          <h4>🔵 原生事件监听器对比（3个监听器）</h4>
          <p>每个元素都有自己的addEventListener监听器</p>
          <div className="modals-grid">
            <div id="native-demo-1" className="demo-modal native" style={{ borderColor: '#666' }}>
              <h5>原生监听器 1</h5>
              <p>addEventListener('click', handler1)</p>
            </div>
            <div id="native-demo-2" className="demo-modal native" style={{ borderColor: '#666' }}>
              <h5>原生监听器 2</h5>
              <p>addEventListener('click', handler2)</p>
            </div>
            <div id="native-demo-3" className="demo-modal native" style={{ borderColor: '#666' }}>
              <h5>原生监听器 3</h5>
              <p>addEventListener('click', handler3)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="workflow-explanation">
        <h4>🔍 React 事件代理工作流程</h4>
        <div className="workflow-steps">
          <div className="step">
            <span className="step-number">1</span>
            <div className="step-content">
              <strong>用户点击元素</strong>
              <p>比如点击"模态框 1"</p>
            </div>
          </div>
          <div className="arrow">→</div>
          <div className="step">
            <span className="step-number">2</span>
            <div className="step-content">
              <strong>事件冒泡到document</strong>
              <p>所有点击事件都会冒泡到顶层</p>
            </div>
          </div>
          <div className="arrow">→</div>
          <div className="step">
            <span className="step-number">3</span>
            <div className="step-content">
              <strong>React监听器捕获</strong>
              <p>document上的统一监听器处理</p>
            </div>
          </div>
          <div className="arrow">→</div>
          <div className="step">
            <span className="step-number">4</span>
            <div className="step-content">
              <strong>查找目标组件</strong>
              <p>根据event.target找到React组件</p>
            </div>
          </div>
          <div className="arrow">→</div>
          <div className="step">
            <span className="step-number">5</span>
            <div className="step-content">
              <strong>调用对应处理函数</strong>
              <p>执行handleModal1Click</p>
            </div>
          </div>
        </div>
      </div>

      <div className="logs-section">
        <h4>📝 事件处理日志</h4>
        <button onClick={clearLogs} className="clear-btn">清除日志</button>
        <div className="log-area">
          {logs.map((log, index) => (
            <div key={index} className="log-item">{log}</div>
          ))}
          {logs.length === 0 && (
            <div className="empty-log">点击上面的模态框查看事件代理工作过程...</div>
          )}
        </div>
      </div>

      <div className="summary">
        <h4>💡 总结</h4>
        <div className="summary-points">
          <div className="point">
            <strong>❓ 你的疑问：</strong> 三个模态框是否会有三个事件监听器？
          </div>
          <div className="point">
            <strong>✅ 答案：</strong> 不会！React 只在 document 上绑定 <strong>1个</strong> click 监听器
          </div>
          <div className="point">
            <strong>🔧 机制：</strong> 事件冒泡 → React捕获 → 查找组件 → 调用处理函数
          </div>
          <div className="point">
            <strong>🚀 优势：</strong> 内存效率高、性能好、自动管理生命周期
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDelegationDemo 