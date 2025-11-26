// TeamAnalyzer.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Button } from "../../../components";

const TeamAnalyzer = () => {
  const { teamAnalysis } = useSelector((state) => state.aiCareer || {});

  // Use Redux state - dynamic data from API
  const teamGaps = teamAnalysis || [];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical": return "from-red-500 via-orange-500 to-yellow-500";
      case "High": return "from-orange-500 to-yellow-500";
      case "Medium": return "from-blue-500 to-indigo-500";
      case "Low": return "from-indigo-500 to-purple-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Development": return "from-blue-500 via-purple-500 to-pink-500";
      case "Infrastructure": return "from-blue-500 to-indigo-500";
      case "Design": return "from-indigo-500 to-purple-500";
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
            <span className="text-white text-lg">👥</span>
          </div>
          <h2 className="text-3xl font-bold text-white">
            Team Skill Analyzer
          </h2>
        </div>
        <p className="text-gray-300 text-sm">Identify missing skills in your team and get hiring recommendations</p>
      </div>

      {/* Team Gaps Analysis */}
      <div className="relative z-10 space-y-4">
        {teamGaps.length > 0 ? (
          teamGaps.map((gap, idx) => (
          <div
            key={gap.id}
            className="group relative bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 cursor-pointer overflow-hidden"
            style={{
              animationDelay: `${idx * 150}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            {/* Card background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

            {/* Card content */}
            <div className="relative z-10">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  {gap.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-medium text-white group-hover:text-blue-200 transition-colors duration-300">
                      {gap.skill}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(gap.category)} text-white shadow-md`}>
                        {gap.category}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getPriorityColor(gap.priority)} text-white shadow-md`}>
                        {gap.priority}
                      </div>
                    </div>
                  </div>

                  {/* Team Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{gap.current}</div>
                      <div className="text-xs text-gray-400">Current</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{gap.needed}</div>
                      <div className="text-xs text-gray-400">Needed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">{gap.gap}</div>
                      <div className="text-xs text-gray-400">Gap</div>
                    </div>
                  </div>

                  {/* Suggestions */}
                  {gap.suggestions && gap.suggestions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-300">Hiring Recommendations:</h4>
                      <ul className="space-y-1">
                        {gap.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action indicator */}
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 text-sm group-hover:text-blue-300 transition-colors duration-300">→</span>
                  </div>
                </div>
              </div>

              {/* Hover effect indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No team analysis available yet. Check back soon!</p>
          </div>
        )}
      </div>

      {/* Footer with action button */}
      <div className="relative z-10 mt-8">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Use these insights to build a stronger, more balanced team
          </p>
          <Button 
            className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300  hover:shadow-lg hover:shadow-blue-500/25"
          >
            Start Hiring
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

export default TeamAnalyzer;
