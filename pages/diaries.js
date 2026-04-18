import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';

export default function Diaries() {
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleAddDemoDiary = () => {
    const newDiary = {
      id: Date.now(),
      title: '演示日记',
      content: '这是一篇演示日记的内容，记录宝宝的成长故事。',
      date: new Date().toISOString(),
      mood: '开心'
    };
    setDiaries(prev => [newDiary, ...prev]);
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

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">创意日记</h1>
        <div className="flex justify-end mb-4">
          <button 
            onClick={handleAddDemoDiary}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            添加演示日记
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {diaries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">暂无日记，点击添加演示日记按钮开始</p>
          </div>
        ) : (
          diaries.map((diary) => (
            <div key={diary.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-medium text-gray-900">{diary.title}</h3>
                <span className="text-sm text-gray-500">{new Date(diary.date).toLocaleDateString()}</span>
              </div>
              <div className="mt-2 text-gray-600">
                {diary.content}
              </div>
              <div className="mt-4 flex items-center space-x-4">
                {diary.mood && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    心情: {diary.mood}
                  </span>
                )}
              </div>
              <div className="mt-4 flex space-x-2">
                <button className="text-blue-500 hover:text-blue-700 text-sm">查看详情</button>
                <button className="text-blue-500 hover:text-blue-700 text-sm">编辑</button>
                <button className="text-red-500 hover:text-red-700 text-sm">删除</button>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
