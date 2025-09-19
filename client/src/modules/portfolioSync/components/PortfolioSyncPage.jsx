import React, { useState, useEffect } from "react";
import Navbar from "../../../components/header";
import { Footer } from "../../../components";
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
  EyeOff
} from "lucide-react";
import { useSelector } from "react-redux";
import SyncStatusCard from "./SyncStatusCard";

export default function PortfolioSyncPage() {
  const user = useSelector((state) => state.user?.user);
  
  // Enhanced integration data with more details
  const [integrations, setIntegrations] = useState({
    github: {
      connected: true,
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      projects: 12,
      commits: 156,
      stars: 23,
      status: "active"
    },
    linkedin: {
      connected: false,
      lastSync: null,
      connections: 0,
      status: "disconnected"
    },
    personalWebsite: {
      connected: true,
      lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      pages: 5,
      status: "active"
    },
    behance: {
      connected: false,
      lastSync: null,
      projects: 0,
      status: "disconnected"
    },
    dribbble: {
      connected: false,
      lastSync: null,
      shots: 0,
      status: "disconnected"
    },
    stackoverflow: {
      connected: true,
      lastSync: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      reputation: 1250,
      answers: 45,
      status: "active"
    }
  });

  const [syncing, setSyncing] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [syncHistory, setSyncHistory] = useState([
    {
      id: 1,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: "success",
      integrations: ["github", "stackoverflow"],
      itemsUpdated: 23
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: "success",
      integrations: ["github", "personalWebsite"],
      itemsUpdated: 8
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      status: "partial",
      integrations: ["github"],
      itemsUpdated: 15,
      errors: ["LinkedIn API rate limit exceeded"]
    }
  ]);
  const [showSyncHistory, setShowSyncHistory] = useState(false);

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
        itemsUpdated: Math.floor(Math.random() * 20) + 5
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
      case "personalWebsite":
        return <Globe className='w-5 h-5 text-green-400' />;
      case "behance":
        return <BarChart3 className='w-5 h-5 text-purple-400' />;
      case "dribbble":
        return <Activity className='w-5 h-5 text-pink-400' />;
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
      case "personalWebsite":
        return `${data.pages} pages`;
      case "behance":
        return `${data.projects} projects`;
      case "dribbble":
        return `${data.shots} shots`;
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
    <>
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
        <Navbar data={user} isSearchBar={false} />
        
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
                    Portfolio Sync
                  </h1>
                  <p className="text-gray-300 text-sm">
                    Connect and sync your professional profiles across platforms
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
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
                  <TrendingUp className="w-5 h-5 text-white" />
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
            
            <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {getTimeAgo(syncHistory[0]?.timestamp)}
                  </p>
                  <p className="text-sm text-gray-400">Last Sync</p>
                </div>
              </div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    {autoSync ? "ON" : "OFF"}
                  </p>
                  <p className="text-sm text-gray-400">Auto Sync</p>
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
                              {sync.integrations.join(", ")} • {sync.itemsUpdated} items updated
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
      <Footer />
    </>
  );
}
