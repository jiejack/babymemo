import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import { api } from '../services/api';

export default function Growth() {
  const [growths, setGrowths] = useState([]);
  const [babies, setBabies] = useState([]);
  const [selectedBaby, setSelectedBaby] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newGrowth, setNewGrowth] = useState({
    date: new Date().toISOString().split('T')[0],
    height: '',
    weight: '',
    head_circumference: '',
    notes: ''
  });
  const [editingGrowth, setEditingGrowth] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    date: '',
    height: '',
    weight: '',
    head_circumference: '',
    notes: ''
  });

  useEffect(() => {
    fetchBabies();
  }, []);

  useEffect(() => {
    if (selectedBaby) {
      fetchGrowths();
    }
  }, [selectedBaby]);

  const fetchBabies = async () => {
    try {
      const response = await api.baby.getAll();
      if (response.status === 'success' && response.data) {
        setBabies(response.data);
        if (response.data.length > 0 && !selectedBaby) {
          setSelectedBaby(response.data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching babies:', error);
    }
  };

  const fetchGrowths = async () => {
    try {
      const response = await api.growth.getAll({ baby_id: selectedBaby });
      if (response.status === 'success' && response.data) {
        setGrowths(response.data);
      }
    } catch (error) {
      console.error('Error fetching growths:', error);
    }
  };

  const handleAddGrowth = async () => {
    try {
      const growthData = {
        baby_id: selectedBaby,
        date: newGrowth.date,
        height: parseFloat(newGrowth.height) || null,
        weight: parseFloat(newGrowth.weight) || null,
        head_circumference: parseFloat(newGrowth.head_circumference) || null,
        notes: newGrowth.notes
      };
      const response = await api.growth.create(growthData);
      if (response.status === 'success' && response.data) {
        setGrowths([response.data, ...growths]);
        setShowForm(false);
        setNewGrowth({
          date: new Date().toISOString().split('T')[0],
          height: '',
          weight: '',
          head_circumference: '',
          notes: ''
        });
      }
    } catch (error) {
      console.error('Error adding growth:', error);
    }
  };

  const handleDeleteGrowth = async (id) => {
    try {
      const response = await api.growth.delete(id);
      if (response.status === 'success') {
        setGrowths(growths.filter(g => g.id !== id));
      }
    } catch (error) {
      console.error('Error deleting growth:', error);
    }
  };

  const handleEditGrowth = async (id) => {
    try {
      const response = await api.growth.getById(id);
      if (response.status === 'success' && response.data) {
        const growth = response.data;
        setEditingGrowth(growth);
        setEditForm({
          date: growth.date ? new Date(growth.date).toISOString().split('T')[0] : '',
          height: growth.height || '',
          weight: growth.weight || '',
          head_circumference: growth.head_circumference || '',
          notes: growth.notes || ''
        });
        setShowEditModal(true);
      }
    } catch (error) {
      console.error('Error editing growth:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.growth.update(editingGrowth.id, {
        ...editForm,
        baby_id: selectedBaby
      });
      if (response.status === 'success' && response.data) {
        setGrowths(prev => prev.map(growth => growth.id === editingGrowth.id ? response.data : growth));
        setShowEditModal(false);
        setEditingGrowth(null);
      }
    } catch (error) {
      console.error('Error updating growth:', error);
    }
  };

  const handleAddDemoGrowth = async () => {
    try {
      const demoData = [
        {
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          height: 65.5,
          weight: 7.2,
          head_circumference: 42.0,
          notes: '满月体检'
        },
        {
          date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          height: 62.0,
          weight: 6.5,
          head_circumference: 40.5,
          notes: '出生后两周'
        },
        {
          date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          height: 58.0,
          weight: 5.8,
          head_circumference: 39.0,
          notes: '出生时'
        }
      ];

      for (const data of demoData) {
        const growthData = {
          baby_id: selectedBaby,
          ...data
        };
        const response = await api.growth.create(growthData);
        if (response.status === 'success' && response.data) {
          setGrowths(prev => [response.data, ...prev]);
        }
      }
    } catch (error) {
      console.error('Error adding demo growth records:', error);
    }
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
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {showForm ? '取消' : '添加成长记录'}
            </button>
            <button 
              onClick={handleAddDemoGrowth}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              添加演示记录
            </button>
          </div>
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
                      <button 
                        onClick={() => handleEditGrowth(growth.id)}
                        className="text-blue-500 hover:text-blue-700 mr-3"
                      >
                        编辑
                      </button>
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

      {/* 编辑模态框 */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">编辑成长记录</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">身高 (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editForm.height}
                  onChange={(e) => setEditForm({...editForm, height: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="例如：60.5"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">体重 (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.weight}
                  onChange={(e) => setEditForm({...editForm, weight: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="例如：6.5"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">头围 (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editForm.head_circumference}
                  onChange={(e) => setEditForm({...editForm, head_circumference: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="例如：40"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                  placeholder="添加备注..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingGrowth(null);
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
    </Layout>
  );
}
