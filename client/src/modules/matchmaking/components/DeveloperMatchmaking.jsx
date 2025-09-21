import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, Filter, Star, MapPin, Clock, Users, TrendingUp, 
  Award, Zap, Target, Flame, Shield, Calendar, Eye, MessageCircle,
  Bookmark, Heart, MoreVertical, CheckCircle, XCircle, ArrowRight
} from "lucide-react";

const DeveloperMatchmaking = ({ user }) => {
  const [selectedTab, setSelectedTab] = useState("recommended");
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    experience: "",
    skills: "",
    salary: "",
    availability: ""
  });
  const [sortOption, setSortOption] = useState("matchScore");
  const [isLoading, setIsLoading] = useState(false);

  const [recommendedProjects] = useState([
    {
      id: 1,
      title: "E-commerce Platform Development",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-Time",
      salary: "$120k - $150k",
      matchScore: 95,
      description: "Build a scalable e-commerce platform using React, Node.js, and AWS. Lead a team of 5 developers.",
      skills: ["React", "Node.js", "AWS", "TypeScript", "PostgreSQL"],
      experience: "5+ years",
      postedDate: "2 days ago",
      applicationDeadline: "2024-02-15",
      benefits: ["Health Insurance", "401k", "Stock Options", "Remote Work"],
      teamSize: "8-10 people",
      projectDuration: "12 months",
      isBookmarked: false,
      isApplied: false
    },
    {
      id: 2,
      title: "Mobile App Development",
      company: "StartupXYZ",
      location: "Remote",
      type: "Contract",
      salary: "$80k - $100k",
      matchScore: 88,
      description: "Develop a cross-platform mobile app using React Native. Work with modern tech stack.",
      skills: ["React Native", "JavaScript", "Firebase", "Redux"],
      experience: "3+ years",
      postedDate: "1 day ago",
      applicationDeadline: "2024-02-10",
      benefits: ["Flexible Hours", "Learning Budget"],
      teamSize: "3-5 people",
      projectDuration: "6 months",
      isBookmarked: false,
      isApplied: false
    },
    {
      id: 3,
      title: "AI/ML Platform Engineer",
      company: "DataTech Solutions",
      location: "New York, NY",
      type: "Full-Time",
      salary: "$140k - $180k",
      matchScore: 92,
      description: "Design and implement ML pipelines for data processing. Work with Python, TensorFlow, and Kubernetes.",
      skills: ["Python", "TensorFlow", "Kubernetes", "Docker", "AWS"],
      experience: "4+ years",
      postedDate: "3 days ago",
      applicationDeadline: "2024-02-20",
      benefits: ["Health Insurance", "401k", "Stock Options", "Gym Membership"],
      teamSize: "12-15 people",
      projectDuration: "18 months",
      isBookmarked: false,
      isApplied: false
    }
  ]);

  const [appliedProjects] = useState([
    {
      id: 1,
      title: "Full Stack Developer",
      company: "WebCorp",
      status: "Under Review",
      appliedDate: "2024-01-15",
      matchScore: 90
    },
    {
      id: 2,
      title: "Frontend Developer",
      company: "DesignStudio",
      status: "Interview Scheduled",
      appliedDate: "2024-01-10",
      matchScore: 85
    }
  ]);

  const tabs = [
    { id: "recommended", label: "Recommended Projects", icon: Target },
    { id: "applied", label: "Applied Projects", icon: CheckCircle },
    { id: "bookmarked", label: "Bookmarked", icon: Bookmark },
    { id: "search", label: "Search All", icon: Search }
  ];

  const handleApply = (projectId) => {
    // Simulate application
    console.log(`Applied to project ${projectId}`);
  };

  const handleBookmark = (projectId) => {
    // Simulate bookmark toggle
    console.log(`Bookmarked project ${projectId}`);
  };

  const renderProjectCard = (project, index) => (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
          <p className="text-gray-300 mb-2">{project.company}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{project.type}</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span>{project.salary}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{project.matchScore}%</div>
            <div className="text-xs text-gray-400">Match Score</div>
          </div>
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => handleBookmark(project.id)}
              className={`p-2 rounded-lg transition-colors ${
                project.isBookmarked 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'bg-white/10 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20'
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 mb-4">{project.description}</p>

      {/* Skills */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300">Required Skills</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.skills.map((skill, idx) => (
            <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-400">Experience:</span>
          <span className="text-white ml-2">{project.experience}</span>
        </div>
        <div>
          <span className="text-gray-400">Duration:</span>
          <span className="text-white ml-2">{project.projectDuration}</span>
        </div>
        <div>
          <span className="text-gray-400">Team Size:</span>
          <span className="text-white ml-2">{project.teamSize}</span>
        </div>
        <div>
          <span className="text-gray-400">Deadline:</span>
          <span className="text-white ml-2">{project.applicationDeadline}</span>
        </div>
      </div>

      {/* Benefits */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Award className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300">Benefits</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.benefits.map((benefit, idx) => (
            <span key={idx} className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
              {benefit}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={() => handleApply(project.id)}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2"
        >
          <span>Apply Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center">
          <Eye className="w-4 h-4" />
        </button>
        <button className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center">
          <MessageCircle className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );

  const renderRecommendedTab = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{recommendedProjects.length}</div>
          <div className="text-sm text-gray-300">Recommended</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">92%</div>
          <div className="text-sm text-gray-300">Avg Match</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{appliedProjects.length}</div>
          <div className="text-sm text-gray-300">Applied</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">3</div>
          <div className="text-sm text-gray-300">Interviews</div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendedProjects.map((project, index) => renderProjectCard(project, index))}
      </div>
    </div>
  );

  const renderAppliedTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {appliedProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{project.title}</h3>
                <p className="text-gray-300">{project.company}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                  <span>Applied: {project.appliedDate}</span>
                  <span>Match: {project.matchScore}%</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === 'Under Review' ? 'bg-yellow-500/20 text-yellow-300' :
                  project.status === 'Interview Scheduled' ? 'bg-blue-500/20 text-blue-300' :
                  'bg-green-500/20 text-green-300'
                }`}>
                  {project.status}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderBookmarkedTab = () => (
    <div className="space-y-6">
      <div className="text-center py-12">
        <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No bookmarked projects</h3>
        <p className="text-gray-300">Bookmark projects you're interested in to save them for later.</p>
      </div>
    </div>
  );

  const renderSearchTab = () => (
    <div className="space-y-6">
      {/* Search Filters */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-bold text-white mb-4">Search Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Location</label>
            <input
              type="text"
              placeholder="Enter location"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Skills</label>
            <input
              type="text"
              placeholder="Enter skills"
              value={filters.skills}
              onChange={(e) => setFilters({...filters, skills: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Salary Range</label>
            <select
              value={filters.salary}
              onChange={(e) => setFilters({...filters, salary: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Any Salary</option>
              <option value="0-50k">$0 - $50k</option>
              <option value="50k-100k">$50k - $100k</option>
              <option value="100k-150k">$100k - $150k</option>
              <option value="150k+">$150k+</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="text-center py-12">
        <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Search for projects</h3>
        <p className="text-gray-300">Use the filters above to find projects that match your skills and preferences.</p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case "recommended": return renderRecommendedTab();
      case "applied": return renderAppliedTab();
      case "bookmarked": return renderBookmarkedTab();
      case "search": return renderSearchTab();
      default: return renderRecommendedTab();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Find Your Perfect Project</h1>
          <p className="text-gray-300">AI-powered project recommendations tailored to your skills and career goals</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex space-x-1 mb-6 bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                selectedTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default DeveloperMatchmaking;
