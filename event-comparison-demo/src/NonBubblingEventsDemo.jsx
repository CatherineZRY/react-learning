import React, { useState, useEffect, useRef } from 'react'

function NonBubblingEventsDemo() {
  const [logs, setLogs] = useState([])
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [scrollPosition, setScrollPosition] = useState(0)
  const [focusedElement, setFocusedElement] = useState('')

  const scrollAreaRef = useRef(null)
  const input1Ref = useRef(null)
  const input2Ref = useRef(null)
  const input3Ref = useRef(null)

  // 添加日志
  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  // 1. Focus/Blur 事件演示
  const handleFocus1 = (e) => {
    setFocusedElement('输入框1')
    addLog('🎯 Focus事件 - 输入框1获得焦点')
    addLog('   注意：Focus事件不会冒泡，React直接绑定在元素上')
  }

  const handleBlur1 = (e) => {
    addLog('🔄 Blur事件 - 输入框1失去焦点')
    addLog('   注意：Blur事件也不会冒泡')
  }

  const handleFocus2 = (e) => {
    setFocusedElement('输入框2')
    addLog('🎯 Focus事件 - 输入框2获得焦点')
  }

  const handleFocus3 = (e) => {
    setFocusedElement('输入框3')
    addLog('🎯 Focus事件 - 输入框3获得焦点')
  }

  // 2. Scroll 事件演示
  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop
    setScrollPosition(scrollTop)
    addLog(`📜 Scroll事件 - 滚动位置: ${scrollTop}px`)
    addLog('   注意：Scroll事件在特定元素上触发，不适合事件代理')
  }

  // 3. Window Resize 事件演示
  useEffect(() => {
    const handleResize = () => {
      const newSize = {
        width: window.innerWidth,
        height: window.innerHeight
      }
      setWindowSize(newSize)
      addLog(`📐 Resize事件 - 窗口大小: ${newSize.width} x ${newSize.height}`)
      addLog('   注意：Resize事件只在window对象上触发')
    }

    // 初始化窗口大小
    handleResize()

    // 添加resize监听器
    window.addEventListener('resize', handleResize)
    addLog('🔧 已添加window resize事件监听器（直接绑定）')

    return () => {
      window.removeEventListener('resize', handleResize)
      addLog('🧹 清理window resize事件监听器')
    }
  }, [])

  // 4. Load 事件演示（图片加载）
  const handleImageLoad = (e) => {
    addLog('🖼️ Image Load事件 - 图片加载完成')
    addLog('   注意：Load事件不冒泡，只在目标元素上触发')
  }

  const handleImageError = (e) => {
    addLog('❌ Image Error事件 - 图片加载失败')
  }

  // 5. 演示事件代理 vs 直接绑定的区别
  const handleClickableArea = (e) => {
    addLog('✅ Click事件 - 这个事件使用事件代理')
    addLog(`   事件目标: ${e.target.className}`)
    addLog(`   当前目标: ${e.currentTarget.className}`)
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className="non-bubbling-demo-container">
      <h2>🚫 非冒泡事件处理演示</h2>

      <div className="explanation-panel">
        <h4>🧠 为什么某些事件不能使用事件代理？</h4>
        <div className="reason-grid">
          <div className="reason-item">
            <h5>🎯 Focus/Blur 事件</h5>
            <ul>
              <li><strong>不冒泡</strong>：这些事件不会向上冒泡到父元素</li>
              <li><strong>目标特定</strong>：只在可聚焦元素上触发</li>
              <li><strong>React策略</strong>：直接在目标元素上绑定监听器</li>
            </ul>
          </div>
          <div className="reason-item">
            <h5>📜 Scroll 事件</h5>
            <ul>
              <li><strong>元素特定</strong>：只在有滚动条的元素上触发</li>
              <li><strong>性能考虑</strong>：高频触发，需要节流处理</li>
              <li><strong>React策略</strong>：直接绑定，避免不必要的冒泡</li>
            </ul>
          </div>
          <div className="reason-item">
            <h5>📐 Resize 事件</h5>
            <ul>
              <li><strong>Window专属</strong>：只在window对象上触发</li>
              <li><strong>全局性质</strong>：不存在冒泡概念</li>
              <li><strong>React策略</strong>：需要手动管理window监听器</li>
            </ul>
          </div>
          <div className="reason-item">
            <h5>🖼️ Load/Error 事件</h5>
            <ul>
              <li><strong>不冒泡</strong>：这些事件不会冒泡</li>
              <li><strong>资源特定</strong>：与特定资源加载相关</li>
              <li><strong>React策略</strong>：直接在目标元素绑定</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="status-panel">
        <h4>📊 当前状态</h4>
        <div className="status-grid">
          <div className="status-item">
            <span className="status-label">当前焦点:</span>
            <span className="status-value">{focusedElement || '无'}</span>
          </div>
          <div className="status-item">
            <span className="status-label">窗口大小:</span>
            <span className="status-value">{windowSize.width} x {windowSize.height}</span>
          </div>
          <div className="status-item">
            <span className="status-label">滚动位置:</span>
            <span className="status-value">{scrollPosition}px</span>
          </div>
        </div>
      </div>

      <div className="demo-sections">
        {/* Focus/Blur 事件演示 */}
        <div className="demo-section">
          <h4>🎯 Focus/Blur 事件演示（直接绑定）</h4>
          <p>这些事件不冒泡，React会直接在元素上绑定监听器</p>
          <div className="focus-demo">
            <input
              ref={input1Ref}
              type="text"
              placeholder="输入框1 - 点击获得焦点"
              onFocus={handleFocus1}
              onBlur={handleBlur1}
              className="focus-input"
            />
            <input
              ref={input2Ref}
              type="text"
              placeholder="输入框2"
              onFocus={handleFocus2}
              className="focus-input"
            />
            <input
              ref={input3Ref}
              type="text"
              placeholder="输入框3"
              onFocus={handleFocus3}
              className="focus-input"
            />
          </div>
        </div>

        {/* Scroll 事件演示 */}
        <div className="demo-section">
          <h4>📜 Scroll 事件演示（直接绑定）</h4>
          <p>滚动事件在特定元素上触发，不适合事件代理</p>
          <div
            ref={scrollAreaRef}
            className="scroll-area"
            onScroll={handleScroll}
          >
            <div className="scroll-content">
              <h5>可滚动内容区域</h5>
              <p>这是一个可滚动的区域。滚动这个区域会触发scroll事件。</p>
              <p>注意：Scroll事件直接绑定在这个div元素上，不使用事件代理。</p>
              <div className="filler-content">
                {Array.from({ length: 20 }, (_, i) => (
                  <p key={i}>内容行 {i + 1} - 继续滚动查看更多内容...</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Load 事件演示 */}
        <div className="demo-section">
          <h4>🖼️ Load/Error 事件演示（直接绑定）</h4>
          <p>资源加载事件不冒泡，需要直接绑定</p>
          <div className="load-demo">
            <img
              src="https://picsum.photos/200/150?random=1"
              alt="测试图片1"
              onLoad={handleImageLoad}
              onError={handleImageError}
              className="demo-image"
            />
            <img
              src="https://picsum.photos/200/150?random=2"
              alt="测试图片2"
              onLoad={handleImageLoad}
              onError={handleImageError}
              className="demo-image"
            />
          </div>
        </div>

        {/* 对比：使用事件代理的点击事件 */}
        <div className="demo-section">
          <h4>✅ 对比：Click 事件（使用事件代理）</h4>
          <p>点击事件会冒泡，适合使用事件代理</p>
          <div className="clickable-area" onClick={handleClickableArea}>
            <div className="clickable-item">点击区域1</div>
            <div className="clickable-item">点击区域2</div>
            <div className="clickable-item">点击区域3</div>
          </div>
        </div>
      </div>

      <div className="mechanism-explanation">
        <h4>🔧 React的处理机制总结</h4>
        <div className="mechanism-grid">
          <div className="mechanism-item bubbling">
            <h5>✅ 冒泡事件（事件代理）</h5>
            <div className="event-list">
              <span className="event-tag">click</span>
              <span className="event-tag">change</span>
              <span className="event-tag">submit</span>
              <span className="event-tag">mouseover</span>
              <span className="event-tag">keydown</span>
            </div>
            <p><strong>处理方式：</strong>在document上统一监听，通过事件代理分发</p>
          </div>
          <div className="mechanism-item non-bubbling">
            <h5>🚫 非冒泡事件（直接绑定）</h5>
            <div className="event-list">
              <span className="event-tag">focus</span>
              <span className="event-tag">blur</span>
              <span className="event-tag">scroll</span>
              <span className="event-tag">load</span>
              <span className="event-tag">resize</span>
            </div>
            <p><strong>处理方式：</strong>直接在目标元素上绑定监听器</p>
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
            <div className="empty-log">与上面的组件交互查看不同事件的处理方式...</div>
          )}
        </div>
      </div>

      <div className="summary">
        <h4>💡 关键要点</h4>
        <div className="summary-points">
          <div className="point">
            <strong>🎯 智能选择：</strong> React会根据事件类型选择最合适的绑定策略
          </div>
          <div className="point">
            <strong>⚡ 性能优化：</strong> 冒泡事件用代理，非冒泡事件直接绑定
          </div>
          <div className="point">
            <strong>🔄 自动管理：</strong> 无论哪种方式，React都会自动管理监听器的生命周期
          </div>
          <div className="point">
            <strong>🚀 开发体验：</strong> 开发者可以统一使用JSX语法，React在底层处理复杂性
          </div>
        </div>
      </div>
    </div>
  )
}

export default NonBubblingEventsDemo 