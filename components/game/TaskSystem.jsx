import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GameProgressBar, GameButton, RewardAnimation } from '../effects/GameElements';

const TaskSystem = ({ tasks, onTaskComplete }) => {
  const [showReward, setShowReward] = useState(false);
  const [completedTask, setCompletedTask] = useState(null);

  // 模拟任务数据
  const defaultTasks = tasks || [
    {
      id: 1,
      title: '上传第一张照片',
      description: '记录宝贝的第一个精彩瞬间',
      icon: '📸',
      status: 'completed',
      progress: 100,
      reward: { stars: 5, badge: '摄影新手' }
    },
    {
      id: 2,
      title: '写下第一个故事',
      description: '记录宝贝的成长故事',
      icon: '📚',
      status: 'in_progress',
      progress: 50,
      reward: { stars: 8, badge: '故事讲述者' }
    },
    {
      id: 3,
      title: '记录第一个里程碑',
      description: '标记宝贝的重要成长时刻',
      icon: '⭐',
      status: 'pending',
      progress: 0,
      reward: { stars: 10, badge: '里程碑达人' }
    },
    {
      id: 4,
      title: '上传第一个视频',
      description: '捕捉宝贝的欢乐时光',
      icon: '🎥',
      status: 'pending',
      progress: 0,
      reward: { stars: 12, badge: '视频大师' }
    }
  ];

  const handleTaskComplete = (taskId) => {
    const task = defaultTasks.find(t => t.id === taskId);
    setCompletedTask(task);
    setShowReward(true);
    
    if (onTaskComplete) {
      onTaskComplete(taskId);
    }
  };

  const handleRewardComplete = () => {
    setShowReward(false);
    setCompletedTask(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <motion.h2 
          className="text-2xl font-bold text-white flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          🎯 成长任务
        </motion.h2>
        <motion.div
          className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="text-white text-sm font-medium">
            完成任务获得星星奖励
          </span>
        </motion.div>
      </div>
      
      <div className="space-y-4">
        {defaultTasks.map((task, index) => (
          <motion.div
            key={task.id}
            className={`rounded-2xl p-5 border transition-all duration-300 ${
              task.status === 'completed' 
                ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50'
                : task.status === 'in_progress'
                ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/50'
                : 'bg-gradient-to-br from-gray-500/20 to-slate-500/20 border-gray-500/50'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <motion.div
                    className="text-3xl"
                    animate={{
                      scale: task.status === 'completed' ? [1, 1.2, 1] : 1
                    }}
                    transition={{
                      duration: 1,
                      repeat: task.status === 'completed' ? 2 : 0
                    }}
                  >
                    {task.icon}
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{task.title}</h3>
                    <p className="text-white/70 text-sm">{task.description}</p>
                  </div>
                </div>
                
                <GameProgressBar 
                  progress={task.progress} 
                  color={
                    task.status === 'completed' ? 'from-green-400 to-emerald-500' :
                    task.status === 'in_progress' ? 'from-blue-400 to-cyan-500' :
                    'from-gray-400 to-slate-500'
                  }
                />
                <p className="text-white/60 text-xs mb-3">{task.progress}% 完成</p>
                
                {task.status === 'completed' && (
                  <motion.div
                    className="flex items-center space-x-2 mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="text-yellow-300 font-bold flex items-center">
                      {task.reward.stars} ⭐
                    </div>
                    <div className="bg-yellow-400/25 text-yellow-200 text-xs px-2.5 py-1 rounded-full">
                      {task.reward.badge}
                    </div>
                  </motion.div>
                )}
              </div>
              
              <div className="flex flex-col items-center">
                <motion.div
                  className="text-2xl mb-2"
                  animate={{
                    y: [0, -3, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                >
                  {task.icon}
                </motion.div>
                <div className="text-yellow-300 font-bold text-sm">
                  {task.reward.stars} ⭐
                </div>
              </div>
            </div>
            
            {task.status === 'completed' && (
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GameButton 
                  onClick={() => handleTaskComplete(task.id)}
                  variant="primary"
                  size="medium"
                >
                  领取奖励
                </GameButton>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* 奖励动画 */}
      <RewardAnimation 
        isActive={showReward} 
        onComplete={handleRewardComplete}
      />
    </div>
  );
};

export default TaskSystem;