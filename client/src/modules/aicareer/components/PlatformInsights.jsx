// PlatformInsights.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Button } from "../../../components";

const PlatformInsights = () => {
  const { platformInsights } = useSelector((state) => state.aiCareer || {});

  // Use Redux state or fallback to static data
  const insights = platformInsights && platformInsights.length > 0
    ? platformInsights
    : [
    {
      id: 1,
      title: "User Engagement Patterns",
      description: "Peak activity occurs between 9-11 AM and 2-4 PM, with 40% of users active during these hours",
      impact: "High",
      recommendation: "Schedule important announcements during peak hours",
      icon: "⏰",
      category: "User Behavior",
      metrics: {
        peakHours: "9-11 AM, 2-4 PM",
        activeUsers: "40%",
        engagement: "High"
      }
    },
    {
      id: 2,
      title: "Project Completion Rates",
      description: "Projects with detailed descriptions have 35% higher completion rates than vague ones",
      impact: "Medium",
      recommendation: "Encourage detailed project descriptions through UI prompts",
      icon: "📋",
      category: "Project Quality",
      metrics: {
        completionRate: "87%",
        improvement: "+35%",
        quality: "High"
      }
    },
    {
      id: 3,
      title: "Developer Skill Gaps",
      description: "Most common skill gaps are in DevOps (45%), Cloud platforms (38%), and AI/ML (42%)",
      impact: "High",
      recommendation: "Create targeted learning resources for these skill areas",
      icon: "🎓",
      category: "Skill Development",
      metrics: {
        devops: "45%",
        cloud: "38%",
        ai: "42%"
      }
    },
    {
      id: 4,
      title: "Geographic Distribution",
      description: "60% of projects are remote, with highest concentration in North America (45%) and Europe (30%)",
      impact: "Medium",
      recommendation: "Optimize matching algorithms for timezone differences in remote projects",
      icon: "🌍",
      category: "Geographic",
      metrics: {
        remote: "60%",
        northAmerica: "45%",
        europe: "30%"
      }
    },
    {
      id: 5,
      title: "Payment Preferences",
      description: "Hourly rates preferred by 65% of developers, while fixed-price projects have 20% higher satisfaction",
      impact: "Medium",
      recommendation: "Provide flexible payment options and educate on pricing strategies",
      icon: "💳",
      category: "Payment",
      metrics: {
        hourly: "65%",
        satisfaction: "+20%",
        preference: "Mixed"
      }
    },
    {
      id: 6,
      title: "Platform Performance",
      description: "Average page load time is 1.2s, with 99.9% uptime. Mobile usage increased by 25% this quarter",
      impact: "High",
      recommendation: "Continue mobile optimization and monitor performance metrics",
      icon: "⚡",
      category: "Performance",
      metrics: {
        loadTime: "1.2s",
        uptime: "99.9%",
        mobile: "+25%"
      }
    }
  ];

  const getImpactColor = (impact) => {
    switch (impact) {
      case "High": return "from-red-500 via-orange-500 to-yellow-500";
      case "Medium": return "from-blue-500 to-indigo-500";
      case "Low": return "from-indigo-500 to-purple-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "User Behavior": return "from-blue-500 via-purple-500 to-pink-500";
      case "Project Quality": return "from-blue-500 to-indigo-500";
      case "Skill Development": return "from-indigo-500 to-purple-500";
      case "Geographic": return "from-purple-500 to-pink-500";
      case "Payment": return "from-green-500 to-emerald-500";
      case "Performance": return "from-yellow-500 to-orange-500";
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
            <span className="text-white text-lg">🔍</span>
          </div>
          <h2 className="text-3xl font-bold text-white">
            Platform Insights
          </h2>
        </div>
        <p className="text-gray-300 text-sm">Deep analytics and recommendations for platform optimization</p>
      </div>

      {/* Insights Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((insight, idx) => (
          <div
            key={insight.id}
            className="group relative bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer overflow-hidden"
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
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  {insight.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-medium text-white group-hover:text-blue-200 transition-colors duration-300">
                      {insight.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getCategoryColor(insight.category)} text-white`}>
                        {insight.category}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getImpactColor(insight.impact)} text-white`}>
                        {insight.impact}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">
                    {insight.description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {Object.entries(insight.metrics).map(([key, value], idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-sm font-bold text-blue-400">{value}</div>
                        <div className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recommendation */}
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <h4 className="text-sm font-medium text-gray-300 mb-1">Recommendation:</h4>
                    <p className="text-xs text-gray-400">{insight.recommendation}</p>
                  </div>
                </div>

                {/* Action indicator */}
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300">
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

      {/* Summary Actions */}
      <div className="relative z-10 mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-2">6</div>
          <div className="text-sm text-gray-300">Key Insights</div>
          <div className="text-xs text-gray-400 mt-1">Identified this month</div>
        </div>
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
          <div className="text-2xl font-bold text-green-400 mb-2">12</div>
          <div className="text-sm text-gray-300">Recommendations</div>
          <div className="text-xs text-gray-400 mt-1">Ready to implement</div>
        </div>
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
          <div className="text-2xl font-bold text-purple-400 mb-2">85%</div>
          <div className="text-sm text-gray-300">Accuracy Rate</div>
          <div className="text-xs text-gray-400 mt-1">AI predictions</div>
        </div>
      </div>

      {/* Footer with action button */}
      <div className="relative z-10 mt-8">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Use these insights to make data-driven decisions and improve platform performance
          </p>
          <Button 
            className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
          >
            Generate Action Plan
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

export default PlatformInsights;