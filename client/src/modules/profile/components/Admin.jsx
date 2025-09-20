import React, { useState, useMemo, memo } from "react";
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
import ConfirmModal from "../../../components/modal/ConfirmModal";
import Circular from "../../../components/loader/Circular";
import Navbar from "../../../components/header";
import {
  Bio,
  QuickActions,
  UserCard,
  InfoCard,
  DataTable,
} from "../../../components/Profile";

// Enhanced static data for Admin control panel features
const SYSTEM_ANALYTICS_DATA = [
  { label: "Total Users", value: "2,847", change: "+12%", trend: "up", icon: <Users className="w-4 h-4" /> },
  { label: "Active Projects", value: "156", change: "+8%", trend: "up", icon: <Briefcase className="w-4 h-4" /> },
  { label: "Monthly Revenue", value: "$45,230", change: "+15%", trend: "up", icon: <DollarSign className="w-4 h-4" /> },
  { label: "System Uptime", value: "99.9%", change: "+0.1%", trend: "up", icon: <Database className="w-4 h-4" /> },
];

const SKILL_DEMAND_TRENDS = [
  { skill: "React", demand: 85, growth: "+12%", color: "bg-blue-500" },
  { skill: "Node.js", demand: 78, growth: "+8%", color: "bg-green-500" },
  { skill: "Python", demand: 72, growth: "+15%", color: "bg-yellow-500" },
  { skill: "AWS", demand: 68, growth: "+20%", color: "bg-orange-500" },
  { skill: "Docker", demand: 61, growth: "+18%", color: "bg-purple-500" },
];

const FLAGGED_PROJECTS_DATA = [
  {
    id: 1,
    title: "Suspicious Payment Request",
    reason: "Unusual payment terms",
    severity: "High",
    reporter: "System Auto-Flag",
    date: "2025-01-20",
    status: "Under Review",
  },
  {
    id: 2,
    title: "Potential Scam Project",
    reason: "Multiple user reports",
    severity: "Critical",
    reporter: "User Reports",
    date: "2025-01-19",
    status: "Investigation",
  },
  {
    id: 3,
    title: "Copyright Violation",
    reason: "Stolen project description",
    severity: "Medium",
    reporter: "DMCA Notice",
    date: "2025-01-18",
    status: "Resolved",
  },
];

const BILLING_REPORTS_DATA = [
  { month: "January 2025", revenue: "$45,230", subscriptions: 234, churn: "2.1%" },
  { month: "December 2024", revenue: "$42,180", subscriptions: 228, churn: "3.2%" },
  { month: "November 2024", revenue: "$38,950", subscriptions: 221, churn: "1.8%" },
];

const MODERATION_ACTIONS_DATA = [
  { action: "Banned user", target: "spam_user_123", reason: "Spam activities", date: "2025-01-20" },
  { action: "Verified user", target: "john_developer", reason: "Identity verification", date: "2025-01-19" },
  { action: "Resolved dispute", target: "Project #456", reason: "Payment dispute", date: "2025-01-18" },
  { action: "Suspended account", target: "fake_company", reason: "Fake organization", date: "2025-01-17" },
];

const USER_GROWTH_DATA = [
  { month: "Jan", users: 2847, projects: 156 },
  { month: "Dec", users: 2541, projects: 142 },
  { month: "Nov", users: 2234, projects: 128 },
  { month: "Oct", users: 1987, projects: 115 },
];

// Static data moved outside component to prevent recreation
const PROJECT_OWNERS_DATA = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@company.com",
    projects: 4,
    status: "Active",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@startup.io",
    projects: 2,
    status: "Suspended",
  },
];

const DEVELOPERS_DATA = [
  {
    id: 1,
    name: "Charlie Brown",
    email: "charlie@dev.com",
    skills: "React, Node.js",
    status: "Active",
  },
  {
    id: 2,
    name: "David Green",
    email: "david@dev.com",
    skills: "Python, Django",
    status: "Pending",
  },
];

const PERMISSIONS_DATA = [
  "Manage Users",
  "Moderate Projects",
  "View Reports",
  "Handle Payments",
];

const SECURITY_SETTINGS_DATA = [
  { label: "2FA Enabled", value: true },
  { label: "Last Password Change", value: "2025-08-21" },
  { label: "Active Sessions", value: "3 Devices" },
];

const ACTIVITY_FEED_DATA = [
  "✅ Suspended user JohnDoe",
  "⚡ Approved project FinTech App",
  "🛡️ Resolved 3 reports",
  "📊 Reviewed analytics dashboard",
];

