import React, { useState, useMemo } from "react";
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
} from "lucide-react";

export default function CollaborationTab({
  tasks = [],
  projects = [],
  teamMembers = [],
  onTaskCreate,
  onTaskUpdate,
  onReviewSubmit,
  navigate,
}) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskFilter, setTaskFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    
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
  }, [tasks, taskFilter, searchQuery, selectedProject]);

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

  const handleCreateTask = () => {
    // TODO: Call onTaskCreate with form data
    setShowCreateTaskModal(false);
    setSelectedTask(null);
  };

  const handleUpdateTask = () => {
    // TODO: Call onTaskUpdate with form data
    setShowCreateTaskModal(false);
    setSelectedTask(null);
  };

  const handleReviewAction = (action) => {
    // TODO: Call onReviewSubmit with action and comments
    setShowReviewModal(false);
    setSelectedTask(null);
  };

  return (
    <div className='space-y-6'>
      {/* Header Section */}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h1 className='text-3xl font-bold mb-2'>Project Collaboration</h1>
          <p className='text-gray-300'>Manage tasks, review submissions, and track project progress</p>
        </div>
        <Button
          onClick={() => setShowCreateTaskModal(true)}
          className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2'
        >
          <Plus className='w-5 h-5' />
          Create Task
        </Button>
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
                <div className='flex gap-2'>
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setShowCreateTaskModal(true);
                    }}
                    className='p-2 hover:bg-white/10 rounded-lg transition-colors'
                  >
                    <Edit className='w-4 h-4 text-gray-400' />
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
                {task.status === "under-review" && task.submissions?.length > 0 && (
                  <Button
                    onClick={() => {
                      setSelectedTask(task);
                      setShowReviewModal(true);
                    }}
                    className='flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2'
                  >
                    <EyeIcon className='w-4 h-4' />
                    Review Submission
                  </Button>
                )}
                {task.status !== "completed" && (
                  <Button
                    onClick={() => navigate(`/project?tab=my-projects&projectId=${task.projectId}`)}
                    className='flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-2 rounded-lg text-sm flex items-center justify-center gap-2'
                  >
                    <EyeIcon className='w-4 h-4' />
                    View Project
                  </Button>
                )}
              </div>
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
                label="Project"
                type="select"
                defaultValue={selectedTask?.projectId || ""}
                placeholder="Select a project"
                options={[
                  { label: "Select a project", value: "" },
                  ...projects
                    .filter(project => project && project.id != null)
                    .map(project => ({ label: project.title || "Untitled Project", value: String(project.id) }))
                ]}
              />
              <div>
                <label className='block text-sm font-medium mb-2'>Task Title</label>
                <input
                  type="text"
                  placeholder="e.g., Setup Database Schema"
                  className='w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500'
                  defaultValue={selectedTask?.title || ""}
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-2'>Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe the task in detail..."
                  className='w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500'
                  defaultValue={selectedTask?.description || ""}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <Input
                  label="Priority"
                  type="select"
                  defaultValue={selectedTask?.priority || "medium"}
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
                    className='w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500'
                    defaultValue={selectedTask?.estimatedHours || ""}
                  />
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium mb-2'>Due Date</label>
                  <input
                    type="date"
                    className='w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500'
                    defaultValue={selectedTask?.dueDate || ""}
                  />
                </div>
                <Input
                  label="Assign To"
                  type="select"
                  defaultValue={selectedTask?.assignedTo?.id || ""}
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
                }}
                className='bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg'
              >
                Cancel
              </Button>
              <Button
                onClick={selectedTask ? handleUpdateTask : handleCreateTask}
                className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg'
              >
                {selectedTask ? 'Update Task' : 'Create Task'}
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

