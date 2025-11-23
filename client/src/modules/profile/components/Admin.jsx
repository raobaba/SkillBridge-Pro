import React, { useState, useMemo, memo, useEffect } from "react";
import Button from '../../../components/Button';
import {
  Shield,
  Key,
  User,
  CheckCircle,
  XCircle,
  Activity,
  Briefcase,
  Users,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Settings,
  Eye,
  Ban,
  CheckCircle2,
  Flag,
  Database,
  Globe,
  Clock,
  Target,
  PieChart,
} from "lucide-react";
import { ConfirmModal, CircularLoader } from "../../../components";
import Circular from "../../../components/loader/Circular";
import Navbar from "../../../components/header";
import {
  Bio,
  QuickActions,
  UserCard,
  InfoCard,
  DataTable,
} from "../../../components/Profile";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminAnalytics, fetchAllUsers, fetchDevelopers } from "../slice/profileSlice";
import { getSkillTrends } from "../../aicareer/slice/aiCareerSlice";

// Removed static data - now fetched from APIs

// Memoized action buttons component
const ActionButtons = memo(({ row }) => (
  <div className='flex gap-2'>
    <Button 
      className='px-3 py-1 rounded-lg bg-green-500 text-white text-sm hover:bg-green-600'
    >
      Approve
    </Button>
    <Button 
      className='px-3 py-1 rounded-lg bg-yellow-500 text-white text-sm hover:bg-yellow-600'
    >
      Suspend
    </Button>
    <Button 
      className='px-3 py-1 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600'
    >
      Remove
    </Button>
  </div>
));

