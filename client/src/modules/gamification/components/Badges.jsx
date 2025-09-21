import React, { useState } from "react";
import { Medal, Star, Award, Trophy, Crown, Zap, Target, Flame, Shield, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const Badges = ({ compact = false }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const badges = [
    { 
      id: 1, 
      name: "Rising Star", 
      icon: Star, 
      color: "from-yellow-400 via-orange-500 to-red-500",
      description: "First achievement unlocked",
      points: 100,
      rarity: "common",
      unlocked: true,
      unlockedDate: "2024-01-15"
    },
    { 
      id: 2, 
      name: "Top Contributor", 
      icon: Medal, 
      color: "from-blue-500 via-purple-500 to-pink-500",
      description: "Active community member",
      points: 500,
      rarity: "rare",
      unlocked: true,
      unlockedDate: "2024-01-20"
    },
    { 
      id: 3, 
      name: "Master Coder", 
      icon: Award, 
      color: "from-green-400 via-blue-500 to-purple-600",
      description: "Completed 50 coding challenges",
      points: 1000,
      rarity: "epic",
      unlocked: true,
      unlockedDate: "2024-02-01"
    },
    { 
      id: 4, 
      name: "Speed Demon", 
      icon: Zap, 
      color: "from-yellow-300 via-yellow-500 to-orange-500",
      description: "Solved problems in record time",
      points: 750,
      rarity: "rare",
      unlocked: false,
      unlockedDate: null
    },
    { 
      id: 5, 
      name: "Perfectionist", 
      icon: Target, 
      color: "from-pink-400 via-red-500 to-purple-600",
      description: "100% accuracy streak",
      points: 1200,
      rarity: "legendary",
      unlocked: false,
      unlockedDate: null
    },
    { 
      id: 6, 
      name: "Team Player", 
      icon: Shield, 
      color: "from-blue-400 via-indigo-500 to-purple-600",
      description: "Helped 25+ team members",
      points: 800,
      rarity: "rare",
      unlocked: true,
      unlockedDate: "2024-01-25"
    },
    { 
      id: 7, 
      name: "Innovation Leader", 
      icon: Rocket, 
      color: "from-purple-400 via-pink-500 to-red-500",
      description: "Led innovative projects",
      points: 1500,
      rarity: "epic",
      unlocked: false,
      unlockedDate: null
    },
    { 
      id: 8, 
      name: "Streak Master", 
      icon: Flame, 
      color: "from-orange-400 via-red-500 to-pink-500",
      description: "Maintained 30-day streak",
      points: 2000,
      rarity: "legendary",
      unlocked: false,
      unlockedDate: null
    }
  ];

  const categories = [
    { key: "all", label: "All", count: badges.length },
    { key: "unlocked", label: "Unlocked", count: badges.filter(b => b.unlocked).length },
    { key: "locked", label: "Locked", count: badges.filter(b => !b.unlocked).length },
    { key: "common", label: "Common", count: badges.filter(b => b.rarity === "common").length },
    { key: "rare", label: "Rare", count: badges.filter(b => b.rarity === "rare").length },
    { key: "epic", label: "Epic", count: badges.filter(b => b.rarity === "epic").length },
    { key: "legendary", label: "Legendary", count: badges.filter(b => b.rarity === "legendary").length }
  ];

  const filteredBadges = badges.filter(badge => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "unlocked") return badge.unlocked;
    if (selectedCategory === "locked") return !badge.unlocked;
    return badge.rarity === selectedCategory;
  });

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
        <div className="grid grid-cols-2 gap-3">
          {badges.filter(b => b.unlocked).slice(0, 4).map((badge, index) => (
            <div key={badge.id} className="text-center">
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center`}>
                <badge.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs text-white font-medium">{badge.name}</div>
              <div className="text-xs text-gray-400">+{badge.points} XP</div>
            </div>
          ))}
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
                    ✓ {badge.unlockedDate}
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

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-white">{badges.filter(b => b.unlocked).length}</div>
            <div className="text-xs text-gray-300">Unlocked</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">{badges.filter(b => !b.unlocked).length}</div>
            <div className="text-xs text-gray-300">Locked</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              {badges.filter(b => b.unlocked).reduce((sum, b) => sum + b.points, 0)}
            </div>
            <div className="text-xs text-gray-300">Total XP</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              {Math.round((badges.filter(b => b.unlocked).length / badges.length) * 100)}%
            </div>
            <div className="text-xs text-gray-300">Progress</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Badges;