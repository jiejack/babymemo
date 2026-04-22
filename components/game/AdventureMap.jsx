import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AdventureMap = ({ areas, onAreaClick }) => {
  const [hoveredArea, setHoveredArea] = useState(null);

  // 只在客户端渲染
  if (typeof window === 'undefined') {
    return (
      <div className="relative w-full h-[500px] bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex items-center justify-center">
        <p className="text-white">加载中...</p>
      </div>
    );
  }

  // 模拟地图区域数据
  const defaultAreas = areas || [
    {
      id: 'memory-planet',
      name: '记忆星球',
      icon: '📸',
      unlocked: true,
      position: { x: 100, y: 150 },
      size: { width: 120, height: 120 }
    },
    {
      id: 'story-forest',
      name: '故事森林',
      icon: '📚',
      unlocked: true,
      position: { x: 250, y: 80 },
      size: { width: 100, height: 100 }
    },
    {
      id: 'growth-mountain',
      name: '成长山峰',
      icon: '🏔️',
      unlocked: true,
      position: { x: 400, y: 120 },
      size: { width: 110, height: 110 }
    },
    {
      id: 'happy-river',
      name: '欢乐河流',
      icon: '🎥',
      unlocked: true,
      position: { x: 150, y: 300 },
      size: { width: 130, height: 130 }
    },
    {
      id: 'treasure-island',
      name: '宝藏岛',
      icon: '💰',
      unlocked: false,
      position: { x: 350, y: 280 },
      size: { width: 90, height: 90 }
    },
    {
      id: 'magic-cave',
      name: '魔法洞穴',
      icon: '🔮',
      unlocked: false,
      position: { x: 500, y: 200 },
      size: { width: 100, height: 100 }
    }
  ];

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
      {/* 地图背景 */}
      <div className="absolute inset-0 bg-[url('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fantasy%20adventure%20map%20background%20with%20stars%20and%20magical%20elements%2C%20purple%20and%20blue%20color%20scheme&image_size=landscape_16_9')] bg-cover bg-center opacity-30"></div>
      
      {/* 地图网格 */}
      <div className="absolute inset-0 bg-grid-white/10"></div>
      
      {/* 地图标题 */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg flex items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🌍 冒险探索地图
        </motion.h2>
      </div>
      
      {/* 地图区域 */}
      {defaultAreas.map((area) => (
        <motion.div
          key={area.id}
          className={`absolute cursor-pointer transition-all duration-300 ${area.unlocked ? 'opacity-100' : 'opacity-50'}`}
          style={{
            left: `${area.position.x}px`,
            top: `${area.position.y}px`,
            width: `${area.size.width}px`,
            height: `${area.size.height}px`
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: area.unlocked ? 1 : 0.9,
            opacity: area.unlocked ? 1 : 0.5
          }}
          whileHover={{
            scale: 1.1,
            boxShadow: '0 0 25px rgba(255, 255, 255, 0.6)',
            zIndex: 20
          }}
          onClick={() => area.unlocked && onAreaClick(area.id)}
          onMouseEnter={() => setHoveredArea(area.id)}
          onMouseLeave={() => setHoveredArea(null)}
        >
          <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${area.unlocked ? 'from-white/20 to-white/5' : 'from-gray-700/30 to-gray-900/30'} backdrop-blur-md flex flex-col items-center justify-center border ${area.unlocked ? 'border-white/30' : 'border-gray-500/30'} shadow-xl transition-all duration-300`}>
            <motion.div
              className="text-3xl md:text-4xl mb-2"
              animate={{
                y: area.unlocked ? [0, -5, 0] : 0
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              {area.icon}
            </motion.div>
            <motion.div 
              className="text-white font-bold text-sm md:text-base text-center px-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {area.name}
            </motion.div>
            {!area.unlocked && (
              <motion.div
                className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-white text-xs font-bold bg-red-500/80 px-2 py-1 rounded-full">
                  未解锁
                </div>
              </motion.div>
            )}
          </div>
          
          {/* 悬浮提示 */}
          {hoveredArea === area.id && area.unlocked && (
            <motion.div
              className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white/90 text-purple-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-30"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              点击探索 {area.name}
            </motion.div>
          )}
        </motion.div>
      ))}
      
      {/* 地图装饰元素 */}
      <motion.div
        className="absolute top-20 right-20 text-2xl"
        animate={{
          rotate: [0, 10, -10, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      >
        ✨
      </motion.div>
      
      <motion.div
        className="absolute bottom-30 left-30 text-xl"
        animate={{
          y: [0, -10, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      >
        🌟
      </motion.div>
      
      <motion.div
        className="absolute top-1/2 right-40 text-xl"
        animate={{
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      >
        💫
      </motion.div>
    </div>
  );
};

export default AdventureMap;