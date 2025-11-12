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
} from "lucide-react";
import { toast } from "react-toastify";

export default function MyTasksTab({
  assignedTasks = [],
  appliedProjects = [],
  onTaskStart,
  onTaskSubmit,
}) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskFilter, setTaskFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = useMemo(() => {
    let filtered = assignedTasks;
    
    if (taskFilter !== "all") {
      filtered = filtered.filter(task => task.status === taskFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedProject) {
      filtered = filtered.filter(task => task.projectId === selectedProject);
    }
    
    return filtered;
  }, [assignedTasks, taskFilter, searchQuery, selectedProject]);

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

  const handleSubmitWork = () => {
    if (onTaskSubmit) {
      onTaskSubmit(selectedTask);
    }
    setShowSubmitModal(false);
    setSelectedTask(null);
    toast.success("Work submitted successfully! Waiting for review.");
  };

  return (
    <div className='space-y-6'>
      {/* Header Section */}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-3xl font-bold mb-2'>My Tasks</h1>
          <p className='text-gray-300'>View assigned tasks, submit your work, and track progress</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className='bg-white/5 border border-white/10 rounded-xl p-4'>
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

          {/* Search */}
          <div className='flex-1'>
            <label className='text-sm text-gray-400 mb-2 block'>Search Tasks</label>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {filteredTasks.length === 0 ? (
          <div className='col-span-2 bg-white/5 border border-white/10 rounded-xl p-12 text-center'>
            <CheckSquare className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <h3 className='text-xl font-semibold mb-2'>No tasks assigned</h3>
            <p className='text-gray-400 mb-6'>You don't have any tasks assigned yet. Tasks will appear here once a project owner assigns them to you.</p>
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
                </div>
                {task.repositoryUrl && (
                  <div className='flex items-center gap-2 text-sm text-blue-400'>
                    <GitBranch className='w-4 h-4' />
                    <a href={task.repositoryUrl} target='_blank' rel='noopener noreferrer' className='hover:underline'>
                      View Repository
                    </a>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className='flex gap-2 pt-4 border-t border-white/10'>
                {task.status === "assigned" && (
                  <Button
                    onClick={() => handleStartTask(task)}
                    className='flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2'
                  >
                    <Play className='w-4 h-4' />
                    Start Task
                  </Button>
                )}
                {task.status === "in-progress" && (
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
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>Notes / Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe what you've implemented, any challenges faced, or additional notes..."
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

