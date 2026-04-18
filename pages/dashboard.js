import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AppContext } from './_app';
import Layout from '../components/common/Layout';
import { api } from '../services/api';

export default function Dashboard() {
  const { user } = useContext(AppContext);
  const router = useRouter();
  const [recentPhotos, setRecentPhotos] = useState([]);
  const [recentDiaries, setRecentDiaries] = useState([]);
  const [recentMilestones, setRecentMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      fetchRecentMemories();
    }
  }, [user]);

  const fetchRecentMemories = async () => {
    try {
      setLoading(true);
      
      // 获取最近的照片
      const photosResponse = await api.photo.getAll({ limit: 6 });
      setRecentPhotos(photosResponse.data || []);
      
      // 获取最近的日记
      const diariesResponse = await api.diary.getAll({ limit: 3 });
      setRecentDiaries(diariesResponse.data || []);
      
      // 获取最近的里程碑
      const milestonesResponse = await api.milestone.getAll({ limit: 3 });
      setRecentMilestones(milestonesResponse.data || []);
    } catch (error) {
      console.error('获取最近记忆失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coral"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* 欢迎区域 */}
      <div className="gradient-bg rounded-3xl p-8 mb-8 shadow-lg animate-fade-in-up">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              欢迎回来，{user?.name || '家长'}！
            </h1>
            <p className="text-gray-600 text-lg">
              记录宝宝成长的每一个珍贵瞬间
            </p>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => router.push('/photos')}
              className="btn-primary"
            >
              上传照片
            </button>
            <button 
              onClick={() => router.push('/diaries')}
              className="btn-secondary"
            >
              写日记
            </button>
          </div>
        </div>
      </div>

      {/* 快速访问卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div 
          onClick={() => router.push('/photos')}
          className="card cursor-pointer bg-gradient-to-br from-pink-50 to-coral-50 border border-coral-100"
        >
          <div className="flex items-center">
            <div className="w-16 h-16 bg-coral rounded-2xl flex items-center justify-center shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-gray-800">照片墙</h3>
              <p className="text-gray-600">上传和管理照片</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => router.push('/diaries')}
          className="card cursor-pointer bg-gradient-to-br from-blue-50 to-mint-50 border border-mint-100"
        >
          <div className="flex items-center">
            <div className="w-16 h-16 bg-mint rounded-2xl flex items-center justify-center shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-gray-800">创意日记</h3>
              <p className="text-gray-600">记录成长故事</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => router.push('/calendar')}
          className="card cursor-pointer bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-100"
        >
          <div className="flex items-center">
            <div className="w-16 h-16 bg-yellow rounded-2xl flex items-center justify-center shadow-md">
              <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-gray-800">创意日历</h3>
              <p className="text-gray-600">标记重要日期</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => router.push('/timeline')}
          className="card cursor-pointer bg-gradient-to-br from-purple-50 to-lavender border border-purple-100"
        >
          <div className="flex items-center">
            <div className="w-16 h-16 bg-lavender rounded-2xl flex items-center justify-center shadow-md">
              <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-gray-800">时光轴</h3>
              <p className="text-gray-600">查看成长历程</p>
            </div>
          </div>
        </div>
      </div>

      {/* 最近记忆 */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">最近记忆</h2>
        
        {/* 最近照片 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-700">最近照片</h3>
            <button 
              onClick={() => router.push('/photos')}
              className="text-coral hover:text-pink-600 font-medium"
            >
              查看全部
            </button>
          </div>
          
          {recentPhotos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {recentPhotos.map((photo, index) => (
                <div 
                  key={photo.id}
                  className="relative rounded-xl overflow-hidden shadow-md group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="aspect-square bg-gray-200">
                    <img 
                      src={photo.url || 'https://via.placeholder.com/200'} 
                      alt={photo.title || '照片'}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-sm font-medium truncate">
                      {photo.title || '未命名'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
              <p className="text-gray-500">暂无照片，点击上传照片开始记录</p>
            </div>
          )}
        </div>

        {/* 最近日记和里程碑 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 最近日记 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-700">最近日记</h3>
              <button 
                onClick={() => router.push('/diaries')}
                className="text-coral hover:text-pink-600 font-medium"
              >
                查看全部
              </button>
            </div>
            
            {recentDiaries.length > 0 ? (
              <div className="space-y-4">
                {recentDiaries.map((diary, index) => (
                  <div 
                    key={diary.id}
                    className="card animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <h4 className="font-medium text-gray-800 mb-2">{diary.title}</h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {diary.content}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(diary.date).toLocaleDateString()}
                      {diary.mood && (
                        <span className="ml-3 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {diary.mood}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                <p className="text-gray-500">暂无日记，点击写日记开始记录</p>
              </div>
            )}
          </div>

          {/* 最近里程碑 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-700">最近里程碑</h3>
              <button 
                onClick={() => router.push('/timeline')}
                className="text-coral hover:text-pink-600 font-medium"
              >
                查看全部
              </button>
            </div>
            
            {recentMilestones.length > 0 ? (
              <div className="space-y-4">
                {recentMilestones.map((milestone, index) => (
                  <div 
                    key={milestone.id}
                    className="card animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <h4 className="font-medium text-gray-800 mb-2">{milestone.title}</h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {milestone.description || '无描述'}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(milestone.date).toLocaleDateString()}
                      {milestone.type && (
                        <span className="ml-3 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          {milestone.type}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                <p className="text-gray-500">暂无里程碑，点击时光轴添加</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 成长指标预览 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">成长指标</h2>
          <button 
            onClick={() => router.push('/growth')}
            className="text-coral hover:text-pink-600 font-medium"
          >
            查看全部
          </button>
        </div>
        <div className="card bg-gradient-to-br from-blue-50 to-sky-50 border border-sky-100">
          <div className="flex flex-col md:flex-row items-center justify-between p-6">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">宝宝成长追踪</h3>
              <p className="text-gray-600">记录身高、体重等指标，查看成长曲线</p>
            </div>
            <button 
              onClick={() => router.push('/growth')}
              className="btn-secondary"
            >
              查看成长曲线
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