// Memoized action buttons component
const ActionButtons = memo(({ row }) => (
  <div className='flex gap-2'>
    <button className='px-3 py-1 rounded-lg bg-green-500 text-white text-sm hover:bg-green-600'>
      Approve
    </button>
    <button className='px-3 py-1 rounded-lg bg-yellow-500 text-white text-sm hover:bg-yellow-600'>
      Suspend
    </button>
    <button className='px-3 py-1 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600'>
      Remove
    </button>
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
  const handleNavigate = (path) =>
    navigate ? navigate(path) : alert(`Navigate to ${path}`);

  const [poFilter, setPoFilter] = useState("All");
  const [devFilter, setDevFilter] = useState("All");

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
          <DataTable
            title='Manage Project Owners'
            data={filteredProjectOwners}
            icon={<Briefcase size={22} />}
            columns={poColumns}
            filterOptions={["Active", "Suspended"]}
            filterValue={poFilter}
            setFilter={setPoFilter}
          />

          {/* Manage Developers */}
          <DataTable
            title='Manage Developers'
            data={filteredDevelopers}
            icon={<Users size={22} />}
            columns={devColumns}
            filterOptions={["Active", "Pending"]}
            filterValue={devFilter}
            setFilter={setDevFilter}
          />

          {/* System Analytics Dashboard */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h2 className='text-xl font-semibold mb-4 flex items-center'>
              <BarChart3 className='w-8 h-8 mr-2 text-blue-400' /> System Analytics
            </h2>
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
          </div>

          {/* Skill Demand Trends */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h2 className='text-xl font-semibold mb-4 flex items-center'>
              <TrendingUp className='w-8 h-8 mr-2 text-green-400' /> Skill Demand Trends
            </h2>
            <div className='space-y-4'>
              {SKILL_DEMAND_TRENDS.map((skill, index) => (
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
          </div>

          {/* Flagged Projects */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h2 className='text-xl font-semibold mb-4 flex items-center'>
              <Flag className='w-8 h-8 mr-2 text-red-400' /> Flagged Projects
            </h2>
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
                    <button className='px-3 py-1 text-xs rounded-lg bg-blue-500 hover:bg-blue-600 text-white'>
                      <Eye className='w-3 h-3 inline mr-1' />
                      Review
                    </button>
                    <button className='px-3 py-1 text-xs rounded-lg bg-green-500 hover:bg-green-600 text-white'>
                      <CheckCircle2 className='w-3 h-3 inline mr-1' />
                      Approve
                    </button>
                    <button className='px-3 py-1 text-xs rounded-lg bg-red-500 hover:bg-red-600 text-white'>
                      <Ban className='w-3 h-3 inline mr-1' />
                      Ban
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
            items={PERMISSIONS_DATA.map((perm) => `🔑 ${perm}`)}
            fallback='No permissions assigned.'
          />

          {/* Security Settings */}
          <InfoCard
            icon={<Key className='w-5 h-5 text-yellow-400' />}
            title='Security Settings'
            items={SECURITY_SETTINGS_DATA.map((s) => ({
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
            items={ACTIVITY_FEED_DATA}
            fallback='No recent activity.'
          />

          {/* Moderation Tools */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h3 className='text-lg font-semibold mb-4 flex items-center'>
              <Settings className='w-5 h-5 text-red-400 mr-2' />
              Moderation Tools
            </h3>
            <div className='space-y-3'>
              <button className='w-full flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors'>
                <div className='flex items-center'>
                  <Ban className='w-4 h-4 mr-2 text-red-400' />
                  <span className='text-sm'>Ban User</span>
                </div>
                <span className='text-xs text-gray-400'>Quick Action</span>
              </button>
              <button className='w-full flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors'>
                <div className='flex items-center'>
                  <CheckCircle2 className='w-4 h-4 mr-2 text-green-400' />
                  <span className='text-sm'>Verify User</span>
                </div>
                <span className='text-xs text-gray-400'>Quick Action</span>
              </button>
              <button className='w-full flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors'>
                <div className='flex items-center'>
                  <Flag className='w-4 h-4 mr-2 text-orange-400' />
                  <span className='text-sm'>Flag Project</span>
                </div>
                <span className='text-xs text-gray-400'>Quick Action</span>
              </button>
              <button className='w-full flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors'>
                <div className='flex items-center'>
                  <AlertTriangle className='w-4 h-4 mr-2 text-yellow-400' />
                  <span className='text-sm'>Resolve Dispute</span>
                </div>
                <span className='text-xs text-gray-400'>Quick Action</span>
              </button>
            </div>
          </div>

          {/* Recent Moderation Actions */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h3 className='text-lg font-semibold mb-4 flex items-center'>
              <Clock className='w-5 h-5 text-blue-400 mr-2' />
              Recent Moderation Actions
            </h3>
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
          </div>

          {/* System Health */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h3 className='text-lg font-semibold mb-4 flex items-center'>
              <Database className='w-5 h-5 text-green-400 mr-2' />
              System Health
            </h3>
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-300'>API Status</span>
                <span className='px-2 py-1 rounded-full bg-green-500/20 text-green-300 text-xs'>
                  Healthy
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-300'>Database</span>
                <span className='px-2 py-1 rounded-full bg-green-500/20 text-green-300 text-xs'>
                  Online
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-300'>CDN</span>
                <span className='px-2 py-1 rounded-full bg-green-500/20 text-green-300 text-xs'>
                  Active
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-300'>Email Service</span>
                <span className='px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-xs'>
                  Slow
                </span>
              </div>
            </div>
          </div>
          {/* Billing Reports */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h2 className='text-xl font-semibold mb-4 flex items-center'>
              <DollarSign className='w-8 h-8 mr-2 text-green-400' /> Billing Reports
            </h2>
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
