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
import Navbar from "../../../components/header/dashboard";
import { useSelector } from "react-redux";

export default function ProjectOwnerView() {
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState(5);
  const user = useSelector((state) => state.user.user);
  const [messages, setMessages] = useState(2);

  // Mock data for Project Owner dashboard
  const ownerStats = {
    activeProjects: 10,
    completedProjects: 24,
    teamMembers: 12,
    totalBudget: "$125,000",
    rating: 4.6,
    openPositions: 7,
  };

  const activeProjects = [
    {
      id: 1,
      title: "Next Gen Web Platform",
      client: "Alpha Corp",
      status: "In Progress",
      progress: 65,
      budget: "$20,000",
      deadline: "2024-09-15",
      skillsRequired: ["React", "Node.js", "AWS"],
    },
    {
      id: 2,
      title: "AI Customer Support Bot",
      client: "Beta Solutions",
      status: "Planning",
      progress: 15,
      budget: "$15,000",
      deadline: "2024-11-30",
      skillsRequired: ["Python", "TensorFlow", "NLP"],
    },
    {
      id: 3,
      title: "Mobile Banking App",
      client: "FinTech Ltd",
      status: "Under Review",
      progress: 95,
      budget: "$35,000",
      deadline: "2024-08-30",
      skillsRequired: ["React Native", "Firebase", "Stripe"],
    },
  ];

  const teamMembers = [
    {
      id: 1,
      name: "Alice Johnson",
      role: "Frontend Developer",
      skills: ["React", "TypeScript", "CSS"],
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 2,
      name: "Mark Wilson",
      role: "Backend Developer",
      skills: ["Node.js", "Express", "MongoDB"],
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    },
    {
      id: 3,
      name: "Sophie Lee",
      role: "QA Engineer",
      skills: ["Automation", "Selenium", "Jest"],
      avatar: "https://randomuser.me/api/portraits/women/48.jpg",
    },
  ];

  const recentNotifications = [
    {
      id: 1,
      type: "project",
      title: "Project Update",
      message: "Mobile Banking App is nearing completion.",
      time: "3 hours ago",
      unread: true,
    },
    {
      id: 2,
      type: "message",
      title: "New Message",
      message:
        "Alice Johnson sent you a message regarding the Next Gen Web Platform.",
      time: "1 day ago",
      unread: false,
    },
    {
      id: 3,
      type: "alert",
      title: "Budget Alert",
      message: "Project 'AI Customer Support Bot' is approaching budget limit.",
      time: "2 days ago",
      unread: true,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-500";
      case "Planning":
        return "bg-yellow-500";
      case "Under Review":
        return "bg-purple-500";
      case "Completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
      {/* Header */}
      <Navbar notifications={notifications} messages={messages} data={user} />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Welcome Section */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold mb-2'>Welcome back, John! 👋</h1>
          <p className='text-gray-300'>
            Here's the latest update on your projects, teams, and budgets.
          </p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8'>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Active Projects</p>
                <p className='text-2xl font-bold text-blue-400'>
                  {ownerStats.activeProjects}
                </p>
              </div>
              <Briefcase className='w-8 h-8 text-blue-400' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Completed Projects</p>
                <p className='text-2xl font-bold text-purple-400'>
                  {ownerStats.completedProjects}
                </p>
              </div>
              <CheckCircle className='w-8 h-8 text-purple-400' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Team Members</p>
                <p className='text-2xl font-bold text-yellow-400'>
                  {ownerStats.teamMembers}
                </p>
              </div>
              <Users className='w-8 h-8 text-yellow-400' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Total Budget</p>
                <p className='text-2xl font-bold text-green-400'>
                  {ownerStats.totalBudget}
                </p>
              </div>
              <DollarSign className='w-8 h-8 text-green-400' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Rating</p>
                <p className='text-2xl font-bold text-orange-400'>
                  {ownerStats.rating}
                </p>
              </div>
              <Star className='w-8 h-8 text-orange-400 fill-current' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Open Positions</p>
                <p className='text-2xl font-bold text-pink-400'>
                  {ownerStats.openPositions}
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
            {/* Active Projects */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold'>Active Projects</h2>
                <button className='text-blue-400 hover:text-blue-300 text-sm flex items-center'>
                  View All <ChevronRight className='w-4 h-4 ml-1' />
                </button>
              </div>
              <div className='space-y-4'>
                {activeProjects.map((project) => (
                  <div
                    key={project.id}
                    className='bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all'
                  >
                    <div className='flex items-start justify-between mb-3'>
                      <div>
                        <h3 className='font-semibold mb-1'>{project.title}</h3>
                        <p className='text-gray-400 text-sm'>
                          {project.client}
                        </p>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <span
                          className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {project.status}
                        </span>
                        <span className='text-green-400 font-medium'>
                          {project.budget}
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
                        {project.skillsRequired.map((skill, index) => (
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

            {/* Team Members */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold'>Team Members</h2>
                <button className='text-blue-400 hover:text-blue-300 text-sm flex items-center'>
                  View All <ChevronRight className='w-4 h-4 ml-1' />
                </button>
              </div>
              <div className='space-y-4'>
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className='flex items-center space-x-4 bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all'
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className='w-10 h-10 rounded-full object-cover'
                    />
                    <div className='flex-1'>
                      <h3 className='font-semibold'>{member.name}</h3>
                      <p className='text-gray-400 text-sm'>{member.role}</p>
                      <div className='flex flex-wrap gap-1 mt-1'>
                        {member.skills.map((skill, i) => (
                          <span
                            key={i}
                            className='px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs'
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button className='px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm transition-colors'>
                      Message
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className='space-y-6'>
            {/* Recent Notifications */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <h3 className='text-lg font-semibold mb-4'>
                Recent Notifications
              </h3>
              <div className='space-y-3'>
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg ${
                      notification.unread
                        ? "bg-blue-500/10 border border-blue-500/20"
                        : "bg-white/5"
                    }`}
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

            {/* Quick Actions */}
            <div className='mt-8 bg-white/5 border border-white/10 rounded-xl p-6'>
              <h3 className='text-lg font-semibold mb-4'>Quick Actions</h3>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <button className='flex items-center space-x-2 p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors'>
                  <Plus className='w-5 h-5 text-blue-400' />
                  <span className='text-sm'>Create Project</span>
                </button>
                <button className='flex items-center space-x-2 p-3 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors'>
                  <Users className='w-5 h-5 text-green-400' />
                  <span className='text-sm'>Manage Team</span>
                </button>
                <button className='flex items-center space-x-2 p-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors'>
                  <BarChart3 className='w-5 h-5 text-purple-400' />
                  <span className='text-sm'>View Analytics</span>
                </button>
                <button className='flex items-center space-x-2 p-3 bg-pink-500/20 hover:bg-pink-500/30 rounded-lg transition-colors'>
                  <Settings className='w-5 h-5 text-pink-400' />
                  <span className='text-sm'>Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
