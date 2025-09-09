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
} from "lucide-react";
import Navbar from "../../../components/header";
import { useSelector } from "react-redux";

export default function AnalyticsDashboard() {

  const [activeTab, setActiveTab] = useState("overview");
  const user = useSelector((state) => state.user.user);
  const [selectedTimeframe, setSelectedTimeframe] = useState("6m");

  // Mock analytics stats
  const stats = {
    totalUsers: 1_250,
    activeDevelopers: 420,
    projectsPosted: 600,
    matchRate: 78, // in %
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
    {
      id: 1,
      message: "Match rate dropped below 80%",
      alert: true,
      time: "2 hours ago",
    },
    {
      id: 2,
      message: "Revenue increased by 12% MoM",
      alert: false,
      time: "4 hours ago",
    },
    {
      id: 3,
      message: "New high-value project posted today",
      alert: false,
      time: "6 hours ago",
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
    },
    {
      action: "Project completed",
      project: "E-commerce App",
      time: "5 min ago",
    },
    {
      action: "Developer verified",
      user: "sarah.dev@example.com",
      time: "12 min ago",
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
      {/* Header */}
      <Navbar data={user} />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6'>
        <div className='flex space-x-1 bg-white/5 p-1 rounded-xl border border-white/10'>
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "users", label: "Users", icon: Users },
            { id: "projects", label: "Projects", icon: Briefcase },
            { id: "revenue", label: "Revenue", icon: DollarSign },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-blue-500/20 text-blue-400 border border-blue-400/30"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <tab.icon className='w-4 h-4' />
              <span className='text-sm font-medium'>{tab.label}</span>
            </button>
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
            <button className='flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors'>
              <Download className='w-4 h-4' />
              <span className='text-sm'>Export</span>
            </button>
            <button className='flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors'>
              <Filter className='w-4 h-4' />
              <span className='text-sm'>Filter</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
          {[
            {
              label: "Total Users",
              value: stats.totalUsers,
              icon: Users,
              color: "text-blue-400",
              bg: "bg-blue-500/20",
              change: "+12%",
            },
            {
              label: "Active Devs",
              value: stats.activeDevelopers,
              icon: Star,
              color: "text-yellow-400",
              bg: "bg-yellow-500/20",
              change: "+8%",
            },
            {
              label: "Projects Posted",
              value: stats.projectsPosted,
              icon: Briefcase,
              color: "text-green-400",
              bg: "bg-green-500/20",
              change: "+15%",
            },
            {
              label: "Match Rate",
              value: `${stats.matchRate}%`,
              icon: Target,
              color: "text-pink-400",
              bg: "bg-pink-500/20",
              change: "-2%",
            },
            {
              label: "Avg Rating",
              value: stats.avgRating,
              icon: Star,
              color: "text-orange-400",
              bg: "bg-orange-500/20",
              change: "+0.1",
            },
            {
              label: "Revenue",
              value: stats.revenue,
              icon: DollarSign,
              color: "text-purple-400",
              bg: "bg-purple-500/20",
              change: "+23%",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className='group bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all hover:bg-white/10 cursor-pointer'
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
            </div>
          ))}
        </div>

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
              {usersByMonth.map((month, idx) => (
                <div key={idx} className='flex flex-col items-center space-y-2'>
                  <div
                    className='w-8 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all hover:from-blue-400 hover:to-purple-400'
                    style={{ height: `${(month.count / 300) * 100}%` }}
                  ></div>
                  <span className='text-xs text-gray-400'>{month.month}</span>
                </div>
              ))}
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold'>Projects by Domain</h2>
              <Eye className='w-5 h-5 text-gray-400 hover:text-white cursor-pointer' />
            </div>
            <div className='w-full h-48 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-lg flex items-center justify-center'>
              <div className='grid grid-cols-2 gap-4 w-full p-4'>
                {projectsByDomain.map((domain, idx) => (
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
                        style={{ width: `${(domain.count / 240) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Dashboard Row */}
        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Recent Alerts */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold'>Recent Alerts</h2>
              <Zap className='w-5 h-5 text-yellow-400' />
            </div>
            <ul className='space-y-3'>
              {recentAlerts.map((alert) => (
                <li
                  key={alert.id}
                  className='flex items-start space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors'
                >
                  <div
                    className={`w-3 h-3 rounded-full mt-1 ${alert.alert ? "bg-red-500 animate-pulse" : "bg-green-500"}`}
                  ></div>
                  <div className='flex-1'>
                    <span className='text-gray-300 text-sm'>
                      {alert.message}
                    </span>
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
                  className='flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors'
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
                  className='flex items-start space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors'
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

        {/* Enhanced Quick Actions */}
        <div className='bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold'>Quick Actions</h3>
            <Shield className='w-5 h-5 text-green-400' />
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <button className='group flex items-center space-x-3 p-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all hover:scale-105'>
              <div className='p-2 bg-blue-500/30 rounded-lg group-hover:bg-blue-500/40 transition-colors'>
                <Users className='w-5 h-5 text-blue-400' />
              </div>
              <div className='text-left'>
                <p className='text-sm font-medium'>Manage Users</p>
                <p className='text-xs text-gray-400'>1,250 total</p>
              </div>
            </button>
            <button className='group flex items-center space-x-3 p-4 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-all hover:scale-105'>
              <div className='p-2 bg-green-500/30 rounded-lg group-hover:bg-green-500/40 transition-colors'>
                <BarChart3 className='w-5 h-5 text-green-400' />
              </div>
              <div className='text-left'>
                <p className='text-sm font-medium'>View Reports</p>
                <p className='text-xs text-gray-400'>Generate new</p>
              </div>
            </button>
            <button className='group flex items-center space-x-3 p-4 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-all hover:scale-105'>
              <div className='p-2 bg-purple-500/30 rounded-lg group-hover:bg-purple-500/40 transition-colors'>
                <PieChart className='w-5 h-5 text-purple-400' />
              </div>
              <div className='text-left'>
                <p className='text-sm font-medium'>Domain Analytics</p>
                <p className='text-xs text-gray-400'>Deep dive</p>
              </div>
            </button>
            <button className='group flex items-center space-x-3 p-4 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-all hover:scale-105'>
              <div className='p-2 bg-yellow-500/30 rounded-lg group-hover:bg-yellow-500/40 transition-colors'>
                <Settings className='w-5 h-5 text-yellow-400' />
              </div>
              <div className='text-left'>
                <p className='text-sm font-medium'>Admin Settings</p>
                <p className='text-xs text-gray-400'>Configure</p>
              </div>
            </button>
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
