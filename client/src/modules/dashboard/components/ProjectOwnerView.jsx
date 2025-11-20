import React, { useState, useEffect, useMemo } from "react";
import Button from '../../../components/Button';
import {
  Bell,
  TrendingUp,
  Users,
  Target,
  ChevronRight,
  Clock,
  DollarSign,
  Plus,
  Briefcase,
  BarChart3,
  Timer,
  Rocket,
  UserPlus,
  UserCheck,
  MessageCircle,
  TrendingUp as TrendingUpIcon,
  PieChart as PieChartIcon,
  DollarSign as DollarSignIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Eye as EyeIcon,
  CheckSquare,
} from "lucide-react";
import { Layout, CircularLoader } from "../../../components";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  getNotifications,
  getUnreadCount,
  markAsRead
} from "../../notifications/slice/notificationSlice";
import { getActiveProjectsForOwner, listProjects, listApplicants, getProjectCategoriesForOwner } from "../../project/slice/projectSlice";
import { 
  getProjectOwnerTasks, 
  createTask, 
  updateTask, 
  deleteTask,
  reviewSubmission,
  getCollaborationStats,
  bulkUpdateTasks,
  bulkDeleteTasks,
  bulkAssignTasks,
} from "../slice/taskSlice";
import CollaborationTab from "./CollaborationTab";

