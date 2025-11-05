import React, { useState, useEffect, useMemo, useRef } from "react";
import ProjectForm from "./ProjectForm";
import ApplicantsList from "./ApplicantsList";
import InviteDevelopers from "./InviteDevelopers";
import {
  Modal,
  Button,
  StatsCard,
  SectionCard,
  MetricCard,
} from "../../../components";
import ConfirmModal from "../../../components/Modal/ConfirmModal";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Target,
  Zap,
  Award,
  Activity,
  Bell,
  Plus,
  Play,
  Star,
  Sparkles,
  Lightbulb,
  Briefcase,
  Eye,
  Settings,
  RefreshCcw,
  FileText,
  Trash2,
  UserCheck,
  UserX,
  CheckCircle,
  Code2,
  MessageCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
// Project actions
import {
  updateProject,
  deleteProject,
  getProjectStats,
  listApplicants,
  listProjects,
  updateApplicantStatus,
} from "../slice/projectSlice";
import { createGroupConversation } from "../../chat/slice/chatSlice";

const ProjectOwnerProjects = ({ user, projects, dispatch, error, message }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get tab from URL parameters, default to "dashboard" if not provided
  const urlTab = searchParams.get('tab');
  const validTabs = ['dashboard', 'my-projects', 'create', 'applicants', 'analytics'];
  const initialTab = validTabs.includes(urlTab) ? urlTab : 'dashboard';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showInviteDevelopersModal, setShowInviteDevelopersModal] =
    useState(false);
  const [notifications, setNotifications] = useState([]);
  const [projectStats, setProjectStats] = useState(null);
  const [projectApplicants, setProjectApplicants] = useState({});
  const projectFormRef = useRef(null);
  // Inline field assistants are triggered from ProjectForm via window events.

  // Toggles for create form preview and advanced sections
  const [showPreview, setShowPreview] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [analyticsExportFormat, setAnalyticsExportFormat] = useState('json');
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareContent, setShareContent] = useState('');
  const [showGroupChatModal, setShowGroupChatModal] = useState(false);
  const [selectedProjectForGroupChat, setSelectedProjectForGroupChat] = useState(null);
  const [selectedDevelopers, setSelectedDevelopers] = useState([]);
  const [groupChatName, setGroupChatName] = useState('');
  const [isCreatingGroupChat, setIsCreatingGroupChat] = useState(false);

  // Handle tab changes and update URL
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Update URL with the new tab parameter
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('tab', tab);
    setSearchParams(newSearchParams);
  };

  // Listen for inline AI assistant open events from fields
  // No container-level assistant now

  // Load project data when component mounts
  useEffect(() => {
    if (projects && projects.length > 0) {
      loadProjectData();
    }
  }, [projects]);

  // Ensure owner's projects are loaded into Redux when viewing Applicants tab
  useEffect(() => {
    if (activeTab === 'applicants') {
      const ownerId = user?.id || user?.userId;
      dispatch(listProjects(ownerId ? { ownerId } : undefined));
    }
  }, [activeTab, user?.id, user?.userId, dispatch]);

  // Handle toast notifications
  useEffect(() => {
    if (message) {
      toast.success(message);
    }
    if (error) {
      toast.error(error);
    }
  }, [message, error]);

  const loadProjectData = async () => {
    try {
      // Load stats for all projects (fault-tolerant)
      const statsResults = await Promise.all(
        projects.map(async (project) => {
          try {
            return await dispatch(getProjectStats(project.id)).unwrap();
          } catch (e) {
            return { stats: null };
          }
        })
      );
      setProjectStats(statsResults);

      // Load applicants for each owned project (fault-tolerant)
      const applicantsMap = {};
      for (const project of projects) {
        try {
          const res = await dispatch(listApplicants(project.id)).unwrap();
          applicantsMap[project.id] = res?.applicants || [];
        } catch (e) {
          applicantsMap[project.id] = [];
        }
      }
      setProjectApplicants(applicantsMap);
    } catch (error) {
      console.error("Error loading project data:", error);
    }
  };

  // Handle creating group chat for a project
  const handleCreateGroupChat = (project) => {
    setSelectedProjectForGroupChat(project);
    setGroupChatName(project.title || 'Project Team Chat');
    // Pre-select shortlisted and accepted developers
    const applicants = projectApplicants[project.id] || [];
    const eligibleDevelopers = applicants.filter(
      (a) => a.status === 'shortlisted' || a.status === 'accepted'
    );
    setSelectedDevelopers(eligibleDevelopers.map((a) => a.userId));
    setShowGroupChatModal(true);
  };

  // Handle group chat creation
  const handleConfirmGroupChat = async () => {
    // Prevent duplicate calls
    if (isCreatingGroupChat) {
      console.log('[Create Group Chat] Already creating, ignoring duplicate call');
      return;
    }

    if (!selectedProjectForGroupChat || selectedDevelopers.length === 0) {
      toast.error('Please select at least one developer');
      return;
    }

    if (!groupChatName.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    setIsCreatingGroupChat(true);
    try {
      // Ensure project owner's ID is not in participantIds (backend adds creator automatically)
      const currentUserId = user?.id || user?.userId;
      const filteredParticipantIds = selectedDevelopers.filter(
        (id) => Number(id) !== Number(currentUserId)
      );

      const groupData = {
        name: groupChatName.trim(),
        projectId: selectedProjectForGroupChat.id,
        participantIds: filteredParticipantIds,
      };

      const result = await dispatch(createGroupConversation(groupData)).unwrap();
      
      // The result is the axios response, so result.data is the API response
      // API response structure: {success: true, status: 201, message: "...", data: {...}}
      const apiResponse = result?.data || result;
      
      if (apiResponse?.success === true || apiResponse?.status === 201) {
        toast.success(apiResponse?.message || `Group chat "${groupChatName}" created successfully!`);
        setShowGroupChatModal(false);
        setSelectedProjectForGroupChat(null);
        setSelectedDevelopers([]);
        setGroupChatName('');
        
        // Get the created conversation data
        const createdConversation = apiResponse?.data || {};
        
        // Navigate to chat page with conversation data to add immediately
        navigate('/chat?refresh=true&created=' + Date.now() + '&conversationId=' + (createdConversation.id || ''));
        
        // Dispatch event with full conversation data so it can be added immediately
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('refreshConversations', { 
            detail: { 
              conversationId: createdConversation.id,
              conversation: createdConversation,
              action: 'created'
            } 
          }));
        }, 300);
      } else {
        toast.error(apiResponse?.message || 'Failed to create group chat');
      }
    } catch (error) {
      console.error('Error creating group chat:', error);
      toast.error(error?.message || 'Failed to create group chat');
    } finally {
      setIsCreatingGroupChat(false);
    }
  };

  const handleApplicantStatus = async (projectId, userId, status) => {
    try {
      await dispatch(updateApplicantStatus({ projectId, userId, status })).unwrap();
      // Optimistically update local state so UI reflects immediately
      setProjectApplicants((prev) => {
        const current = Array.isArray(prev[projectId]) ? [...prev[projectId]] : [];
        const idx = current.findIndex((a) => a.userId === userId);
        if (idx !== -1) {
          current[idx] = { ...current[idx], status };
        }
        return { ...prev, [projectId]: current };
      });
      // Best-effort refresh from server to ensure we reflect canonical state
      try {
        const res = await dispatch(listApplicants(projectId)).unwrap();
        setProjectApplicants((prev) => ({ ...prev, [projectId]: res?.applicants || [] }));
      } catch {}
    } catch (e) {
      console.error(e);
    }
  };

  // Map API data to match UI expectations
  const mapProjectData = (project) => ({
    id: project.id,
    title: project.title,
    status:
      project.status?.charAt(0).toUpperCase() + project.status?.slice(1) ||
      "Active",
    priority:
      project.priority?.charAt(0).toUpperCase() + project.priority?.slice(1) ||
      "Medium",
    description: project.description,
    startDate: project.startDate,
    deadline: project.deadline,
    roleNeeded: project.roleNeeded,
    applicantsCount: project.applicantsCount || 0,
    newApplicants: project.newApplicantsCount || 0,
    activity: `${project.activityCount || 0} updates`,
    tags: project.tags || [],
    rating: parseFloat(project.ratingAvg) || 0,
    budget:
      project.budgetMin && project.budgetMax
        ? `$${project.budgetMin.toLocaleString()} - $${project.budgetMax.toLocaleString()}`
        : "Budget TBD",
    budgetMin: project.budgetMin,
    budgetMax: project.budgetMax,
    location: project.isRemote ? "Remote" : project.location || "Remote",
    duration: project.duration || "TBD",
    experience: (() => {
      const lvl = (project.experienceLevel || '').toString().toLowerCase();
      const map = { entry: 'Entry Level', mid: 'Mid Level', senior: 'Senior Level', lead: 'Lead/Architect' };
      return map[lvl] || 'Mid Level';
    })(),
    category: project.category || "Web Development",
    isRemote: project.isRemote,
    isUrgent: project.isUrgent,
    isFeatured: project.isFeatured,
    maxApplicants: project.maxApplicants,
    company: project.company || "Company",
    website: project.website,
    matchScore: project.matchScoreAvg || 0,
    skills: project.skills || [],
    benefits: project.benefits,
    requirements: project.requirements,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  });

  // Use projects from Redux state and map them
  const ownedProjects = (projects || []).map(mapProjectData);

  // Dashboard analytics data - now dynamic based on actual project data
  const dashboardStats = useMemo(() => {
    if (!ownedProjects || ownedProjects.length === 0) {
      return {
        totalProjects: 0,
        activeProjects: 0,
        totalApplicants: 0,
        newApplicants: 0,
        avgRating: "0.0",
        totalBudget: "Budget TBD",
        completionRate: 0,
        responseTime: "N/A",
      };
    }

    const totalProjects = ownedProjects.length;
    const activeProjects = ownedProjects.filter(
      (p) => p.status === "Active"
    ).length;
    const totalApplicants = ownedProjects.reduce(
      (sum, p) => sum + (p.applicantsCount || 0),
      0
    );
    const newApplicants = ownedProjects.reduce(
      (sum, p) => sum + (p.newApplicants || 0),
      0
    );

    // Calculate average rating
    const avgRating =
      ownedProjects.length > 0
        ? (
            ownedProjects.reduce((sum, p) => sum + (p.rating || 0), 0) /
            ownedProjects.length
          ).toFixed(1)
        : "0.0";

    // Calculate total budget range
    const budgets = ownedProjects
      .filter((p) => p.budgetMin && p.budgetMax)
      .map((p) => ({ min: p.budgetMin, max: p.budgetMax }));

    const totalBudget =
      budgets.length > 0
        ? `$${Math.min(...budgets.map((b) => b.min)).toLocaleString()} - $${Math.max(...budgets.map((b) => b.max)).toLocaleString()}`
        : "Budget TBD";

    // Calculate completion rate
    const completedProjects = ownedProjects.filter(
      (p) => p.status === "Completed"
    ).length;
    const completionRate =
      totalProjects > 0
        ? Math.round((completedProjects / totalProjects) * 100)
        : 0;

    // Calculate average response time (mock calculation - could be enhanced with real data)
    const responseTime =
      totalApplicants > 0
        ? `${Math.max(1, Math.min(24, Math.round(totalApplicants / 2)))} hours`
        : "N/A";

    return {
      totalProjects,
      activeProjects,
      totalApplicants,
      newApplicants,
      avgRating,
      totalBudget,
      completionRate,
      responseTime,
    };
  }, [ownedProjects]);

  // Additional computed analytics derived from applicants and project metadata
  const computedAnalytics = useMemo(() => {
    // Flatten all applicants with timestamps
    const allApplicants = Object.values(projectApplicants || {}).flat().filter(Boolean);

    // Helper: date boundaries
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(startOfToday.getDate() - 7);

    const thisWeekApplicants = allApplicants.filter((a) => {
      const ts = a?.appliedAt ? new Date(a.appliedAt) : null;
      return ts && ts >= sevenDaysAgo;
    }).length;

    // Budget utilization: percent of projects that have both min & max defined
    const totalProjects = ownedProjects.length;
    const withBudget = ownedProjects.filter((p) => Boolean(p.budgetMin) && Boolean(p.budgetMax)).length;
    const budgetUtilizationPct = totalProjects > 0 ? Math.round((withBudget / totalProjects) * 100) : 0;

    // Top skills by frequency across applicants (not projects)
    const skillCounts = new Map();
    allApplicants.forEach((applicant) => {
      if (applicant.skills) {
        try {
          const skills = typeof applicant.skills === 'string' 
            ? JSON.parse(applicant.skills) 
            : Array.isArray(applicant.skills) 
              ? applicant.skills 
              : [];
          
          skills.forEach((skill) => {
            const key = String(skill).trim();
            if (!key) return;
            skillCounts.set(key, (skillCounts.get(key) || 0) + 1);
          });
        } catch (e) {
          console.log('Error parsing applicant skills:', e);
        }
      }
    });
    
    const sortedSkills = Array.from(skillCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
    
    const totalApplicantsWithSkills = allApplicants.filter(a => a.skills).length;
    const topSkills = sortedSkills.map(([name, count]) => ({
      name,
      count,
      pct: totalApplicantsWithSkills > 0 ? Math.round((count / totalApplicantsWithSkills) * 100) : 0,
    }));

    // Monthly performance (last 3 months) based on applicants and project createdAt
    const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const months = [0, 1, 2].map((i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return { key: monthKey(d), label: i === 0 ? 'This Month' : i === 1 ? 'Last Month' : '2 Months Ago' };
    });

    const applicantsByMonth = new Map();
    allApplicants.forEach((a) => {
      const ts = a?.appliedAt ? new Date(a.appliedAt) : null;
      if (!ts) return;
      const key = monthKey(ts);
      applicantsByMonth.set(key, (applicantsByMonth.get(key) || 0) + 1);
    });

    const projectsByMonth = new Map();
    ownedProjects.forEach((p) => {
      const ts = p?.createdAt ? new Date(p.createdAt) : null;
      if (!ts) return;
      const key = monthKey(ts);
      projectsByMonth.set(key, (projectsByMonth.get(key) || 0) + 1);
    });

    const monthlyPerformance = months.map((m) => ({
      label: m.label,
      projects: projectsByMonth.get(m.key) || 0,
      applicants: applicantsByMonth.get(m.key) || 0,
    }));

    const totalApplicantsDyn = allApplicants.length;

    return {
      thisWeekApplicants,
      budgetUtilizationPct,
      topSkills,
      monthlyPerformance,
      totalApplicantsDyn,
    };
  }, [projectApplicants, ownedProjects]);

  // ----- Analytics Actions: Export, Report, Share -----
  const buildAnalyticsDataset = () => {
    return {
      generatedAt: new Date().toISOString(),
      summary: {
        totalProjects: dashboardStats.totalProjects,
        activeProjects: dashboardStats.activeProjects,
        totalApplicants: computedAnalytics.totalApplicantsDyn || dashboardStats.totalApplicants,
        newApplicantsThisWeek: computedAnalytics.thisWeekApplicants,
        avgRating: Number(dashboardStats.avgRating || 0),
        completionRate: dashboardStats.completionRate,
        budgetUtilizationPct: computedAnalytics.budgetUtilizationPct,
      },
      monthlyPerformance: computedAnalytics.monthlyPerformance,
      topSkills: computedAnalytics.topSkills,
      projects: ownedProjects,
      applicantsByProject: projectApplicants,
    };
  };

  const downloadBlob = (dataString, filename, mimeType) => {
    try {
      const blob = new Blob([dataString], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${filename}`);
    } catch (e) {
      console.error(e);
      toast.error('Failed to download file');
    }
  };

  const projectsToCsv = () => {
    const dataset = buildAnalyticsDataset();
    
    // Create multiple CSV sections
    const csvSections = [];
    
    // 1. Summary Section
    csvSections.push('=== PROJECT ANALYTICS SUMMARY ===');
    csvSections.push('Metric,Value');
    csvSections.push(`Total Projects,${dataset.summary.totalProjects}`);
    csvSections.push(`Active Projects,${dataset.summary.activeProjects}`);
    csvSections.push(`Total Applicants,${dataset.summary.totalApplicants}`);
    csvSections.push(`New Applicants (7d),${dataset.summary.newApplicantsThisWeek}`);
    csvSections.push(`Average Rating,${dataset.summary.avgRating}`);
    csvSections.push(`Completion Rate,${dataset.summary.completionRate}%`);
    csvSections.push(`Budget Utilization,${dataset.summary.budgetUtilizationPct}%`);
    csvSections.push('');
    
    // 2. Top Skills Section
    csvSections.push('=== TOP SKILLS ===');
    csvSections.push('Skill,Count,Percentage');
    dataset.topSkills.forEach(skill => {
      csvSections.push(`${skill.name},${skill.count},${skill.pct}%`);
    });
    csvSections.push('');
    
    // 3. Monthly Performance Section
    csvSections.push('=== MONTHLY PERFORMANCE ===');
    csvSections.push('Month,Projects,Applicants');
    dataset.monthlyPerformance.forEach(month => {
      csvSections.push(`${month.label},${month.projects},${month.applicants}`);
    });
    csvSections.push('');
    
    // 4. Projects Section
    csvSections.push('=== PROJECTS DETAILS ===');
    const projectHeaders = [
      'ID','Title','Status','Priority','Applicants Count','Rating','Budget Min','Budget Max',
      'Is Remote','Is Urgent','Is Featured','Created At','Updated At','Description'
    ];
    csvSections.push(projectHeaders.join(','));
    
    dataset.projects.forEach(project => {
      const row = [
        project.id,
        `"${(project.title || '').replace(/"/g, '""')}"`,
        project.status || '',
        project.priority || '',
        project.applicantsCount || 0,
        project.rating || 0,
        project.budgetMin || '',
        project.budgetMax || '',
        project.isRemote ? 'yes' : 'no',
        project.isUrgent ? 'yes' : 'no',
        project.isFeatured ? 'yes' : 'no',
        project.createdAt || '',
        project.updatedAt || '',
        `"${(project.description || '').replace(/"/g, '""')}"`
      ];
      csvSections.push(row.join(','));
    });
    csvSections.push('');
    
    // 5. Applicants Section
    csvSections.push('=== APPLICANTS BY PROJECT ===');
    csvSections.push('Project ID,Project Title,Applicant Name,Applicant Email,Status,Applied At,Experience,Location,Skills');
    
    Object.entries(dataset.applicantsByProject).forEach(([projectId, applicants]) => {
      const project = dataset.projects.find(p => p.id == projectId);
      applicants.forEach(applicant => {
        const skills = applicant.skills ? JSON.parse(applicant.skills).join('; ') : '';
        const row = [
          projectId,
          `"${(project?.title || '').replace(/"/g, '""')}"`,
          `"${(applicant.name || '').replace(/"/g, '""')}"`,
          applicant.email || '',
          applicant.status || '',
          applicant.appliedAt || '',
          applicant.experience || '',
          applicant.location || '',
          `"${skills.replace(/"/g, '""')}"`
        ];
        csvSections.push(row.join(','));
      });
    });
    
    return csvSections.join('\n');
  };

  const handleExportAnalytics = (format = 'json') => {
    try {
      const dataset = buildAnalyticsDataset();
      if (format === 'csv') {
        const csv = projectsToCsv();
        downloadBlob(csv, `project-analytics-projects-${Date.now()}.csv`, 'text/csv;charset=utf-8;');
        return;
      }
      const json = JSON.stringify(dataset, null, 2);
      downloadBlob(json, `project-analytics-${Date.now()}.json`, 'application/json');
    } catch (error) {
      console.error('Export analytics error:', error);
      toast.error('Failed to export analytics data');
    }
  };

  const handleAnalyticsExport = () => {
    setShowAnalyticsModal(true);
  };

  const handleConfirmAnalyticsExport = () => {
    handleExportAnalytics(analyticsExportFormat);
    setShowAnalyticsModal(false);
  };

  const handleGenerateReport = () => {
    try {
      const ds = buildAnalyticsDataset();
      const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Project Analytics Report</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
    h1 { margin: 0 0 8px; }
    h2 { margin: 24px 0 8px; }
    table { border-collapse: collapse; width: 100%; margin-top: 8px; }
    th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; font-size: 12px; }
    th { background: #f3f4f6; }
    small { color: #6b7280; }
  </style>
  </head>
  <body>
    <h1>Project Analytics Report</h1>
    <small>Generated at ${ds.generatedAt}</small>
    <h2>Summary</h2>
    <ul>
      <li>Total Projects: ${ds.summary.totalProjects}</li>
      <li>Active Projects: ${ds.summary.activeProjects}</li>
      <li>Total Applicants: ${ds.summary.totalApplicants}</li>
      <li>New Applicants (7d): ${ds.summary.newApplicantsThisWeek}</li>
      <li>Average Rating: ${ds.summary.avgRating}</li>
      <li>Completion Rate: ${ds.summary.completionRate}%</li>
      <li>Budget Utilization: ${ds.summary.budgetUtilizationPct}%</li>
    </ul>
    <h2>Top Skills</h2>
    <table>
      <thead><tr><th>Skill</th><th>Count</th><th>Percent</th></tr></thead>
      <tbody>
        ${ds.topSkills.map(s => `<tr><td>${s.name}</td><td>${s.count}</td><td>${s.pct}%</td></tr>`).join('')}
      </tbody>
    </table>
    <h2>Monthly Performance</h2>
    <table>
      <thead><tr><th>Month</th><th>Projects</th><th>Applicants</th></tr></thead>
      <tbody>
        ${ds.monthlyPerformance.map(m => `<tr><td>${m.label}</td><td>${m.projects}</td><td>${m.applicants}</td></tr>`).join('')}
      </tbody>
    </table>
    <h2>Projects</h2>
    <table>
      <thead><tr><th>ID</th><th>Title</th><th>Status</th><th>Applicants</th><th>Rating</th><th>Budget Min</th><th>Budget Max</th></tr></thead>
      <tbody>
        ${ds.projects.map(p => `<tr><td>${p.id}</td><td>${(p.title || '').replace(/</g,'&lt;')}</td><td>${p.status}</td><td>${p.applicantsCount || 0}</td><td>${p.rating || 0}</td><td>${p.budgetMin || ''}</td><td>${p.budgetMax || ''}</td></tr>`).join('')}
      </tbody>
    </table>
    <script>window.onload = () => { setTimeout(() => window.print(), 300); };</script>
  </body>
</html>`;
      const reportBlob = new Blob([html], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(reportBlob);
      window.open(url, '_blank');
      toast.success('Report opened in a new tab');
    } catch (error) {
      console.error('Generate report error:', error);
      toast.error('Failed to generate report');
    }
  };

  const handleShareInsights = async () => {
    try {
      const ds = buildAnalyticsDataset();
      
      // Generate professional PDF report
      const pdfHtml = generatePDFReport(ds);
      
      // Open PDF in new window for printing/saving
      const printWindow = window.open('', '_blank');
      printWindow.document.write(pdfHtml);
      printWindow.document.close();
      
      // Wait for content to load, then trigger print
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
      
      toast.success('📄 PDF report opened for printing/saving!');
      
    } catch (error) {
      console.error('Share insights error:', error);
      toast.error('Failed to generate PDF report. Please try again.');
    }
  };

  const generatePDFReport = (ds) => {
    const currentDate = new Date().toLocaleDateString();
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Analytics Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
            padding: 40px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #667eea;
        }
        
        .header h1 {
            color: #667eea;
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 700;
        }
        
        .header p {
            color: #666;
            font-size: 1.1em;
        }
        
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        
        .section h2 {
            color: #333;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #eee;
            font-size: 1.4em;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .metric-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .metric-card h3 {
            font-size: 2em;
            margin-bottom: 5px;
            font-weight: 700;
        }
        
        .metric-card p {
            opacity: 0.9;
            font-size: 0.9em;
        }
        
        .skills-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
        }
        
        .skill-item {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .skill-name {
            font-weight: 600;
            color: #333;
        }
        
        .skill-stats {
            color: #667eea;
            font-size: 0.9em;
        }
        
        .performance-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        
        .performance-table th,
        .performance-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #dee2e6;
        }
        
        .performance-table th {
            background: #667eea;
            color: white;
            font-weight: 600;
        }
        
        .performance-table tr:nth-child(even) {
            background: #f8f9fa;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
        
        .logo {
            font-size: 1.2em;
            font-weight: 700;
            color: #667eea;
        }
        
        @media print {
            body {
                padding: 20px;
            }
            .header h1 {
                font-size: 2em;
            }
            .metric-card {
                break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Project Analytics Report</h1>
        <p>Generated on ${currentDate}</p>
    </div>

    <div class="section">
        <h2>📈 Project Metrics</h2>
        <div class="metrics-grid">
            <div class="metric-card">
                <h3>${ds.summary.totalProjects}</h3>
                <p>Total Projects</p>
            </div>
            <div class="metric-card">
                <h3>${ds.summary.activeProjects}</h3>
                <p>Active Projects</p>
            </div>
            <div class="metric-card">
                <h3>${ds.summary.totalApplicants}</h3>
                <p>Total Applicants</p>
            </div>
            <div class="metric-card">
                <h3>${ds.summary.newApplicantsThisWeek}</h3>
                <p>New This Week</p>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>⭐ Performance Metrics</h2>
        <div class="metrics-grid">
            <div class="metric-card">
                <h3>${ds.summary.avgRating}/5</h3>
                <p>Average Rating</p>
            </div>
            <div class="metric-card">
                <h3>${ds.summary.completionRate}%</h3>
                <p>Completion Rate</p>
            </div>
            <div class="metric-card">
                <h3>${ds.summary.budgetUtilizationPct}%</h3>
                <p>Budget Utilization</p>
            </div>
        </div>
    </div>

    ${ds.topSkills.length > 0 ? `
    <div class="section">
        <h2>🎯 Top Skills</h2>
        <div class="skills-list">
            ${ds.topSkills.slice(0, 8).map(skill => `
                <div class="skill-item">
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-stats">${skill.count} applicants (${skill.pct}%)</span>
                </div>
            `).join('')}
        </div>
    </div>
    ` : ''}

    <div class="section">
        <h2>📅 Recent Performance</h2>
        <table class="performance-table">
            <thead>
                <tr>
                    <th>Period</th>
                    <th>Projects</th>
                    <th>Applicants</th>
                </tr>
            </thead>
            <tbody>
                ${ds.monthlyPerformance.map(month => `
                    <tr>
                        <td>${month.label}</td>
                        <td>${month.projects}</td>
                        <td>${month.applicants}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p class="logo">SkillBridge Pro</p>
        <p>Professional Project Analytics Report</p>
        <p>This report contains confidential project information. Please handle with care.</p>
    </div>
</body>
</html>`;
  };

  const handleProjectAction = async (projectId, action) => {
    const project = ownedProjects.find((p) => p.id === projectId);
    try {
      switch (action) {
        case "pause":
          await dispatch(
            updateProject({ id: projectId, data: { status: "paused" } })
          ).unwrap();
        
          break;
        case "resume":
          await dispatch(
            updateProject({ id: projectId, data: { status: "active" } })
          ).unwrap();
        
          break;
        case "close":
          await dispatch(
            updateProject({ id: projectId, data: { status: "completed" } })
          ).unwrap();
         
          break;
        case "boost":
          await dispatch(
            updateProject({ id: projectId, data: { isFeatured: true } })
          ).unwrap();
        
          break;
        case "delete":
          await dispatch(deleteProject(projectId)).unwrap();
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} project:`, error);
      toast.error(`Failed to ${action} project: ${error.message}`);
    }
  };

  const handleInviteDeveloper = (projectId) => {
    setSelectedProject(ownedProjects.find((p) => p.id === projectId));
    setShowInviteModal(true);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900'>
      <div className='px-6 py-8 space-y-8 max-w-7xl mx-auto'>
        {/* Enhanced Header with Notifications */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl'>
              <BarChart3 className='w-8 h-8 text-white' />
            </div>
            <div>
              <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                Project Owner Dashboard
              </h1>
              <p className='text-gray-300 text-sm'>
                Manage your projects and track performance
              </p>
            </div>
          </div>

          {/* Removed container-level AI Assistant button; inline field AI triggers are used instead */}
        </div>

        {/* Dashboard Stats */}
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8'>
          <MetricCard
            icon={BarChart3}
            value={dashboardStats.totalProjects}
            label='Total Projects'
            description='Total number of projects'
            gradientFrom='from-blue-500'
            gradientTo='to-cyan-500'
            progressWidth={100}
          />
          <MetricCard
            icon={Play}
            value={dashboardStats.activeProjects}
            label='Active'
            description='Number of active projects'
            gradientFrom='from-green-500'
            gradientTo='to-emerald-500'
            progressWidth={Math.min(
              100,
              (dashboardStats.activeProjects /
                Math.max(1, dashboardStats.totalProjects)) *
                100
            )}
          />
          <MetricCard
            icon={Users}
            value={dashboardStats.totalApplicants}
            label='Total Applicants'
            description='Total applicants across projects'
            gradientFrom='from-purple-500'
            gradientTo='to-pink-500'
            progressWidth={Math.min(
              100,
              dashboardStats.totalApplicants ? 100 : 0
            )}
          />
          <MetricCard
            icon={Bell}
            value={dashboardStats.newApplicants}
            label='New Applicants'
            description='New applicants this period'
            gradientFrom='from-yellow-500'
            gradientTo='to-orange-500'
            progressWidth={Math.min(
              100,
              (dashboardStats.newApplicants /
                Math.max(1, dashboardStats.totalApplicants)) *
                100
            )}
          />
          <MetricCard
            icon={Star}
            value={dashboardStats.avgRating}
            label='Avg Rating'
            description='Average project rating'
            gradientFrom='from-indigo-500'
            gradientTo='to-purple-500'
            progressWidth={(Number(dashboardStats.avgRating) / 5) * 100}
          />
          <MetricCard
            icon={DollarSign}
            value={dashboardStats.totalBudget}
            label='Total Budget'
            description='Aggregate budget range'
            gradientFrom='from-green-500'
            gradientTo='to-teal-500'
            progressWidth={67}
          />
          <MetricCard
            icon={Target}
            value={`${dashboardStats.completionRate}%`}
            label='Completion Rate'
            description='Percent of projects completed'
            gradientFrom='from-cyan-500'
            gradientTo='to-blue-500'
            progressWidth={dashboardStats.completionRate}
          />
          <MetricCard
            icon={Activity}
            value={dashboardStats.responseTime}
            label='Avg Response'
            description='Average response time'
            gradientFrom='from-pink-500'
            gradientTo='to-red-500'
            progressWidth={50}
          />
        </div>

        {/* Enhanced Tabs */}
        <div className='bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm p-2 rounded-2xl border border-white/10'>
          <div className='grid grid-cols-5 gap-2'>
            <Button
              onClick={() => handleTabChange("dashboard")}
              variant='ghost'
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === "dashboard"
                  ? "bg-white/20 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/15"
              }`}
            >
              <BarChart3 className='w-4 h-4 inline mr-2' />
              Dashboard
            </Button>
            <Button
              onClick={() => handleTabChange("my-projects")}
              variant='ghost'
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === "my-projects"
                  ? "bg-white/20 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/15"
              }`}
            >
              <BarChart3 className='w-4 h-4 inline mr-2' />
              My Projects
            </Button>
            <Button
              onClick={() => handleTabChange("create")}
              variant='ghost'
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === "create"
                  ? "bg-white/20 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/15"
              }`}
            >
              <Plus className='w-4 h-4 inline mr-2' />
              Create Project
            </Button>
            <Button
              onClick={() => handleTabChange("applicants")}
              variant='ghost'
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === "applicants"
                  ? "bg-white/20 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/15"
              }`}
            >
              <Users className='w-4 h-4 inline mr-2' />
              Applicants
            </Button>
            <Button
              onClick={() => handleTabChange("analytics")}
              variant='ghost'
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === "analytics"
                  ? "bg-white/20 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/15"
              }`}
            >
              <TrendingUp className='w-4 h-4 inline mr-2' />
              Analytics
            </Button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "dashboard" && (
          <div className='space-y-6'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {/* Recent Activity */}
              <div className='lg:col-span-2'>
                <SectionCard
                  icon={Activity}
                  title='Recent Activity'
                  iconColor='text-green-400'
                >
                  <div className='space-y-4'>
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-xl border ${
                          notification.read
                            ? "bg-white/5 border-white/10"
                            : "bg-blue-500/10 border-blue-500/20"
                        }`}
                      >
                        <div className='flex items-center justify-between'>
                          <p className='text-white text-sm'>
                            {notification.message}
                          </p>
                          <span className='text-gray-400 text-xs'>
                            {notification.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>

              {/* Quick Actions */}
              <div className='lg:col-span-1'>
                <SectionCard
                  icon={Zap}
                  title='Quick Actions'
                  iconColor='text-yellow-400'
                >
                  <div className='space-y-3'>
                    <Button
                      onClick={() => handleTabChange("create")}
                      className='w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2'
                    >
                      <Plus className='w-4 h-4' />
                      Create New Project
                    </Button>
                    <Button
                      onClick={() => setShowInviteDevelopersModal(true)}
                      className='w-full bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2'
                    >
                      <Users className='w-4 h-4' />
                      Invite Developers
                    </Button>
                    <Button
                      onClick={() => {
                        if (ownedProjects.length > 0) {
                          const firstProject = ownedProjects[0];
                          handleProjectAction(firstProject.id, "boost");
                        } else {
                          toast.info(
                            "Create a project first to boost visibility"
                          );
                        }
                      }}
                      className='w-full bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2'
                    >
                      <Award className='w-4 h-4' />
                      Boost Project Visibility
                    </Button>
                    <Button
                      onClick={() => handleTabChange("analytics")}
                      className='w-full bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2'
                    >
                      <TrendingUp className='w-4 h-4' />
                      View Analytics
                    </Button>
                  </div>
                </SectionCard>
              </div>
            </div>

            {/* Top Performing Projects */}
            <SectionCard
              icon={Star}
              title='Top Performing Projects'
              iconColor='text-yellow-400'
            >
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {ownedProjects
                  .sort(
                    (a, b) =>
                      (b.rating || 0) - (a.rating || 0) ||
                      (b.applicantsCount || 0) - (a.applicantsCount || 0)
                  )
                  .slice(0, 3)
                  .map((project) => (
                    <div
                      key={project.id}
                      className='bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300'
                    >
                      <div className='flex items-center justify-between mb-3'>
                        <h4 className='text-white font-semibold'>
                          {project.title}
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            project.status === "Active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                      <div className='space-y-2'>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='text-gray-400'>Applicants:</span>
                          <span className='text-white'>
                            {project.applicantsCount}
                          </span>
                        </div>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='text-gray-400'>Rating:</span>
                          <div className='flex items-center gap-1'>
                            <Star className='w-3 h-3 text-yellow-400 fill-yellow-400' />
                            <span className='text-white'>{project.rating}</span>
                          </div>
                        </div>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='text-gray-400'>Budget:</span>
                          <span className='text-white'>{project.budget}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </SectionCard>
          </div>
        )}

        {activeTab === "my-projects" && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                Your Projects
              </h1>
              <div className='flex items-center gap-3'>
                <span className='text-gray-300 text-sm'>
                  {ownedProjects.length} total
                </span>
                <Button
                  onClick={() => handleTabChange("create")}
                  className='bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2'
                >
                  <Plus className='w-4 h-4' />
                  New Project
                </Button>
              </div>
            </div>
            {ownedProjects.length === 0 ? (
              <div className='text-center py-12'>
                <BarChart3 className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                <p className='text-gray-400 text-lg'>No projects yet</p>
                <p className='text-gray-500 text-sm mt-2'>
                  Create your first project to get started
                </p>
                <Button
                  onClick={() => handleTabChange("create")}
                  className='mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto'
                >
                  <Plus className='w-4 h-4' />
                  Create Project
                </Button>
              </div>
            ) : (
              <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {ownedProjects.map((project) => (
                  <div
                    key={project.id}
                    className='bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/5 transition-all duration-300 h-full flex flex-col'
                  >
                    <div className='p-5 border-b border-white/10'>
                      <div className='flex items-start justify-between gap-3'>
                        <div className='flex items-center gap-3 min-w-0'>
                          <div className='p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shrink-0'>
                            <Briefcase className='w-4 h-4 text-white' />
                          </div>
                          <div className='min-w-0'>
                            <h3 className='text-white font-semibold truncate'>
                              {project.title}
                            </h3>
                            <div className='mt-1 flex items-center gap-2 flex-wrap'>
                              <span
                                className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                                  project.status === "Active"
                                    ? "bg-green-500/20 text-green-300"
                                    : project.status === "Upcoming"
                                      ? "bg-yellow-500/20 text-yellow-300"
                                      : "bg-gray-500/20 text-gray-300"
                                }`}
                              >
                                {project.status}
                              </span>
                              {project.isFeatured && (
                                <span className='px-2 py-0.5 text-[10px] font-semibold rounded-full bg-yellow-500/20 text-yellow-300'>
                                  Featured
                                </span>
                              )}
                              {project.isUrgent && (
                                <span className='px-2 py-0.5 text-[10px] font-semibold rounded-full bg-red-500/20 text-red-300'>
                                  Urgent
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='p-5 flex-1 flex flex-col gap-3'>
                      <div className='flex flex-wrap gap-1.5'>
                        {project.tags && project.tags.length > 0 ? (
                          <>
                            {project.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className='px-2 py-0.5 rounded-full text-[10px] text-white bg-gradient-to-r from-blue-500 to-purple-500'
                              >
                                {tag}
                              </span>
                            ))}
                            {project.tags.length > 3 && (
                              <span className='px-2 py-0.5 rounded-full text-[10px] text-gray-300 bg-white/10'>
                                +{project.tags.length - 3}
                              </span>
                            )}
                          </>
                        ) : null}
                      </div>

                      {/* Skills */}
                      {project.skills && project.skills.length > 0 && (
                        <div className='flex flex-wrap gap-1.5 items-center'>
                          <Code2 className='w-3 h-3 text-gray-400 shrink-0' />
                          <div className='flex flex-wrap gap-1.5'>
                            {project.skills.slice(0, 2).map((skill, idx) => (
                              <span
                                key={idx}
                                className='px-2 py-0.5 rounded-full text-[10px] text-emerald-300 bg-emerald-500/20 border border-emerald-400/30'
                              >
                                {skill}
                              </span>
                            ))}
                            {project.skills.length > 2 && (
                              <span className='px-2 py-0.5 rounded-full text-[10px] text-gray-300 bg-white/10'>
                                +{project.skills.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                        {/* Description preview */}
                        <p className='text-gray-300 text-xs leading-relaxed'>
                          {(project.description || '').length > 160
                            ? `${project.description.slice(0, 160)}…`
                            : (project.description || '')}
                        </p>
                      <div className='flex items-center justify-between text-xs text-gray-400'>
                        <span className='flex items-center gap-1'>
                          <DollarSign className='w-3 h-3' />
                          {project.budget}
                        </span>
                        <span className='flex items-center gap-1'>
                          <Clock className='w-3 h-3' />
                          {project.duration}
                        </span>
                      </div>
                    </div>
                    <div className='p-5 pt-0 mt-auto'>
                      <div className='flex gap-2'>
                        <Button
                          onClick={() => {
                            setSelectedProject(project);
                            setShowProjectModal(true);
                          }}
                          variant='ghost'
                          className='flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm'
                        >
                          View Details
                        </Button>
                        <Button
                          onClick={() => {
                            handleTabChange('create');
                            // pass project to form via ref after tab switch
                            setTimeout(() => {
                              if (projectFormRef.current) {
                                // no-op; form reads editingProject prop below
                              }
                            }, 0);
                            setSelectedProject(project);
                          }}
                          variant='ghost'
                          className='flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm'
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => {
                            setProjectToDelete(project);
                            setShowDeleteConfirm(true);
                          }}
                          variant='ghost'
                          className='flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm border border-red-500/30 text-red-300 bg-red-500/10 hover:bg-red-500/20 hover:text-red-200 transition-colors'
                        >
                          <Trash2 className='w-4 h-4' />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "create" && (
          <div className='space-y-6'>
            {/* Create Header */}
            <div className='bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10'>
              <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
                <div className='flex items-center gap-4'>
                  <div className='p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl'>
                    <Sparkles className='w-8 h-8 text-white' />
                  </div>
                  <div>
                    <h2 className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                      Post a New Project
                    </h2>
                    <p className='text-gray-300 text-sm'>
                      Fill the details below. You can use AI to draft a quality description.
                    </p>
                  </div>
                </div>
                <div className='flex flex-wrap gap-2'>
                  <Button
                    onClick={() => setShowPreview(!showPreview)}
                    variant='ghost'
                    className='bg-white/10 hover:bg-white/15 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 border border-white/10'
                  >
                    <Eye className='w-4 h-4' />
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </Button>
                  <Button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    variant='ghost'
                    className='bg-white/10 hover:bg-white/15 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 border border-white/10'
                  >
                    <Settings className='w-4 h-4' />
                    {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
                  </Button>
                  <div className='px-3 py-1 rounded-full text-xs bg-white/5 text-gray-300 border border-white/15 flex items-center gap-1'>
                    <RefreshCcw className='w-3 h-3 text-blue-300' />
                    Auto-save enabled
                  </div>
                  <div className='px-3 py-1 rounded-full text-xs bg-white/5 text-gray-300 border border-white/15 flex items-center gap-1'>
                    <FileText className='w-3 h-3 text-purple-300' />
                    Draft friendly
                  </div>
                </div>
              </div>
            </div>

            {/* Tips + Form */}
            <div className='grid grid-cols-1 xl:grid-cols-4 gap-6'>
              <div className='xl:col-span-3'>
                <ProjectForm
                  ref={projectFormRef}
                  dispatch={dispatch}
                  showPreview={showPreview}
                  showAdvanced={showAdvanced}
                  editingProject={selectedProject}
                  onProjectUpdated={() => {
                    dispatch(listProjects());
                    handleTabChange('my-projects');
                  }}
                  onProjectCreated={() => {
                    // Refresh projects list after creation
                    dispatch(listProjects());
                    handleTabChange("my-projects");
                  }}
                />
              </div>

              {/* Helper Panel */}
              <aside className='xl:col-span-1'>
                <div className='bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 sticky top-6 space-y-5'>
                  <h3 className='text-xl font-semibold text-white flex items-center gap-2'>
                    <Lightbulb className='w-5 h-5 text-yellow-400' />
                    Tips
                  </h3>
                  <ul className='text-sm text-gray-300 space-y-2 list-disc list-inside'>
                    <li>Keep the title concise and clear.</li>
                    <li>Mention key tech stack and seniority.</li>
                    <li>Add budget and duration for better matches.</li>
                    <li>
                      Use the AI Description button for a strong first draft.
                    </li>
                  </ul>

                  <div className='bg-white/5 rounded-xl p-4 border border-white/10'>
                    <p className='text-white font-medium mb-2'>Need a hand?</p>
                    <p className='text-gray-400 text-sm mb-3'>
                      Click “AI-Enhanced Description” beside the Description
                      field in the form.
                    </p>
                    <div className='flex items-center gap-2 text-xs text-gray-300'>
                      <Sparkles className='w-4 h-4 text-purple-300' />
                      Improves clarity and attractiveness
                    </div>
                  </div>

                  <div className='text-xs text-gray-400'>
                    Your project will be visible to developers once published.
                    You can save as draft anytime.
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}

        {activeTab === "applicants" && (
          <div className='space-y-6'>
            {/* Developer Management Style Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Developer Management</h2>
                  <p className="text-gray-300 text-sm">Manage and review all project applicants</p>
                </div>
              </div>
              
              {/* Projects dropdown for quick group chat creation */}
              <div className="flex items-center gap-3">
                {projects.length > 0 && (
                  <select
                    className="px-4 py-2 bg-gray-700/50 text-white rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => {
                      const projectId = e.target.value;
                      if (projectId) {
                        const project = projects.find((p) => p.id === Number(projectId));
                        if (project) {
                          handleCreateGroupChat(project);
                        }
                      }
                      e.target.value = ''; // Reset dropdown
                    }}
                    defaultValue=""
                  >
                    <option value="">Create Group Chat...</option>
                    {projects.map((project) => {
                      const applicants = projectApplicants[project.id] || [];
                      const shortlistedCount = applicants.filter(
                        (a) => a.status === 'shortlisted' || a.status === 'accepted'
                      ).length;
                      return (
                        <option key={project.id} value={project.id}>
                          {project.title} ({shortlistedCount} developers)
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
              <button className="px-6 py-3 rounded-lg font-medium transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                All
                <span className="ml-2 text-xs opacity-75">({projects.reduce((sum, p) => sum + ((projectApplicants[p.id] || []).length || 0), 0)})</span>
              </button>
              <button className="px-6 py-3 rounded-lg font-medium transition-all duration-300 bg-gray-700/50 text-gray-300 hover:bg-gray-600/50">
                Active
                <span className="ml-2 text-xs opacity-75">({projects.reduce((sum, p) => sum + ((projectApplicants[p.id] || []).filter(a => a.status === 'shortlisted').length || 0), 0)})</span>
              </button>
              <button className="px-6 py-3 rounded-lg font-medium transition-all duration-300 bg-gray-700/50 text-gray-300 hover:bg-gray-600/50">
                Onboarding
                <span className="ml-2 text-xs opacity-75">({projects.reduce((sum, p) => sum + ((projectApplicants[p.id] || []).filter(a => a.status === 'applied').length || 0), 0)})</span>
              </button>
              <button className="px-6 py-3 rounded-lg font-medium transition-all duration-300 bg-gray-700/50 text-gray-300 hover:bg-gray-600/50">
                Suspended
                <span className="ml-2 text-xs opacity-75">({projects.reduce((sum, p) => sum + ((projectApplicants[p.id] || []).filter(a => a.status === 'rejected').length || 0), 0)})</span>
              </button>
            </div>

            {/* Main Table Container */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-white/5">
                    <tr className="text-left text-gray-400 uppercase text-xs tracking-wider">
                      <th className="px-6 py-4 font-semibold">ID</th>
                      <th className="px-6 py-4 font-semibold">Developer Name</th>
                      <th className="px-6 py-4 font-semibold">Skills</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Assigned Project</th>
                      <th className="px-6 py-4 font-semibold">Joined Date</th>
                      <th className="px-6 py-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {projects.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center">
                          <Users className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                          <p className='text-gray-400 text-lg'>No projects yet</p>
                        </td>
                      </tr>
                    ) : (
                      (() => {
                        const projectsWithApplicants = projects.filter((p) => (projectApplicants[p.id] || []).length > 0);
                        if (projectsWithApplicants.length === 0) {
                          return (
                            <tr>
                              <td colSpan="7" className="px-6 py-12 text-center">
                                <Users className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                                <p className='text-gray-400 text-lg'>No applicants found</p>
                                <p className='text-gray-500 text-sm mt-2'>Applicants will appear here once developers apply to your projects</p>
                              </td>
                            </tr>
                          );
                        }
                        
                        let rowIndex = 1;
                        return projectsWithApplicants.flatMap((project) => {
                          const applicants = projectApplicants[project.id] || [];
                          return applicants.map((applicant) => {
                            const currentRowIndex = rowIndex++;
                            return (
                              <tr key={`${project.id}-${applicant.userId}`} className="hover:bg-white/5 transition-colors duration-200">
                                <td className="px-6 py-4 text-white font-medium">{currentRowIndex}</td>
                                
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                      {applicant.userId?.toString().charAt(0) || "D"}
                                    </div>
                                    <div>
                                      <p className="text-white font-medium">
                                        {applicant.name || applicant.fullName || applicant.username || `Developer ${applicant.userId}`}
                                      </p>
                                     
                                      {applicant.email && (
                                        <p className="text-gray-500 text-xs">{applicant.email}</p>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                
                                <td className="px-6 py-4">
                                  <div className="flex flex-wrap gap-1">
                                    {applicant.skills && Array.isArray(applicant.skills) && applicant.skills.length > 0 ? (
                                      applicant.skills.slice(0, 3).map((skill, i) => (
                                        <span
                                          key={i}
                                          className={`px-2 py-1 text-white text-xs rounded-full bg-gradient-to-r ${
                                            i === 0 ? 'from-purple-400 to-pink-500' :
                                            i === 1 ? 'from-blue-400 to-indigo-500' :
                                            'from-green-400 to-teal-500'
                                          }`}
                                        >
                                          {skill}
                                        </span>
                                      ))
                                    ) : (
                                      <>
                                        <span className="px-2 py-1 bg-gradient-to-r from-purple-400 to-pink-500 text-white text-xs rounded-full">
                                          {applicant.role || 'React'}
                                        </span>
                                        <span className="px-2 py-1 bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-xs rounded-full">
                                          JavaScript
                                        </span>
                                        <span className="px-2 py-1 bg-gradient-to-r from-green-400 to-teal-500 text-white text-xs rounded-full">
                                          Node.js
                                        </span>
                                      </>
                                    )}
                                    {applicant.skills && applicant.skills.length > 3 && (
                                      <span className="px-2 py-1 rounded-full text-xs text-gray-400 bg-white/10">
                                        +{applicant.skills.length - 3}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${
                                    applicant.status === 'applied' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                    applicant.status === 'shortlisted' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                    applicant.status === 'rejected' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                    'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                  }`}>
                                    {applicant.status === 'applied' && <Clock className="w-3 h-3" />}
                                    {applicant.status === 'shortlisted' && <CheckCircle className="w-3 h-3" />}
                                    {applicant.status === 'rejected' && <UserX className="w-3 h-3" />}
                                    {applicant.status || "Applied"}
                                  </span>
                                </td>
                                
                                <td className="px-6 py-4">
                                  <div>
                                    <p className="text-white font-medium">{project.title}</p>
                                    <p className="text-gray-400 text-sm">{project.company || 'Company'}</p>
                                  </div>
                                </td>
                                
                                <td className="px-6 py-4 text-gray-300">
                                  {new Date(applicant.appliedAt || applicant.createdAt || new Date()).toLocaleDateString()}
                                </td>
                                
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <Button className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-xs hover:bg-blue-500/30 transition-colors duration-300">
                                      <Eye className="w-3 h-3 mr-1 inline" />
                                      View
                                    </Button>
                                    
                                    <Button
                                      onClick={() => handleApplicantStatus(project.id, applicant.userId, 'shortlisted')}
                                      className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-xs hover:bg-green-500/30 transition-colors duration-300"
                                    >
                                      <UserCheck className="w-3 h-3 mr-1 inline" />
                                      Assign
                                    </Button>
                                    
                                    <Button
                                      onClick={() => handleApplicantStatus(project.id, applicant.userId, 'rejected')}
                                      className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs hover:bg-red-500/30 transition-colors duration-300"
                                    >
                                      <UserX className="w-3 h-3 mr-1 inline" />
                                      Suspend
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          });
                        });
                      })()
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className='space-y-6'>
            {/* Analytics Header */}
            <div className='bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10'>
              <div className='flex items-center gap-4'>
                <div className='p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl'>
                  <TrendingUp className='w-8 h-8 text-white' />
                </div>
                <div>
                  <h2 className='text-3xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent'>
                    Project Analytics
                  </h2>
                  <p className='text-gray-300 text-sm'>
                    Track performance, engagement, and growth metrics
                  </p>
                </div>
              </div>
            </div>

            {/* Key Metrics Overview */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {/* Project Performance Score */}
              <div className='bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg'>
                    <Target className='w-5 h-5 text-white' />
                  </div>
                  <span className='text-2xl font-bold text-white'>
                    {Math.round(
                      (dashboardStats.completionRate +
                        Number(dashboardStats.avgRating) * 20) /
                        2
                    )}
                    %
                  </span>
                </div>
                <h3 className='text-white font-semibold mb-1'>
                  Performance Score
                </h3>
                <p className='text-gray-400 text-sm'>Overall project health</p>
                <div className='mt-3 h-2 w-full bg-white/10 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-gradient-to-r from-blue-500 to-cyan-500'
                    style={{
                      width: `${Math.min(100, (dashboardStats.completionRate + Number(dashboardStats.avgRating) * 20) / 2)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Engagement Rate */}
              <div className='bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg'>
                    <Users className='w-5 h-5 text-white' />
                  </div>
                  <span className='text-2xl font-bold text-white'>
                    {dashboardStats.totalApplicants > 0
                      ? Math.round(
                          (dashboardStats.newApplicants /
                            dashboardStats.totalApplicants) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <h3 className='text-white font-semibold mb-1'>
                  Engagement Rate
                </h3>
                <p className='text-gray-400 text-sm'>New vs total applicants</p>
                <div className='mt-3 h-2 w-full bg-white/10 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-gradient-to-r from-purple-500 to-pink-500'
                    style={{
                      width: `${Math.min(100, dashboardStats.totalApplicants > 0 ? (dashboardStats.newApplicants / dashboardStats.totalApplicants) * 100 : 0)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Average Response Time */}
              <div className='bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg'>
                    <Clock className='w-5 h-5 text-white' />
                  </div>
                  <span className='text-lg font-bold text-white'>
                    {dashboardStats.responseTime}
                  </span>
                </div>
                <h3 className='text-white font-semibold mb-1'>
                  Avg Response Time
                </h3>
                <p className='text-gray-400 text-sm'>Time to first applicant</p>
                <div className='mt-3 h-2 w-full bg-white/10 rounded-full overflow-hidden'>
                  <div className='h-full bg-gradient-to-r from-green-500 to-emerald-500 w-3/4' />
                </div>
              </div>

              {/* Budget Utilization */}
              <div className='bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg'>
                    <DollarSign className='w-5 h-5 text-white' />
                  </div>
                  <span className='text-lg font-bold text-white'>{computedAnalytics.budgetUtilizationPct}%</span>
                </div>
                <h3 className='text-white font-semibold mb-1'>
                  Budget Utilization
                </h3>
                <p className='text-gray-400 text-sm'>Average across projects</p>
                <div className='mt-3 h-2 w-full bg-white/10 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-gradient-to-r from-yellow-500 to-orange-500'
                    style={{ width: `${Math.min(100, Math.max(0, computedAnalytics.budgetUtilizationPct))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Charts and Detailed Analytics */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Project Status Distribution */}
              <SectionCard
                icon={BarChart3}
                title='Project Status Distribution'
                iconColor='text-blue-400'
              >
                <div className='space-y-4'>
                  {[
                    {
                      status: "Active",
                      count: dashboardStats.activeProjects,
                      color: "from-green-500 to-emerald-500",
                      percentage: Math.round(
                        (dashboardStats.activeProjects /
                          Math.max(1, dashboardStats.totalProjects)) *
                          100
                      ),
                    },
                    {
                      status: "Completed",
                      count: Math.round(
                        (dashboardStats.completionRate / 100) *
                          dashboardStats.totalProjects
                      ),
                      color: "from-blue-500 to-cyan-500",
                      percentage: dashboardStats.completionRate,
                    },
                    {
                      status: "Paused",
                      count: Math.max(
                        0,
                        dashboardStats.totalProjects -
                          dashboardStats.activeProjects -
                          Math.round(
                            (dashboardStats.completionRate / 100) *
                              dashboardStats.totalProjects
                          )
                      ),
                      color: "from-yellow-500 to-orange-500",
                      percentage: Math.max(
                        0,
                        100 -
                          Math.round(
                            (dashboardStats.activeProjects /
                              Math.max(1, dashboardStats.totalProjects)) *
                              100
                          ) -
                          dashboardStats.completionRate
                      ),
                    },
                  ].map((item) => (
                    <div key={item.status} className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <span className='text-white font-medium'>
                          {item.status}
                        </span>
                        <span className='text-gray-300'>
                          {item.count} projects
                        </span>
                      </div>
                      <div className='h-2 w-full bg-white/10 rounded-full overflow-hidden'>
                        <div
                          className={`h-full bg-gradient-to-r ${item.color}`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Applicant Trends */}
              <SectionCard
                icon={TrendingUp}
                title='Applicant Trends'
                iconColor='text-purple-400'
              >
                <div className='space-y-4'>
                  <div className='flex items-center justify-between p-4 bg-white/5 rounded-xl'>
                    <div className='flex items-center gap-3'>
                      <div className='p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg'>
                        <Users className='w-4 h-4 text-white' />
                      </div>
                      <div>
                        <p className='text-white font-medium'>
                          Total Applicants
                        </p>
                        <p className='text-gray-400 text-sm'>
                          Across all projects
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='text-2xl font-bold text-white'>
                        {computedAnalytics.totalApplicantsDyn || dashboardStats.totalApplicants}
                      </p>
                      <p className='text-green-400 text-sm'>
                        +{computedAnalytics.thisWeekApplicants} this week
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center justify-between p-4 bg-white/5 rounded-xl'>
                    <div className='flex items-center gap-3'>
                      <div className='p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg'>
                        <Star className='w-4 h-4 text-white' />
                      </div>
                      <div>
                        <p className='text-white font-medium'>Average Rating</p>
                        <p className='text-gray-400 text-sm'>
                          Project quality score
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='text-2xl font-bold text-white'>
                        {dashboardStats.avgRating}
                      </p>
                      <p className='text-blue-400 text-sm'>out of 5.0</p>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* Project Performance Rankings */}
            <SectionCard
              icon={Award}
              title='Top Performing Projects'
              iconColor='text-yellow-400'
            >
              <div className='space-y-4'>
                {ownedProjects
                  .sort(
                    (a, b) =>
                      (b.rating || 0) - (a.rating || 0) ||
                      (b.applicantsCount || 0) - (a.applicantsCount || 0)
                  )
                  .slice(0, 5)
                  .map((project, index) => (
                    <div
                      key={project.id}
                      className='flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-300'
                    >
                      <div className='flex items-center gap-4'>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0
                              ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                              : index === 1
                                ? "bg-gradient-to-r from-gray-400 to-gray-500"
                                : index === 2
                                  ? "bg-gradient-to-r from-orange-500 to-red-500"
                                  : "bg-gradient-to-r from-blue-500 to-purple-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <h4 className='text-white font-semibold'>
                            {project.title}
                          </h4>
                          <div className='flex items-center gap-4 text-sm text-gray-400'>
                            <span className='flex items-center gap-1'>
                              <Users className='w-3 h-3' />
                              {project.applicantsCount} applicants
                            </span>
                            <span className='flex items-center gap-1'>
                              <Star className='w-3 h-3 text-yellow-400' />
                              {project.rating}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                project.status === "Active"
                                  ? "bg-green-500/20 text-green-400"
                                  : project.status === "Completed"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                              }`}
                            >
                              {project.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className='text-right'>
                        <p className='text-white font-semibold'>
                          {project.budget}
                        </p>
                        <p className='text-gray-400 text-sm'>
                          {project.duration}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </SectionCard>

            {/* Time-based Analytics */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Monthly Performance */}
              <SectionCard
                icon={Activity}
                title='Monthly Performance'
                iconColor='text-green-400'
              >
                <div className='space-y-4'>
                  {computedAnalytics.monthlyPerformance.map((item, index) => (
                    <div
                      key={item.label}
                      className='flex items-center justify-between p-3 bg-white/5 rounded-lg'
                    >
                      <span className='text-white font-medium'>
                        {item.label}
                      </span>
                      <div className='flex items-center gap-4'>
                        <div className='text-center'>
                          <p className='text-white font-semibold'>
                            {item.projects}
                          </p>
                          <p className='text-gray-400 text-xs'>Projects</p>
                        </div>
                        <div className='text-center'>
                          <p className='text-white font-semibold'>
                            {item.applicants}
                          </p>
                          <p className='text-gray-400 text-xs'>Applicants</p>
                        </div>
                        <div
                          className={`w-3 h-3 rounded-full bg-gradient-to-r ${index === 0 ? 'from-green-500 to-emerald-500' : index === 1 ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Skill Demand Analysis */}
              <SectionCard
                icon={Zap}
                title='Top Skills in Demand'
                iconColor='text-yellow-400'
              >
                <div className='space-y-3'>
                  {computedAnalytics.topSkills && computedAnalytics.topSkills.length > 0 ? (
                    computedAnalytics.topSkills.map((s, index) => (
                      <div
                        key={s.name}
                        className='flex items-center justify-between'
                      >
                        <span className='text-white font-medium'>{s.name}</span>
                        <div className='flex items-center gap-2'>
                          <div className='w-24 h-2 bg-white/10 rounded-full overflow-hidden'>
                            <div
                              className='h-full bg-gradient-to-r from-yellow-500 to-orange-500'
                              style={{
                                width: `${Math.min(100, Math.max(10, s.pct))}%`,
                              }}
                            />
                          </div>
                          <span className='text-gray-300 text-sm w-8 text-right'>
                            {Math.min(100, Math.max(10, s.pct))}%
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='space-y-3'>
                      <div className='flex items-center justify-between'>
                        <span className='text-white font-medium'>React</span>
                        <div className='flex items-center gap-2'>
                          <div className='w-24 h-2 bg-white/10 rounded-full overflow-hidden'>
                            <div className='h-full bg-gradient-to-r from-yellow-500 to-orange-500 w-[85%]' />
                          </div>
                          <span className='text-gray-300 text-sm w-8 text-right'>85%</span>
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-white font-medium'>JavaScript</span>
                        <div className='flex items-center gap-2'>
                          <div className='w-24 h-2 bg-white/10 rounded-full overflow-hidden'>
                            <div className='h-full bg-gradient-to-r from-yellow-500 to-orange-500 w-[78%]' />
                          </div>
                          <span className='text-gray-300 text-sm w-8 text-right'>78%</span>
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-white font-medium'>Node.js</span>
                        <div className='flex items-center gap-2'>
                          <div className='w-24 h-2 bg-white/10 rounded-full overflow-hidden'>
                            <div className='h-full bg-gradient-to-r from-yellow-500 to-orange-500 w-[72%]' />
                          </div>
                          <span className='text-gray-300 text-sm w-8 text-right'>72%</span>
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-white font-medium'>Python</span>
                        <div className='flex items-center gap-2'>
                          <div className='w-24 h-2 bg-white/10 rounded-full overflow-hidden'>
                            <div className='h-full bg-gradient-to-r from-yellow-500 to-orange-500 w-[65%]' />
                          </div>
                          <span className='text-gray-300 text-sm w-8 text-right'>65%</span>
                        </div>
                      </div>
                      <div className='flex items-center justify-between'>
                        <span className='text-white font-medium'>AWS</span>
                        <div className='flex items-center gap-2'>
                          <div className='w-24 h-2 bg-white/10 rounded-full overflow-hidden'>
                            <div className='h-full bg-gradient-to-r from-yellow-500 to-orange-500 w-[58%]' />
                          </div>
                          <span className='text-gray-300 text-sm w-8 text-right'>58%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </SectionCard>
            </div>

            {/* Quick Actions for Analytics */}
            <SectionCard
              icon={Lightbulb}
              title='Analytics Actions'
              iconColor='text-yellow-400'
              className='bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20'
            >
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Button
                  onClick={handleAnalyticsExport}
                  className='w-full bg-white/10 hover:bg-white/20 text-white p-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2'
                >
                  <TrendingUp className='w-4 h-4' />
                  Export Data
                </Button>
                <Button
                  onClick={handleGenerateReport}
                  className='w-full bg-white/10 hover:bg-white/20 text-white p-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2'
                >
                  <BarChart3 className='w-4 h-4' />
                  Generate Report
                </Button>
                <Button
                  onClick={handleShareInsights}
                  className='w-full bg-white/10 hover:bg-white/20 text-white p-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2'
                >
                  <Sparkles className='w-4 h-4' />
                  Share Insights
                </Button>
              </div>
            </SectionCard>
          </div>
        )}

        {/* Owner Project Details Modal */}
        {showProjectModal && selectedProject && (
          <Modal
            isOpen={showProjectModal}
            onClose={() => setShowProjectModal(false)}
            title={selectedProject.title}
            subtitle={`${selectedProject.company} • ${selectedProject.location}`}
            icon={Briefcase}
            size='large'
          >
            <div className='p-6 space-y-6 overflow-y-auto'>
              {/* Key figures */}
              <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                <div className='bg-white/5 rounded-xl p-4 border border-white/10'>
                  <p className='text-gray-400 text-xs mb-1'>Budget</p>
                  <p className='text-white font-semibold'>{selectedProject.budget}</p>
                </div>
                <div className='bg-white/5 rounded-xl p-4 border border-white/10'>
                  <p className='text-gray-400 text-xs mb-1'>Duration</p>
                  <p className='text-white font-semibold'>{selectedProject.duration || 'TBD'}</p>
                </div>
                <div className='bg-white/5 rounded-xl p-4 border border-white/10'>
                  <p className='text-gray-400 text-xs mb-1'>Applicants</p>
                  <p className='text-white font-semibold'>{selectedProject.applicantsCount || 0}</p>
                </div>
                <div className='bg-white/5 rounded-xl p-4 border border-white/10'>
                  <p className='text-gray-400 text-xs mb-1'>Location</p>
                  <p className='text-white font-semibold'>{selectedProject.location}</p>
                </div>
              </div>

              {/* About */}
              <div>
                <h4 className='text-white font-semibold mb-2'>About the project</h4>
                <p className='text-gray-300 leading-relaxed whitespace-pre-wrap'>
                  {selectedProject.description}
                </p>
              </div>

              {/* Tags */}
              <div>
                <h4 className='text-white font-semibold mb-2'>Tags</h4>
                <div className='flex flex-wrap gap-2'>
                  {(selectedProject.tags || []).map((tag, idx) => (
                    <span key={idx} className='px-2 py-1 rounded-full text-xs text-white bg-gradient-to-r from-blue-500 to-purple-500'>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Skills */}
              {selectedProject.skills && selectedProject.skills.length > 0 && (
                <div>
                  <h4 className='text-white font-semibold mb-2 flex items-center gap-2'>
                    <Code2 className='w-4 h-4 text-gray-400' />
                    Required Skills
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {selectedProject.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className='px-3 py-1.5 rounded-full text-xs text-emerald-300 bg-emerald-500/20 border border-emerald-400/30'
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Core details */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='bg-white/5 rounded-xl p-4 border border-white/10'>
                  <p className='text-gray-400 text-xs mb-1'>Role Needed</p>
                  <p className='text-white font-semibold'>{selectedProject.roleNeeded || '—'}</p>
                </div>
                <div className='bg-white/5 rounded-xl p-4 border border-white/10'>
                  <p className='text-gray-400 text-xs mb-1'>Category</p>
                  <p className='text-white font-semibold'>{selectedProject.category || '—'}</p>
                </div>
                <div className='bg-white/5 rounded-xl p-4 border border-white/10'>
                  <p className='text-gray-400 text-xs mb-1'>Experience</p>
                  <p className='text-white font-semibold'>{selectedProject.experience || '—'}</p>
                </div>
              </div>

              {/* Timeline */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='bg-white/5 rounded-xl p-4 border border-white/10'>
                  <p className='text-gray-400 text-xs mb-1'>Start Date</p>
                  <p className='text-white font-semibold'>
                    {selectedProject.startDate ? new Date(selectedProject.startDate).toLocaleDateString() : '—'}
                  </p>
                </div>
                <div className='bg-white/5 rounded-xl p-4 border border-white/10'>
                  <p className='text-gray-400 text-xs mb-1'>Deadline</p>
                  <p className='text-white font-semibold'>
                    {selectedProject.deadline ? new Date(selectedProject.deadline).toLocaleDateString() : '—'}
                  </p>
                </div>
                <div className='bg-white/5 rounded-xl p-4 border border-white/10'>
                  <p className='text-gray-400 text-xs mb-1'>Remote</p>
                  <p className='text-white font-semibold'>{selectedProject.isRemote ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {/* Priority & Status */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='bg-white/5 rounded-xl p-4 border border-white/10'>
                  <p className='text-gray-400 text-xs mb-1'>Priority</p>
                  <p className='text-white font-semibold'>{selectedProject.priority}</p>
                </div>
                <div className='bg-white/5 rounded-xl p-4 border border-white/10'>
                  <p className='text-gray-400 text-xs mb-1'>Status</p>
                  <p className='text-white font-semibold'>{selectedProject.status}</p>
                </div>
              </div>

              {/* Company & Website */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='bg-white/5 rounded-xl p-4 border border-white/10'>
                  <p className='text-gray-400 text-xs mb-1'>Company</p>
                  <p className='text-white font-semibold'>{selectedProject.company || '—'}</p>
                </div>
                <div className='bg-white/5 rounded-xl p-4 border border-white/10'>
                  <p className='text-gray-400 text-xs mb-1'>Website</p>
                  {selectedProject.website ? (
                    <a href={selectedProject.website} target='_blank' rel='noreferrer' className='text-blue-300 hover:underline break-all'>
                      {selectedProject.website}
                    </a>
                  ) : (
                    <p className='text-white font-semibold'>—</p>
                  )}
                </div>
              </div>

              {/* Language & Timezone */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='bg-white/5 rounded-xl p-4 border border-white/10'>
                  <p className='text-gray-400 text-xs mb-1'>Language</p>
                  <p className='text-white font-semibold'>{selectedProject.language || '—'}</p>
                </div>
                <div className='bg-white/5 rounded-xl p-4 border border-white/10'>
                  <p className='text-gray-400 text-xs mb-1'>Timezone</p>
                  <p className='text-white font-semibold'>{selectedProject.timezone || '—'}</p>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h4 className='text-white font-semibold mb-2'>Requirements</h4>
                <pre className='text-gray-300 text-sm whitespace-pre-wrap bg-white/5 rounded-xl p-4 border border-white/10'>
                  {selectedProject.requirements || '—'}
                </pre>
              </div>

              {/* Benefits */}
              <div>
                <h4 className='text-white font-semibold mb-2'>Benefits & Perks</h4>
                <pre className='text-gray-300 text-sm whitespace-pre-wrap bg-white/5 rounded-xl p-4 border border-white/10'>
                  {selectedProject.benefits || '—'}
                </pre>
              </div>
            </div>
          </Modal>
        )}

        {/* Invite Developers Modal */}
        {showInviteDevelopersModal && (
          <InviteDevelopers
            selectedProject={selectedProject}
            onClose={() => setShowInviteDevelopersModal(false)}
            onInviteSent={(developer) => {
            }}
          />
        )}
      </div>

      {showDeleteConfirm && projectToDelete && (
        <ConfirmModal
          isOpen={showDeleteConfirm}
          title="Delete Project"
          message={`Are you sure you want to permanently delete "${projectToDelete.title}"? This will remove the project, its applicants, updates, and files. This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          onClose={() => {
            setShowDeleteConfirm(false);
            setProjectToDelete(null);
          }}
          onConfirm={async () => {
            try {
              await handleProjectAction(projectToDelete.id, 'delete');
            } finally {
              setShowDeleteConfirm(false);
              setProjectToDelete(null);
              dispatch(listProjects());
            }
          }}
        />
      )}

      {/* Analytics Export Modal */}
      {showAnalyticsModal && (
        <Modal
          isOpen={showAnalyticsModal}
          onClose={() => setShowAnalyticsModal(false)}
          title="Export Analytics Data"
          subtitle="Choose format for your analytics export"
          icon={TrendingUp}
          size="medium"
        >
          <div className="p-6 space-y-6">
            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Export Format
              </label>
              <div className="flex gap-3">
                {[
                  { value: 'json', label: 'JSON Data', icon: '📊', desc: 'Structured data for analysis' },
                  { value: 'csv', label: 'CSV Spreadsheet', icon: '📈', desc: 'Spreadsheet format' }
                ].map((format) => (
                  <button
                    key={format.value}
                    onClick={() => setAnalyticsExportFormat(format.value)}
                    className={`flex-1 p-4 rounded-lg border transition-colors duration-200 ${
                      analyticsExportFormat === format.value
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-2xl mb-2">{format.icon}</div>
                    <div className="font-medium">{format.label}</div>
                    <div className="text-sm text-gray-400 mt-1">{format.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Export Info */}
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h4 className="text-blue-400 font-medium mb-2">What will be exported:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Project summary and statistics</li>
                <li>• Monthly performance data</li>
                <li>• Top skills analysis</li>
                <li>• All project details</li>
                <li>• Applicant data by project</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setShowAnalyticsModal(false)}
                variant="ghost"
                className="flex-1 bg-white/10 hover:bg-white/20 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmAnalyticsExport}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Export {analyticsExportFormat.toUpperCase()}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Share Insights Modal */}
      {showShareModal && (
        <Modal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title="Share Project Insights"
          subtitle="Copy or download your analytics summary"
          icon={Sparkles}
          size="large"
        >
          <div className="p-6 space-y-6">
            <div className="bg-white/5 rounded-lg border border-white/10 p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{shareContent}</pre>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(shareContent);
                    toast.success('📋 Copied to clipboard!');
                  } catch (error) {
                    toast.error('Failed to copy');
                  }
                }}
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
              >
                Copy to Clipboard
              </Button>
              <Button
                onClick={() => {
                  downloadBlob(shareContent, `project-insights-${Date.now()}.txt`, 'text/plain');
                }}
                className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
              >
                Download TXT
              </Button>
              <Button
                onClick={() => setShowShareModal(false)}
                className="bg-white/10 hover:bg-white/20 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Group Chat Creation Modal */}
      {showGroupChatModal && selectedProjectForGroupChat && (
        <Modal
          isOpen={showGroupChatModal}
          onClose={() => {
            setShowGroupChatModal(false);
            setSelectedProjectForGroupChat(null);
            setSelectedDevelopers([]);
            setGroupChatName('');
            setIsCreatingGroupChat(false);
          }}
          title="Create Group Chat"
        >
          <div className="flex flex-col h-full max-h-[calc(90vh-120px)]">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Project Info */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-white/10">
              <p className="text-sm text-gray-300">Project</p>
              <p className="text-white font-semibold text-lg">{selectedProjectForGroupChat.title}</p>
            </div>

            {/* Group Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Group Chat Name
              </label>
              <input
                type="text"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                placeholder="Enter group chat name"
                className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Developer Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Select Developers ({selectedDevelopers.length} selected)
              </label>
              <div className="max-h-64 overflow-y-auto space-y-2 border border-white/10 rounded-lg p-4 bg-gray-800/50">
                {(projectApplicants[selectedProjectForGroupChat.id] || []).map((applicant) => {
                  const isSelected = selectedDevelopers.includes(applicant.userId);
                  const isEligible = applicant.status === 'shortlisted' || applicant.status === 'accepted';
                  
                  return (
                    <div
                      key={applicant.userId}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        isSelected
                          ? 'bg-blue-500/20 border-blue-500/50'
                          : isEligible
                          ? 'bg-gray-700/50 border-white/10 hover:bg-gray-700/70'
                          : 'bg-gray-800/30 border-white/5 opacity-50'
                      }`}
                    >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {applicant.userId?.toString().charAt(0) || "D"}
                        </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">
                            {applicant.name || applicant.fullName || applicant.username || `Developer ${applicant.userId}`}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {applicant.status || 'applied'}
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDevelopers([...selectedDevelopers, applicant.userId]);
                          } else {
                            setSelectedDevelopers(selectedDevelopers.filter((id) => id !== applicant.userId));
                          }
                        }}
                        disabled={!isEligible}
                          className="w-5 h-5 rounded border-white/20 bg-gray-700 text-blue-500 focus:ring-2 focus:ring-blue-500 flex-shrink-0 ml-2"
                      />
                    </div>
                  );
                })}
              </div>
              {selectedDevelopers.length === 0 && (
                <p className="text-yellow-400 text-sm mt-2">
                  ⚠️ Please select at least one developer to create the group chat
                </p>
              )}
              </div>
            </div>

            {/* Action Buttons - Sticky at bottom */}
            <div className="flex-shrink-0 p-6 pt-4 border-t border-white/10 bg-slate-900">
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button
                onClick={() => {
                  setShowGroupChatModal(false);
                  setSelectedProjectForGroupChat(null);
                  setSelectedDevelopers([]);
                  setGroupChatName('');
                  setIsCreatingGroupChat(false);
                }}
                  className="w-full sm:w-auto bg-gray-700/50 hover:bg-gray-600/50 text-white border border-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmGroupChat}
                disabled={selectedDevelopers.length === 0 || !groupChatName.trim() || isCreatingGroupChat}                                                                             
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"                 
              >
                {isCreatingGroupChat ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4" />
                Create Group Chat
                  </>
                )}
              </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Global AI Assistant Modal mounted at container level */}
  {/* Inline assistants are rendered within ProjectForm */}
    </div>
  );
};

export default ProjectOwnerProjects;
