import React, { useState } from "react";
import {
  User,
  Award,
  XCircle,
  CheckCircle,
  Zap,
  Users,
} from "lucide-react";
import ConfirmModal from "../../../components/modal/ConfirmModal";
import Circular from "../../../components/loader/Circular";
import Navbar from "../../../components/header";
import {
  Bio,
  QuickActions,
  SocialLinks,
  UserCard,
  InfoCard,
  DataTable,
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
  // 🔹 Static skills & activities
  const skills = [
    "React",
    "Node.js",
    "MongoDB",
    "AWS",
    "Docker",
    "Team Leadership",
  ];
  // Static developer dataset
  const staticData = [
    {
      id: 1,
      name: "Alice Johnson",
      skills: "React, Node.js",
      status: "Active",
      project: "FinTech App",
      joined: "2025-01-10",
    },
    {
      id: 2,
      name: "Bob Smith",
      skills: "Python, Django",
      status: "Onboarding",
      project: "Health Tracker",
      joined: "2025-02-18",
    },
    {
      id: 3,
      name: "Charlie Brown",
      skills: "AWS, Docker",
      status: "Active",
      project: "E-commerce Platform",
      joined: "2024-12-05",
    },
  ];

  // Columns for table
  const columns = [
    { label: "ID", key: "id" },
    { label: "Developer Name", key: "name" },
    { label: "Skills", key: "skills" },
    { label: "Status", key: "status" },
    { label: "Assigned Project", key: "project" },
    { label: "Joined Date", key: "joined" },
    {
      label: "Actions",
      render: (row) => (
        <div className='flex gap-2'>
          <button
            className='px-3 cursor-pointer py-1 text-xs rounded-lg bg-blue-500 hover:bg-blue-600 text-white'
            onClick={() => alert(`Viewing profile of ${row.name}`)}
          >
            View
          </button>
          <button
            className='px-3 cursor-pointer py-1 text-xs rounded-lg bg-green-500 hover:bg-green-600 text-white'
            onClick={() => alert(`Assigning project for ${row.name}`)}
          >
            Assign
          </button>
          <button
            className='px-3 cursor-pointer py-1 text-xs rounded-lg bg-red-500 hover:bg-red-600 text-white'
            onClick={() => alert(`Suspending ${row.name}`)}
          >
            Suspend
          </button>
        </div>
      ),
    },
  ];

  // Filter setup
  const [filterValue, setFilter] = useState("All");
  const filterOptions = ["Active", "Onboarding", "Suspended"];

  // Apply filter by status
  const filteredData =
    filterValue === "All"
      ? staticData
      : staticData.filter((row) => row.status === filterValue);

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

          {/* Social Links */}
          <SocialLinks
            editing={editing}
            form={form}
            handleChange={handleChange}
            userData={userData}
          />
          <DataTable
            title='Developer Management'
            data={filteredData}
            icon={<Users size={22} />}
            columns={columns}
            filterOptions={filterOptions}
            filterValue={filterValue}
            setFilter={setFilter}
          />
        </div>

        {/* Right Column */}
        <div className='space-y-6'>
          <QuickActions navigate={navigate} handleSave={handleSave} />

          {/* Achievements */}
          <InfoCard
            icon={<Award className='w-5 h-5 text-yellow-400' />}
            title='Achievements'
            items={userData?.badges || []}
            fallback='No achievements yet.'
          />

          {/* Account Info */}
          <InfoCard
            icon={<User className='w-5 h-5 text-yellow-400' />}
            title='Account Info'
            items={[
              { label: "Role", value: userData?.role || "N/A" },
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
                  : "N/A",
              },
              {
                label: "Last Updated",
                value: userData?.updatedAt
                  ? new Date(userData.updatedAt).toLocaleDateString()
                  : "N/A",
              },
            ]}
            isKeyValue
          />

          {/* Skills & Expertise (Responsive Tags) */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Zap className='w-5 h-5 text-purple-400' />
              <h3 className='text-lg font-semibold'>Skills & Expertise</h3>
            </div>
            <div className='flex flex-wrap gap-2'>
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className='px-3 py-1 text-sm rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 hover:bg-purple-500/30 transition'
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

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
