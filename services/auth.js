// 认证服务
import { api } from './api';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authService = {
  // 登录
  login: async (username, password) => {
    try {
      const response = await api.user.login({ username, password });
      if (response.status === 'success') {
        localStorage.setItem('token', response.data.token);
        return response.data;
      }
      throw new Error(response.message);
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },

  // 注册
  register: async (userData) => {
    try {
      const response = await api.user.register(userData);
      if (response.status === 'success') {
        // 注册成功后自动登录
        const loginResponse = await api.user.login({
          username: userData.username,
          password: userData.password
        });
        if (loginResponse.status === 'success') {
          localStorage.setItem('token', loginResponse.data.token);
          return loginResponse.data;
        }
      }
      throw new Error(response.message);
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    }
  },

  // 登出
  logout: () => {
    localStorage.removeItem('token');
  },

  // 检查是否已登录
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // 获取当前用户信息
  getCurrentUser: async () => {
    try {
      const response = await api.user.getMe();
      if (response.status === 'success') {
        return response.data;
      }
      throw new Error(response.message);
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw error;
    }
  },

  // 更新用户信息
  updateUser: async (userData) => {
    try {
      const response = await api.user.updateMe(userData);
      if (response.status === 'success') {
        return response.data;
      }
      throw new Error(response.message);
    } catch (error) {
      console.error('更新用户信息失败:', error);
      throw error;
    }
  },

  // 修改密码
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await api.user.changePassword({ old_password: oldPassword, new_password: newPassword });
      if (response.status === 'success') {
        return true;
      }
      throw new Error(response.message);
    } catch (error) {
      console.error('修改密码失败:', error);
      throw error;
    }
  }
};

// 从请求中获取用户ID
export function getUserIdFromToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  if (!token) {
    return null;
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.id;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export default authService;