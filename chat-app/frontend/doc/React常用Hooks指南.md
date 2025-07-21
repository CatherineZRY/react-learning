# React 常用 Hooks 指南

除了 `useEffect`，React 还提供了一系列功能强大且常用的 Hooks。这份文档将为您逐一介绍它们的核心用途和适用场景。

---

## 1. `useState`

-   **一句话概括**：在函数组件中添加和管理局部状态（state）。

-   **解决了什么问题**：解决了函数组件本身无法拥有和维护自身状态的问题，是让函数组件“活起来”的基础。

-   **基本语法**：
    ```jsx
    const [state, setState] = useState(initialState);
    ```
    它返回一个包含两个元素的数组：当前的状态值 `state` 和一个用于更新该状态的函数 `setState`。

-   **何时使用**：
    -   管理组件内部的简单数据，如计数器、开关状态、表单输入值等。
    -   几乎所有需要根据用户交互或内部逻辑改变并更新 UI 的场景。

---

## 2. `useContext`

-   **一句话概括**：无需通过 props 层层传递，就能在组件树中轻松访问和共享全局状态。

-   **解决了什么问题**：解决了“属性透传（Prop Drilling）”的烦恼。当深层嵌套的子组件需要顶层组件的状态时，无需再将 props 一层一层地手动传递下去。

-   **基本语法**：
    ```jsx
    // 1. 创建一个 Context 对象
    const MyContext = React.createContext(defaultValue);

    // 2. 在顶层组件使用 Provider 包裹子组件，并通过 value 传递数据
    <MyContext.Provider value={/* 共享的数据 */}>
      <App />
    </MyContext.Provider>

    // 3. 在任何子组件中使用 useContext 获取数据
    const sharedValue = useContext(MyContext);
    ```

-   **何时使用**：
    -   全局主题切换（如深色/浅色模式）。
    -   用户认证信息（如用户名、登录状态）。
    -   多语言配置。

---

## 3. `useReducer`

-   **一句话概括**：`useState` 的替代方案，特别适合管理复杂的状态逻辑。

-   **解决了什么问题**：当一个状态对象包含多个子值，或者下一个状态依赖于前一个状态且逻辑复杂时，使用 `useState` 会让更新逻辑变得分散和混乱。`useReducer` 可以将所有更新逻辑聚合到一个地方（`reducer` 函数中），让代码更清晰、可维护。

-   **基本语法**：
    ```jsx
    const initialState = { count: 0 };

    function reducer(state, action) {
      switch (action.type) {
        case 'increment':
          return { count: state.count + 1 };
        case 'decrement':
          return { count: state.count - 1 };
        default:
          throw new Error();
      }
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    // 在组件中通过 dispatch 触发状态更新
    // dispatch({ type: 'increment' });
    ```

-   **何时使用**：
    -   状态逻辑复杂，有多种不同的更新“动作”（actions）。
    -   下一个 state 严重依赖于上一个 state。
    -   大型表单的状态管理。

---

## 4. `useMemo`

-   **一句话概括**：”记住“一个昂贵的计算结果，只有在依赖项改变时才重新计算。

-   **解决了什么问题**：避免在每次组件渲染时都重复执行开销大的计算，从而优化性能。

-   **基本语法**：
    ```jsx
    const memoizedValue = useMemo(() => {
      // 执行一个昂贵的计算...
      return computeExpensiveValue(a, b);
    }, [a, b]); // 仅当 a 或 b 改变时才重新计算
    ```

-   **何时使用**：
    -   对一个巨大的数组进行过滤、排序或映射。
    -   需要大量计算才能得出的派生数据。
    -   当你需要将一个对象或数组传递给子组件，并希望通过保持引用不变来防止子组件不必要的重渲染时。

---

## 5. `useCallback`

-   **一句话概括**：”记住“一个函数，只有在依赖项改变时才重新创建该函数。

-   **解决了什么问题**：防止因组件重渲染导致函数被重新创建，从而避免将新的函数引用传递给子组件，导致子组件（尤其是被 `React.memo` 优化的组件）发生不必要的重渲染。

-   **基本语法**：
    ```jsx
    const memoizedCallback = useCallback(() => {
      doSomething(a, b);
    }, [a, b]); // 仅当 a 或 b 改变时才重新创建函数
    ```

-   **何时使用**：
    -   将函数作为 `props` 传递给经过 `React.memo` 优化的子组件。
    -   当函数是 `useEffect` 的依赖项，为了防止 `useEffect` 无限执行时。

---

## 6. `useRef`

-   **一句话概括**：创建一个可变的、在组件整个生命周期内都保持不变的引用对象。

-   **解决了什么问题**：
    1.  需要直接访问 DOM 元素（如获取输入框焦点、播放视频）。
    2.  需要存储一个值，但这个值的改变 **不应该** 触发组件重新渲染（例如存储定时器的 ID）。

-   **基本语法**：
    ```jsx
    const myRef = useRef(initialValue);

    // 访问 DOM
    // <input ref={myRef} />

    // 在代码中访问
    // myRef.current.focus();
    ```
    `useRef` 返回一个可变的对象，其 `.current` 属性被初始化为传入的参数。

-   **何时使用**：
    -   管理 DOM 元素的焦点、文本选择或媒体播放。
    -   存储上一次的 `state` 或 `props` 值。
    -   存储和管理 `setTimeout` 或 `setInterval` 的 ID。 