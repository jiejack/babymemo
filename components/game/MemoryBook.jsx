import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Download, Share2, Calendar, Camera, Star, Heart } from 'lucide-react';

export default function MemoryBook({ photos, diaries, milestones }) {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBook, setGeneratedBook] = useState(null);

  // 按时间排序数据
  const sortedPhotos = useMemo(() => {
    return [...photos].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [photos]);

  const sortedDiaries = useMemo(() => {
    return [...diaries].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [diaries]);

  const sortedMilestones = useMemo(() => {
    return [...milestones].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [milestones]);

  // 过滤数据
  const filteredData = useMemo(() => {
    const now = new Date();
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
    const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));

    const filterByDate = (item) => {
      if (!item.date) return false;
      const itemDate = new Date(item.date);
      switch (selectedPeriod) {
        case 'month':
          return itemDate >= oneMonthAgo;
        case 'quarter':
          return itemDate >= threeMonthsAgo;
        case 'all':
        default:
          return true;
      }
    };

    return {
      photos: sortedPhotos.filter(filterByDate),
      diaries: sortedDiaries.filter(filterByDate),
      milestones: sortedMilestones.filter(filterByDate)
    };
  }, [sortedPhotos, sortedDiaries, sortedMilestones, selectedPeriod]);

  // 生成纪念册
  const generateMemoryBook = () => {
    setIsGenerating(true);
    
    // 模拟生成过程
    setTimeout(() => {
      const book = {
        title: `宝贝的成长纪念册`,
        date: new Date().toLocaleDateString(),
        pages: [
          {
            type: 'cover',
            title: '宝贝的成长之旅',
            subtitle: `记录美好时光`,
            date: new Date().toLocaleDateString()
          },
          ...filteredData.milestones.slice(0, 3).map(milestone => ({
            type: 'milestone',
            data: milestone
          })),
          ...filteredData.photos.slice(0, 6).map(photo => ({
            type: 'photo',
            data: photo
          })),
          ...filteredData.diaries.slice(0, 2).map(diary => ({
            type: 'diary',
            data: diary
          })),
          {
            type: 'back',
            message: '成长路上，有你有我'
          }
        ]
      };
      
      setGeneratedBook(book);
      setIsGenerating(false);
    }, 2000);
  };

  // 下载纪念册
  const downloadMemoryBook = () => {
    // 模拟下载功能
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(generatedBook, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `memory-book-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // 分享纪念册
  const shareMemoryBook = () => {
    // 模拟分享功能
    if (navigator.share) {
      navigator.share({
        title: '宝贝的成长纪念册',
        text: '快来看看我家宝贝的成长纪念册！',
        url: window.location.href
      });
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板！');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Book className="w-6 h-6 mr-3" /> 成长纪念册
        </h2>
        <div className="flex space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-white/10 text-white px-3 py-2 rounded-full border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="all">全部时间</option>
            <option value="month">近一个月</option>
            <option value="quarter">近三个月</option>
          </select>
          <button
            onClick={generateMemoryBook}
            disabled={isGenerating || (filteredData.photos.length === 0 && filteredData.diaries.length === 0 && filteredData.milestones.length === 0)}
            className={`bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 ${isGenerating || (filteredData.photos.length === 0 && filteredData.diaries.length === 0 && filteredData.milestones.length === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-pink-500/30'}`}
          >
            {isGenerating ? '生成中...' : '生成纪念册'}
          </button>
        </div>
      </div>

      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-medium">📸 照片</h3>
              <span className="text-pink-300 font-bold">{filteredData.photos.length}</span>
            </div>
            <p className="text-white/60 text-sm">记录美好瞬间</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-medium">📚 日记</h3>
              <span className="text-purple-300 font-bold">{filteredData.diaries.length}</span>
            </div>
            <p className="text-white/60 text-sm">写下成长故事</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-medium">⭐ 里程碑</h3>
              <span className="text-yellow-300 font-bold">{filteredData.milestones.length}</span>
            </div>
            <p className="text-white/60 text-sm">标记重要时刻</p>
          </div>
        </div>

        <AnimatePresence>
          {generatedBook && (
            <motion.div
              className="bg-gradient-to-br from-white/15 to-white/5 rounded-2xl p-6 border border-white/20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Book className="w-5 h-5 mr-2" /> 生成的纪念册
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="bg-white/10 rounded-xl p-4">
                  <h4 className="text-white font-medium mb-2">{generatedBook.title}</h4>
                  <p className="text-white/60 text-sm">生成日期: {generatedBook.date}</p>
                  <p className="text-white/60 text-sm mt-2">总页数: {generatedBook.pages.length}</p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {generatedBook.pages.slice(1, 5).map((page, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/5 rounded-xl p-3 border border-white/10 aspect-[3/4] flex flex-col items-center justify-center text-center"
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      {page.type === 'milestone' && (
                        <>
                          <Star className="w-8 h-8 text-yellow-300 mb-2" />
                          <p className="text-white text-xs line-clamp-2">{page.data.title}</p>
                        </>
                      )}
                      {page.type === 'photo' && (
                        <>
                          <Camera className="w-8 h-8 text-pink-300 mb-2" />
                          <p className="text-white text-xs line-clamp-2">照片 {index + 1}</p>
                        </>
                      )}
                      {page.type === 'diary' && (
                        <>
                          <Heart className="w-8 h-8 text-red-300 mb-2" />
                          <p className="text-white text-xs line-clamp-2">{page.data.title}</p>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3 justify-end">
                <button
                  onClick={shareMemoryBook}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-all duration-300"
                >
                  <Share2 className="w-4 h-4" />
                  <span>分享</span>
                </button>
                <button
                  onClick={downloadMemoryBook}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/30"
                >
                  <Download className="w-4 h-4" />
                  <span>下载</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!generatedBook && (
          <div className="text-center py-10">
            <motion.div
              className="text-6xl mb-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              📖
            </motion.div>
            <h3 className="text-lg font-medium text-white mb-2">点击生成按钮创建专属纪念册</h3>
            <p className="text-white/60 text-sm">系统将自动整理您的照片、日记和里程碑</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
