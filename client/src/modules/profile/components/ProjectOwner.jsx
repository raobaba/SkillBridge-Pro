import React,{useState} from "react";
import { Users, TrendingUp, Target, Zap } from "lucide-react";
import ConfirmModal from "../../../components/modal/ConfirmModal";
import Circular from "../../../components/loader/Circular";
import Navbar from "../../../components/header";
import {
  Bio,
  QuickActions,
  SocialLinks,
  UserCard,
  Achievements,
  AccountInfo,
  Projects,
  TeamDomain,
  ProjectOverview,
  DeveloperAccess,
  CollaborationRequests,
  Milestones,
  DataTable
} from "../../../components/Profile";

export default function ProjectOwner({
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
  const requests = [
    { name: "David", skill: "UI/UX Designer" },
    { name: "Emma", skill: "Data Scientist" },
  ];

  const developers = [
    { name: "Alice", role: "Frontend", status: "Active" },
    { name: "Bob", role: "Backend", status: "Active" },
    { name: "Charlie", role: "Fullstack", status: "Invited" },
  ];

  const columns = ["Name", "Role", "Status"];

  const milestones = [
    { title: "Prototype Complete", date: "2025-09-15", status: "Done" },
    { title: "Beta Release", date: "2025-10-01", status: "Upcoming" },
    { title: "Final Launch", date: "2025-11-10", status: "Upcoming" },
  ];

  const projectStats = [
    { label: "Active", count: 3, color: "#22c55e" }, // green-400
    { label: "Completed", count: 5, color: "#3b82f6" }, // blue-400
    { label: "Pending", count: 2, color: "#eab308" }, // yellow-400
  ];

    const usersData = [
    { id: 1, name: "Alice Johnson", role: "Developer", status: "Active" },
    { id: 2, name: "Mark Lee", role: "Project Owner", status: "Suspended" },
    { id: 3, name: "Sophia Chen", role: "Admin", status: "Active" },
  ];

    // Filtered data
  const filteredUsers =
    userFilter === "All"
      ? usersData
      : usersData.filter((u) => u.role === userFilter);

  // Mock handlers for static UI
  const handleSuspendUser = (id) =>
    alert(`Suspend/Activate user with id: ${id}`);
  const handleAssignRole = (id, role) =>
    alert(`Assign ${role} to user id: ${id}`);


  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
      <Navbar data={userData} isSearchBar={false} />
      {loading && <Circular />}

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Column */}
        <div className='lg:col-span-2 space-y-8'>
          {/* User Card */}
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
          {/* Projects Info */}
          <Projects
            editing={editing}
            form={form}
            handleChange={handleChange}
            userData={userData}
          />

          {/* Milestones */}
          <Milestones milestones={milestones} />

          {/* Social Links */}
          <SocialLinks
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
        </div>

        {/* Right Column */}
        <div className='space-y-6'>
          <QuickActions navigate={navigate} handleSave={handleSave} />
          <Achievements userData={userData} />
          <AccountInfo userData={userData} />
          <ProjectOverview stats={projectStats} />
          <DeveloperAccess developers={developers} columns={columns} />
          {/* CollaborationRequests */}
          <CollaborationRequests requests={requests} />
          {/* Team Size & Domain */}
          <TeamDomain
            editing={editing}
            form={form}
            handleChange={handleChange}
            userData={userData}
          />
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
