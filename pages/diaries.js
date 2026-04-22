import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import { api } from '../services/api';

export default function Diaries() {
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDiary, setEditingDiary] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    date: '',
    category: '',
    mood: '',
    weather: ''
  });

  useEffect(() => {
    fetchDiaries();
  }, []);

  const fetchDiaries = async () => {
    try {
      setLoading(true);
      const response = await api.diary.getAll();
      if (response.status === 'success' && response.data) {
        setDiaries(response.data);
      }
    } catch (error) {
      console.error('Error fetching diaries:', error);
      setError('获取日记失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDemoDiary = async () => {
    try {
      const newDiary = {
        title: '演示日记',
        content: '这是一篇演示日记内容，记录宝宝的成长瞬间。',
        date: new Date().toISOString(),
        category: '日常'
      };
      const response = await api.diary.create(newDiary);
      if (response.status === 'success' && response.data) {
        setDiaries(prev => [response.data, ...prev]);
      }
    } catch (error) {
      console.error('Error adding diary:', error);
      setError('添加日记失败');
    }
  };

  const handleDeleteDiary = async (id) => {
    try {
      const response = await api.diary.delete(id);
      if (response.status === 'success') {
        setDiaries(prev => prev.filter(diary => diary.id !== id));
      }
    } catch (error) {
      console.error('Error deleting diary:', error);
      setError('删除日记失败');
    }
  };

  const handleEditDiary = async (id) => {
    try {
      const response = await api.diary.getById(id);
      if (response.status === 'success' && response.data) {
        const diary = response.data;
        setEditingDiary(diary);
        setEditForm({
          title: diary.title || '',
          content: diary.content || '',
          date: diary.date ? new Date(diary.date).toISOString().split('T')[0] : '',
          category: diary.category || '',
          mood: diary.mood || '',
          weather: diary.weather || ''
        });
        setShowEditModal(true);
      }
    } catch (error) {
      console.error('Error editing diary:', error);
      setError('编辑日记失败');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.diary.update(editingDiary.id, editForm);
      if (response.status === 'success' && response.data) {
        setDiaries(prev => prev.map(diary => diary.id === editingDiary.id ? response.data : diary));
        setShowEditModal(false);
        setEditingDiary(null);
      }
    } catch (error) {
      console.error('Error updating diary:', error);
      setError('更新日记失败');
    }
  };

  const handleViewDiary = async (id) => {
    try {
      // 这里可以实现查看详情功能，比如打开详情模态框
      console.log('View diary with id:', id);
    } catch (error) {
      console.error('Error viewing diary:', error);
      setError('查看日记失败');
    }
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
                <button 
                  onClick={() => handleViewDiary(diary.id)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  查看详情
                </button>
                <button 
                  onClick={() => handleEditDiary(diary.id)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  编辑
                </button>
                <button 
                  onClick={() => handleDeleteDiary(diary.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  删除
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 编辑模态框 */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">编辑日记</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="日记标题"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
                <textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="5"
                  placeholder="日记内容"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="分类"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">心情</label>
                  <input
                    type="text"
                    value={editForm.mood}
                    onChange={(e) => setEditForm({...editForm, mood: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="心情"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">天气</label>
                  <input
                    type="text"
                    value={editForm.weather}
                    onChange={(e) => setEditForm({...editForm, weather: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="天气"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingDiary(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
