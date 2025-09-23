import React, { useState } from "react";
import { Badge, Button } from "../../../components";
import { 
  RefreshCw, 
  Settings, 
  Clock, 
  Zap, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Activity,
  TrendingUp,
  Calendar,
  Bell,
  Download,
  Upload,
  Globe,
  Database,
  BarChart3
} from "lucide-react";

export default function SyncStatusCard({ 
  userData, 
  integrations = {}, 
  syncing = false, 
  autoSync = true, 
  setAutoSync, 
  onSync 
}) {
  const [syncSettings, setSyncSettings] = useState({
    frequency: "daily",
    notifications: true,
    autoBackup: true
  });

  const [syncProgress, setSyncProgress] = useState({
    current: 0,
    total: 0,
    currentIntegration: ""
  });

  const connectedIntegrations = Object.values(integrations).filter(integration => integration.connected).length;
  const totalIntegrations = Object.keys(integrations).length;

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

  const getNextSyncTime = () => {
    const now = new Date();
    const nextSync = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return nextSync.toLocaleString();
  };

  const handleSyncClick = () => {
    if (onSync) {
      onSync();
    }
  };

  const toggleAutoSync = () => {
    if (setAutoSync) {
      setAutoSync(!autoSync);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Sync Control */}
      <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10'>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
            <RefreshCw className='w-5 h-5 text-white' />
          </div>
          <h2 className='text-xl font-semibold'>Sync Control</h2>
        </div>
        
        <p className='text-gray-300 text-sm mb-4'>
          Sync your connected integrations to update your profile. You can manually trigger a sync anytime.
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={handleSyncClick}
            disabled={syncing || connectedIntegrations === 0}
            className='w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:scale-105 transition-all duration-300'
          >
            {syncing ? (
              <>
                <RefreshCw className='w-4 h-4 mr-2 animate-spin' />
                Syncing... ({syncProgress.current}/{syncProgress.total})
              </>
            ) : (
              <>
                <RefreshCw className='w-4 h-4 mr-2' />
                Sync Now
              </>
            )}
          </Button>
          
          {connectedIntegrations === 0 && (
            <p className="text-xs text-yellow-400 text-center">
              Connect at least one integration to sync
            </p>
          )}
        </div>
      </section>

      {/* Auto Sync Settings */}
      <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10'>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Zap className='w-5 h-5 text-white' />
          </div>
          <h2 className='text-xl font-semibold'>Auto Sync</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-white">Enable Auto Sync</h3>
              <p className="text-xs text-gray-400">Automatically sync every 24 hours</p>
            </div>
            <button
              onClick={toggleAutoSync}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                autoSync 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  autoSync ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Sync Frequency</label>
            <select
              value={syncSettings.frequency}
              onChange={(e) => setSyncSettings(prev => ({ ...prev, frequency: e.target.value }))}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="hourly">Every Hour</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>
      </section>

      {/* Sync Status */}
      <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10'>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Activity className='w-5 h-5 text-white' />
          </div>
          <h2 className='text-xl font-semibold'>Sync Status</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Connected Integrations</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">{connectedIntegrations}/{totalIntegrations}</span>
              <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${(connectedIntegrations / totalIntegrations) * 100}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Last Sync</span>
            <span className="text-white font-semibold text-sm">
              {getTimeAgo(Object.values(integrations).find(i => i.connected)?.lastSync)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Next Auto Sync</span>
            <span className="text-white font-semibold text-sm">
              {autoSync ? getNextSyncTime() : "Disabled"}
            </span>
          </div>
        </div>
      </section>

      {/* Sync Statistics */}
      <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10'>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
            <BarChart3 className='w-5 h-5 text-white' />
          </div>
          <h2 className='text-xl font-semibold'>Statistics</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {Object.values(integrations).reduce((sum, integration) => 
                sum + (integration.projects || integration.commits || integration.answers || 0), 0
              )}
            </p>
            <p className="text-xs text-gray-400">Total Items</p>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {Object.values(integrations).filter(i => i.connected && i.lastSync).length}
            </p>
            <p className="text-xs text-gray-400">Active Sources</p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10'>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
            <Settings className='w-5 h-5 text-white' />
          </div>
          <h2 className='text-xl font-semibold'>Quick Actions</h2>
        </div>
        
        <div className="space-y-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start hover:scale-105 transition-transform duration-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Portfolio Data
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start hover:scale-105 transition-transform duration-300"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Settings
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start hover:scale-105 transition-transform duration-300"
          >
            <Shield className="w-4 h-4 mr-2" />
            Manage Permissions
          </Button>
        </div>
      </section>
    </div>
  );
}
