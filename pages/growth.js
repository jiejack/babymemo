import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import { api } from '../services/api';

export default function Growth() {
  const [growths, setGrowths] = useState([]);
  const [babies, setBabies] = useState([]);
  const [selectedBaby, setSelectedBaby] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBabies = async () => {
      try {
        const response = await api.baby.getAll();
        setBabies(response.data);
        if (response.data.length > 0) {
          setSelectedBaby(response.data[0].id);
        }
      } catch (error) {
        console.error('获取宝宝信息失败:', error);
      }
    };

    fetchBabies();
  }, []);

  useEffect(() => {
    if (selectedBaby) {
      const fetchGrowths = async () => {
        try {
          setLoading(true);
          const response = await api.growth.getAll({ baby_id: selectedBaby });
          // 按日期排序，最新的在前面
          const sortedGrowths = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
          setGrowths(sortedGrowths);
        } catch (error) {
          setError('获取成长指标失败');
          console.error('获取成长指标失败:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchGrowths();
    }
  }, [selectedBaby]);

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
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            添加成长记录
          </button>
        </div>
      </div>

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
                      <button className="text-red-500 hover:text-red-700">删除</button>
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