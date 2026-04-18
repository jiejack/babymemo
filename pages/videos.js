import React, { useState } from 'react';
import Layout from '../components/common/Layout';

export default function Videos() {
  const [videos, setVideos] = useState([
    { id: 1, title: '宝宝第一次笑', date: '2024-02-20', duration: 15 },
    { id: 2, title: '学翻身', date: '2024-03-10', duration: 25 },
    { id: 3, title: '吃辅食第一天', date: '2024-04-05', duration: 45 }
  ]);

  const handleDeleteVideo = (id) => {
    setVideos(videos.filter(v => v.id !== id));
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">视频管理</h1>
        <div className="flex justify-end mb-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            上传视频
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {videos.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">暂无视频，点击上传按钮添加视频</p>
          </div>
        ) : (
          videos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
                  <div className="text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-12 h-12 rounded-full bg-blue-500 bg-opacity-80 flex items-center justify-center text-white">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
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
                  <button className="text-blue-500 hover:text-blue-700 text-sm">编辑</button>
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
    </Layout>
  );
}
