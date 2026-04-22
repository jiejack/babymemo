import React from 'react';
import { motion } from 'framer-motion';

export function BouncingIcon({ icon, delay = 0, duration = 2, className = '' }) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -12, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: 'reverse',
        delay: delay,
        ease: 'easeInOut',
      }}
    >
      {icon}
    </motion.div>
  );
}

export function PulsingIcon({ icon, delay = 0, duration = 2, className = '' }) {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1.15, 1],
        rotate: [0, 3, 0, -3, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: 'reverse',
        delay: delay,
        ease: 'easeInOut',
      }}
    >
      {icon}
    </motion.div>
  );
}

export function FloatingIcon({ icon, delay = 0, duration = 4, className = '' }) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -8, 0, 8, 0],
        x: [0, 4, 0, -4, 0],
        rotate: [0, 5, 0, -5, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: 'loop',
        delay: delay,
        ease: 'easeInOut',
      }}
    >
      {icon}
    </motion.div>
  );
}

export function RotatingIcon({ icon, delay = 0, duration = 3, className = '' }) {
  return (
    <motion.div
      className={className}
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: 'linear',
        delay: delay,
      }}
    >
      {icon}
    </motion.div>
  );
}

export function GlowingIcon({ icon, delay = 0, duration = 2, className = '' }) {
  return (
    <motion.div
      className={className}
      animate={{
        textShadow: [
          '0 0 5px rgba(255, 255, 255, 0.3)',
          '0 0 15px rgba(255, 105, 180, 0.6)',
          '0 0 25px rgba(255, 105, 180, 0.3)',
        ],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: 'reverse',
        delay: delay,
      }}
    >
      {icon}
    </motion.div>
  );
}

export function WavingIcon({ icon, delay = 0, duration = 1.5, className = '' }) {
  return (
    <motion.div
      className={className}
      animate={{
        rotate: [0, 10, 0, -10, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: 'reverse',
        delay: delay,
        ease: 'easeInOut',
      }}
    >
      {icon}
    </motion.div>
  );
}
