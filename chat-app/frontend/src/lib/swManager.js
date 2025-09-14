// Service Worker 管理器
class ServiceWorkerManager {
  constructor() {
    this.registration = null;
    this.isSupported = 'serviceWorker' in navigator;
    this.cacheStatusListeners = new Set();
    this.isRegistered = false;
  }

  // 注册Service Worker
  async register() {
    if (!this.isSupported) {
      console.warn('当前浏览器不支持Service Worker');
      return false;
    }

    if (this.isRegistered) {
      console.log('Service Worker已经注册');
      return true;
    }

    try {
      // 只在开发环境注册
      if (import.meta.env.DEV) {
        this.registration = await navigator.serviceWorker.register('/sw-dev.js', {
          scope: '/'
        });

        console.log('Service Worker注册成功:', this.registration.scope);

        // 监听Service Worker消息
        navigator.serviceWorker.addEventListener('message', this.handleMessage.bind(this));

        // 监听Service Worker状态变化
        this.registration.addEventListener('updatefound', () => {
          console.log('发现新的Service Worker版本');
        });

        this.isRegistered = true;
        return true;
      } else {
        console.log('生产环境跳过Service Worker注册');
        return false;
      }
    } catch (error) {
      console.error('Service Worker注册失败:', error);
      return false;
    }
  }

  // 处理Service Worker消息
  handleMessage(event) {
    const { type, status, url, timestamp } = event.data;

    if (type === 'CACHE_STATUS') {
      // 通知所有监听器
      this.cacheStatusListeners.forEach(listener => {
        listener({ status, url, timestamp });
      });
    }
  }

  // 添加缓存状态监听器
  addCacheStatusListener(listener) {
    this.cacheStatusListeners.add(listener);
    return () => this.cacheStatusListeners.delete(listener);
  }

  // 清理缓存
  async clearCache(pattern) {
    if (!this.isRegistered) return;

    try {
      navigator.serviceWorker.controller?.postMessage({
        type: 'CLEAR_CACHE',
        payload: { pattern }
      });
      console.log('缓存清理请求已发送');
    } catch (error) {
      console.error('清理缓存失败:', error);
    }
  }

  // 获取缓存信息
  async getCacheInfo() {
    if (!this.isRegistered) return null;

    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();

      messageChannel.port1.onmessage = (event) => {
        resolve(event.data);
      };

      messageChannel.port1.onerror = (error) => {
        reject(error);
      };

      navigator.serviceWorker.controller?.postMessage(
        { type: 'GET_CACHE_INFO' },
        [messageChannel.port2]
      );

      // 超时处理
      setTimeout(() => {
        reject(new Error('获取缓存信息超时'));
      }, 5000);
    });
  }

  // 更新缓存持续时间
  async updateCacheDuration(duration) {
    if (!this.isRegistered) return;

    try {
      navigator.serviceWorker.controller?.postMessage({
        type: 'UPDATE_CACHE_DURATION',
        payload: { duration }
      });
      console.log('缓存时间已更新为:', duration / 1000, '秒');
    } catch (error) {
      console.error('更新缓存时间失败:', error);
    }
  }

  // 注销Service Worker
  async unregister() {
    if (!this.registration) return;

    try {
      await this.registration.unregister();
      this.registration = null;
      this.isRegistered = false;
      console.log('Service Worker已注销');
    } catch (error) {
      console.error('注销Service Worker失败:', error);
    }
  }
}

// 创建全局实例
export const swManager = new ServiceWorkerManager();

// 开发环境自动注册
if (import.meta.env.DEV) {
  swManager.register().then(success => {
    if (success) {
      console.log('✅ Service Worker缓存已启用，开发效率将得到提升！');
    }
  });
}

export default swManager;
