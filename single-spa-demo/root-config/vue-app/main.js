// Vue 微应用 - SystemJS 6.x 兼容版本
System.register([], function (exports) {
  'use strict';

  let vueRootComponent = null;

  // Single-SPA 生命周期函数：bootstrap
  async function bootstrap(props) {
    console.log('🎯 Vue 微应用正在启动...', props);
    return Promise.resolve();
  }

  // Single-SPA 生命周期函数：mount
  async function mount(props) {
    console.log('🔧 Vue 微应用正在挂载...', props);

    // 创建 Vue 应用的 HTML 结构
    const appContainer = document.createElement('div');
    appContainer.id = 'vue-micro-app';
    appContainer.innerHTML = `
        <div style="
            padding: 20px;
            background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
            border-radius: 10px;
            color: white;
            margin-bottom: 20px;
        ">
            <h2>🎯 Vue 微应用 (SystemJS 6.x 兼容版)</h2>
            <p>这是使用 SystemJS 6.x System.register 格式开发的 Vue 微应用</p>
            <div style="margin-top: 20px;">
                <h3>技术特性：</h3>
                <ul>
                    <li>✅ SystemJS 6.x System.register 格式</li>
                    <li>✅ 浏览器原生支持，无需转译</li>
                    <li>✅ const/let 块级作用域</li>
                    <li>✅ 箭头函数</li>
                    <li>✅ 模板字符串</li>
                    <li>✅ 解构赋值</li>
                    <li>✅ async/await</li>
                    <li>✅ 可选链操作符</li>
                </ul>
            </div>
            <div style="margin-top: 20px;">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">输入你的名字：</label>
                    <input id="vue-name-input" type="text" placeholder="请输入..." style="
                        padding: 8px 12px;
                        border: none;
                        border-radius: 4px;
                        width: 200px;
                        font-size: 14px;
                    ">
                </div>
                <p style="font-size: 18px; margin: 10px 0;">
                    你好，<span id="vue-greeting" style="font-weight: bold; color: #42b883;">访客</span>！
                </p>
            </div>
            <div style="margin-top: 20px;">
                <h4>待办事项：</h4>
                <div style="margin-bottom: 10px;">
                    <input id="vue-todo-input" type="text" placeholder="添加新任务..." style="
                        padding: 8px 12px;
                        border: none;
                        border-radius: 4px;
                        width: 150px;
                        font-size: 14px;
                        margin-right: 10px;
                    ">
                    <button id="vue-add-todo" style="
                        background: rgba(255,255,255,0.2);
                        border: 2px solid white;
                        color: white;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                    ">添加</button>
                </div>
                <ul id="vue-todo-list" style="list-style: none; padding: 0; margin: 10px 0;">
                    <!-- 待办事项将在这里显示 -->
                </ul>
            </div>
            <div style="margin-top: 15px; font-size: 12px; opacity: 0.7;">
                <p>应用状态: <span style="color: #4CAF50;">✅ 运行中</span></p>
                <p>挂载时间: ${new Date().toLocaleTimeString('zh-CN')}</p>
                <p>模块格式: SystemJS 6.x System.register</p>
            </div>
        </div>
    `;

    // 挂载到容器
    if (props.domElement) {
      props.domElement.innerHTML = '';
      props.domElement.appendChild(appContainer);
    }

    // Vue 风格的响应式功能实现 - 使用现代语法
    const state = {
      name: '',
      todos: ['学习 SystemJS 6.x', '掌握 System.register', '实践微前端架构']
    };

    // 使用解构赋值获取 DOM 元素
    const nameInput = document.getElementById('vue-name-input');
    const greeting = document.getElementById('vue-greeting');
    const todoInput = document.getElementById('vue-todo-input');
    const addTodoBtn = document.getElementById('vue-add-todo');
    const todoList = document.getElementById('vue-todo-list');

    // 渲染待办列表 - 使用箭头函数
    const renderTodos = () => {
      if (todoList) {
        todoList.innerHTML = state.todos.map((todo, index) => `
                <li style="
                    background: rgba(255,255,255,0.1);
                    padding: 8px 12px;
                    margin: 5px 0;
                    border-radius: 4px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <span>${todo}</span>
                    <button onclick="window.vueRemoveTodo && window.vueRemoveTodo(${index})" style="
                        background: transparent;
                        border: 1px solid rgba(255,255,255,0.5);
                        color: white;
                        padding: 2px 8px;
                        border-radius: 3px;
                        cursor: pointer;
                        font-size: 12px;
                    ">删除</button>
                </li>
            `).join('');
      }
    };

    // 事件监听器函数 - 使用箭头函数
    const handleNameInput = (e) => {
      state.name = e.target.value;
      if (greeting) {
        greeting.textContent = state.name || '访客';
      }
    };

    const handleAddTodo = () => {
      const newTodo = todoInput?.value.trim();
      if (newTodo) {
        state.todos.push(newTodo);
        if (todoInput) {
          todoInput.value = '';
        }
        renderTodos();
      }
    };

    const handleTodoKeypress = (e) => {
      if (e.key === 'Enter') {
        handleAddTodo();
      }
    };

    // 添加事件监听 - 使用现代语法
    nameInput?.addEventListener('input', handleNameInput);
    addTodoBtn?.addEventListener('click', handleAddTodo);
    todoInput?.addEventListener('keypress', handleTodoKeypress);

    // 全局删除函数
    window.vueRemoveTodo = (index) => {
      state.todos.splice(index, 1);
      renderTodos();
    };

    // 初始渲染
    renderTodos();

    // 保存组件引用
    vueRootComponent = {
      appContainer,
      state,
      elements: {
        nameInput,
        greeting,
        todoInput,
        addTodoBtn,
        todoList
      },
      handlers: {
        handleNameInput,
        handleAddTodo,
        handleTodoKeypress
      },
      cleanup: () => {
        // 清理事件监听器
        nameInput?.removeEventListener('input', handleNameInput);
        addTodoBtn?.removeEventListener('click', handleAddTodo);
        todoInput?.removeEventListener('keypress', handleTodoKeypress);

        // 清理全局函数
        delete window.vueRemoveTodo;
      }
    };

    console.log('✅ Vue 微应用挂载完成');
    return Promise.resolve();
  }

  // Single-SPA 生命周期函数：unmount
  async function unmount(props) {
    console.log('🔄 Vue 微应用正在卸载...', props);

    // 清理资源
    if (vueRootComponent) {
      vueRootComponent.cleanup();
      vueRootComponent.appContainer?.remove();
      vueRootComponent = null;
    }

    // 清空容器
    if (props.domElement) {
      props.domElement.innerHTML = '<div class="loading">🚀 正在加载微前端应用...</div>';
    }

    console.log('✅ Vue 微应用卸载完成');
    return Promise.resolve();
  }

  // SystemJS 6.x 导出格式
  return {
    execute: function () {
      exports('bootstrap', bootstrap);
      exports('mount', mount);
      exports('unmount', unmount);
    }
  };
}); 