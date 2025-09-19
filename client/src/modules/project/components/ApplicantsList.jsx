// components/ApplicantsList.jsx
import React, { useState, useMemo } from "react";
import { 
  Star, 
  Heart, 
  Search, 
  Filter, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Eye,
  MessageSquare,
  Calendar,
  MapPin,
  Award,
  TrendingUp,
  MoreVertical,
  Download,
  Mail,
  Phone,
  ExternalLink,
  UserCheck,
  UserX,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Share2,
  Edit,
  Trash2,
  Plus,
  X
} from "lucide-react";

const ApplicantsList = () => {
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("name");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // table or card
  const [showFilters, setShowFilters] = useState(false);
  const [expandedApplicant, setExpandedApplicant] = useState(null);

  const applicants = [
    {
      id: 1,
      name: "Alice Johnson",
      role: "Frontend Developer",
      skills: ["React", "TailwindCSS", "Next.js", "TypeScript"],
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      status: "Applied",
      rating: 4,
      notes: "Top Performer in last project",
      experience: "3 years",
      location: "San Francisco, CA",
      availability: "Available",
      appliedDate: "2024-01-15",
      lastActive: "2 hours ago",
      portfolio: "https://alicejohnson.dev",
      linkedin: "https://linkedin.com/in/alicejohnson",
      github: "https://github.com/alicejohnson",
      expectedSalary: "$80,000 - $100,000",
      matchScore: 92,
      tags: ["Senior", "Remote", "UI/UX"]
    },
    {
      id: 2,
      name: "Michael Smith",
      role: "Backend Developer",
      skills: ["Node.js", "Express", "MongoDB", "PostgreSQL", "Docker"],
      avatar: "https://randomuser.me/api/portraits/men/33.jpg",
      status: "Shortlisted",
      rating: 5,
      notes: "Strong in DB optimization",
      experience: "5 years",
      location: "New York, NY",
      availability: "Available",
      appliedDate: "2024-01-14",
      lastActive: "1 day ago",
      portfolio: "https://michaelsmith.dev",
      linkedin: "https://linkedin.com/in/michaelsmith",
      github: "https://github.com/michaelsmith",
      expectedSalary: "$90,000 - $120,000",
      matchScore: 88,
      tags: ["Lead", "On-site", "Architecture"]
    },
    {
      id: 3,
      name: "Sara Williams",
      role: "Data Scientist",
      skills: ["Python", "Pandas", "TensorFlow", "Scikit-learn", "SQL"],
      avatar: "https://randomuser.me/api/portraits/women/55.jpg",
      status: "Interviewing",
      rating: 3,
      notes: "Needs more ML project exposure",
      experience: "2 years",
      location: "Austin, TX",
      availability: "Available",
      appliedDate: "2024-01-13",
      lastActive: "3 hours ago",
      portfolio: "https://sarawilliams.dev",
      linkedin: "https://linkedin.com/in/sarawilliams",
      github: "https://github.com/sarawilliams",
      expectedSalary: "$70,000 - $90,000",
      matchScore: 75,
      tags: ["Junior", "Hybrid", "ML"]
    },
    {
      id: 4,
      name: "David Lee",
      role: "Full Stack Developer",
      skills: ["React", "Node.js", "Docker", "AWS", "GraphQL"],
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      status: "Applied",
      rating: 4,
      notes: "Good team player",
      experience: "4 years",
      location: "Seattle, WA",
      availability: "Available",
      appliedDate: "2024-01-12",
      lastActive: "5 hours ago",
      portfolio: "https://davidlee.dev",
      linkedin: "https://linkedin.com/in/davidlee",
      github: "https://github.com/davidlee",
      expectedSalary: "$85,000 - $110,000",
      matchScore: 85,
      tags: ["Mid-level", "Remote", "DevOps"]
    },
    {
      id: 5,
      name: "Emily Chen",
      role: "UI/UX Designer",
      skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"],
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      status: "Shortlisted",
      rating: 5,
      notes: "Excellent design portfolio",
      experience: "6 years",
      location: "Los Angeles, CA",
      availability: "Available",
      appliedDate: "2024-01-11",
      lastActive: "1 hour ago",
      portfolio: "https://emilychen.design",
      linkedin: "https://linkedin.com/in/emilychen",
      github: "https://github.com/emilychen",
      expectedSalary: "$75,000 - $95,000",
      matchScore: 90,
      tags: ["Senior", "Remote", "Design"]
    },
    {
      id: 6,
      name: "James Wilson",
      role: "DevOps Engineer",
      skills: ["Kubernetes", "AWS", "Terraform", "Jenkins", "Linux"],
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      status: "Applied",
      rating: 4,
      notes: "Strong infrastructure knowledge",
      experience: "7 years",
      location: "Chicago, IL",
      availability: "Available",
      appliedDate: "2024-01-10",
      lastActive: "4 hours ago",
      portfolio: "https://jameswilson.dev",
      linkedin: "https://linkedin.com/in/jameswilson",
      github: "https://github.com/jameswilson",
      expectedSalary: "$95,000 - $125,000",
      matchScore: 87,
      tags: ["Senior", "On-site", "Infrastructure"]
    }
  ];

  const statusColors = {
    Applied: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    Shortlisted: "bg-green-500/20 text-green-400 border-green-500/30",
    Interviewing: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    Rejected: "bg-red-500/20 text-red-400 border-red-500/30",
    Hired: "bg-purple-500/20 text-purple-400 border-purple-500/30"
  };

  const skillColors = [
    "from-purple-400 to-pink-500",
    "from-blue-400 to-indigo-500",
    "from-green-400 to-teal-500",
    "from-yellow-400 to-orange-400",
    "from-red-400 to-pink-500",
    "from-cyan-400 to-blue-500"
  ];

  const filteredAndSortedApplicants = useMemo(() => {
    let filtered = applicants.filter((app) => {
      const matchesSearch = 
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        app.role.toLowerCase().includes(search.toLowerCase()) ||
        app.skills.some((skill) =>
          skill.toLowerCase().includes(search.toLowerCase())
        ) ||
        app.location.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || app.status === statusFilter;
      const matchesRating = ratingFilter === "all" || 
        (ratingFilter === "high" && app.rating >= 4) ||
        (ratingFilter === "medium" && app.rating === 3) ||
        (ratingFilter === "low" && app.rating <= 2);
      
      return matchesSearch && matchesStatus && matchesRating;
    });

    filtered.sort((a, b) => {
      if (sortOption === "name") return a.name.localeCompare(b.name);
      if (sortOption === "rating") return b.rating - a.rating;
      if (sortOption === "status") return a.status.localeCompare(b.status);
      if (sortOption === "matchScore") return b.matchScore - a.matchScore;
      if (sortOption === "appliedDate") return new Date(b.appliedDate) - new Date(a.appliedDate);
      return 0;
    });

    return filtered;
  }, [search, sortOption, statusFilter, ratingFilter]);

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(f => f !== id)
        : [...prev, id]
    );
  };

  const toggleSelection = (id) => {
    setSelectedApplicants(prev => 
      prev.includes(id) 
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  };

  const handleBulkAction = (action) => {
    if (action === "shortlist") {
      // Handle bulk shortlist
      console.log("Shortlisting:", selectedApplicants);
    } else if (action === "reject") {
      // Handle bulk reject
      console.log("Rejecting:", selectedApplicants);
    }
    setSelectedApplicants([]);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Applied": return <Clock className="w-3 h-3" />;
      case "Shortlisted": return <CheckCircle className="w-3 h-3" />;
      case "Interviewing": return <Users className="w-3 h-3" />;
      case "Rejected": return <UserX className="w-3 h-3" />;
      case "Hired": return <UserCheck className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const stats = {
    total: applicants.length,
    applied: applicants.filter(a => a.status === "Applied").length,
    shortlisted: applicants.filter(a => a.status === "Shortlisted").length,
    interviewing: applicants.filter(a => a.status === "Interviewing").length,
    averageRating: (applicants.reduce((sum, a) => sum + a.rating, 0) / applicants.length).toFixed(1)
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Applicants Overview
              </h2>
              <p className="text-gray-300 text-sm">
                Manage and review all project applicants
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
              <Users className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">
                {stats.total} Total Applicants
              </span>
            </div>
            <button
              onClick={() => setViewMode(viewMode === "table" ? "card" : "table")}
              className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors duration-300"
            >
              {viewMode === "table" ? "Card View" : "Table View"}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-sm text-gray-400">Total</p>
            </div>
          </div>
        </div>
        
        <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.applied}</p>
              <p className="text-sm text-gray-400">Applied</p>
            </div>
          </div>
        </div>
        
        <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.shortlisted}</p>
              <p className="text-sm text-gray-400">Shortlisted</p>
            </div>
          </div>
        </div>
        
        <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.interviewing}</p>
              <p className="text-sm text-gray-400">Interviewing</p>
            </div>
          </div>
        </div>
        
        <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.averageRating}</p>
              <p className="text-sm text-gray-400">Avg Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-white/10">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, role, skills, or location..."
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
              <option value="status">Sort by Status</option>
              <option value="matchScore">Sort by Match Score</option>
              <option value="appliedDate">Sort by Applied Date</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Rejected">Rejected</option>
              <option value="Hired">Hired</option>
            </select>
            
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Ratings</option>
              <option value="high">High (4-5 stars)</option>
              <option value="medium">Medium (3 stars)</option>
              <option value="low">Low (1-2 stars)</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedApplicants.length > 0 && (
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-400 text-sm">
                {selectedApplicants.length} applicant(s) selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction("shortlist")}
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 px-3 py-1 rounded text-sm transition-colors duration-300"
                >
                  <CheckCircle className="w-3 h-3 mr-1 inline" />
                  Shortlist
                </button>
                <button
                  onClick={() => handleBulkAction("reject")}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-3 py-1 rounded text-sm transition-colors duration-300"
                >
                  <UserX className="w-3 h-3 mr-1 inline" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Applicants Display */}
      {viewMode === "table" ? (
        <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-white/5">
                <tr className="text-left text-gray-400 uppercase text-xs tracking-wider">
                  <th className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedApplicants.length === filteredAndSortedApplicants.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedApplicants(filteredAndSortedApplicants.map(a => a.id));
                        } else {
                          setSelectedApplicants([]);
                        }
                      }}
                      className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Role & Skills</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Match Score</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredAndSortedApplicants.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-white/5 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedApplicants.includes(app.id)}
                        onChange={() => toggleSelection(app.id)}
                        className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                      />
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={app.avatar}
                            alt={app.name}
                            className="w-12 h-12 rounded-full border-2 border-blue-400/50"
                          />
                          {favorites.includes(app.id) && (
                            <Heart className="absolute -top-1 -right-1 w-4 h-4 text-pink-500 fill-pink-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">{app.name}</p>
                          <p className="text-gray-400 text-sm">{app.location}</p>
                          <p className="text-gray-500 text-xs">{app.experience}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{app.role}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {app.skills.slice(0, 3).map((skill, i) => (
                            <span
                              key={i}
                              className={`px-2 py-1 rounded-full text-xs text-white bg-gradient-to-r ${skillColors[i % skillColors.length]}`}
                            >
                              {skill}
                            </span>
                          ))}
                          {app.skills.length > 3 && (
                            <span className="px-2 py-1 rounded-full text-xs text-gray-400 bg-white/10">
                              +{app.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${statusColors[app.status]}`}
                      >
                        {getStatusIcon(app.status)}
                        {app.status}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < app.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-500"
                            }`}
                          />
                        ))}
                        <span className="text-gray-400 text-sm ml-1">({app.rating})</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                            style={{ width: `${app.matchScore}%` }}
                          />
                        </div>
                        <span className="text-white text-sm font-medium">{app.matchScore}%</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFavorite(app.id)}
                          className={`p-2 rounded-lg transition-colors duration-300 ${
                            favorites.includes(app.id)
                              ? "bg-pink-500/20 text-pink-400"
                              : "bg-white/10 text-gray-400 hover:bg-white/20"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(app.id) ? "fill-current" : ""}`} />
                        </button>
                        
                        <button
                          onClick={() => setExpandedApplicant(expandedApplicant === app.id ? null : app.id)}
                          className="p-2 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 transition-colors duration-300"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button className="p-2 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 transition-colors duration-300">
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedApplicants.map((app) => (
            <div
              key={app.id}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:scale-[1.02] transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={app.avatar}
                      alt={app.name}
                      className="w-16 h-16 rounded-full border-2 border-blue-400/50"
                    />
                    {favorites.includes(app.id) && (
                      <Heart className="absolute -top-1 -right-1 w-5 h-5 text-pink-500 fill-pink-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{app.name}</h3>
                    <p className="text-gray-400 text-sm">{app.role}</p>
                    <p className="text-gray-500 text-xs">{app.location}</p>
                  </div>
                </div>
                
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${statusColors[app.status]}`}
                >
                  {getStatusIcon(app.status)}
                  {app.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Rating</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < app.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-500"
                        }`}
                      />
                    ))}
                    <span className="text-gray-400 text-sm ml-1">({app.rating})</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Match Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                        style={{ width: `${app.matchScore}%` }}
                      />
                    </div>
                    <span className="text-white text-sm font-medium">{app.matchScore}%</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {app.skills.slice(0, 4).map((skill, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded-full text-xs text-white bg-gradient-to-r ${skillColors[i % skillColors.length]}`}
                    >
                      {skill}
                    </span>
                  ))}
                  {app.skills.length > 4 && (
                    <span className="px-2 py-1 rounded-full text-xs text-gray-400 bg-white/10">
                      +{app.skills.length - 4}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-300 text-sm">{app.notes}</p>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFavorite(app.id)}
                    className={`p-2 rounded-lg transition-colors duration-300 ${
                      favorites.includes(app.id)
                        ? "bg-pink-500/20 text-pink-400"
                        : "bg-white/10 text-gray-400 hover:bg-white/20"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(app.id) ? "fill-current" : ""}`} />
                  </button>
                  
                  <button className="p-2 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 transition-colors duration-300">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  
                  <button className="p-2 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 transition-colors duration-300">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex gap-1">
                  <button className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-sm hover:bg-green-500/30 transition-colors duration-300">
                    <CheckCircle className="w-3 h-3 mr-1 inline" />
                    Shortlist
                  </button>
                  <button className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-sm hover:bg-red-500/30 transition-colors duration-300">
                    <UserX className="w-3 h-3 mr-1 inline" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No applicants found */}
      {filteredAndSortedApplicants.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No applicants found</p>
          <p className="text-gray-500 text-sm mt-2">
            {search ? "Try adjusting your search terms" : "No applicants match your current filters"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplicantsList;
