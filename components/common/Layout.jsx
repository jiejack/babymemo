import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { AppContext } from '../../pages/_app';
import { Home, Camera, Book, Calendar, Star, Video, BarChart3, User, Settings, Menu, X } from 'lucide-react';

export default function Layout({ children }) {
  const { user, logout } = useContext(AppContext);
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', icon: <Home className="w-5 h-5" />, label: '首页' },
    { id: 'photos', icon: <Camera className="w-5 h-5" />, label: '照片' },
    { id: 'diaries', icon: <Book className="w-5 h-5" />, label: '日记' },
    { id: 'calendar', icon: <Calendar className="w-5 h-5" />, label: '日历' },
    { id: 'timeline', icon: <Star className="w-5 h-5" />, label: '时光轴' },
    { id: 'videos', icon: <Video className="w-5 h-5" />, label: '视频' },
    { id: 'growth', icon: <BarChart3 className="w-5 h-5" />, label: '成长' },
    { id: 'journey', icon: <Star className="w-5 h-5" />, label: '大冒险' },
  ];

  const currentPath = router.pathname;
  const isActive = (path) => currentPath === `/${path}` || currentPath.startsWith(`/${path}/`);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部导航 */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-gradient bg-gradient-to-r from-coral to-pink-500 text-transparent bg-clip-text">
                BabyMemo
              </div>
            </div>
            
            {/* 桌面导航 */}
            <nav className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => router.push(`/${item.id}`)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-full transition-all duration-300 ${isActive(item.id) ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'}`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
              
              <div className="flex items-center space-x-4 ml-6">
                <button
                  onClick={() => router.push('/settings')}
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                      {user?.name?.[0] || '宝'}
                    </div>
                    <span className="hidden lg:inline text-sm font-medium">{user?.name || '家长'}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 hidden group-hover:block">
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      退出登录
                    </button>
                  </div>
                </div>
              </div>
            </nav>
            
            {/* 移动端菜单按钮 */}
            <button
              className="md:hidden text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* 移动端导航 */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 py-2">
              <nav className="flex flex-col space-y-2 py-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      router.push(`/${item.id}`);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive(item.id) ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
                <div className="border-t border-gray-200 my-2"></div>
                <button
                  onClick={() => {
                    router.push('/settings');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">设置</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">退出登录</span>
                </button>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* 主内容区 */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">
                © 2024 BabyMemo. 记录宝宝成长的每一个瞬间.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">
                关于我们
              </a>
              <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">
                隐私政策
              </a>
              <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">
                使用条款
              </a>
              <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">
                联系我们
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
