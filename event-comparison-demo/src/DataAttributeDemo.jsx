import React, { useState } from 'react'

function DataAttributeDemo() {
  const [logs, setLogs] = useState([])
  const [modals] = useState([
    { id: 'modal1', title: '确认删除', content: '你确定要删除这个项目吗？' },
    { id: 'modal2', title: '保存更改', content: '是否保存当前的更改？' },
    { id: 'modal3', title: '退出应用', content: '确定要退出应用程序吗？' }
  ])

  // 添加日志
  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  // 统一的模态框点击处理函数
  const handleModalClick = (e) => {
    // 获取 data-modal-id（从最近的 .modal 元素）
    const modalElement = e.target.closest('.modal')
    const modalId = modalElement?.dataset.modalId

    // 获取 data-action（从点击的元素）
    const action = e.target.dataset.action

    addLog(`📍 点击元素: ${e.target.tagName}`)
    addLog(`🆔 模态框ID: ${modalId || '未找到'}`)
    addLog(`⚡ 动作类型: ${action || '未定义'}`)

    if (action === 'close') {
      addLog(`🚪 关闭模态框: ${modalId}`)
      closeModal(modalId)
    } else if (action === 'confirm') {
      addLog(`✅ 确认模态框: ${modalId}`)
      confirmModal(modalId)
    } else if (action === 'cancel') {
      addLog(`❌ 取消模态框: ${modalId}`)
      cancelModal(modalId)
    }

    addLog('---')
  }

  const closeModal = (modalId) => {
    addLog(`🔒 执行关闭操作 - Modal: ${modalId}`)
  }

  const confirmModal = (modalId) => {
    addLog(`✨ 执行确认操作 - Modal: ${modalId}`)
  }

  const cancelModal = (modalId) => {
    addLog(`🔄 执行取消操作 - Modal: ${modalId}`)
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className="data-demo-container">
      <h2>📊 Data-* 属性演示</h2>

      <div className="explanation">
        <h4>💡 什么是 data-* 属性？</h4>
        <ul>
          <li><strong>data-modal-id</strong>: 存储模态框的唯一标识符</li>
          <li><strong>data-action</strong>: 存储按钮的行为类型</li>
          <li><strong>事件委托</strong>: 在父元素上统一处理子元素事件</li>
          <li><strong>dataset API</strong>: 通过 element.dataset 访问 data-* 属性</li>
        </ul>
      </div>

      <div className="modals-container">
        {modals.map(modal => (
          <div
            key={modal.id}
            className="modal"
            data-modal-id={modal.id}
            onClick={handleModalClick}
          >
            <div className="modal-content">
              <h3>{modal.title}</h3>
              <p>{modal.content}</p>
              <div className="button-group">
                <button
                  className="confirm-btn"
                  data-action="confirm"
                >
                  确认
                </button>
                <button
                  className="cancel-btn"
                  data-action="cancel"
                >
                  取消
                </button>
                <button
                  className="close-btn"
                  data-action="close"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="code-example">
        <h4>📋 关键代码解析：</h4>
        <pre>{`// HTML 渲染结果：
<div class="modal" data-modal-id="modal1">
  <button data-action="confirm">确认</button>
  <button data-action="close">关闭</button>
</div>

// JavaScript 中获取 data 属性：
const modalId = e.target.closest('.modal').dataset.modalId
const action = e.target.dataset.action

// data-modal-id="modal1" → dataset.modalId
// data-action="confirm" → dataset.action`}</pre>
      </div>

      <div className="logs-section">
        <h4>📝 点击日志（观察 data 属性的使用）</h4>
        <button onClick={clearLogs} className="clear-btn">清除日志</button>
        <div className="log-area">
          {logs.map((log, index) => (
            <div key={index} className="log-item">{log}</div>
          ))}
          {logs.length === 0 && (
            <div className="empty-log">点击上面的按钮查看 data 属性的工作原理...</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DataAttributeDemo 