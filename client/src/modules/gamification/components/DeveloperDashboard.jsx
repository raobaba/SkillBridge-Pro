import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Zap, Trophy, Star, Target, Flame, Shield, Award, Crown, 
  TrendingUp, Calendar, Clock, CheckCircle, Users, Eye,
  MessageSquare, ThumbsUp, Award as AwardIcon, BarChart3
} from "lucide-react";

const DeveloperDashboard = ({ user }) => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [userStats, setUserStats] = useState({
    xp: 2800,
    level: 12,
    totalXP: 15600,
    weeklyXP: 450,
    dailyXP: 85,
    streak: 7,
    reputation: 85,
    badges: 8,
    achievements: 15,
    endorsements: 12,
    completedProjects: 8,
    averageRating: 4.6,
    totalRatings: 24
  });

  const [recentReviews] = useState([
    {
      id: 1,
      projectName: "E-commerce Platform",
      rating: 5,
      review: "Excellent work! Clean code and great communication.",
      reviewer: "Sarah Wilson",
      date: "2024-01-15",
      categories: { technical: 5, communication: 5, timeliness: 4, quality: 5, collaboration: 5 }
    },
    {
      id: 2,
      projectName: "Mobile App Development",
      rating: 4,
      review: "Good technical skills, delivered on time.",
      reviewer: "Mike Johnson",
      date: "2024-01-10",
      categories: { technical: 4, communication: 4, timeliness: 5, quality: 4, collaboration: 4 }
    }
  ]);

  const [recentEndorsements] = useState([
    {
      id: 1,
      skill: "React.js",
      message: "Excellent React developer with deep understanding of hooks and state management.",
      endorser: "Alice Johnson",
      date: "2024-01-12"
    },
    {
      id: 2,
      skill: "Node.js",
      message: "Great backend developer, very reliable and knowledgeable.",
      endorser: "David Chen",
      date: "2024-01-08"
    }
  ]);

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

  const progress = Math.min((userStats.xp / (userStats.level * 1000)) * 100, 100);
  const xpToNext = (userStats.level * 1000) - userStats.xp;

  const achievements = [
    { id: 1, name: "First Project", description: "Complete your first project", icon: Star, unlocked: true, xp: 100 },
    { id: 2, name: "Streak Master", description: "Maintain a 7-day streak", icon: Flame, unlocked: userStats.streak >= 7, xp: 200 },
    { id: 3, name: "Level Up", description: "Reach level 10", icon: Target, unlocked: userStats.level >= 10, xp: 500 },
    { id: 4, name: "XP Collector", description: "Earn 10,000 total XP", icon: Zap, unlocked: userStats.totalXP >= 10000, xp: 1000 },
    { id: 5, name: "Quality Expert", description: "Maintain 4.5+ average rating", icon: Award, unlocked: userStats.averageRating >= 4.5, xp: 800 },
    { id: 6, name: "Endorsement Magnet", description: "Receive 10+ endorsements", icon: ThumbsUp, unlocked: userStats.endorsements >= 10, xp: 600 }
  ];

  const renderOverview = () => (
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
            <div className="text-2xl font-bold text-white">{userStats.xp.toLocaleString()} XP</div>
            <div className="text-sm text-gray-300">Level {userStats.level}</div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>{getLevelTitle(userStats.level)}</span>
            <span>{xpToNext.toLocaleString()} XP to next level</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full bg-gradient-to-r ${getLevelColor(userStats.level)}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-lg font-bold text-white">{userStats.dailyXP}</div>
            <div className="text-xs text-gray-300">Daily XP</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-lg font-bold text-white">{userStats.weeklyXP}</div>
            <div className="text-xs text-gray-300">Weekly XP</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-lg font-bold text-white">{userStats.streak}</div>
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
          <div className="text-2xl font-bold text-white">{userStats.reputation}</div>
          <div className="text-sm text-gray-300">Reputation</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center"
        >
          <div className="text-2xl font-bold text-white">{userStats.badges}</div>
          <div className="text-sm text-gray-300">Badges</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center"
        >
          <div className="text-2xl font-bold text-white">{userStats.completedProjects}</div>
          <div className="text-sm text-gray-300">Projects</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center"
        >
          <div className="text-2xl font-bold text-white">{userStats.averageRating}</div>
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
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">Completed project "E-commerce Platform" (+200 XP)</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <ThumbsUp className="w-4 h-4 text-blue-400" />
            <span className="text-gray-300">Received endorsement for React.js</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-300">Achieved "Quality Expert" badge</span>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderAchievements = () => (
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

  const renderReviews = () => (
    <div className="space-y-6">
      {recentReviews.map((review, index) => (
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
          
          <div className="text-xs text-gray-400 mt-3">{review.date}</div>
        </motion.div>
      ))}
    </div>
  );

  const renderEndorsements = () => (
    <div className="space-y-6">
      {recentEndorsements.map((endorsement, index) => (
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
          
          <div className="text-xs text-gray-400">{endorsement.date}</div>
        </motion.div>
      ))}
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">Developer Leaderboard</h3>
        <div className="space-y-3">
          {[
            { rank: 1, name: "Alice Johnson", xp: 4200, level: 15, isCurrentUser: false },
            { rank: 2, name: user?.name || "You", xp: userStats.xp, level: userStats.level, isCurrentUser: true },
            { rank: 3, name: "John Smith", xp: 3500, level: 13, isCurrentUser: false }
          ].map((developer, index) => (
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
          ))}
        </div>
      </motion.div>
    </div>
  );

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
