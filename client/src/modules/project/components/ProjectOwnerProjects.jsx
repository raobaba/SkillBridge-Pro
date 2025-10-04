import React, { useState } from 'react'
import ProjectForm from './ProjectForm'
import ApplicantsList from './ApplicantsList'
import Button from '../../../components/Button'
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Clock,
  Target,
  Zap,
  Award,
  Activity,
  Bell,
  Plus,
  Settings,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Star,
  MessageSquare,
  Share2,
  Download,
  Filter,
  Search,
  MoreVertical,
  Sparkles,
  Lightbulb,
  Briefcase
} from 'lucide-react'

const ProjectOwnerProjects = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [selectedProject, setSelectedProject] = useState(null)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'new_applicant',
      message: '3 new applicants for Talent Matching Engine Revamp',
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'project_deadline',
      message: 'Project Collaboration Hub deadline approaching',
      timestamp: '1 day ago',
      read: false
    }
  ])

  // Mock owned projects; replace with API data when ready
  const [ownedProjects, setOwnedProjects] = useState([
    {
      id: 101,
      title: 'Talent Matching Engine Revamp',
      status: 'Active',
      priority: 'High',
      description:
        'Refactor matching algorithms and improve scoring explainability for stakeholders.',
      startDate: '2025-08-01',
      deadline: '2025-11-15',
      roleNeeded: 'Full Stack Developer',
      applicantsCount: 18,
      newApplicants: 3,
      activity: '2 updates this week',
      tags: ['Node.js', 'React', 'PostgreSQL', 'AWS'],
      rating: 4.5,
      budget: '$70,000 - $100,000',
      location: 'Remote',
      duration: '4-6 months',
      experience: 'Senior Level',
      category: 'AI/ML',
      isRemote: true,
      isUrgent: true,
      isFeatured: true,
      company: 'SkillBridge Pro',
      website: 'https://skillbridge.pro',
      matchScore: 96,
    },
    {
      id: 102,
      title: 'Project Collaboration Hub',
      status: 'Upcoming',
      priority: 'Medium',
      description:
        'Create a unified collaboration hub with tasks, chat, and docs integrations.',
      startDate: '2025-10-01',
      deadline: '2026-02-01',
      roleNeeded: 'Frontend Developer',
      applicantsCount: 7,
      newApplicants: 1,
      activity: 'Planning in progress',
      tags: ['React', 'TailwindCSS', 'WebSockets'],
      rating: 4.2,
      budget: '$40,000 - $70,000',
      location: 'Remote',
      duration: '3-5 months',
      experience: 'Mid Level',
      category: 'Web Development',
      isRemote: true,
      isUrgent: false,
      isFeatured: false,
      company: 'SkillBridge Pro',
      website: 'https://skillbridge.pro',
      matchScore: 82,
    },
  ])

  // Dashboard analytics data
  const dashboardStats = {
    totalProjects: ownedProjects.length,
    activeProjects: ownedProjects.filter(p => p.status === 'Active').length,
    totalApplicants: ownedProjects.reduce((sum, p) => sum + p.applicantsCount, 0),
    newApplicants: ownedProjects.reduce((sum, p) => sum + p.newApplicants, 0),
    avgRating: (ownedProjects.reduce((sum, p) => sum + p.rating, 0) / ownedProjects.length).toFixed(1),
    totalBudget: '$110,000 - $170,000',
    completionRate: 75,
    responseTime: '2.3 hours'
  }

  const handleProjectAction = (projectId, action) => {
    const updatedProjects = ownedProjects.map(project => {
      if (project.id === projectId) {
        switch (action) {
          case 'pause':
            return { ...project, status: 'Paused' }
          case 'resume':
            return { ...project, status: 'Active' }
          case 'close':
            return { ...project, status: 'Completed' }
          case 'boost':
            return { ...project, isFeatured: true }
          default:
            return project
        }
      }
      return project
    })
    setOwnedProjects(updatedProjects)
  }

  const handleInviteDeveloper = (projectId) => {
    setSelectedProject(ownedProjects.find(p => p.id === projectId))
    setShowInviteModal(true)
  }

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="px-6 py-8 space-y-8 max-w-7xl mx-auto">
        {/* Enhanced Header with Notifications */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Project Owner Dashboard
              </h1>
              <p className="text-gray-300 text-sm">Manage your projects and track performance</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Button
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors duration-300"
              >
                <Bell className="w-5 h-5 text-white" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </Button>
            </div>
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {/* Total Projects */}
          <div className="group bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all duration-300 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1)] focus-within:ring-1 focus-within:ring-blue-400">
            <div className="text-center">
              <div className="mx-auto inline-flex p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg mb-3">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-white" title="Total number of projects">{dashboardStats.totalProjects}</p>
              <p className="text-sm text-gray-400">Total Projects</p>
            </div>
            <div className="mt-3 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 w-full" />
            </div>
          </div>

          {/* Active */}
          <div className="group bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all duration-300 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]">
            <div className="text-center">
              <div className="mx-auto inline-flex p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mb-3">
                <Play className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-white" title="Number of active projects">{dashboardStats.activeProjects}</p>
              <p className="text-sm text-gray-400">Active</p>
            </div>
            <div className="mt-3 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: `${Math.min(100, (dashboardStats.activeProjects / Math.max(1, dashboardStats.totalProjects)) * 100)}%` }} />
            </div>
          </div>

          {/* Applicants */}
          <div className="group bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all duration-300">
            <div className="text-center">
              <div className="mx-auto inline-flex p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mb-3">
                <Users className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-white" title="Total applicants across projects">{dashboardStats.totalApplicants}</p>
              <p className="text-sm text-gray-400">Total Applicants</p>
            </div>
            <div className="mt-3 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${Math.min(100, dashboardStats.totalApplicants ? 100 : 0)}%` }} />
            </div>
          </div>

          {/* New Applicants */}
          <div className="group bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all duration-300">
            <div className="text-center">
              <div className="mx-auto inline-flex p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg mb-3">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-white" title="New applicants this period">{dashboardStats.newApplicants}</p>
              <p className="text-sm text-gray-400">New Applicants</p>
            </div>
            <div className="mt-3 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500" style={{ width: `${Math.min(100, (dashboardStats.newApplicants / Math.max(1, dashboardStats.totalApplicants)) * 100)}%` }} />
            </div>
          </div>

          {/* Avg Rating */}
          <div className="group bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all duration-300">
            <div className="text-center">
              <div className="mx-auto inline-flex p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg mb-3">
                <Star className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-white" title="Average project rating">{dashboardStats.avgRating}</p>
              <p className="text-sm text-gray-400">Avg Rating</p>
            </div>
            <div className="mt-3 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${(Number(dashboardStats.avgRating) / 5) * 100}%` }} />
            </div>
          </div>

          {/* Total Budget */}
          <div className="group bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all duration-300">
            <div className="text-center">
              <div className="mx-auto inline-flex p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg mb-3">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <p className="text-lg font-bold text-white" title="Aggregate budget range">{dashboardStats.totalBudget}</p>
              <p className="text-sm text-gray-400">Total Budget</p>
            </div>
            <div className="mt-3 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-teal-500 w-2/3" />
            </div>
          </div>

          {/* Completion Rate */}
          <div className="group bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all duration-300">
            <div className="text-center">
              <div className="mx-auto inline-flex p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg mb-3">
                <Target className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-white" title="Percent of projects completed">{dashboardStats.completionRate}%</p>
              <p className="text-sm text-gray-400">Completion Rate</p>
            </div>
            <div className="mt-3 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500" style={{ width: `${dashboardStats.completionRate}%` }} />
            </div>
          </div>

          {/* Avg Response */}
          <div className="group bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all duration-300">
            <div className="text-center">
              <div className="mx-auto inline-flex p-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg mb-3">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <p className="text-lg font-bold text-white" title="Average response time">{dashboardStats.responseTime}</p>
              <p className="text-sm text-gray-400">Avg Response</p>
            </div>
            <div className="mt-3 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-500 to-red-500 w-1/2" />
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm p-2 rounded-2xl border border-white/10">
          <div className="grid grid-cols-5 gap-2">
            <Button
              onClick={() => setActiveTab('dashboard')}
              variant="ghost"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'dashboard'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/15'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Dashboard
            </Button>
            <Button
              onClick={() => setActiveTab('my-projects')}
              variant="ghost"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'my-projects'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/15'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              My Projects
            </Button>
            <Button
              onClick={() => setActiveTab('create')}
              variant="ghost"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'create'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/15'
              }`}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Create Project
            </Button>
            <Button
              onClick={() => setActiveTab('applicants')}
              variant="ghost"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'applicants'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/15'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Applicants
            </Button>
            <Button
              onClick={() => setActiveTab('analytics')}
              variant="ghost"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'analytics'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/15'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-400" />
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`p-4 rounded-xl border ${
                        notification.read ? 'bg-white/5 border-white/10' : 'bg-blue-500/10 border-blue-500/20'
                      }`}>
                        <div className="flex items-center justify-between">
                          <p className="text-white text-sm">{notification.message}</p>
                          <span className="text-gray-400 text-xs">{notification.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="lg:col-span-1">
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create New Project
                    </Button>
                    <Button
                      className="w-full bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                      <Users className="w-4 h-4" />
                      Invite Developers
                    </Button>
                    <Button
                      className="w-full bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                      <Award className="w-4 h-4" />
                      Boost Project Visibility
                    </Button>
                    <Button
                      className="w-full bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                      <TrendingUp className="w-4 h-4" />
                      View Analytics
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Top Performing Projects */}
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Top Performing Projects
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ownedProjects.slice(0, 3).map((project) => (
                  <div key={project.id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-semibold">{project.title}</h4>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        project.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Applicants:</span>
                        <span className="text-white">{project.applicantsCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-white">{project.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Budget:</span>
                        <span className="text-white">{project.budget}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'my-projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Your Projects
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-gray-300 text-sm">{ownedProjects.length} total</span>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Project
                </Button>
              </div>
            </div>
            {ownedProjects.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No projects yet</p>
                <p className="text-gray-500 text-sm mt-2">Create your first project to get started</p>
                <Button 
                  className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Create Project
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {ownedProjects.map((project) => (
                  <div key={project.id} className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/5 transition-all duration-300 h-full flex flex-col">
                    <div className="p-5 border-b border-white/10">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shrink-0">
                            <Briefcase className="w-4 h-4 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-white font-semibold truncate">{project.title}</h3>
                            <div className="mt-1 flex items-center gap-2 flex-wrap">
                              <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                                project.status === 'Active' ? 'bg-green-500/20 text-green-300' :
                                project.status === 'Upcoming' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-gray-500/20 text-gray-300'
                              }`}>
                                {project.status}
                              </span>
                              {project.isFeatured && (
                                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-yellow-500/20 text-yellow-300">
                                  Featured
                                </span>
                              )}
                              {project.isUrgent && (
                                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-red-500/20 text-red-300">
                                  Urgent
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-full text-[10px] text-white bg-gradient-to-r from-blue-500 to-purple-500">
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] text-gray-300 bg-white/10">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{project.budget}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{project.duration}</span>
                      </div>
                    </div>
                    <div className="p-5 pt-0 mt-auto">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => { setSelectedProject(project); setShowProjectModal(true); }}
                          variant="ghost"
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="space-y-6">
            {/* Create Header */}
            <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Create a New Project
                    </h2>
                    <p className="text-gray-300 text-sm">
                      Fill the details below. You can use AI to draft a quality description.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-xs bg-white/10 text-gray-300 border border-white/20">Auto-save enabled</span>
                  <span className="px-3 py-1 rounded-full text-xs bg-white/10 text-gray-300 border border-white/20">Draft friendly</span>
                </div>
              </div>
            </div>

            {/* Tips + Form */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-3">
                <ProjectForm />
              </div>

              {/* Helper Panel */}
              <aside className="xl:col-span-1">
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sticky top-6 space-y-5">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    Tips
                  </h3>
                  <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside">
                    <li>Keep the title concise and clear.</li>
                    <li>Mention key tech stack and seniority.</li>
                    <li>Add budget and duration for better matches.</li>
                    <li>Use the AI Description button for a strong first draft.</li>
                  </ul>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-white font-medium mb-2">Need a hand?</p>
                    <p className="text-gray-400 text-sm mb-3">Click “AI-Enhanced Description” beside the Description field in the form.</p>
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <Sparkles className="w-4 h-4 text-purple-300" />
                      Improves clarity and attractiveness
                    </div>
                  </div>

                  <div className="text-xs text-gray-400">
                    Your project will be visible to developers once published. You can save as draft anytime.
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}

        {activeTab === 'applicants' && (
          <ApplicantsList />
        )}

        {/* Owner Project Details Modal */}
        {showProjectModal && selectedProject && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white">{selectedProject.title}</h3>
                    <p className="text-gray-400 text-sm">{selectedProject.company} • {selectedProject.location}</p>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowProjectModal(false)} 
                  variant="ghost"
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-colors duration-300"
                >
                  Close
                </Button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-gray-400 text-xs mb-1">Budget</p>
                    <p className="text-white font-semibold">{selectedProject.budget}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-gray-400 text-xs mb-1">Duration</p>
                    <p className="text-white font-semibold">{selectedProject.duration}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-gray-400 text-xs mb-1">Applicants</p>
                    <p className="text-white font-semibold">{selectedProject.applicantsCount}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">About the project</h4>
                  <p className="text-gray-300 leading-relaxed">{selectedProject.description}</p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 rounded-full text-xs text-white bg-gradient-to-r from-blue-500 to-purple-500">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-gray-400 text-xs mb-1">Priority</p>
                    <p className="text-white font-semibold">{selectedProject.priority}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-gray-400 text-xs mb-1">Status</p>
                    <p className="text-white font-semibold">{selectedProject.status}</p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button 
                    onClick={() => setShowProjectModal(false)} 
                    variant="ghost"
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors duration-300"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectOwnerProjects