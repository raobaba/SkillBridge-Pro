import React, { useState } from "react";
import { Medal, Star, Award, Trophy, Crown, Zap, Target, Flame, Shield, Rocket } from "lucide-react";
import { motion } from "framer-motion";

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
    color: "from-cyan-400 via-blue-500 to-indigo-600",
    description: "Created breakthrough solutions",
    points: 1500,
    rarity: "legendary",
    unlocked: false,
    unlockedDate: null
  },
  { 
    id: 8, 
    name: "Streak Master", 
    icon: Flame, 
    color: "from-orange-400 via-red-500 to-pink-500",
    description: "30-day activity streak",
    points: 600,
    rarity: "epic",
    unlocked: true,
    unlockedDate: "2024-02-10"
  }
];

const Badges = () => {
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [filter, setFilter] = useState("all"); // all, unlocked, locked

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "common": return "from-gray-400 to-gray-600";
      case "rare": return "from-blue-400 to-blue-600";
      case "epic": return "from-purple-400 to-purple-600";
      case "legendary": return "from-yellow-400 via-orange-500 to-red-500";
      default: return "from-gray-400 to-gray-600";
    }
  };

  const getRarityGlow = (rarity) => {
    switch (rarity) {
      case "common": return "shadow-gray-500/20";
      case "rare": return "shadow-blue-500/30";
      case "epic": return "shadow-purple-500/40";
      case "legendary": return "shadow-yellow-500/50";
      default: return "shadow-gray-500/20";
    }
  };

  const filteredBadges = badges.filter(badge => {
    if (filter === "unlocked") return badge.unlocked;
    if (filter === "locked") return !badge.unlocked;
    return true;
  });

  const unlockedCount = badges.filter(badge => badge.unlocked).length;
  const totalPoints = badges.filter(badge => badge.unlocked).reduce((sum, badge) => sum + badge.points, 0);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm p-6">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Achievement Badges</h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Unlock badges by completing challenges and reaching milestones in your learning journey
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Medal className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{unlockedCount}</p>
                <p className="text-gray-300 text-sm">Badges Unlocked</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalPoints.toLocaleString()}</p>
                <p className="text-gray-300 text-sm">Total Points</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{badges.length}</p>
                <p className="text-gray-300 text-sm">Total Badges</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-1 border border-white/10">
            {[
              { key: "all", label: "All Badges", count: badges.length },
              { key: "unlocked", label: "Unlocked", count: unlockedCount },
              { key: "locked", label: "Locked", count: badges.length - unlockedCount }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  filter === key
                    ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`relative group cursor-pointer ${
                badge.unlocked ? "opacity-100" : "opacity-60"
              }`}
              onClick={() => setSelectedBadge(badge)}
            >
              <div className={`bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 transition-all duration-300 hover:border-white/20 ${
                badge.unlocked ? `hover:shadow-2xl ${getRarityGlow(badge.rarity)}` : ""
              }`}>
                {/* Badge Icon */}
                <div className="flex items-center justify-center mb-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-lg ${
                    badge.unlocked ? "animate-pulse" : "grayscale"
                  }`}>
                    <badge.icon className="w-8 h-8 text-white" />
                  </div>
                  {badge.unlocked && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Badge Info */}
                <div className="text-center">
                  <h3 className={`text-lg font-bold mb-2 ${
                    badge.unlocked ? "text-white" : "text-gray-400"
                  }`}>
                    {badge.name}
                  </h3>
                  <p className={`text-sm mb-3 ${
                    badge.unlocked ? "text-gray-300" : "text-gray-500"
                  }`}>
                    {badge.description}
                  </p>
                  
                  {/* Points and Rarity */}
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-1 rounded-full bg-gradient-to-r ${getRarityColor(badge.rarity)} text-white font-medium`}>
                      {badge.rarity.toUpperCase()}
                    </span>
                    <span className={`font-bold ${
                      badge.unlocked ? "text-yellow-400" : "text-gray-500"
                    }`}>
                      {badge.points} pts
                    </span>
                  </div>

                  {/* Unlock Date */}
                  {badge.unlocked && badge.unlockedDate && (
                    <p className="text-xs text-gray-400 mt-2">
                      Unlocked: {new Date(badge.unlockedDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Locked Overlay */}
                {!badge.unlocked && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Crown className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-gray-400 text-sm font-medium">Locked</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Badge Detail Modal */}
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${selectedBadge.color} flex items-center justify-center mx-auto mb-6 shadow-2xl ${
                  selectedBadge.unlocked ? "animate-pulse" : "grayscale"
                }`}>
                  <selectedBadge.icon className="w-12 h-12 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">{selectedBadge.name}</h2>
                <p className="text-gray-300 mb-4">{selectedBadge.description}</p>
                
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-400">{selectedBadge.points}</p>
                    <p className="text-xs text-gray-400">Points</p>
                  </div>
                  <div className="text-center">
                    <p className={`px-3 py-1 rounded-full bg-gradient-to-r ${getRarityColor(selectedBadge.rarity)} text-white text-sm font-medium`}>
                      {selectedBadge.rarity.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Rarity</p>
                  </div>
                </div>

                {selectedBadge.unlocked && selectedBadge.unlockedDate && (
                  <p className="text-sm text-gray-400 mb-6">
                    Unlocked on {new Date(selectedBadge.unlockedDate).toLocaleDateString()}
                  </p>
                )}

                <button
                  onClick={() => setSelectedBadge(null)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Badges;
