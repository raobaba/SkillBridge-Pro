import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createTaskApi,
  getTaskByIdApi,
  getProjectOwnerTasksApi,
  updateTaskApi,
  deleteTaskApi,
  startTaskApi,
  bulkUpdateTasksApi,
  bulkDeleteTasksApi,
  bulkAssignTasksApi,
  submitTaskApi,
  reviewSubmissionApi,
  getTaskSubmissionsApi,
  addTaskCommentApi,
  getTaskCommentsApi,
  updateTaskCommentApi,
  deleteTaskCommentApi,
  startTimerApi,
  stopTimerApi,
  stopActiveTimerApi,
  getTaskTimeTrackingApi,
  getUserTimeTrackingApi,
  getCollaborationStatsApi,
  getDeveloperPerformanceStatsApi,
} from "./taskAction";

// Initial state
const initialState = {
  // Tasks
  tasks: [],
  currentTask: null,
  tasksLoading: false,
  tasksError: null,
  
  // Task submissions
  taskSubmissions: {},
  submissionsLoading: false,
  
  // Task comments
  taskComments: {},
  commentsLoading: false,
  
  // Time tracking
  timeTracking: {},
  activeTimer: null,
  userTimeTracking: [],
  timeTrackingLoading: false,
  
  // Analytics
  collaborationStats: null,
  performanceStats: null,
  analyticsLoading: false,
  
  // UI state
  selectedTasks: [],
  showBulkActions: false,
};

// Async thunks
export const createTask = createAsyncThunk(
  "task/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createTaskApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to create task" }
      );
    }
  }
);

export const getTaskById = createAsyncThunk(
  "task/getById",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await getTaskByIdApi(taskId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch task" }
      );
    }
  }
);

export const getProjectOwnerTasks = createAsyncThunk(
  "task/getProjectOwnerTasks",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getProjectOwnerTasksApi(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch tasks" }
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "task/update",
  async ({ taskId, data }, { rejectWithValue }) => {
    try {
      const response = await updateTaskApi(taskId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to update task" }
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "task/delete",
  async (taskId, { rejectWithValue }) => {
    try {
      await deleteTaskApi(taskId);
      return taskId;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to delete task" }
      );
    }
  }
);

export const startTask = createAsyncThunk(
  "task/start",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await startTaskApi(taskId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to start task" }
      );
    }
  }
);

export const bulkUpdateTasks = createAsyncThunk(
  "task/bulkUpdate",
  async (data, { rejectWithValue }) => {
    try {
      const response = await bulkUpdateTasksApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to bulk update tasks" }
      );
    }
  }
);

export const bulkDeleteTasks = createAsyncThunk(
  "task/bulkDelete",
  async (data, { rejectWithValue }) => {
    try {
      const response = await bulkDeleteTasksApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to bulk delete tasks" }
      );
    }
  }
);

export const bulkAssignTasks = createAsyncThunk(
  "task/bulkAssign",
  async (data, { rejectWithValue }) => {
    try {
      const response = await bulkAssignTasksApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to bulk assign tasks" }
      );
    }
  }
);

export const submitTask = createAsyncThunk(
  "task/submit",
  async ({ taskId, data }, { rejectWithValue }) => {
    try {
      const response = await submitTaskApi(taskId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to submit task" }
      );
    }
  }
);

export const reviewSubmission = createAsyncThunk(
  "task/reviewSubmission",
  async ({ submissionId, data }, { rejectWithValue }) => {
    try {
      const response = await reviewSubmissionApi(submissionId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to review submission" }
      );
    }
  }
);

export const getTaskSubmissions = createAsyncThunk(
  "task/getSubmissions",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await getTaskSubmissionsApi(taskId);
      return { taskId, submissions: response.data };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch submissions" }
      );
    }
  }
);

export const addTaskComment = createAsyncThunk(
  "task/addComment",
  async ({ taskId, data }, { rejectWithValue }) => {
    try {
      const response = await addTaskCommentApi(taskId, data);
      return { taskId, comment: response.data };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to add comment" }
      );
    }
  }
);

export const getTaskComments = createAsyncThunk(
  "task/getComments",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await getTaskCommentsApi(taskId);
      return { taskId, comments: response.data };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch comments" }
      );
    }
  }
);

