import React from 'react';
import { motion } from 'framer-motion';

const icons = [
  '🌟',
  '🌈',
  '🦋',
  '✨',
  '💫',
  '🌸',
  '🌙',
  '⭐',
  '🎨',
  '🎈',
  '🎁',
  '🎯',
  '🎭',
  '🎪',
  '🎡',
  '🎢',
  '🎠',
  '🎏',
  '🎀',
  '💝',
];

export function FloatingIcons({ count = 15, className = '' }) {
  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
      {Array.from({ length: count }).map((_, index) => {
        const icon = icons[index % icons.length];
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        const randomDelay = Math.random() * 4;
        const randomDuration = 3 + Math.random() * 4;
        const randomSize = 1.5 + Math.random() * 2;

        return (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: `${randomX}%`,
              top: `${randomY}%`,
              fontSize: `${randomSize}rem`,
              opacity: 0.25 + Math.random() * 0.35,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              y: [0, -30, 0, -15, 0],
              x: [0, 15, 0, -10, 0],
              rotate: [0, 15, 0, -10, 0],
              opacity: [0.25 + Math.random() * 0.15, 0.45 + Math.random() * 0.15, 0.25 + Math.random() * 0.15],
              scale: [1, 1.15, 1, 1.08, 1],
            }}
            transition={{
              duration: randomDuration,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: randomDelay,
              ease: 'easeInOut',
            }}
          >
            {icon}
          </motion.div>
        );
      })}
    </div>
  );
}
