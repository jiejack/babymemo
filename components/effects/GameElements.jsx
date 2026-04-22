import React from 'react';
import { motion } from 'framer-motion';

// 成就徽章组件
export const AchievementBadge = ({ title, icon, unlocked, progress }) => {
  return (
    <motion.div
      className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
        unlocked ? 'bg-gradient-to-br from-purple-600 to-pink-500' : 'bg-gray-300'
      }`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: unlocked ? 1.1 : 1,
        opacity: 1,
        rotate: unlocked ? [0, 10, -10, 0] : 0
      }}
      transition={{ 
        duration: 0.5,
        repeat: unlocked ? 2 : 0,
        repeatType: 'reverse'
      }}
    >
      <div className="text-white text-2xl">{icon}</div>
      {!unlocked && (
        <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">{progress}%</span>
        </div>
      )}
    </motion.div>
  );
};

// 奖励动画组件
export const RewardAnimation = ({ isActive, onComplete }) => {
  if (!isActive) return null;
  
  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        onAnimationComplete={onComplete}
      >
        <motion.div
          className="w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        >
          <div className="text-white text-4xl">🎁</div>
        </motion.div>
        <motion.div
          className="absolute -top-4 -right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          新奖励
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// 进度条组件
export const GameProgressBar = ({ progress, color = 'from-purple-500 to-pink-500' }) => {
  return (
    <div className="w-full bg-white/20 rounded-full h-2.5 mb-2">
      <motion.div
        className={`bg-gradient-to-r ${color} h-2.5 rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(progress, 100)}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  );
};

// 游戏化按钮组件
export const GameButton = ({ children, onClick, variant = 'primary', size = 'medium' }) => {
  const variants = {
    primary: 'from-purple-600 to-pink-500',
    secondary: 'from-blue-500 to-cyan-400',
    accent: 'from-yellow-400 to-orange-500'
  };
  
  const sizes = {
    small: 'py-2 px-4 text-sm',
    medium: 'py-3 px-6',
    large: 'py-4 px-8 text-lg'
  };
  
  return (
    <motion.button
      onClick={onClick}
      className={`bg-gradient-to-r ${variants[variant]} text-white font-bold ${sizes[size]} rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.button>
  );
};

// 浮动粒子效果组件
export const FloatingParticles = ({ count = 20, color = 'white' }) => {
  // 只在客户端渲染
  if (typeof window === 'undefined') {
    return null;
  }
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={`absolute w-2 h-2 rounded-full bg-${color}/30`}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: Math.random() * 0.5 + 0.3,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0.3, 0.8, 0.3],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
};

// 等级提升动画组件
export const LevelUpAnimation = ({ isActive, level, onComplete }) => {
  if (!isActive) return null;
  
  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        onAnimationComplete={onComplete}
      >
        <motion.div
          className="text-6xl md:text-8xl mb-4"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 1.5, repeat: 2 }}
        >
          🎉
        </motion.div>
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-white mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          等级提升！
        </motion.h2>
        <motion.p 
          className="text-xl md:text-2xl text-yellow-300 font-bold"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          现在是 Lv.{level}！
        </motion.p>
      </motion.div>
    </motion.div>
  );
};