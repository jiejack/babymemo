import React, { useState } from 'react';
import Layout from '../components/common/Layout';

export default function Growth() {
  const [growths, setGrowths] = useState([
    { id: 1, date: '2024-01-15', height: 50, weight: 3.5, head_circumference: 35, notes: '出生时' },
    { id: 2, date: '2024-02-15', height: 55, weight: 4.8, head_circumference: 37, notes: '满月体检' },
    { id: 3, date: '2024-03-15', height: 59, weight: 6.2, head_circumference: 39, notes: '两个月' }
  ]);
  const [babies, setBabies] = useState([
    { id: 1, name: '宝宝', birth_date: '2024-01-15', gender: 'male' }
  ]);
  const [selectedBaby, setSelectedBaby] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [newGrowth, setNewGrowth] = useState({
    date: new Date().toISOString().split('T')[0],
    height: '',
    weight: '',
    head_circumference: '',
    notes: ''
  });

  const handleAddGrowth = () => {
    const growth = {
      id: Date.now(),
      ...newGrowth,
      height: parseFloat(newGrowth.height) || null,
      weight: parseFloat(newGrowth.weight) || null,
      head_circumference: parseFloat(newGrowth.head_circumference) || null
    };
    setGrowths([growth, ...growths]);
    setShowForm(false);
    setNewGrowth({
      date: new Date().toISOString().split('T')[0],
      height: '',
      weight: '',
      head_circumference: '',
      notes: ''
    });
  };

  const handleDeleteGrowth = (id) => {
    setGrowths(growths.filter(g => g.id !== id));
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">成长指标</h1>
        <div className="flex flex-wrap items-center justify-between mb-4">
          {babies.length > 0 ? (
            <div className="mb-4 sm:mb-0">
              <label htmlFor="baby-select" className="block text-sm font-medium text-gray-700 mb-1">
                选择宝宝
              </label>
              <select
                id="baby-select"
                value={selectedBaby}
                onChange={(e) => setSelectedBaby(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                {babies.map((baby) => (
                  <option key={baby.id} value={baby.id}>
                    {baby.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="mb-4 text-gray-500">请先添加宝宝信息</div>
          )}
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {showForm ? '取消' : '添加成长记录'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">添加成长记录</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
              <input
                type="date"
                value={newGrowth.date}
                onChange={(e) => setNewGrowth({...newGrowth, date: e.target.value})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">身高 (cm)</label>
              <input
                type="number"
                step="0.1"
                value={newGrowth.height}
                onChange={(e) => setNewGrowth({...newGrowth, height: e.target.value})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="例如：60.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">体重 (kg)</label>
              <input
                type="number"
                step="0.01"
                value={newGrowth.weight}
                onChange={(e) => setNewGrowth({...newGrowth, weight: e.target.value})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="例如：6.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">头围 (cm)</label>
              <input
                type="number"
                step="0.1"
                value={newGrowth.head_circumference}
                onChange={(e) => setNewGrowth({...newGrowth, head_circumference: e.target.value})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="例如：40"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
              <textarea
                value={newGrowth.notes}
                onChange={(e) => setNewGrowth({...newGrowth, notes: e.target.value})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="3"
                placeholder="添加备注..."
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAddGrowth}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            >
              保存
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              取消
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  日期
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  身高 (cm)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  体重 (kg)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  头围 (cm)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  备注
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {growths.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    暂无成长记录
                  </td>
                </tr>
              ) : (
                growths.map((growth) => (
                  <tr key={growth.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(growth.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {growth.height || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {growth.weight || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {growth.head_circumference || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {growth.notes || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-500 hover:text-blue-700 mr-3">编辑</button>
                      <button 
                        onClick={() => handleDeleteGrowth(growth.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
