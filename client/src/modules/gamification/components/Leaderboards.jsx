import React, { useState } from "react";
import { Crown, Trophy, Medal, Award, Star, TrendingUp, Users, Calendar, Filter, Search, Zap, Target, Flame, Shield } from "lucide-react";
import { motion } from "framer-motion";

const Leaderboards = ({ role = "developers", compact = false }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const leaderboardData = [
    { 
      id: 1, 
      name: "Alice Johnson", 
      xp: 4200, 
      level: 15,
      avatar: "AJ",
      badges: 8,
      streak: 12,
      rank: 1,
      change: "+2",
      category: "Coding",
      joinDate: "2023-08-15",
      lastActive: "2 hours ago",
      achievements: ["Master Coder", "Speed Demon", "Team Player"],
      isCurrentUser: false
    },
    { 
      id: 2, 
      name: "Rajan Patel", 
      xp: 3800, 
      level: 14,
      avatar: "RP",
      badges: 6,
      streak: 8,
      rank: 2,
      change: "+1",
      category: "Design",
      joinDate: "2023-09-20",
      lastActive: "1 hour ago",
      achievements: ["Top Contributor", "Innovation Leader"],
      isCurrentUser: true
    },
    { 
      id: 3, 
      name: "John Smith", 
      xp: 3500, 
      level: 13,
      avatar: "JS",
      badges: 5,
      streak: 15,
      rank: 3,
      change: "-1",
      category: "Marketing",
      joinDate: "2023-07-10",
      lastActive: "30 min ago",
      achievements: ["Rising Star", "Streak Master"],
      isCurrentUser: false
    },
    { 
      id: 4, 
      name: "Mia Chen", 
      xp: 3200, 
      level: 12,
      avatar: "MC",
      badges: 4,
      streak: 6,
      rank: 4,
      change: "+3",
      category: "Data Science",
      joinDate: "2023-10-05",
      lastActive: "4 hours ago",
      achievements: ["Perfectionist"],
      isCurrentUser: false
    },
    { 
      id: 5, 
      name: "Leo Rodriguez", 
      xp: 2900, 
      level: 11,
      avatar: "LR",
      badges: 3,
      streak: 4,
      rank: 5,
      change: "-2",
      category: "Product",
      joinDate: "2023-11-12",
      lastActive: "1 day ago",
      achievements: ["Team Player"],
      isCurrentUser: false
    }
  ];

  const categories = [
    { key: "all", label: "All", icon: Users },
    { key: "coding", label: "Coding", icon: Zap },
    { key: "design", label: "Design", icon: Award },
    { key: "marketing", label: "Marketing", icon: TrendingUp },
    { key: "data-science", label: "Data Science", icon: Target },
    { key: "product", label: "Product", icon: Shield }
  ];

  const filteredData = leaderboardData.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category.toLowerCase() === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-orange-400" />;
      default: return <span className="text-gray-400 font-bold">#{rank}</span>;
    }
  };

  const getChangeColor = (change) => {
    if (change.startsWith('+')) return 'text-green-400';
    if (change.startsWith('-')) return 'text-red-400';
    return 'text-gray-400';
  };

  if (compact) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <h3 className="text-lg font-bold text-white mb-3">Top {role === "developers" ? "Developers" : "Project Owners"}</h3>
        <div className="space-y-2">
          {filteredData.slice(0, 5).map((item, index) => (
            <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
              <div className="flex items-center space-x-3">
                {getRankIcon(item.rank)}
                <div>
                  <div className="font-bold text-white text-sm">{item.name}</div>
                  <div className="text-xs text-gray-300">Level {item.level}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white text-sm">{item.xp.toLocaleString()} XP</div>
                <div className={`text-xs ${getChangeColor(item.change)}`}>{item.change}</div>
              </div>
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
          <h3 className="text-2xl font-bold text-white mb-1">Leaderboard</h3>
          <p className="text-gray-300">Top {role === "developers" ? "Developers" : "Project Owners"}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
          {categories.map(category => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm transition-all ${
                selectedCategory === category.key
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span>{category.label}</span>
            </button>
          ))}
        </div>
        
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-3">
        {filteredData.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-4 rounded-lg transition-all ${
              item.isCurrentUser 
                ? 'bg-blue-500/20 border border-blue-400' 
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8">
                {getRankIcon(item.rank)}
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {item.avatar}
                </div>
                <div>
                  <div className="font-bold text-white flex items-center space-x-2">
                    {item.name}
                    {item.isCurrentUser && (
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">You</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-300">
                    Level {item.level} • {item.category} • {item.badges} badges
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-bold text-white">{item.xp.toLocaleString()} XP</div>
              <div className="text-sm text-gray-300">{item.streak} day streak</div>
            </div>
            
            <div className="text-right ml-4">
              <div className={`text-sm font-medium ${getChangeColor(item.change)}`}>
                {item.change}
              </div>
              <div className="text-xs text-gray-400">{item.lastActive}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-white">{leaderboardData.length}</div>
            <div className="text-xs text-gray-300">Total Users</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              {Math.round(leaderboardData.reduce((sum, item) => sum + item.xp, 0) / leaderboardData.length).toLocaleString()}
            </div>
            <div className="text-xs text-gray-300">Avg XP</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white">
              {Math.round(leaderboardData.reduce((sum, item) => sum + item.level, 0) / leaderboardData.length)}
            </div>
            <div className="text-xs text-gray-300">Avg Level</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Leaderboards;