// API调用封装

const API_BASE_URL = '/api';

// 获取token
const getToken = () => localStorage.getItem('token');

// 通用请求方法
const request = async (url, options = {}) => {
  const token = getToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, mergedOptions);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || '请求失败');
    }
    
    return data;
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
};

// 导出API方法
export const api = {
  // 用户相关
  user: {
    login: (credentials) => request('/users/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => request('/users/register', { method: 'POST', body: JSON.stringify(userData) }),
    getMe: () => request('/users/me'),
    updateMe: (userData) => request('/users/me', { method: 'PUT', body: JSON.stringify(userData) }),
    changePassword: (passwordData) => request('/users/password', { method: 'PUT', body: JSON.stringify(passwordData) })
  },
  
  // 宝宝相关
  baby: {
    getAll: () => request('/babies'),
    getById: (id) => request(`/babies/${id}`),
    create: (babyData) => request('/babies', { method: 'POST', body: JSON.stringify(babyData) }),
    update: (id, babyData) => request(`/babies/${id}`, { method: 'PUT', body: JSON.stringify(babyData) }),
    delete: (id) => request(`/babies/${id}`, { method: 'DELETE' })
  },
  
  // 照片相关
  photo: {
    getAll: (params) => request(`/photos?${new URLSearchParams(params).toString()}`),
    getById: (id) => request(`/photos/${id}`),
    create: (photoData) => request('/photos', { method: 'POST', body: JSON.stringify(photoData) }),
    update: (id, photoData) => request(`/photos/${id}`, { method: 'PUT', body: JSON.stringify(photoData) }),
    delete: (id) => request(`/photos/${id}`, { method: 'DELETE' })
  },
  
  // 日记相关
  diary: {
    getAll: (params) => request(`/diaries?${new URLSearchParams(params).toString()}`),
    getById: (id) => request(`/diaries/${id}`),
    create: (diaryData) => request('/diaries', { method: 'POST', body: JSON.stringify(diaryData) }),
    update: (id, diaryData) => request(`/diaries/${id}`, { method: 'PUT', body: JSON.stringify(diaryData) }),
    delete: (id) => request(`/diaries/${id}`, { method: 'DELETE' })
  },
  
  // 事件相关
  event: {
    getAll: (params) => request(`/events?${new URLSearchParams(params).toString()}`),
    getById: (id) => request(`/events/${id}`),
    create: (eventData) => request('/events', { method: 'POST', body: JSON.stringify(eventData) }),
    update: (id, eventData) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(eventData) }),
    delete: (id) => request(`/events/${id}`, { method: 'DELETE' })
  },
  
  // 里程碑相关
  milestone: {
    getAll: (params) => request(`/milestones?${new URLSearchParams(params).toString()}`),
    getById: (id) => request(`/milestones/${id}`),
    create: (milestoneData) => request('/milestones', { method: 'POST', body: JSON.stringify(milestoneData) }),
    update: (id, milestoneData) => request(`/milestones/${id}`, { method: 'PUT', body: JSON.stringify(milestoneData) }),
    delete: (id) => request(`/milestones/${id}`, { method: 'DELETE' })
  },
  
  // 成长指标相关
  growth: {
    getAll: (params) => request(`/growth?${new URLSearchParams(params).toString()}`),
    getById: (id) => request(`/growth/${id}`),
    create: (growthData) => request('/growth', { method: 'POST', body: JSON.stringify(growthData) }),
    update: (id, growthData) => request(`/growth/${id}`, { method: 'PUT', body: JSON.stringify(growthData) }),
    delete: (id) => request(`/growth/${id}`, { method: 'DELETE' })
  },
  
  // 视频相关
  video: {
    getAll: (params) => request(`/videos?${new URLSearchParams(params).toString()}`),
    getById: (id) => request(`/videos/${id}`),
    create: (videoData) => request('/videos', { method: 'POST', body: JSON.stringify(videoData) }),
    update: (id, videoData) => request(`/videos/${id}`, { method: 'PUT', body: JSON.stringify(videoData) }),
    delete: (id) => request(`/videos/${id}`, { method: 'DELETE' })
  },
  
  // 设置相关
  setting: {
    getAll: (key) => request(key ? `/settings?key=${key}` : '/settings'),
    update: (key, value) => request('/settings', { method: 'POST', body: JSON.stringify({ key, value }) })
  },
  
  // 数据导出/导入
  export: {
    exportData: (format) => request(`/export?format=${format}`),
    importData: (file) => request('/export', { method: 'POST', body: JSON.stringify({ file }) })
  }
};