export const updateTaskComment = createAsyncThunk(
  "task/updateComment",
  async ({ commentId, data }, { rejectWithValue }) => {
    try {
      const response = await updateTaskCommentApi(commentId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to update comment" }
      );
    }
  }
);

export const deleteTaskComment = createAsyncThunk(
  "task/deleteComment",
  async ({ commentId, taskId }, { rejectWithValue }) => {
    try {
      await deleteTaskCommentApi(commentId);
      return { commentId, taskId };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to delete comment" }
      );
    }
  }
);

export const startTimer = createAsyncThunk(
  "task/startTimer",
  async ({ taskId, data = {} }, { rejectWithValue }) => {
    try {
      const response = await startTimerApi(taskId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to start timer" }
      );
    }
  }
);

export const stopTimer = createAsyncThunk(
  "task/stopTimer",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await stopTimerApi(taskId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to stop timer" }
      );
    }
  }
);

export const stopActiveTimer = createAsyncThunk(
  "task/stopActiveTimer",
  async (_, { rejectWithValue }) => {
    try {
      const response = await stopActiveTimerApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to stop active timer" }
      );
    }
  }
);

export const getTaskTimeTracking = createAsyncThunk(
  "task/getTimeTracking",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await getTaskTimeTrackingApi(taskId);
      return { taskId, timeTracking: response.data };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch time tracking" }
      );
    }
  }
);

export const getUserTimeTracking = createAsyncThunk(
  "task/getUserTimeTracking",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getUserTimeTrackingApi(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch time tracking" }
      );
    }
  }
);

export const getCollaborationStats = createAsyncThunk(
  "task/getCollaborationStats",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getCollaborationStatsApi(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch collaboration stats" }
      );
    }
  }
);

export const getDeveloperPerformanceStats = createAsyncThunk(
  "task/getDeveloperPerformanceStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDeveloperPerformanceStatsApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to fetch performance stats" }
      );
    }
  }
);

