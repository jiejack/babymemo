import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';

export default function Babies() {
  const [babies, setBabies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleAddDemoBaby = () => {
    const newBaby = {
      id: Date.now(),
      name: '演示宝宝',
      gender: '男',
      birthDate: new Date().toISOString(),
      avatar: 'https://via.placeholder.com/100?text=Baby',
      height: 50,
      weight: 3.5,
      notes: ''
    };
    setBabies(prev => [...prev, newBaby]);
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
        <h1 className="text-2xl font-bold text-gray-800 mb-4">宝宝管理</h1>
        <div className="flex justify-end mb-4">
          <button 
            onClick={handleAddDemoBaby}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            添加演示宝宝
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {babies.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">暂无宝宝信息，点击添加演示宝宝按钮开始</p>
          </div>
        ) : (
          babies.map((baby) => (
            <div key={baby.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-2xl font-bold">
                    {baby.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-medium text-gray-900">{baby.name}</h3>
                    <p className="text-sm text-gray-500">
                      出生日期: {new Date(baby.birthDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      性别: {baby.gender || '未设置'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="text-blue-500 hover:text-blue-700 text-sm">编辑</button>
                  <button className="text-blue-500 hover:text-blue-700 text-sm">查看详情</button>
                  <button className="text-red-500 hover:text-red-700 text-sm">删除</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
