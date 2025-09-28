import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, Filter, Star, MapPin, Clock, Users, TrendingUp, 
  Award, Zap, Target, Flame, Shield, Calendar, Eye, MessageCircle,
  Bookmark, Heart, MoreVertical, CheckCircle, XCircle, ArrowRight,
  UserCheck, ThumbsUp, Award as AwardIcon, Briefcase, Globe
} from "lucide-react";
import Button from "../../../components/Button";

const ProjectOwnerMatchmaking = ({ user }) => {
  const [selectedTab, setSelectedTab] = useState("recommended");
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    experience: "",
    skills: "",
    availability: "",
    rating: ""
  });
  const [sortOption, setSortOption] = useState("matchScore");
  const [isLoading, setIsLoading] = useState(false);

  const [recommendedDevelopers] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      title: "Senior Frontend Developer",
      location: "San Francisco, CA",
      availability: "Full-Time",
      matchScore: 95,
      rating: 4.9,
      experience: "8 years",
      hourlyRate: "$80-100/hr",
      responseTime: "2 hours",
      description: "Expert React developer with 8+ years of experience building scalable web applications. Led teams of 10+ developers.",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"],
      portfolio: "https://alicejohnson.dev",
      github: "https://github.com/alicejohnson",
      linkedin: "https://linkedin.com/in/alicejohnson",
      endorsements: 24,
      completedProjects: 45,
      averageProjectRating: 4.8,
      specialties: ["Frontend Development", "UI/UX", "Performance Optimization"],
      languages: ["English", "Spanish"],
      education: "BS Computer Science - MIT",
      certifications: ["AWS Certified Developer", "Google UX Design Certificate"],
      isBookmarked: false,
      isInvited: false,
      lastActive: "2 hours ago"
    },
    {
      id: 2,
      name: "Bob Smith",
      title: "Lead Backend Engineer",
      location: "Remote",
      availability: "Full-Time",
      matchScore: 92,
      rating: 4.8,
      experience: "12 years",
      hourlyRate: "$90-120/hr",
      responseTime: "1 hour",
      description: "Experienced backend engineer specializing in microservices architecture and cloud infrastructure.",
      skills: ["Node.js", "Python", "PostgreSQL", "Docker", "Kubernetes"],
      portfolio: "https://bobsmith.dev",
      github: "https://github.com/bobsmith",
      linkedin: "https://linkedin.com/in/bobsmith",
      endorsements: 18,
      completedProjects: 32,
      averageProjectRating: 4.7,
      specialties: ["Backend Development", "DevOps", "System Architecture"],
      languages: ["English", "French"],
      education: "MS Software Engineering - Stanford",
      certifications: ["AWS Solutions Architect", "Kubernetes Administrator"],
      isBookmarked: false,
      isInvited: false,
      lastActive: "1 hour ago"
    },
    {
      id: 3,
      name: "Charlie Brown",
      title: "Data Scientist",
      location: "Chicago, IL",
      availability: "Part-Time",
      matchScore: 88,
      rating: 4.7,
      experience: "5 years",
      hourlyRate: "$70-90/hr",
      responseTime: "4 hours",
      description: "Data scientist with expertise in machine learning and statistical analysis. Passionate about turning data into actionable insights.",
      skills: ["Python", "R", "TensorFlow", "PyTorch", "SQL"],
      portfolio: "https://charliebrown.dev",
      github: "https://github.com/charliebrown",
      linkedin: "https://linkedin.com/in/charliebrown",
      endorsements: 15,
      completedProjects: 28,
      averageProjectRating: 4.6,
      specialties: ["Machine Learning", "Data Analysis", "Statistical Modeling"],
      languages: ["English", "Mandarin"],
      education: "PhD Statistics - University of Chicago",
      certifications: ["Google Data Analytics", "Microsoft Azure AI"],
      isBookmarked: false,
      isInvited: false,
      lastActive: "3 hours ago"
    }
  ]);

  const [invitedDevelopers] = useState([
    {
      id: 1,
      name: "Sarah Wilson",
      title: "Full Stack Developer",
      status: "Invited",
      invitedDate: "2024-01-15",
      matchScore: 90,
      responseStatus: "Pending"
    },
    {
      id: 2,
      name: "Mike Chen",
      title: "DevOps Engineer",
      status: "Accepted",
      invitedDate: "2024-01-10",
      matchScore: 87,
      responseStatus: "Accepted"
    }
  ]);

  const tabs = [
    { id: "recommended", label: "Recommended Developers", icon: Target },
    { id: "invited", label: "Invited Developers", icon: UserCheck },
    { id: "bookmarked", label: "Bookmarked", icon: Bookmark },
    { id: "search", label: "Search All", icon: Search }
  ];

  const handleInvite = (developerId) => {
    // Simulate invitation
    console.log(`Invited developer ${developerId}`);
  };

  const handleBookmark = (developerId) => {
    // Simulate bookmark toggle
    console.log(`Bookmarked developer ${developerId}`);
  };

  const renderDeveloperCard = (developer, index) => (
    <motion.div
      key={developer.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {developer.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{developer.name}</h3>
            <p className="text-gray-300">{developer.title}</p>
            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{developer.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{developer.availability}</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>{developer.hourlyRate}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{developer.matchScore}%</div>
            <div className="text-xs text-gray-400">Match Score</div>
          </div>
          <div className="flex flex-col space-y-1">
            <Button
              onClick={() => handleBookmark(developer.id)}
              variant="ghost"
              size="sm"
              className={`p-2 ${
                developer.isBookmarked 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'bg-white/10 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20'
              }`}
              leftIcon={Bookmark}
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 mb-4">{developer.description}</p>

      {/* Skills */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300">Skills</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {developer.skills.map((skill, idx) => (
            <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-white">{developer.endorsements}</div>
          <div className="text-xs text-gray-400">Endorsements</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-white">{developer.completedProjects}</div>
          <div className="text-xs text-gray-400">Projects</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-white">{developer.averageProjectRating}</div>
          <div className="text-xs text-gray-400">Avg Rating</div>
        </div>
      </div>

      {/* Rating and Response Time */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <span className="text-white font-medium">{developer.rating}/5.0</span>
          <span className="text-gray-400 text-sm">({developer.experience})</span>
        </div>
        <div className="text-sm text-gray-400">
          Responds in {developer.responseTime}
        </div>
      </div>

      {/* Portfolio Links */}
      <div className="flex items-center space-x-4 mb-4">
        <a href={developer.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm">
          <Globe className="w-4 h-4" />
          <span>Portfolio</span>
        </a>
        <a href={developer.github} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-gray-400 hover:text-white text-sm">
          <Briefcase className="w-4 h-4" />
          <span>GitHub</span>
        </a>
        <a href={developer.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm">
          <Users className="w-4 h-4" />
          <span>LinkedIn</span>
        </a>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <Button
          onClick={() => handleInvite(developer.id)}
          variant="default"
          className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-lg"
          rightIcon={ArrowRight}
        >
          Invite to Project
        </Button>
        <Button
          variant="ghost"
          className="px-4 py-2 bg-white/10 text-gray-300 hover:bg-white/20"
          leftIcon={Eye}
        />
        <Button
          variant="ghost"
          className="px-4 py-2 bg-white/10 text-gray-300 hover:bg-white/20"
          leftIcon={MessageCircle}
        />
      </div>
    </motion.div>
  );

  const renderRecommendedTab = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{recommendedDevelopers.length}</div>
          <div className="text-sm text-gray-300">Recommended</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">92%</div>
          <div className="text-sm text-gray-300">Avg Match</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{invitedDevelopers.length}</div>
          <div className="text-sm text-gray-300">Invited</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">2</div>
          <div className="text-sm text-gray-300">Accepted</div>
        </div>
      </div>

      {/* Developers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recommendedDevelopers.map((developer, index) => renderDeveloperCard(developer, index))}
      </div>
    </div>
  );

  const renderInvitedTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {invitedDevelopers.map((developer, index) => (
          <motion.div
            key={developer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{developer.name}</h3>
                <p className="text-gray-300">{developer.title}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                  <span>Invited: {developer.invitedDate}</span>
                  <span>Match: {developer.matchScore}%</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  developer.responseStatus === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' :
                  developer.responseStatus === 'Accepted' ? 'bg-green-500/20 text-green-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {developer.responseStatus}
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
        <h3 className="text-xl font-bold text-white mb-2">No bookmarked developers</h3>
        <p className="text-gray-300">Bookmark developers you're interested in to save them for later.</p>
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
            <label className="block text-sm text-gray-300 mb-2">Experience</label>
            <select
              value={filters.experience}
              onChange={(e) => setFilters({...filters, experience: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Any Experience</option>
              <option value="0-2">0-2 years</option>
              <option value="3-5">3-5 years</option>
              <option value="6-10">6-10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="text-center py-12">
        <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Search for developers</h3>
        <p className="text-gray-300">Use the filters above to find developers that match your project requirements.</p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case "recommended": return renderRecommendedTab();
      case "invited": return renderInvitedTab();
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
          <h1 className="text-3xl font-bold text-white mb-2">Find Your Perfect Developer</h1>
          <p className="text-gray-300">AI-powered developer recommendations with enriched profiles and endorsements</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex space-x-1 mb-6 bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20"
        >
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              variant="ghost"
              className={`flex items-center space-x-2 ${
                selectedTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
              leftIcon={tab.icon}
            >
              {tab.label}
            </Button>
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

export default ProjectOwnerMatchmaking;
