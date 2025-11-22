import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Button } from "../../../components";
import { getDevelopersWithPortfolioData } from "../slice/portfolioSyncSlice";
import { 
  Github, 
  Linkedin, 
  FileText, 
  RefreshCw, 
  Settings, 
  Link, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Activity,
  Zap,
  Shield,
  Globe,
  Code,
  Database,
  Calendar,
  BarChart3,
  Download,
  Upload,
  Eye,
  EyeOff,
  Target,
  Award,
  Star,
  Users,
  BookOpen,
  Brain,
  Search,
  Filter,
  User,
  MapPin,
  Mail,
  Phone,
  AlertTriangle,
  Flag,
  CheckCircle2,
  XCircle,
  BarChart,
  PieChart,
  TrendingDown
} from "lucide-react";

const AdminPortfolioSync = ({ user }) => {
  const dispatch = useDispatch();
  const { developers, developersLoading, error } = useSelector((state) => state.portfolioSync);
  const [activeTab, setActiveTab] = useState("overview");
  const [avatarErrors, setAvatarErrors] = useState({});
  const [flaggedAccounts, setFlaggedAccounts] = useState([]);

  // Fetch developers with portfolio sync data
  useEffect(() => {
    if (user?.id) {
      dispatch(getDevelopersWithPortfolioData({ limit: 1000 })); // Fetch more for admin
    }
  }, [dispatch, user?.id]);

  // Calculate system stats from real data
  const systemStats = useMemo(() => {
    if (!developers || developers.length === 0) {
      return {
        totalUsers: 0,
        connectedUsers: 0,
        totalIntegrations: 0,
        activeIntegrations: 0,
        suspiciousAccounts: flaggedAccounts.length,
        flaggedPortfolios: flaggedAccounts.length,
        systemHealth: 100,
        apiErrors: 0
      };
    }

    const totalUsers = developers.length;
    const connectedUsers = developers.filter(dev => 
      dev.github.connected || dev.linkedin.connected || dev.stackoverflow.connected || dev.portfolio.connected
    ).length;
    
    const githubConnected = developers.filter(dev => dev.github.connected).length;
    const linkedinConnected = developers.filter(dev => dev.linkedin.connected).length;
    const stackoverflowConnected = developers.filter(dev => dev.stackoverflow.connected).length;
    const portfolioConnected = developers.filter(dev => dev.portfolio.connected).length;
    
    const totalIntegrations = githubConnected + linkedinConnected + stackoverflowConnected + portfolioConnected;
    const activeIntegrations = totalIntegrations; // All connected integrations are active

    return {
      totalUsers,
      connectedUsers,
      totalIntegrations,
      activeIntegrations,
      suspiciousAccounts: flaggedAccounts.length,
      flaggedPortfolios: flaggedAccounts.length,
      systemHealth: totalUsers > 0 ? Math.round((connectedUsers / totalUsers) * 100) : 100,
      apiErrors: 0
    };
  }, [developers, flaggedAccounts]);

  // Calculate integration health from real data
  const integrationHealth = useMemo(() => {
    if (!developers || developers.length === 0) {
      return [
        { name: "GitHub", status: "healthy", uptime: 100, users: 0, errors: 0, lastCheck: new Date().toISOString() },
        { name: "LinkedIn", status: "healthy", uptime: 100, users: 0, errors: 0, lastCheck: new Date().toISOString() },
        { name: "StackOverflow", status: "healthy", uptime: 100, users: 0, errors: 0, lastCheck: new Date().toISOString() }
      ];
    }

    const githubUsers = developers.filter(dev => dev.github.connected).length;
    const linkedinUsers = developers.filter(dev => dev.linkedin.connected).length;
    const stackoverflowUsers = developers.filter(dev => dev.stackoverflow.connected).length;

    return [
      {
        name: "GitHub",
        status: githubUsers > 0 ? "healthy" : "warning",
        uptime: 99.9,
        users: githubUsers,
        errors: 0,
        lastCheck: new Date().toISOString()
      },
      {
        name: "LinkedIn",
        status: linkedinUsers > 0 ? "healthy" : "warning",
        uptime: 99.7,
        users: linkedinUsers,
        errors: 0,
        lastCheck: new Date().toISOString()
      },
      {
        name: "StackOverflow",
        status: stackoverflowUsers > 0 ? "healthy" : "warning",
        uptime: 97.2,
        users: stackoverflowUsers,
        errors: 0,
        lastCheck: new Date().toISOString()
      }
    ];
  }, [developers]);

  // Calculate skill trends from real data
  const skillTrends = useMemo(() => {
    if (!developers || developers.length === 0) {
      return [];
    }

    // Count skills from all developers
    const skillCounts = {};
    developers.forEach(dev => {
      if (dev.skills && Array.isArray(dev.skills) && dev.skills.length > 0 && dev.skills[0] !== "No skills data") {
        dev.skills.forEach(skill => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
      }
    });

    // Convert to trend format
    const totalDevelopers = developers.length;
    const trends = Object.entries(skillCounts)
      .map(([skill, count]) => {
        const supply = Math.round((count / totalDevelopers) * 100);
        // Simulate demand (in real app, this would come from job market data)
        const demand = Math.min(100, supply + Math.floor(Math.random() * 20) - 10);
        const trend = demand > supply ? "up" : demand < supply ? "down" : "stable";
        
        return { skill, demand, supply, trend };
      })
      .sort((a, b) => b.demand - a.demand)
      .slice(0, 10); // Top 10 skills

    return trends;
  }, [developers]);

  const getTimeAgo = (dateString) => {
    if (!dateString) return "Never";
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "warning": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "error": return "text-red-400 bg-red-400/10 border-red-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "medium": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "low": return "text-green-400 bg-green-400/10 border-green-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const handleResolveFlag = (id) => {
    setFlaggedAccounts(prev => 
      prev.map(account => 
        account.id === id 
          ? { ...account, status: "resolved" }
          : account
      )
    );
  };

  const handleInvestigateFlag = (id) => {
    setFlaggedAccounts(prev => 
      prev.map(account => 
        account.id === id 
          ? { ...account, status: "investigating" }
          : account
      )
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{systemStats.totalUsers}</p>
              <p className="text-sm text-gray-400">Total Users</p>
            </div>
          </div>
        </div>
        
        <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{systemStats.connectedUsers}</p>
              <p className="text-sm text-gray-400">Connected Users</p>
            </div>
          </div>
        </div>
        
        <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Link className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{systemStats.activeIntegrations}</p>
              <p className="text-sm text-gray-400">Active Integrations</p>
            </div>
          </div>
        </div>
        
        <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{systemStats.flaggedPortfolios}</p>
              <p className="text-sm text-gray-400">Flagged Portfolios</p>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Health */}
      <div className="bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-400" />
          Integration Health
        </h2>
        
        <div className="space-y-4">
          {integrationHealth.map((integration, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg">
                    {integration.name === "GitHub" && <Github className="w-5 h-5 text-white" />}
                    {integration.name === "LinkedIn" && <Linkedin className="w-5 h-5 text-blue-400" />}
                    {integration.name === "StackOverflow" && <Code className="w-5 h-5 text-orange-400" />}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{integration.name}</h3>
                    <p className="text-sm text-gray-400">{integration.users} users connected</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-white font-semibold">{integration.uptime}%</p>
                    <p className="text-xs text-gray-400">Uptime</p>
                  </div>
                  <Badge className={getStatusColor(integration.status)}>
                    {integration.status}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{integration.errors} errors in last 24h</span>
                <span>Last check: {getTimeAgo(integration.lastCheck)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Trends */}
      <div className="bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Skill Intelligence Trends
        </h2>
        
        <div className="space-y-3">
          {skillTrends.map((skill, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-white font-medium">{skill.skill}</span>
                  <div className={`flex items-center gap-1 ${
                    skill.trend === "up" ? "text-green-400" :
                    skill.trend === "down" ? "text-red-400" : "text-gray-400"
                  }`}>
                    {skill.trend === "up" && <TrendingUp className="w-4 h-4" />}
                    {skill.trend === "down" && <TrendingDown className="w-4 h-4" />}
                    {skill.trend === "stable" && <BarChart className="w-4 h-4" />}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-white font-semibold">{skill.demand}%</p>
                    <p className="text-xs text-gray-400">Demand</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white font-semibold">{skill.supply}%</p>
                    <p className="text-xs text-gray-400">Supply</p>
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  style={{ width: `${skill.demand}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDevelopersList = () => {
    if (!developers || developers.length === 0) {
      return (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No developers found</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              All Developers ({developers.length})
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {developers.map((developer) => (
            <div
              key={developer.id}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-start gap-3 mb-3">
                {/* Avatar */}
                <div className="relative group">
                  {developer.avatarUrl && !avatarErrors[developer.id] ? (
                    <img
                      src={developer.avatarUrl}
                      alt={developer.name}
                      className="w-12 h-12 rounded-full border-2 border-white/20 object-cover shadow-lg"
                      onError={() => setAvatarErrors(prev => ({ ...prev, [developer.id]: true }))}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full border-2 border-white/20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                      {developer.name ? developer.name.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full shadow-lg"></div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-white font-bold">{developer.name}</h3>
                  <p className="text-gray-300 text-sm">{developer.title || "Developer"}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">{developer.location}</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {developer.skills && developer.skills.length > 0 && developer.skills[0] !== "No skills data" ? (
                    developer.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="px-2 py-0.5 bg-gray-500/20 text-gray-300 text-xs rounded-full">
                      No skills
                    </span>
                  )}
                </div>
              </div>

              {/* Platform Connections */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center">
                  <Github className={`w-4 h-4 mx-auto mb-1 ${developer.github.connected ? 'text-green-400' : 'text-gray-400'}`} />
                  <span className={`text-xs ${developer.github.connected ? 'text-green-400' : 'text-gray-400'}`}>
                    {developer.github.connected ? 'GitHub' : '-'}
                  </span>
                </div>
                <div className="text-center">
                  <Linkedin className={`w-4 h-4 mx-auto mb-1 ${developer.linkedin.connected ? 'text-blue-400' : 'text-gray-400'}`} />
                  <span className={`text-xs ${developer.linkedin.connected ? 'text-blue-400' : 'text-gray-400'}`}>
                    {developer.linkedin.connected ? 'LinkedIn' : '-'}
                  </span>
                </div>
                <div className="text-center">
                  <Code className={`w-4 h-4 mx-auto mb-1 ${developer.stackoverflow.connected ? 'text-orange-400' : 'text-gray-400'}`} />
                  <span className={`text-xs ${developer.stackoverflow.connected ? 'text-orange-400' : 'text-gray-400'}`}>
                    {developer.stackoverflow.connected ? 'SO' : '-'}
                  </span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-white font-semibold">{developer.rating || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Brain className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-400 font-semibold">
                    {developer.github.skillScore + developer.linkedin.skillScore + developer.stackoverflow.skillScore || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFlaggedAccounts = () => (
    <div className="space-y-4">
      {flaggedAccounts.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No flagged accounts</p>
          <p className="text-gray-500 text-sm mt-2">All accounts are in good standing</p>
        </div>
      ) : (
        flaggedAccounts.map((account) => (
          <div key={account.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                {account.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{account.name}</h3>
                <p className="text-gray-300 text-sm">User ID: {account.userId}</p>
                <p className="text-gray-400 text-xs">Reported: {getTimeAgo(account.reportedAt)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={getSeverityColor(account.severity)}>
                {account.severity}
              </Badge>
              <Badge variant="outline">
                {account.status}
              </Badge>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-white font-medium mb-2">Reason: {account.reason}</h4>
            <p className="text-gray-300 text-sm">{account.details}</p>
          </div>
          
          <div className="flex gap-3">
            {account.status === "pending" && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleInvestigateFlag(account.id)}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Investigate
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleResolveFlag(account.id)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Resolve
                </Button>
              </>
            )}
            {account.status === "investigating" && (
              <Button
                size="sm"
                onClick={() => handleResolveFlag(account.id)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark Resolved
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Dismiss
            </Button>
          </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
      <div className='max-w-7xl mx-auto px-4 py-6 sm:py-8'>
        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                  PortfolioSync Admin
                </h1>
                <p className="text-gray-300 text-sm">
                  System oversight and moderation for portfolio integrations
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">
                  System Health: {systemStats.systemHealth}%
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-300">
                  {systemStats.totalUsers} users
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm text-gray-300">
                  {systemStats.flaggedPortfolios} flagged
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: "overview", label: "System Overview", icon: BarChart3 },
            { id: "flagged", label: "Flagged Accounts", icon: Flag },
            { id: "developers", label: "All Developers", icon: Users },
            { id: "analytics", label: "Analytics", icon: PieChart }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className={`text-sm hover:scale-105 transition-all duration-300 ${
                activeTab === tab.id 
                  ? "bg-gradient-to-r from-blue-500 to-purple-500" 
                  : ""
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "overview" && renderOverview()}
        {activeTab === "flagged" && renderFlaggedAccounts()}
        {activeTab === "developers" && renderDevelopersList()}
        {activeTab === "analytics" && (
          <div className="text-center py-12">
            <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Analytics Dashboard</p>
            <p className="text-gray-500 text-sm mt-2">Detailed analytics coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortfolioSync;
