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
  streak = 7,
  compact = false
}) => {
  const [animatedXP, setAnimatedXP] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  
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

  if (compact) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-bold">{animatedXP.toLocaleString()} XP</span>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-300">Level {level}</div>
            <div className="text-xs text-gray-400">{getLevelTitle(level)}</div>
          </div>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full bg-gradient-to-r ${getLevelColor(level)}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="text-xs text-gray-400 mt-1">
          {xpToNext.toLocaleString()} XP to next level
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
    >
      {/* Level Up Animation */}
      {showLevelUp && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl z-10"
        >
          <div className="text-center text-white">
            <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Level Up!</h2>
            <p className="text-lg">You're now level {level}!</p>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">XP Progress</h3>
          <p className="text-gray-300">{getLevelTitle(level)}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">{animatedXP.toLocaleString()} XP</div>
          <div className="text-sm text-gray-300">Level {level}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Progress to Level {level + 1}</span>
          <span>{xpToNext.toLocaleString()} XP to next level</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <motion.div 
            className={`h-4 rounded-full bg-gradient-to-r ${getLevelColor(level)}`}
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          ></motion.div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-white mb-1">{dailyXP}</div>
          <div className="text-xs text-gray-300">Daily XP</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-white mb-1">{weeklyXP}</div>
          <div className="text-xs text-gray-300">Weekly XP</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4 text-center">
          <div className="text-xl font-bold text-white mb-1">{streak}</div>
          <div className="text-xs text-gray-300">Day Streak</div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="mt-6">
        <h4 className="text-lg font-bold text-white mb-3">Recent Achievements</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-3 text-sm">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">Completed first project (+100 XP)</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-gray-300">7-day streak achieved (+200 XP)</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-300">Level 10 reached (+500 XP)</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default XPBoard;