import React, { useState, useEffect } from "react";
import {
  Bell,
  MessageSquare,
  Star,
  Calendar,
  TrendingUp,
  Code,
  Users,
  Target,
  Award,
  Zap,
  Search,
  Filter,
  ChevronRight,
  Github,
  Linkedin,
  Database,
  Clock,
  DollarSign,
  MapPin,
  Settings,
  LogOut,
  User,
  BookOpen,
  Activity,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  ThumbsUp,
  Briefcase,
  BarChart3,
  PieChart,
  TrendingDown,
} from "lucide-react";

export default function DeveloperView() {
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState(8);
  const [messages, setMessages] = useState(3);

  // Mock data for dashboard
  const userStats = {
    xp: 2850,
    level: 7,
    badges: 12,
    projects: 8,
    rating: 4.8,
    matches: 15,
  };

  const recentProjects = [
    {
      id: 1,
      title: "E-commerce Mobile App",
      company: "TechStart Inc",
      status: "In Progress",
      progress: 75,
      payment: "$2,500",
      deadline: "2024-08-15",
      skills: ["React Native", "Node.js", "MongoDB"],
    },
    {
      id: 2,
      title: "AI Chat Bot Development",
      company: "InnovateAI",
      status: "Under Review",
      progress: 100,
      payment: "$1,800",
      deadline: "2024-07-28",
      skills: ["Python", "TensorFlow", "FastAPI"],
    },
    {
      id: 3,
      title: "Open Source Library",
      company: "Community Project",
      status: "Active",
      progress: 45,
      payment: "Unpaid",
      deadline: "2024-09-01",
      skills: ["TypeScript", "React", "Jest"],
    },
  ];

  const matchedProjects = [
    {
      id: 1,
      title: "Full Stack Web Application",
      company: "StartupCorp",
      match: 95,
      payment: "$3,000",
      duration: "6 weeks",
      skills: ["React", "Node.js", "PostgreSQL"],
      posted: "2 hours ago",
    },
    {
      id: 2,
      title: "Mobile Game Development",
      company: "GameStudio",
      match: 88,
      payment: "$4,500",
      duration: "10 weeks",
      skills: ["Unity", "C#", "3D Modeling"],
      posted: "5 hours ago",
    },
    {
      id: 3,
      title: "DevOps Infrastructure Setup",
      company: "CloudTech",
      match: 82,
      payment: "$2,200",
      duration: "4 weeks",
      skills: ["AWS", "Docker", "Kubernetes"],
      posted: "1 day ago",
    },
  ];

  const skillGaps = [
    { skill: "Machine Learning", gap: 35, trend: "high" },
    { skill: "Cloud Architecture", gap: 28, trend: "medium" },
    { skill: "Blockchain", gap: 45, trend: "high" },
    { skill: "Mobile Development", gap: 15, trend: "low" },
  ];

  const recentNotifications = [
    {
      id: 1,
      type: "match",
      title: "New Project Match",
      message: "95% match found for Full Stack Developer position",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      type: "message",
      title: "New Message",
      message: "TechStart Inc sent you a message about the mobile app project",
      time: "4 hours ago",
      unread: true,
    },
    {
      id: 3,
      type: "achievement",
      title: "Badge Earned",
      message: "Congratulations! You've earned the 'Code Mentor' badge",
      time: "1 day ago",
      unread: false,
    },
  ];

  const portfolioSync = {
    github: { status: "synced", score: 87, lastSync: "2 hours ago" },
    linkedin: { status: "synced", score: 92, lastSync: "1 day ago" },
    stackoverflow: { status: "pending", score: 78, lastSync: "3 days ago" },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-500";
      case "Under Review":
        return "bg-yellow-500";
      case "Active":
        return "bg-green-500";
      case "Completed":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMatchColor = (match) => {
    if (match >= 90) return "text-green-400";
    if (match >= 80) return "text-blue-400";
    if (match >= 70) return "text-yellow-400";
    return "text-gray-400";
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
      {/* Header */}
      <header className='bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            {/* Logo */}
            <div className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center'>
                <Code className='w-5 h-5 text-white' />
              </div>
              <span className='hidden sm:inline text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                SkillBridge Pro
              </span>
            </div>

            {/* Search Bar */}
            <div className='hidden md:flex flex-1 max-w-md mx-8'>
              <div className='relative w-full'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                <input
                  type='text'
                  placeholder='Search projects, skills, or companies...'
                  className='w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>
            </div>

            {/* Actions */}
            <div className='flex items-center space-x-4'>
              <button className='relative p-2 rounded-lg hover:bg-white/10 transition-colors'>
                <Bell className='w-5 h-5' />
                {notifications > 0 && (
                  <span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs rounded-full flex items-center justify-center'>
                    {notifications}
                  </span>
                )}
              </button>
              <button className='relative p-2 rounded-lg hover:bg-white/10 transition-colors'>
                <MessageSquare className='w-5 h-5' />
                {messages > 0 && (
                  <span className='absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-xs rounded-full flex items-center justify-center'>
                    {messages}
                  </span>
                )}
              </button>
              <div className='flex items-center space-x-2'>
                <img
                  src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
                  alt='Profile'
                  className='w-8 h-8 rounded-full'
                />
                <span className='hidden sm:block text-sm font-medium'>
                  John Doe
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Welcome Section */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold mb-2'>Welcome back, John! 👋</h1>
          <p className='text-gray-300'>
            Here's what's happening with your projects and opportunities today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8'>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>XP Points</p>
                <p className='text-2xl font-bold text-blue-400'>
                  {userStats.xp}
                </p>
              </div>
              <Zap className='w-8 h-8 text-blue-400' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Level</p>
                <p className='text-2xl font-bold text-purple-400'>
                  {userStats.level}
                </p>
              </div>
              <Award className='w-8 h-8 text-purple-400' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Badges</p>
                <p className='text-2xl font-bold text-yellow-400'>
                  {userStats.badges}
                </p>
              </div>
              <Star className='w-8 h-8 text-yellow-400' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Projects</p>
                <p className='text-2xl font-bold text-green-400'>
                  {userStats.projects}
                </p>
              </div>
              <Briefcase className='w-8 h-8 text-green-400' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Rating</p>
                <p className='text-2xl font-bold text-orange-400'>
                  {userStats.rating}
                </p>
              </div>
              <Star className='w-8 h-8 text-orange-400 fill-current' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Matches</p>
                <p className='text-2xl font-bold text-pink-400'>
                  {userStats.matches}
                </p>
              </div>
              <Target className='w-8 h-8 text-pink-400' />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Left Column - Main Content */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Recent Projects */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold'>Recent Projects</h2>
                <button className='text-blue-400 hover:text-blue-300 text-sm flex items-center'>
                  View All <ChevronRight className='w-4 h-4 ml-1' />
                </button>
              </div>
              <div className='space-y-4'>
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className='bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all'
                  >
                    <div className='flex items-start justify-between mb-3'>
                      <div>
                        <h3 className='font-semibold mb-1'>{project.title}</h3>
                        <p className='text-gray-400 text-sm'>
                          {project.company}
                        </p>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <span
                          className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(project.status)}`}
                        >
                          {project.status}
                        </span>
                        <span className='text-green-400 font-medium'>
                          {project.payment}
                        </span>
                      </div>
                    </div>
                    <div className='mb-3'>
                      <div className='flex items-center justify-between text-sm text-gray-400 mb-1'>
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className='w-full bg-gray-700 rounded-full h-2'>
                        <div
                          className='bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300'
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='flex flex-wrap gap-1'>
                        {project.skills.map((skill, index) => (
                          <span
                            key={index}
                            className='px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs'
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className='flex items-center text-gray-400 text-sm'>
                        <Clock className='w-4 h-4 mr-1' />
                        {project.deadline}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Matched Projects */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold'>Matched Projects</h2>
                <button className='text-blue-400 hover:text-blue-300 text-sm flex items-center'>
                  View All <ChevronRight className='w-4 h-4 ml-1' />
                </button>
              </div>
              <div className='space-y-4'>
                {matchedProjects.map((project) => (
                  <div
                    key={project.id}
                    className='bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all'
                  >
                    <div className='flex items-start justify-between mb-3'>
                      <div>
                        <h3 className='font-semibold mb-1'>{project.title}</h3>
                        <p className='text-gray-400 text-sm'>
                          {project.company}
                        </p>
                      </div>
                      <div className='text-right'>
                        <div
                          className={`text-lg font-bold ${getMatchColor(project.match)}`}
                        >
                          {project.match}% Match
                        </div>
                        <div className='text-green-400 font-medium'>
                          {project.payment}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center justify-between mb-3'>
                      <div className='flex flex-wrap gap-1'>
                        {project.skills.map((skill, index) => (
                          <span
                            key={index}
                            className='px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs'
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className='text-gray-400 text-sm'>
                        {project.duration}
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-gray-400 text-sm'>
                        Posted {project.posted}
                      </span>
                      <div className='flex space-x-2'>
                        <button className='px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm transition-colors'>
                          Apply
                        </button>
                        <button className='px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors'>
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className='space-y-6'>
            {/* Portfolio Sync */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <h3 className='text-lg font-semibold mb-4'>Portfolio Sync</h3>
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <Github className='w-5 h-5 text-gray-400' />
                    <span className='text-sm'>GitHub</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm text-green-400'>87%</span>
                    <CheckCircle className='w-4 h-4 text-green-400' />
                  </div>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <Linkedin className='w-5 h-5 text-gray-400' />
                    <span className='text-sm'>LinkedIn</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm text-green-400'>92%</span>
                    <CheckCircle className='w-4 h-4 text-green-400' />
                  </div>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-2'>
                    <Database className='w-5 h-5 text-gray-400' />
                    <span className='text-sm'>Stack Overflow</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm text-yellow-400'>78%</span>
                    <AlertCircle className='w-4 h-4 text-yellow-400' />
                  </div>
                </div>
              </div>
              <button className='w-full mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm transition-colors'>
                Sync All Platforms
              </button>
            </div>

            {/* Skill Gap Analysis */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <h3 className='text-lg font-semibold mb-4'>Skill Gap Analysis</h3>
              <div className='space-y-3'>
                {skillGaps.map((item, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between'
                  >
                    <div className='flex items-center space-x-2'>
                      <span className='text-sm'>{item.skill}</span>
                      {item.trend === "high" && (
                        <TrendingUp className='w-4 h-4 text-green-400' />
                      )}
                      {item.trend === "medium" && (
                        <Activity className='w-4 h-4 text-yellow-400' />
                      )}
                      {item.trend === "low" && (
                        <TrendingDown className='w-4 h-4 text-red-400' />
                      )}
                    </div>
                    <span className='text-sm text-red-400'>
                      {item.gap}% gap
                    </span>
                  </div>
                ))}
              </div>
              <button className='w-full mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-sm transition-colors'>
                View Learning Paths
              </button>
            </div>

            {/* Recent Notifications */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <h3 className='text-lg font-semibold mb-4'>
                Recent Notifications
              </h3>
              <div className='space-y-3'>
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg ${notification.unread ? "bg-blue-500/10 border border-blue-500/20" : "bg-white/5"}`}
                  >
                    <div className='flex items-start justify-between'>
                      <div>
                        <h4 className='text-sm font-medium'>
                          {notification.title}
                        </h4>
                        <p className='text-xs text-gray-400 mt-1'>
                          {notification.message}
                        </p>
                      </div>
                      {notification.unread && (
                        <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                      )}
                    </div>
                    <p className='text-xs text-gray-500 mt-2'>
                      {notification.time}
                    </p>
                  </div>
                ))}
              </div>
              <button className='w-full mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors'>
                View All Notifications
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='mt-8 bg-white/5 border border-white/10 rounded-xl p-6'>
          <h3 className='text-lg font-semibold mb-4'>Quick Actions</h3>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <button className='flex items-center space-x-2 p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors'>
              <Search className='w-5 h-5 text-blue-400' />
              <span className='text-sm'>Find Projects</span>
            </button>
            <button className='flex items-center space-x-2 p-3 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors'>
              <Plus className='w-5 h-5 text-green-400' />
              <span className='text-sm'>Create Project</span>
            </button>
            <button className='flex items-center space-x-2 p-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors'>
              <BookOpen className='w-5 h-5 text-purple-400' />
              <span className='text-sm'>Learn Skills</span>
            </button>
            <button className='flex items-center space-x-2 p-3 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors'>
              <Award className='w-5 h-5 text-yellow-400' />
              <span className='text-sm'>View Badges</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
