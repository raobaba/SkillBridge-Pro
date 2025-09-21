import React, { useState, useEffect } from "react";
import { Badge, Button } from "../../../components";
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
  const [systemStats, setSystemStats] = useState({
    totalUsers: 1247,
    connectedUsers: 892,
    totalIntegrations: 2678,
    activeIntegrations: 2156,
    suspiciousAccounts: 12,
    flaggedPortfolios: 8,
    systemHealth: 98.5,
    apiErrors: 23
  });

  const [integrationHealth, setIntegrationHealth] = useState([
    {
      name: "GitHub",
      status: "healthy",
      uptime: 99.9,
      users: 756,
      errors: 2,
      lastCheck: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    },
    {
      name: "LinkedIn",
      status: "healthy",
      uptime: 99.7,
      users: 623,
      errors: 5,
      lastCheck: new Date(Date.now() - 3 * 60 * 1000).toISOString()
    },
    {
      name: "StackOverflow",
      status: "warning",
      uptime: 97.2,
      users: 445,
      errors: 12,
      lastCheck: new Date(Date.now() - 2 * 60 * 1000).toISOString()
    }
  ]);

  const [flaggedAccounts, setFlaggedAccounts] = useState([
    {
      id: 1,
      userId: "user_123",
      name: "John Doe",
      reason: "Suspicious GitHub activity",
      details: "Multiple fake repositories detected",
      status: "pending",
      reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      severity: "high"
    },
    {
      id: 2,
      userId: "user_456",
      name: "Jane Smith",
      reason: "Manipulated skill scores",
      details: "Unusual skill score patterns detected",
      status: "investigating",
      reportedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      severity: "medium"
    },
    {
      id: 3,
      userId: "user_789",
      name: "Bob Wilson",
      reason: "Fake LinkedIn profile",
      details: "Profile information doesn't match GitHub data",
      status: "resolved",
      reportedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      severity: "low"
    }
  ]);

  const [skillTrends, setSkillTrends] = useState([
    { skill: "React", demand: 95, supply: 78, trend: "up" },
    { skill: "Python", demand: 88, supply: 82, trend: "up" },
    { skill: "Node.js", demand: 92, supply: 75, trend: "up" },
    { skill: "Vue.js", demand: 76, supply: 65, trend: "stable" },
    { skill: "Angular", demand: 68, supply: 72, trend: "down" },
    { skill: "PHP", demand: 45, supply: 58, trend: "down" }
  ]);

  const [activeTab, setActiveTab] = useState("overview");

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

  const renderFlaggedAccounts = () => (
    <div className="space-y-4">
      {flaggedAccounts.map((account) => (
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
      ))}
    </div>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
      <div className='max-w-7xl mx-auto px-4 py-6 sm:py-8'>
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
