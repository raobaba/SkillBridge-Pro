import React, { useState, useMemo } from 'react'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  Target,
  Star,
  Award,
  Activity,
  Eye,
  Download,
  Filter,
  RefreshCw,
  PieChart,
  LineChart,
  BarChart,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause
} from 'lucide-react'

const ProjectAnalytics = ({ projects }) => {
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('overview')
  const [chartType, setChartType] = useState('bar')

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    const totalProjects = projects.length
    const activeProjects = projects.filter(p => p.status === 'Active').length
    const completedProjects = projects.filter(p => p.status === 'Completed').length
    const totalApplicants = projects.reduce((sum, p) => sum + p.applicantsCount, 0)
    const avgRating = projects.reduce((sum, p) => sum + p.rating, 0) / totalProjects
    const avgApplicantsPerProject = totalApplicants / totalProjects
    
    // Performance metrics
    const highPerformingProjects = projects.filter(p => p.rating >= 4.5).length
    const completionRate = (completedProjects / totalProjects) * 100
    
    // Budget analysis
    const budgetRanges = {
      'Under $50k': projects.filter(p => p.budget.includes('$50,000')).length,
      '$50k - $100k': projects.filter(p => p.budget.includes('$70,000') || p.budget.includes('$100,000')).length,
      'Over $100k': projects.filter(p => p.budget.includes('$100,000') && !p.budget.includes('$70,000')).length
    }
    
    // Category distribution
    const categoryDistribution = projects.reduce((acc, project) => {
      const category = project.category || 'Other'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {})
    
    // Status distribution
    const statusDistribution = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1
      return acc
    }, {})
    
    // Monthly trends (mock data)
    const monthlyTrends = [
      { month: 'Jan', projects: 2, applicants: 15, completion: 1 },
      { month: 'Feb', projects: 3, applicants: 28, completion: 2 },
      { month: 'Mar', projects: 4, applicants: 42, completion: 3 },
      { month: 'Apr', projects: 5, applicants: 58, completion: 4 },
      { month: 'May', projects: 6, applicants: 72, completion: 5 },
      { month: 'Jun', projects: 7, applicants: 89, completion: 6 }
    ]

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalApplicants,
      avgRating: avgRating.toFixed(1),
      avgApplicantsPerProject: avgApplicantsPerProject.toFixed(1),
      highPerformingProjects,
      completionRate: completionRate.toFixed(1),
      budgetRanges,
      categoryDistribution,
      statusDistribution,
      monthlyTrends
    }
  }, [projects])

  const metrics = [
    {
      title: 'Total Projects',
      value: analyticsData.totalProjects,
      change: '+12%',
      changeType: 'positive',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Active Projects',
      value: analyticsData.activeProjects,
      change: '+8%',
      changeType: 'positive',
      icon: Play,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Total Applicants',
      value: analyticsData.totalApplicants,
      change: '+25%',
      changeType: 'positive',
      icon: Users,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Avg Rating',
      value: analyticsData.avgRating,
      change: '+0.3',
      changeType: 'positive',
      icon: Star,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Completion Rate',
      value: `${analyticsData.completionRate}%`,
      change: '+5%',
      changeType: 'positive',
      icon: Target,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'High Performers',
      value: analyticsData.highPerformingProjects,
      change: '+2',
      changeType: 'positive',
      icon: Award,
      color: 'from-pink-500 to-red-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Project Analytics
              </h2>
              <p className="text-gray-300 text-sm">
                Comprehensive insights into your project performance
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            
            <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-gradient-to-r ${metric.color} rounded-lg`}>
                <metric.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <p className="text-sm text-gray-400">{metric.title}</p>
                <div className="flex items-center gap-1 mt-1">
                  {metric.changeType === 'positive' ? (
                    <TrendingUp className="w-3 h-3 text-green-400" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-400" />
                  )}
                  <span className={`text-xs font-medium ${
                    metric.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Distribution */}
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-400" />
              Project Status Distribution
            </h3>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pie">Pie Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="doughnut">Doughnut Chart</option>
            </select>
          </div>
          
          <div className="space-y-3">
            {Object.entries(analyticsData.statusDistribution).map(([status, count]) => {
              const percentage = ((count / analyticsData.totalProjects) * 100).toFixed(1)
              const statusColors = {
                'Active': 'from-green-500 to-emerald-500',
                'Completed': 'from-blue-500 to-cyan-500',
                'Upcoming': 'from-yellow-500 to-orange-500',
                'Paused': 'from-orange-500 to-red-500',
                'Draft': 'from-gray-500 to-gray-600'
              }
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${statusColors[status] || 'from-gray-500 to-gray-600'}`}></div>
                    <span className="text-white text-sm">{status}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${statusColors[status] || 'from-gray-500 to-gray-600'} transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-white text-sm font-medium w-12 text-right">{count}</span>
                    <span className="text-gray-400 text-xs w-10 text-right">{percentage}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Budget Distribution */}
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            Budget Distribution
          </h3>
          
          <div className="space-y-3">
            {Object.entries(analyticsData.budgetRanges).map(([range, count]) => {
              const percentage = ((count / analyticsData.totalProjects) * 100).toFixed(1)
              const colors = [
                'from-green-500 to-emerald-500',
                'from-blue-500 to-cyan-500',
                'from-purple-500 to-pink-500'
              ]
              const colorIndex = Object.keys(analyticsData.budgetRanges).indexOf(range)
              
              return (
                <div key={range} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors[colorIndex]}`}></div>
                    <span className="text-white text-sm">{range}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${colors[colorIndex]} transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-white text-sm font-medium w-12 text-right">{count}</span>
                    <span className="text-gray-400 text-xs w-10 text-right">{percentage}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <LineChart className="w-5 h-5 text-purple-400" />
          Monthly Trends
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-white/5">
              <tr className="text-left text-gray-400 uppercase text-xs tracking-wider">
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3">Projects</th>
                <th className="px-4 py-3">Applicants</th>
                <th className="px-4 py-3">Completions</th>
                <th className="px-4 py-3">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {analyticsData.monthlyTrends.map((trend, index) => {
                const prevMonth = index > 0 ? analyticsData.monthlyTrends[index - 1] : null
                const projectGrowth = prevMonth ? 
                  ((trend.projects - prevMonth.projects) / prevMonth.projects * 100).toFixed(1) : 0
                
                return (
                  <tr key={trend.month} className="hover:bg-white/5 transition-colors duration-200">
                    <td className="px-4 py-3 text-white font-medium">{trend.month}</td>
                    <td className="px-4 py-3 text-white">{trend.projects}</td>
                    <td className="px-4 py-3 text-white">{trend.applicants}</td>
                    <td className="px-4 py-3 text-white">{trend.completion}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {projectGrowth > 0 ? (
                          <TrendingUp className="w-3 h-3 text-green-400" />
                        ) : projectGrowth < 0 ? (
                          <TrendingDown className="w-3 h-3 text-red-400" />
                        ) : null}
                        <span className={`text-xs font-medium ${
                          projectGrowth > 0 ? 'text-green-400' : 
                          projectGrowth < 0 ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {projectGrowth > 0 ? `+${projectGrowth}%` : 
                           projectGrowth < 0 ? `${projectGrowth}%` : '0%'}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            Performance Insights
          </h3>
          
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Completion Rate</span>
                <span className="text-green-400 font-bold">{analyticsData.completionRate}%</span>
              </div>
              <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${analyticsData.completionRate}%` }}
                />
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">Avg Applicants per Project</span>
                <span className="text-blue-400 font-bold">{analyticsData.avgApplicantsPerProject}</span>
              </div>
              <p className="text-gray-400 text-sm">Higher than industry average of 8.5</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">High Performing Projects</span>
                <span className="text-yellow-400 font-bold">{analyticsData.highPerformingProjects}</span>
              </div>
              <p className="text-gray-400 text-sm">Projects with 4.5+ star rating</p>
            </div>
          </div>
        </div>

        <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Recommendations
          </h3>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-white font-medium">Boost Visibility</span>
              </div>
              <p className="text-gray-300 text-sm">
                Consider featuring your top-rated projects to attract more qualified applicants.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-white font-medium">Expand Reach</span>
              </div>
              <p className="text-gray-300 text-sm">
                Your projects are attracting good applicants. Consider posting more projects in trending categories.
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-medium">Maintain Quality</span>
              </div>
              <p className="text-gray-300 text-sm">
                Keep up the excellent work! Your average rating is above industry standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectAnalytics
