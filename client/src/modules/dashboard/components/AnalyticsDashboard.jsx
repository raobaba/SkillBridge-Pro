import React, { useState, useEffect, useMemo } from "react";
import Button from '../../../components/Button';
import {
  BarChart3,
  Users,
  Briefcase,
  Target,
  DollarSign,
  Activity,
  Settings,
  ChevronRight,
  Calendar,
  Download,
  Filter,
  Eye,
  ArrowUp,
  ArrowDown,
  Clock,
  Globe,
  Zap,
  Shield,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Flag,
  Trophy,
  PieChart as PieChartIcon,
  DollarSign as DollarSignIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Eye as EyeIcon,
  Building,
  Database,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Lock,
  Unlock as UnlockIcon,
  Settings as SettingsIcon,
} from "lucide-react";
import Navbar from "../../../components/header";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAdminAnalytics } from "../slice/DashboardSlice";
import { CircularLoader } from "../../../components";

export default function AnalyticsDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("overview");
  const user = useSelector((state) => state.user.user);
  const [selectedTimeframe, setSelectedTimeframe] = useState("6m");

  // Redux selectors for admin analytics
  const adminAnalytics = useSelector((state) => state.dashboard?.adminAnalytics);
  const analyticsLoading = useSelector((state) => state.dashboard?.loading || false);
  const analyticsError = useSelector((state) => state.dashboard?.error);

  // Fetch analytics on component mount and when timeframe changes
  useEffect(() => {
    dispatch(getAdminAnalytics(selectedTimeframe));
  }, [dispatch, selectedTimeframe]);

  // Transform analytics data from API
  const stats = useMemo(() => {
    if (!adminAnalytics?.stats) {
      return {
        totalUsers: 0,
        activeDevelopers: 0,
        projectOwners: 0,
        projectsPosted: 0,
        matchRate: 0,
        avgRating: 0,
        revenue: "$0",
        monthlyGrowth: 0,
        userRetention: 0,
        systemUptime: 0,
        activeSessions: 0,
        flaggedContent: 0,
        pendingModeration: 0,
        resolvedIssues: 0,
        bannedUsers: 0,
        suspendedAccounts: 0,
      };
    }

    return {
      totalUsers: adminAnalytics.stats.totalUsers || 0,
      activeDevelopers: adminAnalytics.stats.activeDevelopers || 0,
      projectOwners: adminAnalytics.stats.projectOwners || 0,
      projectsPosted: adminAnalytics.projectStats?.totalProjects || adminAnalytics.projectStats?.projectsPosted || 0,
      matchRate: adminAnalytics.stats.matchRate || 0,
      avgRating: adminAnalytics.stats.avgRating || 0,
      revenue: adminAnalytics.stats.revenue || "$0",
      monthlyGrowth: adminAnalytics.stats.monthlyGrowth || 0,
      userRetention: adminAnalytics.stats.userRetention || 0,
      systemUptime: adminAnalytics.stats.systemUptime || 0,
      activeSessions: adminAnalytics.stats.activeSessions || 0,
      flaggedContent: adminAnalytics.stats.flaggedContent || 0,
      pendingModeration: adminAnalytics.stats.pendingModeration || 0,
      resolvedIssues: adminAnalytics.stats.resolvedIssues || 0,
      bannedUsers: adminAnalytics.stats.bannedUsers || 0,
      suspendedAccounts: adminAnalytics.stats.suspendedAccounts || 0,
    };
  }, [adminAnalytics]);

  const moderationStats = useMemo(() => {
    if (!adminAnalytics?.moderation) {
      return {
        flaggedUsers: 0,
        flaggedProjects: 0,
        flaggedMessages: 0,
        pendingReviews: 0,
        resolvedToday: 0,
        escalationRate: 0,
        avgResponseTime: "0 hours",
        moderatorActivity: 0,
      };
    }

    return {
      flaggedUsers: adminAnalytics.moderation.flaggedUsers || 0,
      flaggedProjects: adminAnalytics.moderation.flaggedProjects || 0,
      flaggedMessages: adminAnalytics.moderation.flaggedMessages || 0,
      pendingReviews: adminAnalytics.moderation.pendingReviews || 0,
      resolvedToday: adminAnalytics.moderation.resolvedToday || 0,
      escalationRate: adminAnalytics.moderation.escalationRate || 0,
      avgResponseTime: adminAnalytics.moderation.avgResponseTime || "0 hours",
      moderatorActivity: adminAnalytics.moderation.moderatorActivity || 0,
    };
  }, [adminAnalytics]);

  const systemHealth = useMemo(() => {
    if (!adminAnalytics?.systemHealth) {
      return {
        serverUptime: 0,
        responseTime: 0,
        cpuUsage: 0,
        memoryUsage: 0,
        diskUsage: 0,
        networkLatency: 0,
        errorRate: 0,
        activeConnections: 0,
      };
    }

    return {
      serverUptime: adminAnalytics.systemHealth.serverUptime || 0,
      responseTime: adminAnalytics.systemHealth.responseTime || 0,
      cpuUsage: adminAnalytics.systemHealth.cpuUsage || 0,
      memoryUsage: adminAnalytics.systemHealth.memoryUsage || 0,
      diskUsage: adminAnalytics.systemHealth.diskUsage || 0,
      networkLatency: adminAnalytics.systemHealth.networkLatency || 0,
      errorRate: adminAnalytics.systemHealth.errorRate || 0,
      activeConnections: adminAnalytics.systemHealth.activeConnections || 0,
    };
  }, [adminAnalytics]);

  // Chart data from API
  const usersByMonth = useMemo(() => {
    if (!adminAnalytics?.charts?.usersByMonth || adminAnalytics.charts.usersByMonth.length === 0) {
      return [
        { month: "Jan", count: 0 },
        { month: "Feb", count: 0 },
        { month: "Mar", count: 0 },
        { month: "Apr", count: 0 },
        { month: "May", count: 0 },
        { month: "Jun", count: 0 },
      ];
    }
    return adminAnalytics.charts.usersByMonth;
  }, [adminAnalytics]);

  const projectsByDomain = useMemo(() => {
    if (!adminAnalytics?.projectStats?.projectsByDomain || adminAnalytics.projectStats.projectsByDomain.length === 0) {
      return [
        { domain: "Web Dev", count: 0 },
        { domain: "Mobile Dev", count: 0 },
        { domain: "ML/AI", count: 0 },
        { domain: "DevOps", count: 0 },
      ];
    }
    return adminAnalytics.projectStats.projectsByDomain;
  }, [adminAnalytics]);

  const recentAlerts = [
    {
      id: 1,
      message: "Match rate dropped below 80%",
      alert: true,
      time: "2 hours ago",
      priority: "high",
      category: "performance",
    },
    {
      id: 2,
      message: "Revenue increased by 12% MoM",
      alert: false,
      time: "4 hours ago",
      priority: "low",
      category: "revenue",
    },
    {
      id: 3,
      message: "New high-value project posted today",
      alert: false,
      time: "6 hours ago",
      priority: "medium",
      category: "projects",
    },
    {
      id: 4,
      message: "User reported inappropriate content",
      alert: true,
      time: "1 hour ago",
      priority: "high",
      category: "moderation",
    },
    {
      id: 5,
      message: "System CPU usage exceeded 80%",
      alert: true,
      time: "30 min ago",
      priority: "high",
      category: "system",
    },
  ];

  const flaggedContent = [
    {
      id: 1,
      type: "user",
      reason: "Inappropriate profile content",
      reportedBy: "user_123",
      reportedAt: "2 hours ago",
      status: "pending",
      priority: "high",
      user: "John Doe",
      details: "Profile contains offensive language",
    },
    {
      id: 2,
      type: "project",
      reason: "Suspicious project description",
      reportedBy: "user_456",
      reportedAt: "4 hours ago",
      status: "under_review",
      priority: "medium",
      user: "Project Owner",
      details: "Project description seems misleading",
    },
    {
      id: 3,
      type: "message",
      reason: "Spam messages",
      reportedBy: "user_789",
      reportedAt: "6 hours ago",
      status: "resolved",
      priority: "low",
      user: "Spam User",
      details: "Multiple spam messages sent",
    },
  ];

  const systemNotifications = [
    {
      id: 1,
      type: "security",
      title: "Suspicious Login Attempt",
      message: "Multiple failed login attempts detected from IP 192.168.1.100",
      time: "1 hour ago",
      severity: "high",
    },
    {
      id: 2,
      type: "performance",
      title: "High Memory Usage",
      message: "Server memory usage reached 85% capacity",
      time: "2 hours ago",
      severity: "medium",
    },
    {
      id: 3,
      type: "user_issue",
      title: "User Account Locked",
      message: "User account locked due to multiple failed password attempts",
      time: "3 hours ago",
      severity: "low",
    },
  ];

  const topPerformers = [
    { name: "Sarah Chen", projects: 24, rating: 4.9, earnings: "$12,400" },
    { name: "Alex Rodriguez", projects: 18, rating: 4.8, earnings: "$9,800" },
    { name: "Maya Patel", projects: 15, rating: 4.7, earnings: "$8,200" },
  ];

  const recentActivity = [
    {
      action: "New user registered",
      user: "john.doe@example.com",
      time: "Just now",
      type: "user",
    },
    {
      action: "Project completed",
      project: "E-commerce App",
      time: "5 min ago",
      type: "project",
    },
    {
      action: "Developer verified",
      user: "sarah.dev@example.com",
      time: "12 min ago",
      type: "verification",
    },
    {
      action: "Content flagged for review",
      user: "moderator@example.com",
      time: "15 min ago",
      type: "moderation",
    },
    {
      action: "User account suspended",
      user: "spam.user@example.com",
      time: "30 min ago",
      type: "enforcement",
    },
  ];

  const quickAccessLinks = [
    { name: "User Management", icon: Users, color: "blue", description: "Manage users & permissions", path: "/user-management" },
    { name: "Gamification", icon: Trophy, color: "yellow", description: "Manage gamification system", path: "/gamification" },
    { name: "Content Moderation", icon: Shield, color: "red", description: "Review flagged content", path: "/moderation" },
    { name: "System Monitoring", icon: Server, color: "green", description: "Monitor system health", path: "/system-monitoring" },
    { name: "Analytics & Reports", icon: BarChart3, color: "purple", description: "View detailed analytics", path: "/analytics" },
    { name: "Platform Settings", icon: Settings, color: "orange", description: "Configure platform", path: "/settings" },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
      {/* Header */}
      <Navbar data={user} />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6'>
        {/* Enhanced Admin Header */}
        <div className='mb-6'>
          <div className="flex items-center justify-between">
            <div>
              <h1 className='text-3xl font-bold mb-2 flex items-center gap-3'>
                <Shield className='w-8 h-8 text-blue-400' />
                Admin Dashboard
              </h1>
              <p className='text-gray-300'>
                System oversight, analytics, and moderation tools
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">System Health</p>
                <p className="text-2xl font-bold text-green-400 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  {systemHealth.serverUptime}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Pending Moderation</p>
                <p className="text-2xl font-bold text-red-400 flex items-center gap-2">
                  <Flag className="w-6 h-6" />
                  {moderationStats.pendingReviews}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='flex space-x-1 bg-white/5 p-1 rounded-xl border border-white/10'>
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "users", label: "Users", icon: Users },
            { id: "projects", label: "Projects", icon: Briefcase },
            { id: "revenue", label: "Revenue", icon: DollarSign },
            { id: "moderation", label: "Moderation", icon: Shield },
            { id: "system", label: "System", icon: Server },
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant={activeTab === tab.id ? "primary" : "ghost"}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-blue-500/20 text-blue-400 border border-blue-400/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              <tab.icon className='w-4 h-4' />
              <span className='text-sm font-medium'>{tab.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Body Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10'>
        {/* Time Range Selector */}
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-2'>
            <Calendar className='w-5 h-5 text-gray-400' />
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className='bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value='1w'>Last Week</option>
              <option value='1m'>Last Month</option>
              <option value='3m'>Last 3 Months</option>
              <option value='6m'>Last 6 Months</option>
              <option value='1y'>Last Year</option>
            </select>
          </div>
          <div className='flex items-center space-x-2'>
            <Button 
              className='flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors'
            >
              <Download className='w-4 h-4' />
              <span className='text-sm'>Export</span>
            </Button>
            <Button 
              className='flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-gray-600/50 rounded-lg transition-colors'
            >
              <Filter className='w-4 h-4' />
              <span className='text-sm'>Filter</span>
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        {analyticsLoading ? (
          <div className="flex justify-center py-12">
            <CircularLoader />
          </div>
        ) : analyticsError ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <p className="text-red-400">Error loading analytics: {analyticsError}</p>
          </div>
        ) : (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
            {[
              {
                label: "Total Users",
                value: stats.totalUsers.toLocaleString(),
                icon: Users,
                color: "text-blue-400",
                bg: "bg-blue-500/20",
                change: stats.monthlyGrowth >= 0 ? `+${stats.monthlyGrowth.toFixed(1)}%` : `${stats.monthlyGrowth.toFixed(1)}%`,
                subtitle: `${stats.activeDevelopers} active`,
              },
              {
                label: "Project Owners",
                value: stats.projectOwners,
                icon: Building,
                color: "text-green-400",
                bg: "bg-green-500/20",
                change: "+0%",
                subtitle: "Active owners",
              },
              {
                label: "Projects Posted",
                value: stats.projectsPosted,
                icon: Briefcase,
                color: "text-purple-400",
                bg: "bg-purple-500/20",
                change: adminAnalytics?.projectStats?.monthlyGrowth >= 0 
                  ? `+${adminAnalytics.projectStats.monthlyGrowth.toFixed(1)}%` 
                  : `${adminAnalytics?.projectStats?.monthlyGrowth?.toFixed(1) || 0}%`,
                subtitle: "Total projects",
              },
              {
                label: "Match Rate",
                value: `${stats.matchRate}%`,
                icon: Target,
                color: "text-pink-400",
                bg: "bg-pink-500/20",
                change: "0%",
                subtitle: "Success rate",
              },
              {
                label: "Flagged Content",
                value: stats.flaggedContent,
                icon: Flag,
                color: "text-red-400",
                bg: "bg-red-500/20",
                change: "+0",
                subtitle: "Needs review",
              },
              {
                label: "Revenue",
                value: stats.revenue,
                icon: DollarSign,
                color: "text-yellow-400",
                bg: "bg-yellow-500/20",
                change: "+0%",
                subtitle: "This month",
              },
            ].map((item, idx) => (
            <div
              key={idx}
              className='group bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all hover:bg-gray-700/50 cursor-pointer'
            >
              <div className='flex items-center justify-between mb-2'>
                <div className={`p-2 rounded-lg ${item.bg}`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className='flex items-center space-x-1'>
                  {item.change.startsWith("+") ? (
                    <ArrowUp className='w-3 h-3 text-green-400' />
                  ) : (
                    <ArrowDown className='w-3 h-3 text-red-400' />
                  )}
                  <span
                    className={`text-xs font-medium ${item.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                  >
                    {item.change}
                  </span>
                </div>
              </div>
              <p className='text-gray-400 text-sm'>{item.label}</p>
              <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              <p className='text-xs text-gray-500 mt-1'>{item.subtitle}</p>
            </div>
          ))}
          </div>
        )}

        {/* Charts */}
        <div className='grid lg:grid-cols-2 gap-8'>
          <div className='bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold'>
                User Sign-ups (Last 6 Months)
              </h2>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-blue-400 rounded-full'></div>
                <span className='text-sm text-gray-400'>Monthly Growth</span>
              </div>
            </div>
            <div className='w-full h-48 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg flex items-end justify-center space-x-2 p-4'>
              {usersByMonth.length > 0 ? (
                usersByMonth.map((month, idx) => {
                  const maxCount = Math.max(...usersByMonth.map(m => m.count), 1);
                  return (
                    <div key={idx} className='flex flex-col items-center space-y-2'>
                      <div
                        className='w-8 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all hover:from-blue-400 hover:to-purple-400'
                        style={{ height: `${(month.count / maxCount) * 100}%` }}
                      ></div>
                      <span className='text-xs text-gray-400'>{month.month}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400 text-sm">No data available</p>
              )}
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold'>Projects by Domain</h2>
              <Eye className='w-5 h-5 text-gray-400 hover:text-white cursor-pointer' />
            </div>
            <div className='w-full h-48 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-lg flex items-center justify-center'>
              {projectsByDomain.length > 0 ? (
                <div className='grid grid-cols-2 gap-4 w-full p-4'>
                  {projectsByDomain.map((domain, idx) => {
                    const maxCount = Math.max(...projectsByDomain.map(d => d.count), 1);
                    return (
                      <div key={idx} className='bg-white/10 rounded-lg p-3'>
                        <div className='flex items-center justify-between mb-1'>
                          <span className='text-sm font-medium'>
                            {domain.domain}
                          </span>
                          <span className='text-xs text-gray-400'>
                            {domain.count}
                          </span>
                        </div>
                        <div className='w-full bg-gray-700 rounded-full h-2'>
                          <div
                            className='bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all'
                            style={{ width: `${(domain.count / maxCount) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Flagged Content Section */}
        <div className='bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-xl font-semibold flex items-center gap-2'>
              <Flag className='w-6 h-6 text-red-400' />
              Flagged Content
            </h2>
            <Button 
              variant="ghost"
              className='text-blue-400 hover:text-blue-300 text-sm flex items-center'
            >
              View All <ChevronRight className='w-4 h-4 ml-1' />
            </Button>
          </div>
          <div className='space-y-3'>
            {flaggedContent.map((item) => (
              <div
                key={item.id}
                className='bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all'
              >
                <div className='flex items-start justify-between mb-2'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <h3 className='font-semibold text-sm'>{item.reason}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {item.priority}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        item.status === 'under_review' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className='text-gray-300 text-sm mb-1'>{item.details}</p>
                    <p className='text-gray-400 text-xs'>Reported by: {item.reportedBy} • {item.reportedAt}</p>
                  </div>
                  <div className='flex gap-2'>
                    <Button 
                      className='px-3 py-1 bg-green-500 hover:bg-green-600 rounded text-sm transition-colors'
                    >
                      Approve
                    </Button>
                    <Button 
                      className='px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-sm transition-colors'
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Dashboard Row */}
        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Recent Alerts */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold flex items-center gap-2'>
                <AlertTriangle className='w-6 h-6 text-yellow-400' />
                Recent Alerts
              </h2>
              <Zap className='w-5 h-5 text-yellow-400' />
            </div>
            <ul className='space-y-3'>
              {recentAlerts.map((alert) => (
                <li
                  key={alert.id}
                  className='flex items-start space-x-3 p-3 bg-white/5 rounded-lg hover:bg-gray-700/50 transition-colors'
                >
                  <div
                    className={`w-3 h-3 rounded-full mt-1 ${alert.alert ? "bg-red-500 animate-pulse" : "bg-green-500"}`}
                  ></div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <span className='text-gray-300 text-sm'>
                        {alert.message}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-xs ${
                        alert.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        alert.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {alert.priority}
                      </span>
                    </div>
                    <div className='flex items-center space-x-1 mt-1'>
                      <Clock className='w-3 h-3 text-gray-500' />
                      <span className='text-xs text-gray-500'>
                        {alert.time}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Performers */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold'>Top Performers</h2>
              <Sparkles className='w-5 h-5 text-yellow-400' />
            </div>
            <div className='space-y-4'>
              {topPerformers.map((performer, idx) => (
                <div
                  key={idx}
                  className='flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-gray-700/50 transition-colors'
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${idx === 0 ? "bg-yellow-500/20 text-yellow-400" : idx === 1 ? "bg-gray-500/20 text-gray-400" : "bg-orange-500/20 text-orange-400"}`}
                  >
                    {idx + 1}
                  </div>
                  <div className='flex-1'>
                    <p className='font-medium text-sm'>{performer.name}</p>
                    <p className='text-xs text-gray-400'>
                      {performer.projects} projects • ⭐ {performer.rating}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm font-semibold text-green-400'>
                      {performer.earnings}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold'>Recent Activity</h2>
              <Activity className='w-5 h-5 text-blue-400' />
            </div>
            <div className='space-y-4'>
              {recentActivity.map((activity, idx) => (
                <div
                  key={idx}
                  className='flex items-start space-x-3 p-3 bg-white/5 rounded-lg hover:bg-gray-700/50 transition-colors'
                >
                  <div className='w-2 h-2 bg-blue-400 rounded-full mt-2'></div>
                  <div className='flex-1'>
                    <p className='text-sm'>{activity.action}</p>
                    <p className='text-xs text-gray-400'>
                      {activity.user || activity.project}
                    </p>
                    <p className='text-xs text-gray-500 mt-1'>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Health Monitoring */}
        <div className='bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-lg font-semibold flex items-center gap-2'>
              <Server className='w-6 h-6 text-green-400' />
              System Health
            </h3>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
              <span className='text-sm text-green-400'>All Systems Operational</span>
            </div>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='text-center p-4 bg-white/5 rounded-lg'>
              <div className='flex items-center justify-center mb-2'>
                <Cpu className='w-6 h-6 text-blue-400' />
              </div>
              <p className='text-xs text-gray-400 mb-1'>CPU Usage</p>
              <p className='text-lg font-bold text-blue-400'>{systemHealth.cpuUsage}%</p>
            </div>
            <div className='text-center p-4 bg-white/5 rounded-lg'>
              <div className='flex items-center justify-center mb-2'>
                <HardDrive className='w-6 h-6 text-green-400' />
              </div>
              <p className='text-xs text-gray-400 mb-1'>Memory</p>
              <p className='text-lg font-bold text-green-400'>{systemHealth.memoryUsage}%</p>
            </div>
            <div className='text-center p-4 bg-white/5 rounded-lg'>
              <div className='flex items-center justify-center mb-2'>
                <Database className='w-6 h-6 text-purple-400' />
              </div>
              <p className='text-xs text-gray-400 mb-1'>Disk Usage</p>
              <p className='text-lg font-bold text-purple-400'>{systemHealth.diskUsage}%</p>
            </div>
            <div className='text-center p-4 bg-white/5 rounded-lg'>
              <div className='flex items-center justify-center mb-2'>
                <Wifi className='w-6 h-6 text-yellow-400' />
              </div>
              <p className='text-xs text-gray-400 mb-1'>Response Time</p>
              <p className='text-lg font-bold text-yellow-400'>{systemHealth.responseTime}ms</p>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className='bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-lg font-semibold flex items-center gap-2'>
              <Settings className='w-6 h-6 text-blue-400' />
              Admin Tools
            </h3>
            <Shield className='w-5 h-5 text-green-400' />
          </div>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {quickAccessLinks.map((link, index) => (
              <Button
                key={index}
                onClick={() => navigate(link.path)}
                variant="ghost"
                className={`group flex flex-col items-center space-y-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  link.color === 'blue' ? 'bg-blue-500/20 hover:bg-blue-500/30' :
                  link.color === 'red' ? 'bg-red-500/20 hover:bg-red-500/30' :
                  link.color === 'green' ? 'bg-green-500/20 hover:bg-green-500/30' :
                  link.color === 'purple' ? 'bg-purple-500/20 hover:bg-purple-500/30' :
                  link.color === 'yellow' ? 'bg-yellow-500/20 hover:bg-yellow-500/30' :
                  link.color === 'pink' ? 'bg-pink-500/20 hover:bg-pink-500/30' :
                  'bg-orange-500/20 hover:bg-orange-500/30'
                }`}
              >
                <div className={`p-3 rounded-lg group-hover:scale-110 transition-transform ${
                  link.color === 'blue' ? 'bg-blue-500/30' :
                  link.color === 'red' ? 'bg-red-500/30' :
                  link.color === 'green' ? 'bg-green-500/30' :
                  link.color === 'purple' ? 'bg-purple-500/30' :
                  link.color === 'yellow' ? 'bg-yellow-500/30' :
                  'bg-orange-500/30'
                }`}>
                  <link.icon className={`w-6 h-6 ${
                    link.color === 'blue' ? 'text-blue-400' :
                    link.color === 'red' ? 'text-red-400' :
                    link.color === 'green' ? 'text-green-400' :
                    link.color === 'purple' ? 'text-purple-400' :
                    link.color === 'yellow' ? 'text-yellow-400' :
                    'text-orange-400'
                  }`} />
                </div>
                <div className='text-center'>
                  <p className='text-sm font-medium text-white'>{link.name}</p>
                  <p className='text-xs text-gray-400 mt-1'>{link.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Performance Indicators */}
        <div className='bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold'>System Performance</h3>
            <Globe className='w-5 h-5 text-blue-400' />
          </div>
          <div className='grid grid-cols-4 gap-4'>
            {[
              {
                label: "Server Uptime",
                value: "99.9%",
                color: "text-green-400",
              },
              {
                label: "Response Time",
                value: "245ms",
                color: "text-blue-400",
              },
              {
                label: "Active Sessions",
                value: "342",
                color: "text-yellow-400",
              },
              {
                label: "Data Processed",
                value: "1.2TB",
                color: "text-purple-400",
              },
            ].map((metric, idx) => (
              <div key={idx} className='text-center p-3 bg-white/5 rounded-lg'>
                <p className='text-xs text-gray-400 mb-1'>{metric.label}</p>
                <p className={`text-lg font-bold ${metric.color}`}>
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
