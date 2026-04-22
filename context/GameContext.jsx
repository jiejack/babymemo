import React, { createContext, useContext, useState, useEffect } from 'react';

// 创建游戏上下文
const GameContext = createContext();

// 游戏状态管理提供者组件
export function GameProvider({ children }) {
  // 游戏状态
  const [gameState, setGameState] = useState({
    level: 1,
    experience: 0,
    stars: 0,
    achievements: [],
    completedTasks: 0,
    currentArea: null,
    unlockedAreas: ['memory-planet', 'story-forest', 'growth-mountain', 'happy-river'],
    dailyTasks: [],
    lastDailyReset: null
  });

  // 从本地存储加载游戏数据
  useEffect(() => {
    const loadGameData = () => {
      try {
        const savedData = localStorage.getItem('babyMemoGameData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setGameState(prevState => ({
            ...prevState,
            ...parsedData
          }));
        }
      } catch (error) {
        console.error('Error loading game data:', error);
      }
    };

    loadGameData();
  }, []);

  // 保存游戏数据到本地存储
  useEffect(() => {
    try {
      localStorage.setItem('babyMemoGameData', JSON.stringify(gameState));
    } catch (error) {
      console.error('Error saving game data:', error);
    }
  }, [gameState]);

  // 检查并重置每日任务
  useEffect(() => {
    const checkDailyTasks = () => {
      const today = new Date().toDateString();
      if (gameState.lastDailyReset !== today) {
        // 生成新的每日任务
        const newDailyTasks = generateDailyTasks();
        setGameState(prevState => ({
          ...prevState,
          dailyTasks: newDailyTasks,
          lastDailyReset: today
        }));
      }
    };

    checkDailyTasks();
  }, [gameState.lastDailyReset]);

  // 生成每日任务
  const generateDailyTasks = () => {
    const taskTemplates = [
      { title: '上传一张照片', icon: '📸', reward: { stars: 3, experience: 10 } },
      { title: '写一篇日记', icon: '📚', reward: { stars: 4, experience: 15 } },
      { title: '记录一个里程碑', icon: '⭐', reward: { stars: 5, experience: 20 } },
      { title: '上传一个视频', icon: '🎥', reward: { stars: 6, experience: 25 } },
      { title: '记录一次成长测量', icon: '📏', reward: { stars: 3, experience: 10 } }
    ];

    // 随机选择3个任务
    const shuffled = taskTemplates.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).map((task, index) => ({
      id: `daily-${Date.now()}-${index}`,
      ...task,
      completed: false
    }));
  };

  // 解锁新区域
  const unlockArea = (areaId) => {
    setGameState(prevState => {
      if (!prevState.unlockedAreas.includes(areaId)) {
        return {
          ...prevState,
          unlockedAreas: [...prevState.unlockedAreas, areaId]
        };
      }
      return prevState;
    });
  };

  // 完成任务
  const completeTask = (task) => {
    setGameState(prevState => {
      const newState = {
        ...prevState,
        stars: prevState.stars + (task.reward?.stars || 0),
        experience: prevState.experience + (task.reward?.experience || 0),
        completedTasks: prevState.completedTasks + 1
      };

      // 检查是否升级
      const newLevel = calculateLevel(newState.experience);
      if (newLevel > prevState.level) {
        newState.level = newLevel;
        // 这里可以触发升级动画
      }

      return newState;
    });
  };

  // 完成每日任务
  const completeDailyTask = (taskId) => {
    setGameState(prevState => {
      const updatedTasks = prevState.dailyTasks.map(task => {
        if (task.id === taskId) {
          // 完成任务并获得奖励
          setGameState(prev => ({
            ...prev,
            stars: prev.stars + (task.reward?.stars || 0),
            experience: prev.experience + (task.reward?.experience || 0)
          }));
          return { ...task, completed: true };
        }
        return task;
      });

      return {
        ...prevState,
        dailyTasks: updatedTasks
      };
    });
  };

  // 计算等级
  const calculateLevel = (experience) => {
    // 简单的等级计算公式
    return Math.floor(Math.sqrt(experience / 10)) + 1;
  };

  // 获得成就
  const unlockAchievement = (achievement) => {
    setGameState(prevState => {
      if (!prevState.achievements.find(a => a.id === achievement.id)) {
        return {
          ...prevState,
          achievements: [...prevState.achievements, achievement]
        };
      }
      return prevState;
    });
  };

  // 选择当前区域
  const setCurrentArea = (areaId) => {
    setGameState(prevState => ({
      ...prevState,
      currentArea: areaId
    }));
  };

  // 重置游戏数据
  const resetGameData = () => {
    const initialState = {
      level: 1,
      experience: 0,
      stars: 0,
      achievements: [],
      completedTasks: 0,
      currentArea: null,
      unlockedAreas: ['memory-planet', 'story-forest', 'growth-mountain', 'happy-river'],
      dailyTasks: generateDailyTasks(),
      lastDailyReset: new Date().toDateString()
    };
    setGameState(initialState);
    localStorage.removeItem('babyMemoGameData');
  };

  // 上下文值
  const contextValue = {
    gameState,
    unlockArea,
    completeTask,
    completeDailyTask,
    unlockAchievement,
    setCurrentArea,
    resetGameData
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}

// 自定义钩子，用于在组件中访问游戏上下文
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
