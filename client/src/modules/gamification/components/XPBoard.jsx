import React, { useState, useEffect } from "react";
import { Zap, Trophy, Star, Target, Flame, Shield, Award, Crown, TrendingUp, Calendar, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const XPBoard = ({ 
  currentXP = 2800, 
  levelXP = 5000, 
  level = 12,
  totalXP = 15600,
  weeklyXP = 450,
  dailyXP = 85,
  streak = 7
}) => {
  const [animatedXP, setAnimatedXP] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState("daily");
  
  const progress = Math.min((currentXP / levelXP) * 100, 100);
  const xpToNext = levelXP - currentXP;
  const isLevelComplete = currentXP >= levelXP;

  // Animate XP counter
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedXP(currentXP);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentXP]);

  // Show level up animation
  useEffect(() => {
    if (isLevelComplete) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
  }, [isLevelComplete]);

  const getLevelColor = (level) => {
    if (level >= 20) return "from-yellow-400 via-orange-500 to-red-500";
    if (level >= 15) return "from-purple-400 via-pink-500 to-red-500";
    if (level >= 10) return "from-blue-400 via-purple-500 to-pink-500";
    if (level >= 5) return "from-green-400 via-blue-500 to-purple-500";
    return "from-gray-400 to-gray-600";
  };

  const getLevelTitle = (level) => {
    if (level >= 20) return "Legendary Master";
    if (level >= 15) return "Expert Professional";
    if (level >= 10) return "Skilled Practitioner";
    if (level >= 5) return "Rising Star";
    return "Beginner";
  };

  const getProgressColor = () => {
    if (progress >= 90) return "from-green-400 via-emerald-500 to-teal-500";
    if (progress >= 70) return "from-blue-400 via-cyan-500 to-teal-500";
    if (progress >= 50) return "from-yellow-400 via-orange-500 to-red-500";
    return "from-blue-500 via-purple-500 to-pink-500";
  };

  const timeframes = [
    { key: "daily", label: "Daily", icon: Calendar, value: dailyXP, target: 100 },
    { key: "weekly", label: "Weekly", icon: TrendingUp, value: weeklyXP, target: 500 },
    { key: "total", label: "Total", icon: Trophy, value: totalXP, target: null }
  ];

  const selectedTimeframeData = timeframes.find(tf => tf.key === selectedTimeframe);
  const timeframeProgress = selectedTimeframeData.target ? 
    Math.min((selectedTimeframeData.value / selectedTimeframeData.target) * 100, 100) : 100;

  const achievements = [
    { id: 1, name: "First Steps", description: "Complete your first lesson", icon: Star, unlocked: true, xp: 50 },
    { id: 2, name: "Streak Master", description: "Maintain a 7-day streak", icon: Flame, unlocked: streak >= 7, xp: 200 },
    { id: 3, name: "Level Up", description: "Reach level 10", icon: Target, unlocked: level >= 10, xp: 500 },
    { id: 4, name: "XP Collector", description: "Earn 10,000 total XP", icon: Zap, unlocked: totalXP >= 10000, xp: 1000 },
    { id: 5, name: "Dedicated Learner", description: "Complete 30 days of learning", icon: Shield, unlocked: false, xp: 1500 },
    { id: 6, name: "Achievement Hunter", description: "Unlock 10 achievements", icon: Award, unlocked: false, xp: 2000 }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalAchievementXP = unlockedAchievements.reduce((sum, a) => sum + a.xp, 0);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm p-6">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 blur-3xl"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">XP Progress Center</h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Track your learning journey and unlock achievements as you progress
          </p>
        </div>

        {/* Level Up Animation */}
        {showLevelUp && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-8 rounded-2xl text-center text-white"
            >
              <Crown className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Level Up!</h2>
              <p className="text-xl">You've reached Level {level + 1}!</p>
            </motion.div>
          </motion.div>
        )}

        {/* Main XP Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 backdrop-blur-sm rounded-xl p-8 mb-8 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Current Level Progress</h2>
              <p className="text-gray-300">Level {level} • {getLevelTitle(level)}</p>
            </div>
            <div className="text-right">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getLevelColor(level)} flex items-center justify-center text-white font-bold text-xl`}>
                {level}
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="relative mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-300">Progress to Level {level + 1}</span>
              <span className="text-sm text-gray-300">{Math.round(progress)}%</span>
            </div>
            <div className="relative w-full bg-white/10 rounded-full h-6 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`absolute top-0 left-0 h-6 bg-gradient-to-r ${getProgressColor()} rounded-full shadow-lg`}
              />
              {isLevelComplete && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute top-0 left-0 h-6 w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full"
                />
              )}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-300">{animatedXP.toLocaleString()} XP</span>
              <span className="text-gray-300">{levelXP.toLocaleString()} XP</span>
            </div>
          </div>

          {/* XP to Next Level */}
          <div className="flex items-center justify-center gap-2 text-lg">
            <Zap className="w-6 h-6 text-yellow-400" />
            <span className="text-white font-medium">
              {isLevelComplete ? 
                "🎉 Level Complete! Ready to advance!" : 
                `${xpToNext.toLocaleString()} XP to next level`
              }
            </span>
          </div>
        </motion.div>

        {/* Timeframe Selection */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-1 border border-white/10">
            {timeframes.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedTimeframe(key)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedTimeframe === key
                    ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Timeframe Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/20 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">{selectedTimeframeData.label} Progress</h3>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{selectedTimeframeData.value.toLocaleString()} XP</p>
              {selectedTimeframeData.target && (
                <p className="text-sm text-gray-300">Target: {selectedTimeframeData.target.toLocaleString()} XP</p>
              )}
            </div>
          </div>
          
          {selectedTimeframeData.target && (
            <div className="relative w-full bg-white/10 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${timeframeProgress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute top-0 left-0 h-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
              />
            </div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalXP.toLocaleString()}</p>
                <p className="text-gray-300 text-sm">Total XP</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{streak}</p>
                <p className="text-gray-300 text-sm">Day Streak</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{unlockedAchievements.length}</p>
                <p className="text-gray-300 text-sm">Achievements</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Achievements</h3>
            <span className="text-sm text-gray-300">
              {unlockedAchievements.length} of {achievements.length} unlocked
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`p-4 rounded-lg border transition-all duration-300 ${
                  achievement.unlocked
                    ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30"
                    : "bg-black/10 border-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    achievement.unlocked
                      ? "bg-gradient-to-br from-green-500 to-emerald-600"
                      : "bg-gray-600"
                  }`}>
                    {achievement.unlocked ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <achievement.icon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${
                      achievement.unlocked ? "text-white" : "text-gray-400"
                    }`}>
                      {achievement.name}
                    </h4>
                    <p className={`text-sm ${
                      achievement.unlocked ? "text-gray-300" : "text-gray-500"
                    }`}>
                      {achievement.description}
                    </p>
                    <p className={`text-xs mt-1 ${
                      achievement.unlocked ? "text-green-400" : "text-gray-500"
                    }`}>
                      {achievement.xp} XP
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* XP History Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 mt-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">XP History</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">XP history chart coming soon</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default XPBoard;
