import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-pink-500 mb-4">BabyMemo</h1>
          <p className="text-lg text-gray-600">记录宝宝成长的每一个珍贵瞬间</p>
        </div>

        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">用户登录</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">用户名</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="请输入用户名"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">密码</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="请输入密码"
                />
              </div>
              <button 
                type="button"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                登录
              </button>
              <div className="text-center">
                <a href="/auth/register" className="text-pink-500 hover:underline">
                  没有账号？点击注册
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
