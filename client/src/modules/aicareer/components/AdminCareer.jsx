// AdminCareer.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, CircularLoader } from "../../../components";
import { getAdminCareerDashboard } from "../slice/aiCareerSlice";

const AdminCareer = () => {
  const dispatch = useDispatch();
  
  // Get data from Redux - all from single API endpoint
  const adminCareerDashboard = useSelector((state) => state.aiCareer?.adminCareerDashboard);
  const adminCareerDashboardLoading = useSelector((state) => state.aiCareer?.adminCareerDashboardLoading || false);

  // Fetch data on component mount
  useEffect(() => {
    if (!adminCareerDashboard && !adminCareerDashboardLoading) {
      dispatch(getAdminCareerDashboard('6m'));
    }
  }, [dispatch, adminCareerDashboard, adminCareerDashboardLoading]);

  // Get metrics and insights directly from API response
  const metrics = adminCareerDashboard?.metrics || [];
  const insights = adminCareerDashboard?.insights || [];

  const getTrendColor = (trend) => {
    return trend === "up" ? "text-green-400" : "text-red-400";
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case "High": return "from-red-500 via-orange-500 to-yellow-500";
      case "Medium": return "from-blue-500 to-indigo-500";
      case "Low": return "from-indigo-500 to-purple-500";
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
            <span className="text-white text-lg">📊</span>
          </div>
          <h2 className="text-3xl font-bold text-white">
            Analytics Dashboard
          </h2>
        </div>
        <p className="text-gray-300 text-sm">System-wide insights and platform performance metrics</p>
      </div>

      {/* Metrics Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {adminCareerDashboardLoading ? (
          <div className="col-span-4 flex justify-center py-12">
            <CircularLoader />
          </div>
        ) : metrics.length === 0 ? (
          <div className="col-span-4 text-center py-12">
            <p className="text-gray-400">No metrics available at this time</p>
          </div>
        ) : (
          metrics.map((metric, idx) => (
          <div
            key={metric.id}
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
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center text-2xl">
                  {metric.icon}
                </div>
                <span className={`text-sm font-semibold ${getTrendColor(metric.trend)}`}>
                  {metric.change}
                </span>
              </div>

              <div className="text-3xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors duration-300">
                {metric.value}
              </div>
              <div className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                {metric.title}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {metric.description}
              </div>

              {/* Hover effect indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          ))
        )}
      </div>

      {/* Insights Section */}
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-white mb-6">Key Insights & Recommendations</h3>
        {adminCareerDashboardLoading ? (
          <div className="flex justify-center py-12">
            <CircularLoader />
          </div>
        ) : insights.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No insights available at this time</p>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, idx) => (
            <div
              key={insight.id}
              className="group relative bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300  hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer overflow-hidden"
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
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center text-2xl  transition-transform duration-300 flex-shrink-0">
                    {insight.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-medium text-white group-hover:text-blue-200 transition-colors duration-300">
                        {insight.title}
                      </span>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getImpactColor(insight.impact)} text-white shadow-md`}>
                        {insight.impact} Impact
                      </div>
                    </div>

                    <p className="text-sm text-gray-300 mb-3 group-hover:text-gray-200 transition-colors duration-300">
                      {insight.description}
                    </p>

                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Recommendation:</h4>
                      <p className="text-xs text-gray-400">{insight.recommendation}</p>
                    </div>
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
            ))}
          </div>
        )}
      </div>

      {/* Footer with action button */}
      <div className="relative z-10 mt-8">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Use these insights to optimize platform performance and user experience
          </p>
          <Button 
            className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300  hover:shadow-lg hover:shadow-blue-500/25"
          >
            View Detailed Reports
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

export default AdminCareer;
