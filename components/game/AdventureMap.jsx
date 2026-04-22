import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { Camera, Book, Mountain, Video, Star, Trees, Rainbow, Sparkles } from 'lucide-react';

// 性能优化：创建记忆化的星星组件
const Stars = React.memo(() => {
  const stars = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      opacity: Math.random() * 0.6 + 0.2,
      duration: Math.random() * 2 + 1.5,
      delay: Math.random() * 2
    })),
  []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            opacity: star.opacity
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [star.opacity, star.opacity + 0.2, star.opacity]
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: star.delay,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
});

Stars.displayName = 'Stars';

// 性能优化：创建记忆化的魔法效果组件
const MagicEffects = React.memo(() => {
  return (
    <>
      {/* 主魔法效果 */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.5, 1],
          x: [0, 40, 0],
          y: [0, -40, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      />
      {/* 次要魔法效果 */}
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-pink-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          x: [0, -30, 0],
          y: [0, 30, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: 2
        }}
      />
      {/* 中心魔法效果 */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      />
    </>
  );
});

MagicEffects.displayName = 'MagicEffects';

// 单个地图区域组件 - 性能优化
const MapArea = React.memo(({ area, onMouseEnter, onMouseLeave, onClick }) => {
  // 使用useMotionValue避免重渲染
  const scale = useMotionValue(area.unlocked ? 1 : 0.9);
  const y = useMotionValue(0);
  
  // 计算动画值
  const boxShadow = useTransform(
    scale,
    [0.9, 1, 1.1],
    ['0 4px 12px rgba(0,0,0,0.2)', '0 8px 24px rgba(0,0,0,0.3)', '0 20px 40px rgba(255,255,255,0.3)']
  );

  return (
    <div
      className={`absolute cursor-pointer ${area.unlocked ? '' : 'cursor-not-allowed'}`}
      style={{
        left: area.position.x,
        top: area.position.y,
        width: area.size.width,
        aspectRatio: '1/1',
        zIndex: 10
      }}
      onMouseEnter={(e) => onMouseEnter(area.id, e)}
      onMouseLeave={onMouseLeave}
      onClick={() => {
        if (area.unlocked) {
          onClick(area);
        }
      }}
    >
      <motion.div
        className={`
          w-full h-full rounded-2xl
          backdrop-blur-xl
          flex flex-col items-center justify-center
          border-2
          transition-all duration-300
          relative overflow-hidden
          ${area.unlocked
            ? 'bg-gradient-to-br from-white/30 to-white/10 border-white/50 hover:border-white/80'
            : 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-600/40'
          }
        `}
        style={{ boxShadow, willChange: 'transform, opacity' }}
        initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
        animate={{ 
          scale: area.unlocked ? 1 : 0.9,
          opacity: area.unlocked ? 1 : 0.6,
          rotate: 0
        }}
        whileHover={area.unlocked ? {
          scale: 1.15,
          zIndex: 100
        } : {
          scale: 0.95
        }}
        whileTap={area.unlocked ? { scale: 0.98 } : { scale: 0.9 }}
        transition={{ 
          type: 'spring',
          stiffness: 300,
          damping: 20
        }}
      >
        {/* 背景光晕效果 */}
        {area.unlocked && (
          <>
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-pink-500/30 to-blue-500/30"
              animate={{ 
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut'
              }}
            />
            {/* 边框发光效果 */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-0 hover:opacity-100 transition-opacity duration-500"
              style={{ 
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                padding: '2px'
              }}
            />
          </>
        )}

        {/* 图标 */}
        <motion.div
          className="mb-3 relative z-10"
          animate={area.unlocked ? {
            y: [0, -6, 0],
            rotate: [0, 5, -5, 0]
          } : {}}
          transition={{ 
            duration: 4,
            repeat: area.unlocked ? Infinity : 0,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        >
          {area.icon}
        </motion.div>

        {/* 名称 */}
        <motion.div 
          className="relative z-10 text-center px-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3 className="text-white font-bold text-sm md:text-base mb-1">
            {area.name}
          </h3>
          {area.unlocked && (
            <motion.div 
              className="text-white/70 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              点击探索
            </motion.div>
          )}
        </motion.div>

        {/* 锁定状态覆盖层 */}
        {!area.unlocked && (
          <motion.div
            className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-white text-xs font-bold bg-red-500/90 px-4 py-1.5 rounded-full mb-3 backdrop-blur-sm shadow-lg">
              未解锁
            </div>
            <div className="text-white text-xs font-medium bg-blue-500/90 px-4 py-1.5 rounded-full backdrop-blur-sm shadow-lg">
              需要等级 {area.levelRequired}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
});

MapArea.displayName = 'MapArea';

// 悬停提示组件
const HoverTooltip = React.memo(({ area, position }) => {
  if (!area) return null;

  return (
    <motion.div
      className="fixed bg-gradient-to-br from-white/98 to-white/92 text-gray-800 text-sm px-5 py-4 rounded-2xl shadow-2xl z-50 pointer-events-none backdrop-blur-xl border border-white/50"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -120%)'
      }}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <div className="font-bold text-lg text-purple-700 mb-2 flex items-center gap-2 justify-center">
        <span>{area.icon}</span>
        {area.name}
      </div>
      <p className="text-gray-600 text-center mb-3 text-sm">{area.description}</p>
      <div className="text-purple-600 bg-purple-100/70 px-3 py-1.5 rounded-full text-center text-sm font-medium">
        点击探索 →
      </div>
      <motion.div
        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-gradient-to-br from-white/98 to-white/92 rotate-45"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
    </motion.div>
  );
});

HoverTooltip.displayName = 'HoverTooltip';

const AdventureMap = ({ areas, onAreaClick }) => {
  const [hoveredAreaId, setHoveredAreaId] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const { gameState, setCurrentArea } = useGame();
  const containerRef = useRef(null);

  // 响应式大小调整
  const [mapSize, setMapSize] = useState('6%');
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const viewportSize = Math.min(width, height);
      
      // 根据视口大小动态计算地图区域大小
      // 使用百分比确保在不同屏幕尺寸下都能按比例缩放
      if (viewportSize > 1600) {
        setMapSize('6%');
      } else if (viewportSize > 1200) {
        setMapSize('7%');
      } else if (viewportSize > 992) {
        setMapSize('8%');
      } else if (viewportSize > 768) {
        setMapSize('9%');
      } else {
        setMapSize('12%');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 地图区域数据 - 响应式布局
  const defaultAreas = useMemo(() => {
    const baseAreas = areas || [
      {
        id: 'memory-planet',
        name: '记忆星球',
        icon: <Camera className="w-10 h-10 text-yellow-300" />,
        description: '探索宝贝的珍贵回忆',
        unlocked: gameState.unlockedAreas.includes('memory-planet'),
        position: { x: '12%', y: '25%' },
        levelRequired: 1
      },
      {
        id: 'story-forest',
        name: '故事森林',
        icon: <Book className="w-10 h-10 text-green-300" />,
        description: '阅读宝贝的成长故事',
        unlocked: gameState.unlockedAreas.includes('story-forest'),
        position: { x: '32%', y: '20%' },
        levelRequired: 1
      },
      {
        id: 'growth-mountain',
        name: '成长山峰',
        icon: <Mountain className="w-10 h-10 text-blue-300" />,
        description: '攀登成长的高峰',
        unlocked: gameState.unlockedAreas.includes('growth-mountain'),
        position: { x: '52%', y: '20%' },
        levelRequired: 1
      },
      {
        id: 'happy-river',
        name: '欢乐河流',
        icon: <Video className="w-10 h-10 text-purple-300" />,
        description: '流淌的欢乐时光',
        unlocked: gameState.unlockedAreas.includes('happy-river'),
        position: { x: '72%', y: '25%' },
        levelRequired: 1
      },
      {
        id: 'star-garden',
        name: '星星花园',
        icon: <Star className="w-10 h-10 text-yellow-400" />,
        description: '收集闪亮的星星',
        unlocked: gameState.unlockedAreas.includes('star-garden'),
        position: { x: '20%', y: '55%' },
        levelRequired: 2
      },
      {
        id: 'treasure-island',
        name: '宝藏岛',
        icon: <Trees className="w-10 h-10 text-yellow-500" />,
        description: '寻找隐藏的宝藏',
        unlocked: gameState.unlockedAreas.includes('treasure-island'),
        position: { x: '42%', y: '50%' },
        levelRequired: 3
      },
      {
        id: 'rainbow-bridge',
        name: '彩虹桥',
        icon: <Rainbow className="w-10 h-10 text-pink-400" />,
        description: '跨越彩虹的桥梁',
        unlocked: gameState.unlockedAreas.includes('rainbow-bridge'),
        position: { x: '64%', y: '55%' },
        levelRequired: 4
      },
      {
        id: 'magic-cave',
        name: '魔法洞穴',
        icon: <Sparkles className="w-10 h-10 text-purple-400" />,
        description: '探索魔法的奥秘',
        unlocked: gameState.unlockedAreas.includes('magic-cave'),
        position: { x: '42%', y: '78%' },
        levelRequired: 5
      }
    ];

    return baseAreas.map(area => ({
      ...area,
      size: { width: mapSize }
    }));
  }, [gameState.unlockedAreas, mapSize, areas]);

  // 优化事件处理函数
  const handleAreaClick = useCallback((area) => {
    console.log('Area clicked:', area.id);
    if (area.unlocked) {
      setCurrentArea(area.id);
      if (onAreaClick) {
        onAreaClick(area.id);
      }
    }
  }, [setCurrentArea, onAreaClick]);

  const handleMouseEnter = useCallback((areaId, event) => {
    setHoveredAreaId(areaId);
    if (event?.clientX && event?.clientY) {
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredAreaId(null);
  }, []);

  const handleMouseMove = useCallback((event) => {
    if (hoveredAreaId) {
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  }, [hoveredAreaId]);



  // 只在客户端渲染
  if (typeof window === 'undefined') {
    return (
      <div className="relative w-full h-[500px] bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-80 rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex items-center justify-center">
        <p className="text-white text-lg">加载中...</p>
      </div>
    );
  }

  const hoveredArea = defaultAreas.find(area => area.id === hoveredAreaId && area.unlocked);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] md:h-[550px] bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-80 rounded-3xl overflow-hidden border border-white/30 shadow-2xl"
      onMouseMove={handleMouseMove}
    >
      {/* 地图背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-80 opacity-90" />
      
      {/* 背景纹理 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:30px_30px] opacity-20" />
      
      {/* 星星背景 */}
      <Stars />
      
      {/* 魔法效果 */}
      <MagicEffects />
      
      {/* 地图网格 */}
      <div className="absolute inset-0 bg-grid-white/10 opacity-30" />
      
      {/* 地图标题 */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
        <motion.h2
          className="text-2xl md:text-4xl font-bold text-white drop-shadow-2xl flex items-center gap-3"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <span className="text-3xl md:text-5xl">🌍</span>
          冒险探索地图
        </motion.h2>
        <motion.p
          className="text-white/70 text-sm text-center mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          探索宝贝成长的奇妙世界
        </motion.p>
      </div>
      

      
      {/* 地图区域 */}
      {defaultAreas.map((area) => (
        <MapArea
          key={area.id}
          area={area}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleAreaClick}
        />
      ))}
      
      {/* 装饰元素 - 简约美观 */}
      <motion.div
        className="absolute top-16 right-12 text-3xl opacity-60"
        animate={{
          rotate: [0, 15, -15, 0],
          scale: [1, 1.25, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      >
        ✨
      </motion.div>
      
      <motion.div
        className="absolute bottom-24 left-16 text-2xl opacity-50"
        animate={{
          y: [0, -12, 0],
          rotate: [0, 20, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut'
        }}
      >
        🌟
      </motion.div>
      
      {/* 悬停提示 */}
      <AnimatePresence>
        {hoveredArea && (
          <HoverTooltip area={hoveredArea} position={tooltipPosition} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(AdventureMap);
