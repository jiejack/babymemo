import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import { api } from '../services/api';

export default function Settings() {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'zh-CN',
    autoBackup: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.setting.getAll();
        if (response.data) {
          const settingsObj = {};
          response.data.forEach(setting => {
            settingsObj[setting.key] = setting.value;
          });
          setSettings(prev => ({ ...prev, ...settingsObj }));
        }
      } catch (error) {
        console.error('获取设置失败:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleSettingChange = async (key, value) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await api.setting.update(key, value);
      setSettings(prev => ({ ...prev, [key]: value }));
      setSuccess('设置保存成功');
    } catch (error) {
      setError('设置保存失败');
      console.error('保存设置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setLoading(true);
      const response = await api.export.exportData('json');
      
      // 创建下载链接
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `babymemo-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccess('数据导出成功');
    } catch (error) {
      setError('数据导出失败');
      console.error('导出数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">设置</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <strong className="font-bold">错误：</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6" role="alert">
          <strong className="font-bold">成功：</strong>
          <span className="block sm:inline"> {success}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">基本设置</h2>
        </div>
        <div className="px-6 py-4">
          <div className="mb-4">
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
              主题
            </label>
            <select
              id="theme"
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              <option value="light">浅色</option>
              <option value="dark">深色</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
              语言
            </label>
            <select
              id="language"
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English</option>
            </select>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center">
              <input
                id="autoBackup"
                type="checkbox"
                checked={settings.autoBackup === 'true' || settings.autoBackup === true}
                onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={loading}
              />
              <label htmlFor="autoBackup" className="ml-2 block text-sm text-gray-700">
                自动备份
              </label>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              开启后，系统会定期自动备份数据
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">数据管理</h2>
        </div>
        <div className="px-6 py-4">
          <div className="mb-4">
            <button
              onClick={handleExportData}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? '处理中...' : '导出数据'}
            </button>
            <p className="mt-1 text-sm text-gray-500">
              导出所有数据为JSON格式
            </p>
          </div>
          
          <div className="mb-4">
            <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              导入数据
            </button>
            <p className="mt-1 text-sm text-gray-500">
              从JSON文件导入数据
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">关于</h2>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-gray-600 mb-2">
            BabyMemo 宝宝成长记录系统
          </p>
          <p className="text-sm text-gray-500">
            版本：1.0.0
          </p>
        </div>
      </div>
    </Layout>
  );
}