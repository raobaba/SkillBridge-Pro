import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Button } from "../../../components";
import { 
  Github, 
  Linkedin, 
  Link, 
  ExternalLink,
  Activity,
  Code,
  EyeOff,
  Star,
  Users,
  Brain,
  Search,
  MapPin,
  Mail,
  User,
} from "lucide-react";
import { getDevelopersWithPortfolioData } from "../slice/portfolioSyncSlice";

const ProjectOwnerPortfolioSync = ({ user }) => {
  const dispatch = useDispatch();
  const { developers, developersLoading, error } = useSelector((state) => state.portfolioSync);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [avatarErrors, setAvatarErrors] = useState({});

  // Fetch developers with portfolio sync data
  useEffect(() => {
    if (user?.id) {
      dispatch(getDevelopersWithPortfolioData({ limit: 50 }));
    }
  }, [dispatch, user?.id]);

  // Filter developers based on search query
  const filteredDevelopers = React.useMemo(() => {
    if (!developers || developers.length === 0) return [];
    return developers.filter(dev => 
      dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, developers]);

  const getSkillScore = (developer) => {
    const scores = [developer.github.skillScore, developer.linkedin.skillScore, developer.stackoverflow.skillScore];
    const validScores = scores.filter(score => score > 0);
    return validScores.length > 0 ? Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length) : 0;
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "Never";
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderDeveloperCard = (developer) => (
    <div
      key={developer.id}
      className="bg-white/5 border border-white/10 rounded-xl p-6 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02] cursor-pointer"
      onClick={() => setSelectedDeveloper(developer)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Enhanced Avatar */}
          <div className="relative group">
            {developer.avatarUrl && !avatarErrors[developer.id] ? (
              <img
                src={developer.avatarUrl}
                alt={developer.name}
                className="w-14 h-14 rounded-full border-2 border-white/20 object-cover shadow-lg group-hover:scale-110 transition-transform duration-300"
                onError={() => setAvatarErrors(prev => ({ ...prev, [developer.id]: true }))}
              />
            ) : (
              <div className="w-14 h-14 rounded-full border-2 border-white/20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/10">
                {developer.name ? developer.name.charAt(0).toUpperCase() : <User className="w-7 h-7" />}
              </div>
            )}
            {/* Status indicator */}
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-slate-900 rounded-full shadow-lg ring-2 ring-slate-900/50"></div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{developer.name}</h3>
            <p className="text-gray-300 text-sm">{developer.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-400">{developer.location}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-1 mb-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-semibold">{developer.rating || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Brain className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-semibold">{getSkillScore(developer)}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {developer.skills && developer.skills.length > 0 && developer.skills[0] !== "No skills data" ? (
            <>
              {developer.skills.slice(0, 4).map((skill, index) => (
                <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                  {skill}
                </span>
              ))}
              {developer.skills.length > 4 && (
                <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full">
                  +{developer.skills.length - 4} more
                </span>
              )}
            </>
          ) : (
            <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full">
              No skills data
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Github className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">GitHub</span>
          </div>
          <div className="text-sm font-semibold">
            {developer.github.connected ? (
              <a 
                href={developer.github.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                Connected
              </a>
            ) : (
              <span className="text-red-400">Not connected</span>
            )}
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Linkedin className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">LinkedIn</span>
          </div>
          <div className="text-sm font-semibold">
            {developer.linkedin.connected ? (
              <a 
                href={developer.linkedin.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                Connected
              </a>
            ) : (
              <span className="text-red-400">Not connected</span>
            )}
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Code className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400">StackOverflow</span>
          </div>
          <div className="text-sm font-semibold">
            {developer.stackoverflow.connected ? (
              <a 
                href={developer.stackoverflow.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                Connected
              </a>
            ) : (
              <span className="text-red-400">Not connected</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-400" />
          <span className="text-xs text-gray-400">Last active: {developer.portfolio.lastActivity}</span>
        </div>
        <Button
          size="sm"
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          View Portfolio
        </Button>
      </div>
    </div>
  );

  const renderDeveloperDetail = (developer) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Enhanced Avatar for Detail View */}
          <div className="relative group">
            {developer.avatarUrl && !avatarErrors[developer.id] ? (
              <img
                src={developer.avatarUrl}
                alt={developer.name}
                className="w-20 h-20 rounded-full border-4 border-white/30 object-cover shadow-xl group-hover:scale-105 transition-transform duration-300"
                onError={() => setAvatarErrors(prev => ({ ...prev, [developer.id]: true }))}
              />
            ) : (
              <div className="w-20 h-20 rounded-full border-4 border-white/30 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-3xl shadow-xl group-hover:scale-105 transition-transform duration-300 ring-2 ring-white/20">
                {developer.name ? developer.name.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
              </div>
            )}
            {/* Status indicator */}
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full shadow-lg ring-2 ring-slate-900/50"></div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{developer.name}</h2>
            <p className="text-gray-300">{developer.title || "Developer"}</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">{developer.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-white">{developer.rating || 0}/5.0</span>
              </div>
              <div className="flex items-center gap-1">
                <Brain className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-400">Skill Score: {getSkillScore(developer)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={() => setSelectedDeveloper(null)}
          className="hover:scale-105 transition-transform duration-300"
        >
          <EyeOff className="w-4 h-4 mr-2" />
          Close
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Platform Connections</h3>
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Github className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">GitHub</span>
                </div>
                <Badge variant={developer.github.connected ? "success" : "error"}>
                  {developer.github.connected ? "Connected" : "Not Connected"}
                </Badge>
              </div>
              {developer.github.connected && (
                <div className="text-sm text-gray-400">
                  <p>{developer.github.projects} projects • {developer.github.commits} commits • {developer.github.stars} stars</p>
                  <p>Skill Score: {developer.github.skillScore}/100</p>
                </div>
              )}
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Linkedin className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">LinkedIn</span>
                </div>
                <Badge variant={developer.linkedin.connected ? "success" : "error"}>
                  {developer.linkedin.connected ? "Connected" : "Not Connected"}
                </Badge>
              </div>
              {developer.linkedin.connected && (
                <div className="text-sm text-gray-400">
                  <p>{developer.linkedin.connections} connections</p>
                  <p>Skill Score: {developer.linkedin.skillScore}/100</p>
                </div>
              )}
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-orange-400" />
                  <span className="text-white font-medium">StackOverflow</span>
                </div>
                <Badge variant={developer.stackoverflow.connected ? "success" : "error"}>
                  {developer.stackoverflow.connected ? "Connected" : "Not Connected"}
                </Badge>
              </div>
              {developer.stackoverflow.connected && (
                <div className="text-sm text-gray-400">
                  <p>{developer.stackoverflow.reputation} reputation • {developer.stackoverflow.answers} answers</p>
                  <p>Skill Score: {developer.stackoverflow.skillScore}/100</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Recent Projects</h3>
          <div className="space-y-3">
            {developer.portfolio.projects && developer.portfolio.projects.length > 0 ? (
              developer.portfolio.projects.map((project, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{project.name}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-gray-400">{project.stars}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">{project.tech}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-400">
                <p className="text-sm">No projects available</p>
                <p className="text-xs mt-1">Portfolio data will appear after sync</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
          <Mail className="w-4 h-4 mr-2" />
          Contact Developer
        </Button>
        <Button variant="outline">
          <ExternalLink className="w-4 h-4 mr-2" />
          View Full Portfolio
        </Button>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
      <div className='max-w-7xl mx-auto px-4 py-6 sm:py-8'>
        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-300">{error}</p>
          </div>
        )}
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <Link className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                  Developer Portfolios
                </h1>
                <p className="text-gray-300 text-sm">
                  View synced developer data to make better hiring decisions
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-sm text-gray-300">
                  {filteredDevelopers.length} developers
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search developers by name, skills, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Developer List or Detail View */}
        {selectedDeveloper ? (
          renderDeveloperDetail(selectedDeveloper)
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDevelopers.map(renderDeveloperCard)}
          </div>
        )}

        {filteredDevelopers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No developers found</p>
            <p className="text-gray-500 text-sm mt-2">
              {searchQuery ? "Try adjusting your search terms" : "No developers available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectOwnerPortfolioSync;
