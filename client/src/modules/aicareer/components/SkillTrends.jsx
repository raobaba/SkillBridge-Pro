// SkillTrends.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Button } from "../../../components";

const SkillTrends = () => {
  const { skillTrends } = useSelector((state) => state.aiCareer || {});

  // Use Redux state - dynamic data from API
  const trends = skillTrends || [];
  
  // Calculate dynamic summary stats from API data
  const topTrendingCount = trends.length;
  const averageGrowth = trends.length > 0 
    ? Math.round(trends.reduce((sum, trend) => {
        const growthValue = parseInt(trend.growth?.replace(/[^0-9]/g, '') || '0');
        return sum + growthValue;
      }, 0) / trends.length)
    : 0;
  const totalProjects = trends.reduce((sum, trend) => sum + (trend.projects || 0), 0);

  const getTrendColor = (trend) => {
    return trend === "up" ? "text-green-400" : "text-red-400";
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Frontend": return "from-blue-500 via-purple-500 to-pink-500";
      case "Backend": return "from-blue-500 to-indigo-500";
      case "Cloud": return "from-indigo-500 to-purple-500";
      case "DevOps": return "from-purple-500 to-pink-500";
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
            <span className="text-white text-lg">📈</span>
          </div>
          <h2 className="text-3xl font-bold text-white">
            Skill Demand Trends
          </h2>
        </div>
        <p className="text-gray-300 text-sm">Real-time analysis of skill demand and market trends across the platform</p>
      </div>

      {/* Trends Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trends.length > 0 ? (
          trends.map((trend, idx) => (
          <div
            key={trend.id}
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
              {/* Header with skill and trend */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center text-2xl">
                    {trend.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-200 transition-colors duration-300">
                      {trend.skill}
                    </h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(trend.category)} text-white`}>
                      {trend.category}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${getTrendColor(trend.trend)}`}>
                    {trend.growth}
                  </div>
                  <div className="text-xs text-gray-400">Growth</div>
                </div>
              </div>

              {/* Demand Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-300 mb-2">
                  <span>Demand Level</span>
                  <span className="font-medium">{trend.demand}%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${trend.color} rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg`}
                    style={{ 
                      width: `${trend.demand}%`,
                      animationDelay: `${idx * 200 + 500}ms`
                    }}
                  ></div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-400">{trend.projects}</div>
                  <div className="text-xs text-gray-400">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">{trend.developers}</div>
                  <div className="text-xs text-gray-400">Developers</div>
                </div>
              </div>

              {/* Market Insights */}
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <h4 className="text-sm font-medium text-gray-300 mb-1">Market Insight:</h4>
                <p className="text-xs text-gray-400">
                  {trend.demand >= 80 ? "High demand skill with excellent job prospects" :
                   trend.demand >= 60 ? "Growing demand with good opportunities" :
                   "Emerging skill with potential for growth"}
                </p>
              </div>

              {/* Hover effect indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400">No skill trends available yet. Check back soon!</p>
          </div>
        )}
      </div>

      {/* Summary Stats - Dynamic */}
      <div className="relative z-10 mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{topTrendingCount}</div>
            <div className="text-sm text-gray-300">Top Trending Skills</div>
            <div className="text-xs text-gray-400 mt-1">Skills with highest growth</div>
          </div>
        </div>
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">+{averageGrowth}%</div>
            <div className="text-sm text-gray-300">Average Growth</div>
            <div className="text-xs text-gray-400 mt-1">Across all skills</div>
          </div>
        </div>
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">{totalProjects}</div>
            <div className="text-sm text-gray-300">Total Projects</div>
            <div className="text-xs text-gray-400 mt-1">Using these skills</div>
          </div>
        </div>
      </div>

      {/* Footer with action button */}
      <div className="relative z-10 mt-8">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Monitor skill trends to optimize platform recommendations and user guidance
          </p>
          <Button 
            className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300  hover:shadow-lg hover:shadow-blue-500/25"
          >
            Export Trends Report
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

export default SkillTrends;
