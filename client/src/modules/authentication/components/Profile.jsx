import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  MapPin,
  Code,
  Award,
  Settings,
  Save,
  X,
  Plus,
  Github,
  Linkedin,
  Globe,
  Trash,
  FileText,
  CheckCircle,
  XCircle,
  BarChart,
} from "lucide-react";
import { Input, Button, StackOverflowIcon } from "../../../components/ui/Card"; // your ui components
import {
  getUserProfile,
  updateUserProfile,
  deleteUser,
  clearAuthState,
} from "../slice/userSlice";
import ConfirmModal from "../../../components/modal/ConfirmModal";
import Circular from "../../../components/loader/Circular";
import Navbar from "../../../components/header/dashboard";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const { user, loading, error, message } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getUser = () => {
    dispatch(getUserProfile()).then((res) => {
      if (res?.payload) {
        setUserData(res?.payload?.user);
        setForm(res?.payload?.user);
      }
    });
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearAuthState());
    } else {
      toast.error(error);
      dispatch(clearAuthState());
    }
  }, [message, error]);

  useEffect(() => {
    getUser();
  }, [dispatch]);

  const handleSave = () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (
        key !== "resume" &&
        key !== "avatar" &&
        key !== "avatarPreview" &&
        key !== "newSkill"
      ) {
        if (key === "skills") {
          formData.append("skills", JSON.stringify(value));
        } else {
          formData.append(
            key,
            typeof value === "object" ? JSON.stringify(value) : value
          );
        }
      }
    });

    if (form.resume instanceof File) {
      formData.append("resume", form.resume);
    }
    if (form.avatar instanceof File) {
      formData.append("avatar", form.avatar);
    }
    dispatch(updateUserProfile(formData))
      .then((res) => {
        if (res?.payload?.status === 200) {
          getUser();
          setEditing(false);
          setForm((prev) => ({
            ...prev,
            avatarPreview: null,
            newSkill: "",
          }));
        }
      })
      .catch((err) => console.log("error", err));
  };

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (userData?.id) {
      dispatch(deleteUser(userData.id)).then((res) => {
        if (res?.payload?.status === 200) {
          navigate("/");
        }
      });
    }
    setShowConfirm(false);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
  };

  const handleResumeChange = (e) => {
    setForm((prev) => ({
      ...prev,
      resume: e.target.files[0],
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        avatar: file,
        avatarPreview: URL.createObjectURL(file),
      }));
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
      {/* Navbar */}
      <Navbar data={userData} isSearchBar={false} />
      {loading && <Circular />}

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 space-y-8'>
          {/* User Card */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 space-y-4 sm:space-y-0'>
            <div className='w-24 h-24 rounded-full border-2 border-blue-400 overflow-hidden bg-gray-800 relative'>
              <label className='cursor-pointer w-full h-full flex items-center justify-center'>
                {form?.avatarPreview ? (
                  <img
                    src={form.avatarPreview}
                    alt='Preview'
                    className='w-full h-full object-cover'
                  />
                ) : !imgError && userData?.avatarUrl ? (
                  <img
                    src={userData?.avatarUrl}
                    alt={userData?.name || "User"}
                    className='w-full h-full object-cover'
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <User className='w-12 h-12 text-gray-300' />
                )}

                <Input
                  accept='image/*'
                  type='file'
                  onChange={handleAvatarChange}
                  className='hidden'
                />
              </label>
            </div>

            <div className='flex-1 text-center sm:text-left'>
              {editing ? (
                <Input
                  name='name'
                  value={form?.name || ""}
                  onChange={handleChange}
                  className='text-2xl font-bold bg-white/10'
                />
              ) : (
                <h1 className='text-2xl font-bold'>
                  {userData?.name || "Unnamed"}
                </h1>
              )}
              <p className='text-gray-400 flex items-center justify-center sm:justify-start'>
                <Mail className='w-4 h-4 mr-2' />{" "}
                {userData?.email || "No email"}
              </p>
              <p className='text-gray-400 flex items-center justify-center sm:justify-start'>
                <MapPin className='w-4 h-4 mr-2' />{" "}
                {userData?.location || "Unknown"}
              </p>
            </div>
            <div className='flex space-x-2'>
              {editing ? (
                <>
                  <Button onClick={handleSave} variant='default'>
                    <Save className='w-4 h-4 mr-1' /> Save
                  </Button>
                  <Button onClick={() => setEditing(false)} variant='outline'>
                    <X className='w-4 h-4 mr-1' /> Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setEditing(true)} variant='default'>
                    <Settings className='w-4 h-4 mr-1' /> Edit
                  </Button>
                  <Button onClick={handleDelete} variant='outline'>
                    <Trash className='w-4 h-4 mr-1' /> Deactivate
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h2 className='text-xl font-semibold mb-4 flex items-center'>
              <User className='w-5 h-5 mr-2 text-blue-400' /> About Me
            </h2>
            {editing ? (
              <textarea
                name='bio'
                value={form?.bio || ""}
                onChange={handleChange}
                className='w-full bg-white/10 rounded-lg p-3 text-gray-100'
              />
            ) : (
              <p className='text-gray-300'>
                {userData?.bio || "No bio provided."}
              </p>
            )}
          </div>

          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h2 className='text-xl font-semibold mb-4'>Professional Info</h2>
            {editing ? (
              <div className='space-y-3'>
                <Input
                  name='experience'
                  value={form?.experience || ""}
                  onChange={handleChange}
                  placeholder='Experience (e.g., 3 years)'
                  className='bg-white/10'
                />
                <Input
                  name='availability'
                  value={form?.availability || ""}
                  onChange={handleChange}
                  placeholder='Availability (e.g., Full-time, Freelance)'
                  className='bg-white/10'
                />
                <Input
                  name='domainPreferences'
                  value={form?.domainPreferences || ""}
                  onChange={handleChange}
                  placeholder='Domain Preferences (e.g., AI, Web Dev)'
                  className='bg-white/10'
                />
              </div>
            ) : (
              <>
                <p>
                  <strong>Experience:</strong> {userData?.experience || "N/A"}
                </p>
                <p>
                  <strong>Availability:</strong>{" "}
                  {userData?.availability || "N/A"}
                </p>
                <p>
                  <strong>Domain Preferences:</strong>{" "}
                  {userData?.domainPreferences || "N/A"}
                </p>
              </>
            )}
          </div>

          {/* Resume */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h2 className='text-xl font-semibold mb-4 flex items-center'>
              <FileText className='w-5 h-5 mr-2 text-teal-400' /> Resume
            </h2>
            {editing ? (
              <input
                id='file'
                name='file'
                type='file'
                accept='
                      application/pdf,
                      application/msword,
                      application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                      application/vnd.oasis.opendocument.text,
                      application/rtf,
                      text/plain'
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
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h2 className='text-xl font-semibold mb-4 flex items-center'>
              <Code className='w-5 h-5 mr-2 text-green-400' /> Skills
            </h2>
            <div className='flex flex-wrap gap-2 items-center'>
              {Object.entries(form?.skills || {}).map(([skill, level]) => (
                <span
                  key={skill}
                  className='px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-sm flex items-center space-x-2'
                >
                  <span>
                    {skill} - {level}
                  </span>
                  {editing && (
                    <button
                      onClick={() => {
                        const newSkills = { ...form.skills };
                        delete newSkills[skill];
                        setForm({ ...form, skills: newSkills });
                      }}
                      className='ml-2 text-red-400 hover:text-red-600'
                    >
                      <X className='w-4 h-4' />
                    </button>
                  )}
                </span>
              ))}

              {editing && (
                <>
                  {/* Input field for new skill */}
                  <input
                    type='text'
                    placeholder='Skill: Level (e.g., React: Intermediate)'
                    value={form.newSkill || ""}
                    onChange={(e) =>
                      setForm({ ...form, newSkill: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && form.newSkill.trim()) {
                        const [skill, level] = form.newSkill
                          .split(":")
                          .map((s) => s.trim());
                        setForm({
                          ...form,
                          skills: {
                            ...form.skills,
                            [skill]: level || "Beginner",
                          },
                          newSkill: "",
                        });
                      }
                    }}
                    className='px-3 py-1 rounded-lg border border-gray-500 bg-transparent text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-400'
                  />

                  {/* Add button (optional, if userData prefers clicking instead of Enter) */}
                  <Button
                    variant='outline'
                    className='text-sm'
                    onClick={() => {
                      if (form.newSkill?.trim()) {
                        const [skill, level] = form.newSkill
                          .split(":")
                          .map((s) => s.trim());
                        setForm({
                          ...form,
                          skills: {
                            ...form.skills,
                            [skill]: level || "Beginner",
                          },
                          newSkill: "",
                        });
                      }
                    }}
                  >
                    <Plus className='w-4 h-4 mr-1' /> Add Skill
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h2 className='text-xl font-semibold mb-4 flex items-center'>
              <Award className='w-5 h-5 mr-2 text-purple-400' /> Social Links
            </h2>
            {editing ? (
              <div className='space-y-3'>
                <Input
                  name='githubUrl'
                  value={form?.githubUrl || ""}
                  onChange={handleChange}
                  placeholder='GitHub URL'
                  className='bg-white/10'
                />
                <Input
                  name='linkedinUrl'
                  value={form?.linkedinUrl || ""}
                  onChange={handleChange}
                  placeholder='LinkedIn URL'
                  className='bg-white/10'
                />
                <Input
                  name='portfolioUrl'
                  value={form?.portfolioUrl || ""}
                  onChange={handleChange}
                  placeholder='Portfolio Website'
                  className='bg-white/10'
                />
                <Input
                  name='stackoverflowUrl'
                  value={form?.stackoverflowUrl || ""}
                  onChange={handleChange}
                  placeholder='Stack Overflow URL'
                  className='bg-white/10'
                />
              </div>
            ) : (
              <div className='flex flex-wrap gap-4'>
                {userData?.githubUrl && (
                  <a
                    href={userData?.githubUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center space-x-2'
                  >
                    <Github className='w-5 h-5' /> <span>GitHub</span>
                  </a>
                )}
                {userData?.linkedinUrl && (
                  <a
                    href={userData?.linkedinUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center space-x-2'
                  >
                    <Linkedin className='w-5 h-5' /> <span>LinkedIn</span>
                  </a>
                )}
                {userData?.portfolioUrl && (
                  <a
                    href={userData?.portfolioUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center space-x-2'
                  >
                    <Globe className='w-5 h-5' /> <span>Portfolio</span>
                  </a>
                )}
                {userData?.stackoverflowUrl && (
                  <a
                    href={userData?.stackoverflowUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center space-x-2'
                  >
                    <StackOverflowIcon className='w-5 h-5' />{" "}
                    <span>Stack Overflow</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className='space-y-6'>
          {/* Quick Actions */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h3 className='text-lg font-semibold mb-4'>Quick Actions</h3>
            <div className='grid grid-cols-2 gap-4'>
              <Button variant='default'>
                <Save className='w-4 h-4 mr-1' /> Save
              </Button>
              <Button variant='outline'>
                <Settings className='w-4 h-4 mr-1' /> Settings
              </Button>
              <Button variant='outline'>
                <Trash className='w-4 h-4 mr-1' /> Delete
              </Button>
              <Button variant='outline'>
                <Plus className='w-4 h-4 mr-1' /> Add Info
              </Button>
            </div>
          </div>

          {/* Achievements */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h3 className='text-lg font-semibold mb-4'>Achievements</h3>
            <div className='flex flex-wrap gap-2'>
              {(userData?.badges || []).map((badge, i) => (
                <span
                  key={i}
                  className='px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm'
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Account Info */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h2 className='text-xl font-semibold mb-4'>Account Info</h2>
            <p>
              <strong>Role:</strong> {userData?.role || "N/A"}
            </p>
            <p>
              <strong>Email Verified:</strong>{" "}
              {userData?.isEmailVerified ? (
                <CheckCircle className='inline w-4 h-4 text-green-400' />
              ) : (
                <XCircle className='inline w-4 h-4 text-red-400' />
              )}
            </p>
            <p>
              <strong>Joined:</strong>{" "}
              {userData?.createdAt
                ? new Date(userData?.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              <strong>Last Updated:</strong>{" "}
              {userData?.updatedAt
                ? new Date(userData?.updatedAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>

          {/* Notification Preferences */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h2 className='text-xl font-semibold mb-4'>
              Notification Preferences
            </h2>
            <p>
              Email:{" "}
              {userData?.notificationPrefs?.email ? "Enabled" : "Disabled"}
            </p>
            <p>
              SMS: {userData?.notificationPrefs?.sms ? "Enabled" : "Disabled"}
            </p>
          </div>

          {/* Progress */}
          <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
            <h2 className='text-xl font-semibold mb-4 flex items-center'>
              <BarChart className='w-5 h-5 mr-2 text-orange-400' /> Progress
            </h2>
            <p>
              <strong>XP:</strong> {userData?.xp ?? 0}
            </p>
            <p>
              <strong>Level:</strong> {userData?.level ?? 0}
            </p>
            <p>
              <strong>Portfolio Score:</strong> {userData?.portfolioScore ?? 0}
            </p>
          </div>
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