export default function ProjectOwnerView() {
  const [activeTab, setActiveTab] = useState("overview");
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  // Redux selectors for notifications
  const notifications = useSelector((state) => state.notifications?.notifications || []);
  const notificationsLoading = useSelector((state) => state.notifications?.loading);
  const unreadCount = useSelector((state) => state.notifications?.unreadCount || 0);

  // Redux selectors for active projects
  const activeProjectsData = useSelector((state) => state.project?.activeProjects || []);
  const activeProjectsLoading = useSelector((state) => state.project?.activeProjectsLoading || false);

  // Redux selectors for projects and applicants
  const projects = useSelector((state) => state.project?.projects || []);
  const projectsLoading = useSelector((state) => state.project?.projectsLoading || false);
  const applicantsLoading = useSelector((state) => state.project?.applicantsLoading || false);

  // Redux selectors for project categories
  const projectCategoriesData = useSelector((state) => state.project?.projectCategories || []);
  const projectCategoriesLoading = useSelector((state) => state.project?.projectCategoriesLoading || false);

  // Redux selectors for tasks
  const tasks = useSelector((state) => state.task?.tasks || []);
  const tasksLoading = useSelector((state) => state.task?.tasksLoading || false);
  const collaborationStats = useSelector((state) => state.task?.collaborationStats);

  // State for storing applicants by project
  const [projectApplicants, setProjectApplicants] = useState({});
  const [recentApplicantsLoading, setRecentApplicantsLoading] = useState(false);

  // Fetch notifications, active projects, and all projects on component mount
  useEffect(() => {
    dispatch(getNotifications({ limit: 10 }));
    dispatch(getUnreadCount());
    dispatch(getActiveProjectsForOwner());
    dispatch(getProjectCategoriesForOwner());
    
    // Fetch all projects owned by the user
    const ownerId = user?.id || user?.userId;
    if (ownerId) {
      dispatch(listProjects({ ownerId }));
    }
    
    // Fetch tasks for project owner
    dispatch(getProjectOwnerTasks());
    
    // Fetch collaboration stats
    dispatch(getCollaborationStats());
  }, [dispatch, user?.id, user?.userId]);

  // Fetch applicants for all projects when projects are loaded
  useEffect(() => {
    const fetchApplicants = async () => {
      if (!projects || projects.length === 0) {
        return;
      }

      setRecentApplicantsLoading(true);
      try {
        // Load applicants for each project (fault-tolerant)
        const applicantsMap = {};
        for (const project of projects) {
          try {
            const res = await dispatch(listApplicants(project.id)).unwrap();
            applicantsMap[project.id] = res?.applicants || [];
          } catch (e) {
            console.error(`Error fetching applicants for project ${project.id}:`, e);
            applicantsMap[project.id] = [];
          }
        }
        setProjectApplicants(applicantsMap);
      } catch (error) {
        console.error("Error loading applicants:", error);
      } finally {
        setRecentApplicantsLoading(false);
      }
    };

    fetchApplicants();
  }, [projects, dispatch]);

  // Calculate dynamic stats from fetched data
  const ownerStats = useMemo(() => {
    // Calculate active projects count
    const activeProjectsCount = activeProjectsData?.length || 0;
    
    // Count high priority active projects
    const highPriorityCount = activeProjectsData?.filter(p => p.priority === 'high').length || 0;
    
    // Calculate total applicants from all projects
    const allApplicants = Object.values(projectApplicants).flat();
    const totalApplicantsCount = allApplicants.length;
    
    // Count pending applicants (status: 'applied', 'pending')
    const pendingApplicantsCount = allApplicants.filter(a => 
      a.status === 'applied' || a.status === 'pending'
    ).length;
    
    // Calculate team members (accepted applicants across all projects)
    const acceptedApplicants = allApplicants.filter(a => 
      a.status === 'accepted' || a.status === 'hired'
    );
    const teamMembersCount = new Set(acceptedApplicants.map(a => a.userId || a.id)).size;
    const activeHiresCount = acceptedApplicants.length;
    
    // Calculate total budget from all projects
    let totalBudgetAmount = 0;
    let totalSpentAmount = 0;
    
    if (projects && projects.length > 0) {
      projects.forEach(project => {
        // Use budgetMax if available, otherwise budgetMin, otherwise 0
        const budgetMax = project.budgetMax || 0;
        const budgetMin = project.budgetMin || 0;
        const projectBudget = budgetMax > 0 ? budgetMax : (budgetMin > 0 ? budgetMin : 0);
        totalBudgetAmount += projectBudget;
        
        // TODO: Calculate actual spent from expenses tracking
        // For now, estimate spent as 80% of budget for completed projects
        if (project.status === 'completed' && projectBudget > 0) {
          totalSpentAmount += projectBudget * 0.8;
        }
      });
    }
    
    const remainingBudgetAmount = totalBudgetAmount - totalSpentAmount;
    const totalBudgetFormatted = totalBudgetAmount > 0 
      ? `$${totalBudgetAmount.toLocaleString()}` 
      : "$0";
    const remainingBudgetFormatted = remainingBudgetAmount > 0
      ? `$${Math.round(remainingBudgetAmount).toLocaleString()}`
      : "$0";
    
    // Calculate success rate (completed projects / total projects)
    const totalProjectsCount = projects?.length || 0;
    const completedProjectsCount = projects?.filter(p => p.status === 'completed').length || 0;
    const successRate = totalProjectsCount > 0
      ? Math.round((completedProjectsCount / totalProjectsCount) * 100)
      : 0;
    
    // Calculate average project duration (from completed projects)
    let totalDurationWeeks = 0;
    let completedWithDates = 0;
    
    if (projects && projects.length > 0) {
      projects.forEach(project => {
        if (project.status === 'completed' && project.startDate && project.deadline) {
          const start = new Date(project.startDate);
          const end = new Date(project.deadline);
          const weeks = (end - start) / (1000 * 60 * 60 * 24 * 7);
          if (weeks > 0) {
            totalDurationWeeks += weeks;
            completedWithDates++;
          }
        }
      });
    }
    
    const avgDurationWeeks = completedWithDates > 0 
      ? (totalDurationWeeks / completedWithDates).toFixed(1)
      : "0";
    const avgProjectDuration = `${avgDurationWeeks} weeks`;
    
    // Calculate open positions (active projects with available slots)
    let openPositionsCount = 0;
    let urgentPositionsCount = 0;
    
    if (activeProjectsData && activeProjectsData.length > 0) {
      activeProjectsData.forEach(project => {
        const maxApplicants = project.maxApplicants || 0;
        const currentApplicants = project.applicants || 0;
        
        if (maxApplicants === 0 || currentApplicants < maxApplicants) {
          openPositionsCount++;
        }
        
        if (project.isUrgent || project.priority === 'high') {
          urgentPositionsCount++;
        }
      });
    }
    
    // Calculate monthly revenue (from completed projects this month)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let monthlyRevenueAmount = 0;
    
    if (projects && projects.length > 0) {
      projects.forEach(project => {
        if (project.status === 'completed') {
          const completedDate = project.updatedAt ? new Date(project.updatedAt) : null;
          if (completedDate && 
              completedDate.getMonth() === currentMonth && 
              completedDate.getFullYear() === currentYear) {
            const budgetMax = project.budgetMax || 0;
            const budgetMin = project.budgetMin || 0;
            const projectBudget = budgetMax > 0 ? budgetMax : (budgetMin > 0 ? budgetMin : 0);
            monthlyRevenueAmount += projectBudget * 0.8; // Estimate 80% of budget as revenue
          }
        }
      });
    }
    
    const monthlyRevenueFormatted = monthlyRevenueAmount > 0
      ? `$${Math.round(monthlyRevenueAmount).toLocaleString()}`
      : "$0";
    
    return {
      activeProjects: activeProjectsCount,
      completedProjects: completedProjectsCount,
      teamMembers: teamMembersCount,
      totalBudget: totalBudgetFormatted,
      rating: 4.6, // TODO: Calculate from project reviews
      openPositions: openPositionsCount,
      totalApplicants: totalApplicantsCount,
      pendingReviews: pendingApplicantsCount,
      monthlyRevenue: monthlyRevenueFormatted,
      projectSuccessRate: successRate,
      avgProjectDuration: avgProjectDuration,
      activeHires: activeHiresCount,
      highPriorityCount: highPriorityCount,
      urgentPositionsCount: urgentPositionsCount,
      remainingBudget: remainingBudgetFormatted,
    };
  }, [activeProjectsData, projects, projectApplicants]);

  const projectManagementStats = useMemo(() => {
    const totalProjects = projects?.length || 0;
    const inProgress = projects?.filter(p => p.status === 'active').length || 0;
    const completed = projects?.filter(p => p.status === 'completed').length || 0;
    const onHold = projects?.filter(p => p.status === 'paused' || p.status === 'on_hold').length || 0;
    const cancelled = projects?.filter(p => p.status === 'cancelled').length || 0;
    
    // Calculate total spent (estimate from completed projects)
    let totalSpentAmount = 0;
    if (projects && projects.length > 0) {
      projects.forEach(project => {
        if (project.status === 'completed') {
          const budgetMax = project.budgetMax || 0;
          const budgetMin = project.budgetMin || 0;
          const projectBudget = budgetMax > 0 ? budgetMax : (budgetMin > 0 ? budgetMin : 0);
          totalSpentAmount += projectBudget * 0.8; // Estimate 80% spent
        }
      });
    }
    
    const totalSpentFormatted = totalSpentAmount > 0
      ? `$${Math.round(totalSpentAmount).toLocaleString()}`
      : "$0";
    
    const remainingBudget = ownerStats.remainingBudget || "$0";
    
    // Calculate average project value
    let totalBudget = 0;
    if (projects && projects.length > 0) {
      projects.forEach(project => {
        const budgetMax = project.budgetMax || 0;
        const budgetMin = project.budgetMin || 0;
        const projectBudget = budgetMax > 0 ? budgetMax : (budgetMin > 0 ? budgetMin : 0);
        totalBudget += projectBudget;
      });
    }
    
    const avgProjectValue = totalProjects > 0
      ? `$${Math.round(totalBudget / totalProjects).toLocaleString()}`
      : "$0";
    
    // Get top performing project (highest rated or most applicants)
    const topProject = projects?.reduce((top, project) => {
      const topScore = (top.ratingAvg || 0) * 10 + (top.applicantsCount || 0);
      const currentScore = (project.ratingAvg || 0) * 10 + (project.applicantsCount || 0);
      return currentScore > topScore ? project : top;
    }, projects?.[0] || {});
    
    return {
      totalProjects,
      inProgress,
      completed,
      onHold,
      cancelled,
      totalSpent: totalSpentFormatted,
      remainingBudget: remainingBudget.replace('$', ''),
      avgProjectValue,
      topPerformingProject: topProject?.title || "N/A",
    };
  }, [projects, ownerStats.remainingBudget]);


  // Transform active projects data from API to match UI structure
  const activeProjects = useMemo(() => {
    if (!activeProjectsData || activeProjectsData.length === 0) {
      return [];
    }

    return activeProjectsData.map((project) => {
      // Map status from backend to UI display format
      const statusMap = {
        'active': 'In Progress',
        'draft': 'Planning',
        'upcoming': 'Planning',
        'paused': 'On Hold',
        'completed': 'Completed',
        'cancelled': 'Cancelled',
      };
      
      const displayStatus = statusMap[project.status] || project.status || 'In Progress';

      return {
        id: project.id,
        title: project.title,
        client: project.client || "N/A",
        status: displayStatus,
        progress: project.progress || 0,
        budget: project.budget || "Not specified",
        spent: project.spent || "$0",
        deadline: project.deadline || null,
        skillsRequired: project.skillsRequired || [],
        teamSize: project.teamSize || 0,
        applicants: project.applicants || 0,
        priority: project.priority || "medium",
        category: project.category || "Other",
        startDate: project.startDate || project.createdAt || null,
        estimatedHours: project.estimatedHours || 0,
        completedHours: project.completedHours || 0,
      };
    });
  }, [activeProjectsData]);

  // Transform applicants data from API to match UI structure
  const recentApplicants = useMemo(() => {
    if (!projectApplicants || Object.keys(projectApplicants).length === 0) {
      return [];
    }

    // Create a map of projectId -> project title for quick lookup
    const projectTitleMap = {};
    projects.forEach(project => {
      projectTitleMap[project.id] = project.title;
    });

    // Flatten all applicants from all projects and add project title
    const allApplicants = [];
    Object.entries(projectApplicants).forEach(([projectId, applicants]) => {
      applicants.forEach(applicant => {
        allApplicants.push({
          ...applicant,
          projectId: Number(projectId),
          projectTitle: projectTitleMap[Number(projectId)] || "Unknown Project",
        });
      });
    });

    // Sort by appliedAt (most recent first)
    allApplicants.sort((a, b) => {
      const dateA = new Date(a.appliedAt || a.createdAt || 0);
      const dateB = new Date(b.appliedAt || b.createdAt || 0);
      return dateB - dateA;
    });

    // Transform to UI format
    return allApplicants.slice(0, 6).map((applicant, index) => {
      // Parse skills (can be string, array, or object)
      let skillsArray = [];
      if (applicant.skills) {
        try {
          if (typeof applicant.skills === 'string') {
            skillsArray = JSON.parse(applicant.skills);
          } else if (Array.isArray(applicant.skills)) {
            skillsArray = applicant.skills;
          } else if (typeof applicant.skills === 'object') {
            skillsArray = Object.keys(applicant.skills);
          }
          if (!Array.isArray(skillsArray)) {
            skillsArray = [];
          }
        } catch (e) {
          skillsArray = [];
        }
      }

      // Calculate time ago
      const appliedDate = applicant.appliedAt ? new Date(applicant.appliedAt) : new Date();
      const now = new Date();
      const diffMs = now - appliedDate;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      let appliedDateText = "Just now";
      if (diffMins < 1) {
        appliedDateText = "Just now";
      } else if (diffMins < 60) {
        appliedDateText = `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
      } else if (diffHours < 24) {
        appliedDateText = `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
      } else if (diffDays < 7) {
        appliedDateText = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
      } else {
        appliedDateText = appliedDate.toLocaleDateString();
      }

      // Map status
      const statusMap = {
        'applied': 'pending',
        'shortlisted': 'shortlisted',
        'accepted': 'hired',
        'rejected': 'rejected',
        'pending': 'pending',
        'hired': 'hired',
      };
      const displayStatus = statusMap[applicant.status] || applicant.status || 'pending';

      // Get role from applicant data or default
      const role = applicant.roleNeeded || applicant.role || "Developer";

      // Format experience
      const experience = applicant.experience || "Not specified";
      const experienceText = typeof experience === 'string' 
        ? experience 
        : `${experience} years`;

      // Get rating
      const rating = applicant.rating || 0;

      // Get match score
      const matchScore = applicant.matchScore || 0;

      // Format hourly rate (if available)
      const hourlyRate = applicant.hourlyRate || "$0";

      // Get availability
      const availability = applicant.availability || "Not specified";

      return {
        id: applicant.id || applicant.userId || index,
        name: applicant.name || "Unknown",
        role: role,
        experience: experienceText,
        skills: skillsArray.slice(0, 5), // Limit to 5 skills
        rating: rating,
        appliedFor: applicant.projectTitle || "Unknown Project",
        appliedDate: appliedDateText,
        status: displayStatus,
        matchScore: matchScore,
        hourlyRate: hourlyRate,
        availability: availability,
        avatarUrl: applicant.avatarUrl,
        userId: applicant.userId,
        projectId: applicant.projectId,
      };
    });
  }, [projectApplicants, projects]);

  // Transform team members from shortlisted/accepted/hired applicants
  const teamMembers = useMemo(() => {
    if (!projectApplicants || Object.keys(projectApplicants).length === 0) {
      return [];
    }

    // Create a map of projectId -> project title for quick lookup
    const projectTitleMap = {};
    projects.forEach(project => {
      projectTitleMap[project.id] = project.title;
    });

    // Flatten all applicants from all projects and filter for team members
    const allApplicants = [];
    Object.entries(projectApplicants).forEach(([projectId, applicants]) => {
      applicants.forEach(applicant => {
        allApplicants.push({
          ...applicant,
          projectId: Number(projectId),
          projectTitle: projectTitleMap[Number(projectId)] || "Unknown Project",
        });
      });
    });

    // Filter for shortlisted, accepted, or hired applicants
    const teamMemberApplicants = allApplicants.filter(applicant => {
      const status = applicant.status?.toLowerCase();
      return status === 'shortlisted' || status === 'accepted' || status === 'hired';
    });

    // Remove duplicates by userId (in case same person is in multiple projects)
    const uniqueTeamMembers = [];
    const seenUserIds = new Set();
    
    teamMemberApplicants.forEach(applicant => {
      const userId = applicant.userId || applicant.id;
      if (!seenUserIds.has(userId)) {
        seenUserIds.add(userId);
        uniqueTeamMembers.push(applicant);
      }
    });

    // Transform to UI format
    return uniqueTeamMembers.map((applicant, index) => {
      // Parse skills (can be string, array, or object)
      let skillsArray = [];
      if (applicant.skills) {
        try {
          if (typeof applicant.skills === 'string') {
            skillsArray = JSON.parse(applicant.skills);
          } else if (Array.isArray(applicant.skills)) {
            skillsArray = applicant.skills;
          } else if (typeof applicant.skills === 'object') {
            skillsArray = Object.keys(applicant.skills);
          }
          if (!Array.isArray(skillsArray)) {
            skillsArray = [];
          }
        } catch (e) {
          skillsArray = [];
        }
      }

      // Get role from applicant data or default
      const role = applicant.roleNeeded || applicant.role || "Developer";

      // Get rating
      const rating = applicant.rating || 0;

      // Format hourly rate (if available)
      const hourlyRate = applicant.hourlyRate || "$0";
      const hourlyRateFormatted = typeof hourlyRate === 'string' && hourlyRate.startsWith('$') 
        ? hourlyRate 
        : `$${hourlyRate}`;

      // Format joined date (use appliedAt or updatedAt)
      const joinedDate = applicant.appliedAt || applicant.updatedAt || new Date();
      const joinedDateFormatted = new Date(joinedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });

      // Get current project (most recent project for this team member)
      const currentProject = applicant.projectTitle || "Unknown Project";

      // Default status to "online" (can be enhanced later with actual online status)
      const status = "online";

      // Default hours this week (can be enhanced later with actual time tracking)
      const hoursThisWeek = 0;

      return {
        id: applicant.id || applicant.userId || index,
        name: applicant.name || "Unknown",
        role: role,
        skills: skillsArray.slice(0, 5), // Limit to 5 skills
        avatar: applicant.avatarUrl || null,
        status: status,
        currentProject: currentProject,
        hoursThisWeek: hoursThisWeek,
        rating: rating > 0 ? parseFloat(rating.toFixed(1)) : 0,
        joinedDate: joinedDateFormatted,
        hourlyRate: hourlyRateFormatted,
        userId: applicant.userId,
        projectId: applicant.projectId,
      };
    });
  }, [projectApplicants, projects]);

  // Transform project categories data from API to match UI structure
  const projectCategories = useMemo(() => {
    if (!projectCategoriesData || projectCategoriesData.length === 0) {
      return [];
    }

    return projectCategoriesData.map((category) => ({
      name: category.name || "Other",
      count: category.count || 0,
      revenue: category.revenue || "$0",
      color: category.color || "gray",
    }));
  }, [projectCategoriesData]);

  const quickAccessLinks = [
    { name: "Post New Project", icon: Plus, color: "blue", description: "Create project listing", path: "/project?tab=create" },
    { name: "Manage Team", icon: Users, color: "green", description: "Team management", path: "/project?tab=team" },
    { name: "View Applicants", icon: UserCheck, color: "purple", description: "Review applications", path: "/project?tab=applicants" },
    { name: "Billing & Subscriptions", icon: DollarSign, color: "yellow", description: "Payment management", path: "/billing-subscription" },
    { name: "Team Communication", icon: MessageCircle, color: "pink", description: "Chat with team", path: "/chat" },
  ];

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
      
      // Map action based on type for project owners
      const actionMap = {
        'New Applicant': 'Review Application',
        'Application Update': 'View Application',
        'Project Update': 'View Project',
        'Team Message': 'Reply',
        'Chat Message': 'View Messages',
        'Billing Reminder': 'Pay Now',
        'Billing Alert': 'View Billing',
        'Budget Alert': 'View Budget',
        'Deadline Approaching': 'View Project',
        'Task Deadline': 'View Project',
        'Project Milestone': 'View Project',
        'Recommended Developer': 'View Developer',
        'Invitation': 'View Invitation',
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
        action: notif.action || actionMap[notif.type] || actionMap[notif.title] || 'View',
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

    // Map notification types to routes for project owners
    // New Applicant / Application Update → Project applicants tab
    if (type === 'New Applicant' || type === 'Application Update' || 
        notification.title?.includes('Applicant') || notification.title?.includes('Application')) {
      const projectId = metadata.projectId || relatedEntityId;
      if (projectId) {
        navigate(`/project?tab=applicants&projectId=${projectId}`);
      } else {
        navigate('/project?tab=applicants');
      }
    } 
    // Team Message / Chat Message → Chat page
    else if (type === 'Team Message' || type === 'Chat Message' || type === 'message' || 
             notification.title?.includes('Message')) {
      navigate('/chat');
    } 
    // Billing Reminder / Billing Alert → Billing page
    else if (type === 'Billing Reminder' || type === 'Billing Alert' || 
             notification.title?.includes('Billing') || notification.title?.includes('Payment')) {
      navigate('/billing-subscription');
    } 
    // Budget Alert → Project page with budget view
    else if (type === 'Budget Alert' || notification.title?.includes('Budget')) {
      const projectId = metadata.projectId || relatedEntityId;
      if (projectId) {
        navigate(`/project?tab=my-projects&projectId=${projectId}`);
      } else {
        navigate('/project?tab=my-projects');
      }
    } 
    // Project Update / Deadline / Milestone → Project page
    else if (type === 'Project Update' || type === 'Deadline Approaching' || 
             type === 'Task Deadline' || type === 'Project Milestone' ||
             notification.title?.includes('Project') || notification.title?.includes('Deadline') ||
             notification.title?.includes('Milestone')) {
      const projectId = metadata.projectId || relatedEntityId;
      if (projectId) {
        navigate(`/project?tab=my-projects&projectId=${projectId}`);
      } else {
        navigate('/project?tab=my-projects');
      }
    } 
    // Recommended Developer → Project applicants or discover
    else if (type === 'Recommended Developer' || notification.title?.includes('Developer')) {
      navigate('/project?tab=applicants');
    } 
    // Default → Project page
    else {
      const projectId = metadata.projectId || relatedEntityId;
      if (projectId) {
        navigate(`/project?tab=my-projects&projectId=${projectId}`);
      } else {
        navigate('/project?tab=my-projects');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-500";
      case "Planning":
        return "bg-yellow-500";
      case "Under Review":
        return "bg-purple-500";
      case "Completed":
        return "bg-green-500";
      case "On Hold":
        return "bg-orange-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Task handlers
  const handleTaskCreate = async (taskData) => {
    try {
      const result = await dispatch(createTask(taskData)).unwrap();
      // Task is already added to state by createTask.fulfilled
      // Add a small delay before refreshing to ensure server has indexed the new task
      setTimeout(() => {
        dispatch(getProjectOwnerTasks()); // Refresh tasks to get latest from server
      }, 500);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleTaskUpdate = async (taskData) => {
    try {
      await dispatch(updateTask({ taskId: taskData.id, data: taskData })).unwrap();
      dispatch(getProjectOwnerTasks()); // Refresh tasks
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await dispatch(deleteTask(taskId)).unwrap();
      dispatch(getProjectOwnerTasks()); // Refresh tasks
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleReviewSubmit = async (submissionId, action, comments) => {
    try {
      await dispatch(reviewSubmission({ 
        submissionId, 
        data: { status: action, reviewComments: comments } 
      })).unwrap();
      dispatch(getProjectOwnerTasks()); // Refresh tasks
    } catch (error) {
      console.error("Failed to review submission:", error);
    }
  };

  const handleBulkAction = async (action, taskIds, additionalData = {}) => {
    try {
      if (action === "archive") {
        await dispatch(bulkUpdateTasks({ taskIds, updateData: { status: "cancelled" } })).unwrap();
      } else if (action === "delete") {
        await dispatch(bulkDeleteTasks({ taskIds })).unwrap();
      } else if (action === "assign") {
        await dispatch(bulkAssignTasks({ taskIds, assignedTo: additionalData.assignedTo })).unwrap();
      }
      dispatch(getProjectOwnerTasks()); // Refresh tasks
    } catch (error) {
      console.error("Failed to perform bulk action:", error);
    }
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
                <span className='font-medium'>Collaboration</span>
                {tasks.filter(t => t.status === "under-review").length > 0 && (
                  <span className='ml-2 px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full'>
                    {tasks.filter(t => t.status === "under-review").length}
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
              <h1 className='text-3xl font-bold mb-2'>Welcome back, {user?.name || 'Project Owner'}! 👋</h1>
              <p className='text-gray-300'>
                Here's the latest update on your projects, teams, and budgets.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Project Success Rate</p>
                <p className="text-2xl font-bold text-green-400 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  {ownerStats.projectSuccessRate}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Monthly Revenue</p>
                <p className="text-2xl font-bold text-blue-400 flex items-center gap-2">
                  <DollarSign className="w-6 h-6" />
                  {ownerStats.monthlyRevenue}
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
                <p className='text-gray-400 text-sm'>Active Projects</p>
                <p className='text-2xl font-bold text-blue-400'>
                  {ownerStats.activeProjects}
                </p>
                <p className='text-xs text-gray-500'>{ownerStats.highPriorityCount || 0} high priority</p>
              </div>
              <Briefcase className='w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Total Applicants</p>
                <p className='text-2xl font-bold text-purple-400'>
                  {ownerStats.totalApplicants}
                </p>
                <p className='text-xs text-gray-500'>{ownerStats.pendingReviews} pending</p>
              </div>
              <UserPlus className='w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Team Members</p>
                <p className='text-2xl font-bold text-yellow-400'>
                  {ownerStats.teamMembers}
                </p>
                <p className='text-xs text-gray-500'>{ownerStats.activeHires} active</p>
              </div>
              <Users className='w-8 h-8 text-yellow-400 group-hover:scale-110 transition-transform' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Total Budget</p>
                <p className='text-2xl font-bold text-green-400'>
                  {ownerStats.totalBudget}
                </p>
                <p className='text-xs text-gray-500'>{ownerStats.remainingBudget} remaining</p>
              </div>
              <DollarSign className='w-8 h-8 text-green-400 group-hover:scale-110 transition-transform' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Success Rate</p>
                <p className='text-2xl font-bold text-orange-400'>
                  {ownerStats.projectSuccessRate}%
                </p>
                <p className='text-xs text-gray-500'>Avg {ownerStats.avgProjectDuration}</p>
              </div>
              <TrendingUp className='w-8 h-8 text-orange-400 group-hover:scale-110 transition-transform' />
            </div>
          </div>
          <div className='bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all group'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-400 text-sm'>Open Positions</p>
                <p className='text-2xl font-bold text-pink-400'>
                  {ownerStats.openPositions}
                </p>
                <p className='text-xs text-gray-500'>Urgent: {ownerStats.urgentPositionsCount || 0}</p>
              </div>
              <Target className='w-8 h-8 text-pink-400 group-hover:scale-110 transition-transform' />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Left Column - Main Content */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Recent Applicants */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <UserCheck className='w-6 h-6 text-green-400' />
                  Recent Applicants
                </h2>
                <Button 
                  onClick={() => navigate('/project?tab=applicants')}
                  variant="ghost"
                  className='text-blue-400 hover:text-blue-300 text-sm flex items-center'
                >
                  View All <ChevronRight className='w-4 h-4 ml-1' />
                </Button>
              </div>
              <div className='space-y-3'>
                {recentApplicantsLoading || projectsLoading ? (
                  <div className="flex justify-center py-8">
                    <CircularLoader />
                  </div>
                ) : recentApplicants.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No applicants found</p>
                ) : (
                  recentApplicants.map((applicant) => (
                    <div
                      key={applicant.id}
                      className='bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all'
                    >
                      <div className='flex items-start justify-between mb-3'>
                        <div className='flex items-center gap-3'>
                          <div className='relative'>
                            {applicant.avatarUrl ? (
                              <>
                                <img
                                  src={applicant.avatarUrl}
                                  alt={applicant.name}
                                  className='w-12 h-12 rounded-full object-cover border-2 border-white/20'
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    const fallback = e.target.nextElementSibling;
                                    if (fallback) fallback.style.display = 'flex';
                                  }}
                                />
                                <div 
                                  className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full items-center justify-center text-white font-bold hidden'
                                  style={{ display: 'none' }}
                                >
                                  {applicant.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                </div>
                              </>
                            ) : (
                              <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold'>
                                {applicant.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className='flex-1'>
                            <h3 className='font-semibold mb-1'>{applicant.name}</h3>
                            <p className='text-gray-400 text-sm'>{applicant.role} • {applicant.experience}</p>
                            <p className='text-gray-300 text-sm'>Applied for: {applicant.appliedFor}</p>
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          <span className={`px-2 py-1 rounded text-xs capitalize ${
                            applicant.status === 'hired' || applicant.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                            applicant.status === 'shortlisted' ? 'bg-blue-500/20 text-blue-400' :
                            applicant.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {applicant.status}
                          </span>
                          <div className='text-right'>
                            <div className='text-lg font-bold text-green-400'>{applicant.matchScore || 0}%</div>
                            <div className='text-xs text-gray-400'>Match</div>
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <div className='flex flex-wrap gap-1'>
                          {applicant.skills && applicant.skills.length > 0 ? (
                            applicant.skills.map((skill, index) => (
                              <span
                                key={index}
                                className='px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs'
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className='text-xs text-gray-500'>No skills specified</span>
                          )}
                        </div>
                        <div className='flex items-center gap-4 text-sm text-gray-400'>
                          {applicant.rating > 0 && (
                            <span>⭐ {applicant.rating.toFixed(1)}</span>
                          )}
                          {applicant.hourlyRate && applicant.hourlyRate !== "$0" && (
                            <span>{applicant.hourlyRate}/hr</span>
                          )}
                          {applicant.availability && applicant.availability !== "Not specified" && (
                            <span>{applicant.availability}</span>
                          )}
                        </div>
                      </div>
                      <div className='flex items-center justify-between mt-3'>
                        <span className='text-gray-400 text-sm'>{applicant.appliedDate}</span>
                        <div className='flex gap-2'>
                          <Button 
                            onClick={() => navigate(`/project?tab=applicants&projectId=${applicant.projectId}`)}
                            className='px-3 py-1 bg-green-500 hover:bg-green-600 rounded text-sm transition-colors'
                          >
                            {applicant.status === 'hired' || applicant.status === 'accepted' ? 'View Profile' : 'Review'}
                          </Button>
                          <Button 
                            onClick={() => navigate('/chat')}
                            className='px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm transition-colors'
                          >
                            Message
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Active Projects */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold'>Active Projects</h2>
                <Button 
                  onClick={() => navigate('/project?tab=my-projects')}
                  variant="ghost"
                  className='text-blue-400 hover:text-blue-300 text-sm flex items-center'
                >
                  View All <ChevronRight className='w-4 h-4 ml-1' />
                </Button>
              </div>
              <div className='space-y-4'>
                {activeProjectsLoading ? (
                  <div className="flex justify-center py-8">
                    <CircularLoader />
                  </div>
                ) : activeProjects.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No active projects found</p>
                ) : (
                  activeProjects.map((project) => (
                    <div
                      key={project.id}
                      className='bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all'
                    >
                      <div className='flex items-start justify-between mb-3'>
                        <div className='flex-1'>
                          <h3 className='font-semibold mb-1'>{project.title}</h3>
                          <p className='text-gray-400 text-sm mb-1'>
                            {project.client}
                          </p>
                          <div className='flex items-center gap-2 mb-2'>
                            <span className={`px-2 py-1 rounded text-xs ${
                              project.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                              project.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {project.priority}
                            </span>
                            <span className='px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs'>
                              {project.category}
                            </span>
                            <span className='px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs'>
                              {project.teamSize} members
                            </span>
                          </div>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <span
                            className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(
                              project.status
                            )}`}
                          >
                            {project.status}
                          </span>
                          <div className='text-right'>
                            <div className='text-green-400 font-medium'>{project.budget}</div>
                            <div className='text-xs text-gray-400'>Spent: {project.spent}</div>
                          </div>
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
                          {project.skillsRequired && project.skillsRequired.length > 0 ? (
                            project.skillsRequired.map((skill, index) => (
                              <span
                                key={index}
                                className='px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs'
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className='text-xs text-gray-500'>No skills specified</span>
                          )}
                        </div>
                        <div className='flex items-center gap-4 text-gray-400 text-sm'>
                          {project.deadline && (
                            <div className='flex items-center gap-1'>
                              <Clock className='w-4 h-4' />
                              {new Date(project.deadline).toLocaleDateString()}
                            </div>
                          )}
                          {project.estimatedHours > 0 && (
                            <div className='flex items-center gap-1'>
                              <Timer className='w-4 h-4' />
                              {project.completedHours || 0}/{project.estimatedHours}h
                            </div>
                          )}
                          <div className='flex items-center gap-1'>
                            <Users className='w-4 h-4' />
                            {project.applicants || 0} applicant{project.applicants !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Enhanced Team Members */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <Users className='w-6 h-6 text-blue-400' />
                  Team Members
                </h2>
                <Button 
                  onClick={() => navigate('/project?tab=my-projects')}
                  variant="ghost"
                  className='text-blue-400 hover:text-blue-300 text-sm flex items-center'
                >
                  Manage Team <ChevronRight className='w-4 h-4 ml-1' />
                </Button>
              </div>
              <div className='space-y-4'>
                {recentApplicantsLoading || projectsLoading ? (
                  <div className="flex justify-center py-8">
                    <CircularLoader />
                  </div>
                ) : teamMembers.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No team members found. Shortlist applicants to add them to your team.</p>
                ) : (
                  teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className='flex items-center space-x-4 bg-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all'
                    >
                      <div className='relative'>
                        {member.avatar ? (
                          <>
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className='w-12 h-12 rounded-full object-cover border-2 border-white/20'
                              onError={(e) => {
                                e.target.style.display = 'none';
                                const fallback = e.target.nextElementSibling;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                            <div 
                              className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full items-center justify-center text-white font-bold hidden border-2 border-white/20'
                              style={{ display: 'none' }}
                            >
                              {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                          </>
                        ) : (
                          <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold border-2 border-white/20'>
                            {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
                          member.status === 'online' ? 'bg-green-500' :
                          member.status === 'away' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`}></div>
                      </div>
                    <div className='flex-1'>
                      <div className='flex items-center justify-between mb-1'>
                        <h3 className='font-semibold'>{member.name}</h3>
                        <div className='flex items-center gap-2'>
                          {member.rating > 0 && (
                            <span className='text-sm text-gray-400'>⭐ {member.rating}</span>
                          )}
                          {member.hourlyRate && member.hourlyRate !== "$0" && (
                            <span className='text-sm text-green-400'>{member.hourlyRate}/hr</span>
                          )}
                        </div>
                      </div>
                      <p className='text-gray-400 text-sm mb-1'>{member.role}</p>
                      <p className='text-gray-300 text-xs mb-2'>Working on: {member.currentProject}</p>
                      <div className='flex items-center justify-between'>
                        <div className='flex flex-wrap gap-1'>
                          {member.skills && member.skills.length > 0 ? (
                            member.skills.map((skill, i) => (
                              <span
                                key={i}
                                className='px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs'
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className='text-xs text-gray-500'>No skills specified</span>
                          )}
                        </div>
                        <div className='text-right text-xs text-gray-400'>
                          {member.hoursThisWeek > 0 && (
                            <div>{member.hoursThisWeek}h this week</div>
                          )}
                          <div>Joined {member.joinedDate}</div>
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                      <Button 
                        onClick={() => navigate(`/chat?userId=${member.userId}`)}
                        className='px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm transition-colors'
                      >
                        Message
                      </Button>
                      <Button 
                        onClick={() => navigate(`/profile/${member.userId}`)}
                        className='px-3 py-1 bg-gray-500 hover:bg-gray-600 rounded text-sm transition-colors'
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className='space-y-6'>
            {/* Enhanced Notifications */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
                <Bell className='w-5 h-5 text-blue-400' />
                Recent Notifications
                {unreadCount > 0 && (
                  <span className='ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full'>
                    {unreadCount}
                  </span>
                )}
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
                      notification.unread
                        ? "bg-blue-500/10 border border-blue-500/20"
                        : "bg-white/5"
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

            {/* Enhanced Quick Access Links */}
            <div className='mt-8 bg-white/5 border border-white/10 rounded-xl p-6'>
              <h3 className='text-lg font-semibold mb-6 flex items-center gap-2'>
                <Rocket className='w-5 h-5 text-blue-400' />
                Quick Access
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                {quickAccessLinks.map((link, index) => (
                  <Button
                    key={index}
                    onClick={() => navigate(link.path)}
                    variant="ghost"
                    className={`group flex flex-col items-center space-y-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      link.color === 'blue' ? 'bg-blue-500/20 hover:bg-blue-500/30' :
                      link.color === 'green' ? 'bg-green-500/20 hover:bg-green-500/30' :
                      link.color === 'purple' ? 'bg-purple-500/20 hover:bg-purple-500/30' :
                      link.color === 'yellow' ? 'bg-yellow-500/20 hover:bg-yellow-500/30' :
                      link.color === 'pink' ? 'bg-pink-500/20 hover:bg-pink-500/30' :
                      'bg-orange-500/20 hover:bg-orange-500/30'
                    }`}
                  >
                    <div className={`p-3 rounded-lg group-hover:scale-110 transition-transform ${
                      link.color === 'blue' ? 'bg-blue-500/30' :
                      link.color === 'green' ? 'bg-green-500/30' :
                      link.color === 'purple' ? 'bg-purple-500/30' :
                      link.color === 'yellow' ? 'bg-yellow-500/30' :
                      link.color === 'pink' ? 'bg-pink-500/30' :
                      'bg-orange-500/30'
                    }`}>
                      <link.icon className={`w-6 h-6 ${
                        link.color === 'blue' ? 'text-blue-400' :
                        link.color === 'green' ? 'text-green-400' :
                        link.color === 'purple' ? 'text-purple-400' :
                        link.color === 'yellow' ? 'text-yellow-400' :
                        link.color === 'pink' ? 'text-pink-400' :
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

             {/* Project Categories Overview */}
            <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-lg font-semibold flex items-center gap-2'>
                  <BarChart3 className='w-5 h-5 text-purple-400' />
                  Project Categories
                </h3>
                <Button 
                  onClick={() => navigate('/project?tab=analytics')}
                  variant="ghost"
                  className='text-blue-400 hover:text-blue-300 text-sm flex items-center'
                >
                  View Analytics <ChevronRight className='w-4 h-4 ml-1' />
                </Button>
              </div>
              <div className='space-y-3'>
                {projectCategoriesLoading ? (
                  <div className="flex justify-center py-8">
                    <CircularLoader />
                  </div>
                ) : projectCategories.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No project categories found</p>
                ) : (
                  projectCategories.map((category, index) => (
                    <div
                      key={index}
                      className='bg-white/5 border border-white/10 rounded-lg p-3 hover:border-white/20 transition-all'
                    >
                      <div className='flex items-center justify-between mb-2'>
                        <h4 className='font-semibold text-sm'>{category.name}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${
                          category.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                          category.color === 'green' ? 'bg-green-500/20 text-green-400' :
                          category.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                          category.color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                          category.color === 'pink' ? 'bg-pink-500/20 text-pink-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {category.count}
                        </span>
                      </div>
                      <div className='flex items-center justify-between'>
                        <p className='text-sm font-bold text-green-400'>{category.revenue}</p>
                        <p className='text-xs text-gray-400'>revenue</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        </>
        )}

        {/* Collaboration Tab Content */}
        {activeTab === "collaboration" && (
          <CollaborationTab
            tasks={tasks}
            projects={projects}
            teamMembers={teamMembers}
            onTaskCreate={handleTaskCreate}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            onReviewSubmit={handleReviewSubmit}
            onBulkAction={handleBulkAction}
            navigate={navigate}
            userRole={user?.role || "project-owner"}
            tasksLoading={tasksLoading}
            collaborationStats={collaborationStats}
          />
        )}
    </Layout>
  );
}
