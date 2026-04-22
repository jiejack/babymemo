import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

export function Stars({ count = 100, className = '' }) {
  const stars = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      opacity: 0.25 + Math.random() * 0.4,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
    }));
  }, [count]);

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
          animate={{
            opacity: [star.opacity * 0.6, star.opacity * 1.3, star.opacity * 0.6],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: star.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function ShootingStar() {
  return (
    <motion.div
      className="fixed pointer-events-none z-10"
      initial={{ left: '-10%', top: '15%', opacity: 0, rotate: 45 }}
      animate={{
        left: ['-10%', '110%', '-10%'],
        top: ['15%', '75%', '15%'],
        opacity: [0, 1, 0],
        scale: [1, 0.8, 1],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div className="relative">
        <div className="w-16 h-1 bg-gradient-to-r from-transparent via-white to-white rounded-full" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 bg-white rounded-full" />
      </div>
    </motion.div>
  );
}
