import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, Eye, 
  Users, BarChart3, TrendingUp, Filter, Search, 
  Crown, Award, Star, MessageSquare, ThumbsUp,
  Settings, Trash2, RefreshCw, Download, Upload
} from "lucide-react";

const AdminDashboard = ({ user }) => {
  const [selectedTab, setSelectedTab] = useState("moderation");
  const [flaggedReviews, setFlaggedReviews] = useState([
    {
      id: 1,
      projectName: "E-commerce Platform",
      developer: "Alice Johnson",
      reviewer: "Mike Smith",
      rating: 5,
      review: "This is clearly fake! No way this developer is that good.",
      flagReason: "Suspicious rating pattern",
      flaggedBy: "System",
      flaggedDate: "2024-01-15",
      status: "pending",
      evidence: ["Multiple 5-star ratings in short time", "Similar review patterns"]
    },
    {
      id: 2,
      projectName: "Mobile App",
      developer: "John Doe",
      reviewer: "Anonymous User",
      rating: 1,
      review: "Terrible developer, waste of time.",
      flagReason: "Inappropriate language",
      flaggedBy: "User Report",
      flaggedDate: "2024-01-14",
      status: "pending",
      evidence: ["Contains inappropriate language", "Unconstructive feedback"]
    }
  ]);

  const [pendingVerifications, setPendingVerifications] = useState([
    {
      id: 1,
      type: "endorsement",
      developer: "Sarah Wilson",
      endorser: "David Chen",
      skill: "React.js",
      message: "Excellent React developer with deep understanding of hooks and state management.",
      submittedDate: "2024-01-15",
      status: "pending"
    },
    {
      id: 2,
      type: "achievement",
      developer: "Mike Johnson",
      achievement: "Level 20 Master",
      description: "Reached level 20 with exceptional performance",
      submittedDate: "2024-01-14",
      status: "pending"
    }
  ]);

  const [systemStats, setSystemStats] = useState({
    totalUsers: 1250,
    totalReviews: 3450,
    flaggedReviews: 23,
    pendingVerifications: 15,
    averageRating: 4.2,
    totalEndorsements: 890,
    activeProjects: 156,
    completedProjects: 2340
  });

  const [leaderboardData, setLeaderboardData] = useState({
    developers: [
      { rank: 1, name: "Alice Johnson", xp: 4200, level: 15, reputation: 95, verified: true },
      { rank: 2, name: "Mike Chen", xp: 3800, level: 14, reputation: 88, verified: true },
      { rank: 3, name: "Sarah Wilson", xp: 3500, level: 13, reputation: 85, verified: false }
    ],
    projectOwners: [
      { rank: 1, name: "David Lee", evaluations: 45, averageRating: 4.5, verified: true },
      { rank: 2, name: "Lisa Park", evaluations: 38, averageRating: 4.3, verified: true },
      { rank: 3, name: "Tom Brown", evaluations: 32, averageRating: 4.1, verified: false }
    ]
  });

  const tabs = [
    { id: "moderation", label: "Moderation", icon: Shield },
    { id: "verification", label: "Verification", icon: CheckCircle },
    { id: "leaderboards", label: "Leaderboards", icon: Crown },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const handleModerateReview = (reviewId, action) => {
    setFlaggedReviews(prev => 
      prev.map(review => 
        review.id === reviewId 
          ? { ...review, status: action }
          : review
      )
    );
  };

  const handleVerifyItem = (itemId, action) => {
    setPendingVerifications(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, status: action }
          : item
      )
    );
  };

  const renderModerationTab = () => (
    <div className="space-y-6">
      {/* Flagged Reviews */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Flagged Reviews</h3>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm">
              <option>All</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          {flaggedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-white">{review.projectName}</h4>
                  <p className="text-sm text-gray-300">
                    Developer: {review.developer} | Reviewer: {review.reviewer}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-500'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Flagged by: {review.flaggedBy}</div>
                  <div className="text-xs text-gray-500">{review.flaggedDate}</div>
                </div>
              </div>
              
              <div className="mb-3">
                <p className="text-gray-300">{review.review}</p>
              </div>
              
              <div className="mb-3">
                <div className="text-sm font-medium text-red-400 mb-1">Flag Reason: {review.flagReason}</div>
                <div className="text-xs text-gray-400">
                  Evidence: {review.evidence.join(", ")}
                </div>
              </div>
              
              {review.status === "pending" && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleModerateReview(review.id, "approved")}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleModerateReview(review.id, "rejected")}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    <XCircle className="w-4 h-4 inline mr-1" />
                    Reject
                  </button>
                  <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">
                    <Eye className="w-4 h-4 inline mr-1" />
                    Investigate
                  </button>
                </div>
              )}
              
              {review.status !== "pending" && (
                <div className={`text-sm font-medium ${
                  review.status === "approved" ? "text-green-400" : "text-red-400"
                }`}>
                  Status: {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderVerificationTab = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">Pending Verifications</h3>
        <div className="space-y-4">
          {pendingVerifications.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-white">
                    {item.type === "endorsement" ? "Skill Endorsement" : "Achievement"}
                  </h4>
                  <p className="text-sm text-gray-300">
                    {item.type === "endorsement" ? `Developer: ${item.developer}` : `Developer: ${item.developer}`}
                  </p>
                  {item.type === "endorsement" && (
                    <p className="text-sm text-gray-300">Endorser: {item.endorser}</p>
                  )}
                </div>
                <div className="text-xs text-gray-400">{item.submittedDate}</div>
              </div>
              
              <div className="mb-3">
                {item.type === "endorsement" ? (
                  <>
                    <div className="text-sm font-medium text-white mb-1">Skill: {item.skill}</div>
                    <p className="text-gray-300">{item.message}</p>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-medium text-white mb-1">Achievement: {item.achievement}</div>
                    <p className="text-gray-300">{item.description}</p>
                  </>
                )}
              </div>
              
              {item.status === "pending" && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleVerifyItem(item.id, "verified")}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Verify
                  </button>
                  <button
                    onClick={() => handleVerifyItem(item.id, "rejected")}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    <XCircle className="w-4 h-4 inline mr-1" />
                    Reject
                  </button>
                  <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">
                    <Eye className="w-4 h-4 inline mr-1" />
                    Review
                  </button>
                </div>
              )}
              
              {item.status !== "pending" && (
                <div className={`text-sm font-medium ${
                  item.status === "verified" ? "text-green-400" : "text-red-400"
                }`}>
                  Status: {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderLeaderboardsTab = () => (
    <div className="space-y-6">
      {/* Developer Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Developer Leaderboard</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">
              <RefreshCw className="w-4 h-4 inline mr-1" />
              Refresh
            </button>
            <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">
              <Download className="w-4 h-4 inline mr-1" />
              Export
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {leaderboardData.developers.map((developer, index) => (
            <div
              key={developer.rank}
              className="flex items-center justify-between p-3 rounded-lg bg-white/5"
            >
              <div className="flex items-center space-x-3">
                <div className="text-lg font-bold text-white">#{developer.rank}</div>
                <div>
                  <div className="font-bold text-white flex items-center space-x-2">
                    {developer.name}
                    {developer.verified && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <div className="text-sm text-gray-300">Level {developer.level}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white">{developer.xp.toLocaleString()} XP</div>
                <div className="text-sm text-gray-300">Rep: {developer.reputation}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Project Owner Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">Project Owner Leaderboard</h3>
        <div className="space-y-3">
          {leaderboardData.projectOwners.map((owner, index) => (
            <div
              key={owner.rank}
              className="flex items-center justify-between p-3 rounded-lg bg-white/5"
            >
              <div className="flex items-center space-x-3">
                <div className="text-lg font-bold text-white">#{owner.rank}</div>
                <div>
                  <div className="font-bold text-white flex items-center space-x-2">
                    {owner.name}
                    {owner.verified && (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <div className="text-sm text-gray-300">{owner.evaluations} evaluations</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white">{owner.averageRating}/5</div>
                <div className="text-sm text-gray-300">Avg Rating</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* System Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center"
        >
          <div className="text-3xl font-bold text-white mb-2">{systemStats.totalUsers.toLocaleString()}</div>
          <div className="text-gray-300">Total Users</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center"
        >
          <div className="text-3xl font-bold text-white mb-2">{systemStats.totalReviews.toLocaleString()}</div>
          <div className="text-gray-300">Total Reviews</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center"
        >
          <div className="text-3xl font-bold text-white mb-2">{systemStats.flaggedReviews}</div>
          <div className="text-gray-300">Flagged Reviews</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center"
        >
          <div className="text-3xl font-bold text-white mb-2">{systemStats.averageRating}</div>
          <div className="text-gray-300">Avg Rating</div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-bold text-white mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center space-x-3">
                <span className="text-white w-8">{rating}★</span>
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${Math.random() * 100}%` }}
                  ></div>
                </div>
                <span className="text-gray-300 text-sm">{Math.floor(Math.random() * 100)}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-bold text-white mb-4">User Growth</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">+12%</div>
            <div className="text-gray-300">This Month</div>
            <div className="text-sm text-green-400 mt-2">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Growing steadily
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">System Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white">Auto-flag suspicious reviews</h4>
              <p className="text-sm text-gray-300">Automatically flag reviews that match suspicious patterns</p>
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Enable
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white">Require verification for endorsements</h4>
              <p className="text-sm text-gray-300">All endorsements must be verified before appearing publicly</p>
            </div>
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              Enabled
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white">Leaderboard refresh rate</h4>
              <p className="text-sm text-gray-300">How often to update leaderboard rankings</p>
            </div>
            <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
              <option>Every hour</option>
              <option>Every 6 hours</option>
              <option>Daily</option>
              <option>Weekly</option>
            </select>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case "moderation": return renderModerationTab();
      case "verification": return renderVerificationTab();
      case "leaderboards": return renderLeaderboardsTab();
      case "analytics": return renderAnalyticsTab();
      case "settings": return renderSettingsTab();
      default: return renderModerationTab();
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
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Moderate reviews, verify endorsements, and manage the gamification system</p>
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

export default AdminDashboard;
