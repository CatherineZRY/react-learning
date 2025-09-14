import React, { useState, useEffect } from 'react';
import { Database, Wifi, WifiOff, Clock, Settings } from 'lucide-react';
import { swManager } from '../lib/swManager';
import CacheControlPanel from './CacheControlPanel';

const CacheStatusIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cacheEvents, setCacheEvents] = useState([]);
  const [recentCacheStats, setRecentCacheStats] = useState({
    hits: 0,
    misses: 0,
    total: 0
  });
  const [showPanel, setShowPanel] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // 监听网络状态
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 监听缓存状态
  useEffect(() => {
    const unsubscribe = swManager.addCacheStatusListener(({ status, url, timestamp }) => {
      const event = { status, url, timestamp, id: Date.now() };
      
      // 添加到事件列表（保留最近20个）
      setCacheEvents(prev => [event, ...prev.slice(0, 19)]);
      
      // 更新统计
      setRecentCacheStats(prev => {
        const newStats = { ...prev, total: prev.total + 1 };
        if (status === 'hit') {
          newStats.hits += 1;
        } else if (status === 'miss') {
          newStats.misses += 1;
        }
        return newStats;
      });
    });

    return unsubscribe;
  }, []);

  // 计算缓存命中率
  const hitRate = recentCacheStats.total > 0 
    ? Math.round((recentCacheStats.hits / recentCacheStats.total) * 100) 
    : 0;

  // 获取状态颜色
  const getStatusColor = () => {
    if (!isOnline) return 'bg-red-500';
    if (hitRate >= 70) return 'bg-green-500';
    if (hitRate >= 40) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  // 获取最近事件的简要信息
  const getRecentActivity = () => {
    const recent = cacheEvents.slice(0, 3);
    if (recent.length === 0) return '暂无缓存活动';
    
    const lastEvent = recent[0];
    const statusText = {
      hit: '命中',
      miss: '未命中',
      stale: '过期',
      cleared: '清理'
    };
    
    return `最近: ${statusText[lastEvent.status] || lastEvent.status}`;
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 w-10 h-10 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center z-40"
        title="显示缓存状态"
      >
        <Database size={16} />
      </button>
    );
  }

  return (
    <>
      {/* 主指示器 */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 z-40 min-w-[280px]">
        {/* 头部 */}
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
            <span className="text-sm font-medium text-gray-700">缓存状态</span>
            {isOnline ? (
              <Wifi size={14} className="text-green-500" />
            ) : (
              <WifiOff size={14} className="text-red-500" />
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowPanel(true)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="打开控制面板"
            >
              <Settings size={14} />
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="隐藏指示器"
            >
              ×
            </button>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="p-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">{recentCacheStats.hits}</div>
              <div className="text-xs text-gray-500">命中</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">{recentCacheStats.misses}</div>
              <div className="text-xs text-gray-500">未命中</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">{hitRate}%</div>
              <div className="text-xs text-gray-500">命中率</div>
            </div>
          </div>

          {/* 最近活动 */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Clock size={12} />
              <span>{getRecentActivity()}</span>
            </div>
          </div>

          {/* 最近事件列表 */}
          {cacheEvents.length > 0 && (
            <div className="mt-2 space-y-1 max-h-24 overflow-y-auto">
              {cacheEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-center justify-between text-xs">
                  <span className="truncate flex-1 mr-2">
                    {event.url.split('/').pop() || 'API请求'}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    event.status === 'hit' ? 'bg-green-100 text-green-700' :
                    event.status === 'miss' ? 'bg-blue-100 text-blue-700' :
                    event.status === 'stale' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {event.status === 'hit' ? '命中' :
                     event.status === 'miss' ? '未命中' :
                     event.status === 'stale' ? '过期' : event.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 快捷操作 */}
          <div className="mt-3 pt-2 border-t border-gray-100">
            <button
              onClick={() => setShowPanel(true)}
              className="w-full text-xs bg-blue-50 text-blue-700 py-2 rounded hover:bg-blue-100 transition-colors"
            >
              打开控制面板
            </button>
          </div>
        </div>
      </div>

      {/* 控制面板 */}
      <CacheControlPanel 
        isOpen={showPanel} 
        onClose={() => setShowPanel(false)} 
      />
    </>
  );
};

export default CacheStatusIndicator;




