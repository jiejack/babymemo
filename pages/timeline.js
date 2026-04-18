import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';

export default function Timeline() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleAddDemoMilestone = () => {
    const newMilestone = {
      id: Date.now(),
      title: '演示里程碑',
      date: new Date().toISOString(),
      description: '这是一个演示的里程碑事件',
      type: '成长',
      image: ''
    };
    setMilestones(prev => [newMilestone, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
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
        <h1 className="text-2xl font-bold text-gray-800 mb-4">时光轴</h1>
        <div className="flex justify-end mb-4">
          <button 
            onClick={handleAddDemoMilestone}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            添加演示里程碑
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 md:left-1/2 h-full w-0.5 bg-gray-200 transform md:translate-x-[-0.5px]"></div>

        <div className="space-y-8">
          {milestones.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">暂无里程碑，点击添加演示里程碑按钮开始</p>
            </div>
          ) : (
            milestones.map((milestone, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={milestone.id} className={`relative flex ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}>
                  <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-blue-500 transform -translate-x-1/2 md:translate-x-[-50%]"></div>
                  
                  <div className={`ml-8 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-medium text-gray-900">{milestone.title}</h3>
                        <span className="text-sm text-gray-500">{new Date(milestone.date).toLocaleDateString()}</span>
                      </div>
                      {milestone.description && (
                        <p className="mt-2 text-gray-600">{milestone.description}</p>
                      )}
                      {milestone.type && (
                        <div className="mt-2">
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {milestone.type}
                          </span>
                        </div>
                      )}
                      <div className="mt-4 flex space-x-2">
                        <button className="text-blue-500 hover:text-blue-700 text-sm">编辑</button>
                        <button className="text-red-500 hover:text-red-700 text-sm">删除</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden md:block md:w-1/2"></div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Layout>
  );
}
