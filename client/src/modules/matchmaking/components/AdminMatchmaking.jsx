import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, TrendingUp, Users, Target, AlertTriangle, CheckCircle, 
  XCircle, Eye, Filter, Search, Calendar, Award, Zap, Shield,
  RefreshCw, Download, Settings, Activity, PieChart, LineChart
} from "lucide-react";

const AdminMatchmaking = ({ user }) => {
  const [selectedTab, setSelectedTab] = useState("analytics");
  const [timeRange, setTimeRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(false);

  const [systemStats] = useState({
    totalMatches: 1247,
    successfulMatches: 892,
    matchSuccessRate: 71.5,
    averageMatchScore: 84.2,
    totalUsers: 3456,
    activeProjects: 234,
    completedProjects: 1890,
    flaggedMatches: 23,
    algorithmAccuracy: 94.8
  });

  const [matchAnalytics] = useState({
    dailyMatches: [
      { date: "2024-01-15", matches: 45, success: 32 },
      { date: "2024-01-16", matches: 52, success: 38 },
      { date: "2024-01-17", matches: 38, success: 28 },
      { date: "2024-01-18", matches: 61, success: 44 },
      { date: "2024-01-19", matches: 47, success: 35 },
      { date: "2024-01-20", matches: 55, success: 41 },
      { date: "2024-01-21", matches: 43, success: 31 }
    ],
    skillDemand: [
      { skill: "React", demand: 85, supply: 78, gap: 7 },
      { skill: "Python", demand: 72, supply: 65, gap: 7 },
      { skill: "Node.js", demand: 68, supply: 71, gap: -3 },
      { skill: "AWS", demand: 61, supply: 58, gap: 3 },
      { skill: "Machine Learning", demand: 54, supply: 42, gap: 12 }
    ],
    matchQuality: [
      { score: "90-100%", count: 234, percentage: 18.8 },
      { score: "80-89%", count: 456, percentage: 36.6 },
      { score: "70-79%", count: 389, percentage: 31.2 },
      { score: "60-69%", count: 123, percentage: 9.9 },
      { score: "50-59%", count: 45, percentage: 3.6 }
    ]
  });

  const [flaggedCases] = useState([
    {
      id: 1,
      type: "Unfair Recommendation",
      description: "Developer with 95% match score not recommended for React project",
      reporter: "Alice Johnson",
      reportedDate: "2024-01-20",
      status: "Under Review",
      priority: "High",
      evidence: ["Algorithm bias detected", "Historical data inconsistency"]
    },
    {
      id: 2,
      type: "Algorithm Dispute",
      description: "Project owner claims match scores are inaccurate",
      reporter: "TechCorp Inc.",
      reportedDate: "2024-01-19",
      status: "Investigating",
      priority: "Medium",
      evidence: ["Manual review required", "Pattern analysis needed"]
    },
    {
      id: 3,
      type: "System Error",
      description: "Match algorithm returning null values for certain skill combinations",
      reporter: "System Alert",
      reportedDate: "2024-01-18",
      status: "Resolved",
      priority: "Critical",
      evidence: ["Bug fix deployed", "Monitoring active"]
    }
  ]);

  const tabs = [
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "flagged", label: "Flagged Cases", icon: AlertTriangle },
    { id: "algorithm", label: "Algorithm", icon: Target },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const handleResolveCase = (caseId, action) => {
    console.log(`Resolved case ${caseId} with action: ${action}`);
  };

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center"
        >
          <div className="text-3xl font-bold text-white mb-2">{systemStats.matchSuccessRate}%</div>
          <div className="text-gray-300">Match Success Rate</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center"
        >
          <div className="text-3xl font-bold text-white mb-2">{systemStats.averageMatchScore}%</div>
          <div className="text-gray-300">Avg Match Score</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center"
        >
          <div className="text-3xl font-bold text-white mb-2">{systemStats.algorithmAccuracy}%</div>
          <div className="text-gray-300">Algorithm Accuracy</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center"
        >
          <div className="text-3xl font-bold text-white mb-2">{systemStats.flaggedMatches}</div>
          <div className="text-gray-300">Flagged Cases</div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Matches Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-bold text-white mb-4">Daily Matches (Last 7 Days)</h3>
          <div className="space-y-3">
            {matchAnalytics.dailyMatches.map((day, index) => (
              <div key={day.date} className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">{day.date}</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(day.matches / 70) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm">{day.matches}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(day.success / 50) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm">{day.success}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Skill Demand vs Supply */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-bold text-white mb-4">Skill Demand vs Supply</h3>
          <div className="space-y-4">
            {matchAnalytics.skillDemand.map((skill, index) => (
              <div key={skill.skill}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{skill.skill}</span>
                  <span className={`text-sm font-medium ${
                    skill.gap > 0 ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {skill.gap > 0 ? `+${skill.gap}%` : `${skill.gap}%`}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-gray-400 mb-1">Demand</div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${skill.demand}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Supply</div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${skill.supply}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Match Quality Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">Match Quality Distribution</h3>
        <div className="space-y-3">
          {matchAnalytics.matchQuality.map((quality, index) => (
            <div key={quality.score} className="flex items-center justify-between">
              <span className="text-gray-300 w-20">{quality.score}</span>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                    style={{ width: `${quality.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-white font-medium">{quality.count}</span>
                <span className="text-gray-400 text-sm ml-2">({quality.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderFlaggedTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {flaggedCases.map((case_, index) => (
          <motion.div
            key={case_.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-bold text-white">{case_.type}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    case_.priority === 'High' ? 'bg-red-500/20 text-red-300' :
                    case_.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {case_.priority}
                  </span>
                </div>
                <p className="text-gray-300 mb-3">{case_.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>Reporter: {case_.reporter}</span>
                  <span>Date: {case_.reportedDate}</span>
                </div>
                <div className="mt-3">
                  <div className="text-sm text-gray-300 mb-2">Evidence:</div>
                  <div className="flex flex-wrap gap-2">
                    {case_.evidence.map((evidence, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                        {evidence}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="text-right ml-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium mb-3 ${
                  case_.status === 'Under Review' ? 'bg-yellow-500/20 text-yellow-300' :
                  case_.status === 'Investigating' ? 'bg-blue-500/20 text-blue-300' :
                  'bg-green-500/20 text-green-300'
                }`}>
                  {case_.status}
                </div>
                
                {case_.status !== 'Resolved' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleResolveCase(case_.id, 'resolve')}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      Resolve
                    </button>
                    <button
                      onClick={() => handleResolveCase(case_.id, 'investigate')}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4 inline mr-1" />
                      Investigate
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAlgorithmTab = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">Algorithm Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">94.8%</div>
            <div className="text-gray-300">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">2.3s</div>
            <div className="text-gray-300">Avg Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">99.2%</div>
            <div className="text-gray-300">Uptime</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">Algorithm Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white">Skill Weight</h4>
              <p className="text-sm text-gray-300">How much skill matching affects the score</p>
            </div>
            <div className="flex items-center space-x-2">
              <input type="range" min="0" max="100" defaultValue="70" className="w-32" />
              <span className="text-white font-medium">70%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white">Experience Weight</h4>
              <p className="text-sm text-gray-300">How much experience affects the score</p>
            </div>
            <div className="flex items-center space-x-2">
              <input type="range" min="0" max="100" defaultValue="60" className="w-32" />
              <span className="text-white font-medium">60%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white">Location Weight</h4>
              <p className="text-sm text-gray-300">How much location affects the score</p>
            </div>
            <div className="flex items-center space-x-2">
              <input type="range" min="0" max="100" defaultValue="40" className="w-32" />
              <span className="text-white font-medium">40%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">System Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white">Auto-flag suspicious matches</h4>
              <p className="text-sm text-gray-300">Automatically flag matches that seem unusual</p>
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Enable
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white">Algorithm retraining frequency</h4>
              <p className="text-sm text-gray-300">How often to retrain the matching algorithm</p>
            </div>
            <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-white">Match score threshold</h4>
              <p className="text-sm text-gray-300">Minimum score required to show a match</p>
            </div>
            <div className="flex items-center space-x-2">
              <input type="number" defaultValue="60" className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white" />
              <span className="text-gray-300">%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case "analytics": return renderAnalyticsTab();
      case "flagged": return renderFlaggedTab();
      case "algorithm": return renderAlgorithmTab();
      case "settings": return renderSettingsTab();
      default: return renderAnalyticsTab();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Matchmaking Analytics</h1>
          <p className="text-gray-300">Monitor system performance, algorithm fairness, and match success rates</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex space-x-1 mb-6 bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                selectedTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminMatchmaking;
