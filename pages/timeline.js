import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import { api } from '../services/api';
import MilestoneForm from '../components/timeline/MilestoneForm';

export default function Timeline() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        setLoading(true);
        const response = await api.milestone.getAll();
        // 按日期排序，最新的在前面
        const sortedMilestones = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMilestones(sortedMilestones);
      } catch (error) {
        setError('获取里程碑失败');
        console.error('获取里程碑失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMilestones();
  }, []);

  const handleSaveMilestone = (newMilestone) => {
    if (editingMilestone) {
      // 更新现有里程碑
      setMilestones(prev => prev.map(milestone => milestone.id === newMilestone.id ? newMilestone : milestone));
    } else {
      // 添加新里程碑
      setMilestones(prev => [newMilestone, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
  };

  const handleEditMilestone = (milestone) => {
    setEditingMilestone(milestone);
    setShowMilestoneForm(true);
  };

  const handleAddMilestone = () => {
    setEditingMilestone(null);
    setShowMilestoneForm(true);
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
        <h1 className="text-2xl font-bold text-gray-800 mb-4">时光轴</h1>
        <div className="flex justify-end mb-4">
          <button 
            onClick={handleAddMilestone}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            添加里程碑
          </button>
        </div>
      </div>

      <div className="relative">
        {/* 时间轴中心线 */}
        <div className="absolute left-0 md:left-1/2 h-full w-0.5 bg-gray-200 transform md:translate-x-[-0.5px]"></div>

        <div className="space-y-8">
          {milestones.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">暂无里程碑，点击添加里程碑按钮开始记录</p>
            </div>
          ) : (
            milestones.map((milestone, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={milestone.id} className={`relative flex ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}>
                  {/* 时间轴点 */}
                  <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-blue-500 transform -translate-x-1/2 md:translate-x-[-50%]"></div>
                  
                  {/* 内容 */}
                  <div className={`ml-8 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-medium text-gray-900">{milestone.title}</h3>
                        <span className="text-sm text-gray-500">{new Date(milestone.date).toLocaleDateString()}</span>
                      </div>
                      {milestone.description && (
                        <p className="mt-2 text-gray-600">{milestone.description}</p>
                      )}
                      {milestone.images && milestone.images.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          {milestone.images.map((image, imgIndex) => (
                            <img 
                              key={imgIndex} 
                              src={image} 
                              alt={`${milestone.title} - 图片 ${imgIndex + 1}`} 
                              className="w-full h-24 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}
                      {milestone.tags && milestone.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {milestone.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-4 flex space-x-2">
                        <button onClick={() => handleEditMilestone(milestone)} className="text-blue-500 hover:text-blue-700 text-sm">编辑</button>
                        <button className="text-red-500 hover:text-red-700 text-sm">删除</button>
                      </div>
                    </div>
                  </div>
                  
                  {/* 空白占位 */}
                  <div className="hidden md:block md:w-1/2"></div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {showMilestoneForm && (
        <MilestoneForm 
          milestone={editingMilestone}
          onSave={handleSaveMilestone} 
          onClose={() => setShowMilestoneForm(false)} 
        />
      )}
    </Layout>
  );
}