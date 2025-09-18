// SkillGapAnalyzer.jsx
import React from "react";
import { Button } from "../../../components"

const SkillGapAnalyzer = () => {
  const gaps = [
    { 
      skill: "Docker", 
      required: "Intermediate", 
      current: "Beginner",
      icon: "🐳",
      category: "DevOps",
      gapLevel: "High",
      progress: 25
    },
    { 
      skill: "AWS", 
      required: "Intermediate", 
      current: "Beginner",
      icon: "☁️",
      category: "Cloud",
      gapLevel: "High",
      progress: 30
    },
    { 
      skill: "System Design", 
      required: "Advanced", 
      current: "Intermediate",
      icon: "🏗️",
      category: "Architecture",
      gapLevel: "Medium",
      progress: 60
    },
  ];

  const getGapLevelColor = (level) => {
    switch (level) {
      case "High": return "from-red-500 to-pink-500";
      case "Medium": return "from-yellow-500 to-orange-500";
      case "Low": return "from-green-500 to-emerald-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Advanced": return "from-emerald-500 to-green-500";
      case "Intermediate": return "from-blue-500 to-indigo-500";
      case "Beginner": return "from-yellow-500 to-orange-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "DevOps": return "from-purple-500 to-pink-500";
      case "Cloud": return "from-blue-500 to-cyan-500";
      case "Architecture": return "from-indigo-500 to-purple-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 rounded-2xl"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-full blur-2xl"></div>
      
      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-lg">📊</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Skill Gap Analyzer
          </h2>
        </div>
        <p className="text-gray-400 text-sm">Identify skills you need to develop for your career goals</p>
      </div>

      {/* Skills Grid - Mobile First */}
      <div className="relative z-10 space-y-4 lg:hidden">
        {gaps.map((gap, idx) => (
          <div
            key={idx}
            className="group relative bg-gradient-to-br from-slate-800/60 via-slate-700/40 to-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer overflow-hidden"
            style={{
              animationDelay: `${idx * 150}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            {/* Card background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            
            {/* Card content */}
            <div className="relative z-10">
              {/* Header with icon and skill name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                  {gap.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-purple-200 transition-colors duration-300">
                    {gap.skill}
                  </h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(gap.category)} text-white inline-block`}>
                    {gap.category}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getGapLevelColor(gap.gapLevel)} text-white`}>
                  {gap.gapLevel} Gap
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>Skill Level Progress</span>
                  <span className="font-medium">{gap.progress}%</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${getLevelColor(gap.current)} rounded-full transition-all duration-1000 ease-out`}
                    style={{ 
                      width: `${gap.progress}%`,
                      animationDelay: `${idx * 200 + 500}ms`
                    }}
                  ></div>
                </div>
              </div>

              {/* Level comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-1">Required</p>
                  <div className={`px-3 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r ${getLevelColor(gap.required)} text-white shadow-md`}>
                    {gap.required}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-1">Current</p>
                  <div className={`px-3 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r ${getLevelColor(gap.current)} text-white shadow-md`}>
                    {gap.current}
                  </div>
                </div>
              </div>

              {/* Hover effect indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="relative z-10 hidden lg:block">
        <div className="bg-gradient-to-br from-slate-800/40 via-slate-700/30 to-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 px-6 py-4 border-b border-white/10">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-300">
              <div className="col-span-3">Skill</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Required</div>
              <div className="col-span-2">Current</div>
              <div className="col-span-2">Progress</div>
              <div className="col-span-1">Gap</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-white/10">
            {gaps.map((gap, idx) => (
              <div
                key={idx}
                className="group px-6 py-4 hover:bg-slate-800/30 transition-all duration-300 cursor-pointer"
                style={{
                  animationDelay: `${idx * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Skill */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-lg flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-300">
                      {gap.icon}
                    </div>
                    <div>
                      <div className="text-white font-medium group-hover:text-purple-200 transition-colors duration-300">
                        {gap.skill}
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="col-span-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(gap.category)} text-white inline-block`}>
                      {gap.category}
                    </div>
                  </div>

                  {/* Required Level */}
                  <div className="col-span-2">
                    <div className={`px-3 py-1 rounded-lg text-sm font-semibold bg-gradient-to-r ${getLevelColor(gap.required)} text-white text-center`}>
                      {gap.required}
                    </div>
                  </div>

                  {/* Current Level */}
                  <div className="col-span-2">
                    <div className={`px-3 py-1 rounded-lg text-sm font-semibold bg-gradient-to-r ${getLevelColor(gap.current)} text-white text-center`}>
                      {gap.current}
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-700/50 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${getLevelColor(gap.current)} rounded-full transition-all duration-1000 ease-out`}
                          style={{ 
                            width: `${gap.progress}%`,
                            animationDelay: `${idx * 200 + 500}ms`
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400 font-medium">{gap.progress}%</span>
                    </div>
                  </div>

                  {/* Gap Level */}
                  <div className="col-span-1">
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getGapLevelColor(gap.gapLevel)} text-white text-center`}>
                      {gap.gapLevel}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with action button */}
      <div className="relative z-10 mt-8">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Focus on high-priority skills to accelerate your career growth
          </p>
          <Button 
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
          >
            View Learning Path
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

export default SkillGapAnalyzer;
