import React, { useState } from "react";
import Button from "../../../components/Button";
import {
  Calendar,
  Clock,
  Users,
  Briefcase,
  Star,
  Tag,
  ChevronRight,
  Heart,
  Eye,
  MessageSquare,
  Share2,
  MoreVertical,
  TrendingUp,
  Target,
  DollarSign,
  MapPin,
  Award,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Edit,
  Trash2,
  ExternalLink,
  Activity,
  BarChart3,
  Zap,
  Shield,
  Globe,
  Code,
  Database,
  Settings,
  Bell,
  Bookmark,
  Download,
  Upload,
  Filter,
  Search,
  Plus,
  Minus,
  X
} from "lucide-react";
import ProjectManagementPanel from "./ProjectManagementPanel";

const ProjectCard = ({ project, isOwner = false, onAction, onInvite }) => {
  const [expanded, setExpanded] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [showManagementPanel, setShowManagementPanel] = useState(false);

  const statusColors = {
    Active: "bg-green-500/20 text-green-400 border-green-500/30",
    Completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Upcoming: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Draft: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    Paused: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    Cancelled: "bg-red-500/20 text-red-400 border-red-500/30"
  };

  const priorityColors = {
    High: "bg-red-500/20 text-red-400 border-red-500/30",
    Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Low: "bg-green-500/20 text-green-400 border-green-500/30",
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active": return <Play className="w-3 h-3" />;
      case "Completed": return <CheckCircle className="w-3 h-3" />;
      case "Upcoming": return <Clock className="w-3 h-3" />;
      case "Draft": return <Edit className="w-3 h-3" />;
      case "Paused": return <Pause className="w-3 h-3" />;
      case "Cancelled": return <X className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "High": return <AlertCircle className="w-3 h-3" />;
      case "Medium": return <Clock className="w-3 h-3" />;
      case "Low": return <CheckCircle className="w-3 h-3" />;
      default: return <Target className="w-3 h-3" />;
    }
  };

  const today = new Date();
  const deadline = new Date(project?.deadline || new Date());
  const daysLeft = Math.max(
    0,
    Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
  );

  const progress = project?.progress || Math.floor(Math.random() * 100);
  const budget = project?.budget || "$50,000 - $100,000";
  const location = project?.location || "Remote";
  const duration = project?.duration || "3-6 months";

  const skillColors = [
    "from-purple-400 to-pink-500",
    "from-blue-400 to-indigo-500",
    "from-green-400 to-teal-500",
    "from-yellow-400 to-orange-400",
    "from-red-400 to-pink-500",
    "from-cyan-400 to-blue-500"
  ];

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/5 hover:scale-[1.02] transition-all duration-300 group overflow-hidden">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 p-6 border-b border-white/10">
        <div className="flex-1">
          <div className="flex justify-end items-end gap-2 mb-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full border ${statusColors[project?.status] || statusColors.Draft}`}
            >
              {getStatusIcon(project?.status)}
              {project?.status || "Draft"}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full border ${priorityColors[project?.priority] || priorityColors.Medium}`}
            >
              {getPriorityIcon(project?.priority)}
              {project?.priority || "Medium"} Priority
            </span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent truncate">
              {project?.title || "Project Title"}
            </h2>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed ml-11">
            {project?.description?.substring(0, 100) || "Project description..."}
            {project?.description?.length > 100 && "..."}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Progress Section */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              Project Progress
            </h3>
            <span className="text-white font-bold text-lg">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
            <span>Started: {project?.startDate || "Jan 1, 2024"}</span>
            <span>Deadline: {project?.deadline || "Mar 31, 2024"}</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400 text-xs font-medium">Applicants</span>
            </div>
            <p className="text-white font-bold text-lg">{project?.applicantsCount || 0}</p>
            {project?.newApplicants > 0 && (
              <p className="text-green-400 text-xs font-medium mt-1">+{project.newApplicants} new</p>
            )}
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-gray-400 text-xs font-medium">Budget</span>
            </div>
            <p className="text-white font-bold text-sm">{budget}</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-purple-400" />
              <span className="text-gray-400 text-xs font-medium">Location</span>
            </div>
            <p className="text-white font-bold text-sm">{location}</p>
          </div>
          
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <span className="text-gray-400 text-xs font-medium">Duration</span>
            </div>
            <p className="text-white font-bold text-sm">{duration}</p>
          </div>
        </div>

        {/* Skills & Requirements */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <Code className="w-4 h-4 text-blue-400" />
            Required Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {(project?.tags || ["React", "Node.js", "TypeScript", "AWS"]).map((tag, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${skillColors[idx % skillColors.length]} flex items-center gap-1 hover:scale-105 transition-transform duration-300`}
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Team Section */}
        {project?.team && project.team.length > 0 && (
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-green-400" />
                Team Members ({project.team.length})
              </h3>
              <Button
                onClick={() => setShowTeam(!showTeam)}
                variant="ghost"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-300 text-xs font-medium"
              >
                {showTeam ? "Hide" : "View All"}
              </Button>
            </div>
            
            <div className="flex -space-x-3">
              {project.team.slice(0, showTeam ? project.team.length : 5).map((member, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full border-2 border-white/20 hover:scale-110 transition-transform duration-300"
                    title={member.name}
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white/20"></div>
                </div>
              ))}
              {project.team.length > 5 && !showTeam && (
                <div className="w-12 h-12 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center text-white text-xs font-semibold">
                  +{project.team.length - 5}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rating & Reviews */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < (project?.rating || 4) ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
                    }`}
                  />
                ))}
              </div>
              <span className="text-white font-bold text-lg">{(project?.rating || 4).toFixed(1)}</span>
              <span className="text-gray-400 text-sm">({project?.reviews || 12} reviews)</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-400 text-sm font-medium">Featured Project</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {isOwner ? (
            <>
              <Button 
                onClick={() => setShowManagementPanel(true)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm"
              >
                <Settings className="w-4 h-4" />
                Manage Project
              </Button>
              
              <Button 
                onClick={() => onInvite && onInvite(project.id)}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm"
              >
                <Users className="w-4 h-4" />
                Invite Developers
              </Button>
              
              <Button 
                onClick={() => onAction && onAction(project.id, 'boost')}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm"
              >
                <Zap className="w-4 h-4" />
                Boost Visibility
              </Button>
              
              <Button
                onClick={() => onAction && onAction(project.id, project.status === 'Active' ? 'pause' : 'resume')}
                variant="ghost"
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                  project.status === 'Active'
                    ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                    : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                }`}
              >
                {project.status === 'Active' ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
            </>
          ) : (
            <>
              <Button 
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm"
              >
                <Eye className="w-4 h-4" />
                View Details
              </Button>
              
              <Button 
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                Contact
              </Button>
              
              <Button
                onClick={() => setFavorited(!favorited)}
                variant="ghost"
                className={`p-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                  favorited 
                    ? "bg-pink-500/20 text-pink-400" 
                    : "bg-white/10 text-gray-400 hover:bg-white/20"
                }`}
              >
                <Heart className={`w-5 h-5 ${favorited ? "fill-current" : ""}`} />
              </Button>
              
              <Button 
                variant="ghost"
                className="p-3 rounded-xl bg-white/10 text-gray-400 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>

        {/* Additional Info */}
        <div className="flex flex-wrap gap-2">
          {project?.newApplicants > 0 && (
            <div className="px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-xs font-semibold rounded-full text-white flex items-center gap-1">
              <Users className="w-3 h-3" />
              {project.newApplicants} New Applicants
            </div>
          )}
          
          {project?.activity && (
            <div className="px-3 py-1 bg-gradient-to-r from-green-400 to-teal-500 text-xs font-semibold rounded-full text-white flex items-center gap-1">
              <Activity className="w-3 h-3" />
              {project.activity}
            </div>
          )}
          
          {daysLeft <= 7 && daysLeft > 0 && (
            <div className="px-3 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-xs font-semibold rounded-full text-white flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {daysLeft} days left
            </div>
          )}
          
          {project?.isFeatured && (
            <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-xs font-semibold rounded-full text-white flex items-center gap-1">
              <Award className="w-3 h-3" />
              Featured
            </div>
          )}
          
          {isOwner && (
            <div className="px-3 py-1 bg-gradient-to-r from-blue-400 to-indigo-500 text-xs font-semibold rounded-full text-white flex items-center gap-1">
              <Settings className="w-3 h-3" />
              Owner View
            </div>
          )}
        </div>
        
        {/* Owner-specific metrics */}
        {isOwner && (
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 mt-4">
            <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              Owner Metrics
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-white font-bold text-lg">{project?.applicantsCount || 0}</p>
                <p className="text-gray-400 text-xs">Total Applicants</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-lg">{project?.rating || 0}</p>
                <p className="text-gray-400 text-xs">Project Rating</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-lg">{progress}%</p>
                <p className="text-gray-400 text-xs">Progress</p>
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-lg">{daysLeft}</p>
                <p className="text-gray-400 text-xs">Days Left</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Management Panel Modal */}
      {showManagementPanel && (
        <ProjectManagementPanel
          project={project}
          onClose={() => setShowManagementPanel(false)}
          onSave={(updatedProject) => {
            console.log('Project updated:', updatedProject);
            setShowManagementPanel(false);
          }}
        />
      )}
    </div>
  );
};

export default ProjectCard;
