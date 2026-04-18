import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import { api } from '../services/api';
import PhotoUpload from '../components/photos/PhotoUpload';

export default function Photos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await api.photo.getAll();
        setPhotos(response.data);
      } catch (error) {
        setError('获取照片失败');
        console.error('获取照片失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  const handleUpload = (newPhoto) => {
    setPhotos(prev => [newPhoto, ...prev]);
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
        <h1 className="text-2xl font-bold text-gray-800 mb-4">照片墙</h1>
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            上传照片
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">暂无照片，点击上传按钮添加照片</p>
          </div>
        ) : (
          photos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="aspect-w-4 aspect-h-3">
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{photo.title || '未命名'}</h3>
                <p className="text-sm text-gray-500 mt-1">{new Date(photo.date).toLocaleDateString()}</p>
                <div className="mt-2 flex space-x-2">
                  <button className="text-blue-500 hover:text-blue-700 text-sm">编辑</button>
                  <button className="text-red-500 hover:text-red-700 text-sm">删除</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showUploadModal && (
        <PhotoUpload 
          onUpload={handleUpload} 
          onClose={() => setShowUploadModal(false)} 
        />
      )}
    </Layout>
  );
}