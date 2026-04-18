import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { AppContext } from './_app';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AppContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = isLogin ? '/api/users/login' : '/api/users/register';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(isLogin ? { username, password } : { username, password, name })
      });

      const data = await response.json();

      if (data.status === 'error') {
        setError(data.message);
      } else {
        if (isLogin) {
            // 处理登录响应
            if (data.data && data.data.token) {
              login(data.data.user, data.data.token);
              router.push('/dashboard');
            } else {
              setError('登录响应格式错误');
            }
          } else {
            // 注册成功后自动登录
            const loginResponse = await fetch('/api/users/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ username, password })
            });

            const loginData = await loginResponse.json();
            if (loginData.status === 'success' && loginData.data && loginData.data.token) {
              login(loginData.data.user, loginData.data.token);
              router.push('/dashboard');
            } else {
              setError('自动登录失败');
            }
          }
      }
    } catch (error) {
      setError('服务器错误，请稍后再试');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center relative overflow-hidden">
      {/* 装饰元素 */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-yellow rounded-full opacity-30 animate-bubble"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-coral rounded-full opacity-20 animate-float"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-mint rounded-full opacity-25 animate-bubble" style={{ animationDelay: '1s' }}></div>
      
      {/* 主容器 */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 animate-fade-in-up">
          {/* Logo 和标题 */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-coral to-pink-500">
              BabyMemo
            </h1>
            <p className="text-gray-600 text-lg">记录宝宝成长的每一个珍贵瞬间</p>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 animate-fade-in-up">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16c-.77.833.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 登录/注册切换 */}
            <div className="flex bg-gray-100 rounded-full p-1">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 rounded-full font-medium transition-all duration-300 ${isLogin ? 'bg-gradient-to-r from-coral to-pink-500 text-white shadow-md' : 'text-gray-600 hover:text-gray-800'}`}
              >
                登录
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 rounded-full font-medium transition-all duration-300 ${!isLogin ? 'bg-gradient-to-r from-mint to-teal-400 text-white shadow-md' : 'text-gray-600 hover:text-gray-800'}`}
              >
                注册
              </button>
            </div>

            {/* 姓名输入（注册时显示） */}
            {!isLogin && (
              <div className="animate-fade-in-up">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  姓名
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  placeholder="请输入您的姓名"
                  required
                />
              </div>
            )}

            {/* 用户名输入 */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                用户名
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="请输入用户名"
                required
              />
            </div>

            {/* 密码输入 */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                密码
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="请输入密码"
                required
              />
            </div>

            {/* 提交按钮 */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    处理中...
                  </div>
                ) : isLogin ? '登录' : '注册'}
              </button>
            </div>
          </form>
        </div>

        {/* 底部装饰 */}
        <div className="mt-6 text-center text-gray-500 text-sm animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <p>© 2026 BabyMemo. 记录美好，珍藏回忆。</p>
        </div>
      </div>
    </div>
  );
}