import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GameProgressBar, GameButton, RewardAnimation } from '../effects/GameElements';
import { useGame } from '../../context/GameContext';

const TaskSystem = ({ tasks, onTaskComplete }) => {
  const [showReward, setShowReward] = useState(false);
  const [completedTask, setCompletedTask] = useState(null);
  const { gameState, completeTask, completeDailyTask } = useGame();

  // 模拟任务数据
  const defaultTasks = useMemo(() => tasks || [
    {
      id: 1,
      title: '上传第一张照片',
      description: '记录宝贝的第一个精彩瞬间',
      icon: '📸',
      status: 'completed',
      progress: 100,
      reward: { stars: 5, experience: 20, badge: '摄影新手' }
    },
    {
      id: 2,
      title: '写下第一个故事',
      description: '记录宝贝的成长故事',
      icon: '📚',
      status: 'in_progress',
      progress: 50,
      reward: { stars: 8, experience: 30, badge: '故事讲述者' }
    },
    {
      id: 3,
      title: '记录第一个里程碑',
      description: '标记宝贝的重要成长时刻',
      icon: '⭐',
      status: 'pending',
      progress: 0,
      reward: { stars: 10, experience: 40, badge: '里程碑达人' }
    },
    {
      id: 4,
      title: '上传第一个视频',
      description: '捕捉宝贝的欢乐时光',
      icon: '🎥',
      status: 'pending',
      progress: 0,
      reward: { stars: 12, experience: 50, badge: '视频大师' }
    },
    {
      id: 5,
      title: '记录第一次成长测量',
      description: '记录宝贝的身高体重',
      icon: '📏',
      status: 'pending',
      progress: 0,
      reward: { stars: 6, experience: 25, badge: '成长记录员' }
    }
  ], [tasks]);

  const handleTaskComplete = (taskId) => {
    const task = defaultTasks.find(t => t.id === taskId);
    setCompletedTask(task);
    setShowReward(true);
    
    // 完成任务并获得奖励
    completeTask(task);
    
    if (onTaskComplete) {
      onTaskComplete(taskId);
    }
  };

  const handleDailyTaskComplete = (taskId) => {
    const task = gameState.dailyTasks.find(t => t.id === taskId);
    if (task) {
      setCompletedTask(task);
      setShowReward(true);
      completeDailyTask(taskId);
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
      
      {/* 每日任务 */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            📅 每日任务
          </h3>
          <div className="bg-yellow-500/20 text-yellow-200 text-xs font-bold px-3 py-1 rounded-full">
            {gameState.dailyTasks.filter(t => t.completed).length}/{gameState.dailyTasks.length} 完成
          </div>
        </div>
        
        <div className="space-y-3">
          {gameState.dailyTasks.map((task, index) => (
            <motion.div
              key={task.id}
              className={`rounded-xl p-4 border transition-all duration-300 ${task.completed ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50' : 'bg-gradient-to-br from-gray-500/20 to-slate-500/20 border-gray-500/50'}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <motion.div
                      className="text-2xl"
                      animate={{ scale: task.completed ? [1, 1.2, 1] : 1 }}
                      transition={{ duration: 1, repeat: task.completed ? 2 : 0 }}
                    >
                      {task.icon}
                    </motion.div>
                    <div>
                      <h4 className="text-white font-medium mb-1">{task.title}</h4>
                      <div className="flex items-center space-x-2">
                        <div className="text-yellow-300 font-bold text-sm flex items-center">
                          {task.reward.stars} ⭐
                        </div>
                        <div className="text-blue-300 font-bold text-sm flex items-center">
                          {task.reward.experience} EXP
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {!task.completed ? (
                  <GameButton
                    onClick={() => handleDailyTaskComplete(task.id)}
                    variant="accent"
                    size="small"
                  >
                    完成
                  </GameButton>
                ) : (
                  <motion.div
                    className="text-green-400 font-bold text-sm flex items-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    ✅ 已完成
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 奖励动画 */}
      <RewardAnimation 
        isActive={showReward} 
        onComplete={handleRewardComplete}
      />
    </div>
  );
};

export default TaskSystem;