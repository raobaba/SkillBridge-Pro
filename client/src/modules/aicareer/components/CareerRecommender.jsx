// CareerRecommender.jsx
import React from "react";

const CareerRecommender = () => {
  const recommendations = [
    { id: 1, title: "Frontend Developer", match: "92%", description: "Build user interfaces and experiences", icon: "💻" },
    { id: 2, title: "Backend Engineer", match: "87%", description: "Design and develop server-side systems", icon: "⚙️" },
    { id: 3, title: "Data Scientist", match: "80%", description: "Extract insights from complex data", icon: "📊" },
  ];

  const getMatchColor = (match) => {
    const percentage = parseInt(match);
    if (percentage >= 90) return "from-emerald-500 to-green-500";
    if (percentage >= 80) return "from-blue-500 to-indigo-500";
    if (percentage >= 70) return "from-yellow-500 to-orange-500";
    return "from-gray-500 to-gray-600";
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 rounded-2xl"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-2xl"></div>
      
      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-lg">🎯</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Career Recommendations
          </h2>
        </div>
        <p className="text-gray-400 text-sm">Based on your skills and preferences</p>
      </div>

      {/* Recommendations Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {recommendations.map((rec, index) => (
          <div
            key={rec.id}
            className="group relative bg-gradient-to-br from-slate-800/60 via-slate-700/40 to-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/20 cursor-pointer overflow-hidden"
            style={{
              animationDelay: `${index * 150}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            {/* Card background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            
            {/* Card content */}
            <div className="relative z-10">
              {/* Icon and title */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                    {rec.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-indigo-200 transition-colors duration-300">
                      {rec.title}
                    </h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                      {rec.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Match percentage */}
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>Match Score</span>
                    <span className="font-medium">{rec.match}</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${getMatchColor(rec.match)} rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg`}
                      style={{ 
                        width: rec.match,
                        animationDelay: `${index * 200 + 500}ms`
                      }}
                    ></div>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r ${getMatchColor(rec.match)} text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
                  {rec.match}
                </div>
              </div>

              {/* Hover effect indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="relative z-10 mt-8 text-center">
        <p className="text-xs text-gray-500">
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
