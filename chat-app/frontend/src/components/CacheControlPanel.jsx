import React, { useState, useEffect } from 'react';
import { Trash2, RefreshCw, Settings, Database, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { swManager } from '../lib/swManager';

const CacheControlPanel = ({ isOpen, onClose }) => {
  const [cacheInfo, setCacheInfo] = useState({ entries: [], totalSize: 0, cacheDuration: 0 });
  const [loading, setLoading] = useState(false);
  const [cacheEvents, setCacheEvents] = useState([]);
  const [settings, setSettings] = useState({
    cacheDuration: 5 * 60 * 1000, // 5分钟
    maxEvents: 50
  });

  // 获取缓存信息
  const fetchCacheInfo = async () => {
    setLoading(true);
    try {
      const info = await swManager.getCacheInfo();
      if (info) {
        setCacheInfo(info);
      }
    } catch (error) {
      console.error('获取缓存信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 清理所有缓存
  const clearAllCache = async () => {
    try {
      await swManager.clearCache();
      await fetchCacheInfo();
      addCacheEvent('所有缓存已清理', 'success');
    } catch (error) {
      addCacheEvent('清理缓存失败', 'error');
    }
  };

  // 清理特定缓存
  const clearSpecificCache = async (pattern) => {
    try {
      await swManager.clearCache(pattern);
      await fetchCacheInfo();
      addCacheEvent(`已清理匹配 ${pattern} 的缓存`, 'success');
    } catch (error) {
      addCacheEvent('清理缓存失败', 'error');
    }
  };

  // 更新缓存设置
  const updateCacheSettings = async () => {
    try {
      await swManager.updateCacheDuration(settings.cacheDuration);
      addCacheEvent(`缓存时间已更新为 ${settings.cacheDuration / 1000} 秒`, 'success');
    } catch (error) {
      addCacheEvent('更新设置失败', 'error');
    }
  };

  // 添加缓存事件
  const addCacheEvent = (message, type = 'info') => {
    const event = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setCacheEvents(prev => [event, ...prev.slice(0, settings.maxEvents - 1)]);
  };

  // 监听缓存状态
  useEffect(() => {
    const unsubscribe = swManager.addCacheStatusListener(({ status, url, timestamp }) => {
      const messages = {
        hit: `缓存命中: ${url.split('/').pop()}`,
        miss: `缓存未命中: ${url.split('/').pop()}`,
        stale: `使用过期缓存: ${url.split('/').pop()}`,
        cleared: `缓存已清理: ${url === 'all' ? '全部' : url}`
      };
      
      const types = {
        hit: 'success',
        miss: 'info',
        stale: 'warning',
        cleared: 'info'
      };

      addCacheEvent(messages[status] || `未知状态: ${status}`, types[status] || 'info');
    });

    return unsubscribe;
  }, [settings.maxEvents]);

  // 初始加载
  useEffect(() => {
    if (isOpen) {
      fetchCacheInfo();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database size={20} />
            <h2 className="text-lg font-semibold">Service Worker 缓存控制面板</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <XCircle size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* 缓存统计 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <Database size={16} />
                <span className="font-medium">缓存条目</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{cacheInfo.totalSize}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <Clock size={16} />
                <span className="font-medium">缓存时长</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{cacheInfo.cacheDuration}秒</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-purple-700">
                <RefreshCw size={16} />
                <span className="font-medium">实时事件</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">{cacheEvents.length}</p>
            </div>
          </div>

          {/* 控制按钮 */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={fetchCacheInfo}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              刷新信息
            </button>
            <button
              onClick={clearAllCache}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              <Trash2 size={16} />
              清理所有缓存
            </button>
            <button
              onClick={() => clearSpecificCache('/api/messages')}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
            >
              <Trash2 size={16} />
              清理消息缓存
            </button>
            <button
              onClick={() => clearSpecificCache('/api/users')}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
            >
              <Trash2 size={16} />
              清理用户缓存
            </button>
          </div>

          {/* 缓存设置 */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Settings size={16} />
              <h3 className="font-medium">缓存设置</h3>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <span>缓存时长(秒):</span>
                <input
                  type="number"
                  value={settings.cacheDuration / 1000}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    cacheDuration: parseInt(e.target.value) * 1000 
                  }))}
                  className="w-20 px-2 py-1 border rounded"
                  min="10"
                  max="3600"
                />
              </label>
              <button
                onClick={updateCacheSettings}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                应用
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 缓存条目列表 */}
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Database size={16} />
                缓存条目 ({cacheInfo.entries.length})
              </h3>
              <div className="border rounded-lg max-h-80 overflow-y-auto">
                {cacheInfo.entries.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">暂无缓存条目</div>
                ) : (
                  cacheInfo.entries.map((entry, index) => (
                    <div key={index} className={`p-3 border-b last:border-b-0 ${entry.expired ? 'bg-red-50' : 'bg-white'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {entry.url.split('/').pop() || entry.url}
                          </p>
                          <p className="text-xs text-gray-500">
                            缓存时间: {entry.cached} | 年龄: {entry.age}秒
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {entry.expired ? (
                            <XCircle size={16} className="text-red-500" title="已过期" />
                          ) : (
                            <CheckCircle size={16} className="text-green-500" title="有效" />
                          )}
                          <button
                            onClick={() => clearSpecificCache(entry.url)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 实时事件日志 */}
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <RefreshCw size={16} />
                实时事件 ({cacheEvents.length})
              </h3>
              <div className="border rounded-lg max-h-80 overflow-y-auto">
                {cacheEvents.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">暂无事件记录</div>
                ) : (
                  cacheEvents.map((event) => (
                    <div key={event.id} className="p-3 border-b last:border-b-0">
                      <div className="flex items-center gap-2">
                        {event.type === 'success' && <CheckCircle size={14} className="text-green-500" />}
                        {event.type === 'error' && <XCircle size={14} className="text-red-500" />}
                        {event.type === 'warning' && <AlertCircle size={14} className="text-yellow-500" />}
                        {event.type === 'info' && <RefreshCw size={14} className="text-blue-500" />}
                        <span className="text-xs text-gray-500">{event.timestamp}</span>
                      </div>
                      <p className="text-sm mt-1">{event.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CacheControlPanel;

