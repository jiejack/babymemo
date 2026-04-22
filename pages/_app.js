import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import { GameProvider } from '../context/GameContext';

// 创建应用上下文
export const AppContext = React.createContext();

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 检查用户登录状态
  useEffect(() => {
    const checkAuth = async () => {
      // 确保在客户端执行
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }
      
      try {
        // 检查localStorage和sessionStorage
        let token = null;
        let savedUser = null;
        
        try {
          token = localStorage.getItem('token');
          savedUser = localStorage.getItem('user');
          console.log('Found token in localStorage:', token ? 'Yes' : 'No');
        } catch (e) {
          console.error('localStorage access error:', e);
        }
        
        if (!token) {
          try {
            token = sessionStorage.getItem('token');
            savedUser = sessionStorage.getItem('user');
            console.log('Found token in sessionStorage:', token ? 'Yes' : 'No');
          } catch (e) {
            console.error('sessionStorage access error:', e);
          }
        }
        
        console.log('Final token value:', token ? 'Token exists' : 'No token');
        
        if (token && savedUser) {
          // 使用本地存储的用户信息，不依赖后端API
          try {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            console.log('User set successfully from storage:', userData);
          } catch (parseError) {
            console.error('Error parsing user data:', parseError);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
        console.log('Auth check completed, isLoading set to false');
      }
    };

    // 稍作延迟以确保DOM就绪
    const timer = setTimeout(() => {
      checkAuth();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // 登录函数
  const login = (userData, token) => {
    console.log('Login function called');
    console.log('User data:', userData);
    console.log('Token:', token ? 'Token provided' : 'No token');
    
    if (!token) {
      console.error('No token provided to login function');
      return;
    }
    
    setUser(userData);
    
    // 同时存储到localStorage和sessionStorage
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('Token and user stored in localStorage');
    } catch (e) {
      console.error('localStorage error:', e);
    }
    
    try {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(userData));
      console.log('Token and user stored in sessionStorage');
    } catch (e) {
      console.error('sessionStorage error:', e);
    }
  };

  // 登出函数
  const logout = () => {
    setUser(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('Token and user removed from localStorage');
    }
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      console.log('Token and user removed from sessionStorage');
    }
    router.push('/');
  };

  // 路由保护 - 只在认证检查完成后才执行
  useEffect(() => {
    if (isLoading) {
      return; // 还在加载中，不执行路由保护
    }
    
    const protectedRoutes = ['/dashboard', '/photos', '/diaries', '/calendar', '/timeline', '/babies', '/growth', '/videos', '/settings', '/journey'];
    const currentPath = router.pathname;

    if (!user && protectedRoutes.some(route => currentPath.startsWith(route))) {
      console.log('Redirecting to login page - user not authenticated');
      router.push('/');
    } else if (user && currentPath === '/') {
      // 如果用户已登录但在首页，重定向到dashboard
      console.log('Redirecting to dashboard - user already authenticated');
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-gray-100">加载中...</div>;
  }

  return (
    <GameProvider>
      <AppContext.Provider value={{ user, login, logout }}>
        <Component {...pageProps} />
      </AppContext.Provider>
    </GameProvider>
  );
}

export default MyApp;