import React, { useState, useEffect, useMemo } from "react";
import Button from '../../../components/Button';
import {
  Bell,
  MessageSquare,
  Star,
  TrendingUp,
  Code,
  Users,
  Target,
  Award,
  Zap,
  ChevronRight,
  Github,
  Linkedin,
  Database,
  Clock,
  BookOpen,
  Activity,
  CheckCircle,
  AlertCircle,
  Eye,
  Briefcase,
  TrendingDown,
  MessageCircle,
  CheckCircle2,
  Timer,
  Trophy,
  Flame,
  Brain,
  Rocket,
  ThumbsUp,
  CheckSquare,
  FileText,
  GitBranch,
  Upload,
  XCircle,
  Edit,
  Filter,
  Search,
  Calendar,
  Send,
  Link as LinkIcon,
  BarChart3,
  Play,
  Pause,
  CheckCircle2 as CheckCircleIcon,
} from "lucide-react";
import { Layout, CircularLoader } from "../../../components";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  getDeveloperStats, 
  getDeveloperAchievements,
} from "../../gamification/slice/gamificationSlice";
import { 
  getDeveloperAppliedProjects,
  getProjectRecommendations,
  getMyInvites,
  respondInvite,
  getDeveloperTasks
} from "../../project/slice/projectSlice";
import {
  startTask,
  submitTask,
  startTimer,
  stopTimer,
  stopActiveTimer,
  getUserTimeTracking,
  getDeveloperPerformanceStats,
  addTaskComment,
  getTaskComments,
} from "../slice/taskSlice";
import { 
  getSyncStatus,
  getIntegrations 
} from "../../portfolioSync/slice/portfolioSyncSlice";
import { 
  getNotifications,
  getUnreadCount,
  markAsRead
} from "../../notifications/slice/notificationSlice";
import { analyzeSkillGap } from "../../aicareer/slice/aiCareerSlice";
import { toast } from "react-toastify";
import MyTasksTab from "./MyTasksTab";
import RepositoryAccess from "./RepositoryAccess";