const Admin = memo(function Admin({
  userData,
  form,
  editing,
  setEditing,
  imgError,
  setImgError,
  loading,
  showConfirm,
  handleChange,
  handleSave,
  handleDelete,
  confirmDelete,
  cancelDelete,
  handleAvatarChange,
  navigate,
}) {
  const dispatch = useDispatch();
  const handleNavigate = (path) =>
    navigate ? navigate(path) : alert(`Navigate to ${path}`);

  const [poFilter, setPoFilter] = useState("All");
  const [devFilter, setDevFilter] = useState("All");

  // Get admin data from Redux
  const adminAnalytics = useSelector((state) => state.profile?.adminAnalytics);
  const allUsers = useSelector((state) => state.profile?.allUsers || []);
  const developers = useSelector((state) => state.profile?.developers || []);
  const adminLoading = useSelector((state) => state.profile?.adminLoading || {});
  const adminError = useSelector((state) => state.profile?.adminError || {});
  
  // Skill trends from AI Career
  const skillTrends = useSelector((state) => state.aiCareer?.skillTrends || []);
  const skillTrendsLoading = useSelector((state) => state.aiCareer?.skillTrendsLoading || false);

  // Fetch admin data on component mount
  useEffect(() => {
    if (!adminAnalytics && !adminLoading.analytics) {
      dispatch(fetchAdminAnalytics('6m'));
    }
    if (allUsers.length === 0 && !adminLoading.users) {
      dispatch(fetchAllUsers({ limit: 200 }));
    }
    if (developers.length === 0 && !adminLoading.developers) {
      dispatch(fetchDevelopers({ limit: 200 }));
    }
    if (skillTrends.length === 0 && !skillTrendsLoading) {
      dispatch(getSkillTrends());
    }
  }, [dispatch, adminAnalytics, allUsers.length, developers.length, adminLoading, skillTrends.length, skillTrendsLoading]);
  
  // Transform skill trends from API
  const skillDemandTrends = useMemo(() => {
    if (!skillTrends || skillTrends.length === 0) return [];
    
    return skillTrends.slice(0, 5).map(trend => ({
      skill: trend.skill,
      demand: trend.demand || 0,
      growth: trend.growth || "+0%",
      color: trend.color || "bg-blue-500"
    }));
  }, [skillTrends]);
  
  // Get permissions from user data (admin role should have all permissions)
  const permissionsData = useMemo(() => {
    const defaultPermissions = [
      "Manage Users",
      "Moderate Projects",
      "View Reports",
      "Handle Payments",
    ];
    
    // If user has custom permissions, use those, otherwise use defaults
    if (userData?.permissions && Array.isArray(userData.permissions)) {
      return userData.permissions;
    }
    
    return defaultPermissions;
  }, [userData]);
  
  // Get security settings from user data
  const securitySettingsData = useMemo(() => {
    const settings = [];
    
    if (userData?.twoFactorEnabled !== undefined) {
      settings.push({ label: "2FA Enabled", value: userData.twoFactorEnabled });
    }
    
    if (userData?.lastPasswordChange) {
      settings.push({ 
        label: "Last Password Change", 
        value: new Date(userData.lastPasswordChange).toLocaleDateString() 
      });
    }
    
    // Active sessions would come from a separate API
    // For now, we'll leave it empty or use a placeholder
    settings.push({ label: "Active Sessions", value: "N/A" });
    
    return settings;
  }, [userData]);
  
  // Get activity feed from admin analytics
  const activityFeedData = useMemo(() => {
    // This would ideally come from a separate activity log API
    // For now, generate from moderation actions
    const activities = [];
    
    if (adminAnalytics?.moderation) {
      const mod = adminAnalytics.moderation;
      if (mod.resolvedToday > 0) {
        activities.push(`✅ Resolved ${mod.resolvedToday} issue(s)`);
      }
      if (mod.flaggedProjects > 0) {
        activities.push(`🚩 ${mod.flaggedProjects} project(s) flagged`);
      }
      if (mod.flaggedUsers > 0) {
        activities.push(`👤 ${mod.flaggedUsers} user(s) flagged`);
      }
    }
    
    return activities;
  }, [adminAnalytics]);

  // Transform analytics data to system analytics format
  const SYSTEM_ANALYTICS_DATA = useMemo(() => {
    if (!adminAnalytics?.stats) {
      return [
        { label: "Total Users", value: "0", change: "+0%", trend: "up", icon: <Users className="w-4 h-4" /> },
        { label: "Active Projects", value: "0", change: "+0%", trend: "up", icon: <Briefcase className="w-4 h-4" /> },
        { label: "Monthly Revenue", value: "$0", change: "+0%", trend: "up", icon: <DollarSign className="w-4 h-4" /> },
        { label: "System Uptime", value: "0%", change: "+0%", trend: "up", icon: <Database className="w-4 h-4" /> },
      ];
    }
    
    const stats = adminAnalytics.stats;
    return [
      { 
        label: "Total Users", 
        value: stats.totalUsers?.toLocaleString() || "0", 
        change: stats.monthlyGrowth >= 0 ? `+${stats.monthlyGrowth}%` : `${stats.monthlyGrowth}%`, 
        trend: stats.monthlyGrowth >= 0 ? "up" : "down", 
        icon: <Users className="w-4 h-4" /> 
      },
      { 
        label: "Active Projects", 
        value: adminAnalytics.projectStats?.activeProjects?.toLocaleString() || "0", 
        change: "+0%", 
        trend: "up", 
        icon: <Briefcase className="w-4 h-4" /> 
      },
      { 
        label: "Monthly Revenue", 
        value: stats.revenue || "$0", 
        change: "+0%", 
        trend: "up", 
        icon: <DollarSign className="w-4 h-4" /> 
      },
      { 
        label: "System Uptime", 
        value: `${stats.systemUptime || 0}%`, 
        change: "+0%", 
        trend: "up", 
        icon: <Database className="w-4 h-4" /> 
      },
    ];
  }, [adminAnalytics]);

  // Transform flagged projects from moderation data
  const FLAGGED_PROJECTS_DATA = useMemo(() => {
    if (!adminAnalytics?.moderation) {
      return [];
    }
    
    const moderation = adminAnalytics.moderation;
    const flagged = [];
    
    if (moderation.flaggedProjects > 0) {
      flagged.push({
        id: 'project-flagged',
        title: `${moderation.flaggedProjects} Project(s) Flagged`,
        reason: "Requires review",
        severity: "High",
        reporter: "System",
        date: new Date().toISOString().split('T')[0],
        status: "Under Review",
        count: moderation.flaggedProjects,
      });
    }
    
    if (moderation.flaggedUsers > 0) {
      flagged.push({
        id: 'user-flagged',
        title: `${moderation.flaggedUsers} User(s) Flagged`,
        reason: "Requires review",
        severity: "High",
        reporter: "System",
        date: new Date().toISOString().split('T')[0],
        status: "Under Review",
        count: moderation.flaggedUsers,
      });
    }
    
    return flagged;
  }, [adminAnalytics]);

  // Transform billing reports from analytics
  const BILLING_REPORTS_DATA = useMemo(() => {
    // This would ideally come from a billing API
    // For now, use empty array or generate from analytics if available
    return adminAnalytics?.billingReports || [];
  }, [adminAnalytics]);

  // Transform moderation actions from analytics
  const MODERATION_ACTIONS_DATA = useMemo(() => {
    if (!adminAnalytics?.moderation) {
      return [];
    }
    
    const moderation = adminAnalytics.moderation;
    const actions = [];
    
    if (moderation.resolvedToday > 0) {
      actions.push({
        action: "Resolved issues",
        target: `${moderation.resolvedToday} items`,
        reason: "Moderation actions",
        date: new Date().toISOString().split('T')[0],
      });
    }
    
    if (moderation.pendingReviews > 0) {
      actions.push({
        action: "Pending reviews",
        target: `${moderation.pendingReviews} items`,
        reason: "Awaiting moderation",
        date: new Date().toISOString().split('T')[0],
      });
    }
    
    return actions;
  }, [adminAnalytics]);

  // Transform user growth from analytics charts
  const USER_GROWTH_DATA = useMemo(() => {
    if (!adminAnalytics?.charts?.usersByMonth) {
      return [];
    }
    
    return adminAnalytics.charts.usersByMonth.map((item, index) => ({
      month: item.month || `Month ${index + 1}`,
      users: item.count || 0,
      projects: adminAnalytics.projectStats?.projectsByMonth?.[index]?.count || 0,
    }));
  }, [adminAnalytics]);

  // Transform project owners from all users
  const PROJECT_OWNERS_DATA = useMemo(() => {
    const projectOwners = allUsers.filter(user => user.role === 'project-owner');
    return projectOwners.map((user, index) => ({
      id: user.id || user.userId || index,
      name: user.name || user.userName || "Unknown",
      email: user.email || "N/A",
      projects: user.projectsCount || 0,
      status: user.isDeleted ? "Suspended" : "Active",
    }));
  }, [allUsers]);

  // Transform developers from all users
  const DEVELOPERS_DATA = useMemo(() => {
    const devs = developers.length > 0 ? developers : allUsers.filter(user => user.role === 'developer');
    return devs.map((user, index) => {
      const skills = user.skills 
        ? (Array.isArray(user.skills) ? user.skills.join(', ') : user.skills)
        : "Not specified";
      
      return {
        id: user.id || user.userId || index,
        name: user.name || user.userName || "Unknown",
        email: user.email || "N/A",
        skills: skills,
        status: user.isDeleted ? "Suspended" : (user.isEmailVerified ? "Active" : "Pending"),
      };
    });
  }, [developers, allUsers]);

  // Memoized columns to prevent recreation
  const poColumns = useMemo(() => [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "projects", label: "Projects" },
    { key: "status", label: "Status" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => <ActionButtons row={row} />,
    },
  ], []);

  const devColumns = useMemo(() => [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "skills", label: "Skills" },
    { key: "status", label: "Status" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => <ActionButtons row={row} />,
    },
  ], []);

  // Memoized filtered data
  const filteredProjectOwners = useMemo(() =>
    PROJECT_OWNERS_DATA.filter(po => poFilter === "All" || po.status === poFilter),
    [poFilter]
  );

  const filteredDevelopers = useMemo(() =>
    DEVELOPERS_DATA.filter(dev => devFilter === "All" || dev.status === devFilter),
    [devFilter]
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
      {/* Navbar */}
      <Navbar data={userData} isSearchBar={false} />
      {loading && <Circular />}

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Column */}
        <div className='lg:col-span-2 space-y-8'>
          {/* UserCard */}
          <UserCard
            form={form}
            userData={userData}
            editing={editing}
            imgError={imgError}
            handleChange={handleChange}
            handleAvatarChange={handleAvatarChange}
            handleSave={handleSave}
            setEditing={setEditing}
            handleDelete={handleDelete}
            setImgError={setImgError}
          />

          {/* Bio */}
          <Bio
            editing={editing}
            form={form}
            handleChange={handleChange}
            userData={userData}
          />
          {/* Manage Project Owners */}
          {adminLoading.users ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex justify-center py-8">
                <CircularLoader />
              </div>
            </div>
          ) : (
            <DataTable
              title='Manage Project Owners'
              data={filteredProjectOwners}
              icon={<Briefcase size={22} />}
              columns={poColumns}
              filterOptions={["Active", "Suspended"]}
              filterValue={poFilter}
              setFilter={setPoFilter}
            />
          )}

          {/* Manage Developers */}
          {adminLoading.developers || adminLoading.users ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex justify-center py-8">
                <CircularLoader />
              </div>
            </div>
          ) : (
            <DataTable
              title='Manage Developers'
              data={filteredDevelopers}
              icon={<Users size={22} />}
              columns={devColumns}
              filterOptions={["Active", "Pending"]}
              filterValue={devFilter}
              setFilter={setDevFilter}
            />
          )}

          {/* System Analytics Dashboard */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h2 className='text-xl font-semibold mb-4 flex items-center'>
              <BarChart3 className='w-8 h-8 mr-2 text-blue-400' /> System Analytics
            </h2>
            {adminLoading.analytics ? (
              <div className="flex justify-center py-8">
                <CircularLoader />
              </div>
            ) : (
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {SYSTEM_ANALYTICS_DATA.map((metric, index) => (
                <div key={index} className='bg-white/5 rounded-lg p-4 border border-white/10'>
                  <div className='flex items-center justify-between mb-2'>
                    {metric.icon}
                    <span className={`text-xs px-2 py-1 rounded-full ${metric.trend === 'up' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                      {metric.change}
                    </span>
                  </div>
                  <div className='text-2xl font-bold text-white mb-1'>{metric.value}</div>
                  <div className='text-sm text-gray-400'>{metric.label}</div>
                </div>
              ))}
              </div>
            )}
          </div>

          {/* Skill Demand Trends */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h2 className='text-xl font-semibold mb-4 flex items-center'>
              <TrendingUp className='w-8 h-8 mr-2 text-green-400' /> Skill Demand Trends
            </h2>
            {skillTrendsLoading ? (
              <div className="flex justify-center py-8">
                <CircularLoader />
              </div>
            ) : skillDemandTrends.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No skill trends data available</p>
            ) : (
              <div className='space-y-4'>
                {skillDemandTrends.map((skill, index) => (
                <div key={index} className='bg-white/5 rounded-lg p-4 border border-white/10'>
                  <div className='flex justify-between items-center mb-2'>
                    <span className='font-medium'>{skill.skill}</span>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm text-gray-400'>{skill.growth}</span>
                      <span className='text-lg font-bold'>{skill.demand}%</span>
                    </div>
                  </div>
                  <div className='w-full bg-gray-700 rounded-full h-2'>
                    <div
                      className={`h-2 rounded-full ${skill.color} transition-all duration-300`}
                      style={{ width: `${skill.demand}%` }}
                    />
                  </div>
                </div>
                ))}
              </div>
            )}
          </div>

          {/* Flagged Projects */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h2 className='text-xl font-semibold mb-4 flex items-center'>
              <Flag className='w-8 h-8 mr-2 text-red-400' /> Flagged Projects
            </h2>
            {adminLoading.analytics ? (
              <div className="flex justify-center py-8">
                <CircularLoader />
              </div>
            ) : FLAGGED_PROJECTS_DATA.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No flagged projects at this time</p>
            ) : (
              <div className='space-y-3'>
                {FLAGGED_PROJECTS_DATA.map((project) => (
                <div key={project.id} className='bg-white/5 rounded-lg p-4 border border-white/10'>
                  <div className='flex justify-between items-start mb-2'>
                    <div>
                      <h3 className='font-medium'>{project.title}</h3>
                      <p className='text-sm text-gray-400'>{project.reason}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${project.severity === 'Critical' ? 'bg-red-500/20 text-red-300' :
                        project.severity === 'High' ? 'bg-orange-500/20 text-orange-300' :
                          'bg-yellow-500/20 text-yellow-300'
                      }`}>
                      {project.severity}
                    </span>
                  </div>
                  <div className='flex justify-between items-center text-sm text-gray-400'>
                    <span>Reporter: {project.reporter}</span>
                    <span>Date: {project.date}</span>
                  </div>
                  <div className='mt-2 flex gap-2'>
                    <Button 
                      className='px-3 py-1 text-xs rounded-lg bg-blue-500 hover:bg-blue-600 text-white'
                    >
                      <Eye className='w-3 h-3 inline mr-1' />
                      Review
                    </Button>
                    <Button 
                      className='px-3 py-1 text-xs rounded-lg bg-green-500 hover:bg-green-600 text-white'
                    >
                      <CheckCircle2 className='w-3 h-3 inline mr-1' />
                      Approve
                    </Button>
                    <Button 
                      className='px-3 py-1 text-xs rounded-lg bg-red-500 hover:bg-red-600 text-white'
                    >
                      <Ban className='w-3 h-3 inline mr-1' />
                      Ban
                    </Button>
                  </div>
                </div>
                ))}
              </div>
            )}
          </div>


        </div>

        {/* Right Column */}
        <div className='space-y-6'>
          {/* Quick Actions */}
          <QuickActions navigate={handleNavigate} handleSave={handleSave} />

          {/* Account Info */}
          <InfoCard
            icon={<User className='w-5 h-5 text-yellow-400' />}
            title='Account Info'
            items={[
              { label: "Role", value: userData?.role || "Admin" },
              {
                label: "Email Verified",
                value: userData?.isEmailVerified ? (
                  <CheckCircle className='inline w-4 h-4 text-green-400' />
                ) : (
                  <XCircle className='inline w-4 h-4 text-red-400' />
                ),
              },
              {
                label: "Joined",
                value: userData?.createdAt
                  ? new Date(userData.createdAt).toLocaleDateString()
                  : "2025-01-01",
              },
              {
                label: "Last Updated",
                value: userData?.updatedAt
                  ? new Date(userData.updatedAt).toLocaleDateString()
                  : "2025-09-01",
              },
            ]}
            isKeyValue
          />

          {/* Permissions */}
          <InfoCard
            icon={<Shield className='w-5 h-5 text-yellow-400' />}
            title='Permissions & Access'
            items={permissionsData.map((perm) => `🔑 ${perm}`)}
            fallback='No permissions assigned.'
          />

          {/* Security Settings */}
          <InfoCard
            icon={<Key className='w-5 h-5 text-yellow-400' />}
            title='Security Settings'
            items={securitySettingsData.map((s) => ({
              label: s.label,
              value:
                typeof s.value === "boolean"
                  ? s.value
                    ? "Enabled"
                    : "Disabled"
                  : s.value,
            }))}
            isKeyValue
            fallback='No security settings found.'
          />

          {/* Recent Activity */}
          <InfoCard
            icon={<Activity className='w-5 h-5 text-yellow-400' />}
            title='Recent Activity'
            items={activityFeedData}
            fallback='No recent activity.'
          />

          {/* Moderation Tools */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h3 className='text-lg font-semibold mb-4 flex items-center'>
              <Settings className='w-5 h-5 text-red-400 mr-2' />
              Moderation Tools
            </h3>
            <div className='space-y-3'>
              <Button 
                className='w-full flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-gray-700/50 transition-colors'
              >
                <div className='flex items-center'>
                  <Ban className='w-4 h-4 mr-2 text-red-400' />
                  <span className='text-sm'>Ban User</span>
                </div>
                <span className='text-xs text-gray-400'>Quick Action</span>
              </Button>
              <Button 
                className='w-full flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-gray-700/50 transition-colors'
              >
                <div className='flex items-center'>
                  <CheckCircle2 className='w-4 h-4 mr-2 text-green-400' />
                  <span className='text-sm'>Verify User</span>
                </div>
                <span className='text-xs text-gray-400'>Quick Action</span>
              </Button>
              <Button 
                className='w-full flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-gray-700/50 transition-colors'
              >
                <div className='flex items-center'>
                  <Flag className='w-4 h-4 mr-2 text-orange-400' />
                  <span className='text-sm'>Flag Project</span>
                </div>
                <span className='text-xs text-gray-400'>Quick Action</span>
              </Button>
              <Button 
                className='w-full flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-gray-700/50 transition-colors'
              >
                <div className='flex items-center'>
                  <AlertTriangle className='w-4 h-4 mr-2 text-yellow-400' />
                  <span className='text-sm'>Resolve Dispute</span>
                </div>
                <span className='text-xs text-gray-400'>Quick Action</span>
              </Button>
            </div>
          </div>

          {/* Recent Moderation Actions */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h3 className='text-lg font-semibold mb-4 flex items-center'>
              <Clock className='w-5 h-5 text-blue-400 mr-2' />
              Recent Moderation Actions
            </h3>
            {adminLoading.analytics ? (
              <div className="flex justify-center py-8">
                <CircularLoader />
              </div>
            ) : MODERATION_ACTIONS_DATA.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No recent moderation actions</p>
            ) : (
              <div className='space-y-3'>
                {MODERATION_ACTIONS_DATA.map((action, index) => (
                  <div key={index} className='bg-white/5 rounded-lg p-3 border border-white/10'>
                    <div className='flex justify-between items-start mb-1'>
                      <span className='text-sm font-medium'>{action.action}</span>
                      <span className='text-xs text-gray-400'>{action.date}</span>
                    </div>
                    <div className='text-xs text-gray-400 mb-1'>{action.target}</div>
                    <div className='text-xs text-gray-500'>{action.reason}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* System Health */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h3 className='text-lg font-semibold mb-4 flex items-center'>
              <Database className='w-5 h-5 text-green-400 mr-2' />
              System Health
            </h3>
            {adminLoading.analytics ? (
              <div className="flex justify-center py-4">
                <CircularLoader />
              </div>
            ) : (
              <div className='space-y-3'>
                {adminAnalytics?.systemHealth ? (
                  Object.entries(adminAnalytics.systemHealth).map(([service, status]) => (
                    <div key={service} className='flex justify-between items-center'>
                      <span className='text-sm text-gray-300 capitalize'>{service.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        status === 'healthy' || status === 'online' || status === 'active' ? 'bg-green-500/20 text-green-300' :
                        status === 'warning' || status === 'slow' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {typeof status === 'string' ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4 text-sm">System health data not available</p>
                )}
              </div>
            )}
          </div>
          {/* Billing Reports */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h2 className='text-xl font-semibold mb-4 flex items-center'>
              <DollarSign className='w-8 h-8 mr-2 text-green-400' /> Billing Reports
            </h2>
            {adminLoading.analytics ? (
              <div className="flex justify-center py-8">
                <CircularLoader />
              </div>
            ) : BILLING_REPORTS_DATA.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No billing reports available</p>
            ) : (
              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead>
                    <tr className='border-b border-white/10'>
                      <th className='text-left py-2'>Month</th>
                      <th className='text-left py-2'>Revenue</th>
                      <th className='text-left py-2'>Subscriptions</th>
                      <th className='text-left py-2'>Churn Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BILLING_REPORTS_DATA.map((report, index) => (
                      <tr key={index} className='border-b border-white/5'>
                        <td className='py-2'>{report.month}</td>
                        <td className='py-2 font-medium text-green-400'>{report.revenue}</td>
                        <td className='py-2'>{report.subscriptions}</td>
                        <td className='py-2'>{report.churn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {/* Confirm Delete Modal */}
          <ConfirmModal
            isOpen={showConfirm}
            title='Delete Account'
            message='Are you sure you want to permanently delete your account? This action cannot be undone.'
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        </div>
      </div>
    </div>
  );
});

export default Admin;
