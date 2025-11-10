import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { 
  Zap, Trophy, Star, Target, Flame, Shield, Award, Crown, 
  TrendingUp, Calendar, Clock, CheckCircle, Users, Eye,
  MessageSquare, ThumbsUp, Award as AwardIcon, BarChart3
} from "lucide-react";
import {
  getDeveloperStats,
  getDeveloperReviews,
  getDeveloperEndorsements,
  getLeaderboard,
  getDeveloperAchievements,
} from "../slice/gamificationSlice";
import { CircularLoader as Loader } from "../../../components";

// Icon mapping for achievements
const iconMap = {
  Star,
  Flame,
  Target,
  Zap,
  Award,
  ThumbsUp,
};

const DeveloperDashboard = ({ user }) => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("overview");

  // Redux state
  const gamificationState = useSelector((state) => state.gamification) || {};
  const { 
    stats: userStats = null, 
    reviews: recentReviews = [], 
    endorsements: recentEndorsements = [],
    leaderboard = [],
    achievements: achievementsData = [],
    statsLoading,
    reviewsLoading,
    endorsementsLoading,
    leaderboardLoading,
    achievementsLoading,
  } = gamificationState;

  // Default stats if not loaded
  const defaultStats = {
    xp: 0,
    level: 1,
    totalXP: 0,
    weeklyXP: 0,
    dailyXP: 0,
    streak: 0,
    reputation: 0,
    badges: 0,
    achievements: 0,
    endorsements: 0,
    completedProjects: 0,
    averageRating: 0,
    totalRatings: 0,
  };

  // Extract data from API response structure
  // Redux slice already extracts data from API response
  const stats = useMemo(() => {
    if (!userStats || typeof userStats !== 'object') return defaultStats;
    return {
      xp: userStats.xp || 0,
      level: userStats.level || 1,
      totalXP: userStats.totalXP || userStats.xp || 0,
      weeklyXP: userStats.weeklyXP || 0,
      dailyXP: userStats.dailyXP || 0,
      streak: userStats.streak || 0,
      reputation: userStats.reputation || 0,
      badges: userStats.badges || 0,
      achievements: userStats.achievements || 0,
      endorsements: userStats.endorsements || 0,
      completedProjects: userStats.completedProjects || 0,
      averageRating: userStats.averageRating || 0,
      totalRatings: userStats.totalRatings || 0,
    };
  }, [userStats]);

  // Ensure all data is always an array to prevent map errors
  // Redux slice already extracts data from API response
  const safeAchievementsData = useMemo(() => {
    return Array.isArray(achievementsData) ? achievementsData : [];
  }, [achievementsData]);

  const safeRecentReviews = useMemo(() => {
    return Array.isArray(recentReviews) ? recentReviews : [];
  }, [recentReviews]);

  const safeRecentEndorsements = useMemo(() => {
    return Array.isArray(recentEndorsements) ? recentEndorsements : [];
  }, [recentEndorsements]);

  const safeLeaderboard = useMemo(() => {
    return Array.isArray(leaderboard) ? leaderboard : [];
  }, [leaderboard]);

  // Generate recent activity from actual data
  const recentActivity = useMemo(() => {
    const activities = [];
    
    // Add recent reviews
    safeRecentReviews.slice(0, 2).forEach((review) => {
      activities.push({
        id: `review-${review.id}`,
        type: 'review',
        icon: Star,
        iconColor: 'text-yellow-400',
        message: `Received ${review.rating}-star review for "${review.projectName || 'project'}"`,
        time: review.date ? new Date(review.date).toLocaleDateString() : 'Recently',
      });
    });

    // Add recent endorsements
    safeRecentEndorsements.slice(0, 2).forEach((endorsement) => {
      activities.push({
        id: `endorsement-${endorsement.id}`,
        type: 'endorsement',
        icon: ThumbsUp,
        iconColor: 'text-blue-400',
        message: `Received endorsement for ${endorsement.skill || 'skills'}`,
        time: endorsement.date ? new Date(endorsement.date).toLocaleDateString() : 'Recently',
      });
    });

    // Add achievements
    safeAchievementsData.filter(a => a.unlocked).slice(0, 2).forEach((achievement) => {
      activities.push({
        id: `achievement-${achievement.id}`,
        type: 'achievement',
        icon: Trophy,
        iconColor: 'text-green-400',
        message: `Achieved "${achievement.name}" badge (+${achievement.xp} XP)`,
        time: 'Recently',
      });
    });

    // Sort by time (most recent first) and limit to 3
    return activities.slice(0, 3);
  }, [safeRecentReviews, safeRecentEndorsements, safeAchievementsData]);

  // Fetch data on component mount
  useEffect(() => {
    if (user?.id || user?.userId) {
      dispatch(getDeveloperStats());
      dispatch(getDeveloperReviews(10));
      dispatch(getDeveloperEndorsements(10));
      dispatch(getDeveloperAchievements());
    }
  }, [dispatch, user?.id, user?.userId]);

  // Fetch leaderboard when leaderboard tab is selected
  useEffect(() => {
    if (selectedTab === "leaderboard") {
      dispatch(getLeaderboard(10));
    }
  }, [selectedTab, dispatch]);

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "reviews", label: "Reviews", icon: MessageSquare },
    { id: "endorsements", label: "Endorsements", icon: ThumbsUp },
    { id: "leaderboard", label: "Leaderboard", icon: Crown }
  ];

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

  const progress = stats.xp && stats.level 
    ? Math.min((stats.xp / (stats.level * 1000)) * 100, 100) 
    : 0;
  const xpToNext = stats.level && stats.xp 
    ? (stats.level * 1000) - stats.xp 
    : 0;

  // Map achievements from API to include icon components
  const achievements = safeAchievementsData.map((achievement) => ({
    ...achievement,
    icon: iconMap[achievement.icon] || Star,
  }));

  const renderOverview = () => {
    if (statsLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader />
        </div>
      );
    }

    return (
      <div className="space-y-6">
      {/* XP Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">XP Progress</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{(stats.xp || 0).toLocaleString()} XP</div>
            <div className="text-sm text-gray-300">Level {stats.level || 1}</div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>{getLevelTitle(stats.level || 1)}</span>
            <span>{(xpToNext || 0).toLocaleString()} XP to next level</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full bg-gradient-to-r ${getLevelColor(stats.level || 1)}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-lg font-bold text-white">{stats.dailyXP || 0}</div>
            <div className="text-xs text-gray-300">Daily XP</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-lg font-bold text-white">{stats.weeklyXP || 0}</div>
            <div className="text-xs text-gray-300">Weekly XP</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-lg font-bold text-white">{stats.streak || 0}</div>
            <div className="text-xs text-gray-300">Day Streak</div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center"
        >
          <div className="text-2xl font-bold text-white">{stats.reputation || 0}</div>
          <div className="text-sm text-gray-300">Reputation</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center"
        >
          <div className="text-2xl font-bold text-white">{stats.badges || 0}</div>
          <div className="text-sm text-gray-300">Badges</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center"
        >
          <div className="text-2xl font-bold text-white">{stats.completedProjects || 0}</div>
          <div className="text-sm text-gray-300">Projects</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center"
        >
          <div className="text-2xl font-bold text-white">{stats.averageRating || 0}</div>
          <div className="text-sm text-gray-300">Avg Rating</div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-400 text-sm">No recent activity</p>
            <p className="text-gray-500 text-xs mt-1">Complete projects to see activity here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div key={activity.id} className="flex items-center space-x-3 text-sm">
                  <IconComponent className={`w-4 h-4 ${activity.iconColor}`} />
                  <span className="text-gray-300">{activity.message}</span>
                  <span className="text-gray-500 text-xs ml-auto">{activity.time}</span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
      </div>
    );
  };

  const renderAchievements = () => {
    if (achievementsLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader />
        </div>
      );
    }

    return (
      <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 ${
              achievement.unlocked ? 'ring-2 ring-green-400' : 'opacity-60'
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <achievement.icon className={`w-6 h-6 ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-500'}`} />
              <h4 className="font-bold text-white">{achievement.name}</h4>
            </div>
            <p className="text-sm text-gray-300 mb-3">{achievement.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">+{achievement.xp} XP</span>
              {achievement.unlocked && (
                <CheckCircle className="w-4 h-4 text-green-400" />
              )}
            </div>
          </motion.div>
        ))}
        </div>
      </div>
    );
  };

  const renderReviews = () => {
    if (reviewsLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader />
        </div>
      );
    }

    if (safeRecentReviews.length === 0) {
      return (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-300 text-lg">No reviews yet</p>
          <p className="text-gray-500 text-sm mt-2">Complete projects to receive reviews</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {safeRecentReviews.map((review, index) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-bold text-white">{review.projectName}</h4>
              <p className="text-sm text-gray-300">by {review.reviewer}</p>
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-500'}`}
                />
              ))}
            </div>
          </div>
          
          <p className="text-gray-300 mb-4">{review.review}</p>
          
          <div className="grid grid-cols-5 gap-2 text-xs">
            {Object.entries(review.categories).map(([category, rating]) => (
              <div key={category} className="text-center">
                <div className="text-gray-400 capitalize">{category}</div>
                <div className="font-bold text-white">{rating}</div>
              </div>
            ))}
          </div>
          
          <div className="text-xs text-gray-400 mt-3">
            {review.date ? new Date(review.date).toLocaleDateString() : 'Recently'}
          </div>
          {/* Categories rating - if available from API */}
          {review.categories && (
            <div className="grid grid-cols-5 gap-2 text-xs mt-3">
              {Object.entries(review.categories).map(([category, rating]) => (
                <div key={category} className="text-center">
                  <div className="text-gray-400 capitalize">{category}</div>
                  <div className="font-bold text-white">{rating}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      ))}
      </div>
    );
  };

  const renderEndorsements = () => {
    if (endorsementsLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader />
        </div>
      );
    }

    if (safeRecentEndorsements.length === 0) {
      return (
        <div className="text-center py-12">
          <ThumbsUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-300 text-lg">No endorsements yet</p>
          <p className="text-gray-500 text-sm mt-2">Build your reputation to receive endorsements</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {safeRecentEndorsements.map((endorsement, index) => (
        <motion.div
          key={endorsement.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-bold text-white">{endorsement.skill}</h4>
              <p className="text-sm text-gray-300">endorsed by {endorsement.endorser}</p>
            </div>
            <ThumbsUp className="w-6 h-6 text-blue-400" />
          </div>
          
          <p className="text-gray-300 mb-4">{endorsement.message}</p>
          
          <div className="text-xs text-gray-400">
            {endorsement.date ? new Date(endorsement.date).toLocaleDateString() : 'Recently'}
          </div>
        </motion.div>
      ))}
      </div>
    );
  };

  const renderLeaderboard = () => {
    if (leaderboardLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader />
        </div>
      );
    }

    const currentUserId = user?.id || user?.userId;
    const leaderboardData = safeLeaderboard.map((developer, index) => ({
      rank: index + 1,
      name: developer.name,
      xp: developer.xp || 0,
      level: developer.level || 1,
      isCurrentUser: developer.id === currentUserId,
    }));

    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-bold text-white mb-4">Developer Leaderboard</h3>
          <div className="space-y-3">
            {leaderboardData.length === 0 ? (
              <div className="text-center py-8">
                <Crown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300">No leaderboard data available</p>
              </div>
            ) : (
              leaderboardData.map((developer, index) => (
            <div
              key={developer.rank}
              className={`flex items-center justify-between p-3 rounded-lg ${
                developer.isCurrentUser ? 'bg-blue-500/20 border border-blue-400' : 'bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="text-lg font-bold text-white">#{developer.rank}</div>
                <div>
                  <div className="font-bold text-white">{developer.name}</div>
                  <div className="text-sm text-gray-300">Level {developer.level}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white">{developer.xp.toLocaleString()} XP</div>
                <div className="text-sm text-gray-300">Reputation</div>
              </div>
            </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "overview": return renderOverview();
      case "achievements": return renderAchievements();
      case "reviews": return renderReviews();
      case "endorsements": return renderEndorsements();
      case "leaderboard": return renderLeaderboard();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Developer Dashboard</h1>
          <p className="text-gray-300">Track your progress, achievements, and reputation</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex space-x-1 mb-6 bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                selectedTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