export default function DeveloperView() {
  const [activeTab, setActiveTab] = useState("overview");
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  // Redux selectors
  const developerStats = useSelector((state) => state.gamification?.stats);
  const statsLoading = useSelector((state) => state.gamification?.statsLoading);
  const achievements = useSelector((state) => state.gamification?.achievements || []);
  const achievementsLoading = useSelector((state) => state.gamification?.achievementsLoading);
  
  const appliedProjectsData = useSelector((state) => state.project?.myApplications || []);
  const appliedProjectsLoading = useSelector((state) => state.project?.loading);
  
  const developerTasks = useSelector((state) => state.project?.developerTasks || []);
  const developerTasksLoading = useSelector((state) => state.project?.developerTasksLoading);
  
  // Task-related Redux selectors
  const activeTimer = useSelector((state) => state.task?.activeTimer);
  const userTimeTracking = useSelector((state) => state.task?.userTimeTracking || []);
  const performanceStats = useSelector((state) => state.task?.performanceStats);
  const taskComments = useSelector((state) => state.task?.taskComments || {});
  
  const recommendations = useSelector((state) => state.project?.recommendations || []);
  const recommendationsLoading = useSelector((state) => state.project?.recommendationsLoading);
  
  const myInvites = useSelector((state) => state.project?.myInvites || []);
  const invitesLoading = useSelector((state) => state.project?.invitesLoading);
  
  const syncStatus = useSelector((state) => state.portfolioSync?.syncStatus);
  const integrations = useSelector((state) => state.portfolioSync?.integrations || []);
  const portfolioSyncLoading = useSelector((state) => state.portfolioSync?.loading);
  
  const notifications = useSelector((state) => state.notifications?.notifications || []);
  const notificationsLoading = useSelector((state) => state.notifications?.loading);
  const unreadCount = useSelector((state) => state.notifications?.unreadCount || 0);
  
  const skillGapsData = useSelector((state) => state.aiCareer?.skillGaps || []);
  const skillGapsLoading = useSelector((state) => state.aiCareer?.skillGapsLoading || false);

  // Fetch all data on component mount
  useEffect(() => {
    // Fetch developer stats
    dispatch(getDeveloperStats());
    
    // Fetch achievements
    dispatch(getDeveloperAchievements());
    
    // Fetch applied projects
    dispatch(getDeveloperAppliedProjects());
    
    // Fetch developer tasks (no limit to show all assigned tasks)
    dispatch(getDeveloperTasks());
    
    // Fetch user time tracking
    dispatch(getUserTimeTracking());
    
    // Fetch performance stats
    dispatch(getDeveloperPerformanceStats());
    
    // Fetch project recommendations
    dispatch(getProjectRecommendations(10));
    
    // Fetch invitations
    dispatch(getMyInvites());
    
    // Fetch portfolio sync status
    dispatch(getSyncStatus());
    dispatch(getIntegrations());
    
    // Fetch notifications
    dispatch(getNotifications({ limit: 6, offset: 0 }));
    dispatch(getUnreadCount());
    
    // Fetch skill gaps for skill gap analysis
    dispatch(analyzeSkillGap());
  }, [dispatch]);

  // Refresh developer tasks when switching to My Tasks tab
  useEffect(() => {
    if (activeTab === "collaboration") {
      dispatch(getDeveloperTasks());
    }
  }, [activeTab, dispatch]);

  // Fetch comments for all tasks when tasks are loaded and tab is active
  useEffect(() => {
    if (activeTab === "collaboration" && developerTasks && developerTasks.length > 0) {
      // Get all task IDs that need comments
      const taskIds = developerTasks
        .map(task => task.id)
        .filter(id => id != null);
      
      // Fetch comments for tasks that don't have them loaded yet
      taskIds.forEach((taskId) => {
        const existingComments = taskComments[taskId];
        if (!existingComments || !Array.isArray(existingComments)) {
          dispatch(getTaskComments(taskId));
        }
      });
    }
  }, [activeTab, developerTasks?.length, dispatch]); // Use length to avoid re-fetching on every task change

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      dispatch(getDeveloperStats());
      dispatch(getDeveloperTasks());
      dispatch(getNotifications({ limit: 6, offset: 0 }));
      dispatch(getUnreadCount());
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(refreshInterval);
  }, [dispatch]);

  // Handler for responding to invites
  const handleRespondInvite = async (inviteId, status) => {
    try {
      await dispatch(respondInvite({ inviteId, status })).unwrap();
      toast.success(`Invitation ${status === 'accepted' ? 'accepted' : 'declined'} successfully`);
      // Refresh invites
      dispatch(getMyInvites());
    } catch (error) {
      toast.error(error?.message || `Failed to ${status} invitation`);
    }
  };

  // Transform developerTasks to assignedTasks format
  const assignedTasks = useMemo(() => {
    if (!developerTasks || developerTasks.length === 0) {
      return [];
    }
    return developerTasks.map(task => {
      // Ensure status is mapped correctly (API returns "assigned" but might also return "todo")
      let status = task.status || "assigned";
      if (status === "todo") {
        status = "assigned";
      }
      
      return {
        id: task.id,
        title: task.title,
        description: task.description || "",
        projectName: task.projectName || task.project || "Unknown Project",
        projectId: task.projectId,
        priority: task.priority || "medium",
        status: status,
        dueDate: task.dueDate,
        estimatedHours: task.estimatedHours || 0,
        repositoryUrl: task.repositoryUrl || null,
        createdAt: task.createdAt,
        completedAt: task.completedAt,
        timeTracked: task.timeTracked || 0,
        activeTimer: task.activeTimer,
        submissions: task.submissions || [],
        commentsCount: task.commentsCount || 0,
      };
    });
  }, [developerTasks]);

  // Task handlers
  const handleTaskStart = async (task) => {
    try {
      await dispatch(startTask(task.id)).unwrap();
      dispatch(getDeveloperTasks()); // Refresh tasks
    } catch (error) {
      toast.error(error?.message || "Failed to start task");
    }
  };

  const handleTaskSubmit = async (task, submissionData) => {
    try {
      await dispatch(submitTask({ taskId: task.id, data: submissionData })).unwrap();
      dispatch(getDeveloperTasks()); // Refresh tasks
      toast.success("Work submitted successfully");
    } catch (error) {
      toast.error(error?.message || "Failed to submit work");
    }
  };

  const handleStartTimer = async (taskId, description = "") => {
    try {
      await dispatch(startTimer({ taskId, data: { description } })).unwrap();
      dispatch(getUserTimeTracking()); // Refresh time tracking
    } catch (error) {
      toast.error(error?.message || "Failed to start timer");
    }
  };

  const handleStopTimer = async (taskId) => {
    try {
      await dispatch(stopTimer(taskId)).unwrap();
      dispatch(getUserTimeTracking()); // Refresh time tracking
    } catch (error) {
      toast.error(error?.message || "Failed to stop timer");
    }
  };

  const handleStopActiveTimer = async () => {
    try {
      await dispatch(stopActiveTimer()).unwrap();
      dispatch(getUserTimeTracking()); // Refresh time tracking
    } catch (error) {
      toast.error(error?.message || "Failed to stop timer");
    }
  };

  const handleAddComment = async (taskId, comment) => {
    try {
      await dispatch(addTaskComment({ taskId, data: { comment } })).unwrap();
      dispatch(getTaskComments(taskId)); // Refresh comments
    } catch (error) {
      toast.error(error?.message || "Failed to add comment");
    }
  };

  // Transform API data to match UI structure
  const userStats = useMemo(() => {
    if (!developerStats) {
      return {
        xp: 0,
        level: 1,
        badges: 0,
        projects: 0,
        rating: 0,
        matches: recommendations?.length || 0,
        streak: 0,
        weeklyGoal: 0,
        totalEarnings: "$0",
        responseRate: 0,
      };
    }
    return {
      xp: developerStats.xp || 0,
      level: developerStats.level || 1,
      badges: developerStats.badges || 0,
      projects: developerStats.completedProjects || 0,
      rating: developerStats.averageRating || 0,
      matches: recommendations?.length || 0,
      streak: developerStats.streak || 0,
      weeklyGoal: 85, // This can be calculated or stored separately
      totalEarnings: "$0", // This would come from a different API
      responseRate: 94, // This would come from a different API
    };
  }, [developerStats, recommendations]);

  // Map achievement icons
  const achievementIconMap = {
    "Star": Star,
    "Flame": Flame,
    "Target": Target,
    "Zap": Zap,
    "Award": Award,
    "ThumbsUp": ThumbsUp,
    "Code": Code,
    "Users": Users,
    "Brain": Brain,
    "Rocket": Rocket,
  };

  const gamificationStats = useMemo(() => {
    const stats = developerStats || {};
    const transformedAchievements = (achievements || []).slice(0, 5).map((ach) => {
      const IconComponent = achievementIconMap[ach.icon] || Award;
      return {
        name: ach.name,
        icon: IconComponent,
        earned: ach.unlocked || false,
        date: ach.unlocked ? new Date().toISOString().split('T')[0] : undefined,
        progress: ach.unlocked ? 100 : (ach.progress || 0),
      };
    });
    
    // Calculate weekly goal based on weekly XP
    const weeklyXP = stats.weeklyXP || 0;
    const weeklyGoalTarget = 100; // Target XP per week
    const weeklyGoal = Math.min(100, Math.round((weeklyXP / weeklyGoalTarget) * 100));
    
    // Calculate monthly goal based on monthly XP
    const monthlyXP = stats.monthlyXP || (stats.totalXP || 0);
    const monthlyGoalTarget = 400; // Target XP per month
    const monthlyGoal = Math.min(100, Math.round((monthlyXP / monthlyGoalTarget) * 100));
    
    // Get longest streak from stats (if available) or use current streak
    const longestStreak = stats.longestStreak || stats.streak || 0;
    
    return {
      currentStreak: stats.streak || 0,
      longestStreak: longestStreak,
      weeklyGoal: weeklyGoal,
      monthlyGoal: monthlyGoal,
      achievements: transformedAchievements.length > 0 
        ? transformedAchievements 
        : [
            { name: "Code Master", icon: Code, earned: false, progress: 0 },
            { name: "Team Player", icon: Users, earned: false, progress: 0 },
            { name: "Speed Demon", icon: Zap, earned: false, progress: 0 },
            { name: "Problem Solver", icon: Brain, earned: false, progress: 0 },
            { name: "Innovation Leader", icon: Rocket, earned: false, progress: 0 },
          ],
    };
  }, [developerStats, achievements]);

  // Transform applied projects data
  const recentProjects = useMemo(() => {
    if (!appliedProjectsData || appliedProjectsData.length === 0) {
      return [];
    }
    
    // appliedProjectsData is an array of application objects from myApplications
    // Each object has: { projectId, status, project: { ... }, ... }
    const applications = Array.isArray(appliedProjectsData) 
      ? appliedProjectsData 
      : [];
    
    return applications.slice(0, 3).map((app) => {
      // app.project contains the full project data
      const project = app.project || {};
      const skills = project.skills 
        ? (Array.isArray(project.skills) ? project.skills : Object.keys(project.skills))
        : [];
      
      // Format payment
      const budgetMin = project.budgetMin || 0;
      const budgetMax = project.budgetMax || 0;
      const currency = project.currency || "$";
      const payment = budgetMin && budgetMax 
        ? `${currency}${budgetMin.toLocaleString()}-${currency}${budgetMax.toLocaleString()}`
        : budgetMin 
        ? `${currency}${budgetMin.toLocaleString()}`
        : "Unpaid";
      
      // Map status
      const statusMap = {
        'active': 'Active',
        'in_progress': 'In Progress',
        'completed': 'Completed',
        'pending': 'Under Review',
        'accepted': 'In Progress',
        'rejected': 'Under Review',
      };
      
      // Calculate progress from task completion if available
      const projectTasks = developerTasks.filter(t => t.projectId === (project.id || app.projectId));
      const completedTasks = projectTasks.filter(t => t.status === 'completed' || t.status === 'done').length;
      const totalTasks = projectTasks.length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : (project.progress || 0);
      
      // Calculate time spent from time tracking
      const projectTimeTracking = userTimeTracking.filter(t => 
        t.projectId === (project.id || app.projectId) || 
        (t.task && projectTasks.some(pt => pt.id === t.task.id))
      );
      const totalTimeMs = projectTimeTracking.reduce((sum, tracking) => {
        if (tracking.duration) return sum + tracking.duration;
        if (tracking.startTime && tracking.endTime) {
          return sum + (new Date(tracking.endTime) - new Date(tracking.startTime));
        }
        return sum;
      }, 0);
      const totalHours = Math.floor(totalTimeMs / (1000 * 60 * 60));
      const timeSpent = totalHours > 0 ? `${totalHours}h` : "0h";
      
      return {
        id: project.id || app.projectId,
        title: project.title || 'Untitled Project',
        company: project.company || project.ownerName || 'Unknown',
        status: statusMap[project.status?.toLowerCase()] || statusMap[app.status?.toLowerCase()] || 'Active',
        progress: progress,
        payment,
        deadline: project.deadline || project.endDate || 'N/A',
        skills: skills.slice(0, 3),
        priority: project.priority || 'medium',
        timeSpent: timeSpent,
        estimatedTime: project.duration || "N/A",
        applicationStatus: app.status || 'pending',
        repositoryUrl: project.repositoryUrl || project.repository_url || null,
      };
    });
  }, [appliedProjectsData, developerTasks, userTimeTracking]);

  // Transform developer tasks
  const activeTasks = useMemo(() => {
    if (!developerTasks || developerTasks.length === 0) {
      return [];
    }
    
    return developerTasks.slice(0, 3).map((task) => ({
      id: task.id,
      title: task.title,
      project: task.project || "Unknown Project",
      priority: task.priority || "medium",
      dueDate: task.dueDate || "N/A",
      estimatedTime: task.estimatedTime || "N/A",
      status: task.status === "todo" ? "pending" : task.status || "pending",
    }));
  }, [developerTasks]);

  // Transform project recommendations
  const matchedProjects = useMemo(() => {
    if (!recommendations || recommendations.length === 0) {
      return [];
    }
    
    const recs = Array.isArray(recommendations) 
      ? recommendations 
      : (recommendations.recommendations || recommendations.data || []);
    
    return recs.slice(0, 3).map((project) => {
      const skills = project.skills 
        ? (Array.isArray(project.skills) ? project.skills : Object.keys(project.skills))
        : [];
      
      // Format payment
      const budgetMin = project.budgetMin || 0;
      const budgetMax = project.budgetMax || 0;
      const currency = project.currency || "$";
      const payment = budgetMin && budgetMax 
        ? `${currency}${budgetMin.toLocaleString()}-${currency}${budgetMax.toLocaleString()}`
        : budgetMin 
        ? `${currency}${budgetMin.toLocaleString()}`
        : "Unpaid";
      
      // Calculate time ago
      const postedDate = project.createdAt ? new Date(project.createdAt) : new Date();
      const hoursAgo = Math.floor((new Date() - postedDate) / (1000 * 60 * 60));
      const posted = hoursAgo < 1 
        ? "Just now" 
        : hoursAgo < 24 
        ? `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`
        : `${Math.floor(hoursAgo / 24)} ${Math.floor(hoursAgo / 24) === 1 ? 'day' : 'days'} ago`;
      
      return {
        id: project.id,
        title: project.title || 'Untitled Project',
        company: project.company || project.ownerName || 'Unknown',
        match: project.matchScore || project.match || 0,
        payment,
        duration: project.duration || "N/A",
        skills: skills.slice(0, 3),
        posted,
        urgency: project.priority || project.urgency || 'medium',
        type: project.type || 'contract',
        location: project.isRemote ? 'Remote' : (project.location || 'N/A'),
        description: project.description || '',
      };
    });
  }, [recommendations]);

  // Transform invitations
  const invitations = useMemo(() => {
    if (!myInvites || myInvites.length === 0) {
      return [];
    }
    
    const invites = Array.isArray(myInvites) 
      ? myInvites 
      : (myInvites.invites || myInvites.data || []);
    
    return invites.slice(0, 3).map((invite) => {
      // Calculate time ago
      const sentDate = invite.createdAt || invite.sentAt || invite.invitedAt;
      const date = sentDate ? new Date(sentDate) : new Date();
      const hoursAgo = Math.floor((new Date() - date) / (1000 * 60 * 60));
      const sent = hoursAgo < 1 
        ? "Just now" 
        : hoursAgo < 24 
        ? `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`
        : `${Math.floor(hoursAgo / 24)} ${Math.floor(hoursAgo / 24) === 1 ? 'day' : 'days'} ago`;
      
      return {
        id: invite.id,
        projectId: invite.projectId,
        from: invite.projectOwnerName || invite.inviterName || invite.from || 'Unknown',
        project: invite.projectTitle || invite.projectName || invite.project?.title || 'Project',
        message: invite.message || invite.inviteMessage || "You've been invited to join this project!",
        sent,
        status: invite.status || invite.responseStatus || 'pending',
        priority: invite.priority || 'medium',
      };
    });
  }, [myInvites]);

  // Transform skill gaps from API data
  const skillGaps = useMemo(() => {
    if (!skillGapsData || skillGapsData.length === 0) {
      return [];
    }
    
    return skillGapsData.slice(0, 4).map((gap) => {
      // Map gapLevel to trend
      const trendMap = {
        'High': 'high',
        'Medium': 'medium',
        'Low': 'low',
        'high': 'high',
        'medium': 'medium',
        'low': 'low',
      };
      
      return {
        skill: gap.skill || 'Unknown Skill',
        gap: gap.progress || 0, // Use progress as gap percentage
        trend: trendMap[gap.gapLevel] || 'medium',
      };
    });
  }, [skillGapsData]);

  // Transform notifications
  const recentNotifications = useMemo(() => {
    if (!notifications || notifications.length === 0) {
      return [];
    }
    
    const notifs = Array.isArray(notifications) ? notifications : [];
    
    return notifs.slice(0, 6).map((notif) => {
      // Calculate time ago
      const createdAt = notif.createdAt ? new Date(notif.createdAt) : new Date();
      const hoursAgo = Math.floor((new Date() - createdAt) / (1000 * 60 * 60));
      const time = hoursAgo < 1 
        ? "Just now" 
        : hoursAgo < 24 
        ? `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`
        : `${Math.floor(hoursAgo / 24)} ${Math.floor(hoursAgo / 24) === 1 ? 'day' : 'days'} ago`;
      
      // Map action based on type
      const actionMap = {
        'Project Match': 'View Project',
        'Application Update': 'View Application',
        'Invitation': 'View Invitation',
        'Task Deadline': 'View Task',
        'Chat Message': 'View Messages',
        'Career Opportunity': 'Explore Opportunity',
        'match': 'View Project',
        'invitation': 'View Invitation',
        'message': 'View Messages',
        'task_reminder': 'View Task',
        'deadline': 'View Task',
        'application': 'View Application',
      };
      
      // Parse metadata if it's a string
      let metadata = null;
      if (notif.metadata) {
        try {
          metadata = typeof notif.metadata === 'string' 
            ? JSON.parse(notif.metadata) 
            : notif.metadata;
        } catch (e) {
          console.error('Error parsing notification metadata:', e);
        }
      }
      
      return {
        id: notif.id,
        type: notif.type || 'info',
        title: notif.title || 'Notification',
        message: notif.message || notif.body || '',
        time,
        unread: !notif.read,
        priority: notif.priority || 'medium',
        action: notif.action || actionMap[notif.type] || 'View',
        actionUrl: notif.actionUrl || null,
        metadata: metadata,
        relatedEntityId: notif.relatedEntityId || null,
        relatedEntityType: notif.relatedEntityType || null,
      };
    });
  }, [notifications]);

  // Handle notification click - navigate to appropriate page
  const handleNotificationClick = (notification) => {
    // Mark as read if unread
    if (notification.unread) {
      dispatch(markAsRead(notification.id));
    }

    // Use actionUrl if available
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      return;
    }

    // Otherwise, construct URL based on notification type and metadata
    const type = notification.type;
    const metadata = notification.metadata || {};
    const relatedEntityId = notification.relatedEntityId;

    // Map notification types to routes
    // Chat messages → Chat page
    if (type === 'Chat Message' || type === 'message' || notification.title?.includes('Message')) {
      navigate('/chat');
    } 
    // Task deadlines → Project page (tasks are project-related)
    else if (type === 'Task Deadline' || type === 'task_reminder' || type === 'deadline' || notification.title?.includes('Deadline')) {
      navigate('/project');
    } 
    // Application updates → Project applications tab
    else if (type === 'Application Update' || type === 'application' || notification.title?.includes('Application')) {
      navigate('/project?tab=applications');
    } 
    // Invitations → Dashboard (invitations section)
    else if (type === 'Invitation' || type === 'invitation' || notification.title?.includes('Invited')) {
      navigate('/dashboard');
    } 
    // Project matches and career opportunities → Project discover tab
    else if (type === 'Project Match' || type === 'match' || type === 'Career Opportunity' || 
             notification.title?.includes('Project Match') || notification.title?.includes('Opportunity')) {
      navigate('/project?tab=discover');
    } 
    // Default → Project page
    else {
      navigate('/project');
    }
  };

  // Transform portfolio sync data
  const portfolioSync = useMemo(() => {
    const defaultSync = {
      github: { status: "not_connected", score: 0, lastSync: "Never", commits: 0, repos: 0 },
      linkedin: { status: "not_connected", score: 0, lastSync: "Never", connections: 0, endorsements: 0 },
      stackoverflow: { status: "not_connected", score: 0, lastSync: "Never", reputation: 0, answers: 0 },
      behance: { status: "not_connected", score: 0, lastSync: "Never", projects: 0, views: 0 },
    };
    
    if (!integrations || integrations.length === 0) {
      return defaultSync;
    }
    
    const ints = Array.isArray(integrations) ? integrations : (integrations.data || []);
    
    ints.forEach((integration) => {
      const platform = integration.platform?.toLowerCase();
      const lastSync = integration.lastSync 
        ? (() => {
            const date = new Date(integration.lastSync);
            const hoursAgo = Math.floor((new Date() - date) / (1000 * 60 * 60));
            if (hoursAgo < 24) return `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
            if (hoursAgo < 168) return `${Math.floor(hoursAgo / 24)} ${Math.floor(hoursAgo / 24) === 1 ? 'day' : 'days'} ago`;
            return `${Math.floor(hoursAgo / 168)} ${Math.floor(hoursAgo / 168) === 1 ? 'week' : 'weeks'} ago`;
          })()
        : "Never";
      
      if (platform === 'github') {
        defaultSync.github = {
          status: "synced",
          score: integration.score || syncStatus?.overallScore || 0,
          lastSync,
          commits: integration.commits || 0,
          repos: integration.repos || 0,
        };
      } else if (platform === 'linkedin') {
        defaultSync.linkedin = {
          status: "synced",
          score: integration.score || 0,
          lastSync,
          connections: integration.connections || 0,
          endorsements: integration.endorsements || 0,
        };
      } else if (platform === 'stackoverflow') {
        defaultSync.stackoverflow = {
          status: integration.status || "pending",
          score: integration.score || 0,
          lastSync,
          reputation: integration.reputation || 0,
          answers: integration.answers || 0,
        };
      }
    });
    
    return defaultSync;
  }, [integrations, syncStatus]);

  const quickAccessLinks = [
    { name: "AI Career Tools", icon: Brain, color: "blue", description: "AI-powered career guidance", path: "/ai-career" },
    { name: "Portfolio Sync", icon: Database, color: "purple", description: "Sync your profiles", path: "/portfolio-sync" },
    { name: "Communication", icon: MessageCircle, color: "green", description: "Chat with teams", path: "/chat" },
    { name: "Learning Paths", icon: BookOpen, color: "yellow", description: "Skill development", path: "/ai-career" },
    { name: "Gamification", icon: Trophy, color: "orange", description: "Track achievements", path: "/gamification" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-500";
      case "Under Review":
        return "bg-yellow-500";
      case "Active":
        return "bg-green-500";
      case "Completed":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMatchColor = (match) => {
    if (match >= 90) return "text-green-400";
    if (match >= 80) return "text-blue-400";
    if (match >= 70) return "text-yellow-400";
    return "text-gray-400";
  };

  return (
    <Layout isSearchBar={true}>
        {/* Tab Navigation */}
        <div className='mb-6 border-b border-white/10'>
          <div className='flex space-x-8'>
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-4 px-1 border-b-2 transition-colors ${
                activeTab === "overview"
                  ? "border-blue-400 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              <div className='flex items-center gap-2'>
                <BarChart3 className='w-5 h-5' />
                <span className='font-medium'>Overview</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("collaboration")}
              className={`pb-4 px-1 border-b-2 transition-colors ${
                activeTab === "collaboration"
                  ? "border-blue-400 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              <div className='flex items-center gap-2'>
                <CheckSquare className='w-5 h-5' />
                <span className='font-medium'>My Tasks</span>
                {assignedTasks.filter(t => t.status === "assigned" || t.status === "in-progress").length > 0 && (
                  <span className='ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full'>
                    {assignedTasks.filter(t => t.status === "assigned" || t.status === "in-progress").length}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Overview Tab Content */}
        {activeTab === "overview" && (
          <>
        {/* Enhanced Welcome Section */}
        <div className='mb-8'>
          <div className="flex items-center justify-between">
            <div>
              <h1 className='text-3xl font-bold mb-2'>Welcome back, {user?.name || 'Developer'}! 👋</h1>
              <p className='text-gray-300'>
                Here's what's happening with your projects and opportunities today.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Current Streak</p>
                <p className="text-2xl font-bold text-orange-400 flex items-center gap-2">
                  <Flame className="w-6 h-6" />
                  {gamificationStats.currentStreak} days
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Weekly Goal</p>
                <p className="text-2xl font-bold text-green-400 flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  {gamificationStats.weeklyGoal}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8'>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>XP Points</p>
                <p className='text-2xl font-bold text-blue-400'>
                  {userStats.xp.toLocaleString()}
                </p>
                <p className='text-xs text-gray-500'>
                  {developerStats?.weeklyXP ? `+${developerStats.weeklyXP} this week` : 'Track your progress'}
                </p>
              </div>
              <Zap className='w-8 h-8 text-blue-400 group-hover:animate-pulse' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Level</p>
                <p className='text-2xl font-bold text-purple-400'>
                  {userStats.level}
                </p>
                <p className='text-xs text-gray-500'>
                  {developerStats?.xpToNextLevel ? `${developerStats.xpToNextLevel} XP to next` : 'Level up!'}
                </p>
              </div>
              <Award className='w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Badges</p>
                <p className='text-2xl font-bold text-yellow-400'>
                  {userStats.badges}
                </p>
                <p className='text-xs text-gray-500'>
                  {developerStats?.monthlyBadges ? `${developerStats.monthlyBadges} new this month` : 'Earn badges'}
                </p>
              </div>
              <Star className='w-8 h-8 text-yellow-400 group-hover:animate-spin' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Active Projects</p>
                <p className='text-2xl font-bold text-green-400'>
                  {userStats.projects}
                </p>
                <p className='text-xs text-gray-500'>
                  {recentProjects.filter(p => p.status === 'In Progress').length} in progress
                </p>
              </div>
              <Briefcase className='w-8 h-8 text-green-400 group-hover:scale-110 transition-transform' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Rating</p>
                <p className='text-2xl font-bold text-orange-400'>
                  {userStats.rating}
                </p>
                <p className='text-xs text-gray-500'>Based on {developerStats?.totalRatings || 0} reviews</p>
              </div>
              <Star className='w-8 h-8 text-orange-400 fill-current group-hover:animate-pulse' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>New Matches</p>
                <p className='text-2xl font-bold text-pink-400'>
                  {userStats.matches}
                </p>
                <p className='text-xs text-gray-500'>This week</p>
              </div>
              <Target className='w-8 h-8 text-pink-400 group-hover:scale-110 transition-transform' />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Left Column - Main Content */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Active Tasks */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <CheckCircle2 className='w-6 h-6 text-green-400' />
                  Active Tasks
                </h2>
                <Button 
                  onClick={() => navigate('/project')}
                  variant="ghost"
                  className='text-blue-400 hover:text-blue-300 text-sm flex items-center'
                >
                  View All <ChevronRight className='w-4 h-4 ml-1' />
                </Button>
              </div>
              <div className='space-y-3'>
                {developerTasksLoading ? (
                  <div className="flex justify-center py-4">
                    <CircularLoader />
                  </div>
                ) : activeTasks.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No active tasks found</p>
                ) : (
                  activeTasks.map((task) => (
                  <div
                    key={task.id}
                    className='bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all'
                  >
                    <div className='flex items-start justify-between mb-2'>
                      <div className='flex-1'>
                        <h3 className='font-semibold mb-1'>{task.title}</h3>
                        <p className='text-gray-400 text-sm'>{task.project}</p>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className={`px-2 py-1 rounded text-xs ${
                          task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {task.priority}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          task.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                          task.status === 'review' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {task.status === 'todo' ? 'pending' : task.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className='flex items-center justify-between text-sm text-gray-400'>
                      <div className='flex items-center gap-4'>
                        <span className='flex items-center gap-1'>
                          <Clock className='w-4 h-4' />
                          {task.dueDate && task.dueDate !== 'N/A' ? `Due: ${task.dueDate}` : 'No due date'}
                        </span>
                        <span className='flex items-center gap-1'>
                          <Timer className='w-4 h-4' />
                          {task.estimatedTime}
                        </span>
                      </div>
                      <Button 
                        onClick={() => navigate(`/project/${task.projectId}`)}
                        className='px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm transition-colors'
                      >
                        {task.status === 'in_progress' ? 'Continue' : task.status === 'review' ? 'Review' : 'Start'}
                      </Button>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>

            {/* Project Invitations */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <MessageSquare className='w-6 h-6 text-blue-400' />
                  Project Invitations
                </h2>
                <Button 
                  onClick={() => navigate('/notifications')}
                  variant="ghost"
                  className='text-blue-400 hover:text-blue-300 text-sm flex items-center'
                >
                  View All <ChevronRight className='w-4 h-4 ml-1' />
                </Button>
              </div>
              <div className='space-y-3'>
                {invitesLoading ? (
                  <div className="flex justify-center py-4">
                    <CircularLoader />
                  </div>
                ) : invitations.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No invitations found</p>
                ) : (
                  invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className={`bg-white/5 border rounded-lg p-4 hover:border-white/20 transition-all ${
                      invitation.status === 'pending' ? 'border-blue-500/30 bg-blue-500/5' : 'border-white/10'
                    }`}
                  >
                    <div className='flex items-start justify-between mb-2'>
                      <div className='flex-1'>
                        <h3 className='font-semibold mb-1'>{invitation.project}</h3>
                        <p className='text-gray-400 text-sm'>{invitation.from}</p>
                        <p className='text-gray-300 text-sm mt-1'>{invitation.message}</p>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className={`px-2 py-1 rounded text-xs ${
                          invitation.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          invitation.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {invitation.priority}
                        </span>
                        {invitation.status === 'pending' && (
                          <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
                        )}
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-gray-400 text-sm'>{invitation.sent}</span>
                      <div className='flex gap-2'>
                        <Button 
                          onClick={() => handleRespondInvite(invitation.id, 'accepted')}
                          className='px-3 py-1 bg-green-500 hover:bg-green-600 rounded text-sm transition-colors'
                          disabled={invitation.status !== 'pending'}
                        >
                          Accept
                        </Button>
                        <Button 
                          onClick={() => handleRespondInvite(invitation.id, 'declined')}
                          className='px-3 py-1 bg-gray-500 hover:bg-gray-600 rounded text-sm transition-colors'
                          disabled={invitation.status !== 'pending'}
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Projects */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold'>Recent Projects</h2>
                <Button 
                  variant="ghost"
                  className='text-blue-400 hover:text-blue-300 text-sm flex items-center'
                >
                  View All <ChevronRight className='w-4 h-4 ml-1' />
                </Button>
              </div>
              <div className='space-y-4'>
                {appliedProjectsLoading ? (
                  <div className="flex justify-center py-4">
                    <CircularLoader />
                  </div>
                ) : recentProjects.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No projects found</p>
                ) : (
                  recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className='bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all'
                  >
                    <div className='flex items-start justify-between mb-3'>
                      <div>
                        <h3 className='font-semibold mb-1'>{project.title}</h3>
                        <p className='text-gray-400 text-sm'>
                          {project.company}
                        </p>
                        <div className='flex items-center gap-2 mt-1'>
                          <span className={`px-2 py-1 rounded text-xs ${
                            project.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            project.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {project.priority}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            project.applicationStatus === 'accepted' ? 'bg-green-500/20 text-green-400' :
                            project.applicationStatus === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {project.applicationStatus.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <span
                          className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(project.status)}`}
                        >
                          {project.status}
                        </span>
                        <span className='text-green-400 font-medium'>
                          {project.payment}
                        </span>
                      </div>
                    </div>
                    <div className='mb-3'>
                      <div className='flex items-center justify-between text-sm text-gray-400 mb-1'>
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className='w-full bg-gray-700 rounded-full h-2'>
                        <div
                          className='bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300'
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='flex flex-wrap gap-1'>
                        {project.skills.map((skill, index) => (
                          <span
                            key={index}
                            className='px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs'
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className='flex items-center gap-4 text-gray-400 text-sm'>
                        <div className='flex items-center gap-1'>
                          <Clock className='w-4 h-4' />
                          {project.deadline}
                        </div>
                        <div className='flex items-center gap-1'>
                          <Timer className='w-4 h-4' />
                          {project.timeSpent}/{project.estimatedTime}
                        </div>
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>

            {/* Matched Projects */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold'>Matched Projects</h2>
                <Button 
                  variant="ghost"
                  className='text-blue-400 hover:text-blue-300 text-sm flex items-center'
                >
                  View All <ChevronRight className='w-4 h-4 ml-1' />
                </Button>
              </div>
              <div className='space-y-4'>
                {recommendationsLoading ? (
                  <div className="flex justify-center py-4">
                    <CircularLoader />
                  </div>
                ) : matchedProjects.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No project recommendations found</p>
                ) : (
                  matchedProjects.map((project) => (
                  <div
                    key={project.id}
                    className='bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all'
                  >
                    <div className='flex items-start justify-between mb-3'>
                      <div className='flex-1'>
                        <h3 className='font-semibold mb-1'>{project.title}</h3>
                        <p className='text-gray-400 text-sm mb-1'>
                          {project.company}
                        </p>
                        <p className='text-gray-300 text-xs mb-2'>
                          {project.description}
                        </p>
                        <div className='flex items-center gap-2'>
                          <span className={`px-2 py-1 rounded text-xs ${
                            project.urgency === 'high' ? 'bg-red-500/20 text-red-400' :
                            project.urgency === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {project.urgency}
                          </span>
                          <span className='px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs'>
                            {project.type}
                          </span>
                          <span className='px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs'>
                            {project.location}
                          </span>
                        </div>
                      </div>
                      <div className='text-right ml-4'>
                        <div
                          className={`text-lg font-bold ${getMatchColor(project.match)}`}
                        >
                          {project.match}% Match
                        </div>
                        <div className='text-green-400 font-medium'>
                          {project.payment}
                        </div>
                        <div className='text-gray-400 text-sm'>
                          {project.duration}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center justify-between mb-3'>
                      <div className='flex flex-wrap gap-1'>
                        {project.skills.map((skill, index) => (
                          <span
                            key={index}
                            className='px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs'
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className='text-gray-400 text-sm'>
                        {project.duration}
                      </div>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-gray-400 text-sm'>
                        Posted {project.posted}
                      </span>
                      <div className='flex space-x-2'>
                        <Button 
                          className='px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm transition-colors'
                        >
                          Apply
                        </Button>
                        <Button 
                          className='px-3 py-1 bg-white/10 hover:bg-gray-600/50 rounded text-sm transition-colors'
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className='space-y-6'>
            {/* Gamification Stats */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <Trophy className='w-5 h-5 text-yellow-400' />
                Gamification
              </h3>
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-400'>Current Streak</span>
                  <div className='flex items-center gap-2'>
                    <Flame className='w-4 h-4 text-orange-400' />
                    <span className='text-lg font-bold text-orange-400'>{gamificationStats.currentStreak} days</span>
                  </div>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-400'>Longest Streak</span>
                  <span className='text-lg font-bold text-purple-400'>{gamificationStats.longestStreak} days</span>
                </div>
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-400'>Weekly Goal</span>
                    <span className='text-sm text-green-400'>{gamificationStats.weeklyGoal}%</span>
                  </div>
                  <div className='w-full bg-gray-700 rounded-full h-2'>
                    <div
                      className='bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300'
                      style={{ width: `${gamificationStats.weeklyGoal}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <Award className='w-5 h-5 text-yellow-400' />
                Achievements
              </h3>
              <div className='space-y-3'>
                {gamificationStats.achievements.map((achievement, index) => (
                  <div key={index} className='flex items-center gap-3 p-2 rounded-lg bg-white/5'>
                    <div className={`p-2 rounded-lg ${
                      achievement.earned ? 'bg-yellow-500/20' : 'bg-gray-500/20'
                    }`}>
                      <achievement.icon className={`w-4 h-4 ${
                        achievement.earned ? 'text-yellow-400' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className='flex-1'>
                      <p className={`text-sm font-medium ${
                        achievement.earned ? 'text-white' : 'text-gray-400'
                      }`}>
                        {achievement.name}
                      </p>
                      {achievement.earned ? (
                        <p className='text-xs text-gray-400'>Earned {achievement.date}</p>
                      ) : (
                        <div className='flex items-center gap-2'>
                          <div className='w-full bg-gray-700 rounded-full h-1'>
                            <div
                              className='bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all duration-300'
                              style={{ width: `${achievement.progress}%` }}
                            ></div>
                          </div>
                          <span className='text-xs text-gray-400'>{achievement.progress}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Portfolio Sync */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <Database className='w-5 h-5 text-blue-400' />
                Portfolio Sync
              </h3>
              <div className='space-y-3'>
                <div className='flex items-center justify-between p-3 rounded-lg bg-white/5'>
                  <div className='flex items-center space-x-3'>
                    <Github className='w-5 h-5 text-gray-400' />
                    <div>
                      <span className='text-sm font-medium'>GitHub</span>
                      <p className='text-xs text-gray-400'>{portfolioSync.github.commits} commits, {portfolioSync.github.repos} repos</p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm text-green-400'>{portfolioSync.github.score}%</span>
                    <CheckCircle className='w-4 h-4 text-green-400' />
                  </div>
                </div>
                <div className='flex items-center justify-between p-3 rounded-lg bg-white/5'>
                  <div className='flex items-center space-x-3'>
                    <Linkedin className='w-5 h-5 text-gray-400' />
                    <div>
                      <span className='text-sm font-medium'>LinkedIn</span>
                      <p className='text-xs text-gray-400'>{portfolioSync.linkedin.connections} connections, {portfolioSync.linkedin.endorsements} endorsements</p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm text-green-400'>{portfolioSync.linkedin.score}%</span>
                    <CheckCircle className='w-4 h-4 text-green-400' />
                  </div>
                </div>
                <div className='flex items-center justify-between p-3 rounded-lg bg-white/5'>
                  <div className='flex items-center space-x-3'>
                    <Database className='w-5 h-5 text-gray-400' />
                    <div>
                      <span className='text-sm font-medium'>Stack Overflow</span>
                      <p className='text-xs text-gray-400'>{portfolioSync.stackoverflow.reputation} reputation, {portfolioSync.stackoverflow.answers} answers</p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm text-yellow-400'>{portfolioSync.stackoverflow.score}%</span>
                    <AlertCircle className='w-4 h-4 text-yellow-400' />
                  </div>
                </div>
                <div className='flex items-center justify-between p-3 rounded-lg bg-white/5'>
                  <div className='flex items-center space-x-3'>
                    <Eye className='w-5 h-5 text-gray-400' />
                    <div>
                      <span className='text-sm font-medium'>Behance</span>
                      <p className='text-xs text-gray-400'>{portfolioSync.behance.projects} projects, {portfolioSync.behance.views} views</p>
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span className='text-sm text-green-400'>{portfolioSync.behance.score}%</span>
                    <CheckCircle className='w-4 h-4 text-green-400' />
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/portfolio-sync')}
                className='w-full mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm transition-colors'
              >
                Sync All Platforms
              </Button>
            </div>

            {/* Skill Gap Analysis */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <h3 className='text-lg font-semibold mb-4'>Skill Gap Analysis</h3>
              <div className='space-y-3'>
                {skillGapsLoading ? (
                  <div className="flex justify-center py-4">
                    <CircularLoader />
                  </div>
                ) : skillGaps.length === 0 ? (
                  <p className="text-gray-400 text-center py-4 text-sm">No skill gaps identified yet</p>
                ) : (
                  skillGaps.map((item, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between'
                  >
                    <div className='flex items-center space-x-2'>
                      <span className='text-sm'>{item.skill}</span>
                      {item.trend === "high" && (
                        <TrendingUp className='w-4 h-4 text-green-400' />
                      )}
                      {item.trend === "medium" && (
                        <Activity className='w-4 h-4 text-yellow-400' />
                      )}
                      {item.trend === "low" && (
                        <TrendingDown className='w-4 h-4 text-red-400' />
                      )}
                    </div>
                    <span className='text-sm text-red-400'>
                      {item.gap}% gap
                    </span>
                  </div>
                )))}
              </div>
              <Button 
                onClick={() => navigate('/ai-career')}
                className='w-full mt-4 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-sm transition-colors'
              >
                View Learning Paths
              </Button>
            </div>

            {/* Enhanced Notifications */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <Bell className='w-5 h-5 text-blue-400' />
                Recent Notifications
              </h3>
              <div className='space-y-3'>
                {notificationsLoading ? (
                  <div className="flex justify-center py-4">
                    <CircularLoader />
                  </div>
                ) : recentNotifications.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No notifications found</p>
                ) : (
                  recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-3 rounded-lg transition-all hover:bg-gray-700/50 cursor-pointer ${
                      notification.unread ? "bg-blue-500/10 border border-blue-500/20" : "bg-white/5"
                    }`}
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-1'>
                          <h4 className='text-sm font-medium'>
                            {notification.title}
                          </h4>
                          <span className={`px-1.5 py-0.5 rounded text-xs ${
                            notification.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            notification.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {notification.priority}
                          </span>
                        </div>
                        <p className='text-xs text-gray-400 mb-2'>
                          {notification.message}
                        </p>
                        <div className='flex items-center justify-between'>
                          <p className='text-xs text-gray-500'>
                            {notification.time}
                          </p>
                          <Button 
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotificationClick(notification);
                            }}
                            className='text-xs text-blue-400 hover:text-blue-300'
                          >
                            {notification.action}
                          </Button>
                        </div>
                      </div>
                      {notification.unread && (
                        <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
                      )}
                    </div>
                  </div>
                  ))
                )}
              </div>
              <Button 
                onClick={() => navigate('/notifications')}
                className='w-full mt-4 px-4 py-2 bg-white/10 hover:bg-gray-600/50 rounded-lg text-sm transition-colors'
              >
                View All Notifications
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Access Links */}
        <div className='mt-8 bg-white/5 border border-white/10 rounded-xl p-6'>
          <h3 className='text-lg font-semibold mb-6 flex items-center gap-2'>
            <Rocket className='w-5 h-5 text-blue-400' />
            Quick Access
          </h3>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
            {quickAccessLinks.map((link, index) => (
              <Button
                key={index}
                onClick={() => navigate(link.path)}
                variant="ghost"
                className={`group flex flex-col items-center space-y-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  link.color === 'blue' ? 'bg-blue-500/20 hover:bg-blue-500/30' :
                  link.color === 'purple' ? 'bg-purple-500/20 hover:bg-purple-500/30' :
                  link.color === 'green' ? 'bg-green-500/20 hover:bg-green-500/30' :
                  link.color === 'pink' ? 'bg-pink-500/20 hover:bg-pink-500/30' :
                  link.color === 'yellow' ? 'bg-yellow-500/20 hover:bg-yellow-500/30' :
                  'bg-orange-500/20 hover:bg-orange-500/30'
                }`}
              >
                <div className={`p-3 rounded-lg group-hover:scale-110 transition-transform ${
                  link.color === 'blue' ? 'bg-blue-500/30' :
                  link.color === 'purple' ? 'bg-purple-500/30' :
                  link.color === 'green' ? 'bg-green-500/30' :
                  link.color === 'pink' ? 'bg-pink-500/30' :
                  link.color === 'yellow' ? 'bg-yellow-500/30' :
                  'bg-orange-500/30'
                }`}>
                  <link.icon className={`w-6 h-6 ${
                    link.color === 'blue' ? 'text-blue-400' :
                    link.color === 'purple' ? 'text-purple-400' :
                    link.color === 'green' ? 'text-green-400' :
                    link.color === 'pink' ? 'text-pink-400' :
                    link.color === 'yellow' ? 'text-yellow-400' :
                    'text-orange-400'
                  }`} />
                </div>
                <div className='text-center'>
                  <p className='text-sm font-medium text-white'>{link.name}</p>
                  <p className='text-xs text-gray-400 mt-1'>{link.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>

            {/* Repository Access Section */}
            {recentProjects.filter(p => 
              (p.applicationStatus?.toLowerCase() === 'accepted' || 
               p.applicationStatus?.toLowerCase() === 'shortlisted' ||
               p.applicationStatus?.toLowerCase() === 'hired') &&
              (p.repositoryUrl)
            ).length > 0 && (
              <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-xl font-semibold flex items-center gap-2'>
                    <GitBranch className='w-5 h-5 text-blue-400' />
                    Repository Access
                  </h2>
                </div>
                <div className='space-y-4'>
                  {recentProjects
                    .filter(p => 
                      (p.applicationStatus?.toLowerCase() === 'accepted' || 
                       p.applicationStatus?.toLowerCase() === 'shortlisted' ||
                       p.applicationStatus?.toLowerCase() === 'hired') &&
                      (p.repositoryUrl)
                    )
                    .map((project) => (
                      <RepositoryAccess
                        key={project.id}
                        project={project}
                        applicationStatus={project.applicationStatus}
                      />
                    ))}
                </div>
              </div>
            )}
        </>
        )}

        {/* Collaboration Tab Content */}
        {activeTab === "collaboration" && (
          <MyTasksTab
            assignedTasks={assignedTasks}
            appliedProjects={appliedProjectsData}
            onTaskStart={handleTaskStart}
            onTaskSubmit={handleTaskSubmit}
            onStartTimer={handleStartTimer}
            onStopTimer={handleStopTimer}
            onStopActiveTimer={handleStopActiveTimer}
            onAddComment={handleAddComment}
            userRole={user?.role || "developer"}
            activeTimer={activeTimer}
            performanceStats={performanceStats}
            taskComments={taskComments}
            tasksLoading={developerTasksLoading}
          />
        )}
    </Layout>
  );
}
