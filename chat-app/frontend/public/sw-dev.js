// 开发环境专用的Service Worker
// 主要用于缓存API响应以提高开发效率

const CACHE_NAME = 'chat-app-dev-cache-v1';
const API_CACHE_NAME = 'chat-app-api-cache-v1';
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存时间

// 需要缓存的API端点模式
const API_PATTERNS = [
  /\/api\/auth\/check/,
  /\/api\/users/,
  /\/api\/messages/,
  /\/api\/profile/,
];

// 不缓存的API端点（实时性要求高的接口）
const NO_CACHE_PATTERNS = [
  /\/api\/auth\/login/,
  /\/api\/auth\/logout/,
  /\/api\/auth\/signup/,
  /\/api\/messages\/send/,
  /\/api\/socket/,
];

self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker 安装中...');
  // 强制激活新的Service Worker
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker 激活中...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 清理旧版本缓存
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('[SW] 删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // 立即控制所有客户端
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 只处理GET请求
  if (request.method !== 'GET') {
    return;
  }

  // 检查是否是API请求
  if (url.hostname === 'localhost' && url.port === '5001' && url.pathname.startsWith('/api')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // 处理其他资源（图片、CSS、JS等）
  if (shouldCacheResource(url)) {
    event.respondWith(handleResourceRequest(request));
  }
});

// 处理API请求
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  // 检查是否应该跳过缓存
  const shouldSkipCache = NO_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
  if (shouldSkipCache) {
    console.log('[SW] 跳过缓存:', url.pathname);
    return fetch(request);
  }

  // 检查是否应该缓存
  const shouldCache = API_PATTERNS.some(pattern => pattern.test(url.pathname));
  if (!shouldCache) {
    return fetch(request);
  }

  const cache = await caches.open(API_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  // 检查缓存是否有效
  if (cachedResponse) {
    const cacheTime = cachedResponse.headers.get('sw-cache-time');
    if (cacheTime) {
      const age = Date.now() - parseInt(cacheTime);
      if (age < CACHE_DURATION) {
        console.log('[SW] 使用API缓存:', url.pathname, `(${Math.round(age/1000)}秒前)`);
        // 发送缓存状态到客户端
        broadcastCacheStatus('hit', url.pathname);
        return cachedResponse;
      }
    }
  }

  try {
    console.log('[SW] 获取新的API数据:', url.pathname);
    const response = await fetch(request);
    
    if (response.ok) {
      // 克隆响应用于缓存
      const responseToCache = response.clone();
      
      // 添加缓存时间戳
      const headers = new Headers(responseToCache.headers);
      headers.set('sw-cache-time', Date.now().toString());
      
      const cachedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      });
      
      await cache.put(request, cachedResponse);
      console.log('[SW] API响应已缓存:', url.pathname);
      
      // 发送缓存状态到客户端
      broadcastCacheStatus('miss', url.pathname);
    }
    
    return response;
  } catch (error) {
    console.error('[SW] API请求失败:', url.pathname, error);
    
    // 网络失败时尝试返回缓存（即使过期）
    if (cachedResponse) {
      console.log('[SW] 网络失败，使用过期缓存:', url.pathname);
      broadcastCacheStatus('stale', url.pathname);
      return cachedResponse;
    }
    
    throw error;
  }
}

// 处理资源请求
async function handleResourceRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] 资源请求失败:', request.url, error);
    throw error;
  }
}

// 判断是否应该缓存资源
function shouldCacheResource(url) {
  // 缓存图片、字体、CSS、JS等静态资源
  return /\.(png|jpg|jpeg|gif|webp|svg|css|js|woff|woff2|ttf|eot)$/.test(url.pathname);
}

// 向客户端广播缓存状态
function broadcastCacheStatus(status, url) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'CACHE_STATUS',
        status: status, // 'hit', 'miss', 'stale'
        url: url,
        timestamp: Date.now()
      });
    });
  });
}

// 处理来自客户端的消息
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'CLEAR_CACHE':
      clearCache(payload?.pattern);
      break;
    case 'GET_CACHE_INFO':
      getCacheInfo().then(info => {
        event.ports[0].postMessage(info);
      });
      break;
    case 'UPDATE_CACHE_DURATION':
      if (payload?.duration) {
        CACHE_DURATION = payload.duration;
        console.log('[SW] 缓存时间已更新为:', CACHE_DURATION / 1000, '秒');
      }
      break;
  }
});

// 清理缓存
async function clearCache(pattern) {
  try {
    const cache = await caches.open(API_CACHE_NAME);
    const requests = await cache.keys();
    
    for (const request of requests) {
      if (!pattern || new RegExp(pattern).test(request.url)) {
        await cache.delete(request);
        console.log('[SW] 已删除缓存:', request.url);
      }
    }
    
    // 通知客户端缓存已清理
    broadcastCacheStatus('cleared', pattern || 'all');
  } catch (error) {
    console.error('[SW] 清理缓存失败:', error);
  }
}

// 获取缓存信息
async function getCacheInfo() {
  try {
    const cache = await caches.open(API_CACHE_NAME);
    const requests = await cache.keys();
    
    const cacheEntries = await Promise.all(
      requests.map(async (request) => {
        const response = await cache.match(request);
        const cacheTime = response.headers.get('sw-cache-time');
        const age = cacheTime ? Date.now() - parseInt(cacheTime) : 0;
        
        return {
          url: request.url,
          method: request.method,
          cached: cacheTime ? new Date(parseInt(cacheTime)).toLocaleTimeString() : 'Unknown',
          age: Math.round(age / 1000), // 秒
          expired: age > CACHE_DURATION
        };
      })
    );
    
    return {
      entries: cacheEntries,
      totalSize: requests.length,
      cacheDuration: CACHE_DURATION / 1000
    };
  } catch (error) {
    console.error('[SW] 获取缓存信息失败:', error);
    return { entries: [], totalSize: 0, cacheDuration: 0 };
  }
}

console.log('[SW] Service Worker 脚本已加载');

