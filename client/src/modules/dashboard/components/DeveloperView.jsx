import React, { useState, useEffect } from "react";
import Button from '../../../components/Button';
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
  MessageCircle,
  FileText,
  ExternalLink,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  Timer,
  Trophy,
  Flame,
  Brain,
  Rocket,
  Shield,
  Heart,
  Sparkles,
} from "lucide-react";
import { Layout } from "../../../components";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function DeveloperView() {
  const [activeTab, setActiveTab] = useState("overview");
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  // Enhanced mock data for developer dashboard
  const userStats = {
    xp: 2850,
    level: 7,
    badges: 12,
    projects: 8,
    rating: 4.8,
    matches: 15,
    streak: 23,
    weeklyGoal: 85,
    totalEarnings: "$12,450",
    responseRate: 94,
  };

  const gamificationStats = {
    currentStreak: 23,
    longestStreak: 45,
    weeklyGoal: 85,
    monthlyGoal: 350,
    achievements: [
      { name: "Code Master", icon: Code, earned: true, date: "2024-01-15" },
      { name: "Team Player", icon: Users, earned: true, date: "2024-01-20" },
      { name: "Speed Demon", icon: Zap, earned: true, date: "2024-02-01" },
      { name: "Problem Solver", icon: Brain, earned: false, progress: 75 },
      { name: "Innovation Leader", icon: Rocket, earned: false, progress: 60 },
    ],
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
      priority: "high",
      timeSpent: "32h",
      estimatedTime: "40h",
      applicationStatus: "accepted",
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
      priority: "medium",
      timeSpent: "28h",
      estimatedTime: "30h",
      applicationStatus: "completed",
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
      priority: "low",
      timeSpent: "18h",
      estimatedTime: "50h",
      applicationStatus: "in_progress",
    },
  ];

  const activeTasks = [
    {
      id: 1,
      title: "Implement user authentication",
      project: "E-commerce Mobile App",
      priority: "high",
      dueDate: "2024-08-10",
      estimatedTime: "4h",
      status: "in_progress",
    },
    {
      id: 2,
      title: "Write unit tests for API endpoints",
      project: "AI Chat Bot Development",
      priority: "medium",
      dueDate: "2024-08-12",
      estimatedTime: "2h",
      status: "pending",
    },
    {
      id: 3,
      title: "Code review for pull request #45",
      project: "Open Source Library",
      priority: "low",
      dueDate: "2024-08-15",
      estimatedTime: "1h",
      status: "pending",
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
      urgency: "high",
      type: "full-time",
      location: "Remote",
      description: "Build a modern web application for managing customer relationships",
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
      urgency: "medium",
      type: "contract",
      location: "Hybrid",
      description: "Create an engaging mobile game with multiplayer features",
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
      urgency: "low",
      type: "part-time",
      location: "Remote",
      description: "Set up and maintain cloud infrastructure for a growing startup",
    },
  ];

  const invitations = [
    {
      id: 1,
      from: "TechCorp Solutions",
      project: "AI-Powered Analytics Dashboard",
      message: "We'd love to have you join our team for this exciting project!",
      sent: "1 hour ago",
      status: "pending",
      priority: "high",
    },
    {
      id: 2,
      from: "InnovateLab",
      project: "Blockchain Integration",
      message: "Your expertise in smart contracts would be perfect for this role.",
      sent: "3 hours ago",
      status: "pending",
      priority: "medium",
    },
    {
      id: 3,
      from: "DataFlow Inc",
      project: "Machine Learning Pipeline",
      message: "We're impressed by your ML portfolio and would like to discuss collaboration.",
      sent: "1 day ago",
      status: "viewed",
      priority: "low",
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
      message: "95% match found for Full Stack Developer position at StartupCorp",
      time: "2 hours ago",
      unread: true,
      priority: "high",
      action: "View Project",
    },
    {
      id: 2,
      type: "invitation",
      title: "Project Invitation",
      message: "TechCorp Solutions invited you to join their AI Analytics project",
      time: "3 hours ago",
      unread: true,
      priority: "high",
      action: "Respond",
    },
    {
      id: 3,
      type: "message",
      title: "New Message",
      message: "TechStart Inc sent you a message about the mobile app project",
      time: "4 hours ago",
      unread: true,
      priority: "medium",
      action: "Reply",
    },
    {
      id: 4,
      type: "task_reminder",
      title: "Task Reminder",
      message: "Don't forget: Code review for PR #45 is due tomorrow",
      time: "6 hours ago",
      unread: false,
      priority: "medium",
      action: "View Task",
    },
    {
      id: 5,
      type: "achievement",
      title: "Badge Earned",
      message: "Congratulations! You've earned the 'Code Mentor' badge",
      time: "1 day ago",
      unread: false,
      priority: "low",
      action: "View Badge",
    },
    {
      id: 6,
      type: "deadline",
      title: "Deadline Approaching",
      message: "E-commerce Mobile App deadline is in 3 days",
      time: "2 days ago",
      unread: false,
      priority: "high",
      action: "View Project",
    },
  ];

  const portfolioSync = {
    github: { status: "synced", score: 87, lastSync: "2 hours ago", commits: 156, repos: 23 },
    linkedin: { status: "synced", score: 92, lastSync: "1 day ago", connections: 450, endorsements: 89 },
    stackoverflow: { status: "pending", score: 78, lastSync: "3 days ago", reputation: 1250, answers: 45 },
    behance: { status: "synced", score: 95, lastSync: "1 week ago", projects: 8, views: 2340 },
  };

  const quickAccessLinks = [
    { name: "AI Career Tools", icon: Brain, color: "blue", description: "AI-powered career guidance", path: "/ai-career" },
    { name: "Portfolio Sync", icon: Database, color: "purple", description: "Sync your profiles", path: "/portfolio-sync" },
    { name: "Communication", icon: MessageCircle, color: "green", description: "Chat with teams", path: "/chat" },
    { name: "Learning Paths", icon: BookOpen, color: "yellow", description: "Skill development", path: "/ai-career" },
    { name: "Gamification", icon: Trophy, color: "orange", description: "Track achievements", path: "/gamification" },
  ];

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
    <Layout isSearchBar={true}>
        {/* Enhanced Welcome Section */}
        <div className='mb-8'>
          <div className="flex items-center justify-between">
            <div>
              <h1 className='text-3xl font-bold mb-2'>Welcome back, {user?.name || 'Developer'}! 👋</h1>
              <p className='text-gray-300'>
                Here's what's happening with your projects and opportunities today.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Current Streak</p>
                <p className="text-2xl font-bold text-orange-400 flex items-center gap-2">
                  <Flame className="w-6 h-6" />
                  {gamificationStats.currentStreak} days
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Weekly Goal</p>
                <p className="text-2xl font-bold text-green-400 flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  {gamificationStats.weeklyGoal}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8'>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>XP Points</p>
                <p className='text-2xl font-bold text-blue-400'>
                  {userStats.xp.toLocaleString()}
                </p>
                <p className='text-xs text-gray-500'>+150 this week</p>
              </div>
              <Zap className='w-8 h-8 text-blue-400 group-hover:animate-pulse' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Level</p>
                <p className='text-2xl font-bold text-purple-400'>
                  {userStats.level}
                </p>
                <p className='text-xs text-gray-500'>150 XP to next</p>
              </div>
              <Award className='w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Badges</p>
                <p className='text-2xl font-bold text-yellow-400'>
                  {userStats.badges}
                </p>
                <p className='text-xs text-gray-500'>2 new this month</p>
              </div>
              <Star className='w-8 h-8 text-yellow-400 group-hover:animate-spin' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Active Projects</p>
                <p className='text-2xl font-bold text-green-400'>
                  {userStats.projects}
                </p>
                <p className='text-xs text-gray-500'>3 in progress</p>
              </div>
              <Briefcase className='w-8 h-8 text-green-400 group-hover:scale-110 transition-transform' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Rating</p>
                <p className='text-2xl font-bold text-orange-400'>
                  {userStats.rating}
                </p>
                <p className='text-xs text-gray-500'>Based on 24 reviews</p>
              </div>
              <Star className='w-8 h-8 text-orange-400 fill-current group-hover:animate-pulse' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>New Matches</p>
                <p className='text-2xl font-bold text-pink-400'>
                  {userStats.matches}
                </p>
                <p className='text-xs text-gray-500'>This week</p>
              </div>
              <Target className='w-8 h-8 text-pink-400 group-hover:scale-110 transition-transform' />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Left Column - Main Content */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Active Tasks */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <CheckCircle2 className='w-6 h-6 text-green-400' />
                  Active Tasks
                </h2>
                <Button 
                  onClick={() => navigate('/project')}
                  variant="ghost"
                  className='text-blue-400 hover:text-blue-300 text-sm flex items-center'
                >
                  View All <ChevronRight className='w-4 h-4 ml-1' />
                </Button>
              </div>
              <div className='space-y-3'>
                {activeTasks.map((task) => (
                  <div
                    key={task.id}
                    className='bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all'
                  >
                    <div className='flex items-start justify-between mb-2'>
                      <div className='flex-1'>
                        <h3 className='font-semibold mb-1'>{task.title}</h3>
                        <p className='text-gray-400 text-sm'>{task.project}</p>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className={`px-2 py-1 rounded text-xs ${
                          task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {task.priority}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          task.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className='flex items-center justify-between text-sm text-gray-400'>
                      <div className='flex items-center gap-4'>
                        <span className='flex items-center gap-1'>
                          <Clock className='w-4 h-4' />
                          Due: {task.dueDate}
                        </span>
                        <span className='flex items-center gap-1'>
                          <Timer className='w-4 h-4' />
                          {task.estimatedTime}
                        </span>
                      </div>
                      <Button 
                        className='px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm transition-colors'
                      >
                        {task.status === 'in_progress' ? 'Continue' : 'Start'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Invitations */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <MessageSquare className='w-6 h-6 text-blue-400' />
                  Project Invitations
                </h2>
                <Button 
                  onClick={() => navigate('/notifications')}
                  variant="ghost"
                  className='text-blue-400 hover:text-blue-300 text-sm flex items-center'
                >
                  View All <ChevronRight className='w-4 h-4 ml-1' />
                </Button>
              </div>
              <div className='space-y-3'>
                {invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className={`bg-white/5 border rounded-lg p-4 hover:border-white/20 transition-all ${
                      invitation.status === 'pending' ? 'border-blue-500/30 bg-blue-500/5' : 'border-white/10'
                    }`}
                  >
                    <div className='flex items-start justify-between mb-2'>
                      <div className='flex-1'>
                        <h3 className='font-semibold mb-1'>{invitation.project}</h3>
                        <p className='text-gray-400 text-sm'>{invitation.from}</p>
                        <p className='text-gray-300 text-sm mt-1'>{invitation.message}</p>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className={`px-2 py-1 rounded text-xs ${
                          invitation.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          invitation.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {invitation.priority}
                        </span>
                        {invitation.status === 'pending' && (
                          <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
                        )}
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-gray-400 text-sm'>{invitation.sent}</span>
                      <div className='flex gap-2'>
                        <Button 
                          className='px-3 py-1 bg-green-500 hover:bg-green-600 rounded text-sm transition-colors'
                        >
                          Accept
                        </Button>
                        <Button 
                          className='px-3 py-1 bg-gray-500 hover:bg-gray-600 rounded text-sm transition-colors'
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Projects */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold'>Recent Projects</h2>
                <Button 
                  variant="ghost"
                  className='text-blue-400 hover:text-blue-300 text-sm flex items-center'
                >
                  View All <ChevronRight className='w-4 h-4 ml-1' />
                </Button>
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
                        <div className='flex items-center gap-2 mt-1'>
                          <span className={`px-2 py-1 rounded text-xs ${
                            project.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            project.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {project.priority}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            project.applicationStatus === 'accepted' ? 'bg-green-500/20 text-green-400' :
                            project.applicationStatus === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {project.applicationStatus.replace('_', ' ')}
                          </span>
                        </div>
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
                      <div className='flex items-center gap-4 text-gray-400 text-sm'>
                        <div className='flex items-center gap-1'>
                          <Clock className='w-4 h-4' />
                          {project.deadline}
                        </div>
                        <div className='flex items-center gap-1'>
                          <Timer className='w-4 h-4' />
                          {project.timeSpent}/{project.estimatedTime}
                        </div>
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
                <Button 
                  variant="ghost"
                  className='text-blue-400 hover:text-blue-300 text-sm flex items-center'
                >
                  View All <ChevronRight className='w-4 h-4 ml-1' />
                </Button>
              </div>
              <div className='space-y-4'>
                {matchedProjects.map((project) => (
                  <div
                    key={project.id}
                    className='bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all'
                  >
                    <div className='flex items-start justify-between mb-3'>
                      <div className='flex-1'>
                        <h3 className='font-semibold mb-1'>{project.title}</h3>
                        <p className='text-gray-400 text-sm mb-1'>
                          {project.company}
                        </p>
                        <p className='text-gray-300 text-xs mb-2'>
                          {project.description}
                        </p>
                        <div className='flex items-center gap-2'>
                          <span className={`px-2 py-1 rounded text-xs ${
                            project.urgency === 'high' ? 'bg-red-500/20 text-red-400' :
                            project.urgency === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {project.urgency}
                          </span>
                          <span className='px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs'>
                            {project.type}
                          </span>
                          <span className='px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs'>
                            {project.location}
                          </span>
                        </div>
                      </div>
                      <div className='text-right ml-4'>
                        <div
                          className={`text-lg font-bold ${getMatchColor(project.match)}`}
                        >
                          {project.match}% Match
                        </div>
                        <div className='text-green-400 font-medium'>
                          {project.payment}
                        </div>
                        <div className='text-gray-400 text-sm'>
                          {project.duration}
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
                        <Button 
                          className='px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm transition-colors'
                        >
                          Apply
                        </Button>
                        <Button 
                          className='px-3 py-1 bg-white/10 hover:bg-gray-600/50 rounded text-sm transition-colors'
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className='space-y-6'>
            {/* Gamification Stats */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <Trophy className='w-5 h-5 text-yellow-400' />
                Gamification
              </h3>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-400'>Current Streak</span>
                  <div className='flex items-center gap-2'>
                    <Flame className='w-4 h-4 text-orange-400' />
                    <span className='text-lg font-bold text-orange-400'>{gamificationStats.currentStreak} days</span>
                  </div>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-400'>Longest Streak</span>
                  <span className='text-lg font-bold text-purple-400'>{gamificationStats.longestStreak} days</span>
                </div>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-400'>Weekly Goal</span>
                    <span className='text-sm text-green-400'>{gamificationStats.weeklyGoal}%</span>
                  </div>
                  <div className='w-full bg-gray-700 rounded-full h-2'>
                    <div
                      className='bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300'
                      style={{ width: `${gamificationStats.weeklyGoal}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <Award className='w-5 h-5 text-yellow-400' />
                Achievements
              </h3>
              <div className='space-y-3'>
                {gamificationStats.achievements.map((achievement, index) => (
                  <div key={index} className='flex items-center gap-3 p-2 rounded-lg bg-white/5'>
                    <div className={`p-2 rounded-lg ${
                      achievement.earned ? 'bg-yellow-500/20' : 'bg-gray-500/20'
                    }`}>
                      <achievement.icon className={`w-4 h-4 ${
                        achievement.earned ? 'text-yellow-400' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className='flex-1'>
                      <p className={`text-sm font-medium ${
                        achievement.earned ? 'text-white' : 'text-gray-400'
                      }`}>
                        {achievement.name}
                      </p>
                      {achievement.earned ? (
                        <p className='text-xs text-gray-400'>Earned {achievement.date}</p>
                      ) : (
                        <div className='flex items-center gap-2'>
                          <div className='w-full bg-gray-700 rounded-full h-1'>
                            <div
                              className='bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all duration-300'
                              style={{ width: `${achievement.progress}%` }}
                            ></div>
                          </div>
                          <span className='text-xs text-gray-400'>{achievement.progress}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Portfolio Sync */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <Database className='w-5 h-5 text-blue-400' />
                Portfolio Sync
              </h3>
              <div className='space-y-3'>
                <div className='flex items-center justify-between p-3 rounded-lg bg-white/5'>
                  <div className='flex items-center space-x-3'>
                    <Github className='w-5 h-5 text-gray-400' />
                    <div>
                      <span className='text-sm font-medium'>GitHub</span>
                      <p className='text-xs text-gray-400'>{portfolioSync.github.commits} commits, {portfolioSync.github.repos} repos</p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm text-green-400'>{portfolioSync.github.score}%</span>
                    <CheckCircle className='w-4 h-4 text-green-400' />
                  </div>
                </div>
                <div className='flex items-center justify-between p-3 rounded-lg bg-white/5'>
                  <div className='flex items-center space-x-3'>
                    <Linkedin className='w-5 h-5 text-gray-400' />
                    <div>
                      <span className='text-sm font-medium'>LinkedIn</span>
                      <p className='text-xs text-gray-400'>{portfolioSync.linkedin.connections} connections, {portfolioSync.linkedin.endorsements} endorsements</p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm text-green-400'>{portfolioSync.linkedin.score}%</span>
                    <CheckCircle className='w-4 h-4 text-green-400' />
                  </div>
                </div>
                <div className='flex items-center justify-between p-3 rounded-lg bg-white/5'>
                  <div className='flex items-center space-x-3'>
                    <Database className='w-5 h-5 text-gray-400' />
                    <div>
                      <span className='text-sm font-medium'>Stack Overflow</span>
                      <p className='text-xs text-gray-400'>{portfolioSync.stackoverflow.reputation} reputation, {portfolioSync.stackoverflow.answers} answers</p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm text-yellow-400'>{portfolioSync.stackoverflow.score}%</span>
                    <AlertCircle className='w-4 h-4 text-yellow-400' />
                  </div>
                </div>
                <div className='flex items-center justify-between p-3 rounded-lg bg-white/5'>
                  <div className='flex items-center space-x-3'>
                    <Eye className='w-5 h-5 text-gray-400' />
                    <div>
                      <span className='text-sm font-medium'>Behance</span>
                      <p className='text-xs text-gray-400'>{portfolioSync.behance.projects} projects, {portfolioSync.behance.views} views</p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm text-green-400'>{portfolioSync.behance.score}%</span>
                    <CheckCircle className='w-4 h-4 text-green-400' />
                  </div>
                </div>
              </div>
              <Button 
                className='w-full mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm transition-colors'
              >
                Sync All Platforms
              </Button>
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
              <Button 
                className='w-full mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-sm transition-colors'
              >
                View Learning Paths
              </Button>
            </div>

            {/* Enhanced Notifications */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <Bell className='w-5 h-5 text-blue-400' />
                Recent Notifications
              </h3>
              <div className='space-y-3'>
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg transition-all hover:bg-gray-700/50 ${
                      notification.unread ? "bg-blue-500/10 border border-blue-500/20" : "bg-white/5"
                    }`}
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-1'>
                          <h4 className='text-sm font-medium'>
                            {notification.title}
                          </h4>
                          <span className={`px-1.5 py-0.5 rounded text-xs ${
                            notification.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            notification.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {notification.priority}
                          </span>
                        </div>
                        <p className='text-xs text-gray-400 mb-2'>
                          {notification.message}
                        </p>
                        <div className='flex items-center justify-between'>
                          <p className='text-xs text-gray-500'>
                            {notification.time}
                          </p>
                          <Button 
                            variant="ghost"
                            className='text-xs text-blue-400 hover:text-blue-300'
                          >
                            {notification.action}
                          </Button>
                        </div>
                      </div>
                      {notification.unread && (
                        <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                className='w-full mt-4 px-4 py-2 bg-white/10 hover:bg-gray-600/50 rounded-lg text-sm transition-colors'
              >
                View All Notifications
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Access Links */}
        <div className='mt-8 bg-white/5 border border-white/10 rounded-xl p-6'>
          <h3 className='text-lg font-semibold mb-6 flex items-center gap-2'>
            <Rocket className='w-5 h-5 text-blue-400' />
            Quick Access
          </h3>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
            {quickAccessLinks.map((link, index) => (
              <Button
                key={index}
                onClick={() => navigate(link.path)}
                variant="ghost"
                className={`group flex flex-col items-center space-y-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  link.color === 'blue' ? 'bg-blue-500/20 hover:bg-blue-500/30' :
                  link.color === 'purple' ? 'bg-purple-500/20 hover:bg-purple-500/30' :
                  link.color === 'green' ? 'bg-green-500/20 hover:bg-green-500/30' :
                  link.color === 'pink' ? 'bg-pink-500/20 hover:bg-pink-500/30' :
                  link.color === 'yellow' ? 'bg-yellow-500/20 hover:bg-yellow-500/30' :
                  'bg-orange-500/20 hover:bg-orange-500/30'
                }`}
              >
                <div className={`p-3 rounded-lg group-hover:scale-110 transition-transform ${
                  link.color === 'blue' ? 'bg-blue-500/30' :
                  link.color === 'purple' ? 'bg-purple-500/30' :
                  link.color === 'green' ? 'bg-green-500/30' :
                  link.color === 'pink' ? 'bg-pink-500/30' :
                  link.color === 'yellow' ? 'bg-yellow-500/30' :
                  'bg-orange-500/30'
                }`}>
                  <link.icon className={`w-6 h-6 ${
                    link.color === 'blue' ? 'text-blue-400' :
                    link.color === 'purple' ? 'text-purple-400' :
                    link.color === 'green' ? 'text-green-400' :
                    link.color === 'pink' ? 'text-pink-400' :
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
    </Layout>
  );
}
