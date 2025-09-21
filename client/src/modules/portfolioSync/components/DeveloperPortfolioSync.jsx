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
  Brain
} from "lucide-react";
import SyncStatusCard from "./SyncStatusCard";

const DeveloperPortfolioSync = ({ user }) => {
  // Enhanced integration data with skill intelligence
  const [integrations, setIntegrations] = useState({
    github: {
      connected: true,
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      projects: 12,
      commits: 156,
      stars: 23,
      status: "active",
      skillScore: 85,
      trendingSkills: ["React", "Node.js", "TypeScript"]
    },
    linkedin: {
      connected: false,
      lastSync: null,
      connections: 0,
      status: "disconnected",
      skillScore: 0,
      trendingSkills: []
    },
    stackoverflow: {
      connected: true,
      lastSync: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      reputation: 1250,
      answers: 45,
      status: "active",
      skillScore: 78,
      trendingSkills: ["JavaScript", "Python", "SQL"]
    }
  });

  const [syncing, setSyncing] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [showSyncHistory, setShowSyncHistory] = useState(false);
  const [skillIntelligence, setSkillIntelligence] = useState({
    overallScore: 82,
    trendingSkills: ["React", "Node.js", "TypeScript", "Python", "AWS"],
    learningPath: [
      { skill: "Docker", priority: "high", reason: "High demand in your field" },
      { skill: "GraphQL", priority: "medium", reason: "Growing popularity" },
      { skill: "Machine Learning", priority: "low", reason: "Future opportunity" }
    ],
    marketDemand: {
      react: 95,
      nodejs: 88,
      typescript: 92,
      python: 85,
      aws: 90
    }
  });

  const [syncHistory, setSyncHistory] = useState([
    {
      id: 1,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: "success",
      integrations: ["github", "stackoverflow"],
      itemsUpdated: 23,
      skillUpdates: 5
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: "success",
      integrations: ["github"],
      itemsUpdated: 8,
      skillUpdates: 2
    }
  ]);

  const toggleIntegration = (type) => {
    setIntegrations((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        connected: !prev[type].connected,
        status: !prev[type].connected ? "active" : "disconnected"
      }
    }));
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      const newSyncEntry = {
        id: syncHistory.length + 1,
        timestamp: new Date().toISOString(),
        status: "success",
        integrations: Object.keys(integrations).filter(key => integrations[key].connected),
        itemsUpdated: Math.floor(Math.random() * 20) + 5,
        skillUpdates: Math.floor(Math.random() * 5) + 1
      };
      setSyncHistory(prev => [newSyncEntry, ...prev]);
      
      // Update last sync times for connected integrations
      setIntegrations(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (updated[key].connected) {
            updated[key].lastSync = new Date().toISOString();
          }
        });
        return updated;
      });
    }, 2000);
  };

  const integrationIcon = (type) => {
    switch (type) {
      case "github":
        return <Github className='w-5 h-5 text-white' />;
      case "linkedin":
        return <Linkedin className='w-5 h-5 text-blue-400' />;
      case "stackoverflow":
        return <Code className='w-5 h-5 text-orange-400' />;
      default:
        return <FileText className='w-5 h-5 text-gray-400' />;
    }
  };

  const getIntegrationStats = (type, data) => {
    switch (type) {
      case "github":
        return `${data.projects} projects, ${data.commits} commits, ${data.stars} stars`;
      case "linkedin":
        return `${data.connections} connections`;
      case "stackoverflow":
        return `${data.reputation} reputation, ${data.answers} answers`;
      default:
        return "No data available";
    }
  };

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

  const connectedCount = Object.values(integrations).filter(integration => integration.connected).length;
  const totalIntegrations = Object.keys(integrations).length;

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
      <div className='max-w-7xl mx-auto px-4 py-6 sm:py-8'>
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <Link className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                  PortfolioSync
                </h1>
                <p className="text-gray-300 text-sm">
                  Connect platforms to showcase your work and boost matchmaking accuracy
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                <Brain className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">
                  Skill Score: {skillIntelligence.overallScore}/100
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">
                  {connectedCount}/{totalIntegrations} Connected
                </span>
              </div>
              <Button
                onClick={handleSync}
                disabled={syncing}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:scale-105 transition-all duration-300"
              >
                {syncing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{connectedCount}</p>
                <p className="text-sm text-gray-400">Connected</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{skillIntelligence.overallScore}</p>
                <p className="text-sm text-gray-400">Skill Score</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{skillIntelligence.trendingSkills.length}</p>
                <p className="text-sm text-gray-400">Trending Skills</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {Object.values(integrations).reduce((sum, integration) => 
                    sum + (integration.projects || integration.commits || integration.answers || 0), 0
                  )}
                </p>
                <p className="text-sm text-gray-400">Total Items</p>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
          {/* Left Column: Enhanced Integrations */}
          <div className='xl:col-span-2 space-y-6'>
            <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10'>
              <div className="flex items-center justify-between mb-6">
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <Settings className='w-5 h-5 text-cyan-400' />
                  Platform Integrations
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSyncHistory(!showSyncHistory)}
                  className="hover:scale-105 transition-transform duration-300"
                >
                  {showSyncHistory ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showSyncHistory ? "Hide History" : "Show History"}
                </Button>
              </div>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {Object.entries(integrations).map(([type, data]) => (
                  <div
                    key={type}
                    className={`bg-white/5 border border-white/10 rounded-xl p-4 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02] group ${
                      data.connected ? "ring-1 ring-green-500/30" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r from-slate-700 to-slate-600 group-hover:scale-110 transition-transform duration-300`}>
                          {integrationIcon(type)}
                        </div>
                        <div>
                          <h3 className="font-medium text-white capitalize">
                            {type.replace(/([A-Z])/g, ' $1').trim()}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {getIntegrationStats(type, data)}
                          </p>
                          {data.connected && data.skillScore > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Brain className="w-3 h-3 text-blue-400" />
                              <span className="text-xs text-blue-400">Score: {data.skillScore}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => toggleIntegration(type)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                          data.connected 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                            data.connected ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={data.connected ? "success" : "error"}
                          className="text-xs"
                        >
                          {data.connected ? (
                            <><CheckCircle className="w-3 h-3 mr-1" /> Connected</>
                          ) : (
                            <><AlertCircle className="w-3 h-3 mr-1" /> Disconnected</>
                          )}
                        </Badge>
                      </div>
                      
                      {data.connected && data.lastSync && (
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          {getTimeAgo(data.lastSync)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Skill Intelligence */}
            <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10'>
              <h2 className='text-xl font-semibold flex items-center gap-2 mb-6'>
                <Brain className='w-5 h-5 text-purple-400' />
                Skill Intelligence
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Trending Skills</h3>
                  <div className="space-y-2">
                    {skillIntelligence.trendingSkills.map((skill, index) => (
                      <div key={skill} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                          <span className="text-white font-medium">{skill}</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          {skillIntelligence.marketDemand[skill.toLowerCase()] || 85}% demand
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Learning Path</h3>
                  <div className="space-y-2">
                    {skillIntelligence.learningPath.map((item, index) => (
                      <div key={item.skill} className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium">{item.skill}</span>
                          <Badge className={
                            item.priority === "high" ? "bg-red-500/20 text-red-400" :
                            item.priority === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-green-500/20 text-green-400"
                          }>
                            {item.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Sync History */}
            {showSyncHistory && (
              <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10'>
                <h2 className='text-xl font-semibold flex items-center gap-2 mb-4'>
                  <Database className='w-5 h-5 text-blue-400' />
                  Sync History
                </h2>
                
                <div className="space-y-3">
                  {syncHistory.slice(0, 5).map((sync) => (
                    <div
                      key={sync.id}
                      className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          sync.status === "success" 
                            ? "bg-green-500/20 text-green-400" 
                            : sync.status === "partial"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}>
                          {sync.status === "success" ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : sync.status === "partial" ? (
                            <AlertCircle className="w-4 h-4" />
                          ) : (
                            <AlertCircle className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {sync.status === "success" ? "Sync Successful" : 
                             sync.status === "partial" ? "Partial Sync" : "Sync Failed"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {sync.integrations.join(", ")} • {sync.itemsUpdated} items updated • {sync.skillUpdates} skills updated
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {getTimeAgo(sync.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Enhanced Sync Controls */}
          <div className='space-y-6'>
            <SyncStatusCard 
              userData={user} 
              integrations={integrations}
              syncing={syncing}
              autoSync={autoSync}
              setAutoSync={setAutoSync}
              onSync={handleSync}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperPortfolioSync;
