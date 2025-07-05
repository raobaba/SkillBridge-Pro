import React, { useState, useEffect } from "react";
import {
  Bell,
  BarChart3,
  PieChart,
  Users,
  Briefcase,
  Target,
  DollarSign,
  Star,
  Activity,
  TrendingUp,
  Settings,
  Search,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

export default function AnalyticsDashboard() {
  const [notifications, setNotifications] = useState(4);
  const [messages, setMessages] = useState(1);

  // Mock analytics stats
  const stats = {
    totalUsers: 1_250,
    activeDevelopers: 420,
    projectsPosted: 600,
    matchRate: 78,     // in %
    avgRating: 4.5,
    revenue: "$58,000",
  };

  // Chart data (mock)
  const usersByMonth = [
    { month: "Jan", count: 150 },
    { month: "Feb", count: 200 },
    { month: "Mar", count: 180 },
    { month: "Apr", count: 220 },
    { month: "May", count: 250 },
    { month: "Jun", count: 300 },
  ];

  const projectsByDomain = [
    { domain: "Web Dev", count: 240 },
    { domain: "Mobile Dev", count: 180 },
    { domain: "ML/AI", count: 120 },
    { domain: "DevOps", count: 60 },
  ];

  const recentAlerts = [
    { id: 1, message: "Match rate dropped below 80%", alert: true },
    { id: 2, message: "Revenue increased by 12% MoM", alert: false },
    { id: 3, message: "New high-value project posted today", alert: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:inline text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Analytics Dashboard
              </span>
            </div>
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search metrics, users, or domains..."
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-lg hover:bg-white/10">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              <button className="relative p-2 rounded-lg hover:bg-white/10">
                <MessageSquare className="w-5 h-5" />
                {messages > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-xs rounded-full flex items-center justify-center">
                    {messages}
                  </span>
                )}
              </button>
              <div className="flex items-center space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face"
                  alt="Admin"
                  className="w-8 h-8 rounded-full"
                />
                <span className="hidden sm:block text-sm font-medium">Admin</span>
              </div>
              <Settings className="w-5 h-5 text-white/70 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>
      </header>

      {/* Body Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-400" },
            { label: "Active Devs", value: stats.activeDevelopers, icon: Star, color: "text-yellow-400" },
            { label: "Projects Posted", value: stats.projectsPosted, icon: Briefcase, color: "text-green-400" },
            { label: "Match Rate", value: `${stats.matchRate}%`, icon: Target, color: "text-pink-400" },
            { label: "Avg Rating", value: stats.avgRating, icon: Star, color: "text-orange-400" },
            { label: "Revenue", value: stats.revenue, icon: DollarSign, color: "text-purple-400" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{item.label}</p>
                  <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                </div>
                <item.icon className={`w-8 h-8 ${item.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">User Sign-ups (Last 6 Months)</h2>
            {/* You can integrate a chart library here */}
            <div className="w-full h-48 bg-gray-700 rounded"></div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Projects by Domain</h2>
            {/* Pie or bar chart area */}
            <div className="w-full h-48 bg-gray-700 rounded"></div>
          </div>
        </div>

        {/* Recent Alerts / Updates */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Alerts & Insights</h2>
          <ul className="space-y-3">
            {recentAlerts.map(alert => (
              <li key={alert.id} className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${alert.alert ? "bg-red-500" : "bg-green-500"}`}></div>
                <span className="text-gray-300">{alert.message}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex items-center space-x-2 p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-sm">Manage Users</span>
            </button>
            <button className="flex items-center space-x-2 p-3 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors">
              <BarChart3 className="w-5 h-5 text-green-400" />
              <span className="text-sm">View Reports</span>
            </button>
            <button className="flex items-center space-x-2 p-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors">
              <PieChart className="w-5 h-5 text-purple-400" />
              <span className="text-sm">Domain Analytics</span>
            </button>
            <button className="flex items-center space-x-2 p-3 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">Admin Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
