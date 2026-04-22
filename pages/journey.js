import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useRouter } from 'next/router';
import { AppContext } from './_app';
import { useGame } from '../context/GameContext';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Camera,
  Book,
  Star,
  Video,
  BarChart3,
  ChevronLeft,
  Baby,
  Sparkles,
  Heart,
  Calendar,
  Ruler,
  Weight,
  Activity,
  Trophy,
  Award,
  Sun,
  Moon,
  Clock
} from 'lucide-react';
import AdventureMap from '../components/game/AdventureMap';
import TaskSystem from '../components/game/TaskSystem';
import MemoryBook from '../components/game/MemoryBook';
import GrowthPredictor from '../components/game/GrowthPredictor';
import { FloatingParticles, AchievementBadge, LevelUpAnimation, StarCollectionAnimation, GameNotification, GameProgressRing } from '../components/effects/GameElements';

export default function Journey() {
  const { user } = useContext(AppContext);
  const { gameState, unlockArea, unlockAchievement } = useGame();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({
    photos: [],
    diaries: [],
    milestones: [],
    videos: [],
    growth: [],
  });
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showStarCollection, setShowStarCollection] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('info');
  const [starCount, setStarCount] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else {
      fetchAllData();
    }
  }, [user, router]);

  // 显示游戏通知
  const showGameNotification = (message, type = 'info') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
  };

  // 显示星星收集动画
  const showStars = (count) => {
    setStarCount(count);
    setShowStarCollection(true);
  };

  // 显示等级提升动画
  const showLevelUpAnimation = () => {
    setShowLevelUp(true);
  };

  // 处理区域点击
  const handleAreaClick = (areaId) => {
    showGameNotification(`探索 ${areaId.replace('-', ' ')}`, 'info');
    
    // 模拟解锁新区域
    if (gameState.level >= 2 && !gameState.unlockedAreas.includes('star-garden')) {
      unlockArea('star-garden');
      showGameNotification('解锁了新区域：星星花园！', 'success');
    }
    
    if (gameState.level >= 3 && !gameState.unlockedAreas.includes('treasure-island')) {
      unlockArea('treasure-island');
      showGameNotification('解锁了新区域：宝藏岛！', 'success');
    }
    
    if (gameState.level >= 4 && !gameState.unlockedAreas.includes('rainbow-bridge')) {
      unlockArea('rainbow-bridge');
      showGameNotification('解锁了新区域：彩虹桥！', 'success');
    }
    
    if (gameState.level >= 5 && !gameState.unlockedAreas.includes('magic-cave')) {
      unlockArea('magic-cave');
      showGameNotification('解锁了新区域：魔法洞穴！', 'success');
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      let babiesRes;
      try {
        babiesRes = await api.baby.getAll();
      } catch (err) {
        babiesRes = { data: [] };
      }
      
      const babies = babiesRes?.data || [];
      const activeBabyId = babies.length > 0 ? babies[0].id : null;

      const [photosRes, diariesRes, milestonesRes, videosRes] = await Promise.all([
        api.photo.getAll({ limit: 20 }).catch(() => ({ data: [] })),
        api.diary.getAll().catch(() => ({ data: [] })),
        api.milestone.getAll().catch(() => ({ data: [] })),
        api.video.getAll().catch(() => ({ data: [] })),
      ]);

      let growthData = [];
      if (activeBabyId) {
        try {
          const growthRes = await api.growth.getAll({ baby_id: activeBabyId });
          growthData = growthRes?.data || [];
        } catch (err) {
          console.error('获取成长数据失败:', err);
        }
      }

      setData({
        photos: photosRes?.data || [],
        diaries: diariesRes?.data || [],
        milestones: milestonesRes?.data || [],
        videos: videosRes?.data || [],
        growth: growthData,
      });
    } catch (err) {
      console.error('Fetch data error:', err);
      setError(err?.message || '数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  const tabItems = useMemo(() => [
    { id: 'overview', icon: <Home className="w-5 h-5 md:w-6 h-6" />, label: '冒险地图' },
    { id: 'photos', icon: <Camera className="w-5 h-5 md:w-6 h-6" />, label: '记忆星球' },
    { id: 'diaries', icon: <Book className="w-5 h-5 md:w-6 h-6" />, label: '故事森林' },
    { id: 'milestones', icon: <Star className="w-5 h-5 md:w-6 h-6" />, label: '成长山峰' },
    { id: 'videos', icon: <Video className="w-5 h-5 md:w-6 h-6" />, label: '欢乐河流' },
    { id: 'growth', icon: <BarChart3 className="w-5 h-5 md:w-6 h-6" />, label: '测量站' },
  ], []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-20 h-20 mx-auto mb-6 relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
            <div className="absolute inset-2 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="absolute inset-4 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </motion.div>
          <p className="text-white text-xl font-medium">正在准备冒险...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 max-w-md">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-white mb-4">哎呀，出问题了</h2>
          <p className="text-white/80 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchAllData();
            }}
            className="bg-white text-purple-900 font-bold py-3 px-6 rounded-full hover:bg-pink-500 hover:text-white transition-all duration-300"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden relative">
      <TopNav user={user} onGoBack={() => router.push('/dashboard')} gameState={gameState} />
      <motion.main 
        className="container mx-auto px-4 py-8 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="text-center mb-10">
          <motion.div
            className="inline-block relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'backOut' }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg flex items-center">
              <Baby className="w-10 h-10 md:w-12 h-12 mr-3" /> 宝宝成长大冒险
            </h1>
            <p className="text-white/80 text-lg">
              欢迎来到{user?.name || '宝贝'}的魔法世界！
            </p>
          </motion.div>
        </div>
        <TabNavigation tabs={tabItems} activeTab={activeTab} onTabChange={setActiveTab} />
        <ContentArea 
          activeTab={activeTab} 
          data={data} 
          user={user} 
          gameState={gameState}
          onAreaClick={handleAreaClick}
          showStars={showStars}
          showGameNotification={showGameNotification}
        />
      </motion.main>
      
      {/* 游戏动画 */}
      <AnimatePresence>
        {showLevelUp && (
          <LevelUpAnimation 
            level={gameState.level} 
            onClose={() => setShowLevelUp(false)} 
          />
        )}
        {showStarCollection && (
          <StarCollectionAnimation 
            count={starCount} 
            onComplete={() => setShowStarCollection(false)} 
          />
        )}
        {showNotification && (
          <GameNotification 
            message={notificationMessage} 
            type={notificationType} 
            onClose={() => setShowNotification(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TopNav({ user, onGoBack, gameState }) {
  // 计算下一级所需经验
  const calculateNextLevelExp = (level) => {
    return Math.pow(level, 2) * 10;
  };
  
  const nextLevelExp = calculateNextLevelExp(gameState.level);
  const currentExp = gameState.experience;
  const expProgress = Math.min((currentExp / nextLevelExp) * 100, 100);
  
  return (
    <nav className="relative z-20 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onGoBack}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-full hover:bg-white/20"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden md:inline">返回管理</span>
          </button>
          <div className="flex items-center space-x-6">
            {/* 等级信息 */}
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Lv.{gameState.level}</p>
                <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${expProgress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-white/60 text-xs">{currentExp}/{nextLevelExp} EXP</p>
              </div>
            </div>
            
            {/* 星星数量 */}
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-bold">{gameState.stars}</span>
            </div>
            
            {/* 用户信息 */}
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg">
                <Baby className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">{user?.name || '宝贝'}</p>
                <p className="text-white/60 text-xs">超级探险家</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex justify-center mb-10 overflow-x-auto pb-2">
      <div className="inline-flex bg-white/10 backdrop-blur-md rounded-3xl p-1.5 md:p-2 shadow-2xl border border-white/20 space-x-1 md:space-x-1.5">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-3 sm:px-4 md:px-6 py-2.5 md:py-3 rounded-2xl transition-all duration-300 whitespace-nowrap font-medium ${
                isActive
                  ? 'bg-white text-purple-900 shadow-xl shadow-purple-500/30'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              initial={{ opacity: 0, y: -15, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: index * 0.06,
                duration: 0.4,
                type: 'spring',
                stiffness: 350,
                damping: 25,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-2">
                <div className="inline-flex items-center justify-center">
                  {tab.icon}
                </div>
                <span className="hidden sm:inline">{tab.label}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function ContentArea({ activeTab, data, user, gameState, onAreaClick, showStars, showGameNotification }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.96 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="relative">
          {activeTab === 'overview' && (
            <OverviewTab 
              data={data} 
              user={user} 
              gameState={gameState}
              onAreaClick={onAreaClick}
              showStars={showStars}
              showGameNotification={showGameNotification}
            />
          )}
          {activeTab === 'photos' && <PhotosTab photos={data.photos} />}
          {activeTab === 'diaries' && <DiariesTab diaries={data.diaries} />}
          {activeTab === 'milestones' && <MilestonesTab milestones={data.milestones} />}
          {activeTab === 'videos' && <VideosTab videos={data.videos} />}
          {activeTab === 'growth' && <GrowthTab growth={data.growth} />}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function OverviewTab({ data, user, gameState, onAreaClick, showStars, showGameNotification }) {
  const [selectedArea, setSelectedArea] = useState(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // 处理区域点击
  const handleAreaClick = (areaId) => {
    setSelectedArea(areaId);
    onAreaClick(areaId);
  };

  // 成就数据
  const achievements = [
    { id: 1, title: '摄影新手', icon: '📸', unlocked: gameState.achievements.some(a => a.id === 1) || data.photos.length > 0, progress: Math.min((data.photos.length / 5) * 100, 100) },
    { id: 2, title: '故事讲述者', icon: '📚', unlocked: gameState.achievements.some(a => a.id === 2) || data.diaries.length > 0, progress: Math.min((data.diaries.length / 3) * 100, 100) },
    { id: 3, title: '里程碑达人', icon: '⭐', unlocked: gameState.achievements.some(a => a.id === 3) || data.milestones.length > 0, progress: Math.min((data.milestones.length / 2) * 100, 100) },
    { id: 4, title: '视频大师', icon: '🎥', unlocked: gameState.achievements.some(a => a.id === 4) || data.videos.length > 0, progress: Math.min((data.videos.length / 2) * 100, 100) },
    { id: 5, title: '成长记录员', icon: '📏', unlocked: gameState.achievements.some(a => a.id === 5) || data.growth.length > 0, progress: Math.min((data.growth.length / 3) * 100, 100) },
    { id: 6, title: '冒险王', icon: '🏆', unlocked: gameState.achievements.some(a => a.id === 6) || gameState.level >= 5, progress: Math.min((gameState.level / 5) * 100, 100) },
  ];

  // 模拟排行榜数据
  const leaderboardData = [
    { rank: 1, name: '小明妈妈', level: 12, stars: 156 },
    { rank: 2, name: '小红爸爸', level: 10, stars: 128 },
    { rank: 3, name: '小宝妈妈', level: 8, stars: 95 },
    { rank: 4, name: '小贝爸爸', level: 7, stars: 87 },
    { rank: 5, name: user?.name || '你', level: gameState.level, stars: gameState.stars },
  ];

  return (
    <div className="space-y-8 relative">
      {/* 浮动粒子效果 */}
      <FloatingParticles count={30} color="white" />

      {/* 互动探索地图 */}
      <motion.div
        className="bg-white/12 backdrop-blur-md rounded-3xl p-4 md:p-6 border border-white/25 shadow-2xl"
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, type: 'spring' }}
      >
        <AdventureMap onAreaClick={handleAreaClick} />
      </motion.div>

      {/* 成长任务系统 */}
      <motion.div
        className="bg-white/12 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/25 shadow-2xl"
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.65, type: 'spring' }}
      >
        <TaskSystem />
      </motion.div>

      {/* 成就系统 */}
      <motion.div
        className="bg-white/12 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/25 shadow-2xl"
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.65, type: 'spring' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            🏆 成就系统
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowAchievements(!showAchievements)}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all duration-300"
            >
              {showAchievements ? '收起' : '查看成就'}
            </button>
            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all duration-300"
            >
              {showLeaderboard ? '收起' : '排行榜'}
            </button>
          </div>
        </div>
        
        {showAchievements && (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <AchievementBadge 
                  title={achievement.title}
                  icon={achievement.icon}
                  unlocked={achievement.unlocked}
                  progress={achievement.progress}
                />
                <p className="text-white text-xs mt-2 text-center">{achievement.title}</p>
                <p className="text-white/60 text-xs">{achievement.progress}%</p>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {showLeaderboard && (
          <motion.div
            className="bg-white/8 rounded-2xl p-4 md:p-6 border border-white/15"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2" /> 冒险家排行榜
            </h3>
            <div className="space-y-3">
              {leaderboardData.map((item, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-xl ${item.name === (user?.name || '你') ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' : 'bg-white/5 border border-white/10'}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index < 3 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' : 'bg-white/20 text-white'}`}>
                      {item.rank}
                    </div>
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-white/60 text-xs">Lv.{item.level}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-300" />
                    <span className="text-white font-bold">{item.stars}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* 统计信息 */}
      <motion.div
        className="grid grid-cols-2 gap-4 md:gap-6"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <motion.div
          className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-md rounded-3xl p-4 md:p-6 border border-white/25 shadow-2xl"
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-white mb-1">{data.photos.length}</p>
              <p className="text-white/75 text-sm">珍贵回忆</p>
            </div>
            <div className="text-3xl">📸</div>
          </div>
        </motion.div>
        <motion.div
          className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-md rounded-3xl p-4 md:p-6 border border-white/25 shadow-2xl"
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-white mb-1">{data.diaries.length}</p>
              <p className="text-white/75 text-sm">成长故事</p>
            </div>
            <div className="text-3xl">📚</div>
          </div>
        </motion.div>
        <motion.div
          className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-3xl p-4 md:p-6 border border-white/25 shadow-2xl"
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-white mb-1">{data.milestones.length}</p>
              <p className="text-white/75 text-sm">重要里程碑</p>
            </div>
            <div className="text-3xl">⭐</div>
          </div>
        </motion.div>
        <motion.div
          className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-md rounded-3xl p-4 md:p-6 border border-white/25 shadow-2xl"
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-white mb-1">{data.videos.length}</p>
              <p className="text-white/75 text-sm">欢乐视频</p>
            </div>
            <div className="text-3xl">🎥</div>
          </div>
        </motion.div>
      </motion.div>

      {/* 成长纪念册 */}
      <motion.div
        className="bg-white/12 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/25 shadow-2xl"
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.65, type: 'spring' }}
      >
        <MemoryBook 
          photos={data.photos} 
          diaries={data.diaries} 
          milestones={data.milestones} 
        />
      </motion.div>

      {/* 成长预测 */}
      <motion.div
        className="bg-white/12 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/25 shadow-2xl"
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.65, type: 'spring' }}
      >
        <GrowthPredictor growth={data.growth} />
      </motion.div>
    </div>
  );
}

function PhotosTab({ photos }) {
  return (
    <div className="bg-white/12 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/25 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white flex items-center">
          <Camera className="w-6 h-6 mr-3" />
          记忆星球
        </h2>
      </div>
      
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              className="aspect-square rounded-2xl overflow-hidden shadow-xl relative group cursor-pointer"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.06, duration: 0.45 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={photo.url || 'https://via.placeholder.com/300'}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-800 group-hover:scale-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3">
                <p className="text-white font-medium text-sm truncate">{photo.title || '未命名'}</p>
                <p className="text-white/65 text-xs">{photo.date ? new Date(photo.date).toLocaleDateString() : ''}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState icon={<Camera className="w-20 h-20" />} title="还没有照片哦" subtitle="快去上传第一张照片吧！" />
      )}
    </div>
  );
}

function DiariesTab({ diaries }) {
  const sortedDiaries = useMemo(() => {
    return [...diaries].sort((a, b) => {
      try {
        return new Date(b.date) - new Date(a.date);
      } catch (e) {
        return 0;
      }
    });
  }, [diaries]);

  return (
    <div className="bg-white/12 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/25 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white flex items-center">
          <Book className="w-6 h-6 mr-3" />
          故事森林
        </h2>
      </div>
      
      {sortedDiaries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {sortedDiaries.map((diary, index) => (
            <motion.div
              key={diary.id}
              className="bg-gradient-to-br from-white/12 to-white/8 rounded-2xl p-4 md:p-6 border border-white/15 hover:border-yellow-400/35 transition-all duration-300 cursor-pointer group relative overflow-hidden"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.025 }}
            >
              <div className="absolute top-0 right-0 w-10 h-10 md:w-12 md:h-12 bg-yellow-400/25 transform rotate-45 translate-x-5 -translate-y-5" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl md:text-3xl inline-block" style={{ lineHeight: 1 }}>
                    {diary.mood === '开心' ? '😊' : diary.mood === '难过' ? '😢' : diary.mood === '平静' ? '😌' : diary.mood === '兴奋' ? '🤩' : '📝'}
                  </span>
                  <span className="text-white/65 text-xs md:text-sm">{diary.date ? new Date(diary.date).toLocaleDateString() : ''}</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 group-hover:text-yellow-300 transition-colors">{diary.title || '无标题'}</h3>
                <p className="text-white/75 text-sm line-clamp-4 leading-relaxed">{diary.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState icon={<Book className="w-20 h-20" />} title="还没有故事" subtitle="写下第一个故事吧！" />
      )}
    </div>
  );
}

function MilestonesTab({ milestones }) {
  const sortedMilestones = useMemo(() => {
    return [...milestones].sort((a, b) => {
      try {
        const dateDiff = new Date(b.date) - new Date(a.date);
        if (dateDiff !== 0) return dateDiff;
        return b.created_at ? new Date(b.created_at) - new Date(a.created_at) : 0;
      } catch (e) {
        return 0;
      }
    });
  }, [milestones]);

  return (
    <div className="bg-white/12 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/25 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white flex items-center">
          <Star className="w-6 h-6 mr-3" />
          成长山峰
        </h2>
      </div>
      
      {sortedMilestones.length > 0 ? (
        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 via-pink-400 to-purple-400 rounded-full transform md:-translate-x-1/2" />
          
          <div className="space-y-6 md:space-y-8">
            {sortedMilestones.map((milestone, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={milestone.id}
                  className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.12, duration: 0.65 }}
                >
                  <div className="absolute left-6 md:left-1/2 w-4 h-4 md:w-6 md:h-6 bg-yellow-400 rounded-full transform -translate-x-1/2 z-20 border-2 md:border-4 border-white shadow-lg" />
                  <div className={`ml-14 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-4 md:pl-0' : 'md:pl-4 md:pr-0'}`}>
                    <motion.div
                      className="bg-gradient-to-br from-yellow-500/25 to-orange-500/25 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-yellow-400/35 shadow-xl hover:shadow-yellow-500/30 transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="flex items-start justify-between mb-2 md:mb-3">
                        <h3 className="text-lg md:text-xl font-bold text-white">{milestone.title}</h3>
                        {milestone.type && (
                          <span className="px-2.5 py-1 bg-yellow-400/35 text-yellow-200 text-xs rounded-full">
                            {milestone.type}
                          </span>
                        )}
                      </div>
                      <p className="text-white/75 text-sm mb-2 md:mb-3">{milestone.description}</p>
                      <p className="text-white/55 text-xs flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {milestone.date ? new Date(milestone.date).toLocaleDateString() : ''}
                      </p>
                    </motion.div>
                  </div>
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <EmptyState icon={<Star className="w-20 h-20" />} title="还没有里程碑" subtitle="记录第一个重要时刻吧！" />
      )}
    </div>
  );
}

function VideosTab({ videos }) {
  return (
    <div className="bg-white/12 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/25 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white flex items-center">
          <Video className="w-6 h-6 mr-3" />
          欢乐河流
        </h2>
      </div>
      
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              className="relative rounded-2xl overflow-hidden shadow-xl group cursor-pointer"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.55 }}
              whileHover={{ scale: 1.025 }}
            >
              <div className="aspect-video bg-gradient-to-br from-purple-500/35 to-pink-500/35 flex items-center justify-center">
                {video.url ? (
                  <video
                    src={video.url}
                    className="w-full h-full object-cover"
                    poster={video.thumbnail}
                  />
                ) : (
                  <div className="flex items-center justify-center text-4xl">🎬</div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.div
                    className="w-16 h-16 md:w-20 md:h-20 bg-white/95 rounded-full flex items-center justify-center shadow-xl"
                    initial={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.div>
                </div>
              </div>
              <div className="bg-white/12 backdrop-blur-sm p-3 md:p-4">
                <h3 className="text-white font-medium truncate text-sm md:text-base">{video.title || '未命名'}</h3>
                <p className="text-white/55 text-xs md:text-sm">{video.date ? new Date(video.date).toLocaleDateString() : ''}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState icon={<Video className="w-20 h-20" />} title="还没有视频" subtitle="上传第一个欢乐视频吧！" />
      )}
    </div>
  );
}

function GrowthTab({ growth }) {
  const sortedGrowth = useMemo(() => {
    return [...growth].sort((a, b) => {
      try {
        return new Date(a.date) - new Date(b.date);
      } catch (e) {
        return 0;
      }
    });
  }, [growth]);

  return (
    <div className="bg-white/12 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/25 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white flex items-center">
          <BarChart3 className="w-6 h-6 mr-3" />
          成长测量站
        </h2>
      </div>
      
      {sortedGrowth.length > 0 ? (
        <div className="space-y-6">
          <div className="bg-white/8 rounded-2xl p-4 md:p-6 border border-white/15">
            <h3 className="text-base md:text-lg font-medium text-white mb-4">📏 成长追踪</h3>
            <div className="h-48 md:h-64 flex items-end justify-around space-x-1 md:space-x-2 overflow-x-auto pb-2">
              {sortedGrowth.slice(-10).map((record, index) => (
                <motion.div
                  key={record.id}
                  className="flex flex-col items-center flex-1 min-w-[45px]"
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.12, duration: 0.55 }}
                >
                  <div className="w-full max-w-6 md:max-w-8 relative group">
                    <motion.div
                      className="bg-gradient-to-t from-green-400 to-blue-400 rounded-t-lg"
                      style={{ height: `${Math.min((record.height || record.weight || 50) / 1.5, 200)}px` }}
                      whileHover={{ scale: 1.15 }}
                    />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white/95 text-gray-800 px-2.5 py-1.5 md:px-3.5 md:py-2 rounded-lg text-xs shadow-xl whitespace-nowrap z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {record.height && <p>身高: {record.height}cm</p>}
                      {record.weight && <p>体重: {record.weight}kg</p>}
                      <p>{record.date ? new Date(record.date).toLocaleDateString() : ''}</p>
                    </div>
                  </div>
                  <span className="text-white/55 text-xs mt-2">
                    {record.date ? new Date(record.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) : ''}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-medium text-white mb-4">📊 详细记录</h3>
            {sortedGrowth.toReversed().map((record, index) => (
              <motion.div
                key={record.id}
                className="bg-white/8 rounded-xl p-4 border border-white/15 hover:bg-white/15 transition-colors"
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.06, duration: 0.45 }}
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-3 md:space-x-6 flex-wrap gap-2">
                    {record.height && (
                      <div className="flex items-center space-x-2">
                        <Ruler className="w-5 h-5 md:w-6 h-6" />
                        <div>
                          <p className="text-white/55 text-xs">身高</p>
                          <p className="text-white font-bold">{record.height} cm</p>
                        </div>
                      </div>
                    )}
                    {record.weight && (
                      <div className="flex items-center space-x-2">
                        <Weight className="w-5 h-5 md:w-6 h-6" />
                        <div>
                          <p className="text-white/55 text-xs">体重</p>
                          <p className="text-white font-bold">{record.weight} kg</p>
                        </div>
                      </div>
                    )}
                    {record.head_circumference && (
                      <div className="flex items-center space-x-2">
                        <Baby className="w-5 h-5 md:w-6 h-6" />
                        <div>
                          <p className="text-white/55 text-xs">头围</p>
                          <p className="text-white font-bold">{record.head_circumference} cm</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-white/55 text-xs md:text-sm">{record.date ? new Date(record.date).toLocaleDateString() : ''}</span>
                </div>
                {record.notes && <p className="text-white/65 text-xs md:text-sm mt-2">{record.notes}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState icon={<BarChart3 className="w-20 h-20" />} title="还没有数据" subtitle="记录第一次成长测量吧！" />
      )}
    </div>
  );
}

function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="text-center py-12 md:py-20">
      <div className="mb-4 md:mb-6 inline-flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg md:text-xl font-medium text-white mb-2">{title}</h3>
      <p className="text-white/65 text-sm md:text-base">{subtitle}</p>
    </div>
  );
}
