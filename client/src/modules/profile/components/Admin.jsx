import React, { useState } from "react";
import ConfirmModal from "../../../components/modal/ConfirmModal";
import Circular from "../../../components/loader/Circular";
import Navbar from "../../../components/header";
import { Shield, BarChart } from "lucide-react";
import {
  Bio,
  QuickActions,
  UserCard,
  SystemMetrics,
  AnalyticsSnapshot,
  DataTable,
  InfoCard,
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
  const [userFilter, setUserFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");

  // Static/mock data
  const logs = [
    "Admin Alice suspended user Mark",
    "System maintenance completed",
    "New project approved by Admin Sophia",
    "User John upgraded to Project Owner role",
  ];
  const stats = [
    { value: "1,245", label: "Active Users" },
    { value: "320", label: "Projects" },
    { value: "89%", label: "System Uptime" },
    { value: "56", label: "New Signups" },
  ];
  const reportsData = [
    { label: "User Reports", value: 12, icon: "🚨" },
    { label: "Project Reports", value: 5, icon: "📂" },
    { label: "Pending Reviews", value: 3, icon: "⏳" },
    { label: "Other Metrics", value: 7 },
  ];
  const metricsData = [
    { label: "Total Users", value: 1245 },
    { label: "Active Projects", value: 320 },
    { label: "Pending Requests", value: 56 },
  ];
  const systemStatsData = [
    { label: "Server Uptime", value: "99.99%" },
    { label: "Tasks Processed", value: 1245 },
    { label: "System Load", value: "Moderate" },
  ];
  const usersData = [
    { id: 1, name: "Alice Johnson", role: "Developer", status: "Active" },
    { id: 2, name: "Mark Lee", role: "Project Owner", status: "Suspended" },
    { id: 3, name: "Sophia Chen", role: "Admin", status: "Active" },
  ];
  const projectsData = [
    { id: 1, name: "MindCare", owner: "Mark Lee", status: "Active" },
    { id: 2, name: "SkillBridge Pro", owner: "Sophia Chen", status: "Pending" },
    {
      id: 3,
      name: "Portfolio Platform",
      owner: "Alice Johnson",
      status: "Active",
    },
  ];

  // Filtered data
  const filteredUsers =
    userFilter === "All"
      ? usersData
      : usersData.filter((u) => u.role === userFilter);
  const filteredProjects =
    projectFilter === "All"
      ? projectsData
      : projectsData.filter((p) => p.status === projectFilter);

  // Mock handlers for static UI
  const handleSuspendUser = (id) =>
    alert(`Suspend/Activate user with id: ${id}`);
  const handleAssignRole = (id, role) =>
    alert(`Assign ${role} to user id: ${id}`);
  const handleApproveProject = (id) => alert(`Approve project id: ${id}`);
  const handleDeleteProject = (id) => alert(`Delete project id: ${id}`);
  const handleNavigate = (path) =>
    navigate ? navigate(path) : alert(`Navigate to ${path}`);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
      <Navbar data={userData} isSearchBar={false} />
      {loading && <Circular />}

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Column */}
        <div className='lg:col-span-2 space-y-8'>
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
          <Bio
            editing={editing}
            form={form}
            handleChange={handleChange}
            userData={userData}
          />

          {/* Manage Users */}
          <DataTable
            title='Manage Users'
            data={filteredUsers}
            filterOptions={[...new Set(usersData.map((u) => u.role))]}
            filterValue={userFilter}
            setFilter={setUserFilter}
            columns={[
              { label: "Name", key: "name" },
              { label: "Role", key: "role" },
              { label: "Status", key: "status" },
              {
                label: "Actions",
                render: (user) => (
                  <div className='flex gap-2'>
                    <button
                      onClick={() => handleSuspendUser(user.id)}
                      className='bg-red-500 px-2 py-1 rounded text-black'
                    >
                      {user.status === "Active" ? "Suspend" : "Activate"}
                    </button>
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleAssignRole(user.id, e.target.value)
                      }
                      className='bg-white/10 text-gray-300 px-2 py-1 rounded'
                    >
                      {["Developer", "Project Owner", "Admin"].map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                ),
              },
            ]}
          />

          {/* Manage Projects */}
          <DataTable
            title='Manage Projects'
            data={filteredProjects}
            filterOptions={[...new Set(projectsData.map((p) => p.status))]}
            filterValue={projectFilter}
            setFilter={setProjectFilter}
            columns={[
              { label: "Project Name", key: "name" },
              { label: "Owner", key: "owner" },
              { label: "Status", key: "status" },
              {
                label: "Actions",
                render: (proj) => (
                  <div className='flex gap-2'>
                    {proj.status === "Pending" && (
                      <button
                        onClick={() => handleApproveProject(proj.id)}
                        className='bg-amber-500 px-2 py-1 rounded text-black'
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className='bg-red-500 px-2 py-1 rounded text-black'
                    >
                      Delete
                    </button>
                  </div>
                ),
              },
            ]}
          />
        </div>

        {/* Right Column */}
        <div className='space-y-6'>
          <QuickActions navigate={handleNavigate} handleSave={handleSave} />

          <InfoCard
            icon={<Shield className='w-5 h-5 text-yellow-400' />}
            title='Reports & Moderation'
            items={reportsData.map((report) => ({
              label: report.label,
              value: (
                <>
                  {report.icon ? <span>{report.icon}</span> : null}{" "}
                  {report.value}
                </>
              ),
            }))}
            fallback='No reports available.'
            isKeyValue
          />
   
          <InfoCard
            icon={<BarChart className='w-5 h-5 text-yellow-400' />}
            title='System Stats'
            items={systemStatsData}
            fallback='No system stats available.'
            isKeyValue
          />
          <AnalyticsSnapshot stats={stats} />
          <SystemMetrics metrics={metricsData} />
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
