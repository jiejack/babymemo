import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import { api } from '../services/api';
import DiaryEditor from '../components/diaries/DiaryEditor';

export default function Diaries() {
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingDiary, setEditingDiary] = useState(null);

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        setLoading(true);
        const response = await api.diary.getAll();
        // 按日期排序，最新的在前面
        const sortedDiaries = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setDiaries(sortedDiaries);
      } catch (error) {
        setError('获取日记失败');
        console.error('获取日记失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, []);

  const handleSave = (newDiary) => {
    if (editingDiary) {
      // 更新现有日记
      setDiaries(prev => prev.map(diary => diary.id === newDiary.id ? newDiary : diary));
    } else {
      // 添加新日记
      setDiaries(prev => [newDiary, ...prev]);
    }
  };

  const handleEdit = (diary) => {
    setEditingDiary(diary);
    setShowEditor(true);
  };

  const handleNewDiary = () => {
    setEditingDiary(null);
    setShowEditor(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <strong className="font-bold">错误：</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">创意日记</h1>
        <div className="flex justify-end mb-4">
          <button 
            onClick={handleNewDiary}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            写日记
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {diaries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">暂无日记，点击写日记按钮开始记录</p>
          </div>
        ) : (
          diaries.map((diary) => (
            <div key={diary.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-medium text-gray-900">{diary.title}</h3>
                <span className="text-sm text-gray-500">{new Date(diary.date).toLocaleDateString()}</span>
              </div>
              <div className="mt-2 text-gray-600">
                {diary.content.length > 100 ? `${diary.content.substring(0, 100)}...` : diary.content}
              </div>
              <div className="mt-4 flex items-center space-x-4">
                {diary.mood && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    心情: {diary.mood}
                  </span>
                )}
                {diary.weather && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    天气: {diary.weather}
                  </span>
                )}
                {diary.images && diary.images.length > 0 && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {diary.images.length} 张图片
                  </span>
                )}
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="text-blue-500 hover:text-blue-700 text-sm">查看详情</button>
                <button onClick={() => handleEdit(diary)} className="text-blue-500 hover:text-blue-700 text-sm">编辑</button>
                <button className="text-red-500 hover:text-red-700 text-sm">删除</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showEditor && (
        <DiaryEditor 
          diary={editingDiary}
          onSave={handleSave} 
          onClose={() => setShowEditor(false)} 
        />
      )}
    </Layout>
  );
}