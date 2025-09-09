import React, { useState } from "react";
import {
  Shield,
  Key,
  User,
  CheckCircle,
  XCircle,
  Activity,
  Briefcase,
  Users,
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

export default function Admin({
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

  // --- Static Data for Project Owners ---
  const projectOwners = [
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

  // --- Static Data for Developers ---
  const developers = [
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

  // --- Project Owners Columns ---
  const poColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "projects", label: "Projects" },
    { key: "status", label: "Status" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
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
      ),
    },
  ];

  // --- Developers Columns ---
  const devColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "skills", label: "Skills" },
    { key: "status", label: "Status" },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
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
      ),
    },
  ];

  // 🔹 Static dummy data
  const permissions = [
    "Manage Users",
    "Moderate Projects",
    "View Reports",
    "Handle Payments",
  ];
  const securitySettings = [
    { label: "2FA Enabled", value: true },
    { label: "Last Password Change", value: "2025-08-21" },
    { label: "Active Sessions", value: "3 Devices" },
  ];
  const activityFeed = [
    "✅ Suspended user JohnDoe",
    "⚡ Approved project FinTech App",
    "🛡️ Resolved 3 reports",
    "📊 Reviewed analytics dashboard",
  ];

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
            data={projectOwners.filter(
              (po) => poFilter === "All" || po.status === poFilter
            )}
            icon={<Briefcase size={22} />}
            columns={poColumns}
            filterOptions={["Active", "Suspended"]}
            filterValue={poFilter}
            setFilter={setPoFilter}
          />

          {/* Manage Developers */}
          <DataTable
            title='Manage Developers'
            data={developers.filter(
              (dev) => devFilter === "All" || dev.status === devFilter
            )}
            icon={<Users size={22} />}
            columns={devColumns}
            filterOptions={["Active", "Pending"]}
            filterValue={devFilter}
            setFilter={setDevFilter}
          />
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
            items={permissions.map((perm) => `🔑 ${perm}`)}
            fallback='No permissions assigned.'
          />

          {/* Security Settings */}
          <InfoCard
            icon={<Key className='w-5 h-5 text-yellow-400' />}
            title='Security Settings'
            items={securitySettings.map((s) => ({
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
            items={activityFeed}
            fallback='No recent activity.'
          />

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
}
