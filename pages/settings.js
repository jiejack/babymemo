import React, { useState } from 'react';
import Layout from '../components/common/Layout';

export default function Settings() {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'zh-CN',
    autoBackup: false
  });
  const [success, setSuccess] = useState(null);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSuccess('设置保存成功');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleExportData = () => {
    setSuccess('数据导出成功（演示模式）');
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">设置</h1>
      </div>

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
            >
              导出数据
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
