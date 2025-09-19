import React, { useState } from "react";
import { Crown, Trophy, Medal, Award, Star, TrendingUp, Users, Calendar, Filter, Search, Zap, Target, Flame, Shield } from "lucide-react";
import { motion } from "framer-motion";

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
  },
  { 
    id: 6, 
    name: "Sarah Wilson", 
    xp: 2650, 
    level: 10,
    avatar: "SW",
    badges: 2,
    streak: 7,
    rank: 6,
    change: "+1",
    category: "Coding",
    joinDate: "2023-12-01",
    lastActive: "3 hours ago",
    achievements: ["Rising Star"],
    isCurrentUser: false
  },
  { 
    id: 7, 
    name: "David Kim", 
    xp: 2400, 
    level: 9,
    avatar: "DK",
    badges: 2,
    streak: 3,
    rank: 7,
    change: "-1",
    category: "Design",
    joinDate: "2024-01-15",
    lastActive: "6 hours ago",
    achievements: [],
    isCurrentUser: false
  },
  { 
    id: 8, 
    name: "Emma Davis", 
    xp: 2100, 
    level: 8,
    avatar: "ED",
    badges: 1,
    streak: 5,
    rank: 8,
    change: "+2",
    category: "Marketing",
    joinDate: "2024-02-10",
    lastActive: "2 hours ago",
    achievements: ["Rising Star"],
    isCurrentUser: false
  }
];

const timeframes = [
  { key: "all", label: "All Time", icon: Trophy },
  { key: "month", label: "This Month", icon: Calendar },
  { key: "week", label: "This Week", icon: TrendingUp },
  { key: "today", label: "Today", icon: Zap }
];

const categories = [
  { key: "all", label: "All Categories", icon: Users },
  { key: "coding", label: "Coding", icon: Target },
  { key: "design", label: "Design", icon: Star },
  { key: "marketing", label: "Marketing", icon: Flame },
  { key: "data", label: "Data Science", icon: Shield }
];

const Leaderboards = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-300" />;
      case 3: return <Award className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankGradient = (rank) => {
    switch (rank) {
      case 1: return "from-yellow-400 via-orange-500 to-red-500";
      case 2: return "from-gray-300 to-gray-500";
      case 3: return "from-amber-500 to-orange-600";
      default: return "from-blue-500 via-purple-500 to-pink-500";
    }
  };

  const getChangeColor = (change) => {
    if (change.startsWith("+")) return "text-green-400";
    if (change.startsWith("-")) return "text-red-400";
    return "text-gray-400";
  };

  const filteredData = leaderboardData.filter(user => {
    const matchesCategory = selectedCategory === "all" || 
      user.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const currentUser = leaderboardData.find(user => user.isCurrentUser);
  const topThree = filteredData.slice(0, 3);
  const others = filteredData.slice(3);

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
            <h1 className="text-4xl font-bold text-white">Leaderboards</h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Compete with fellow learners and climb the ranks to become the ultimate champion
          </p>
        </div>

        {/* Current User Stats */}
        {currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                  {currentUser.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{currentUser.name}</h3>
                  <p className="text-gray-300">Your Current Rank: #{currentUser.rank}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{currentUser.xp.toLocaleString()} XP</p>
                <p className="text-gray-300">Level {currentUser.level}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 transition-colors duration-300"
            />
          </div>

          {/* Timeframe Filter */}
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-1 border border-white/10">
            {timeframes.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedTimeframe(key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
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

          {/* Category Filter */}
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-1 border border-white/10">
            {categories.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === key
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

        {/* Podium - Top 3 */}
        {topThree.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">🏆 Podium</h2>
            <div className="flex justify-center items-end gap-4">
              {topThree.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className={`relative cursor-pointer ${
                    index === 0 ? "order-2" : index === 1 ? "order-1" : "order-3"
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className={`bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 transition-all duration-300 hover:border-white/20 ${
                    index === 0 ? "w-48 h-64" : "w-40 h-56"
                  }`}>
                    {/* Rank Badge */}
                    <div className="flex justify-center mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankGradient(user.rank)} flex items-center justify-center shadow-lg`}>
                        {getRankIcon(user.rank)}
                      </div>
                    </div>

                    {/* Avatar */}
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                        {user.avatar}
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-white mb-1">{user.name}</h3>
                      <p className="text-sm text-gray-300 mb-2">{user.xp.toLocaleString()} XP</p>
                      <p className="text-xs text-gray-400">Level {user.level}</p>
                    </div>

                    {/* Change Indicator */}
                    <div className="absolute top-2 right-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full bg-black/30 ${getChangeColor(user.change)}`}>
                        {user.change}
              </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-400" />
              Full Leaderboard
            </h2>
          </div>
          
          <div className="divide-y divide-white/10">
            {others.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className={`p-4 cursor-pointer transition-all duration-300 hover:bg-white/5 ${
                  user.isCurrentUser ? "bg-blue-500/10 border-l-4 border-blue-500" : ""
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(user.rank)}
                    </div>

                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {user.avatar}
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-semibold">{user.name}</h3>
                        {user.isCurrentUser && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <span>Level {user.level}</span>
                        <span>•</span>
                        <span>{user.badges} badges</span>
                        <span>•</span>
                        <span>{user.streak} day streak</span>
                      </div>
                    </div>
                  </div>

                  {/* XP and Change */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{user.xp.toLocaleString()} XP</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getChangeColor(user.change)}`}>
                        {user.change}
                      </span>
                      <span className="text-xs text-gray-400">{user.lastActive}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* User Detail Modal */}
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6">
                  {selectedUser.avatar}
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">{selectedUser.name}</h2>
                <p className="text-gray-300 mb-6">Rank #{selectedUser.rank}</p>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-black/20 rounded-lg p-4">
                    <p className="text-2xl font-bold text-white">{selectedUser.xp.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">Total XP</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <p className="text-2xl font-bold text-white">{selectedUser.level}</p>
                    <p className="text-xs text-gray-400">Level</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <p className="text-2xl font-bold text-white">{selectedUser.badges}</p>
                    <p className="text-xs text-gray-400">Badges</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-4">
                    <p className="text-2xl font-bold text-white">{selectedUser.streak}</p>
                    <p className="text-xs text-gray-400">Day Streak</p>
                  </div>
                </div>

                {/* Achievements */}
                {selectedUser.achievements.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Recent Achievements</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {selectedUser.achievements.map((achievement, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-sm rounded-full border border-blue-500/30"
                        >
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setSelectedUser(null)}
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

export default Leaderboards;
