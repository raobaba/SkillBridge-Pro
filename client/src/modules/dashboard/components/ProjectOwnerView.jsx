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
  UserPlus,
  UserCheck,
  UserX,
  MessageCircle,
  Building,
  TrendingUp as TrendingUpIcon,
  BarChart,
  PieChart as PieChartIcon,
  DollarSign as DollarSignIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  AlertTriangle,
  CheckSquare,
  XSquare,
  Edit,
  Trash2,
  Eye as EyeIcon,
  Download,
  Upload,
  Share2,
  Copy,
  Send,
  Archive,
  Flag,
  MoreVertical,
} from "lucide-react";
import { Layout } from "../../../components";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ProjectOwnerView() {
  const [activeTab, setActiveTab] = useState("overview");
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  // Enhanced mock data for Project Owner dashboard
  const ownerStats = {
    activeProjects: 10,
    completedProjects: 24,
    teamMembers: 12,
    totalBudget: "$125,000",
    rating: 4.6,
    openPositions: 7,
    totalApplicants: 45,
    pendingReviews: 8,
    monthlyRevenue: "$18,500",
    projectSuccessRate: 92,
    avgProjectDuration: "6.2 weeks",
    activeHires: 5,
  };

  const projectManagementStats = {
    totalProjects: 34,
    inProgress: 10,
    completed: 24,
    onHold: 2,
    cancelled: 1,
    totalSpent: "$98,500",
    remainingBudget: "$26,500",
    avgProjectValue: "$3,676",
    topPerformingProject: "E-commerce Platform",
  };

  const applicantStats = {
    totalApplicants: 45,
    newThisWeek: 12,
    pendingReview: 8,
    shortlisted: 15,
    hired: 5,
    rejected: 17,
    avgResponseTime: "2.3 days",
    topSkills: ["React", "Node.js", "Python", "AWS", "Docker"],
  };

  const activeProjects = [
    {
      id: 1,
      title: "Next Gen Web Platform",
      client: "Alpha Corp",
      status: "In Progress",
      progress: 65,
      budget: "$20,000",
      spent: "$13,000",
      deadline: "2024-09-15",
      skillsRequired: ["React", "Node.js", "AWS"],
      teamSize: 4,
      applicants: 12,
      priority: "high",
      category: "Web Development",
      startDate: "2024-07-01",
      estimatedHours: 320,
      completedHours: 208,
    },
    {
      id: 2,
      title: "AI Customer Support Bot",
      client: "Beta Solutions",
      status: "Planning",
      progress: 15,
      budget: "$15,000",
      spent: "$2,500",
      deadline: "2024-11-30",
      skillsRequired: ["Python", "TensorFlow", "NLP"],
      teamSize: 3,
      applicants: 8,
      priority: "medium",
      category: "AI/ML",
      startDate: "2024-08-15",
      estimatedHours: 240,
      completedHours: 36,
    },
    {
      id: 3,
      title: "Mobile Banking App",
      client: "FinTech Ltd",
      status: "Under Review",
      progress: 95,
      budget: "$35,000",
      spent: "$33,250",
      deadline: "2024-08-30",
      skillsRequired: ["React Native", "Firebase", "Stripe"],
      teamSize: 5,
      applicants: 15,
      priority: "high",
      category: "Mobile Development",
      startDate: "2024-06-01",
      estimatedHours: 400,
      completedHours: 380,
    },
  ];

  const recentApplicants = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Frontend Developer",
      experience: "5 years",
      skills: ["React", "TypeScript", "CSS"],
      rating: 4.8,
      appliedFor: "Next Gen Web Platform",
      appliedDate: "2 hours ago",
      status: "pending",
      matchScore: 95,
      hourlyRate: "$45",
      availability: "Immediate",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "AI Engineer",
      experience: "7 years",
      skills: ["Python", "TensorFlow", "NLP"],
      rating: 4.9,
      appliedFor: "AI Customer Support Bot",
      appliedDate: "4 hours ago",
      status: "shortlisted",
      matchScore: 92,
      hourlyRate: "$60",
      availability: "2 weeks",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Mobile Developer",
      experience: "4 years",
      skills: ["React Native", "Firebase", "Stripe"],
      rating: 4.7,
      appliedFor: "Mobile Banking App",
      appliedDate: "1 day ago",
      status: "hired",
      matchScore: 88,
      hourlyRate: "$50",
      availability: "Immediate",
    },
  ];

  const teamMembers = [
    {
      id: 1,
      name: "Alice Johnson",
      role: "Frontend Developer",
      skills: ["React", "TypeScript", "CSS"],
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      status: "online",
      currentProject: "Next Gen Web Platform",
      hoursThisWeek: 32,
      rating: 4.8,
      joinedDate: "2024-01-15",
      hourlyRate: "$45",
    },
    {
      id: 2,
      name: "Mark Wilson",
      role: "Backend Developer",
      skills: ["Node.js", "Express", "MongoDB"],
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
      status: "away",
      currentProject: "AI Customer Support Bot",
      hoursThisWeek: 28,
      rating: 4.9,
      joinedDate: "2024-02-01",
      hourlyRate: "$50",
    },
    {
      id: 3,
      name: "Sophie Lee",
      role: "QA Engineer",
      skills: ["Automation", "Selenium", "Jest"],
      avatar: "https://randomuser.me/api/portraits/women/48.jpg",
      status: "online",
      currentProject: "Mobile Banking App",
      hoursThisWeek: 25,
      rating: 4.7,
      joinedDate: "2024-03-10",
      hourlyRate: "$40",
    },
  ];

  const projectCategories = [
    { name: "Web Development", count: 15, revenue: "$45,000", color: "blue" },
    { name: "Mobile Development", count: 8, revenue: "$32,000", color: "green" },
    { name: "AI/ML", count: 6, revenue: "$28,000", color: "purple" },
    { name: "DevOps", count: 3, revenue: "$15,000", color: "orange" },
    { name: "Data Science", count: 2, revenue: "$8,000", color: "pink" },
  ];

  const quickAccessLinks = [
    { name: "Post New Project", icon: Plus, color: "blue", description: "Create project listing", path: "/project?action=create" },
    { name: "Manage Team", icon: Users, color: "green", description: "Team management", path: "/project?tab=team" },
    { name: "View Applicants", icon: UserCheck, color: "purple", description: "Review applications", path: "/project?tab=applicants" },
    { name: "Billing & Subscriptions", icon: DollarSign, color: "yellow", description: "Payment management", path: "/billing-subscription" },
    { name: "Team Communication", icon: MessageCircle, color: "pink", description: "Chat with team", path: "/chat" },
    { name: "Analytics", icon: BarChart3, color: "orange", description: "Project insights", path: "/analytics" },
  ];

  const recentNotifications = [
    {
      id: 1,
      type: "applicant",
      title: "New Applicant",
      message: "Sarah Johnson applied for Next Gen Web Platform (95% match)",
      time: "2 hours ago",
      unread: true,
      priority: "high",
      action: "Review Application",
    },
    {
      id: 2,
      type: "project",
      title: "Project Update",
      message: "Mobile Banking App is 95% complete - ready for final review",
      time: "3 hours ago",
      unread: true,
      priority: "medium",
      action: "View Project",
    },
    {
      id: 3,
      type: "message",
      title: "Team Message",
      message: "Alice Johnson sent you a message about the Next Gen Web Platform",
      time: "1 day ago",
      unread: false,
      priority: "low",
      action: "Reply",
    },
    {
      id: 4,
      type: "billing",
      title: "Billing Reminder",
      message: "Monthly subscription payment due in 3 days",
      time: "1 day ago",
      unread: true,
      priority: "high",
      action: "Pay Now",
    },
    {
      id: 5,
      type: "budget",
      title: "Budget Alert",
      message: "AI Customer Support Bot is approaching 80% budget limit",
      time: "2 days ago",
      unread: false,
      priority: "medium",
      action: "View Budget",
    },
    {
      id: 6,
      type: "deadline",
      title: "Deadline Approaching",
      message: "Next Gen Web Platform deadline is in 5 days",
      time: "3 days ago",
      unread: false,
      priority: "high",
      action: "View Project",
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
    <Layout isSearchBar={true}>
        {/* Enhanced Welcome Section */}
        <div className='mb-8'>
          <div className="flex items-center justify-between">
            <div>
              <h1 className='text-3xl font-bold mb-2'>Welcome back, {user?.name || 'Project Owner'}! 👋</h1>
              <p className='text-gray-300'>
                Here's the latest update on your projects, teams, and budgets.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Project Success Rate</p>
                <p className="text-2xl font-bold text-green-400 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  {ownerStats.projectSuccessRate}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Monthly Revenue</p>
                <p className="text-2xl font-bold text-blue-400 flex items-center gap-2">
                  <DollarSign className="w-6 h-6" />
                  {ownerStats.monthlyRevenue}
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
                <p className='text-gray-400 text-sm'>Active Projects</p>
                <p className='text-2xl font-bold text-blue-400'>
                  {ownerStats.activeProjects}
                </p>
                <p className='text-xs text-gray-500'>3 high priority</p>
              </div>
              <Briefcase className='w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Total Applicants</p>
                <p className='text-2xl font-bold text-purple-400'>
                  {ownerStats.totalApplicants}
                </p>
                <p className='text-xs text-gray-500'>{ownerStats.pendingReviews} pending</p>
              </div>
              <UserPlus className='w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Team Members</p>
                <p className='text-2xl font-bold text-yellow-400'>
                  {ownerStats.teamMembers}
                </p>
                <p className='text-xs text-gray-500'>{ownerStats.activeHires} active</p>
              </div>
              <Users className='w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Total Budget</p>
                <p className='text-2xl font-bold text-green-400'>
                  {ownerStats.totalBudget}
                </p>
                <p className='text-xs text-gray-500'>${projectManagementStats.remainingBudget} remaining</p>
              </div>
              <DollarSign className='w-8 h-8 text-green-400 group-hover:scale-110 transition-transform' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Success Rate</p>
                <p className='text-2xl font-bold text-orange-400'>
                  {ownerStats.projectSuccessRate}%
                </p>
                <p className='text-xs text-gray-500'>Avg {ownerStats.avgProjectDuration}</p>
              </div>
              <TrendingUp className='w-8 h-8 text-orange-400 group-hover:scale-110 transition-transform' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Open Positions</p>
                <p className='text-2xl font-bold text-pink-400'>
                  {ownerStats.openPositions}
                </p>
                <p className='text-xs text-gray-500'>Urgent: 2</p>
              </div>
              <Target className='w-8 h-8 text-pink-400 group-hover:scale-110 transition-transform' />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Left Column - Main Content */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Recent Applicants */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <UserCheck className='w-6 h-6 text-green-400' />
                  Recent Applicants
                </h2>
                <Button 
                  variant="ghost"
                  className='text-blue-400 hover:text-blue-300 text-sm flex items-center'
                >
                  View All <ChevronRight className='w-4 h-4 ml-1' />
                </Button>
              </div>
              <div className='space-y-3'>
                {recentApplicants.map((applicant) => (
                  <div
                    key={applicant.id}
                    className='bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all'
                  >
                    <div className='flex items-start justify-between mb-3'>
                      <div className='flex items-center gap-3'>
                        <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold'>
                          {applicant.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className='flex-1'>
                          <h3 className='font-semibold mb-1'>{applicant.name}</h3>
                          <p className='text-gray-400 text-sm'>{applicant.role} • {applicant.experience}</p>
                          <p className='text-gray-300 text-sm'>Applied for: {applicant.appliedFor}</p>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className={`px-2 py-1 rounded text-xs ${
                          applicant.status === 'hired' ? 'bg-green-500/20 text-green-400' :
                          applicant.status === 'shortlisted' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {applicant.status}
                        </span>
                        <div className='text-right'>
                          <div className='text-lg font-bold text-green-400'>{applicant.matchScore}%</div>
                          <div className='text-xs text-gray-400'>Match</div>
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='flex flex-wrap gap-1'>
                        {applicant.skills.map((skill, index) => (
                          <span
                            key={index}
                            className='px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs'
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className='flex items-center gap-4 text-sm text-gray-400'>
                        <span>⭐ {applicant.rating}</span>
                        <span>{applicant.hourlyRate}/hr</span>
                        <span>{applicant.availability}</span>
                      </div>
                    </div>
                    <div className='flex items-center justify-between mt-3'>
                      <span className='text-gray-400 text-sm'>{applicant.appliedDate}</span>
                      <div className='flex gap-2'>
                        <Button 
                          className='px-3 py-1 bg-green-500 hover:bg-green-600 rounded text-sm transition-colors'
                        >
                          {applicant.status === 'hired' ? 'View Profile' : 'Review'}
                        </Button>
                        <Button 
                          className='px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm transition-colors'
                        >
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Projects */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold'>Active Projects</h2>
                <Button 
                  variant="ghost"
                  className='text-blue-400 hover:text-blue-300 text-sm flex items-center'
                >
                  View All <ChevronRight className='w-4 h-4 ml-1' />
                </Button>
              </div>
              <div className='space-y-4'>
                {activeProjects.map((project) => (
                  <div
                    key={project.id}
                    className='bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all'
                  >
                    <div className='flex items-start justify-between mb-3'>
                      <div className='flex-1'>
                        <h3 className='font-semibold mb-1'>{project.title}</h3>
                        <p className='text-gray-400 text-sm mb-1'>
                          {project.client}
                        </p>
                        <div className='flex items-center gap-2 mb-2'>
                          <span className={`px-2 py-1 rounded text-xs ${
                            project.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            project.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {project.priority}
                          </span>
                          <span className='px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs'>
                            {project.category}
                          </span>
                          <span className='px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs'>
                            {project.teamSize} members
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <span
                          className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {project.status}
                        </span>
                        <div className='text-right'>
                          <div className='text-green-400 font-medium'>{project.budget}</div>
                          <div className='text-xs text-gray-400'>Spent: {project.spent}</div>
                        </div>
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
                      <div className='flex items-center gap-4 text-gray-400 text-sm'>
                        <div className='flex items-center gap-1'>
                          <Clock className='w-4 h-4' />
                          {project.deadline}
                        </div>
                        <div className='flex items-center gap-1'>
                          <Timer className='w-4 h-4' />
                          {project.completedHours}/{project.estimatedHours}h
                        </div>
                        <div className='flex items-center gap-1'>
                          <Users className='w-4 h-4' />
                          {project.applicants} applicants
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Team Members */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <Users className='w-6 h-6 text-blue-400' />
                  Team Members
                </h2>
                <Button 
                  variant="ghost"
                  className='text-blue-400 hover:text-blue-300 text-sm flex items-center'
                >
                  Manage Team <ChevronRight className='w-4 h-4 ml-1' />
                </Button>
              </div>
              <div className='space-y-4'>
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className='flex items-center space-x-4 bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all'
                  >
                    <div className='relative'>
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className='w-12 h-12 rounded-full object-cover'
                      />
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                        member.status === 'online' ? 'bg-green-500' :
                        member.status === 'away' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}></div>
                    </div>
                    <div className='flex-1'>
                      <div className='flex items-center justify-between mb-1'>
                        <h3 className='font-semibold'>{member.name}</h3>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm text-gray-400'>⭐ {member.rating}</span>
                          <span className='text-sm text-green-400'>{member.hourlyRate}/hr</span>
                        </div>
                      </div>
                      <p className='text-gray-400 text-sm mb-1'>{member.role}</p>
                      <p className='text-gray-300 text-xs mb-2'>Working on: {member.currentProject}</p>
                      <div className='flex items-center justify-between'>
                        <div className='flex flex-wrap gap-1'>
                          {member.skills.map((skill, i) => (
                            <span
                              key={i}
                              className='px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs'
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className='text-right text-xs text-gray-400'>
                          <div>{member.hoursThisWeek}h this week</div>
                          <div>Joined {member.joinedDate}</div>
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                      <Button 
                        className='px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm transition-colors'
                      >
                        Message
                      </Button>
                      <Button 
                        className='px-3 py-1 bg-gray-500 hover:bg-gray-600 rounded text-sm transition-colors'
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className='space-y-6'>
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
                      notification.unread
                        ? "bg-blue-500/10 border border-blue-500/20"
                        : "bg-white/5"
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

            {/* Enhanced Quick Access Links */}
            <div className='mt-8 bg-white/5 border border-white/10 rounded-xl p-6'>
              <h3 className='text-lg font-semibold mb-6 flex items-center gap-2'>
                <Rocket className='w-5 h-5 text-blue-400' />
                Quick Access
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                {quickAccessLinks.map((link, index) => (
                  <Button
                    key={index}
                    onClick={() => navigate(link.path)}
                    variant="ghost"
                    className={`group flex flex-col items-center space-y-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      link.color === 'blue' ? 'bg-blue-500/20 hover:bg-blue-500/30' :
                      link.color === 'green' ? 'bg-green-500/20 hover:bg-green-500/30' :
                      link.color === 'purple' ? 'bg-purple-500/20 hover:bg-purple-500/30' :
                      link.color === 'yellow' ? 'bg-yellow-500/20 hover:bg-yellow-500/30' :
                      link.color === 'pink' ? 'bg-pink-500/20 hover:bg-pink-500/30' :
                      'bg-orange-500/20 hover:bg-orange-500/30'
                    }`}
                  >
                    <div className={`p-3 rounded-lg group-hover:scale-110 transition-transform ${
                      link.color === 'blue' ? 'bg-blue-500/30' :
                      link.color === 'green' ? 'bg-green-500/30' :
                      link.color === 'purple' ? 'bg-purple-500/30' :
                      link.color === 'yellow' ? 'bg-yellow-500/30' :
                      link.color === 'pink' ? 'bg-pink-500/30' :
                      'bg-orange-500/30'
                    }`}>
                      <link.icon className={`w-6 h-6 ${
                        link.color === 'blue' ? 'text-blue-400' :
                        link.color === 'green' ? 'text-green-400' :
                        link.color === 'purple' ? 'text-purple-400' :
                        link.color === 'yellow' ? 'text-yellow-400' :
                        link.color === 'pink' ? 'text-pink-400' :
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

             {/* Project Categories Overview */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-lg font-semibold flex items-center gap-2'>
                  <BarChart3 className='w-5 h-5 text-purple-400' />
                  Project Categories
                </h3>
                <Button 
                  variant="ghost"
                  className='text-blue-400 hover:text-blue-300 text-sm flex items-center'
                >
                  View Analytics <ChevronRight className='w-4 h-4 ml-1' />
                </Button>
              </div>
              <div className='space-y-3'>
                {projectCategories.map((category, index) => (
                  <div
                    key={index}
                    className='bg-white/5 border border-white/10 rounded-lg p-3 hover:border-white/20 transition-all'
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <h4 className='font-semibold text-sm'>{category.name}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        category.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                        category.color === 'green' ? 'bg-green-500/20 text-green-400' :
                        category.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                        category.color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-pink-500/20 text-pink-400'
                      }`}>
                        {category.count}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <p className='text-sm font-bold text-green-400'>{category.revenue}</p>
                      <p className='text-xs text-gray-400'>revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
    </Layout>
  );
}
