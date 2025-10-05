import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Heart, 
  Share2, 
  Bookmark,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  ExternalLink,
  Plus,
  Minus,
  X,
  Target,
  Briefcase,
  Zap,
  Globe,
  Shield,
  Activity,
  BarChart3,
  Settings,
  Bell,
  Download,
  Upload,
  ChevronDown,
  ChevronUp,
  Info,
  HelpCircle,
  LayoutGrid,
  List,
  Loader
} from "lucide-react";
import { Button, Input, CircularLoader, ErrorState } from "../../../components";
import ProjectCard from "./ProjectCard";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// Project actions
import { 
  applyToProject, 
  searchProjects,
  addProjectFavorite,
  removeProjectFavorite,
  getProjectComments,
  addProjectComment
} from "../slice/projectSlice";

const DeveloperProjects = ({ user, projects, recommendations, favorites, dispatch, loading, error, message, searchQuery, setSearchQuery, handleSearch }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("discover"); // discover | applications
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);
  const [applicationStatusByProjectId, setApplicationStatusByProjectId] = useState({}); // { [id]: 'Applied' | 'Interviewing' | 'Shortlisted' | 'Accepted' | 'Rejected' }
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [savedProjects, setSavedProjects] = useState([]);
  const [appliedProjects, setAppliedProjects] = useState([]);
  const [projectComments, setProjectComments] = useState({});
  const [showComments, setShowComments] = useState({});
  const [internalSearch, setInternalSearch] = useState("");

  // Load applied projects from localStorage or API
  useEffect(() => {
    const applied = localStorage.getItem('appliedProjects');
    if (applied) {
      setAppliedProjects(JSON.parse(applied));
    }
  }, []);

  // Handle toast notifications
  useEffect(() => {
    if (message) {
      toast.success(message);
    }
    if (error) {
      toast.error(error);
    }
  }, [message, error]);

  // Map API data to match UI expectations
  const mapProjectData = (project) => ({
    id: project.id,
    title: project.title,
    status: project.status?.charAt(0).toUpperCase() + project.status?.slice(1) || 'Active',
    priority: project.priority?.charAt(0).toUpperCase() + project.priority?.slice(1) || 'Medium',
    description: project.description,
    startDate: project.startDate,
    deadline: project.deadline,
    roleNeeded: project.roleNeeded,
    applicantsCount: project.applicantsCount || 0,
    newApplicants: project.newApplicantsCount || 0,
    activity: `${project.activityCount || 0} updates`,
    tags: project.tags || [],
    rating: parseFloat(project.ratingAvg) || 0,
    budget: project.budgetMin && project.budgetMax ? 
      `$${project.budgetMin.toLocaleString()} - $${project.budgetMax.toLocaleString()}` : 
      'Budget TBD',
    location: project.isRemote ? 'Remote' : project.location || 'Remote',
    duration: project.duration || 'TBD',
    experience: project.experienceLevel?.charAt(0).toUpperCase() + project.experienceLevel?.slice(1) || 'Mid Level',
    category: project.category || 'Web Development',
    isRemote: project.isRemote,
    isUrgent: project.isUrgent,
    isFeatured: project.isFeatured,
    company: project.company || 'Company',
    website: project.website,
    matchScore: project.matchScoreAvg || 0,
    skills: project.tags || [],
    benefits: project.benefits,
    requirements: project.requirements,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt
  });

  // Use projects from Redux state and map them
  const displayProjects = (projects || []).map(mapProjectData);
  const [filteredProjects, setFilteredProjects] = useState(displayProjects);

  const recommendedProjects = (recommendations || []).map(mapProjectData).length > 0 ? 
    (recommendations || []).map(mapProjectData) :
    displayProjects.filter(p => p.isFeatured || (p.matchScore || 0) >= 90).slice(0, 6);

  const skillOptions = [
    "React", "Node.js", "Python", "JavaScript", "TypeScript", "Vue.js", "Angular",
    "Express", "Django", "Flask", "MongoDB", "PostgreSQL", "MySQL", "Redis",
    "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Terraform", "Jenkins",
    "Git", "GraphQL", "REST API", "Microservices", "Blockchain", "Solidity",
    "Machine Learning", "TensorFlow", "PyTorch", "Data Science", "AI", "NLP"
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Upcoming", label: "Upcoming" },
    { value: "Draft", label: "Draft" }
  ];

  const priorityOptions = [
    { value: "all", label: "All Priority" },
    { value: "High", label: "High Priority" },
    { value: "Medium", label: "Medium Priority" },
    { value: "Low", label: "Low Priority" }
  ];

  const locationOptions = [
    { value: "all", label: "All Locations" },
    { value: "Remote", label: "Remote" },
    { value: "San Francisco, CA", label: "San Francisco, CA" },
    { value: "New York, NY", label: "New York, NY" },
    { value: "Austin, TX", label: "Austin, TX" }
  ];

  const sortOptions = [
    { value: "relevance", label: "Most Relevant" },
    { value: "newest", label: "Newest First" },
    { value: "deadline", label: "Deadline" },
    { value: "budget", label: "Budget (High to Low)" },
    { value: "rating", label: "Rating" },
    { value: "applicants", label: "Fewest Applicants" }
  ];

  useEffect(() => {
    filterProjects();
  }, [searchTerm, selectedSkills, selectedStatus, selectedPriority, selectedLocation, sortBy, displayProjects]);

  // Debounce search input for better UX
  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(internalSearch), 300);
    return () => clearTimeout(t);
  }, [internalSearch]);

  // Update filtered projects when displayProjects change
  useEffect(() => {
    setFilteredProjects(displayProjects);
  }, [displayProjects]);

  const filterProjects = () => {
    let filtered = displayProjects.filter(project => {
      const matchesSearch = 
        project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.roleNeeded?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.company?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSkills = selectedSkills.length === 0 || 
        selectedSkills.some(skill => 
          project.tags?.some(tag => 
            tag.toLowerCase().includes(skill.toLowerCase())
          )
        );

      const matchesStatus = selectedStatus === "all" || project.status === selectedStatus;
      const matchesPriority = selectedPriority === "all" || project.priority === selectedPriority;
      const matchesLocation = selectedLocation === "all" || 
        (selectedLocation === "Remote" ? project.isRemote : project.location === selectedLocation);

      return matchesSearch && matchesSkills && matchesStatus && matchesPriority && matchesLocation;
    });

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "deadline":
          return new Date(a.deadline) - new Date(b.deadline);
        case "budget":
          const aBudget = parseInt(a.budget.split('-')[0].replace(/[^0-9]/g, ''));
          const bBudget = parseInt(b.budget.split('-')[0].replace(/[^0-9]/g, ''));
          return bBudget - aBudget;
        case "rating":
          return b.rating - a.rating;
        case "applicants":
          return a.applicantsCount - b.applicantsCount;
        case "relevance":
        default:
          return b.matchScore - a.matchScore;
      }
    });

    setFilteredProjects(filtered);
  };

  const handleApplyToProject = async (projectId) => {
    try {
      await dispatch(applyToProject({ projectId, coverLetter: "I am interested in this project" })).unwrap();
      if (!appliedProjects.includes(projectId)) {
        setAppliedProjects(prev => [...prev, projectId]);
      }
      setApplicationStatusByProjectId(prev => ({ ...prev, [projectId]: "Applied" }));
      // Save to localStorage
      localStorage.setItem('appliedProjects', JSON.stringify([...appliedProjects, projectId]));
      toast.success("Application submitted successfully!");
      console.log(`Applied to project ${projectId}`);
    } catch (error) {
      console.error('Failed to apply to project:', error);
      toast.error(`Failed to apply to project: ${error.message}`);
    }
  };

  const handleWithdrawApplication = (projectId) => {
    setAppliedProjects(prev => prev.filter(id => id !== projectId));
    setApplicationStatusByProjectId(prev => {
      const next = { ...prev };
      delete next[projectId];
      return next;
    });
  };

  const handleOpenDetails = (project) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedProject(null);
  };

  const canJoinGroupChat = (projectId) => applicationStatusByProjectId[projectId] === "Accepted";

  const handleSaveProject = (projectId) => {
    setSavedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleToggleFavorite = async (projectId) => {
    try {
      const isFavorited = favorites?.includes(projectId);
      if (isFavorited) {
        await dispatch(removeProjectFavorite({ projectId })).unwrap();
        toast.success("Removed from favorites");
      } else {
        await dispatch(addProjectFavorite({ projectId })).unwrap();
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast.error(`Failed to toggle favorite: ${error.message}`);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSkills([]);
    setSelectedStatus("all");
    setSelectedPriority("all");
    setSelectedLocation("all");
    setSortBy("relevance");
  };

  const stats = {
    total: displayProjects.length,
    applied: appliedProjects.length,
    saved: savedProjects.length,
    favorites: favorites?.length || 0,
    matches: filteredProjects.length
  };

  // Show loading state
  if (loading) {
    return <CircularLoader />;
  }

  // Redirect to home on error
  useEffect(() => {
    if (error) {
      navigate('/');
    }
  }, [error, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="px-6 py-8 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {activeTab === "discover" ? "Discover Projects" : "Your Applications"}
                </h1>
                <p className="text-gray-300 text-sm">
                  {activeTab === "discover" ? "Find and apply to projects that match your skills and interests" : "Track your application statuses and next steps"}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                <Target className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">
                  {stats.matches} matches found
                </span>
              </div>
              <div className="bg-white/10 rounded-xl p-1">
                <div className="grid grid-cols-2 gap-1">
                  <Button
                    onClick={() => setActiveTab("discover")}
                    variant="ghost"
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      activeTab === "discover" ? "bg-white/20 text-white" : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    Discover
                  </Button>
                  <Button
                    onClick={() => setActiveTab("applications")}
                    variant="ghost"
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      activeTab === "applications" ? "bg-white/20 text-white" : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    Applications ({appliedProjects.length})
                  </Button>
                </div>
              </div>
              <Button
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                variant="ghost"
                className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2"
              >
                {viewMode === "grid" ? "List View" : "Grid View"}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-sm text-gray-400">Total Projects</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.applied}</p>
                <p className="text-sm text-gray-400">Applied</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                <Bookmark className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.saved}</p>
                <p className="text-sm text-gray-400">Saved</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.favorites}</p>
                <p className="text-sm text-gray-400">Favorites</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.matches}</p>
                <p className="text-sm text-gray-400">Matches</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        {activeTab === "discover" && (
        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-white/10">
            <div className="flex flex-col lg:flex-row gap-4 sticky top-4 z-20">
              <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects by title, description, company, or role..."
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={internalSearch}
                  onChange={(e) => setInternalSearch(e.target.value)}
              />
            </div>
            
              <div className="flex gap-2 items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>

                <div className="hidden md:flex bg-white/10 rounded-lg overflow-hidden">
                  <Button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-2 flex items-center gap-1 text-sm ${viewMode === "grid" ? "bg-white/20 text-white" : "text-gray-300 hover:bg-white/10"}`}
                    title="Grid view"
                  >
                    <LayoutGrid className="w-4 h-4" /> Grid
                  </Button>
                  <Button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-2 flex items-center gap-1 text-sm ${viewMode === "list" ? "bg-white/20 text-white" : "text-gray-300 hover:bg-white/10"}`}
                    title="List view"
                  >
                    <List className="w-4 h-4" /> List
                  </Button>
                </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {locationOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                <Button
                  onClick={clearFilters}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-3 py-2 rounded-lg transition-colors duration-300"
                >
                  Clear Filters
                </Button>
              </div>

              {/* Skills Filter */}
              <div>
                <label className="block text-gray-300 mb-2">Filter by Skills</label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map(skill => (
                    <Button
                      key={skill}
                      onClick={() => {
                        setSelectedSkills(prev => 
                          prev.includes(skill) 
                            ? prev.filter(s => s !== skill)
                            : [...prev, skill]
                        );
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                        selectedSkills.includes(skill)
                          ? "bg-blue-500 text-white"
                          : "bg-white/10 text-gray-300 hover:bg-white/20"
                      }`}
                    >
                      {skill}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        )}

        {/* Recommended Projects */}
        {activeTab === "discover" && recommendedProjects.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Recommended for you</h2>
            <div className="overflow-x-auto">
              <div className="flex gap-4 min-w-full snap-x snap-mandatory pb-2">
                {recommendedProjects.map(project => (
                  <div key={project.id} className="min-w-[280px] bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors duration-300 relative snap-start">
                    {project.isFeatured && (
                      <span className="absolute top-3 right-3 px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">Featured</span>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                        <Briefcase className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-white font-semibold truncate">{project.title}</h3>
                    </div>
                    <p className="text-gray-300 text-sm line-clamp-3 mb-3">{project.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{project.applicantsCount}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{project.duration}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{project.budget}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        onClick={() => handleOpenDetails(project)}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300"
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => handleApplyToProject(project.id)}
                        disabled={appliedProjects.includes(project.id)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                          appliedProjects.includes(project.id)
                            ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white hover:scale-105"
                        }`}
                      >
                        {appliedProjects.includes(project.id) ? "Applied" : "Apply"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid/List or Applications */}
        {activeTab === "discover" ? (
          viewMode === "grid" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
                    <div className="h-4 w-24 bg-white/10 rounded mb-4" />
                    <div className="h-5 w-3/4 bg-white/10 rounded mb-2" />
                    <div className="h-5 w-2/3 bg-white/10 rounded mb-4" />
                    <div className="h-2 w-full bg-white/10 rounded mb-2" />
                    <div className="h-2 w-5/6 bg-white/10 rounded mb-2" />
                    <div className="h-2 w-2/3 bg-white/10 rounded" />
                  </div>
                ))
              ) : (
                filteredProjects.map((project) => (
                  <div key={project.id} className="relative h-full">
                    {/* Urgent badge only (Rewards moved into header chips) */}
                    {project.isUrgent && (
                      <div className="absolute top-3 right-3 z-10 px-2 py-1 text-[10px] rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                        Urgent
                      </div>
                    )}

                    {/* Compact Card */}
                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/5 transition-all duration-300 h-full flex flex-col">
                      {/* Header */}
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
                                  project.status === "Active" ? "bg-green-500/20 text-green-300" :
                                  project.status === "Upcoming" ? "bg-yellow-500/20 text-yellow-300" :
                                  "bg-gray-500/20 text-gray-300"
                                }`}>
                                  {project.status}
                                </span>
                                {project.isFeatured && (
                                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-yellow-500/20 text-yellow-300">
                                    Featured
                                  </span>
                                )}
                                {project.benefits && (
                                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-green-500/20 text-green-300">
                                    Rewards
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Body minimal info */}
                      <div className="p-5 flex-1 flex flex-col gap-3">
                        {/* Tags (up to 3) */}
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

                        {/* Meta Row (2 items only for compactness) */}
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{project.budget}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{project.duration}</span>
                        </div>
                      </div>

                      {/* Footer actions pinned */}
                      <div className="p-5 pt-0 mt-auto">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleOpenDetails(project)}
                            className="flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-300"
                          >
                            View Details
                          </Button>
                          <Button
                            onClick={() => handleApplyToProject(project.id)}
                            disabled={appliedProjects.includes(project.id)}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                              appliedProjects.includes(project.id)
                                ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white hover:scale-105"
                            }`}
                          >
                            {appliedProjects.includes(project.id) ? "Applied" : "Apply"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-6 hover:bg-white/5 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{project.title}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          project.status === "Active" ? "bg-green-500/20 text-green-400" :
                          project.status === "Upcoming" ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-gray-500/20 text-gray-400"
                        }`}>
                          {project.status}
                        </span>
                        {project.isFeatured && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-400">
                            Featured
                          </span>
                        )}
                        {project.benefits && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400">
                            Rewards
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-300 mb-3">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.tags.slice(0, 4).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded-full text-xs text-white bg-gradient-to-r from-blue-500 to-purple-500"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 4 && (
                          <span className="px-2 py-1 rounded-full text-xs text-gray-400 bg-white/10">
                            +{project.tags.length - 4}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {project.budget}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {project.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {project.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {project.applicantsCount} applicants
                        </span>
                      </div>
                      {project.benefits && (
                        <p className="text-xs text-green-300 mt-2">Benefits: {project.benefits}</p>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        onClick={() => handleOpenDetails(project)}
                        className="px-4 py-2 rounded-lg font-semibold transition-all duration-300 bg-white/10 hover:bg-white/20 text-white"
                      >
                        View Details
                      </Button>
                      <Button
                        onClick={() => handleApplyToProject(project.id)}
                        disabled={appliedProjects.includes(project.id)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                          appliedProjects.includes(project.id)
                            ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600 text-white hover:scale-105"
                        }`}
                      >
                        {appliedProjects.includes(project.id) ? "Applied" : "Apply Now"}
                      </Button>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSaveProject(project.id)}
                          className={`p-2 rounded-lg transition-colors duration-300 ${
                            savedProjects.includes(project.id)
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-white/10 text-gray-400 hover:bg-white/20"
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 ${savedProjects.includes(project.id) ? "fill-current" : ""}`} />
                        </Button>
                        
                        <Button
                          onClick={() => handleToggleFavorite(project.id)}
                          className={`p-2 rounded-lg transition-colors duration-300 ${
                            favorites.includes(project.id)
                              ? "bg-pink-500/20 text-pink-400"
                              : "bg-white/10 text-gray-400 hover:bg-white/20"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(project.id) ? "fill-current" : ""}`} />
                        </Button>
                        
                        <Button 
                          className="p-2 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 transition-colors duration-300"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          // Applications tab
          <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-white/5">
                  <tr className="text-left text-gray-400 uppercase text-xs tracking-wider">
                    <th className="px-6 py-4">Project</th>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Applied</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {appliedProjects.map((projectId) => {
                    const project = projects.find(p => p.id === projectId);
                    if (!project) return null;
                    const status = applicationStatusByProjectId[projectId] || "Applied";
                    const statusColors = {
                      Applied: "bg-blue-500/20 text-blue-400 border-blue-500/30",
                      Shortlisted: "bg-green-500/20 text-green-400 border-green-500/30",
                      Interviewing: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                      Accepted: "bg-purple-500/20 text-purple-400 border-purple-500/30",
                      Rejected: "bg-red-500/20 text-red-400 border-red-500/30"
                    };
                    return (
                      <tr key={projectId} className="hover:bg-white/5 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                              <Briefcase className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{project.title}</p>
                              <p className="text-gray-400 text-xs">{project.roleNeeded}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-white">{project.company}</td>
                        <td className="px-6 py-4 text-gray-300">Recently</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${statusColors[status]}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleOpenDetails(project)}
                              className="p-2 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 transition-colors duration-300"
                            >
                              View
                            </Button>
                            {canJoinGroupChat(projectId) ? (
                              <Button
                                onClick={() => console.log("Joining group chat for", projectId)}
                                className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all duration-300"
                              >
                                Join Group Chat
                              </Button>
                            ) : (
                              <Button
                                disabled
                                className="p-2 rounded-lg bg-white/5 text-gray-500 cursor-not-allowed"
                              >
                                Group Chat Locked
                              </Button>
                            )}
                            <Button
                              onClick={() => handleWithdrawApplication(projectId)}
                              className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors duration-300"
                            >
                              Withdraw
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {appliedProjects.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-400">No applications yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No projects found */}
        {activeTab === "discover" && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No projects found</p>
            <p className="text-gray-500 text-sm mt-2">
              {searchTerm || selectedSkills.length > 0 || selectedStatus !== "all" || selectedPriority !== "all" || selectedLocation !== "all"
                ? "Try adjusting your search terms or filters"
                : "No projects are currently available"}
            </p>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedProject && (
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
                  onClick={handleCloseDetails} 
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
                {selectedProject.benefits && (
                  <div>
                    <h4 className="text-white font-semibold mb-2">Rewards & Benefits</h4>
                    <p className="text-green-300 text-sm">{selectedProject.benefits}</p>
                  </div>
                )}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button 
                    onClick={handleCloseDetails} 
                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors duration-300"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => handleApplyToProject(selectedProject.id)}
                    disabled={appliedProjects.includes(selectedProject.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      appliedProjects.includes(selectedProject.id)
                        ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white hover:scale-105"
                    }`}
                  >
                    {appliedProjects.includes(selectedProject.id) ? "Applied" : "Apply Now"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperProjects;
