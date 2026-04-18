import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';

// 创建应用上下文
export const AppContext = React.createContext();

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 检查用户登录状态
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // 验证token并获取用户信息
          const response = await fetch('/api/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.data);
          } else {
            // token无效，清除本地存储
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 登录函数
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
  };

  // 登出函数
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    router.push('/');
  };

  // 路由保护
  useEffect(() => {
    const protectedRoutes = ['/dashboard', '/photos', '/diaries', '/calendar', '/timeline', '/babies', '/growth', '/videos', '/settings'];
    const currentPath = router.pathname;

    if (!isLoading && !user && protectedRoutes.some(route => currentPath.startsWith(route))) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-gray-100">加载中...</div>;
  }

  return (
    <AppContext.Provider value={{ user, login, logout }}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp;