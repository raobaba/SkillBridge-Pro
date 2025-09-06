import React from "react";
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
          {/* Team Size & Domain */}
          <TeamDomain
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
        </div>

        {/* Right Column */}
        <div className='space-y-6'>
          {/* Quick Actions */}
          <QuickActions navigate={navigate} handleSave={handleSave} />

          {/* Achievements */}
          <Achievements userData={userData} />

          {/* Account Info */}
          <AccountInfo userData={userData} />

          {/* Confirm Modal */}
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
