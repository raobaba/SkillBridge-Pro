import React, { useState } from 'react'
import {
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  X,
  Award,
  Zap,
  Users,
  MessageSquare,
  Share2,
  Download,
  Upload,
  Settings,
  Eye,
  Copy,
  ExternalLink,
  Calendar,
  DollarSign,
  Clock,
  Target,
  AlertCircle,
  Star,
  Heart,
  Bookmark,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Save,
  RefreshCw,
  Send,
  Mail,
  Phone,
  Globe,
  MapPin,
  Tag,
  Code,
  Database,
  Shield,
  Bell,
  Activity,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react'
import { Button } from '../../../components'

const ProjectManagementPanel = ({ project, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showBoostModal, setShowBoostModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    status: project?.status || 'Active',
    priority: project?.priority || 'Medium',
    budget: project?.budget || '',
    deadline: project?.deadline || '',
    location: project?.location || '',
    duration: project?.duration || '',
    tags: project?.tags || [],
    isRemote: project?.isRemote || true,
    isUrgent: project?.isUrgent || false,
    isFeatured: project?.isFeatured || false
  })

  const [newTag, setNewTag] = useState('')
  const [inviteData, setInviteData] = useState({
    email: '',
    message: '',
    role: '',
    budget: ''
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag]
      })
      setNewTag('')
    }
  }

  const handleRemoveTag = (index) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index)
    })
  }

  const handleProjectAction = (action) => {
    switch (action) {
      case 'pause':
        setFormData({ ...formData, status: 'Paused' })
        break
      case 'resume':
        setFormData({ ...formData, status: 'Active' })
        break
      case 'close':
        setFormData({ ...formData, status: 'Completed' })
        break
      case 'boost':
        setShowBoostModal(true)
        break
      case 'invite':
        setShowInviteModal(true)
        break
      case 'delete':
        setShowDeleteConfirm(true)
        break
      default:
        break
    }
  }

  const handleSave = () => {
    onSave(formData)
    setIsEditing(false)
  }

  const handleInvite = () => {
    // Handle invite logic
    console.log('Inviting developer:', inviteData)
    setShowInviteModal(false)
    setInviteData({ email: '', message: '', role: '', budget: '' })
  }

  const handleBoost = () => {
    // Handle boost logic
    console.log('Boosting project visibility')
    setShowBoostModal(false)
  }

  const statusColors = {
    Active: 'bg-green-500/20 text-green-400 border-green-500/30',
    Completed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Upcoming: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    Paused: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    Cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
  }

  const priorityColors = {
    High: 'bg-red-500/20 text-red-400 border-red-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Low: 'bg-green-500/20 text-green-400 border-green-500/30'
  }

  const skillColors = [
    'from-purple-400 to-pink-500',
    'from-blue-400 to-indigo-500',
    'from-green-400 to-teal-500',
    'from-yellow-400 to-orange-400',
    'from-red-400 to-pink-500',
    'from-cyan-400 to-blue-500'
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Project Management
                </h2>
                <p className="text-gray-300 text-sm">
                  Manage project settings and performance
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2"
                leftIcon={Edit}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
              <Button
                onClick={onClose}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors duration-300"
                leftIcon={X}
              >
                Close
              </Button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-64 bg-black/20 border-r border-white/10 p-4 sidebar-scrollbar">
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'settings', label: 'Settings', icon: Settings },
                { id: 'applicants', label: 'Applicants', icon: Users },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'team', label: 'Team', icon: Users },
                { id: 'communications', label: 'Messages', icon: MessageSquare },
                { id: 'files', label: 'Files', icon: Upload },
                { id: 'history', label: 'History', icon: Clock }
              ].map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-300 ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/15'
                  }`}
                  leftIcon={tab.icon}
                >
                  {tab.label}
                </Button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Project Info */}
                  <div className="lg:col-span-2">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-white">Project Information</h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusColors[formData.status]}`}>
                            {formData.status}
                          </span>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${priorityColors[formData.priority]}`}>
                            {formData.priority} Priority
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-300 mb-2">Project Title</label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="title"
                              value={formData.title}
                              onChange={handleChange}
                              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <p className="text-white text-lg font-semibold">{formData.title}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 mb-2">Description</label>
                          {isEditing ? (
                            <textarea
                              name="description"
                              value={formData.description}
                              onChange={handleChange}
                              rows={4}
                              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <p className="text-gray-300">{formData.description}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-300 mb-2">Budget</label>
                            {isEditing ? (
                              <input
                                type="text"
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <p className="text-white">{formData.budget}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-gray-300 mb-2">Deadline</label>
                            {isEditing ? (
                              <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <p className="text-white">{formData.deadline}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="lg:col-span-1">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <Button
                          onClick={() => handleProjectAction('invite')}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                          leftIcon={Users}
                        >
                          Invite Developers
                        </Button>
                        
                        <Button
                          onClick={() => handleProjectAction('boost')}
                          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                          leftIcon={Zap}
                        >
                          Boost Visibility
                        </Button>
                        
                        <Button
                          onClick={() => handleProjectAction(formData.status === 'Active' ? 'pause' : 'resume')}
                          className={`w-full p-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                            formData.status === 'Active'
                              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                              : 'bg-green-500/20 text-green-400 border border-green-500/30'
                          }`}
                          leftIcon={formData.status === 'Active' ? Pause : Play}
                        >
                          {formData.status === 'Active' ? 'Pause Project' : 'Resume Project'}
                        </Button>
                        
                        <Button
                          onClick={() => handleProjectAction('close')}
                          className="w-full bg-blue-500/20 text-blue-400 border border-blue-500/30 p-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                          leftIcon={CheckCircle}
                        >
                          Close Project
                        </Button>
                        
                        <Button
                          onClick={() => handleProjectAction('delete')}
                          className="w-full bg-red-500/20 text-red-400 border border-red-500/30 p-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                          leftIcon={Trash2}
                        >
                          Delete Project
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">Project Tags</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-full text-xs text-white bg-gradient-to-r ${skillColors[idx % skillColors.length]} flex items-center gap-1 hover:scale-105 transition-transform duration-300`}
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveTag(idx)}
                            className="ml-1 hover:text-red-300 transition-colors duration-300"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  
                  {isEditing && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag"
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                      />
                      <button
                        onClick={handleAddTag}
                        className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors duration-300"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Save Button */}
                {isEditing && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">Project Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 mb-2">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Paused">Paused</option>
                        <option value="Completed">Completed</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Priority</label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-2">Duration</label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isRemote"
                        checked={formData.isRemote}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                      />
                      <span className="text-white text-sm">Remote work allowed</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isUrgent"
                        checked={formData.isUrgent}
                        onChange={handleChange}
                        className="w-4 h-4 text-red-600 bg-white/10 border-white/20 rounded focus:ring-red-500"
                      />
                      <span className="text-white text-sm">Urgent project</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                        className="w-4 h-4 text-yellow-600 bg-white/10 border-white/20 rounded focus:ring-yellow-500"
                      />
                      <span className="text-white text-sm">Featured project</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'applicants' && (
              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">Applicant Management</h3>
                  <p className="text-gray-300">Applicant management features will be integrated here.</p>
                </div>
              </div>
            )}
            
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4">Project Analytics</h3>
                  <p className="text-gray-300">Detailed analytics for this project will be displayed here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-md">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white">Invite Developer</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="developer@example.com"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Role</label>
                <input
                  type="text"
                  value={inviteData.role}
                  onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Frontend Developer"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Message</label>
                <textarea
                  value={inviteData.message}
                  onChange={(e) => setInviteData({ ...inviteData, message: e.target.value })}
                  rows={3}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Personal message to the developer..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => setShowInviteModal(false)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Boost Modal */}
      {showBoostModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-md">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white">Boost Project Visibility</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-medium">Premium Boost</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Make your project stand out with premium placement and enhanced visibility.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white">Duration</span>
                  <span className="text-gray-400">7 days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Cost</span>
                  <span className="text-green-400 font-bold">$49</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">Expected Reach</span>
                  <span className="text-blue-400">+300%</span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => setShowBoostModal(false)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleBoost}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Boost Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-md">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold text-white">Delete Project</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-300 mb-4">
                Are you sure you want to delete this project? This action cannot be undone.
              </p>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 font-medium">Warning</span>
                </div>
                <p className="text-red-300 text-sm">
                  All project data, applicants, and communications will be permanently deleted.
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle delete logic
                  console.log('Deleting project')
                  setShowDeleteConfirm(false)
                  onClose()
                }}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg transition-colors duration-300"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectManagementPanel
