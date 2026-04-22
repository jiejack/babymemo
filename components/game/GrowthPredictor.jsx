import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, Ruler, Weight, Activity } from 'lucide-react';

export default function GrowthPredictor({ growth }) {
  const [predictionType, setPredictionType] = useState('height');
  const [predictionMonths, setPredictionMonths] = useState(6);
  const [showPrediction, setShowPrediction] = useState(false);
  const [predictionData, setPredictionData] = useState(null);

  // 按时间排序成长数据
  const sortedGrowth = useMemo(() => {
    return [...growth]
      .filter(item => item.date && (item.height || item.weight))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [growth]);

  // 计算趋势
  const calculateTrend = (data, key) => {
    if (data.length < 2) return null;

    const values = data.map(item => item[key]).filter(val => val);
    if (values.length < 2) return null;

    const n = values.length;
    const sumX = Array.from({ length: n }, (_, i) => i).reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = Array.from({ length: n }, (_, i) => i * values[i]).reduce((a, b) => a + b, 0);
    const sumX2 = Array.from({ length: n }, (_, i) => i * i).reduce((a, b) => a + b, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  };

  // 生成预测数据
  const generatePrediction = () => {
    if (sortedGrowth.length < 2) {
      setPredictionData(null);
      return;
    }

    const trend = calculateTrend(sortedGrowth, predictionType);
    if (!trend) {
      setPredictionData(null);
      return;
    }

    const lastIndex = sortedGrowth.length - 1;
    const lastValue = sortedGrowth[lastIndex][predictionType];
    const lastDate = new Date(sortedGrowth[lastIndex].date);

    const predictions = [];
    for (let i = 1; i <= predictionMonths; i++) {
      const predictedValue = lastValue + (trend.slope * i);
      const predictedDate = new Date(lastDate);
      predictedDate.setMonth(predictedDate.getMonth() + i);

      predictions.push({
        date: predictedDate,
        value: Math.round(predictedValue * 10) / 10
      });
    }

    setPredictionData({
      type: predictionType,
      currentData: sortedGrowth,
      predictions
    });
    setShowPrediction(true);
  };

  // 获取单位
  const getUnit = (type) => {
    return type === 'height' ? 'cm' : 'kg';
  };

  // 获取标题
  const getTitle = (type) => {
    return type === 'height' ? '身高预测' : '体重预测';
  };

  // 获取图标
  const getIcon = (type) => {
    return type === 'height' ? <Ruler className="w-5 h-5" /> : <Weight className="w-5 h-5" />;
  };

  // 获取颜色
  const getColor = (type) => {
    return type === 'height' ? 'from-blue-500 to-cyan-400' : 'from-green-500 to-emerald-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <TrendingUp className="w-6 h-6 mr-3" /> 成长预测
        </h2>
        <div className="flex space-x-3">
          <select
            value={predictionType}
            onChange={(e) => setPredictionType(e.target.value)}
            className="bg-white/10 text-white px-3 py-2 rounded-full border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="height">身高</option>
            <option value="weight">体重</option>
          </select>
          <select
            value={predictionMonths}
            onChange={(e) => setPredictionMonths(parseInt(e.target.value))}
            className="bg-white/10 text-white px-3 py-2 rounded-full border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value={3}>3个月</option>
            <option value={6}>6个月</option>
            <option value={12}>12个月</option>
          </select>
          <button
            onClick={generatePrediction}
            disabled={sortedGrowth.length < 2}
            className={`bg-gradient-to-r ${getColor(predictionType)} text-white px-4 py-2 rounded-full font-medium transition-all duration-300 ${sortedGrowth.length < 2 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-blue-500/30'}`}
          >
            生成预测
          </button>
        </div>
      </div>

      <motion.div
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {sortedGrowth.length < 2 ? (
          <div className="text-center py-12">
            <motion.div
              className="text-6xl mb-4"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              📈
            </motion.div>
            <h3 className="text-lg font-medium text-white mb-2">需要至少2条成长记录</h3>
            <p className="text-white/60 text-sm">请先添加宝宝的身高或体重记录</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-white font-medium mb-3 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" /> 历史数据
                </h3>
                <div className="space-y-2">
                  {sortedGrowth.slice(-5).reverse().map((record, index) => (
                    <div key={record.id} className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">
                        {new Date(record.date).toLocaleDateString()}
                      </span>
                      <span className="text-white font-bold">
                        {record[predictionType]} {getUnit(predictionType)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {showPrediction && predictionData && (
                  <motion.div
                    className="bg-white/5 rounded-xl p-4 border border-white/10"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-white font-medium mb-3 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" /> 预测数据
                    </h3>
                    <div className="space-y-2">
                      {predictionData.predictions.map((prediction, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-white/70 text-sm">
                            {prediction.date.toLocaleDateString()}
                          </span>
                          <span className={`font-bold ${predictionType === 'height' ? 'text-blue-300' : 'text-green-300'}`}>
                            {prediction.value} {getUnit(predictionType)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {showPrediction && predictionData && (
                <motion.div
                  className="bg-gradient-to-br from-white/15 to-white/5 rounded-2xl p-6 border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    {getIcon(predictionType)} {getTitle(predictionType)}
                  </h3>
                  
                  <div className="h-64 md:h-80 flex items-end justify-around space-x-1 md:space-x-2 overflow-x-auto pb-4">
                    {/* 历史数据 */}
                    {predictionData.currentData.map((record, index) => (
                      <motion.div
                        key={record.id}
                        className="flex flex-col items-center flex-1 min-w-[45px]"
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <div className="w-full max-w-6 md:max-w-8 relative">
                          <motion.div
                            className="bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg"
                            style={{ height: `${Math.min((record[predictionType] || 50) / 2, 200)}px` }}
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.min((record[predictionType] || 50) / 2, 200)}px` }}
                            transition={{ delay: index * 0.1 + 0.5, duration: 0.8, ease: 'easeOut' }}
                          />
                        </div>
                        <span className="text-white/55 text-xs mt-2">
                          {new Date(record.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                        </span>
                      </motion.div>
                    ))}
                    
                    {/* 预测数据 */}
                    {predictionData.predictions.map((prediction, index) => (
                      <motion.div
                        key={index}
                        className="flex flex-col items-center flex-1 min-w-[45px]"
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (predictionData.currentData.length + index) * 0.1, duration: 0.5 }}
                      >
                        <div className="w-full max-w-6 md:max-w-8 relative">
                          <motion.div
                            className={`bg-gradient-to-t ${getColor(predictionType)} rounded-t-lg opacity-70`}
                            style={{ height: `${Math.min((prediction.value || 50) / 2, 200)}px` }}
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.min((prediction.value || 50) / 2, 200)}px` }}
                            transition={{ delay: (predictionData.currentData.length + index) * 0.1 + 0.5, duration: 0.8, ease: 'easeOut' }}
                          />
                        </div>
                        <span className="text-white/55 text-xs mt-2">
                          {prediction.date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-center space-x-6 mt-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
                      <span className="text-white/70 text-sm">历史数据</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 bg-gradient-to-br ${getColor(predictionType)} rounded-full opacity-70`}></div>
                      <span className="text-white/70 text-sm">预测数据</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
