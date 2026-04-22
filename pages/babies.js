import React, { useState, useEffect } from 'react';
import Layout from '../components/common/Layout';
import { api } from '../services/api';

export default function Babies() {
  const [babies, setBabies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBaby, setEditingBaby] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    gender: '',
    birthday: '',
    avatar: ''
  });

  useEffect(() => {
    fetchBabies();
  }, []);

  const fetchBabies = async () => {
    try {
      setLoading(true);
      const response = await api.baby.getAll();
      if (response.status === 'success' && response.data) {
        setBabies(response.data);
      }
    } catch (error) {
      console.error('Error fetching babies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDemoBaby = async () => {
    try {
      const newBaby = {
        name: '演示宝宝',
        birthday: new Date().toISOString(),
        gender: '男',
        avatar: 'https://via.placeholder.com/100?text=Baby'
      };
      const response = await api.baby.create(newBaby);
      if (response.status === 'success' && response.data) {
        setBabies(prev => [...prev, response.data]);
      }
    } catch (error) {
      console.error('Error adding baby:', error);
    }
  };

  const handleDeleteBaby = async (id) => {
    try {
      const response = await api.baby.delete(id);
      if (response.status === 'success') {
        setBabies(prev => prev.filter(baby => baby.id !== id));
      }
    } catch (error) {
      console.error('Error deleting baby:', error);
    }
  };

  const handleEditBaby = async (id) => {
    try {
      const response = await api.baby.getById(id);
      if (response.status === 'success' && response.data) {
        const baby = response.data;
        setEditingBaby(baby);
        setEditForm({
          name: baby.name || '',
          gender: baby.gender || '',
          birthday: baby.birthday ? new Date(baby.birthday).toISOString().split('T')[0] : '',
          avatar: baby.avatar || ''
        });
        setShowEditModal(true);
      }
    } catch (error) {
      console.error('Error editing baby:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.baby.update(editingBaby.id, editForm);
      if (response.status === 'success' && response.data) {
        setBabies(prev => prev.map(baby => baby.id === editingBaby.id ? response.data : baby));
        setShowEditModal(false);
        setEditingBaby(null);
      }
    } catch (error) {
      console.error('Error updating baby:', error);
    }
  };

  const handleViewBaby = async (id) => {
    try {
      // 这里可以实现查看详情功能，比如打开详情模态框
      console.log('View baby with id:', id);
    } catch (error) {
      console.error('Error viewing baby:', error);
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
                      出生日期: {new Date(baby.birthday || baby.birthDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      性别: {baby.gender || '未设置'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button 
                    onClick={() => handleEditBaby(baby.id)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    编辑
                  </button>
                  <button 
                    onClick={() => handleViewBaby(baby.id)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    查看详情
                  </button>
                  <button 
                    onClick={() => handleDeleteBaby(baby.id)}
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
            <h2 className="text-xl font-bold text-gray-800 mb-4">编辑宝宝信息</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="宝宝姓名"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
                <select
                  value={editForm.gender}
                  onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">请选择</option>
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">出生日期</label>
                <input
                  type="date"
                  value={editForm.birthday}
                  onChange={(e) => setEditForm({...editForm, birthday: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">头像URL</label>
                <input
                  type="text"
                  value={editForm.avatar}
                  onChange={(e) => setEditForm({...editForm, avatar: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="可选"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingBaby(null);
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
