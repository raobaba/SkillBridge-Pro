// CareerRecommender.jsx
import React from "react";
import { useSelector } from "react-redux";

const CareerRecommender = () => {
  const { careerRecommendations } = useSelector((state) => state.aiCareer || {});

  // Use Redux state - dynamic data from API
  const recommendations = careerRecommendations || [];

  const getMatchColor = (match) => {
    const percentage = parseInt(match);
    if (percentage >= 90) return "from-blue-500 via-purple-500 to-pink-500";
    if (percentage >= 80) return "from-blue-500 to-indigo-500";
    if (percentage >= 70) return "from-indigo-500 to-purple-500";
    return "from-gray-500 to-gray-600";
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
            Career Recommendations
          </h2>
        </div>
        <p className="text-gray-300 text-sm">Based on your skills and preferences</p>
      </div>

      {/* Recommendations Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {recommendations.length > 0 ? (
          recommendations.map((rec, index) => (
          <div
            key={rec.id}
            className="group relative bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 cursor-pointer overflow-hidden"
            style={{
              animationDelay: `${index * 150}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            {/* Card background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            
            {/* Card content */}
            <div className="relative z-10">
              {/* Icon and title */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center text-2xl">
                    {rec.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-200 transition-colors duration-300">
                      {rec.title}
                    </h3>
                    <p className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                      {rec.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Match percentage */}
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="flex items-center justify-between text-xs text-gray-300 mb-1">
                    <span>Match Score</span>
                    <span className="font-medium">{rec.match}</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${getMatchColor(rec.match)} rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg`}
                      style={{ 
                        width: rec.match,
                        animationDelay: `${index * 200 + 500}ms`
                      }}
                    ></div>
                  </div>

                </div>
                <div className={`px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r ${getMatchColor(rec.match)} text-white shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  {rec.match}
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
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400">No career recommendations available yet. Check back soon!</p>
          </div>
        )}
      </div>

      {/* Footer note */}
      <div className="relative z-10 mt-8 text-center">
        <p className="text-xs text-gray-400">
          Recommendations are updated based on your latest skills and market trends
        </p>
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

export default CareerRecommender;

