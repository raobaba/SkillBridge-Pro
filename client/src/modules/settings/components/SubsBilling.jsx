import React, { useState } from "react";
import { Badge, Button } from "../../../components";
import { CreditCard } from "lucide-react";
import { useSelector } from "react-redux";
const SubsBilling = () => {
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
    <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
      <h2 className='text-xl font-semibold flex items-center gap-2'>
        <CreditCard className='w-5 h-5 text-green-400' /> Subscription / Billing
      </h2>
      <div className='flex items-center justify-between'>
        <span>Current Plan</span>
        <Badge variant='info'>{user.subscription || "Free"}</Badge>
      </div>
      <Button>Manage Subscription</Button>
    </section>
  );
};

export default SubsBilling;
