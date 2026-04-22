// API调用封装
// 规则：所有网络操作必须有超时机制，避免卡死

const API_BASE_URL = '/api';
const DEFAULT_TIMEOUT = 30000; // 默认30秒超时

// 获取token
const getToken = () => localStorage.getItem('token');

// 通用请求方法
const request = async (url, options = {}) => {
  const token = getToken();
  const timeout = options.timeout || DEFAULT_TIMEOUT;
  
  const mergedOptions = {
    ...options,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  };

  // 创建超时控制器
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...mergedOptions,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || '请求失败');
    }
    
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('API请求超时:', url);
      throw new Error('请求超时，请稍后重试');
    }
    console.error('API请求错误:', error);
    throw error;
  }
};

// 导出API方法
export const api = {
  // 用户相关
  user: {
    login: (credentials) => request('/users/login', { 
      method: 'POST', 
      body: JSON.stringify(credentials),
      headers: { 'Content-Type': 'application/json' }
    }),
    register: (userData) => request('/users', { 
      method: 'POST', 
      body: JSON.stringify(userData),
      headers: { 'Content-Type': 'application/json' }
    }),
    getMe: () => request('/users/me'),
    updateMe: (userData) => request('/users/me', { 
      method: 'PUT', 
      body: JSON.stringify(userData),
      headers: { 'Content-Type': 'application/json' }
    }),
    changePassword: (passwordData) => request('/users/password', { 
      method: 'PUT', 
      body: JSON.stringify(passwordData),
      headers: { 'Content-Type': 'application/json' }
    })
  },
  
  // 宝宝相关
  baby: {
    getAll: () => request('/babies'),
    getById: (id) => request(`/babies?id=${id}`),
    create: (babyData) => request('/babies', { 
      method: 'POST', 
      body: JSON.stringify(babyData),
      headers: { 'Content-Type': 'application/json' }
    }),
    update: (id, babyData) => request(`/babies?id=${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(babyData),
      headers: { 'Content-Type': 'application/json' }
    }),
    delete: (id) => request(`/babies?id=${id}`, { method: 'DELETE' })
  },
  
  // 照片相关
  photo: {
    getAll: (params) => request(`/photos?${new URLSearchParams(params).toString()}`),
    getById: (id) => request(`/photos?id=${id}`),
    create: (photoData) => {
      const isFormData = photoData instanceof FormData;
      return request('/photos', {
        method: 'POST',
        body: isFormData ? photoData : JSON.stringify(photoData),
        headers: isFormData ? {} : { 'Content-Type': 'application/json' }
      });
    },
    update: (id, photoData) => {
      const isFormData = photoData instanceof FormData;
      return request(`/photos?id=${id}`, {
        method: 'PUT',
        body: isFormData ? photoData : JSON.stringify(photoData),
        headers: isFormData ? {} : { 'Content-Type': 'application/json' }
      });
    },
    delete: (id) => request(`/photos?id=${id}`, { method: 'DELETE' })
  },
  
  // 日记相关
  diary: {
    getAll: (params) => request(`/diaries?${new URLSearchParams(params).toString()}`),
    getById: (id) => request(`/diaries?id=${id}`),
    create: (diaryData) => request('/diaries', { 
      method: 'POST', 
      body: JSON.stringify(diaryData),
      headers: { 'Content-Type': 'application/json' }
    }),
    update: (id, diaryData) => request(`/diaries?id=${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(diaryData),
      headers: { 'Content-Type': 'application/json' }
    }),
    delete: (id) => request(`/diaries?id=${id}`, { method: 'DELETE' })
  },
  
  // 事件相关
  event: {
    getAll: (params) => request(`/events?${new URLSearchParams(params).toString()}`),
    getById: (id) => request(`/events?id=${id}`),
    create: (eventData) => request('/events', { 
      method: 'POST', 
      body: JSON.stringify(eventData),
      headers: { 'Content-Type': 'application/json' }
    }),
    update: (id, eventData) => request(`/events?id=${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(eventData),
      headers: { 'Content-Type': 'application/json' }
    }),
    delete: (id) => request(`/events?id=${id}`, { method: 'DELETE' })
  },
  
  // 里程碑相关
  milestone: {
    getAll: (params) => request(`/milestones?${new URLSearchParams(params).toString()}`),
    getById: (id) => request(`/milestones?id=${id}`),
    create: (milestoneData) => request('/milestones', { 
      method: 'POST', 
      body: JSON.stringify(milestoneData),
      headers: { 'Content-Type': 'application/json' }
    }),
    update: (id, milestoneData) => request(`/milestones?id=${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(milestoneData),
      headers: { 'Content-Type': 'application/json' }
    }),
    delete: (id) => request(`/milestones?id=${id}`, { method: 'DELETE' })
  },
  
  // 成长指标相关
  growth: {
    getAll: (params) => request(`/growth?${new URLSearchParams(params).toString()}`),
    getById: (id) => request(`/growth?id=${id}`),
    create: (growthData) => request('/growth', { 
      method: 'POST', 
      body: JSON.stringify(growthData),
      headers: { 'Content-Type': 'application/json' }
    }),
    update: (id, growthData) => request(`/growth?id=${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(growthData),
      headers: { 'Content-Type': 'application/json' }
    }),
    delete: (id) => request(`/growth?id=${id}`, { method: 'DELETE' })
  },
  
  // 视频相关
  video: {
    getAll: (params) => request(`/videos?${new URLSearchParams(params).toString()}`),
    getById: (id) => request(`/videos?id=${id}`),
    create: (videoData) => {
      const isFormData = videoData instanceof FormData;
      return request('/videos', {
        method: 'POST',
        body: isFormData ? videoData : JSON.stringify(videoData),
        headers: isFormData ? {} : { 'Content-Type': 'application/json' }
      });
    },
    update: (id, videoData) => {
      const isFormData = videoData instanceof FormData;
      return request(`/videos?id=${id}`, {
        method: 'PUT',
        body: isFormData ? videoData : JSON.stringify(videoData),
        headers: isFormData ? {} : { 'Content-Type': 'application/json' }
      });
    },
    delete: (id) => request(`/videos?id=${id}`, { method: 'DELETE' })
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