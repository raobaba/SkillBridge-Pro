import React, { useState } from "react";
import Navbar from "../../../components/header";
import { Footer } from "../../../components";
import NotificationSettings from "../components/NotificationSettings";
import PrivacySettings from "../components/PrivacySettings";
import SubsBilling from "../components/SubsBilling";
import { Settings as SettingsIcon } from "lucide-react";
import { useSelector } from "react-redux";
import ProfileSettings from "../components/ProfileSettings";
import AccountSettings from "../components/AccountSettings";
import Integrations from "../components/Integrations";
import SkillsExperience from "../components/SkillsExperience";
import PortfolioResume from "../components/PortfolioResume";
import DangerZone from "../components/DangerZone";

const Settings = () => {
  const user = useSelector((state) => state.user?.user) || {};
  const role = (user.role || '').toLowerCase() || 'developer';

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

  // Dynamic role-based section visibility
  // Base sections available to all roles
  const baseSections = ['profile', 'account', 'notifications', 'privacy', 'integrations', 'danger'];
  
  // Additional sections based on role
  const roleBasedSections = {
    developer: ['billing', 'portfolio', 'skills'],
    'project-owner': ['billing', 'portfolio'],
    admin: [],
  };
  
  // Check if user has a specific role
  const hasRole = (checkRole) => {
    if (Array.isArray(user.roles)) {
      return user.roles.includes(checkRole);
    }
    return role === checkRole.toLowerCase();
  };
  
  // Build visible sections dynamically based on user roles
  const getVisibleSections = () => {
    let visible = [...baseSections];
    
    // Add developer-specific sections
    if (hasRole('developer')) {
      visible.push(...roleBasedSections.developer);
    }
    
    // Add project-owner specific sections
    if (hasRole('project-owner')) {
      visible.push(...roleBasedSections['project-owner']);
    }
    
    // Admins only get base sections (no billing/portfolio/skills)
    if (hasRole('admin')) {
      // Admin already has access to base sections
    }
    
    return visible;
  };
  
  const visibleSections = getVisibleSections();
  
  const visible = (key) => visibleSections.includes(key);

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
        <div className='w-full px-6 py-8'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl'>
              <SettingsIcon className='w-6 h-6 text-white' />
            </div>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
              Settings
            </h1>
          </div>
          <p className='text-gray-300 text-sm mb-6'>Manage your profile, privacy, notifications, billing and integrations.</p>

          {/* Quick Navigation */}
          <div className='mb-6 overflow-x-auto'>
            <div className='flex gap-2 min-w-full'>
              {[
                { key: 'profile', href: '#profile', label: 'Profile' },
                { key: 'account', href: '#account', label: 'Account' },
                { key: 'notifications', href: '#notifications', label: 'Notifications' },
                { key: 'privacy', href: '#privacy', label: 'Privacy' },
                { key: 'billing', href: '#billing', label: 'Billing' },
                { key: 'integrations', href: '#integrations', label: 'Integrations' },
                { key: 'portfolio', href: '#portfolio', label: 'Portfolio' },
                { key: 'skills', href: '#skills', label: 'Skills' },
                { key: 'danger', href: '#danger', label: 'Danger Zone' },
              ]
                .filter((item) => visible(item.key))
                .map((item) => (
                  <a key={item.href} href={item.href} className='px-3 py-1 rounded-full text-xs bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 transition-colors duration-200'>
                    {item.label}
                  </a>
                ))}
            </div>
          </div>

          {/* Two-column layout */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Left Column */}
            <div className='space-y-6'>
              {/* Profile Settings */}
              <section id='profile'>
                <ProfileSettings
                formData={formData}
                handleInputChange={handleInputChange}
                handleSaveProfile={handleSaveProfile}
                />
              </section>

              {/* Account Settings */}
              {visible('account') && (
                <section id='account'>
                  <AccountSettings
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSaveProfile={handleSaveProfile}
                  />
                </section>
              )}

              {/* Notification Preferences */}
              {visible('notifications') && (
                <section id='notifications'>
                  <NotificationSettings />
                </section>
              )}


            </div>

            {/* Right Column */}
            <div className='space-y-6'>
              {/* Privacy Settings */}
              {visible('privacy') && (
                <section id='privacy'>
                  <PrivacySettings />
                </section>
              )}

              {/* Subscription / Billing */}
              {visible('billing') && (
                <section id='billing'>
                  <SubsBilling />
                </section>
              )}

              {/* Integrations */}
              {visible('integrations') && (
                <section id='integrations'>
                  <Integrations
                  integrations={integrations}
                  toggleIntegration={toggleIntegration}
                  />
                </section>
              )}

              {/* Portfolio & Resume */}
              {visible('portfolio') && (
                <section id='portfolio'>
                  <PortfolioResume user={user} />
                </section>
              )}
              {/* Skills & Experience */}
              {visible('skills') && (
                <section id='skills'>
                  <SkillsExperience user={user} />
                </section>
              )}
              {/* Danger Zone */}
              {visible('danger') && (
                <section id='danger'>
                  <DangerZone />
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Settings;
