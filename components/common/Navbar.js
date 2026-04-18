import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { AppContext } from '../../pages/_app';

export default function Navbar() {
  const { user, logout } = useContext(AppContext);
  const router = useRouter();

  const navItems = [
    { name: '照片墙', path: '/photos' },
    { name: '创意日记', path: '/diaries' },
    { name: '创意日历', path: '/calendar' },
    { name: '时光轴', path: '/timeline' },
    { name: '宝宝管理', path: '/babies' },
    { name: '成长指标', path: '/growth' },
    { name: '视频管理', path: '/videos' },
    { name: '设置', path: '/settings' }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-blue-500">BabyMemo</h1>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <a
                    key={item.path}
                    href={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${router.pathname === item.path ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="ml-4 flex items-center md:ml-6">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                登出
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 移动端导航 */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${router.pathname === item.path ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {item.name}
            </a>
          ))}
          <div className="pt-2">
            <button
              onClick={handleLogout}
              className="block w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              登出
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}