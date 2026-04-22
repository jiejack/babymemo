import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import { api } from '../services/api';
import PhotoView from '../components/photos/PhotoView';

export default function Photos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewingPhoto, setViewingPhoto] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    title: '',
    description: '',
    category: '生活',
    date: new Date().toISOString().split('T')[0],
    location: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    date: ''
  });
  const [editSelectedFile, setEditSelectedFile] = useState(null);
  const [modalError, setModalError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const showError = (message) => {
    setModalError(message);
    setShowErrorModal(true);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    console.log('showViewModal changed:', showViewModal);
    console.log('viewingPhoto changed:', viewingPhoto);
  }, [showViewModal, viewingPhoto]);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await api.photo.getAll();
      if (response.status === 'success' && response.data) {
        setPhotos(response.data);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
      showError('获取照片失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDemoPhoto = async () => {
    try {
      // 使用新下载的正常测试图片
      const newPhoto = {
        url: '/uploads/photos/test-photo.jpg',
        title: '演示照片',
        description: '这是一张演示照片',
        date: new Date().toISOString(),
        category: '生活'
      };
      const response = await api.photo.create(newPhoto);
      if (response.status === 'success' && response.data) {
        setPhotos(prev => [response.data, ...prev]);
      }
    } catch (error) {
      console.error('Error adding photo:', error);
      showError('添加照片失败');
    }
  };

  const handleDeletePhoto = async (id) => {
    try {
      const response = await api.photo.delete(id);
      if (response.status === 'success') {
        setPhotos(prev => prev.filter(photo => photo.id !== id));
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      showError('删除照片失败');
    }
  };

  const handleEditPhoto = async (id) => {
    try {
      const response = await api.photo.getById(id);
      if (response.status === 'success' && response.data) {
        const photo = response.data;
        setEditingPhoto(photo);
        setEditForm({
          title: photo.title || '',
          description: photo.description || '',
          category: photo.category || '',
          date: photo.date ? new Date(photo.date).toISOString().split('T')[0] : ''
        });
        setEditSelectedFile(null); // 重置选择的文件
        setShowEditModal(true);
      }
    } catch (error) {
      console.error('Error editing photo:', error);
      showError('编辑照片失败');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.title.trim()) {
      showError('请输入照片标题');
      return;
    }

    try {
      let response;
      if (editSelectedFile) {
        // 有新文件上传，使用FormData
        const formData = new FormData();
        formData.append('file', editSelectedFile);
        formData.append('title', editForm.title);
        formData.append('description', editForm.description);
        formData.append('category', editForm.category);
        formData.append('date', editForm.date);
        response = await api.photo.update(editingPhoto.id, formData);
      } else {
        // 没有新文件，发送JSON格式
        response = await api.photo.update(editingPhoto.id, editForm);
      }
      
      if (response.status === 'success' && response.data) {
        setPhotos(prev => prev.map(photo => photo.id === editingPhoto.id ? response.data : photo));
        setShowEditModal(false);
        setEditingPhoto(null);
        setEditSelectedFile(null);
      }
    } catch (error) {
      console.error('Error updating photo:', error);
      showError('更新照片失败');
    }
  };

  const handleViewPhoto = (photo) => {
    console.log('handleViewPhoto called with:', photo);
    setViewingPhoto(photo);
    setShowViewModal(true);
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const handleEditUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditSelectedFile(file);
  };

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showError('请选择照片文件');
      return;
    }
    if (!addForm.title.trim()) {
      showError('请输入照片标题');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', addForm.title);
      formData.append('description', addForm.description);
      formData.append('category', addForm.category);
      formData.append('date', addForm.date);
      formData.append('location', addForm.location);

      const response = await api.photo.create(formData);
      if (response.status === 'success' && response.data) {
        setPhotos([response.data, ...photos]);
        setShowAddModal(false);
        setAddForm({
          title: '',
          description: '',
          category: '生活',
          date: new Date().toISOString().split('T')[0],
          location: ''
        });
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      showError('上传照片失败');
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
        <h1 className="text-2xl font-bold text-gray-800 mb-4">照片墙</h1>
        <div className="flex justify-end mb-4 space-x-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            新增
          </button>
          <button 
            onClick={handleAddDemoPhoto}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            添加演示照片
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">暂无照片，点击添加演示照片按钮开始</p>
          </div>
        ) : (
          photos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="w-full h-48 overflow-hidden bg-gray-100">
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{photo.title || '未命名'}</h3>
                <p className="text-sm text-gray-500 mt-1">{new Date(photo.date).toLocaleDateString()}</p>
                <div className="mt-2 flex space-x-2">
                  <button 
                    onClick={(e) => {
                      console.log('View button clicked!', e, photo);
                      handleViewPhoto(photo);
                    }}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    查看
                  </button>
                  <button 
                    onClick={(e) => {
                      console.log('Edit button clicked!', e, photo.id);
                      handleEditPhoto(photo.id);
                    }}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    编辑
                  </button>
                  <button 
                    onClick={() => handleDeletePhoto(photo.id)}
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

      {/* 编辑模态框 */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">编辑照片</h2>
            <form onSubmit={handleEditSubmit}>
              {/* 当前图片预览 */}
              {editingPhoto && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">当前图片</label>
                  <div className="w-full h-40 bg-gray-100 rounded overflow-hidden mb-2">
                    <img 
                      src={editingPhoto.url} 
                      alt={editingPhoto.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              {/* 上传新图片 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">更换新图片（可选）</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditUploadPhoto}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {editSelectedFile && (
                  <p className="mt-1 text-sm text-green-600">已选择: {editSelectedFile.name}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标题
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!editForm.title.trim() ? 'border-red-500' : ''}`}
                  placeholder="照片标题"
                />
                {!editForm.title.trim() && (
                  <p className="mt-1 text-sm text-red-500">标题不能为空</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                  placeholder="照片描述"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                <input
                  type="text"
                  value={editForm.category}
                  onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="照片分类"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingPhoto(null);
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

      {/* 查看模态框 */}
      {showViewModal && viewingPhoto && (
        <PhotoView 
          photo={viewingPhoto} 
          onClose={() => setShowViewModal(false)} 
        />
      )}

      {/* 添加照片模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">上传照片</h2>
            <form onSubmit={handleAddPhoto}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  选择照片
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleUploadPhoto}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!selectedFile ? 'border-red-500' : ''}`}
                />
                {selectedFile ? (
                  <p className="mt-1 text-sm text-green-600">已选择: {selectedFile.name}</p>
                ) : (
                  <p className="mt-1 text-sm text-red-500">请选择照片文件</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标题
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={addForm.title}
                  onChange={(e) => setAddForm({...addForm, title: e.target.value})}
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${!addForm.title.trim() ? 'border-red-500' : ''}`}
                  placeholder="请输入照片标题（必填）"
                />
                {!addForm.title.trim() && (
                  <p className="mt-1 text-sm text-red-500">标题不能为空</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  value={addForm.description}
                  onChange={(e) => setAddForm({...addForm, description: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                  placeholder="照片描述"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                <input
                  type="text"
                  value={addForm.category}
                  onChange={(e) => setAddForm({...addForm, category: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="照片分类"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
                <input
                  type="date"
                  value={addForm.date}
                  onChange={(e) => setAddForm({...addForm, date: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">地点</label>
                <input
                  type="text"
                  value={addForm.location}
                  onChange={(e) => setAddForm({...addForm, location: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="拍摄地点"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setAddForm({
                      title: '',
                      description: '',
                      category: '生活',
                      date: new Date().toISOString().split('T')[0],
                      location: ''
                    });
                    setSelectedFile(null);
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

      {/* 错误提示模态框 */}
      {showErrorModal && modalError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-red-600 mb-4">错误</h2>
            <p className="text-gray-700 mb-6">{modalError}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowErrorModal(false)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}