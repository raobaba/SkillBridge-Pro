import React, { useState } from "react";
import Navbar from "../../../components/header";
import { Footer } from "../../../components";
import { Badge, Button } from "../../../components";
import NotificationSettings from "./NotificationSettings";
import PrivacySettings from "./PrivacySettings";
import SubsBilling from "./SubsBilling";
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
import ProfileSettings from "./ProfileSettings";
import AccountSettings from "./AccountSettings";
import Integrations from "./Integrations";
import SkillsExperience from "./SkillsExperience";
import PortfolioResume from "./PortfolioResume";
import DangerZone from "./DangerZone";

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
        <div className='w-full px-6 py-8'>
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

              {/* Skills & Experience */}
              <SkillsExperience user={user} />
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

              {/* Danger Zone */}
              <DangerZone />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
