import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import Button from '../../../components/Button';
import { CircularLoader as Loader } from '../../../components';
import { toast } from 'react-toastify';
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, Eye, 
  Users, BarChart3, TrendingUp, Filter, Search, 
  Crown, Award, Star, MessageSquare, ThumbsUp,
  Settings, Trash2, RefreshCw, Download, Upload
} from "lucide-react";
import {
  getFlaggedReviews,
  moderateReview,
  getPendingVerifications,
  verifyItem,
  getProjectOwnerLeaderboard,
  getAdminGamificationStats,
  getLeaderboard,
} from "../slice/gamificationSlice";

const AdminDashboard = ({ user }) => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("moderation");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Redux state
  const gamificationState = useSelector((state) => state.gamification) || {};
  const {
    flaggedReviews: flaggedReviewsFromRedux,
    pendingVerifications: pendingVerificationsFromRedux,
    projectOwnerLeaderboard,
    adminGamificationStats,
    leaderboard: developerLeaderboard,
    flaggedReviewsLoading,
    pendingVerificationsLoading,
    projectOwnerLeaderboardLoading,
    adminGamificationStatsLoading,
    leaderboardLoading,
    moderatingReview,
    verifyingItem,
    error,
  } = gamificationState;

  const tabs = [
    { id: "moderation", label: "Moderation", icon: Shield },
    { id: "verification", label: "Verification", icon: CheckCircle },
    { id: "leaderboards", label: "Leaderboards", icon: Crown },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  // Load data on mount and tab changes
  useEffect(() => {
    if (user?.role === 'admin' || user?.roles?.includes('admin')) {
      if (selectedTab === 'moderation') {
        dispatch(getFlaggedReviews(filterStatus));
      }
      if (selectedTab === 'verification') {
        dispatch(getPendingVerifications());
      }
      if (selectedTab === 'leaderboards') {
        dispatch(getLeaderboard(10));
        dispatch(getProjectOwnerLeaderboard(10));
      }
      if (selectedTab === 'analytics') {
        dispatch(getAdminGamificationStats());
      }
    }
  }, [dispatch, user?.role, user?.roles, selectedTab, filterStatus]);

  // Use Redux state with useMemo for safe array handling
  const flaggedReviews = useMemo(() => {
    return Array.isArray(flaggedReviewsFromRedux) ? flaggedReviewsFromRedux : [];
  }, [flaggedReviewsFromRedux]);

  const pendingVerifications = useMemo(() => {
    return Array.isArray(pendingVerificationsFromRedux) ? pendingVerificationsFromRedux : [];
  }, [pendingVerificationsFromRedux]);

  const developerLeaderboardData = useMemo(() => {
    return Array.isArray(developerLeaderboard) ? developerLeaderboard : [];
  }, [developerLeaderboard]);

  const projectOwnerLeaderboardData = useMemo(() => {
    return Array.isArray(projectOwnerLeaderboard) ? projectOwnerLeaderboard : [];
  }, [projectOwnerLeaderboard]);

  // System stats from API
  const systemStats = useMemo(() => {
    const stats = adminGamificationStats || {};
    return {
      totalUsers: stats.totalUsers || 0,
      totalReviews: stats.totalReviews || 0,
      flaggedReviews: stats.flaggedReviews || 0,
      pendingVerifications: stats.pendingVerifications || 0,
      averageRating: stats.averageRating || 0,
      totalEndorsements: stats.totalEndorsements || 0,
      activeProjects: stats.activeProjects || 0,
      completedProjects: stats.completedProjects || 0,
    };
  }, [adminGamificationStats]);

  // Rating distribution from API
  const ratingDistribution = useMemo(() => {
    const stats = adminGamificationStats || {};
    return stats.ratingDistribution || {};
  }, [adminGamificationStats]);

  // Monthly growth from API
  const monthlyGrowth = useMemo(() => {
    const stats = adminGamificationStats || {};
    return stats.monthlyGrowth || 0;
  }, [adminGamificationStats]);

  // Show error toasts
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleModerateReview = async (reviewId, action) => {
    try {
      await dispatch(moderateReview({ reviewId, action })).unwrap();
      toast.success(`Review ${action} successfully`);
      // Refresh flagged reviews
      dispatch(getFlaggedReviews(filterStatus));
    } catch (error) {
      toast.error(error?.message || "Failed to moderate review");
    }
  };

  const handleVerifyItem = async (itemId, action) => {
    try {
      await dispatch(verifyItem({ itemId, action })).unwrap();
      toast.success(`Item ${action} successfully`);
      // Refresh pending verifications
      dispatch(getPendingVerifications());
    } catch (error) {
      toast.error(error?.message || "Failed to verify item");
    }
  };

  const renderModerationTab = () => {
    if (flaggedReviewsLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      );
    }

    return (
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
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            {flaggedReviews.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No flagged reviews at this time.</p>
              </div>
            ) : (
              flaggedReviews.map((review, index) => (
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
                  Evidence: {Array.isArray(review.evidence) ? review.evidence.join(", ") : (review.evidence || "No evidence")}
                </div>
              </div>
              
              {review.status === "pending" && (
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleModerateReview(review.id, "approved")}
                    disabled={moderatingReview}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleModerateReview(review.id, "rejected")}
                    disabled={moderatingReview}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4 inline mr-1" />
                    Reject
                  </Button>
                  <Button 
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    Investigate
                  </Button>
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
              ))
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderVerificationTab = () => {
    if (pendingVerificationsLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-bold text-white mb-4">Pending Verifications</h3>
          <div className="space-y-4">
            {pendingVerifications.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No pending verifications at this time.</p>
              </div>
            ) : (
              pendingVerifications.map((item, index) => (
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
                  <Button
                    onClick={() => handleVerifyItem(item.id, "verified")}
                    disabled={verifyingItem}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Verify
                  </Button>
                  <Button
                    onClick={() => handleVerifyItem(item.id, "rejected")}
                    disabled={verifyingItem}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4 inline mr-1" />
                    Reject
                  </Button>
                  <Button 
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    Review
                  </Button>
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
              ))
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderLeaderboardsTab = () => {
    if (leaderboardLoading || projectOwnerLeaderboardLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      );
    }

    return (
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
              <Button 
                onClick={() => dispatch(getLeaderboard(10))}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4 inline mr-1" />
                Refresh
              </Button>
              <Button 
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
              >
                <Download className="w-4 h-4 inline mr-1" />
                Export
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            {developerLeaderboardData.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No leaderboard data available.</p>
              </div>
            ) : (
              developerLeaderboardData.map((developer, index) => (
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
                <div className="font-bold text-white">{(developer.xp || 0).toLocaleString()} XP</div>
                <div className="text-sm text-gray-300">Level {developer.level || 1}</div>
              </div>
            </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Project Owner Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Project Owner Leaderboard</h3>
            <Button 
              onClick={() => dispatch(getProjectOwnerLeaderboard(10))}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4 inline mr-1" />
              Refresh
            </Button>
          </div>
          <div className="space-y-3">
            {projectOwnerLeaderboardData.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No project owner leaderboard data available.</p>
              </div>
            ) : (
              projectOwnerLeaderboardData.map((owner, index) => (
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
              ))
            )}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderAnalyticsTab = () => {
    if (adminGamificationStatsLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      );
    }

    // Calculate total reviews for percentage calculation
    const totalReviewsForDistribution = Object.values(ratingDistribution).reduce((sum, count) => sum + count, 0);

    return (
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
              {[5, 4, 3, 2, 1].map(rating => {
                const count = ratingDistribution[rating] || 0;
                const percentage = totalReviewsForDistribution > 0 
                  ? (count / totalReviewsForDistribution) * 100 
                  : 0;
                return (
                  <div key={rating} className="flex items-center space-x-3">
                    <span className="text-white w-8">{rating}★</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-300 text-sm">{count}</span>
                  </div>
                );
              })}
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
              <div className="text-4xl font-bold text-white mb-2">
                {monthlyGrowth > 0 ? '+' : ''}{monthlyGrowth}%
              </div>
              <div className="text-gray-300">This Month</div>
              <div className={`text-sm mt-2 ${monthlyGrowth > 0 ? 'text-green-400' : monthlyGrowth < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                <TrendingUp className="w-4 h-4 inline mr-1" />
                {monthlyGrowth > 0 ? 'Growing steadily' : monthlyGrowth < 0 ? 'Declining' : 'No change'}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

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
            <Button 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Enable
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white">Require verification for endorsements</h4>
              <p className="text-sm text-gray-300">All endorsements must be verified before appearing publicly</p>
            </div>
            <Button 
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Enabled
            </Button>
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
            <Button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              variant="ghost"
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                selectedTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </Button>
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
