import React, { useState, useMemo } from "react";
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import {
  Search,
  CheckSquare,
  Calendar,
  Timer,
  GitBranch,
  Send,
  XCircle,
  Upload,
  Clock,
  CheckCircle2 as CheckCircleIcon,
  Play,
  MessageSquare,
  TrendingUp,
  BarChart3,
  Activity,
  Star,
  Target,
  Zap,
  FileText,
  Link as LinkIcon,
  Pause,
  RefreshCw,
  Download,
  Share2,
  Filter,
  SortAsc,
  SortDesc,
  Award,
} from "lucide-react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function MyTasksTab({
  assignedTasks = [],
  appliedProjects = [],
  onTaskStart,
  onTaskSubmit,
  onStartTimer,
  onStopTimer,
  onStopActiveTimer,
  onAddComment,
  userRole = "developer",
  activeTimer: propActiveTimer = null,
  performanceStats: propPerformanceStats = null,
  taskComments: propTaskComments = {},
  tasksLoading = false,
}) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskFilter, setTaskFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showPerformance, setShowPerformance] = useState(false);
  const [showComments, setShowComments] = useState({});
  const user = useSelector((state) => state.user.user);
  const isDeveloper = userRole === "developer" || user?.role === "developer";
  const navigate = useNavigate();
  
  // Use props for activeTimer and taskComments, with local fallback
  const activeTimer = propActiveTimer;
  const taskComments = propTaskComments;
  
  // Time tracking handlers
  const handleStartTimer = async (taskId, description = "") => {
    if (onStartTimer) {
      await onStartTimer(taskId, description);
    } else {
      toast.error("Timer functionality not available");
    }
  };
  
  const handleStopTimer = async (trackingId) => {
    if (onStopTimer) {
      await onStopTimer(trackingId);
    } else {
      toast.error("Timer functionality not available");
    }
  };
  
  const handleStopActiveTimer = async () => {
    if (onStopActiveTimer) {
      await onStopActiveTimer();
    } else {
      toast.error("Timer functionality not available");
    }
  };
  
  const formatTime = (milliseconds) => {
    if (!milliseconds) return "0h 0m";
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };
  
  const getCurrentTrackedTime = (taskId) => {
    // Get time from task data (from API)
    const task = assignedTasks.find(t => t.id === taskId);
    if (task && task.timeTracked) {
      // If there's an active timer for this task, add elapsed time
      if (activeTimer && activeTimer.taskId === taskId) {
        const elapsed = Date.now() - new Date(activeTimer.startTime).getTime();
        return task.timeTracked + elapsed;
      }
      return task.timeTracked;
    }
    // Fallback: if active timer is running for this task
    if (activeTimer && activeTimer.taskId === taskId) {
      const elapsed = Date.now() - new Date(activeTimer.startTime).getTime();
      return elapsed;
    }
    return 0;
  };
  
  // Use provided performanceStats or calculate from tasks
  const performanceStats = useMemo(() => {
    if (propPerformanceStats) {
      return propPerformanceStats;
    }
    // Fallback calculation
    if (!isDeveloper) return null;
    
    const totalTasks = assignedTasks.length;
    const completedTasks = assignedTasks.filter(t => t.status === "completed").length;
    const inProgressTasks = assignedTasks.filter(t => t.status === "in-progress").length;
    const onTimeCompletion = assignedTasks.filter(t => {
      if (t.status !== "completed" || !t.dueDate) return false;
      const completedDate = t.completedAt ? new Date(t.completedAt) : new Date();
      const dueDate = new Date(t.dueDate);
      return completedDate <= dueDate;
    }).length;
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const onTimeRate = completedTasks > 0 ? Math.round((onTimeCompletion / completedTasks) * 100) : 0;
    
    // Calculate total time tracked from tasks
    const totalTimeTracked = assignedTasks.reduce((sum, task) => sum + (task.timeTracked || 0), 0);
    
    // Calculate average task time
    const avgTaskTime = completedTasks > 0 ? totalTimeTracked / completedTasks : 0;
    
    // Calculate productivity score
    const productivityScore = Math.min(100, Math.round(
      (completionRate * 0.4) + (onTimeRate * 0.4) + (Math.min(totalTasks / 10, 1) * 20)
    ));
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      completionRate,
      onTimeRate,
      totalTimeTracked,
      avgTaskTime,
      productivityScore,
      activeTimer: activeTimer ? activeTimer.taskId : null,
    };
  }, [propPerformanceStats, assignedTasks, activeTimer, isDeveloper]);

  const filteredTasks = useMemo(() => {
    let filtered = assignedTasks || [];
    
    if (taskFilter !== "all") {
      filtered = filtered.filter(task => {
        // Normalize status for filtering
        const normalizedStatus = task.status === "todo" ? "assigned" : task.status;
        return normalizedStatus === taskFilter;
      });
    }
    
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedProject) {
      filtered = filtered.filter(task => task.projectId === selectedProject);
    }
    
    // Sort tasks
    filtered = [...filtered].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "dueDate":
          aValue = new Date(a.dueDate || 0).getTime();
          bValue = new Date(b.dueDate || 0).getTime();
          break;
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        case "status":
          const statusOrder = { "assigned": 4, "in-progress": 3, "under-review": 2, "completed": 1 };
          aValue = statusOrder[a.status] || 0;
          bValue = statusOrder[b.status] || 0;
          break;
        case "timeTracked":
          aValue = getCurrentTrackedTime(a.id);
          bValue = getCurrentTrackedTime(b.id);
          break;
        default:
          return 0;
      }
      
      if (sortOrder === "asc") {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
    
    return filtered;
  }, [assignedTasks, taskFilter, searchQuery, selectedProject, sortBy, sortOrder, activeTimer]);

  const getTaskStatusColor = (status) => {
    switch (status) {
      case "assigned":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "in-progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "under-review":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400";
      case "low":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const handleStartTask = (task) => {
    if (onTaskStart) {
      onTaskStart(task);
    }
  };

  const [submissionType, setSubmissionType] = useState("pull-request");
  const [submissionLink, setSubmissionLink] = useState("");
  const [submissionFiles, setSubmissionFiles] = useState([]);
  const [submissionNotes, setSubmissionNotes] = useState("");

  const handleSubmitWork = async () => {
    if (!onTaskSubmit || !selectedTask) {
      setShowSubmitModal(false);
      setSelectedTask(null);
      return;
    }

    const submissionData = {
      type: submissionType,
      link: submissionLink || null,
      files: submissionFiles,
      notes: submissionNotes,
    };

    try {
      await onTaskSubmit(selectedTask, submissionData);
      // Reset form
      setSubmissionType("pull-request");
      setSubmissionLink("");
      setSubmissionFiles([]);
      setSubmissionNotes("");
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const toggleComments = async (taskId) => {
    setShowComments(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
    
    // Fetch comments if not already loaded
    if (!taskComments[taskId] && !showComments[taskId]) {
      // Comments will be loaded via useEffect or parent component
      // For now, we'll rely on the parent to fetch them
    }
  };
  
  const addComment = async (taskId, comment) => {
    if (onAddComment) {
      await onAddComment(taskId, comment);
    } else {
      // Fallback: local state update
      setTaskComments(prev => ({
        ...prev,
        [taskId]: [...(prev[taskId] || []), {
          id: Date.now(),
          comment: comment,
          user: { name: user?.name || "You" },
          createdAt: new Date().toISOString(),
        }]
      }));
    }
  };

  return (
    <div className='space-y-6'>
      {/* Enhanced Header Section */}
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4'>
        <div className='flex-1'>
          <h1 className='text-3xl font-bold mb-2'>My Tasks</h1>
          <p className='text-gray-300'>
            {isDeveloper 
              ? "View assigned tasks, track time, submit work, and monitor your performance"
              : "View assigned tasks, submit your work, and track progress"}
          </p>
        </div>
        <div className='flex items-center gap-3'>
          {isDeveloper && (
            <>
              <Button
                onClick={() => setShowPerformance(!showPerformance)}
                className='bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2'
              >
                <BarChart3 className='w-5 h-5' />
                Performance
              </Button>
              {activeTimer && (
                <Button
                  onClick={handleStopActiveTimer}
                  className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2'
                >
                  <Pause className='w-5 h-5' />
                  Stop Timer
                </Button>
              )}
              <Button
                onClick={() => navigate('/chat')}
                className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2'
              >
                <MessageSquare className='w-5 h-5' />
                Team Chat
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Performance Dashboard for Developers */}
      {isDeveloper && showPerformance && performanceStats && (
        <div className='bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6 mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-semibold flex items-center gap-2'>
              <TrendingUp className='w-6 h-6 text-blue-400' />
              Performance Metrics
            </h2>
            <button
              onClick={() => setShowPerformance(false)}
              className='text-gray-400 hover:text-white'
            >
              <XCircle className='w-5 h-5' />
            </button>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
            <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
              <p className='text-gray-400 text-sm mb-1'>Productivity Score</p>
              <p className='text-3xl font-bold text-purple-400'>{performanceStats.productivityScore}</p>
              <p className='text-xs text-gray-500 mt-1'>out of 100</p>
            </div>
            <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
              <p className='text-gray-400 text-sm mb-1'>Completion Rate</p>
              <p className='text-3xl font-bold text-green-400'>{performanceStats.completionRate}%</p>
              <p className='text-xs text-gray-500 mt-1'>{performanceStats.completedTasks} of {performanceStats.totalTasks}</p>
            </div>
            <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
              <p className='text-gray-400 text-sm mb-1'>On-Time Rate</p>
              <p className='text-3xl font-bold text-yellow-400'>{performanceStats.onTimeRate}%</p>
              <p className='text-xs text-gray-500 mt-1'>Tasks completed on time</p>
            </div>
            <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
              <p className='text-gray-400 text-sm mb-1'>Time Tracked</p>
              <p className='text-3xl font-bold text-blue-400'>{formatTime(performanceStats.totalTimeTracked)}</p>
              <p className='text-xs text-gray-500 mt-1'>Total logged time</p>
            </div>
          </div>
          {activeTimer && (
            <div className='p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg flex items-center gap-2'>
              <Clock className='w-5 h-5 text-yellow-400 animate-pulse' />
              <span className='text-yellow-400'>Timer running: {formatTime(getCurrentTrackedTime(activeTimer.taskId))}</span>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Filters and Search */}
      <div className='bg-white/5 border border-white/10 rounded-xl p-4'>
        <div className='flex flex-col gap-4'>
          {/* Top Row: Search */}
          <div className='flex-1'>
            <label className='text-sm text-gray-400 mb-2 block'>Search Tasks</label>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
              <input
                type="text"
                placeholder="Search tasks, projects, descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500'
              />
            </div>
          </div>

          {/* Bottom Row: Filters and Sort */}
          <div className='flex flex-col md:flex-row gap-4'>
            {/* Project Filter */}
            <div className='flex-1'>
              <Input
                label="Filter by Project"
                type="select"
                value={selectedProject || ""}
                onChange={(e) => setSelectedProject(e.target.value ? Number(e.target.value) : null)}
                options={[
                  { label: "All Projects", value: "" },
                  ...appliedProjects
                    .filter(project => project && project.id != null)
                    .map(project => ({ label: project.title || "Untitled Project", value: String(project.id) }))
                ]}
              />
            </div>

            {/* Status Filter */}
            <div className='flex-1'>
              <Input
                label="Filter by Status"
                type="select"
                value={taskFilter}
                onChange={(e) => setTaskFilter(e.target.value)}
                options={[
                  { label: "All Status", value: "all" },
                  { label: "Assigned", value: "assigned" },
                  { label: "In Progress", value: "in-progress" },
                  { label: "Under Review", value: "under-review" },
                  { label: "Completed", value: "completed" },
                ]}
              />
            </div>

            {/* Sort By */}
            <div className='flex-1'>
              <label className='text-sm font-medium text-gray-200 mb-1 block'>Sort By</label>
              <div className='flex gap-2'>
                <div className='flex-1'>
                  <Input
                    type="select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    options={[
                      { label: "Due Date", value: "dueDate" },
                      { label: "Priority", value: "priority" },
                      { label: "Status", value: "status" },
                      ...(isDeveloper ? [{ label: "Time Tracked", value: "timeTracked" }] : []),
                    ]}
                  />
                </div>
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className='bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center justify-center h-[42px] self-end'
                  title={sortOrder === "asc" ? "Sort Ascending" : "Sort Descending"}
                >
                  {sortOrder === "asc" ? <SortAsc className='w-5 h-5' /> : <SortDesc className='w-5 h-5' />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {tasksLoading ? (
          <div className='col-span-2 bg-white/5 border border-white/10 rounded-xl p-12 text-center'>
            <div className='w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
            <h3 className='text-xl font-semibold mb-2'>Loading tasks...</h3>
            <p className='text-gray-400'>Fetching your assigned tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className='col-span-2 bg-white/5 border border-white/10 rounded-xl p-12 text-center'>
            <CheckSquare className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <h3 className='text-xl font-semibold mb-2'>No tasks found</h3>
            <p className='text-gray-400 mb-6'>
              {assignedTasks.length === 0 
                ? "You don't have any tasks assigned yet. Tasks will appear here once a project owner assigns them to you."
                : "No tasks match your current filters. Try adjusting your search or filter criteria."}
            </p>
            {assignedTasks.length > 0 && (
              <p className='text-sm text-gray-500'>
                Total assigned tasks: {assignedTasks.length} | Filtered: {filteredTasks.length}
              </p>
            )}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className='bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all'
            >
              {/* Task Header */}
              <div className='flex items-start justify-between mb-4'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-2'>
                    <h3 className='text-lg font-semibold'>{task.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs border ${getTaskStatusColor(task.status)}`}>
                      {task.status.replace("-", " ")}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className='text-sm text-gray-400 mb-2'>{task.projectName}</p>
                  <p className='text-gray-300 text-sm'>{task.description}</p>
                </div>
              </div>

              {/* Task Details */}
              <div className='space-y-3 mb-4'>
                <div className='flex items-center gap-4 text-sm text-gray-400'>
                  <div className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4' />
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Timer className='w-4 h-4' />
                    <span>{task.estimatedHours}h estimated</span>
                  </div>
                  {isDeveloper && (
                    <div className='flex items-center gap-2 text-blue-400'>
                      <Clock className='w-4 h-4' />
                      <span>{formatTime(getCurrentTrackedTime(task.id))} tracked</span>
                    </div>
                  )}
                </div>
                {task.repositoryUrl && (
                  <div className='flex items-center gap-2 text-sm text-blue-400'>
                    <GitBranch className='w-4 h-4' />
                    <a href={task.repositoryUrl} target='_blank' rel='noopener noreferrer' className='hover:underline'>
                      View Repository
                    </a>
                  </div>
                )}
                {isDeveloper && activeTimer && activeTimer.taskId === task.id && (
                  <div className='p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg flex items-center gap-2'>
                    <Clock className='w-4 h-4 text-yellow-400 animate-pulse' />
                    <span className='text-yellow-400 text-sm'>Timer running: {formatTime(getCurrentTrackedTime(task.id))}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className='flex flex-wrap gap-2 pt-4 border-t border-white/10'>
                {task.status === "assigned" && (
                  <>
                    <Button
                      onClick={() => handleStartTask(task)}
                      className='flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2'
                    >
                      <Play className='w-4 h-4' />
                      Start Task
                    </Button>
                    {isDeveloper && (
                      <Button
                        onClick={() => handleStartTimer(task.id)}
                        className='bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2'
                        title="Start Time Tracking"
                      >
                        <Clock className='w-4 h-4' />
                      </Button>
                    )}
                  </>
                )}
                {task.status === "in-progress" && (
                  <>
                    {isDeveloper && (
                      <>
                        {activeTimer && activeTimer.taskId === task.id ? (
                          <Button
                            onClick={() => handleStopActiveTimer()}
                            className='bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2'
                            title="Stop Timer"
                          >
                            <Pause className='w-4 h-4' />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => startTimer(task.id)}
                            className='bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2'
                            title="Start Timer"
                          >
                            <Play className='w-4 h-4' />
                          </Button>
                        )}
                        <Button
                          onClick={() => toggleComments(task.id)}
                          className='bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2'
                          title="View Comments"
                        >
                          <MessageSquare className='w-4 h-4' />
                          {taskComments[task.id]?.length > 0 && (
                            <span className='ml-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                              {taskComments[task.id].length}
                            </span>
                          )}
                        </Button>
                      </>
                    )}
                    <Button
                      onClick={() => {
                        setSelectedTask(task);
                        setShowSubmitModal(true);
                      }}
                      className='flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2'
                    >
                      <Send className='w-4 h-4' />
                      Submit Work
                    </Button>
                  </>
                )}
                {task.status === "under-review" && (
                  <div className='flex-1 bg-purple-500/20 text-purple-400 py-2 rounded-lg text-sm flex items-center justify-center gap-2'>
                    <Clock className='w-4 h-4' />
                    Under Review
                  </div>
                )}
                {task.status === "completed" && (
                  <div className='flex-1 bg-green-500/20 text-green-400 py-2 rounded-lg text-sm flex items-center justify-center gap-2'>
                    <CheckCircleIcon className='w-4 h-4' />
                    Completed
                  </div>
                )}
              </div>

              {/* Comments Section */}
              {isDeveloper && showComments[task.id] && (
                <div className='mt-4 pt-4 border-t border-white/10'>
                  <div className='flex items-center justify-between mb-3'>
                    <h4 className='text-sm font-semibold flex items-center gap-2'>
                      <MessageSquare className='w-4 h-4' />
                      Comments
                    </h4>
                    <button
                      onClick={() => toggleComments(task.id)}
                      className='text-gray-400 hover:text-white text-sm'
                    >
                      <XCircle className='w-4 h-4' />
                    </button>
                  </div>
                  <div className='space-y-2 mb-3 max-h-48 overflow-y-auto'>
                    {taskComments[task.id]?.length > 0 ? (
                      taskComments[task.id].map((comment) => (
                        <div key={comment.id} className='bg-white/5 rounded-lg p-3'>
                          <div className='flex items-center justify-between mb-1'>
                            <span className='text-sm font-medium'>{comment.user?.name || comment.author || "Unknown"}</span>
                            <span className='text-xs text-gray-400'>
                              {new Date(comment.createdAt || comment.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className='text-sm text-gray-300'>{comment.comment || comment.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className='text-sm text-gray-400 text-center py-4'>No comments yet</p>
                    )}
                  </div>
                  <div className='flex gap-2'>
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className='flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500'
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          addComment(task.id, e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Submit Work Modal */}
      {showSubmitModal && selectedTask && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-slate-800 rounded-xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <div className='p-6 border-b border-white/10'>
              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='text-2xl font-bold mb-1'>Submit Work</h2>
                  <p className='text-gray-400'>{selectedTask.title}</p>
                </div>
                <button
                  onClick={() => {
                    setShowSubmitModal(false);
                    setSelectedTask(null);
                  }}
                  className='p-2 hover:bg-white/10 rounded-lg transition-colors'
                >
                  <XCircle className='w-6 h-6 text-gray-400' />
                </button>
              </div>
            </div>
            <div className='p-6 space-y-4'>
              <Input
                label="Submission Type"
                type="select"
                value={submissionType}
                onChange={(e) => setSubmissionType(e.target.value)}
                options={[
                  { label: "Pull Request", value: "pull-request" },
                  { label: "File Upload", value: "file-upload" },
                  { label: "Link to Repository/Commit", value: "link" },
                ]}
              />
              <div>
                <label className='block text-sm font-medium mb-2'>Pull Request / Commit Link</label>
                <input
                  type="url"
                  placeholder="https://github.com/project/repo/pull/123"
                  value={submissionLink}
                  onChange={(e) => setSubmissionLink(e.target.value)}
                  className='w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>Files (Optional)</label>
                <div className='border-2 border-dashed border-white/10 rounded-lg p-6 text-center'>
                  <Upload className='w-12 h-12 text-gray-400 mx-auto mb-2' />
                  <p className='text-sm text-gray-400 mb-2'>Drag and drop files here or click to upload</p>
                  <Button className='bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-lg text-sm'>
                    Choose Files
                  </Button>
                  {submissionFiles.length > 0 && (
                    <div className='mt-4 space-y-2'>
                      {submissionFiles.map((file, idx) => (
                        <div key={idx} className='text-sm text-gray-300'>{file.name}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>Notes / Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe what you've implemented, any challenges faced, or additional notes..."
                  value={submissionNotes}
                  onChange={(e) => setSubmissionNotes(e.target.value)}
                  className='w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500'
                />
              </div>
            </div>
            <div className='p-6 border-t border-white/10 flex justify-end gap-3'>
              <Button
                onClick={() => {
                  setShowSubmitModal(false);
                  setSelectedTask(null);
                }}
                className='bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg'
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitWork}
                className='bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg flex items-center gap-2'
              >
                <Send className='w-4 h-4' />
                Submit for Review
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

