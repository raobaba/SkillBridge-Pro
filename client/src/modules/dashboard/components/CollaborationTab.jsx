import React, { useState, useMemo, useEffect } from "react";
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import {
  Plus,
  Search,
  CheckSquare,
  Users,
  Calendar,
  Timer,
  Edit,
  Eye as EyeIcon,
  XCircle,
  GitBranch,
  FileText,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  BarChart3,
  Activity,
  Filter,
  MoreVertical,
  Download,
  Share2,
  Clock,
  TrendingUp,
  Star,
  Zap,
  FileCheck,
  Archive,
  Trash2,
  Copy,
  RefreshCw,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function CollaborationTab({
  tasks = [],
  projects = [],
  teamMembers = [],
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onReviewSubmit,
  onBulkAction,
  navigate,
  userRole = "project-owner",
  tasksLoading = false,
  collaborationStats = null,
}) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskFilter, setTaskFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("dueDate"); // dueDate, priority, status, createdAt
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid, list, kanban
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);
  
  // Task form state
  const [taskForm, setTaskForm] = useState({
    projectId: "",
    title: "",
    description: "",
    priority: "medium",
    estimatedHours: "",
    dueDate: "",
    assignedTo: "",
  });
  
  const user = useSelector((state) => state.user.user);
  const isProjectOwner = userRole === "project-owner" || user?.role === "project-owner";

  // Use provided collaborationStats or calculate from tasks
  const stats = useMemo(() => {
    if (collaborationStats) {
      return collaborationStats;
    }
    // Fallback calculation from tasks
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "completed").length;
    const inProgressTasks = tasks.filter(t => t.status === "in-progress").length;
    const underReviewTasks = tasks.filter(t => t.status === "under-review").length;
    const pendingReviewSubmissions = tasks.reduce((sum, task) => {
      return sum + (task.submissions?.filter(s => s.status === "pending").length || 0);
    }, 0);
    const activeTeamMembers = new Set(tasks.map(t => t.assignedTo?.id).filter(Boolean)).size;
    const overdueTasks = tasks.filter(t => {
      if (!t.dueDate || t.status === "completed") return false;
      return new Date(t.dueDate) < new Date();
    }).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      underReviewTasks,
      pendingReviewSubmissions,
      activeTeamMembers,
      overdueTasks,
      completionRate,
    };
  }, [collaborationStats, tasks]);

  // Enhanced filtering and sorting
  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    
    if (taskFilter !== "all") {
      filtered = filtered.filter(task => task.status === taskFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignedTo?.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
          const statusOrder = { "under-review": 4, "in-progress": 3, "open": 2, "completed": 1, "on-hold": 0 };
          aValue = statusOrder[a.status] || 0;
          bValue = statusOrder[b.status] || 0;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt || 0).getTime();
          bValue = new Date(b.createdAt || 0).getTime();
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
  }, [tasks, taskFilter, searchQuery, selectedProject, sortBy, sortOrder]);

  const getTaskStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "in-progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "under-review":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "on-hold":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
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

  const handleCreateTask = async () => {
    // Validate required fields
    if (!taskForm.projectId || !taskForm.title || !taskForm.dueDate) {
      toast.error("Please fill in all required fields (Project, Title, Due Date)");
      return;
    }

    setIsCreatingTask(true);
    try {
      const taskData = {
        projectId: Number(taskForm.projectId),
        title: taskForm.title,
        description: taskForm.description || "",
        priority: taskForm.priority || "medium",
        estimatedHours: taskForm.estimatedHours ? Number(taskForm.estimatedHours) : 0,
        dueDate: taskForm.dueDate,
        assignedTo: taskForm.assignedTo ? Number(taskForm.assignedTo) : null,
      };

      if (onTaskCreate) {
        await onTaskCreate(taskData);
        toast.success("Task created successfully!");
      }
      
      // Reset form and close modal
      setTaskForm({
        projectId: "",
        title: "",
        description: "",
        priority: "medium",
        estimatedHours: "",
        dueDate: "",
        assignedTo: "",
      });
      setShowCreateTaskModal(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error(error?.message || "Failed to create task. Please try again.");
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleUpdateTask = async () => {
    if (!selectedTask) return;
    
    // Validate required fields
    if (!taskForm.projectId || !taskForm.title || !taskForm.dueDate) {
      toast.error("Please fill in all required fields (Project, Title, Due Date)");
      return;
    }

    setIsUpdatingTask(true);
    try {
      const taskData = {
        id: selectedTask.id,
        projectId: Number(taskForm.projectId),
        title: taskForm.title,
        description: taskForm.description || "",
        priority: taskForm.priority || "medium",
        estimatedHours: taskForm.estimatedHours ? Number(taskForm.estimatedHours) : 0,
        dueDate: taskForm.dueDate,
        assignedTo: taskForm.assignedTo ? Number(taskForm.assignedTo) : null,
      };

      if (onTaskUpdate) {
        await onTaskUpdate(taskData);
        toast.success("Task updated successfully!");
      }
      
      // Reset form and close modal
      setTaskForm({
        projectId: "",
        title: "",
        description: "",
        priority: "medium",
        estimatedHours: "",
        dueDate: "",
        assignedTo: "",
      });
      setShowCreateTaskModal(false);
      setSelectedTask(null);
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error(error?.message || "Failed to update task. Please try again.");
    } finally {
      setIsUpdatingTask(false);
    }
  };

  // Initialize form when editing a task
  useEffect(() => {
    if (selectedTask && showCreateTaskModal) {
      setTaskForm({
        projectId: selectedTask.projectId ? String(selectedTask.projectId) : "",
        title: selectedTask.title || "",
        description: selectedTask.description || "",
        priority: selectedTask.priority || "medium",
        estimatedHours: selectedTask.estimatedHours ? String(selectedTask.estimatedHours) : "",
        dueDate: selectedTask.dueDate || "",
        assignedTo: selectedTask.assignedTo?.id ? String(selectedTask.assignedTo.id) : "",
      });
    } else if (!selectedTask && showCreateTaskModal) {
      // Reset form for new task
      setTaskForm({
        projectId: "",
        title: "",
        description: "",
        priority: "medium",
        estimatedHours: "",
        dueDate: "",
        assignedTo: "",
      });
    }
  }, [selectedTask, showCreateTaskModal]);

  const handleReviewAction = async (action, comments = "") => {
    if (selectedTask && selectedTask.submissions && selectedTask.submissions.length > 0) {
      const submissionId = selectedTask.submissions[0].id;
      if (onReviewSubmit) {
        await onReviewSubmit(submissionId, action, comments);
      }
    }
    setShowReviewModal(false);
    setSelectedTask(null);
  };

  // Bulk actions handler
  const handleBulkAction = async (action, additionalData = {}) => {
    if (selectedTasks.length === 0) return;
    
    if (onBulkAction) {
      await onBulkAction(action, selectedTasks, additionalData);
    }
    setSelectedTasks([]);
    setShowBulkActions(false);
  };

  const toggleTaskSelection = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const selectAllTasks = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map(t => t.id));
    }
  };

  return (
    <div className='space-y-6'>
      {/* Enhanced Header Section */}
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4'>
        <div className='flex-1'>
          <h1 className='text-3xl font-bold mb-2'>Project Collaboration</h1>
          <p className='text-gray-300'>
            {isProjectOwner 
              ? "Manage tasks, review submissions, track team progress, and collaborate" 
              : "View and manage your assigned tasks"}
          </p>
        </div>
        <div className='flex items-center gap-3'>
          {isProjectOwner && (
            <>
              <Button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className='bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2'
              >
                <BarChart3 className='w-5 h-5' />
                Analytics
              </Button>
              <Button
                onClick={() => navigate('/chat')}
                className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2'
              >
                <MessageSquare className='w-5 h-5' />
                Team Chat
              </Button>
              <Button
                onClick={() => setShowCreateTaskModal(true)}
                className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2'
              >
                <Plus className='w-5 h-5' />
                Create Task
              </Button>
            </>
          )}
          {!isProjectOwner && (
            <Button
              onClick={() => navigate('/chat')}
              className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2'
            >
              <MessageSquare className='w-5 h-5' />
              Contact Team
            </Button>
          )}
        </div>
      </div>

      {/* Analytics Dashboard for Project Owners */}
      {isProjectOwner && showAnalytics && stats && (
        <div className='bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6 mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-semibold flex items-center gap-2'>
              <BarChart3 className='w-6 h-6 text-purple-400' />
              Collaboration Analytics
            </h2>
            <button
              onClick={() => setShowAnalytics(false)}
              className='text-gray-400 hover:text-white'
            >
              <XCircle className='w-5 h-5' />
            </button>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4'>
            <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
              <p className='text-gray-400 text-sm mb-1'>Total Tasks</p>
              <p className='text-2xl font-bold text-blue-400'>{stats.totalTasks}</p>
            </div>
            <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
              <p className='text-gray-400 text-sm mb-1'>Completed</p>
              <p className='text-2xl font-bold text-green-400'>{stats.completedTasks}</p>
            </div>
            <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
              <p className='text-gray-400 text-sm mb-1'>In Progress</p>
              <p className='text-2xl font-bold text-yellow-400'>{stats.inProgressTasks}</p>
            </div>
            <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
              <p className='text-gray-400 text-sm mb-1'>Under Review</p>
              <p className='text-2xl font-bold text-purple-400'>{stats.underReviewTasks}</p>
            </div>
            <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
              <p className='text-gray-400 text-sm mb-1'>Pending Reviews</p>
              <p className='text-2xl font-bold text-orange-400'>{stats.pendingReviewSubmissions}</p>
            </div>
            <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
              <p className='text-gray-400 text-sm mb-1'>Active Members</p>
              <p className='text-2xl font-bold text-pink-400'>{stats.activeTeamMembers}</p>
            </div>
            <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
              <p className='text-gray-400 text-sm mb-1'>Completion Rate</p>
              <p className='text-2xl font-bold text-green-400'>{stats.completionRate}%</p>
            </div>
          </div>
          {stats.overdueTasks > 0 && (
            <div className='mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-2'>
              <AlertCircle className='w-5 h-5 text-red-400' />
              <span className='text-red-400'>{stats.overdueTasks} task(s) overdue</span>
            </div>
          )}
        </div>
      )}

      {/* Bulk Actions Bar */}
      {isProjectOwner && selectedTasks.length > 0 && (
        <div className='bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <span className='text-blue-400 font-medium'>
              {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
            </span>
            <Button
              onClick={() => setSelectedTasks([])}
              className='text-blue-400 hover:text-blue-300 text-sm'
              variant="ghost"
            >
              Clear
            </Button>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              onClick={() => handleBulkAction("assign")}
              className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2'
            >
              <Users className='w-4 h-4' />
              Assign
            </Button>
            <Button
              onClick={() => handleBulkAction("archive")}
              className='bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2'
            >
              <Archive className='w-4 h-4' />
              Archive
            </Button>
            <Button
              onClick={() => handleBulkAction("delete")}
              className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2'
            >
              <Trash2 className='w-4 h-4' />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Enhanced Filters and Search */}
      <div className='bg-white/5 border border-white/10 rounded-xl p-4'>
        <div className='flex flex-col gap-4'>
          {/* Top Row: Search and View Mode */}
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1'>
              <label className='text-sm text-gray-400 mb-2 block'>Search Tasks</label>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type="text"
                  placeholder="Search tasks, projects, assignees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500'
                />
              </div>
            </div>
            {isProjectOwner && (
              <div className='flex items-end gap-2'>
                <Button
                  onClick={selectAllTasks}
                  className='bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm'
                  variant="ghost"
                >
                  {selectedTasks.length === filteredTasks.length ? "Deselect All" : "Select All"}
                </Button>
                <div className='flex items-center gap-1 bg-white/5 rounded-lg p-1'>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      viewMode === "grid" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      viewMode === "list" ? "bg-blue-500 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>
            )}
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
                  ...projects
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
                  { label: "Open", value: "open" },
                  { label: "In Progress", value: "in-progress" },
                  { label: "Under Review", value: "under-review" },
                  { label: "Completed", value: "completed" },
                  { label: "On Hold", value: "on-hold" },
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
                      { label: "Created Date", value: "createdAt" },
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
        {filteredTasks.length === 0 ? (
          <div className='col-span-2 bg-white/5 border border-white/10 rounded-xl p-12 text-center'>
            <CheckSquare className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <h3 className='text-xl font-semibold mb-2'>No tasks found</h3>
            <p className='text-gray-400 mb-6'>Create your first task to get started with project collaboration</p>
            <Button
              onClick={() => setShowCreateTaskModal(true)}
              className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg'
            >
              Create Task
            </Button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white/5 border rounded-xl p-6 hover:border-white/20 transition-all ${
                selectedTasks.includes(task.id) ? 'border-blue-500 bg-blue-500/10' : 'border-white/10'
              }`}
            >
              {/* Task Header */}
              <div className='flex items-start justify-between mb-4'>
                <div className='flex items-start gap-3 flex-1'>
                  {isProjectOwner && (
                    <input
                      type="checkbox"
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => toggleTaskSelection(task.id)}
                      className='mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500'
                    />
                  )}
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
                <div className='flex gap-2'>
                  {isProjectOwner && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setShowCreateTaskModal(true);
                        }}
                        className='p-2 hover:bg-white/10 rounded-lg transition-colors'
                        title="Edit Task"
                      >
                        <Edit className='w-4 h-4 text-gray-400' />
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm(`Are you sure you want to delete "${task.title}"? This action cannot be undone.`)) {
                            if (onTaskDelete) {
                              try {
                                await onTaskDelete(task.id);
                                toast.success("Task deleted successfully!");
                              } catch (error) {
                                toast.error(error?.message || "Failed to delete task");
                              }
                            }
                          }
                        }}
                        className='p-2 hover:bg-red-500/20 rounded-lg transition-colors'
                        title="Delete Task"
                      >
                        <Trash2 className='w-4 h-4 text-red-400' />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => navigate(`/chat?taskId=${task.id}`)}
                    className='p-2 hover:bg-white/10 rounded-lg transition-colors'
                    title="Discuss Task"
                  >
                    <MessageSquare className='w-4 h-4 text-gray-400' />
                  </button>
                </div>
              </div>

              {/* Task Details */}
              <div className='space-y-3 mb-4'>
                {task.assignedTo && (
                  <div className='flex items-center gap-2 text-sm text-gray-400'>
                    <Users className='w-4 h-4' />
                    <span>Assigned to: <span className='text-white'>{task.assignedTo.name}</span></span>
                  </div>
                )}
                <div className='flex items-center gap-4 text-sm text-gray-400'>
                  <div className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4' />
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Timer className='w-4 h-4' />
                    <span>{task.estimatedHours}h estimated</span>
                  </div>
                </div>
              </div>

              {/* Submissions */}
              {task.submissions && task.submissions.length > 0 && (
                <div className='mb-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm font-medium text-purple-400'>Pending Review</span>
                    <Button
                      onClick={() => {
                        setSelectedTask(task);
                        setShowReviewModal(true);
                      }}
                      className='text-xs bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded'
                    >
                      Review Now
                    </Button>
                  </div>
                  <p className='text-xs text-gray-400'>
                    {task.submissions.length} submission{task.submissions.length > 1 ? 's' : ''} waiting for review
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className='flex gap-2 pt-4 border-t border-white/10'>
                {isProjectOwner && task.status === "under-review" && task.submissions?.length > 0 && (
                  <Button
                    onClick={() => {
                      setSelectedTask(task);
                      setShowReviewModal(true);
                    }}
                    className='flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2'
                  >
                    <EyeIcon className='w-4 h-4' />
                    Review Submission ({task.submissions.length})
                  </Button>
                )}
                {isProjectOwner && (
                  <>
                    <Button
                      onClick={() => navigate(`/project?tab=my-projects&projectId=${task.projectId}`)}
                      className='flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-2 rounded-lg text-sm flex items-center justify-center gap-2'
                    >
                      <EyeIcon className='w-4 h-4' />
                      View Project
                    </Button>
                    {task.assignedTo && (
                      <Button
                        onClick={() => navigate(`/chat?userId=${task.assignedTo.id}`)}
                        className='bg-green-500/20 hover:bg-green-500/30 text-green-400 py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2'
                      >
                        <MessageSquare className='w-4 h-4' />
                      </Button>
                    )}
                  </>
                )}
                {!isProjectOwner && task.status !== "completed" && (
                  <Button
                    onClick={() => navigate(`/project?tab=my-projects&projectId=${task.projectId}`)}
                    className='flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-2 rounded-lg text-sm flex items-center justify-center gap-2'
                  >
                    <EyeIcon className='w-4 h-4' />
                    View Project
                  </Button>
                )}
              </div>
              
              {/* Activity Indicator for Project Owners */}
              {isProjectOwner && task.submissions && task.submissions.length > 0 && (
                <div className='mt-3 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-gray-400'>
                  <Activity className='w-4 h-4' />
                  <span>{task.submissions.length} submission{task.submissions.length > 1 ? 's' : ''} pending review</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Task Modal */}
      {showCreateTaskModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-slate-800 rounded-xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <div className='p-6 border-b border-white/10'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold'>
                  {selectedTask ? 'Edit Task' : 'Create New Task'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateTaskModal(false);
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
                label="Project *"
                type="select"
                value={taskForm.projectId}
                onChange={(e) => setTaskForm(prev => ({ ...prev, projectId: e.target.value }))}
                placeholder="Select a project"
                options={[
                  { label: "Select a project", value: "" },
                  ...projects
                    .filter(project => project && project.id != null)
                    .map(project => ({ label: project.title || "Untitled Project", value: String(project.id) }))
                ]}
              />
              <div>
                <label className='block text-sm font-medium mb-2'>Task Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Setup Database Schema"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                  className='w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe the task in detail..."
                  value={taskForm.description}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                  className='w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500'
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <Input
                  label="Priority"
                  type="select"
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, priority: e.target.value }))}
                  options={[
                    { label: "Low", value: "low" },
                    { label: "Medium", value: "medium" },
                    { label: "High", value: "high" },
                  ]}
                />
                <div>
                  <label className='block text-sm font-medium mb-2'>Estimated Hours</label>
                  <input
                    type="number"
                    placeholder="8"
                    value={taskForm.estimatedHours}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, estimatedHours: e.target.value }))}
                    className='w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500'
                  />
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium mb-2'>Due Date *</label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    className='w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500'
                  />
                </div>
                <Input
                  label="Assign To"
                  type="select"
                  value={taskForm.assignedTo}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, assignedTo: e.target.value }))}
                  options={[
                    { label: "Unassigned", value: "" },
                    ...teamMembers
                      .filter(member => member && member.id != null)
                      .map(member => ({ label: member.name || "Unknown", value: String(member.id) }))
                  ]}
                />
              </div>
            </div>
            <div className='p-6 border-t border-white/10 flex justify-end gap-3'>
              <Button
                onClick={() => {
                  setShowCreateTaskModal(false);
                  setSelectedTask(null);
                  setTaskForm({
                    projectId: "",
                    title: "",
                    description: "",
                    priority: "medium",
                    estimatedHours: "",
                    dueDate: "",
                    assignedTo: "",
                  });
                }}
                disabled={isCreatingTask || isUpdatingTask}
                className='bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Cancel
              </Button>
              <Button
                onClick={selectedTask ? handleUpdateTask : handleCreateTask}
                disabled={isCreatingTask || isUpdatingTask}
                className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
              >
                {(isCreatingTask || isUpdatingTask) && (
                  <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                )}
                {isCreatingTask ? 'Creating...' : isUpdatingTask ? 'Updating...' : (selectedTask ? 'Update Task' : 'Create Task')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      {showReviewModal && selectedTask && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-slate-800 rounded-xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto'>
            <div className='p-6 border-b border-white/10'>
              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='text-2xl font-bold mb-1'>Review Submission</h2>
                  <p className='text-gray-400'>{selectedTask.title}</p>
                </div>
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedTask(null);
                  }}
                  className='p-2 hover:bg-white/10 rounded-lg transition-colors'
                >
                  <XCircle className='w-6 h-6 text-gray-400' />
                </button>
              </div>
            </div>
            <div className='p-6 space-y-6'>
              {selectedTask.submissions?.map((submission, idx) => (
                <div key={idx} className='bg-white/5 border border-white/10 rounded-lg p-6'>
                  <div className='flex items-start justify-between mb-4'>
                    <div>
                      <div className='flex items-center gap-2 mb-2'>
                        <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold'>
                          {submission.submittedBy.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className='font-semibold'>{submission.submittedBy.name}</p>
                          <p className='text-sm text-gray-400'>
                            Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className='px-3 py-1 bg-purple-500/20 text-purple-400 rounded text-sm border border-purple-500/30'>
                      {submission.type === 'pull-request' ? 'Pull Request' : 'File Upload'}
                    </span>
                  </div>

                  {submission.type === 'pull-request' && submission.link && (
                    <div className='mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg'>
                      <div className='flex items-center gap-2 mb-2'>
                        <GitBranch className='w-5 h-5 text-blue-400' />
                        <span className='font-medium'>Pull Request</span>
                      </div>
                      <a
                        href={submission.link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-400 hover:text-blue-300 flex items-center gap-2'
                      >
                        <LinkIcon className='w-4 h-4' />
                        {submission.link}
                      </a>
                    </div>
                  )}

                  {submission.files && submission.files.length > 0 && (
                    <div className='mb-4'>
                      <p className='text-sm font-medium mb-2'>Attached Files</p>
                      <div className='space-y-2'>
                        {submission.files.map((file, fileIdx) => (
                          <div key={fileIdx} className='flex items-center gap-2 p-2 bg-white/5 rounded'>
                            <FileText className='w-4 h-4 text-gray-400' />
                            <span className='text-sm'>{file.name}</span>
                            <a href={file.url} download className='ml-auto text-blue-400 hover:text-blue-300'>
                              <Upload className='w-4 h-4' />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {submission.notes && (
                    <div className='mb-4'>
                      <p className='text-sm font-medium mb-2'>Developer Notes</p>
                      <p className='text-gray-300 text-sm bg-white/5 p-3 rounded'>{submission.notes}</p>
                    </div>
                  )}

                  <div className='pt-4 border-t border-white/10'>
                    <label className='block text-sm font-medium mb-2'>Your Review Comments</label>
                    <textarea
                      rows={3}
                      placeholder="Add your feedback, questions, or approval notes..."
                      className='w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 mb-3'
                    />
                    <div className='flex gap-3'>
                      <Button
                        onClick={() => handleReviewAction('approve')}
                        className='flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2'
                      >
                        <CheckCircle2 className='w-5 h-5' />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReviewAction('request-changes')}
                        className='flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg flex items-center justify-center gap-2'
                      >
                        <AlertCircle className='w-5 h-5' />
                        Request Changes
                      </Button>
                      <Button
                        onClick={() => handleReviewAction('reject')}
                        className='flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2'
                      >
                        <XCircle className='w-5 h-5' />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

