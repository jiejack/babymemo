import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import { api } from '../services/api';

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    date: '',
    category: '',
    tags: ''
  });
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    tags: ''
  });
  const [editVideoFile, setEditVideoFile] = useState(null);
  const [uploadVideoFile, setUploadVideoFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await api.video.getAll();
      if (response.status === 'success' && response.data) {
        setVideos(response.data);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (id) => {
    try {
      const response = await api.video.delete(id);
      if (response.status === 'success') {
        setVideos(videos.filter(v => v.id !== id));
      }
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const handleEditVideo = async (id) => {
    try {
      const response = await api.video.getById(id);
      if (response.status === 'success' && response.data) {
        const video = response.data;
        setEditingVideo(video);
        setEditForm({
          title: video.title || '',
          description: video.description || '',
          date: video.date ? new Date(video.date).toISOString().split('T')[0] : '',
          category: video.category || '',
          tags: video.tags || ''
        });
        setShowEditModal(true);
      }
    } catch (error) {
      console.error('Error editing video:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      
      // 验证标题
      if (!editForm.title || !editForm.title.trim()) {
        setError('视频标题为必填项');
        return;
      }
      
      let formData;
      if (editVideoFile) {
        formData = new FormData();
        formData.append('video', editVideoFile);
        formData.append('title', editForm.title);
        formData.append('description', editForm.description);
        formData.append('date', editForm.date);
        formData.append('category', editForm.category);
        formData.append('tags', editForm.tags);
      } else {
        formData = editForm;
      }
      
      const response = await api.video.update(editingVideo.id, formData);
      if (response.status === 'success' && response.data) {
        setVideos(prev => prev.map(video => video.id === editingVideo.id ? response.data : video));
        setSuccess('视频更新成功');
        // 延迟关闭模态框，让用户看到成功消息
        setTimeout(() => {
          setShowEditModal(false);
          setEditingVideo(null);
          setEditVideoFile(null);
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating video:', error);
      setError(error.message || '更新视频失败');
    }
  };

  const handleOpenUploadModal = () => {
    setUploadForm({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      tags: ''
    });
    setUploadVideoFile(null);
    setError('');
    setSuccess('');
    setShowUploadModal(true);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      
      // 验证视频文件
      if (!uploadVideoFile) {
        setError('请选择视频文件');
        return;
      }
      
      // 验证标题
      if (!uploadForm.title || !uploadForm.title.trim()) {
        setError('视频标题为必填项');
        return;
      }
      
      // 验证文件类型
      const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/wmv', 'video/flv', 'video/mkv', 'video/webm'];
      if (!allowedTypes.includes(uploadVideoFile.type)) {
        setError('不支持的视频格式');
        return;
      }
      
      // 验证文件大小（100MB限制）
      if (uploadVideoFile.size > 100 * 1024 * 1024) {
        setError('视频文件大小不能超过100MB');
        return;
      }

      const formData = new FormData();
      formData.append('video', uploadVideoFile);
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('date', uploadForm.date);
      formData.append('category', uploadForm.category);
      formData.append('tags', uploadForm.tags);
      formData.append('duration', 0);

      const response = await api.video.create(formData);
      if (response.status === 'success' && response.data) {
        setVideos([response.data, ...videos]);
        setSuccess('视频上传成功');
        // 延迟关闭模态框，让用户看到成功消息
        setTimeout(() => {
          setShowUploadModal(false);
          setUploadVideoFile(null);
        }, 1500);
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      setError(error.message || '上传视频失败');
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">视频管理</h1>
        <div className="flex justify-end mb-4">
          <button 
            onClick={handleOpenUploadModal}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            上传视频
          </button>
        </div>
        {/* 消息提示 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">错误：</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">成功：</strong>
            <span className="block sm:inline">{success}</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {videos.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">暂无视频，点击上传按钮添加视频</p>
            </div>
          ) : (
          videos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                  <div className="relative w-full h-48 bg-gray-100">
                    {video.url ? (
                      <video 
                        src={video.url} 
                        className="w-full h-full object-cover"
                        controls
                        poster={video.thumbnail || ''}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-gray-400">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{video.title || '未命名'}</h3>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <span>{new Date(video.date).toLocaleDateString()}</span>
                  {video.duration && (
                    <span className="ml-2">•</span>
                  )}
                  {video.duration && (
                    <span className="ml-2">{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</span>
                  )}
                </div>
                <div className="mt-2 flex space-x-2">
                  <button 
                    onClick={() => handleEditVideo(video.id)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    编辑
                  </button>
                  <button 
                    onClick={() => handleDeleteVideo(video.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        </div>
      )}

      {/* 编辑模态框 */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">编辑视频信息</h2>
            <form onSubmit={handleEditSubmit}>
              {/* 错误消息 */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                  <strong className="font-bold">错误：</strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              {/* 成功消息 */}
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
                  <strong className="font-bold">成功：</strong>
                  <span className="block sm:inline">{success}</span>
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">标题 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="视频标题"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">视频文件（可选，不上传则保持原视频）</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setEditVideoFile(e.target.files[0])}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {editVideoFile && (
                  <p className="mt-1 text-sm text-gray-600">已选择文件：{editVideoFile.name}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="4"
                  placeholder="视频描述"
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
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={(e) => setEditForm({...editForm, tags: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="标签，用逗号分隔"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingVideo(null);
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

      {/* 上传模态框 */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">上传视频</h2>
            <form onSubmit={handleUploadSubmit}>
              {/* 错误消息 */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                  <strong className="font-bold">错误：</strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              {/* 成功消息 */}
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
                  <strong className="font-bold">成功：</strong>
                  <span className="block sm:inline">{success}</span>
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">视频文件 <span className="text-red-500">*</span></label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setUploadVideoFile(e.target.files[0])}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
                {uploadVideoFile && (
                  <p className="mt-1 text-sm text-gray-600">已选择文件：{uploadVideoFile.name}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">标题 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="视频标题"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="4"
                  placeholder="视频描述"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
                  <input
                    type="date"
                    value={uploadForm.date}
                    onChange={(e) => setUploadForm({...uploadForm, date: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                  <input
                    type="text"
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="分类"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
                <input
                  type="text"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="标签，用逗号分隔"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadVideoFile(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  上传
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
