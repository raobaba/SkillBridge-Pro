import React, { useState, useEffect, useMemo } from "react";
import { Crown, Trophy, Medal, Award, Star, TrendingUp, Users, Calendar, Filter, Search, Zap, Target, Flame, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getLeaderboard, getProjectOwnerLeaderboard } from "../slice/gamificationSlice";
import { CircularLoader } from "../../../components";

const Leaderboards = ({ role = "developers", compact = false }) => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Get leaderboard data from Redux
  const gamificationState = useSelector((state) => state.gamification || {});
  const leaderboardDataFromApi = role === "developers" 
    ? (gamificationState.leaderboard || [])
    : (gamificationState.projectOwnerLeaderboard || []);
  const leaderboardLoading = role === "developers"
    ? (gamificationState.leaderboardLoading || false)
    : (gamificationState.projectOwnerLeaderboardLoading || false);
  const currentUser = useSelector((state) => state.user?.user);

  // Fetch leaderboard data on component mount
  useEffect(() => {
    if (role === "developers") {
      if (leaderboardDataFromApi.length === 0 && !leaderboardLoading) {
        dispatch(getLeaderboard(50)); // Fetch top 50
      }
    } else {
      if (leaderboardDataFromApi.length === 0 && !leaderboardLoading) {
        dispatch(getProjectOwnerLeaderboard(50)); // Fetch top 50
      }
    }
  }, [dispatch, role, leaderboardDataFromApi.length, leaderboardLoading]);

  // Transform API data to match component format
  const leaderboardData = useMemo(() => {
    if (!Array.isArray(leaderboardDataFromApi) || leaderboardDataFromApi.length === 0) {
      return [];
    }

    return leaderboardDataFromApi.map((item, index) => {
      // Determine if this is the current user
      const isCurrentUser = currentUser && (
        item.userId === currentUser.id || 
        item.id === currentUser.id ||
        item.email === currentUser.email
      );

      // Get initials for avatar
      const name = item.name || item.userName || item.email || "User";
      const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

      // Calculate rank change (if available from API)
      const change = item.rankChange 
        ? (item.rankChange > 0 ? `+${item.rankChange}` : `${item.rankChange}`)
        : (index === 0 ? "+0" : "+0");

      // Get category from skills or default
      const category = item.category || item.primarySkill || "Coding";

      // Get achievements array
      const achievements = item.achievements || item.badges || [];

      return {
        id: item.id || item.userId || index,
        name: name,
        xp: item.xp || item.totalXP || 0,
        level: item.level || 1,
        avatar: initials,
        badges: item.badgesCount || item.badges?.length || 0,
        streak: item.streak || item.currentStreak || 0,
        rank: item.rank || index + 1,
        change: change,
        category: category,
        joinDate: item.joinDate || item.createdAt || "2023-01-01",
        lastActive: item.lastActive || "Recently",
        achievements: achievements,
        isCurrentUser: isCurrentUser,
      };
    });
  }, [leaderboardDataFromApi, currentUser]);

  const categories = [
    { key: "all", label: "All", icon: Users },
    { key: "coding", label: "Coding", icon: Zap },
    { key: "design", label: "Design", icon: Award },
    { key: "marketing", label: "Marketing", icon: TrendingUp },
    { key: "data-science", label: "Data Science", icon: Target },
    { key: "product", label: "Product", icon: Shield }
  ];

  const filteredData = useMemo(() => {
    return leaderboardData.filter(item => {
      const matchesCategory = selectedCategory === "all" || item.category.toLowerCase() === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [leaderboardData, selectedCategory, searchTerm]);

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
    if (leaderboardLoading) {
      return (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-3">Top {role === "developers" ? "Developers" : "Project Owners"}</h3>
          <div className="flex justify-center py-4">
            <CircularLoader />
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <h3 className="text-lg font-bold text-white mb-3">Top {role === "developers" ? "Developers" : "Project Owners"}</h3>
        {filteredData.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No leaderboard data available</p>
        ) : (
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
        )}
      </div>
    );
  }

  if (leaderboardLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex justify-center py-12">
          <CircularLoader />
        </div>
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-2xl font-bold text-white mb-1">Leaderboard</h3>
        <p className="text-gray-300 mb-6">Top {role === "developers" ? "Developers" : "Project Owners"}</p>
        <p className="text-gray-400 text-center py-8">No leaderboard data available</p>
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