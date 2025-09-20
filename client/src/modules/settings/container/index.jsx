import SettingsPage from "../components/SettingPage";
import React, { useState } from "react";
import Navbar from "../../../components/header";
import { Footer } from "../../../components";
import { Badge, Button } from "../../../components";
import NotificationSettings from "../components/NotificationSettings";
import PrivacySettings from "../components/PrivacySettings";
import SubsBilling from "../components/SubsBilling";
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
import ProfileSettings from "../components/ProfileSettings";
import AccountSettings from "../components/AccountSettings";
import Integrations from "../components/Integrations";
import SkillsExperience from "../components/SkillsExperience";
import PortfolioResume from "../components/PortfolioResume";
import DangerZone from "../components/DangerZone";

const Settings = () => {
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
              <ProfileSettings
                formData={formData}
                handleInputChange={handleInputChange}
                handleSaveProfile={handleSaveProfile}
              />

              {/* Account Settings */}
              <AccountSettings
                formData={formData}
                handleInputChange={handleInputChange}
                handleSaveProfile={handleSaveProfile}
              />

              {/* Notification Preferences */}
              <NotificationSettings />


            </div>

            {/* Right Column */}
            <div className='space-y-6'>
              {/* Privacy Settings */}
              <PrivacySettings />

              {/* Subscription / Billing */}
              <SubsBilling />

              {/* Integrations */}
              <Integrations
                integrations={integrations}
                toggleIntegration={toggleIntegration}
              />

              {/* Portfolio & Resume */}
              <PortfolioResume user={user} />
              {/* Skills & Experience */}
              <SkillsExperience user={user} />
              {/* Danger Zone */}
              <DangerZone />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Settings;
