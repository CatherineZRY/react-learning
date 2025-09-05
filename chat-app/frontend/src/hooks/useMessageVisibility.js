import { useState, useEffect, useRef, useCallback } from "react";

const useMessageVisibility = (messages, containerRef) => {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const containerObserver = useRef(null);
  const observeImageMap = useRef(new Map()); // 用于记录被观察的message的id和ref

  // 注册需要新监听的对象
  const registerMessageObserver = useCallback((messageId, messageEl) => {
    if (!observeImageMap.current.has(messageId) && containerObserver.current) {
      observeImageMap.current.set(messageId, messageEl);
      containerObserver.current.observe(messageEl);
      // console.log(`开始观察消息: ${messageId}`, messageEl); // 调试日志
    }
  }, []);

  // 移除需要新监听的对象
  const unregisterMessageObserver = useCallback((messageId) => {
    if (observeImageMap.current.has(messageId) && containerObserver.current) {
      containerObserver.current.unobserve(observeImageMap.current.get(messageId));
      observeImageMap.current.delete(messageId);
      // console.log(`停止观察消息: ${messageId}`); // 调试日志
    }
  }, []);

  // 创建IntersectionObserver
  const initObserver = useCallback(() => {
    // console.log('创建 IntersectionObserver，容器:', containerRef.current);

    containerObserver.current = new IntersectionObserver((entries) => {
      // console.log('Observer 触发，检测到的条目:', entries.length);

      entries.forEach((entry) => {
        const messageId = entry.target.dataset.id;
        // console.log(`消息 ${messageId} - isIntersecting: ${entry.isIntersecting}, intersectionRatio: ${entry.intersectionRatio}`);

        if (entry.isIntersecting) {
          setVisibleMessages((prev) => {
            if (!prev.includes(messageId)) {
              // console.log(`添加可见消息: ${messageId}`);
              return [...prev, messageId];
            }
            return prev;
          });
        } else {
          setVisibleMessages((prev) => {
            const filtered = prev.filter((id) => id !== messageId);
            if (filtered.length !== prev.length) {
              // console.log(`移除可见消息: ${messageId}`);
            }
            return filtered;
          });
        }
      });
    }, {
      root: containerRef.current,  // 🔥 关键：设置聊天容器作为根
      rootMargin: '50px',          // 提前50px开始检测
      threshold: [0, 0.1, 0.5, 1.0] // 多个阈值，便于调试
    });

    // 重新观察已存在的元素
    observeImageMap.current.forEach((element) => {
      if (element && containerObserver.current) {
        containerObserver.current.observe(element);
      }
    });
  }, [containerRef.current]);

  // 清理IntersectionObserver
  const cleanObserver = useCallback(() => {
    if (containerObserver.current) {
      // console.log('清理 IntersectionObserver');
      containerObserver.current.disconnect();
    }
  }, []);

  // 刷新IntersectionObserver对象（解决用户创建后，监听器没有正常监听的问题）
  const refreshObserver = useCallback(() => {
    cleanObserver();
    initObserver();
  }, [cleanObserver, initObserver]);

  useEffect(() => {
    // 等待容器元素可用
    if (!containerRef?.current) {
      // console.log('容器元素还未准备好');
      return () => {
        cleanObserver();
      }
    }
    initObserver();
    return () => {
      cleanObserver();
    }
  }, [containerRef?.current]); // 依赖于容器元素

  useEffect(() => {
    // 删除已经不存在的message的观察者
    const deletedMessages = Array.from(observeImageMap.current.keys()).filter((id) => !messages.some((message) => message._id === id));
    deletedMessages.forEach((id) => {
      unregisterMessageObserver(id);
    });
    // 新增的message的观察者需要在组件中动态绑定ref
  }, [messages, registerMessageObserver, unregisterMessageObserver]);

  return {
    visibleMessages,
    registerMessageObserver,
    refreshObserver
  }
}

export default useMessageVisibility;