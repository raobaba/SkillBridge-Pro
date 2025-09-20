// DeveloperMatcher.jsx
import React from "react";
import { Button } from "../../../components";

const DeveloperMatcher = () => {
  const matches = [
    {
      id: 1,
      name: "Sarah Johnson",
      skills: ["React", "TypeScript", "Node.js"],
      experience: "5 years",
      match: 95,
      availability: "Available",
      rate: "$75/hour",
      location: "Remote",
      icon: "👩‍💻",
      highlights: [
        "Perfect skill match for your project",
        "Available immediately",
        "Strong portfolio in similar projects"
      ]
    },
    {
      id: 2,
      name: "Mike Chen",
      skills: ["Python", "Django", "AWS"],
      experience: "7 years",
      match: 88,
      availability: "Available",
      rate: "$85/hour",
      location: "San Francisco",
      icon: "👨‍💻",
      highlights: [
        "Senior-level expertise",
        "Cloud architecture experience",
        "Team leadership skills"
      ]
    },
    {
      id: 3,
      name: "Alex Rodriguez",
      skills: ["Vue.js", "PHP", "MySQL"],
      experience: "3 years",
      match: 82,
      availability: "Part-time",
      rate: "$60/hour",
      location: "Remote",
      icon: "👨‍💻",
      highlights: [
        "Good technical fit",
        "Flexible schedule",
        "Budget-friendly option"
      ]
    }
  ];

  const getMatchColor = (match) => {
    if (match >= 90) return "from-green-500 to-emerald-500";
    if (match >= 80) return "from-blue-500 to-indigo-500";
    if (match >= 70) return "from-yellow-500 to-orange-500";
    return "from-gray-500 to-gray-600";
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case "Available": return "from-green-500 to-emerald-500";
      case "Part-time": return "from-yellow-500 to-orange-500";
      case "Busy": return "from-red-500 to-pink-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-500/10 via-blue-500/5 to-purple-500/10 rounded-full blur-2xl"></div>

      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white text-lg">🎯</span>
          </div>
          <h2 className="text-3xl font-bold text-white">
            Developer Matcher
          </h2>
        </div>
        <p className="text-gray-300 text-sm">AI-powered recommendations for the best developers for your project</p>
      </div>

      {/* Matches Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {matches.map((match, idx) => (
          <div
            key={match.id}
            className="group relative bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer overflow-hidden"
            style={{
              animationDelay: `${idx * 150}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            {/* Card background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

            {/* Card content */}
            <div className="relative z-10">
              {/* Header with avatar and match score */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                    {match.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-200 transition-colors duration-300">
                      {match.name}
                    </h3>
                    <p className="text-sm text-gray-400">{match.experience} • {match.location}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${getMatchColor(match.match)} text-white shadow-lg`}>
                  {match.match}%
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {match.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">{match.rate}</div>
                  <div className="text-xs text-gray-400">Rate</div>
                </div>
                <div className="text-center">
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getAvailabilityColor(match.availability)} text-white`}>
                    {match.availability}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Status</div>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-300">Why this match:</h4>
                <ul className="space-y-1">
                  {match.highlights.map((highlight, idx) => (
                    <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex gap-2">
                <button className="flex-1 px-3 py-2 text-xs rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors">
                  View Profile
                </button>
                <button className="flex-1 px-3 py-2 text-xs rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors">
                  Contact
                </button>
              </div>

              {/* Hover effect indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer with action button */}
      <div className="relative z-10 mt-8">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            AI analyzes skills, experience, and availability to find your perfect match
          </p>
          <Button 
            className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
          >
            View All Matches
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default DeveloperMatcher;
