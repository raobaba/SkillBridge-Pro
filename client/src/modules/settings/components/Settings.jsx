import React, { useState } from "react";
import Navbar from "../../../components/header/dashboard";
import { Footer } from "../../../components/ui/Footer";
import { Button } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import {
  User,
  Lock,
  Bell,
  Shield,
  CreditCard,
  Github,
  Calendar,
} from "lucide-react";
import { useSelector } from "react-redux";

export default function SettingsPage() {
  const user = useSelector((state) => state.user?.user) || {};

  // Initialize state with user data or default/static values
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifPrefs, setNotifPrefs] = useState(
    user.notificationPrefs || { email: true, sms: false }
  );

  const [privacyPrefs, setPrivacyPrefs] = useState(
    user.privacy || { profilePublic: true, dataSharing: false }
  );

  const [integrations, setIntegrations] = useState({
    github: !!user.githubUrl,
    linkedin: !!user.linkedinUrl,
    googleCalendar: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleNotif = (type) =>
    setNotifPrefs((prev) => ({ ...prev, [type]: !prev[type] }));
  const togglePrivacy = (type) =>
    setPrivacyPrefs((prev) => ({ ...prev, [type]: !prev[type] }));
  const toggleIntegration = (type) =>
    setIntegrations((prev) => ({ ...prev, [type]: !prev[type] }));

  const handleSaveProfile = () => console.log("Profile saved", formData);
  const handleSaveNotifications = () =>
    console.log("Notifications saved", notifPrefs);
  const handleSavePrivacy = () => console.log("Privacy saved", privacyPrefs);

  return (
    <>
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
        <Navbar data={user} isSearchBar={false} />
        <div className='max-w-6xl mx-auto px-4 py-8'>
          <h1 className='text-4xl font-bold text-white drop-shadow-lg mb-6'>
            SettingsPage
          </h1>

          {/* Two-column layout */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Left Column */}
            <div className='space-y-6'>
              {/* Profile Settings */}
              <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <User className='w-5 h-5 text-cyan-400' /> Profile Settings
                </h2>
                <div className='space-y-3'>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder='Name'
                    className='w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none'
                  />
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder='Email'
                    className='w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none'
                  />
                </div>
                <Button onClick={handleSaveProfile}>Save Profile</Button>
              </section>

              {/* Account Settings */}
              <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <Lock className='w-5 h-5 text-pink-400' /> Account Settings
                </h2>
                <div className='space-y-3'>
                  {["password", "newPassword", "confirmPassword"].map(
                    (field) => (
                      <input
                        key={field}
                        type='password'
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        placeholder={
                          field === "password"
                            ? "Current Password"
                            : field === "newPassword"
                              ? "New Password"
                              : "Confirm Password"
                        }
                        className='w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-1 focus:ring-pink-400 focus:outline-none'
                      />
                    )
                  )}
                </div>
                <Button onClick={handleSaveProfile}>Change Password</Button>
              </section>

              {/* Notification Preferences */}
              <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <Bell className='w-5 h-5 text-yellow-400' /> Notification
                  Preferences
                </h2>
                <div className='flex flex-col space-y-2'>
                  {Object.keys(notifPrefs).map((type) => (
                    <div
                      key={type}
                      className='flex items-center justify-between'
                    >
                      <span className='capitalize'>{type}</span>
                      <Badge
                        variant={notifPrefs[type] ? "success" : "error"}
                        onClick={() => toggleNotif(type)}
                        className='cursor-pointer'
                      >
                        {notifPrefs[type] ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button onClick={handleSaveNotifications}>
                  Save Notifications
                </Button>
              </section>
            </div>

            {/* Right Column */}
            <div className='space-y-6'>
              {/* Privacy Settings */}
              <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <Shield className='w-5 h-5 text-red-400' /> Privacy Settings
                </h2>
                <div className='flex flex-col space-y-2'>
                  {Object.keys(privacyPrefs).map((type) => (
                    <div
                      key={type}
                      className='flex items-center justify-between'
                    >
                      <span>{type.replace(/([A-Z])/g, " $1")}</span>
                      <Badge
                        variant={privacyPrefs[type] ? "success" : "error"}
                        onClick={() => togglePrivacy(type)}
                        className='cursor-pointer'
                      >
                        {privacyPrefs[type] ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button onClick={handleSavePrivacy}>Save Privacy</Button>
              </section>

              {/* Subscription / Billing */}
              <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <CreditCard className='w-5 h-5 text-green-400' /> Subscription
                  / Billing
                </h2>
                <div className='flex items-center justify-between'>
                  <span>Current Plan</span>
                  <Badge variant='info'>{user.subscription || "Free"}</Badge>
                </div>
                <Button>Manage Subscription</Button>
              </section>

              {/* Integrations */}
              <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <Github className='w-5 h-5 text-gray-200' /> Integrations
                </h2>
                <div className='flex flex-col space-y-2'>
                  {Object.keys(integrations).map((type) => (
                    <div
                      key={type}
                      className='flex items-center justify-between'
                    >
                      <span className='capitalize'>{type}</span>
                      <Badge
                        variant={integrations[type] ? "success" : "error"}
                        onClick={() => toggleIntegration(type)}
                        className='cursor-pointer'
                      >
                        {integrations[type] ? "Connected" : "Disconnected"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </section>

              {/* Skills & Experience */}
              <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <User className='w-5 h-5 text-blue-400' /> Skills & Experience
                </h2>
                <div className='flex flex-col space-y-2'>
                  {user.skills &&
                    Object.entries(user.skills).map(([skill, level]) => (
                      <div
                        key={skill}
                        className='flex items-center justify-between'
                      >
                        <span className='capitalize'>{skill}</span>
                        <Badge variant='info'>{level}</Badge>
                      </div>
                    ))}
                  <div className='flex items-center justify-between mt-2'>
                    <span>Experience</span>
                    <span>{user.experience || "0 Years"}</span>
                  </div>
                  <div className='flex items-center justify-between mt-2'>
                    <span>Location</span>
                    <span>{user.location || "Not Set"}</span>
                  </div>
                  <div className='flex items-center justify-between mt-2'>
                    <span>Availability</span>
                    <span>{user.availability || "Full-Time"}</span>
                  </div>
                </div>
              </section>

              {/* Portfolio & Resume */}
              <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <Calendar className='w-5 h-5 text-purple-400' /> Portfolio &
                  Resume
                </h2>
                <div className='flex flex-col space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span>Resume</span>
                    {user.resumeUrl?.url ? (
                      <a
                        href={user.resumeUrl.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-cyan-400 underline'
                      >
                        View PDF
                      </a>
                    ) : (
                      <span className='text-gray-400'>Not Uploaded</span>
                    )}
                  </div>
                  <div className='flex items-center justify-between'>
                    <span>Portfolio</span>
                    {user.portfolioUrl ? (
                      <a
                        href={user.portfolioUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-cyan-400 underline'
                      >
                        View Portfolio
                      </a>
                    ) : (
                      <span className='text-gray-400'>Not Added</span>
                    )}
                  </div>
                  <div className='flex items-center justify-between'>
                    <span>Portfolio Score</span>
                    <span>{user.portfolioScore || 0}</span>
                  </div>
                </div>
              </section>

              {/* Danger Zone */}
              <section className='bg-red-600/20 backdrop-blur-sm p-6 rounded-2xl border border-red-500/30 space-y-2 text-white'>
                <h2 className='text-xl font-semibold'>Danger Zone</h2>
                <p className='text-gray-200 text-sm'>
                  Delete your account permanently. This action cannot be undone.
                </p>
                <Button variant='destructive'>Delete Account</Button>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
