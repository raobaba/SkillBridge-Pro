import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Search,
  Filter,
  Heart,
  Share2,
  Bookmark,
  MapPin,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
  Target,
  Briefcase,
  LayoutGrid,
  List,
  Code2,
} from "lucide-react";
import { Button, FilterSummary } from "../../../components";
import Input from "../../../components/Input";
import { toast } from "react-toastify";
import { useFilterOptions } from "../hooks/useFilterOptions";
import ProjectCard from "./ProjectCard";

import {
  applyToProject,
  addProjectFavorite,
  removeProjectFavorite,
  withdrawApplication,
  addProjectSave,
  removeProjectSave,
  getProjectSaves,
  getPublicProjects,
  getSearchSuggestions,
  getAppliedProjects,
  getProject,
  getMyApplications,
  getMyApplicationsCount,
} from "../slice/projectSlice";

const DeveloperProjects = ({
  user,
  projects,
  publicProjects = [],
  filterOptions = null,
  myInvites = [],
  recommendations,
  favorites = [],
  saves = [],
  appliedProjects = [],
  dispatch,
  error,
  message,
}) => {
  const [activeTab, setActiveTab] = useState("discover"); // discover | applications
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedExperienceLevel, setSelectedExperienceLevel] = useState("all");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [isRemoteOnly, setIsRemoteOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showFilters, setShowFilters] = useState(false);
  const [applicationStatusByProjectId, setApplicationStatusByProjectId] =
    useState({}); // { [id]: 'Applied' | 'Interviewing' | 'Shortlisted' | 'Accepted' | 'Rejected' }
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [internalSearch, setInternalSearch] = useState("");
  const [savingProjectId, setSavingProjectId] = useState(null);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState({ skills: [], tags: [] });
  const [appliedProjectsData, setAppliedProjectsData] = useState({}); // { [id]: project }

  // Initialize tab from URL (?tab=applications|discover)
  useEffect(() => {
    const urlTab = (searchParams.get('tab') || '').toLowerCase();
    if (urlTab === 'applications' || urlTab === 'discover') {
      setActiveTab(urlTab);
    }
  }, [searchParams]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    const next = new URLSearchParams(searchParams.toString());
    next.set('tab', tab);
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  // Check if user is developer - must be declared before useEffects that use it
  const isDeveloper = user?.role === "developer";

  // Get appliedProjects from Redux state (populated by getAppliedProjects API)
  const appliedProjectsFromRedux = useSelector((state) => state.project?.appliedProjects) || [];
  
  // Use Redux state if available, fallback to prop
  // Ensure all IDs are numbers for consistent comparison
  const finalAppliedProjects = useMemo(() => {
    const source = appliedProjectsFromRedux.length > 0 ? appliedProjectsFromRedux : appliedProjects;
    return source.map(id => Number(id)).filter(id => !isNaN(id));
  }, [appliedProjectsFromRedux, appliedProjects]);

  // Load applied projects from project_applicants table via API on mount
  useEffect(() => {
    if (isDeveloper) {
      dispatch(getAppliedProjects()).then((result) => {
        // result.payload contains {projectIds: [35, 33, 32], statusMap: {35: 'applied', 33: 'shortlisted'}, userId: 1}
        console.log('getAppliedProjects response - Project IDs with status from project_applicants table:', {
          projectIds: result.payload?.projectIds || result.payload || [],
          statusMap: result.payload?.statusMap || {},
          total: Array.isArray(result.payload?.projectIds) ? result.payload.projectIds.length : (Array.isArray(result.payload) ? result.payload.length : 0)
        });
      });
    }
  }, [dispatch, isDeveloper]);

  useEffect(() => {
    const fetchAppliedProjectData = async () => {
      if (!finalAppliedProjects || finalAppliedProjects.length === 0) return;
      
      const existingIds = new Set([
        ...((projects || []).map((p) => p.id)),
        ...((publicProjects || []).map((p) => p.id)),
        ...Object.keys(appliedProjectsData).map((k) => Number(k)),
      ]);

      const missingIds = finalAppliedProjects.filter(id => !existingIds.has(id));
      
      if (missingIds.length > 0) {
        for (const id of missingIds) {
          try {
            const res = await dispatch(getProject(id)).unwrap();
            const proj = res?.project || res?.data?.project || res;
            if (proj && proj.id) {
              setAppliedProjectsData((prev) => ({ ...prev, [proj.id]: proj }));
            }
          } catch (error) {
            console.error('Failed to load project details for application:', id, error);
          }
        }
      }
    };
    
    fetchAppliedProjectData();
  }, [finalAppliedProjects, dispatch, projects, publicProjects, appliedProjectsData]);

  // Handle toast notifications
  useEffect(() => {
    if (message) {
      toast.success(message);
    }
    if (error) {
      toast.error(error);
    }
  }, [message, error]);

  // Helper function to get display labels for status and priority
  const getDisplayLabel = useCallback((value, type) => {
    if (type === 'status') {
      const statusMap = {
        'active': 'Active',
        'upcoming': 'Upcoming', 
        'draft': 'Draft',
        'paused': 'Paused',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
      };
      return statusMap[value] || value;
    }
    if (type === 'priority') {
      const priorityMap = {
        'high': 'High Priority',
        'medium': 'Medium Priority',
        'low': 'Low Priority'
      };
      return priorityMap[value] || value;
    }
    return value;
  }, []);

  // Map API data to match UI expectations (memoized)
  const mapProjectData = useCallback((project) => ({
    id: project.id,
    title: project.title,
    status: project.status || "active",
    priority: project.priority || "medium",
    statusDisplay: getDisplayLabel(project.status || "active", 'status'),
    priorityDisplay: getDisplayLabel(project.priority || "medium", 'priority'),
    description: project.description,
    roleNeeded: project.roleNeeded,
    applicantsCount: project.applicantsCount || 0,
    tags: project.tags || [],
    skills: project.skills || [],
    rating: parseFloat(project.ratingAvg) || 0,
    budget: project.budgetMin && project.budgetMax
      ? `$${project.budgetMin.toLocaleString()} - $${project.budgetMax.toLocaleString()}`
      : "Budget TBD",
    location: project.isRemote ? "Remote" : project.location || "Remote",
    duration: project.duration || "TBD",
    experience: project.experienceLevel?.charAt(0).toUpperCase() + project.experienceLevel?.slice(1) || "Mid Level",
    category: project.category || "Web Development",
    isRemote: project.isRemote,
    isFeatured: project.isFeatured,
    company: project.company || "Company",
    matchScore: project.matchScoreAvg || 0,
    benefits: project.benefits,
    createdAt: project.createdAt,
  }), []);

  // Prefer authenticated projects; fallback to publicProjects (memoized)
  const baseProjects = useMemo(
    () => (projects && projects.length > 0 ? projects : publicProjects || []),
    [projects, publicProjects]
  );
  // If user is a developer, always allow actions (apply/save/favorite) even when using public feed
  const isPublicOnly = (!isDeveloper) && (!projects || projects.length === 0);

  // Load saves from Redux when component mounts
  useEffect(() => {
    if (!isPublicOnly) {
      dispatch(getProjectSaves());
    }
  }, [dispatch, isPublicOnly]);

  // Use projects from Redux state and map them (memoized)
  const displayProjects = useMemo(
    () => (baseProjects || []).map(mapProjectData),
    [baseProjects]
  );
  const [filteredProjects, setFilteredProjects] = useState([]);
  
  const myApplicationsCount = useSelector((state) => state.project?.myApplicationsCount) ?? finalAppliedProjects.length;
  const myApplications = useSelector((state) => state.project?.myApplications) || [];
  const appliedProjectsStatusMap = useSelector((state) => state.project?.appliedProjectsStatusMap) || {}; // ✅ Status from IDs API

  // Create proper application status mapping from myApplications data
  // This data comes from /api/v1/projects/applications/my which queries project_applicants table
  const applicationStatusMap = useMemo(() => {
    const statusMap = {};
    (myApplications || []).forEach(app => {
      if (app.projectId) {
        // Store with both numeric and original key for compatibility
        const numericId = Number(app.projectId);
        const statusData = {
          status: app.status || 'applied', // Status from project_applicants.status column in database
          appliedAt: app.appliedAt || app.createdAt,
          notes: app.notes || '',
          id: app.id,
          // Include all application data for debugging
          fullData: app
        };
        // Store with numeric key (primary)
        statusMap[numericId] = statusData;
        // Also store with original key if different (for backward compatibility)
        if (numericId !== app.projectId) {
          statusMap[app.projectId] = statusData;
        }
      }
    });
    
    // Merge status from IDs API (appliedProjectsStatusMap) for projects not in myApplications
    // This ensures we have status for all applied projects even if myApplications hasn't loaded yet
    Object.keys(appliedProjectsStatusMap).forEach(projectIdKey => {
      const numericId = Number(projectIdKey);
      const statusFromIdsApi = appliedProjectsStatusMap[projectIdKey];
      
      // Only add if not already in statusMap (myApplications takes priority)
      if (!statusMap[numericId] && !statusMap[projectIdKey] && statusFromIdsApi) {
        statusMap[numericId] = {
          status: statusFromIdsApi,
          appliedAt: null,
          notes: '',
          id: null,
          source: 'ids-api' // Mark that this came from IDs API
        };
        if (numericId !== projectIdKey) {
          statusMap[projectIdKey] = statusMap[numericId];
        }
      }
    });
    
    // Debug log to verify status data is being mapped correctly
    if (Object.keys(statusMap).length > 0) {
      console.log('applicationStatusMap created from myApplications + IDs API (database):', {
        totalApplications: Object.keys(statusMap).length,
        fromMyApplications: myApplications.length,
        fromIdsApi: Object.keys(appliedProjectsStatusMap).length,
        sampleStatus: Object.values(statusMap)[0]?.status,
        statuses: Object.values(statusMap).map(s => ({ projectId: s.fullData?.projectId || 'ids-api', status: s.status }))
      });
    }
    
    return statusMap;
  }, [myApplications, appliedProjectsStatusMap]);

  // Get application status for a project
  // PRIORITY: Database status (from project_applicants table) > Optimistic local state
  const getApplicationStatus = useCallback((projectId) => {
    const numericId = Number(projectId);
    
    // PRIORITY 1: Check database status from myApplications (source of truth)
    const appData = applicationStatusMap[numericId] || applicationStatusMap[projectId];
    if (appData && appData.status) {
      return appData.status; // Database status from project_applicants table
    }
    
    // PRIORITY 2: Fallback to optimistic local state (for immediate UI updates)
    const optimisticStatus = applicationStatusByProjectId[numericId] || applicationStatusByProjectId[projectId];
    if (optimisticStatus) {
      return optimisticStatus;
    }
    
    return null;
  }, [applicationStatusByProjectId, applicationStatusMap]);

  // Resolve a project by id from multiple sources
  const getProjectById = useCallback((id) => {
    if (!id) return null;
    const fromLocal = (projects || []).find((p) => p.id === id);
    if (fromLocal) return mapProjectData(fromLocal);
    const fromPublic = (publicProjects || []).find((p) => p.id === id);
    if (fromPublic) return mapProjectData(fromPublic);
    const fromAppliedCache = appliedProjectsData[id];
    if (fromAppliedCache) return mapProjectData(fromAppliedCache);
    return null;
  }, [projects, publicProjects, appliedProjectsData, mapProjectData]);

  // Build unified list of application project objects for Applications tab
  const applicationProjectItems = useMemo(() => {
    const idsFromServer = (myApplications || []).map(a => a.projectId).filter(Boolean);
    const idsFromLocal = Array.isArray(finalAppliedProjects) ? finalAppliedProjects : [];
    const uniqueIds = Array.from(new Set([ ...idsFromLocal, ...idsFromServer ]));
    
    const items = uniqueIds.map((id) => {
      const project = getProjectById(id);
      return { id, project };
    });
    
    const validItems = items.filter((x) => !!x.project);
      return validItems;
  }, [myApplications, finalAppliedProjects, getProjectById, appliedProjectsData, projects, publicProjects]);

  const recommendedProjects = useMemo(() => {
    const mappedRecommendations = (recommendations || []).map(mapProjectData);
    return mappedRecommendations.length > 0
      ? mappedRecommendations
      : displayProjects
          .filter((p) => p.isFeatured || (p.matchScore || 0) >= 90)
          .slice(0, 6);
  }, [recommendations, displayProjects, mapProjectData]);

  // Build select options from API data using custom hook
  const {
    statusOptions,
    priorityOptions,
    sortOptions,
    locationOptions,
    categoryOptions,
    experienceOptions,
  } = useFilterOptions(filterOptions);

  // Enhanced filter function that uses public projects API for better performance
  const filterProjects = useCallback(async () => {
    try {
      const hasFilters = 
        searchTerm.trim() !== "" ||
        selectedStatus !== "all" ||
        selectedPriority !== "all" ||
        selectedLocation !== "all" ||
        selectedCategory !== "all" ||
        selectedExperienceLevel !== "all" ||
        budgetMin !== "" ||
        budgetMax !== "" ||
        isRemoteOnly;

      if (!hasFilters) {
        setFilteredProjects(displayProjects);
        return;
      }

      // Build filter parameters for public projects API
      const filterParams = {
        query: searchTerm.trim() || undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        priority: selectedPriority !== "all" ? selectedPriority : undefined,
        location: selectedLocation !== "all" ? selectedLocation : undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        experienceLevel: selectedExperienceLevel !== "all" ? selectedExperienceLevel : undefined,
        budgetMin: budgetMin ? Number(budgetMin) : undefined,
        budgetMax: budgetMax ? Number(budgetMax) : undefined,
        isRemote: isRemoteOnly ? true : undefined,
        sortBy: sortBy,
        sortOrder: 'desc',
        limit: 100, // Get more results for better filtering
        page: 1
      };

      // Remove undefined values
      Object.keys(filterParams).forEach(key => {
        if (filterParams[key] === undefined) {
          delete filterParams[key];
        }
      });

      // Use public projects API for filtering
      const result = await dispatch(getPublicProjects(filterParams)).unwrap();
      
      if (result.success && Array.isArray(result.projects)) {
        const mappedProjects = result.projects.map(mapProjectData);
        setFilteredProjects(mappedProjects);
        return;
      }

      // Fallback to local filtering if API fails
      let filtered = displayProjects.filter((project) => {
        const matchesSearch = !searchTerm.trim() ||
          project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.roleNeeded?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.company?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          selectedStatus === "all" || project.status?.toLowerCase() === selectedStatus.toLowerCase();
        const matchesPriority =
          selectedPriority === "all" || project.priority?.toLowerCase() === selectedPriority.toLowerCase();
        const matchesLocation =
          selectedLocation === "all" ||
          (selectedLocation === "Remote"
            ? project.isRemote
            : project.location === selectedLocation);
        const matchesCategory =
          selectedCategory === "all" || project.category === selectedCategory;
        const matchesExperience =
          selectedExperienceLevel === "all" || project.experience?.toLowerCase() === selectedExperienceLevel.toLowerCase();
        const matchesBudget = 
          (!budgetMin || (project.budgetMin && project.budgetMin >= Number(budgetMin))) &&
          (!budgetMax || (project.budgetMax && project.budgetMax <= Number(budgetMax)));
        const matchesRemote =
          !isRemoteOnly || project.isRemote;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPriority &&
          matchesLocation &&
          matchesCategory &&
          matchesExperience &&
          matchesBudget &&
          matchesRemote
        );
      });

      // Sort projects
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "deadline":
            return new Date(a.deadline) - new Date(b.deadline);
          case "budget":
            const aBudget = parseInt(
              a.budget.split("-")[0].replace(/[^0-9]/g, "")
            );
            const bBudget = parseInt(
              b.budget.split("-")[0].replace(/[^0-9]/g, "")
            );
            return bBudget - aBudget;
          case "rating":
            return b.rating - a.rating;
          case "applicants":
            return a.applicantsCount - b.applicantsCount;
          case "relevance":
          default:
            return b.matchScore - a.matchScore;
        }
      });

      setFilteredProjects(filtered);
    } catch (error) {
      // Fallback to local filtering on error
      setFilteredProjects(displayProjects);
    }
  }, [
    dispatch,
    searchTerm,
    selectedStatus,
    selectedPriority,
    selectedLocation,
    selectedCategory,
    selectedExperienceLevel,
    budgetMin,
    budgetMax,
    isRemoteOnly,
    sortBy,
    displayProjects,
    mapProjectData,
  ]);

  // Debounce search input for better UX
  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(internalSearch), 300);
    return () => clearTimeout(t);
  }, [internalSearch]);

  // Update filtered projects when dependencies change
  useEffect(() => {
    filterProjects();
  }, [filterProjects]);

  // Initialize filtered projects when component first mounts
  useEffect(() => {
    if (displayProjects.length > 0 && filteredProjects.length === 0) {
      setFilteredProjects(displayProjects);
    }
  }, [displayProjects.length]); // Only run when displayProjects first loads


  // Fetch search suggestions when search term changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (internalSearch.trim().length >= 2) {
        try {
          const result = await dispatch(getSearchSuggestions({ 
            query: internalSearch.trim(), 
            type: 'all' 
          })).unwrap();
          setSearchSuggestions(result.suggestions || { skills: [], tags: [] });
          setShowSearchSuggestions(true);
        } catch (error) {
          setSearchSuggestions({ skills: [], tags: [] });
        }
      } else {
        setShowSearchSuggestions(false);
        setSearchSuggestions({ skills: [], tags: [] });
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [internalSearch, dispatch]);


  // Optimized handler functions
  const handleApplyToProject = useCallback(async (projectId) => {
    try {
      await dispatch(
        applyToProject({
          projectId,
          notes: "I am interested in this project",
        })
      ).unwrap();
      
      setApplicationStatusByProjectId((prev) => ({
        ...prev,
        [projectId]: "Applied",
      }));
      
      // Immediately load project data for applications tab
      const existingProject = (projects || []).find(p => p.id === projectId) 
        || (publicProjects || []).find(p => p.id === projectId)
        || appliedProjectsData[projectId];
      
      if (!existingProject) {
        try {
          const res = await dispatch(getProject(projectId)).unwrap();
          const proj = res?.project || res?.data?.project || res;
          if (proj && proj.id) {
            setAppliedProjectsData((prev) => ({ ...prev, [proj.id]: proj }));
          }
        } catch (err) {
          console.error('Failed to load project after applying:', err);
        }
      }
      
      // Refresh projects so server-side applicantsCount reflects immediately
      try {
        if (isPublicOnly) {
          await dispatch(require("../slice/projectSlice").getPublicProjects()).unwrap();
        } else {
          await dispatch(require("../slice/projectSlice").listProjects()).unwrap();
        }
        // Refresh my applications state
        await dispatch(getMyApplications());
        await dispatch(getMyApplicationsCount());
      } catch {}
    } catch (error) {
      // Silent fail for better UX
    }
  }, [dispatch, isPublicOnly, projects, publicProjects, appliedProjectsData]);

  const handleWithdrawApplication = useCallback(async (projectId) => {
    try {
      const res = await dispatch(withdrawApplication({ projectId })).unwrap();
      
      // Update local state immediately for better UX
      setApplicationStatusByProjectId((prev) => {
        const next = { ...prev };
        delete next[projectId];
        return next;
      });

      // Show success message
      // toast.success("Application withdrawn successfully");

      // Optional: Refresh projects to ensure server-side data is in sync
      // This is now optional since Redux state is updated immediately
      try {
        if (isPublicOnly) {
          await dispatch(require("../slice/projectSlice").getPublicProjects()).unwrap();
        } else {
          await dispatch(require("../slice/projectSlice").listProjects()).unwrap();
        }
      } catch {}
    } catch (e) {
      toast.error(e?.message || "Failed to withdraw application");
    }
  }, [dispatch, isPublicOnly]);

  // Load my applications and count on component mount (only once)
  useEffect(() => {
    if (isDeveloper && !isPublicOnly) {
      dispatch(getMyApplications());
      dispatch(getMyApplicationsCount());
      dispatch(getAppliedProjects()); // Load applied project IDs with status
    }
  }, [dispatch, isDeveloper, isPublicOnly]);

  // Track previous tab to detect when we actually SWITCH to applications tab
  const prevActiveTabRef = useRef(activeTab);
  
  // Refresh applications data ONLY when SWITCHING TO Applications tab (not on every render)
  // This ensures we always have the latest status from the database when user navigates to the tab
  useEffect(() => {
    // Only fetch if:
    // 1. We're on applications tab
    // 2. We WEREN'T on applications tab before (actual tab switch)
    // 3. User is developer
    const isSwitchingToApplications = activeTab === "applications" && 
                                      prevActiveTabRef.current !== "applications" &&
                                      isDeveloper && 
                                      !isPublicOnly;
    
    if (isSwitchingToApplications) {
      console.log('Switching to Applications tab - fetching fresh data');
      // Fetch latest applications with status from database (project_applicants table)
      dispatch(getMyApplications()).then((result) => {
        console.log('Applications tab: Fetched applications with status from database:', result.payload?.applications?.length || 0);
      });
      dispatch(getMyApplicationsCount());
      dispatch(getAppliedProjects()); // Reload applied project IDs when switching to Applications tab
    }
    
    // Update ref for next render
    prevActiveTabRef.current = activeTab;
  }, [activeTab, dispatch, isDeveloper, isPublicOnly]);

  // ✅ REMOVED: Auto-refresh interval - API will only be called:
  // 1. On component mount
  // 2. When switching to Applications tab
  // This prevents unnecessary API calls and 304 Not Modified responses

  // Fetch project details for applied projects that aren't loaded yet
  // This runs when: tab changes to applications, applied projects change, or data sources change
  useEffect(() => {
    const populateAppliedDetails = async () => {
      const idsFromServer = (myApplications || []).map(a => a.projectId).filter(Boolean);
      const idsFromLocal = Array.isArray(finalAppliedProjects) ? finalAppliedProjects : [];
      const allIds = Array.from(new Set([ ...idsFromLocal, ...idsFromServer ]));
      
      if (allIds.length === 0) return;

      const existingIds = new Set([
        ...((projects || []).map((p) => p.id)),
        ...((publicProjects || []).map((p) => p.id)),
        ...Object.keys(appliedProjectsData).map((k) => Number(k)),
      ]);

      const missingIds = allIds.filter(id => !existingIds.has(id));
      
      if (missingIds.length > 0) {
        // Fetch all missing projects in parallel
        const fetchPromises = missingIds.map(async (id) => {
          try {
            const res = await dispatch(getProject(id)).unwrap();
            const proj = res?.project || res?.data?.project || res;
            if (proj && proj.id) {
              setAppliedProjectsData((prev) => ({ ...prev, [proj.id]: proj }));
            } else {
              console.warn(`No project data found for ID: ${id}`);
            }
          } catch (error) {
            console.error('Failed to load project details for application:', id, error);
          }
        });
        
        await Promise.all(fetchPromises);
      }
    };
    
    // Only populate when on Applications tab or when we have applied projects
    if (activeTab === "applications" || finalAppliedProjects.length > 0 || myApplications.length > 0) {
      populateAppliedDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, finalAppliedProjects, myApplications, dispatch, projects, publicProjects, appliedProjectsData]);

  const handleOpenDetails = useCallback((project) => {
    setSelectedProject(project);
    setShowDetailsModal(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setShowDetailsModal(false);
    setSelectedProject(null);
  }, []);

  const navigate = useNavigate();

  const canJoinGroupChat = useCallback((projectId) => {
    const numericProjectId = Number(projectId);
    // Check if status is "accepted" or "shortlisted" (case-insensitive) from any source
    const status = getApplicationStatus(numericProjectId) || 
                  applicationStatusByProjectId[numericProjectId] || 
                  applicationStatusByProjectId[projectId] ||
                  (applicationStatusMap[numericProjectId]?.status) ||
                  (applicationStatusMap[projectId]?.status);
    
    if (!status) return false;
    
    const normalizedStatus = status.toLowerCase();
    // Allow chat access for both "accepted" and "shortlisted" status
    return normalizedStatus === "accepted" || normalizedStatus === "shortlisted";
  }, [applicationStatusByProjectId, applicationStatusMap, getApplicationStatus]);

  // Handle joining group chat for a project
  const handleJoinGroupChat = useCallback(async (projectId) => {
    const numericProjectId = Number(projectId);
    try {
      // Import getConversationsApi dynamically to avoid circular dependencies
      const { getConversationsApi } = await import("../../chat/slice/chatAction");
      
      // Fetch all conversations to find the group chat for this project
      const conversationsResponse = await getConversationsApi({ type: 'group' });
      const conversationsData = conversationsResponse?.data?.data || conversationsResponse?.data || [];
      
      // Find the group conversation that matches this projectId
      const groupChat = conversationsData.find(
        conv => conv.type === 'group' && Number(conv.projectId) === numericProjectId
      );
      
      if (groupChat && groupChat.id) {
        // Navigate to chat with the conversation ID
        navigate(`/chat?conversationId=${groupChat.id}`);
        toast.success(`Opening group chat for ${groupChat.name || 'this project'}`);
      } else {
        toast.error('Group chat not found for this project. It may not have been created yet.');
      }
    } catch (error) {
      console.error('Error joining group chat:', error);
      toast.error('Failed to open group chat. Please try again.');
    }
  }, [navigate]);
  const isProjectSaved = useCallback((projectId) => {
    if (!Array.isArray(saves)) return false;
    
    return saves.some((s) => {
      if (typeof s === 'number') {
        return s === projectId;
      } else if (typeof s === 'object' && s !== null) {
        return s.projectId === projectId;
      }
      return false;
    });
  }, [saves]);

  const handleSaveProject = useCallback(async (projectId) => {
    try {
      const isSavedServer = isProjectSaved(projectId);
      setSavingProjectId(projectId);
      
      if (isSavedServer) {
        await dispatch(removeProjectSave({ projectId })).unwrap();
      } else {
        await dispatch(addProjectSave({ projectId })).unwrap();
      }
    } catch (e) {
      toast.error("Failed to save/unsave project");
    } finally {
      setSavingProjectId(null);
    }
  }, [dispatch, isProjectSaved]);

  const isProjectFavorited = useCallback((projectId) => {
    if (!Array.isArray(favorites)) return false;
    return (
      favorites.includes(projectId) ||
      favorites.some(
        (f) =>
          f === projectId ||
          f?.projectId === projectId ||
          f?.project?.id === projectId ||
          f?.id === projectId
      )
    );
  }, [favorites]);



  const handleToggleFavorite = useCallback(async (projectId) => {
    try {
      const isFavorited = isProjectFavorited(projectId);
      if (isFavorited) {
        await dispatch(removeProjectFavorite({ projectId })).unwrap();
      } else {
        await dispatch(addProjectFavorite({ projectId })).unwrap();
      }
      // Refresh favorites and projects so counts reflect immediately
      try {
        await dispatch(
          require("../slice/projectSlice").getProjectFavorites()
        ).unwrap();
      } catch {}
      if (isPublicOnly) {
        try {
          await dispatch(
            require("../slice/projectSlice").getPublicProjects()
          ).unwrap();
        } catch {}
      } else {
        try {
          await dispatch(
            require("../slice/projectSlice").listProjects()
          ).unwrap();
        } catch {}
      }
    } catch (error) {
      toast.error(`Failed to toggle favorite: ${error.message}`);
    }
  }, [dispatch, isProjectFavorited, isPublicOnly]);

  const buildProjectUrl = useCallback((project) => {
    try {
      const origin = window?.location?.origin || '';
      return `${origin}/projects/${project?.id ?? ''}`;
    } catch {
      return `/projects/${project?.id ?? ''}`;
    }
  }, []);

  const handleShareProject = useCallback(async (project) => {
    const url = buildProjectUrl(project);
    const title = project?.title || 'Project';
    const text = project?.description || 'Check out this project on SkillBridge Pro';
    try {
      if (navigator?.share) {
        await navigator.share({ title, text, url });
        return;
      }
    } catch (err) {
      // fall through to clipboard copy
    }
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch (err) {
      toast.error('Failed to share link');
    }
  }, [buildProjectUrl]);


  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setInternalSearch("");
    setSelectedStatus("all");
    setSelectedPriority("all");
    setSelectedLocation("all");
    setSelectedCategory("all");
    setSelectedExperienceLevel("all");
    setBudgetMin("");
    setBudgetMax("");
    setIsRemoteOnly(false);
    setSortBy("relevance");
  }, []);

  // Build a robust unique favorites set from varying API shapes
  const favoriteIdsSet = useMemo(() => new Set(
    Array.isArray(favorites)
      ? favorites
          .map((f) => {
            if (typeof f === "number") return f;
            if (f?.projectId) return f.projectId;
            if (f?.project?.id) return f.project.id;
            if (f?.id && displayProjects.some((p) => p.id === f.id))
              return f.id;
            return null;
          })
          .filter((id) => typeof id === "number")
      : []
  ), [favorites, displayProjects]);

  const stats = useMemo(() => ({
    total: displayProjects.length,
    applied: finalAppliedProjects.length,
    saved: Array.isArray(saves) ? saves.length : 0,
    favorites: favoriteIdsSet.size,
    matches: filteredProjects.length,
  }), [displayProjects.length, finalAppliedProjects.length, saves, favoriteIdsSet.size, filteredProjects.length]);


  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900'>
      <div className='px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto'>
        {/* Header */}
        <div className='bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-white/10'>
          <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
            <div className='flex items-center gap-3 sm:gap-4'>
              <div className='p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl'>
                <Briefcase className='w-6 h-6 sm:w-8 sm:h-8 text-white' />
              </div>
              <div>
                <h1 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                  {activeTab === "discover"
                    ? "Discover Projects"
                    : "Your Applications"}
                </h1>
                <p className='text-gray-300 text-xs sm:text-sm'>
                  {activeTab === "discover"
                    ? "Find and apply to projects that match your skills and interests"
                    : "Track your application statuses and next steps"}
                </p>
              </div>
            </div>

            <div className='flex flex-wrap gap-3'>
              <div className='flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg'>
                <Target className='w-4 h-4 text-green-400' />
                <span className='text-sm text-gray-300'>
                  {stats.matches} matches found
                </span>
              </div>
              {user?.role === "developer" && myInvites?.length > 0 && (
                <div className='flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg'>
                  <Users className='w-4 h-4 text-blue-400' />
                  <span className='text-sm text-gray-300'>
                    Invites: {myInvites.length}
                  </span>
                </div>
              )}
              <div className='bg-white/10 rounded-xl p-1'>
                <div className='grid grid-cols-2 gap-1'>
                  <Button
                    onClick={() => handleTabChange("discover")}
                    variant='ghost'
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      activeTab === "discover"
                        ? "bg-white/20 text-white"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    Discover
                  </Button>
                  <Button
                    onClick={() => handleTabChange("applications")}
                    variant='ghost'
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      activeTab === "applications"
                        ? "bg-white/20 text-white"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    Applications ({applicationProjectItems.length})
                  </Button>
                </div>
              </div>
              <Button
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
                variant='ghost'
                className='bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2'
              >
                {viewMode === "grid" ? "List View" : "Grid View"}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4'>
          <div className='bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg'>
                <Briefcase className='w-5 h-5 text-white' />
              </div>
              <div>
                <p className='text-2xl font-bold text-white'>{stats.total}</p>
                <p className='text-sm text-gray-400'>Total Projects</p>
              </div>
            </div>
          </div>

          <div className='bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg'>
                <CheckCircle className='w-5 h-5 text-white' />
              </div>
              <div>
                <p className='text-2xl font-bold text-white'>{stats.applied}</p>
                <p className='text-sm text-gray-400'>Applied</p>
              </div>
            </div>
          </div>

          <div className='bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg'>
                <Bookmark className='w-5 h-5 text-white' />
              </div>
              <div>
                <p className='text-2xl font-bold text-white'>{stats.saved}</p>
                <p className='text-sm text-gray-400'>Saved</p>
              </div>
            </div>
          </div>

          <div className='bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg'>
                <Heart className='w-5 h-5 text-white' />
              </div>
              <div>
                <p className='text-2xl font-bold text-white'>
                  {stats.favorites}
                </p>
                <p className='text-sm text-gray-400'>Favorites</p>
              </div>
            </div>
          </div>

          <div className='bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg'>
                <Target className='w-5 h-5 text-white' />
              </div>
              <div>
                <p className='text-2xl font-bold text-white'>{stats.matches}</p>
                <p className='text-sm text-gray-400'>Matches</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        {activeTab === "discover" && (
          <div className='bg-black/20 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-white/10'>
            {/* Main Search and Controls */}
            <div className='flex flex-col lg:flex-row gap-4 mb-6'>
              <div className='flex-1 relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search projects by title, description, company, or role...'
                  className='w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300'
                  value={internalSearch}
                  onChange={(e) => setInternalSearch(e.target.value)}
                  onFocus={() => {
                    if (internalSearch.trim().length >= 2) {
                      setShowSearchSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    // Delay hiding to allow clicking on suggestions
                    setTimeout(() => setShowSearchSuggestions(false), 200);
                  }}
                />
                
                {/* Search Suggestions Dropdown */}
                {showSearchSuggestions && (searchSuggestions.skills.length > 0 || searchSuggestions.tags.length > 0) && (
                  <div className='absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-white/20 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto'>
                    {/* Skills Section */}
                    {searchSuggestions.skills.length > 0 && (
                      <div className='p-3 border-b border-white/10'>
                        <div className='text-xs text-gray-400 mb-2 flex items-center gap-2'>
                          <svg className='w-3 h-3 text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
                          </svg>
                          Skills
                        </div>
                        <div className='flex flex-wrap gap-1'>
                          {searchSuggestions.skills.slice(0, 5).map((skill) => (
                            <button
                              key={skill}
                              onClick={() => {
                                setInternalSearch(skill);
                                setShowSearchSuggestions(false);
                              }}
                              className='px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded hover:bg-blue-500/30 transition-colors'
                            >
                              {skill}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Tags Section */}
                    {searchSuggestions.tags.length > 0 && (
                      <div className='p-3'>
                        <div className='text-xs text-gray-400 mb-2 flex items-center gap-2'>
                          <svg className='w-3 h-3 text-purple-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' />
                          </svg>
                          Tags
                        </div>
                        <div className='flex flex-wrap gap-1'>
                          {searchSuggestions.tags.slice(0, 5).map((tag) => (
                            <button
                              key={tag}
                              onClick={() => {
                                setInternalSearch(tag);
                                setShowSearchSuggestions(false);
                              }}
                              className='px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded hover:bg-purple-500/30 transition-colors'
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className='flex gap-3 items-center'>
                <Input
                  type="select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  options={sortOptions}
                  variant="developer-projects"
                  className="min-w-[140px]"
                />

                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 font-medium ${
                    showFilters 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Filter className='w-4 h-4' />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                  {showFilters && (
                    <span className='ml-1 px-2 py-0.5 bg-blue-500/30 text-blue-300 text-xs rounded-full'>
                      Active
                    </span>
                  )}
                </Button>

                <div className='hidden md:flex rounded-lg overflow-hidden gap-1'>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-4 py-3 flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                      viewMode === "grid" 
                        ? "bg-white/20 text-white shadow-lg" 
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                    title='Grid view'
                  >
                    <LayoutGrid className='w-4 h-4' /> Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-4 py-3 flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                      viewMode === "list" 
                        ? "bg-white/20 text-white shadow-lg" 
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                    title='List view'
                  >
                    <List className='w-4 h-4' /> List
                  </button>
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className='bg-white/5 rounded-xl p-6 border border-white/10'>
                <div className='flex items-center justify-between mb-6'>
                  <h3 className='text-lg font-semibold text-white flex items-center gap-2'>
                    <Filter className='w-5 h-5 text-blue-400' />
                    Advanced Filters
                  </h3>
                  <Button
                    onClick={clearFilters}
                    className='bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 font-medium'
                  >
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                    Clear All Filters
                  </Button>
                </div>

                {/* Primary Filter Row */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6'>
                  <Input
                    label="Status"
                    type="select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    options={statusOptions}
                    variant="developer-projects"
                  />

                  <Input
                    label="Priority"
                    type="select"
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    options={priorityOptions}
                    variant="developer-projects"
                  />

                  <Input
                    label="Location"
                    type="select"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    options={locationOptions}
                    variant="developer-projects"
                  />

                  <Input
                    label="Category"
                    type="select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    options={categoryOptions}
                    variant="developer-projects"
                  />

                  <Input
                    label="Experience"
                    type="select"
                    value={selectedExperienceLevel}
                    onChange={(e) => setSelectedExperienceLevel(e.target.value)}
                    options={experienceOptions}
                    variant="developer-projects"
                  />
                </div>

                {/* Additional Filters Row */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6'>
                  {/* Budget Range */}
                  <div className='space-y-3'>
                    <label className='text-sm font-medium text-gray-300 flex items-center gap-2'>
                      <DollarSign className='w-4 h-4 text-green-400' />
                      Budget Range
                    </label>
                    <div className='flex gap-3'>
                      <div className='flex-1'>
                        <input
                          type='number'
                          placeholder='Min Budget'
                          value={budgetMin}
                          onChange={(e) => setBudgetMin(e.target.value)}
                          className='w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300'
                        />
                      </div>
                      <div className='flex-1'>
                        <input
                          type='number'
                          placeholder='Max Budget'
                          value={budgetMax}
                          onChange={(e) => setBudgetMax(e.target.value)}
                          className='w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300'
                        />
                      </div>
                    </div>
                  </div>

                  {/* Remote Only Toggle */}
                  <div className='space-y-3'>
                    <label className='text-sm font-medium text-gray-300 flex items-center gap-2'>
                      <MapPin className='w-4 h-4 text-blue-400' />
                      Work Arrangement
                    </label>
                    <Button
                      onClick={() => setIsRemoteOnly(!isRemoteOnly)}
                      className={`w-full px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-medium ${
                        isRemoteOnly
                          ? "bg-green-500/20 text-green-400 border border-green-500/30 shadow-lg"
                          : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
                      }`}
                    >
                      {isRemoteOnly ? (
                        <>
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                          </svg>
                          Remote Only
                        </>
                      ) : (
                        <>
                          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 10h16M4 14h16M4 18h16' />
                          </svg>
                          All Types
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Filter Summary */}
                  <FilterSummary
                    filters={{
                      selectedStatus,
                      selectedPriority,
                      selectedLocation,
                      selectedCategory,
                      selectedExperienceLevel,
                      budgetMin,
                      budgetMax,
                      isRemoteOnly
                    }}
                    options={{
                      statusOptions,
                      priorityOptions,
                      locationOptions,
                      categoryOptions,
                      experienceOptions
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recommended Projects */}
        {activeTab === "discover" && recommendedProjects.length > 0 && (
          <div className='space-y-4'>
            <h2 className='text-xl font-semibold text-white'>
              Recommended for you
            </h2>
            <div className='grid gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
              {recommendedProjects.map((project, idx) => (
                <div
                  key={project.id ?? idx}
                  className='bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors duration-300 relative'
                >
                  {project.isFeatured && (
                    <span className='absolute top-3 right-3 px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'>
                      Featured
                    </span>
                  )}
                  <div className='flex items-center gap-2 mb-3'>
                    <div className='p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex-shrink-0'>
                      <Briefcase className='w-4 h-4 text-white' />
                    </div>
                    <h3 className='text-white font-semibold text-sm leading-tight line-clamp-2'>
                      {project.title}
                    </h3>
                  </div>
                  <p className='text-gray-300 text-xs line-clamp-3 mb-3 leading-relaxed'>
                    {project.description}
                  </p>
                  <div className='flex items-center justify-between text-xs text-gray-400 mb-3'>
                    <span className='flex items-center gap-1'>
                      <Users className='w-3 h-3' />
                      {project.applicantsCount}
                    </span>
                    <span className='flex items-center gap-1'>
                      <Clock className='w-3 h-3' />
                      {project.duration}
                    </span>
                    <span className='flex items-center gap-1'>
                      <DollarSign className='w-3 h-3' />
                      {project.budget}
                    </span>
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      onClick={() => handleOpenDetails(project)}
                      className='flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-xs transition-colors duration-300'
                    >
                      View
                    </Button>
                    {!isPublicOnly && (
                      <Button
                        onClick={() => handleApplyToProject(project.id)}
                        disabled={!!getApplicationStatus(project.id)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                          getApplicationStatus(project.id)
                            ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                        }`}
                      >
                        {getApplicationStatus(project.id)
                          ? getApplicationStatus(project.id).charAt(0).toUpperCase() + getApplicationStatus(project.id).slice(1)
                          : "Apply"}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Grid/List or Applications */}
        {activeTab === "discover" ? (
          viewMode === "grid" ? (
            <div className='grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {filteredProjects.map((project, idx) => (
                <ProjectCard
                  key={project.id ?? idx}
                  project={project}
                  isPublicOnly={isPublicOnly}
                  appliedProjects={finalAppliedProjects}
                  onApply={handleApplyToProject}
                  onViewDetails={handleOpenDetails}
                  onSave={handleSaveProject}
                  onFavorite={handleToggleFavorite}
                  onShare={handleShareProject}
                  isProjectSaved={isProjectSaved}
                  isProjectFavorited={isProjectFavorited}
                  savingProjectId={savingProjectId}
                />
              ))}
            </div>
          ) : (
            <div className='space-y-4'>
              {filteredProjects.map((project, idx) => (
                <div
                  key={project.id ?? idx}
                  className='bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 p-4 sm:p-6 hover:bg-white/5 transition-all duration-300'
                >
                  <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4'>
                    <div className='flex-1 min-w-0'>
                      <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3'>
                        <h3 className='text-lg sm:text-xl font-bold text-white leading-tight'>
                          {project.title}
                        </h3>
                        <div className='flex flex-wrap gap-2'>
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              project.status === "active"
                                ? "bg-green-500/20 text-green-400"
                                : project.status === "upcoming"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {project.statusDisplay}
                          </span>
                          {project.isFeatured && (
                            <span className='px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500/20 text-yellow-400'>
                              Featured
                            </span>
                          )}
                          {project.benefits && (
                            <span className='px-2 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400'>
                              Rewards
                            </span>
                          )}
                        </div>
                      </div>

                      <p className='text-gray-300 mb-3 text-sm sm:text-base leading-relaxed'>
                        {project.description}
                      </p>

                      <div className='flex flex-wrap gap-2 mb-3'>
                        {project.tags && project.tags.length > 0 ? (
                          <>
                            {project.tags.slice(0, 4).map((tag, idx) => (
                              <span
                                key={idx}
                                className='px-2 py-1 rounded-full text-xs text-white bg-gradient-to-r from-blue-500 to-purple-500'
                              >
                                {tag}
                              </span>
                            ))}
                            {project.tags.length > 4 && (
                              <span className='px-2 py-1 rounded-full text-xs text-gray-400 bg-white/10'>
                                +{project.tags.length - 4}
                              </span>
                            )}
                          </>
                        ) : null}
                      </div>

                      {/* Skills */}
                      {project.skills && project.skills.length > 0 && (
                        <div className='flex flex-wrap gap-2 items-center mb-3'>
                          <Code2 className='w-3 h-3 text-gray-400 shrink-0' />
                          <div className='flex flex-wrap gap-2'>
                            {project.skills.slice(0, 4).map((skill, idx) => (
                              <span
                                key={idx}
                                className='px-2 py-1 rounded-full text-xs text-emerald-300 bg-emerald-500/20 border border-emerald-400/30'
                              >
                                {skill}
                              </span>
                            ))}
                            {project.skills.length > 4 && (
                              <span className='px-2 py-1 rounded-full text-xs text-gray-400 bg-white/10'>
                                +{project.skills.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className='flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400'>
                        <span className='flex items-center gap-1'>
                          <DollarSign className='w-3 h-3 sm:w-4 sm:h-4' />
                          {project.budget}
                        </span>
                        <span className='flex items-center gap-1'>
                          <MapPin className='w-3 h-3 sm:w-4 sm:h-4' />
                          {project.location}
                        </span>
                        <span className='flex items-center gap-1'>
                          <Clock className='w-3 h-3 sm:w-4 sm:h-4' />
                          {project.duration}
                        </span>
                        <span className='flex items-center gap-1'>
                          <Users className='w-3 h-3 sm:w-4 sm:h-4' />
                          {project.applicantsCount} applicants
                        </span>
                      </div>
                      {project.benefits && (
                        <p className='text-xs text-green-300 mt-2'>
                          Benefits: {project.benefits}
                        </p>
                      )}
                    </div>

                    <div className='flex flex-col sm:flex-row lg:flex-col gap-2 lg:ml-4'>
                      <div className='flex gap-2'>
                        <Button
                          onClick={() => handleOpenDetails(project)}
                          className='flex-1 sm:flex-none px-4 py-2 rounded-lg font-semibold transition-all duration-300 bg-white/10 hover:bg-white/20 text-white text-sm'
                        >
                          <span className='hidden sm:inline'>View Details</span>
                          <span className='sm:hidden'>View</span>
                        </Button>
                        {!isPublicOnly && (
                          <Button
                            onClick={() => handleApplyToProject(project.id)}
                            variant="apply-list"
                            isApplied={finalAppliedProjects.includes(Number(project.id))}
                            className='flex-1 sm:flex-none text-sm'
                          >
                            {finalAppliedProjects.includes(Number(project.id)) ? "Applied" : "Apply"}
                          </Button>
                        )}
                      </div>
                      {!isPublicOnly && (
                        <div className='flex gap-2 justify-center sm:justify-start'>
                          <Button
                            onClick={() => handleSaveProject(project.id)}
                            disabled={savingProjectId === project.id}
                            className={`p-2 rounded-lg transition-colors duration-300 ${
                              isProjectSaved(project.id)
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-white/10 text-gray-400 hover:bg-white/20"
                            } ${savingProjectId === project.id ? "opacity-50 cursor-not-allowed" : ""}`}
                            title={
                              savingProjectId === project.id
                                ? "Saving..."
                                : isProjectSaved(project.id)
                                  ? "Saved"
                                  : "Save"
                            }
                          >
                            <Bookmark
                              className={`w-4 h-4 ${isProjectSaved(project.id) ? "fill-current" : ""}`}
                            />
                          </Button>
                          <Button
                            onClick={() => handleToggleFavorite(project.id)}
                            className={`p-2 rounded-lg transition-colors duration-300 ${
                              isProjectFavorited(project.id)
                                ? "bg-pink-500/20 text-pink-400"
                                : "bg-white/10 text-gray-400 hover:bg-white/20"
                            }`}
                          >
                            <Heart
                              className={`w-4 h-4 ${isProjectFavorited(project.id) ? "fill-current" : ""}`}
                            />
                          </Button>
                          <Button 
                            onClick={() => handleShareProject(project)}
                            className='p-2 rounded-lg bg-white/10 text-gray-400 hover:bg-white/20 transition-colors duration-300'
                          >
                            <Share2 className='w-4 h-4' />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          // Applications tab
          <div className='bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='min-w-full'>
                <thead className='bg-white/5'>
                  <tr className='text-left text-gray-400 uppercase text-xs tracking-wider'>
                    <th className='px-6 py-4'>Project</th>
                    <th className='px-6 py-4'>Company</th>
                    <th className='px-6 py-4'>Applied</th>
                    <th className='px-6 py-4'>Status</th>
                    <th className='px-6 py-4'>Actions</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-white/10'>
                  {applicationProjectItems.map(({ id: projectId, project }) => {
                    if (!project) return null;
                    // Ensure projectId is a number for consistent lookup
                    const numericProjectId = Number(projectId);
                    
                    // PRIORITY 1: Get application data from database (myApplications) - this is the source of truth
                    const applicationData = applicationStatusMap[numericProjectId] || 
                                          applicationStatusMap[projectId] || null;
                    
                    // PRIORITY 2: Get status - prioritize database status from myApplications
                    // The database status from project_applicants table is the authoritative source
                    let status = null;
                    if (applicationData && applicationData.status) {
                      // Use database status (from project_applicants table)
                      status = applicationData.status.toLowerCase(); // Normalize to lowercase
                    } else {
                      // Fallback to optimistic/local state if database status not available yet
                      status = getApplicationStatus(numericProjectId);
                      if (status) {
                        status = typeof status === 'string' ? status.toLowerCase() : status;
                      } else {
                        // Last fallback to local optimistic state
                        const localStatus = applicationStatusByProjectId[numericProjectId] || applicationStatusByProjectId[projectId];
                        status = localStatus ? (typeof localStatus === 'string' ? localStatus.toLowerCase() : localStatus) : 'applied';
                      }
                    }
                    
                    // Get appliedAt date from database (preferred) or fallback
                    const appliedAt = applicationData?.appliedAt || 
                                    applicationData?.createdAt || 
                                    null;
                    
                    const statusColors = {
                      applied:
                        "bg-blue-500/20 text-blue-400 border-blue-500/30",
                      shortlisted:
                        "bg-green-500/20 text-green-400 border-green-500/30",
                      interviewing:
                        "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                      accepted:
                        "bg-purple-500/20 text-purple-400 border-purple-500/30",
                      rejected: "bg-red-500/20 text-red-400 border-red-500/30",
                    };
                    return (
                      <tr
                        key={projectId}
                        className='hover:bg-white/5 transition-colors duration-200'
                      >
                        <td className='px-6 py-4'>
                          <div className='flex items-center gap-3'>
                            <div className='p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg'>
                              <Briefcase className='w-4 h-4 text-white' />
                            </div>
                            <div>
                              <p className='text-white font-medium'>
                                {project.title}
                              </p>
                              <p className='text-gray-400 text-xs'>
                                {project.roleNeeded}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 text-white'>
                          {project.company}
                        </td>
                        <td className='px-6 py-4 text-gray-300'>
                          {appliedAt ? new Date(appliedAt).toLocaleDateString() : 'Recently'}
                        </td>
                        <td className='px-6 py-4'>
                          {status && status !== 'applied' ? (
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${statusColors[status] || statusColors.applied}`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          ) : (
                            <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${statusColors.applied}`}>
                              Applied
                            </span>
                          )}
                        </td>
                        <td className='px-6 py-4'>
                          <div className='flex items-center gap-2'>
                            <Button
                              onClick={() => handleOpenDetails(project)}
                              className='px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors duration-300 text-sm font-medium'
                            >
                              View
                            </Button>
                            {canJoinGroupChat(numericProjectId) ? (
                              <Button
                                onClick={() => handleJoinGroupChat(numericProjectId)}
                                className='px-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all duration-300 text-sm font-medium'
                              >
                                Join Chat
                              </Button>
                            ) : (
                              <Button
                                disabled
                                className='px-3 py-2 rounded-lg bg-white/5 text-gray-500 cursor-not-allowed text-sm font-medium'
                              >
                                Chat Locked
                              </Button>
                            )}
                            <Button
                              onClick={() =>
                                handleWithdrawApplication(projectId)
                              }
                              className='px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors duration-300 text-sm font-medium'
                            >
                              Withdraw
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {applicationProjectItems.length === 0 && (
                    <tr>
                      <td
                        colSpan='5'
                        className='px-6 py-12 text-center text-gray-400'
                      >
                        <div className='flex flex-col items-center gap-4'>
                          <Briefcase className='w-12 h-12 text-gray-500' />
                          <div>
                            <p className='text-lg font-medium text-gray-300 mb-2'>
                              {myApplications?.length > 0 || finalAppliedProjects?.length > 0 
                                ? 'Loading your applications...' 
                                : 'No applications yet'
                              }
                            </p>
                            <p className='text-sm text-gray-500'>
                              {myApplications?.length > 0 || finalAppliedProjects?.length > 0
                                ? 'Fetching project details...'
                                : 'Start applying to projects to see them here'
                              }
                            </p>
                            {(myApplications?.length > 0 || finalAppliedProjects?.length > 0) && (
                              <div className='mt-4'>
                                <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto'></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No projects found */}
        {activeTab === "discover" && filteredProjects.length === 0 && (
          <div className='text-center py-12'>
            <Briefcase className='w-16 h-16 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-400 text-lg'>No projects found</p>
            <p className='text-gray-500 text-sm mt-2'>
              {searchTerm ||
              selectedStatus !== "all" ||
              selectedPriority !== "all" ||
              selectedLocation !== "all"
                ? "Try adjusting your search terms or filters"
                : "No projects are currently available"}
            </p>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedProject && (
          <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
            <div className='bg-slate-900 rounded-2xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto'>
              <div className='p-6 border-b border-white/10 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg'>
                    <Briefcase className='w-5 h-5 text-white' />
                  </div>
                  <div>
                    <h3 className='text-2xl font-semibold text-white'>
                      {selectedProject.title}
                    </h3>
                    <p className='text-gray-400 text-sm'>
                      {selectedProject.company} • {selectedProject.location}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleCloseDetails}
                  className='bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-colors duration-300'
                >
                  Close
                </Button>
              </div>

              <div className='p-6 space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='bg-white/5 rounded-xl p-4 border border-white/10'>
                    <p className='text-gray-400 text-xs mb-1'>Budget</p>
                    <p className='text-white font-semibold'>
                      {selectedProject.budget}
                    </p>
                  </div>
                  <div className='bg-white/5 rounded-xl p-4 border border-white/10'>
                    <p className='text-gray-400 text-xs mb-1'>Duration</p>
                    <p className='text-white font-semibold'>
                      {selectedProject.duration}
                    </p>
                  </div>
                  <div className='bg-white/5 rounded-xl p-4 border border-white/10'>
                    <p className='text-gray-400 text-xs mb-1'>Applicants</p>
                    <p className='text-white font-semibold'>
                      {selectedProject.applicantsCount}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className='text-white font-semibold mb-2'>
                    About the project
                  </h4>
                  <p className='text-gray-300 leading-relaxed'>
                    {selectedProject.description}
                  </p>
                </div>
                <div>
                  <h4 className='text-white font-semibold mb-2'>Tags</h4>
                  <div className='flex flex-wrap gap-2'>
                    {(selectedProject.tags || []).map((tag, idx) => (
                      <span
                        key={idx}
                        className='px-2 py-1 rounded-full text-xs text-white bg-gradient-to-r from-blue-500 to-purple-500'
                      >
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

                {selectedProject.benefits && (
                  <div>
                    <h4 className='text-white font-semibold mb-2'>
                      Rewards & Benefits
                    </h4>
                    <p className='text-green-300 text-sm'>
                      {selectedProject.benefits}
                    </p>
                  </div>
                )}
                <div className='flex items-center justify-end gap-2 pt-2'>
                  <Button
                    onClick={handleCloseDetails}
                    className='px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors duration-300'
                  >
                    Close
                  </Button>
                  {!isPublicOnly && (
                    <Button
                      onClick={() => handleApplyToProject(selectedProject.id)}
                      variant="apply-modal"
                      isApplied={finalAppliedProjects.includes(Number(selectedProject.id))}
                    >
                      {finalAppliedProjects.includes(Number(selectedProject.id)) ? "Applied" : "Apply Now"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperProjects;