// Slice
const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    clearTasks: (state) => {
      state.tasks = [];
      state.currentTask = null;
    },
    setSelectedTasks: (state, action) => {
      state.selectedTasks = action.payload;
      state.showBulkActions = action.payload.length > 0;
    },
    toggleTaskSelection: (state, action) => {
      const taskId = action.payload;
      const index = state.selectedTasks.indexOf(taskId);
      if (index > -1) {
        state.selectedTasks.splice(index, 1);
      } else {
        state.selectedTasks.push(taskId);
      }
      state.showBulkActions = state.selectedTasks.length > 0;
    },
    clearSelectedTasks: (state) => {
      state.selectedTasks = [];
      state.showBulkActions = false;
    },
    setActiveTimer: (state, action) => {
      state.activeTimer = action.payload;
    },
    clearActiveTimer: (state) => {
      state.activeTimer = null;
    },
  },
  extraReducers: (builder) => {
    // Get Project Owner Tasks
    builder
      .addCase(getProjectOwnerTasks.pending, (state) => {
        state.tasksLoading = true;
        state.tasksError = null;
      })
      .addCase(getProjectOwnerTasks.fulfilled, (state, action) => {
        state.tasksLoading = false;
        const serverTasks = action.payload.tasks || action.payload.data || [];
        
        // Merge server tasks with any locally created tasks that might not be in the server response yet
        // This ensures newly created tasks are immediately visible even if server hasn't indexed them
        const serverTaskIds = new Set(serverTasks.map(t => t.id));
        const localTasksNotInServer = state.tasks.filter(t => {
          if (!t.id || serverTaskIds.has(t.id) || !t.createdAt) return false;
          try {
            // Only keep tasks created in the last 10 seconds to avoid stale data
            const createdAt = typeof t.createdAt === 'string' ? new Date(t.createdAt) : t.createdAt;
            const timeDiff = Date.now() - createdAt.getTime();
            return timeDiff >= 0 && timeDiff < 10000; // Within last 10 seconds
          } catch (e) {
            return false;
          }
        });
        
        // Combine server tasks with local tasks, avoiding duplicates
        const allTasks = [...serverTasks];
        localTasksNotInServer.forEach(localTask => {
          if (!allTasks.find(t => t.id === localTask.id)) {
            allTasks.unshift(localTask); // Add at the beginning for visibility
          }
        });
        
        state.tasks = allTasks;
      })
      .addCase(getProjectOwnerTasks.rejected, (state, action) => {
        state.tasksLoading = false;
        state.tasksError = action.payload;
      });

    // Create Task
    builder
      .addCase(createTask.pending, (state) => {
        state.tasksLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasksLoading = false;
        if (action.payload.data) {
          const newTask = {
            ...action.payload.data,
            // Ensure createdAt is set for the merge logic
            createdAt: action.payload.data.createdAt || new Date().toISOString(),
          };
          // Check if task already exists (avoid duplicates)
          const existingIndex = state.tasks.findIndex(t => t.id === newTask.id);
          if (existingIndex > -1) {
            // Update existing task
            state.tasks[existingIndex] = newTask;
          } else {
            // Add new task at the beginning of the array for immediate visibility
            state.tasks.unshift(newTask);
          }
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.tasksLoading = false;
        state.tasksError = action.payload;
      });

    // Get Task By ID
    builder
      .addCase(getTaskById.fulfilled, (state, action) => {
        state.currentTask = action.payload.data || action.payload;
      });

    // Update Task
    builder
      .addCase(updateTask.fulfilled, (state, action) => {
        const updatedTask = action.payload.data || action.payload;
        const index = state.tasks.findIndex(t => t.id === updatedTask.id);
        if (index > -1) {
          state.tasks[index] = updatedTask;
        }
        if (state.currentTask?.id === updatedTask.id) {
          state.currentTask = updatedTask;
        }
      });

    // Delete Task
    builder
      .addCase(deleteTask.fulfilled, (state, action) => {
        const taskId = Number(action.payload);
        // Remove task from state by comparing IDs (handle both string and number IDs)
        state.tasks = state.tasks.filter(t => Number(t.id) !== taskId);
        if (state.currentTask && Number(state.currentTask.id) === taskId) {
          state.currentTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.tasksLoading = false;
      });

    // Start Task
    builder
      .addCase(startTask.fulfilled, (state, action) => {
        const updatedTask = action.payload.data || action.payload;
        const index = state.tasks.findIndex(t => t.id === updatedTask.id);
        if (index > -1) {
          state.tasks[index] = updatedTask;
        }
      });

    // Bulk Operations
    builder
      .addCase(bulkUpdateTasks.fulfilled, (state, action) => {
        const updatedTasks = action.payload.data || action.payload;
        updatedTasks.forEach(updatedTask => {
          const index = state.tasks.findIndex(t => t.id === updatedTask.id);
          if (index > -1) {
            state.tasks[index] = updatedTask;
          }
        });
        state.selectedTasks = [];
        state.showBulkActions = false;
      })
      .addCase(bulkDeleteTasks.fulfilled, (state, action) => {
        // The payload is response.data which is an array of deleted task objects
        const deletedTasks = action.payload;
        if (Array.isArray(deletedTasks) && deletedTasks.length > 0) {
          // Extract task IDs from deleted task objects
          const deletedIds = deletedTasks.map(t => (typeof t === 'object' && t.id ? t.id : t));
          // Remove deleted tasks from state
          state.tasks = state.tasks.filter(t => !deletedIds.includes(t.id));
        }
        state.selectedTasks = [];
        state.showBulkActions = false;
      })
      .addCase(bulkAssignTasks.fulfilled, (state, action) => {
        const assignedTasks = action.payload.data || action.payload;
        assignedTasks.forEach(assignedTask => {
          const index = state.tasks.findIndex(t => t.id === assignedTask.id);
          if (index > -1) {
            state.tasks[index] = assignedTask;
          }
        });
        state.selectedTasks = [];
        state.showBulkActions = false;
      });

    // Submissions
    builder
      .addCase(submitTask.fulfilled, (state, action) => {
        const submission = action.payload.data || action.payload;
        if (!state.taskSubmissions[submission.taskId]) {
          state.taskSubmissions[submission.taskId] = [];
        }
        state.taskSubmissions[submission.taskId].push(submission);
        // Update task status
        const taskIndex = state.tasks.findIndex(t => t.id === submission.taskId);
        if (taskIndex > -1) {
          state.tasks[taskIndex].status = "under-review";
        }
      })
      .addCase(reviewSubmission.fulfilled, (state, action) => {
        const submission = action.payload.data || action.payload;
        const submissions = state.taskSubmissions[submission.taskId] || [];
        const index = submissions.findIndex(s => s.id === submission.id);
        if (index > -1) {
          submissions[index] = submission;
        }
        // Update task status based on review
        const taskIndex = state.tasks.findIndex(t => t.id === submission.taskId);
        if (taskIndex > -1) {
          if (submission.status === "approved") {
            state.tasks[taskIndex].status = "completed";
          } else if (submission.status === "changes-requested" || submission.status === "rejected") {
            state.tasks[taskIndex].status = "in-progress";
          }
        }
      })
      .addCase(getTaskSubmissions.fulfilled, (state, action) => {
        state.taskSubmissions[action.payload.taskId] = action.payload.submissions;
      });

    // Comments
    builder
      .addCase(addTaskComment.fulfilled, (state, action) => {
        const { taskId, comment } = action.payload;
        if (!state.taskComments[taskId]) {
          state.taskComments[taskId] = [];
        }
        state.taskComments[taskId].push(comment.data || comment);
      })
      .addCase(getTaskComments.fulfilled, (state, action) => {
        state.taskComments[action.payload.taskId] = action.payload.comments;
      })
      .addCase(updateTaskComment.fulfilled, (state, action) => {
        const updatedComment = action.payload.data || action.payload;
        // Find and update comment in all task comments
        Object.keys(state.taskComments).forEach(taskId => {
          const index = state.taskComments[taskId].findIndex(c => c.id === updatedComment.id);
          if (index > -1) {
            state.taskComments[taskId][index] = updatedComment;
          }
        });
      })
      .addCase(deleteTaskComment.fulfilled, (state, action) => {
        const { taskId, commentId } = action.payload;
        if (state.taskComments[taskId]) {
          state.taskComments[taskId] = state.taskComments[taskId].filter(c => c.id !== commentId);
        }
      });

    // Time Tracking
    builder
      .addCase(startTimer.fulfilled, (state, action) => {
        state.activeTimer = action.payload.data || action.payload;
      })
      .addCase(stopTimer.fulfilled, (state, action) => {
        const tracking = action.payload.data || action.payload;
        if (state.activeTimer?.id === tracking.id) {
          state.activeTimer = null;
        }
        // Update time tracking for task
        if (!state.timeTracking[tracking.taskId]) {
          state.timeTracking[tracking.taskId] = [];
        }
        const index = state.timeTracking[tracking.taskId].findIndex(t => t.id === tracking.id);
        if (index > -1) {
          state.timeTracking[tracking.taskId][index] = tracking;
        } else {
          state.timeTracking[tracking.taskId].push(tracking);
        }
      })
      .addCase(stopActiveTimer.fulfilled, (state, action) => {
        state.activeTimer = null;
      })
      .addCase(getTaskTimeTracking.fulfilled, (state, action) => {
        state.timeTracking[action.payload.taskId] = action.payload.timeTracking;
      })
      .addCase(getUserTimeTracking.fulfilled, (state, action) => {
        state.userTimeTracking = action.payload.data || [];
        state.activeTimer = action.payload.activeTimer || null;
      });

    // Analytics
    builder
      .addCase(getCollaborationStats.pending, (state) => {
        state.analyticsLoading = true;
      })
      .addCase(getCollaborationStats.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.collaborationStats = action.payload.data || action.payload;
      })
      .addCase(getCollaborationStats.rejected, (state) => {
        state.analyticsLoading = false;
      })
      .addCase(getDeveloperPerformanceStats.pending, (state) => {
        state.analyticsLoading = true;
      })
      .addCase(getDeveloperPerformanceStats.fulfilled, (state, action) => {
        state.analyticsLoading = false;
        state.performanceStats = action.payload.data || action.payload;
      })
      .addCase(getDeveloperPerformanceStats.rejected, (state) => {
        state.analyticsLoading = false;
      });
  },
});

export const {
  clearTasks,
  setSelectedTasks,
  toggleTaskSelection,
  clearSelectedTasks,
  setActiveTimer,
  clearActiveTimer,
} = taskSlice.actions;

export default taskSlice.reducer;

