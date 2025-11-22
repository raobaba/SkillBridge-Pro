import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Medal, Star, Award, Trophy, Crown, Zap, Target, Flame, Shield, Rocket, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";
import { getDeveloperAchievements } from "../slice/gamificationSlice";
import { CircularLoader } from "../../../components";

// Icon mapping for achievements
const iconMap = {
  Star,
  Flame,
  Target,
  Zap,
  Award,
  ThumbsUp,
  Medal,
  Shield,
  Rocket,
  Crown,
  Trophy,
};

const Badges = ({ compact = false }) => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Get achievements from Redux state
  const gamificationState = useSelector((state) => state.gamification || {});
  const { achievements: achievementsData = [], achievementsLoading = false } = gamificationState;

  // Fetch achievements on component mount
  useEffect(() => {
    if (achievementsData.length === 0 && !achievementsLoading) {
      dispatch(getDeveloperAchievements());
    }
  }, [dispatch, achievementsData.length, achievementsLoading]);

  // Map backend achievements to frontend badge format
  const badges = useMemo(() => {
    if (!Array.isArray(achievementsData) || achievementsData.length === 0) {
      return [];
    }

    return achievementsData.map((achievement) => {
      const IconComponent = iconMap[achievement.icon] || Star;
      
      return {
        id: achievement.id,
        name: achievement.name,
        icon: IconComponent,
        color: achievement.color || "from-yellow-400 via-orange-500 to-red-500",
        description: achievement.description,
        points: achievement.points || achievement.xp || 0,
        rarity: achievement.rarity || "common",
        unlocked: achievement.unlocked || false,
        unlockedDate: achievement.unlockedDate || null,
      };
    });
  }, [achievementsData]);

  // Use badges from API, or empty array if loading
  const displayBadges = badges.length > 0 ? badges : [];

  const categories = useMemo(() => [
    { key: "all", label: "All", count: displayBadges.length },
    { key: "unlocked", label: "Unlocked", count: displayBadges.filter(b => b.unlocked).length },
    { key: "locked", label: "Locked", count: displayBadges.filter(b => !b.unlocked).length },
    { key: "common", label: "Common", count: displayBadges.filter(b => b.rarity === "common").length },
    { key: "rare", label: "Rare", count: displayBadges.filter(b => b.rarity === "rare").length },
    { key: "epic", label: "Epic", count: displayBadges.filter(b => b.rarity === "epic").length },
    { key: "legendary", label: "Legendary", count: displayBadges.filter(b => b.rarity === "legendary").length }
  ], [displayBadges]);

  const filteredBadges = useMemo(() => {
    return displayBadges.filter(badge => {
      if (selectedCategory === "all") return true;
      if (selectedCategory === "unlocked") return badge.unlocked;
      if (selectedCategory === "locked") return !badge.unlocked;
      return badge.rarity === selectedCategory;
    });
  }, [displayBadges, selectedCategory]);

  const getRarityColor = (rarity) => {
    const colors = {
      common: "text-gray-400 border-gray-400",
      rare: "text-blue-400 border-blue-400",
      epic: "text-purple-400 border-purple-400",
      legendary: "text-yellow-400 border-yellow-400"
    };
    return colors[rarity] || colors.common;
  };

  const getRarityBg = (rarity) => {
    const colors = {
      common: "bg-gray-100",
      rare: "bg-blue-100",
      epic: "bg-purple-100",
      legendary: "bg-yellow-100"
    };
    return colors[rarity] || colors.common;
  };

  if (compact) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <h3 className="text-lg font-bold text-white mb-3">Recent Badges</h3>
        {achievementsLoading ? (
          <div className="flex justify-center items-center py-8">
            <CircularLoader />
          </div>
        ) : displayBadges.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No badges available</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {displayBadges.filter(b => b.unlocked).slice(0, 4).map((badge, index) => (
            <div key={badge.id} className="text-center">
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center`}>
                <badge.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs text-white font-medium">{badge.name}</div>
              <div className="text-xs text-gray-400">+{badge.points} XP</div>
            </div>
          ))}
          </div>
        )}
      </div>
    );
  }

  // Show loading state
  if (achievementsLoading && displayBadges.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
      >
        <div className="flex flex-col items-center justify-center py-12">
          <CircularLoader />
          <p className="text-gray-300 mt-4">Loading badges...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">Badges</h3>
          <p className="text-gray-300">Achievements and accomplishments</p>
        </div>
        <div className="flex items-center space-x-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key)}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              selectedCategory === category.key
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-gray-300 hover:text-white hover:bg-white/20'
            }`}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      {displayBadges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBadges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`relative bg-white/5 rounded-xl p-4 border border-white/10 transition-all ${
              badge.unlocked ? 'hover:bg-white/10' : 'opacity-60'
            }`}
          >
            {/* Badge Icon */}
            <div className="text-center mb-3">
              <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center mb-2 ${
                badge.unlocked ? '' : 'grayscale'
              }`}>
                <badge.icon className="w-8 h-8 text-white" />
              </div>
              
              {/* Rarity Badge */}
              <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getRarityColor(badge.rarity)}`}>
                {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
              </div>
            </div>

            {/* Badge Info */}
            <div className="text-center">
              <h4 className="font-bold text-white mb-1">{badge.name}</h4>
              <p className="text-sm text-gray-300 mb-3">{badge.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">+{badge.points} XP</span>
                {badge.unlocked ? (
                  <div className="text-xs text-green-400">
                    ✓ {badge.unlockedDate ? badge.unlockedDate : "Unlocked"}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">
                    🔒 Locked
                  </div>
                )}
              </div>
            </div>

            {/* Unlocked Indicator */}
            {badge.unlocked && (
              <div className="absolute top-2 right-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            )}
          </motion.div>
        ))}
        </div>
      ) : null}

      {/* Stats */}
      {displayBadges.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-white">{displayBadges.filter(b => b.unlocked).length}</div>
              <div className="text-xs text-gray-300">Unlocked</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">{displayBadges.filter(b => !b.unlocked).length}</div>
              <div className="text-xs text-gray-300">Locked</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {displayBadges.filter(b => b.unlocked).reduce((sum, b) => sum + b.points, 0)}
              </div>
              <div className="text-xs text-gray-300">Total XP</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">
                {displayBadges.length > 0 
                  ? Math.round((displayBadges.filter(b => b.unlocked).length / displayBadges.length) * 100)
                  : 0}%
              </div>
              <div className="text-xs text-gray-300">Progress</div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!achievementsLoading && displayBadges.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No badges available yet</p>
          <p className="text-sm mt-2">Complete achievements to unlock badges!</p>
        </div>
      )}
    </motion.div>
  );
};

export default Badges;