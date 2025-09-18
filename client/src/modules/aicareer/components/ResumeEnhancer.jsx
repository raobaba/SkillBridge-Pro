// ResumeEnhancer.jsx
import React from "react";
import { Button } from "../../../components"

const ResumeEnhancer = () => {
  const suggestions = [
    {
      id: 1,
      text: "Add more measurable achievements in your experience section.",
      category: "Content",
      priority: "High",
      icon: "📊"
    },
    {
      id: 2,
      text: "Include technical keywords like React, Node.js, Docker.",
      category: "Keywords",
      priority: "Medium",
      icon: "🔍"
    },
    {
      id: 3,
      text: "Tailor your resume summary to match job descriptions.",
      category: "Customization",
      priority: "High",
      icon: "🎯"
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "from-red-500 to-pink-500";
      case "Medium": return "from-yellow-500 to-orange-500";
      case "Low": return "from-green-500 to-emerald-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Content": return "from-blue-500 to-indigo-500";
      case "Keywords": return "from-purple-500 to-pink-500";
      case "Customization": return "from-emerald-500 to-teal-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-purple-500/5 rounded-2xl"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-2xl"></div>

      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-lg">✨</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Resume Enhancer
          </h2>
        </div>
        <p className="text-gray-400 text-sm">AI-powered suggestions to optimize your resume</p>
      </div>

      {/* Suggestions List */}
      <div className="relative z-10 space-y-4">
        {suggestions.map((suggestion, idx) => (
          <div
            key={suggestion.id}
            className="group relative bg-gradient-to-br from-slate-800/60 via-slate-700/40 to-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-pink-500/20 cursor-pointer overflow-hidden"
            style={{
              animationDelay: `${idx * 150}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            {/* Card background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

            {/* Card content */}
            <div className="relative z-10">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  {suggestion.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-medium text-white group-hover:text-pink-200 transition-colors duration-300">
                      {suggestion.text}
                    </span>
                  </div>

                  {/* Category and Priority badges */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(suggestion.category)} text-white shadow-md group-hover:shadow-lg transition-all duration-300`}>
                      {suggestion.category}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getPriorityColor(suggestion.priority)} text-white shadow-md group-hover:shadow-lg transition-all duration-300`}>
                      {suggestion.priority} Priority
                    </div>
                  </div>
                </div>

                {/* Action indicator */}
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <span className="text-pink-400 text-sm group-hover:text-pink-300 transition-colors duration-300">→</span>
                  </div>
                </div>
              </div>

              {/* Hover effect indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer with action button */}
      <div className="relative z-10 mt-8">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Apply these suggestions to improve your resume's ATS compatibility
          </p>
          <Button 
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25"
          >
            Apply Suggestions
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

export default ResumeEnhancer;
