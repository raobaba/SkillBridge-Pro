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
  HelpCircle
} from "lucide-react";
import { Button, Input } from "../../../components";
import ProjectCard from "./ProjectCard";

const DeveloperProjects = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [appliedProjects, setAppliedProjects] = useState([]);
  const [savedProjects, setSavedProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data - in real app, this would come from API
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "AI-Powered Resume Analyzer",
      status: "Active",
      priority: "High",
      description: "Leverage AI to analyze resumes and provide job-fit insights for companies hiring at scale. We need a skilled frontend developer to build an intuitive dashboard.",
      startDate: "2025-09-01",
      deadline: "2025-12-01",
      roleNeeded: "Frontend Developer",
      applicantsCount: 12,
      newApplicants: 2,
      activity: "3 comments today",
      tags: ["React", "TailwindCSS", "Next.js", "AI"],
      rating: 4,
      budget: "$50,000 - $80,000",
      location: "Remote",
      duration: "3-6 months",
      experience: "Mid Level",
      category: "Web Development",
      isRemote: true,
      isUrgent: false,
      isFeatured: true,
      company: "TechCorp Inc.",
      website: "https://techcorp.com",
      matchScore: 92,
      team: [
        { name: "Alice", avatar: "/avatars/alice.png" },
        { name: "Bob", avatar: "/avatars/bob.png" },
        { name: "Charlie", avatar: "/avatars/charlie.png" },
      ],
      benefits: "Health insurance, flexible hours, stock options",
      requirements: "3+ years React experience, TypeScript knowledge",
      createdAt: "2025-01-15",
      updatedAt: "2025-01-20"
    },
    {
      id: 2,
      title: "Decentralized Freelance Platform",
      status: "Active",
      priority: "Medium",
      description: "A blockchain-based freelance marketplace with transparent contracts and instant payments. Looking for a blockchain engineer to lead the smart contract development.",
      startDate: "2025-08-15",
      deadline: "2026-01-15",
      roleNeeded: "Blockchain Engineer",
      applicantsCount: 25,
      newApplicants: 5,
      activity: "2 new updates",
      tags: ["Solidity", "Ethereum", "Web3", "Smart Contracts"],
      rating: 5,
      budget: "$80,000 - $120,000",
      location: "San Francisco, CA",
      duration: "6-12 months",
      experience: "Senior Level",
      category: "Blockchain",
      isRemote: true,
      isUrgent: false,
      isFeatured: false,
      company: "Blockchain Solutions",
      website: "https://blockchainsolutions.com",
      matchScore: 88,
      team: [
        { name: "David", avatar: "/avatars/david.png" },
        { name: "Eva", avatar: "/avatars/eva.png" },
      ],
      benefits: "Competitive salary, crypto bonuses, remote work",
      requirements: "5+ years blockchain experience, Solidity expertise",
      createdAt: "2025-01-10",
      updatedAt: "2025-01-18"
    },
    {
      id: 3,
      title: "Mental Health Chatbot",
      status: "Active",
      priority: "High",
      description: "An AI chatbot designed to provide mental health support, daily check-ins, and mindfulness tips. Seeking a data scientist with ML experience.",
      startDate: "2025-01-10",
      deadline: "2025-06-30",
      roleNeeded: "Data Scientist",
      applicantsCount: 40,
      newApplicants: 0,
      activity: "5 new messages",
      tags: ["Python", "TensorFlow", "Healthcare AI", "NLP"],
      rating: 5,
      budget: "$70,000 - $100,000",
      location: "New York, NY",
      duration: "6 months",
      experience: "Mid Level",
      category: "AI/ML",
      isRemote: true,
      isUrgent: true,
      isFeatured: true,
      company: "HealthTech Innovations",
      website: "https://healthtech.com",
      matchScore: 95,
      team: [
        { name: "Fiona", avatar: "/avatars/fiona.png" },
        { name: "George", avatar: "/avatars/george.png" },
      ],
      benefits: "Health benefits, mental health support, flexible schedule",
      requirements: "PhD in Data Science, 3+ years ML experience",
      createdAt: "2025-01-05",
      updatedAt: "2025-01-19"
    },
    {
      id: 4,
      title: "Remote Team Productivity Dashboard",
      status: "Upcoming",
      priority: "Medium",
      description: "A real-time dashboard for distributed teams to track productivity, communication, and goals. Need a full stack developer.",
      startDate: "2025-10-01",
      deadline: "2026-02-01",
      roleNeeded: "Full Stack Developer",
      applicantsCount: 7,
      newApplicants: 1,
      activity: "1 update today",
      tags: ["Node.js", "React", "Docker", "Microservices"],
      rating: 3,
      budget: "$60,000 - $90,000",
      location: "Austin, TX",
      duration: "4-8 months",
      experience: "Mid Level",
      category: "Web Development",
      isRemote: true,
      isUrgent: false,
      isFeatured: false,
      company: "ProductivityPro",
      website: "https://productivitypro.com",
      matchScore: 75,
      team: [
        { name: "Hannah", avatar: "/avatars/hannah.png" },
        { name: "Ian", avatar: "/avatars/ian.png" },
      ],
      benefits: "Remote work, learning budget, team events",
      requirements: "Full stack experience, microservices knowledge",
      createdAt: "2025-01-12",
      updatedAt: "2025-01-17"
    }
  ]);

  const [filteredProjects, setFilteredProjects] = useState(projects);

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
  }, [searchTerm, selectedSkills, selectedStatus, selectedPriority, selectedLocation, sortBy]);

  const filterProjects = () => {
    let filtered = projects.filter(project => {
      const matchesSearch = 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.roleNeeded.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.company.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSkills = selectedSkills.length === 0 || 
        selectedSkills.some(skill => 
          project.tags.some(tag => 
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

  const handleApplyToProject = (projectId) => {
    setAppliedProjects(prev => [...prev, projectId]);
    // In real app, this would make an API call
    console.log(`Applied to project ${projectId}`);
  };

  const handleSaveProject = (projectId) => {
    setSavedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleToggleFavorite = (projectId) => {
    setFavorites(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
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
    total: projects.length,
    applied: appliedProjects.length,
    saved: savedProjects.length,
    favorites: favorites.length,
    matches: filteredProjects.length
  };

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
                  Discover Projects
                </h1>
                <p className="text-gray-300 text-sm">
                  Find and apply to projects that match your skills and interests
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
              <button
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2"
              >
                {viewMode === "grid" ? "List View" : "Grid View"}
              </button>
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
        <div className="bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-white/10">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects by title, description, company, or role..."
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
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
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
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
                
                <button
                  onClick={clearFilters}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-3 py-2 rounded-lg transition-colors duration-300"
                >
                  Clear Filters
                </button>
              </div>

              {/* Skills Filter */}
              <div>
                <label className="block text-gray-300 mb-2">Filter by Skills</label>
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map(skill => (
                    <button
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
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Projects Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <div key={project.id} className="relative">
                <ProjectCard 
                  project={project} 
                  userRole="developer"
                  onApply={() => handleApplyToProject(project.id)}
                  onSave={() => handleSaveProject(project.id)}
                  onToggleFavorite={() => handleToggleFavorite(project.id)}
                  isApplied={appliedProjects.includes(project.id)}
                  isSaved={savedProjects.includes(project.id)}
                  isFavorited={favorites.includes(project.id)}
                />
              </div>
            ))}
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
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400">
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
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => handleApplyToProject(project.id)}
                      disabled={appliedProjects.includes(project.id)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        appliedProjects.includes(project.id)
                          ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 text-white hover:scale-105"
                      }`}
                    >
                      {appliedProjects.includes(project.id) ? "Applied" : "Apply Now"}
                    </button>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveProject(project.id)}
                        className={`p-2 rounded-lg transition-colors duration-300 ${
                          savedProjects.includes(project.id)
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-white/10 text-gray-400 hover:bg-white/20"
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${savedProjects.includes(project.id) ? "fill-current" : ""}`} />
                      </button>
                      
                      <button
                        onClick={() => handleToggleFavorite(project.id)}
                        className={`p-2 rounded-lg transition-colors duration-300 ${
                          favorites.includes(project.id)
                            ? "bg-pink-500/20 text-pink-400"
                            : "bg-white/10 text-gray-400 hover:bg-white/20"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(project.id) ? "fill-current" : ""}`} />
                      </button>
                      
                      <button className="p-2 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 transition-colors duration-300">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No projects found */}
        {filteredProjects.length === 0 && (
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
      </div>
    </div>
  );
};

export default DeveloperProjects;
