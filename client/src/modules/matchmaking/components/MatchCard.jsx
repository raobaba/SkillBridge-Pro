import React, { useState } from "react";
import { 
  Star, MapPin, Clock, Award, Zap, Heart, Bookmark, 
  Eye, MessageCircle, Phone, Video, Calendar, TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";

const MatchCard = ({ match, role = "developer", onAction }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 90) return "from-green-400 to-emerald-500";
    if (score >= 70) return "from-yellow-400 to-orange-500";
    if (score >= 50) return "from-blue-400 to-cyan-500";
    return "from-red-400 to-pink-500";
  };

  const getAvailabilityColor = (availability) => {
    switch (availability?.toLowerCase()) {
      case "full-time": return "bg-green-500/20 text-green-300";
      case "part-time": return "bg-blue-500/20 text-blue-300";
      case "freelance": return "bg-purple-500/20 text-purple-300";
      case "contract": return "bg-orange-500/20 text-orange-300";
      default: return "bg-gray-500/20 text-gray-300";
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (onAction) onAction('bookmark', match.id);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (onAction) onAction('like', match.id);
  };

  const handlePrimaryAction = () => {
    if (onAction) {
      onAction(role === "developer" ? "apply" : "invite", match.id);
    }
  };

  const renderDeveloperCard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-white/30 transition-all p-6 h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
            {match.name?.charAt(0) || "D"}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{match.name}</h3>
            <p className="text-gray-300 text-sm">{match.title}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-gray-400 hover:text-blue-400'
            }`}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Match Score */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-300">Match Score</span>
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getScoreColor(match.matchScore)} flex items-center justify-center text-white font-bold text-sm`}>
            {match.matchScore}%
          </div>
        </div>
        
        <div className="flex items-center space-x-3 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{match.location}</span>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs ${getAvailabilityColor(match.availability)}`}>
            {match.availability}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-4 flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300">Skills</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {match.skills?.slice(0, 4).map((skill, index) => (
            <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
              {skill.name || skill}
            </span>
          ))}
          {match.skills?.length > 4 && (
            <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full">
              +{match.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <div>
            <p className="text-xs text-gray-400">Rating</p>
            <p className="text-sm text-white font-medium">{match.rating}/5.0</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <div>
            <p className="text-xs text-gray-400">Experience</p>
            <p className="text-sm text-white font-medium">{match.experience} years</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={handlePrimaryAction}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2"
        >
          <span>Invite to Project</span>
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

  const renderProjectCard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-white/30 transition-all p-6 h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">{match.title}</h3>
          <p className="text-gray-300 mb-2">{match.company}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{match.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{match.type}</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span>{match.salary}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="text-xl font-bold text-white">{match.matchScore}%</div>
            <div className="text-xs text-gray-400">Match Score</div>
          </div>
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-gray-400 hover:text-blue-400'
            }`}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 mb-4 flex-1">{match.description}</p>

      {/* Skills */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Zap className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300">Required Skills</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {match.skills?.slice(0, 4).map((skill, index) => (
            <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
              {skill}
            </span>
          ))}
          {match.skills?.length > 4 && (
            <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full">
              +{match.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-400">Experience:</span>
          <span className="text-white ml-2">{match.experience}</span>
        </div>
        <div>
          <span className="text-gray-400">Duration:</span>
          <span className="text-white ml-2">{match.projectDuration}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={handlePrimaryAction}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2"
        >
          <span>Apply Now</span>
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

  return role === "developer" ? renderProjectCard() : renderDeveloperCard();
};

export default MatchCard;