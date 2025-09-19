import React, { useState } from "react";
import { Badge, Button } from "../../../components";
import { 
  User, 
  MessageCircle, 
  Star, 
  MapPin, 
  Clock, 
  Award, 
  Zap, 
  Heart, 
  Bookmark, 
  Share2, 
  MoreVertical, 
  Eye, 
  Phone, 
  Video, 
  Mail,
  Calendar,
  TrendingUp,
  Target,
  Shield,
  Flame,
  Crown,
  CheckCircle,
  XCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function MatchCard({ match }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showFullProfile, setShowFullProfile] = useState(false);

  const getScoreVariant = (score) => {
    if (score >= 90) return "success";
    if (score >= 70) return "warning";
    if (score >= 50) return "info";
    return "error";
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "from-green-400 to-emerald-500";
    if (score >= 70) return "from-yellow-400 to-orange-500";
    if (score >= 50) return "from-blue-400 to-cyan-500";
    return "from-red-400 to-pink-500";
  };

  const getScoreIcon = (score) => {
    if (score >= 90) return <Crown className="w-4 h-4" />;
    if (score >= 70) return <Star className="w-4 h-4" />;
    if (score >= 50) return <Target className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  const getAvailabilityColor = (availability) => {
    switch (availability?.toLowerCase()) {
      case "full-time": return "from-green-500 to-emerald-600";
      case "part-time": return "from-blue-500 to-cyan-600";
      case "freelance": return "from-purple-500 to-pink-600";
      case "contract": return "from-orange-500 to-red-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getExperienceLevel = (years) => {
    if (years >= 10) return { level: "Senior", color: "from-purple-500 to-pink-600", icon: Crown };
    if (years >= 5) return { level: "Mid", color: "from-blue-500 to-cyan-600", icon: Award };
    if (years >= 2) return { level: "Junior", color: "from-green-500 to-emerald-600", icon: Target };
    return { level: "Entry", color: "from-gray-500 to-gray-600", icon: Star };
  };

  const experienceData = getExperienceLevel(match.experience || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative group bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 h-full flex flex-col"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 blur-3xl"></div>
      
      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Header with Top Match Badge */}
        <div className="flex justify-between items-start mb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {match.name?.charAt(0) || "U"}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{match.name}</h3>
              <p className="text-gray-300 text-sm">{match.title || "Professional"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {match.matchScore >= 90 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1"
              >
                <Crown className="w-3 h-3" />
                Top Match
              </motion.div>
            )}
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isLiked 
                    ? "bg-red-500/20 text-red-400" 
                    : "bg-white/10 text-gray-400 hover:text-red-400 hover:bg-red-500/20"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              </button>
              
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isBookmarked 
                    ? "bg-blue-500/20 text-blue-400" 
                    : "bg-white/10 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20"
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 rounded-lg bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-all duration-300"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                
                {showActions && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-black/40 backdrop-blur-sm rounded-xl border border-white/20 shadow-2xl overflow-hidden z-50"
                  >
                    <button className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Share Profile
                    </button>
                    <button className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Schedule Meeting
                    </button>
                    <button className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Send Email
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Match Score */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">Match Score</span>
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getScoreColor(match.matchScore)} flex items-center justify-center text-white font-bold text-sm`}>
              {match.matchScore}%
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{match.location || "Unknown"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{match.availability || "Full-Time"}</span>
            </div>
          </div>
        </div>

        {/* Experience and Skills */}
        <div className="mb-4 flex-1">
          <div className="flex items-center gap-2 mb-3">
            <experienceData.icon className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-300">Experience Level</span>
            <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${experienceData.color} text-white text-xs font-medium`}>
              {experienceData.level} ({match.experience || 0} years)
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-300">Skills</span>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[60px]">
            {match.skills?.slice(0, 4).map((skill, index) => (
              <motion.div
                key={skill.name || skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30"
              >
                {skill.name || skill} {skill.level ? `(${skill.level})` : ""}
              </motion.div>
            ))}
            {match.skills?.length > 4 && (
              <div className="px-3 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full">
                +{match.skills.length - 4} more
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <div>
              <p className="text-xs text-gray-400">Rating</p>
              <p className="text-sm text-white font-medium">{match.rating || "4.8"}/5.0</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <div>
              <p className="text-xs text-gray-400">Response Rate</p>
              <p className="text-sm text-white font-medium">{match.responseRate || "95"}%</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
            <Button
              onClick={() => setShowFullProfile(true)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-500/50 transition-all duration-300"
            >
              <Eye className="w-4 h-4" />
              View Profile
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
            <Button
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="w-4 h-4" />
              Message
            </Button>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-white/10">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200">
            <Phone className="w-4 h-4" />
            <span className="text-xs">Call</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200">
            <Video className="w-4 h-4" />
            <span className="text-xs">Video</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200">
            <Calendar className="w-4 h-4" />
            <span className="text-xs">Schedule</span>
          </button>
        </div>
      </div>

      {/* Full Profile Modal */}
      {showFullProfile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowFullProfile(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm rounded-2xl p-8 max-w-2xl w-full border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6">
                {match.name?.charAt(0) || "U"}
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">{match.name}</h2>
              <p className="text-gray-300 mb-6">{match.title || "Professional"}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/20 rounded-lg p-4">
                  <p className="text-2xl font-bold text-white">{match.matchScore}%</p>
                  <p className="text-xs text-gray-400">Match Score</p>
                </div>
                <div className="bg-black/20 rounded-lg p-4">
                  <p className="text-2xl font-bold text-white">{match.experience || 0}</p>
                  <p className="text-xs text-gray-400">Years Experience</p>
                </div>
              </div>

              <button
                onClick={() => setShowFullProfile(false)}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
