import React from "react";
import {
  FileText,
  Award,
  User,
  Bell,
  CheckCircle,
  XCircle,
} from "lucide-react";
import ConfirmModal from "../../../components/modal/ConfirmModal";
import Circular from "../../../components/loader/Circular";
import Navbar from "../../../components/header";
import {
  Bio,
  ProfessionalInfo,
  QuickActions,
  Skills,
  SocialLinks,
  UserCard,
  InfoCard,
} from "../../../components/Profile";

export default function Developer({
  userData,
  form,
  setForm,
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
  handleResumeChange,
  handleAvatarChange,
  navigate,
}) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
      {/* Navbar */}
      <Navbar data={userData} isSearchBar={false} />
      {loading && <Circular />}

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8'>
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

          {/* Professional Info */}
          <ProfessionalInfo
            editing={editing}
            form={form}
            handleChange={handleChange}
            userData={userData}
          />

          {/* Resume */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h2 className='text-xl font-semibold mb-4 flex items-center'>
              <FileText className='w-8 h-8 mr-2 text-amber-400' /> Resume
            </h2>
            {editing ? (
              <input
                id='file'
                name='file'
                type='file'
                accept='application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.oasis.opendocument.text,application/rtf,text/plain'
                onChange={handleResumeChange}
                className='block text-sm text-gray-300'
              />
            ) : userData?.resumeUrl?.url ? (
              <a
                href={userData?.resumeUrl?.url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-400 underline'
              >
                View Resume
              </a>
            ) : (
              <p className='text-gray-400'>No resume uploaded</p>
            )}
          </div>

          {/* Skills */}
          <Skills editing={editing} form={form} setForm={setForm} />

          {/* Social Links */}
          <SocialLinks
            editing={editing}
            form={form}
            handleChange={handleChange}
            userData={userData}
          />
        </div>

        {/* Right Column - Sidebar */}
        <div className='space-y-6'>
          <QuickActions navigate={navigate} handleSave={handleSave} />
          <InfoCard
            icon={<Award className='w-5 h-5 text-yellow-400' />}
            title='Achievements'
            items={userData?.badges || []}
            fallback='No achievements yet.'
          />
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
          <InfoCard
            icon={<Bell className='w-5 h-5 text-yellow-400' />}
            title='Notification Preferences'
            items={Object.entries(userData?.notificationPrefs || {}).map(
              ([key, value]) => ({
                label: key.charAt(0).toUpperCase() + key.slice(1),
                value: value ? "Enabled" : "Disabled",
              })
            )}
            fallback='No notification preferences set.'
            isKeyValue
          />

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
