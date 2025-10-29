import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Badge, Button, Input } from "../../../components";
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Clock, 
  Settings, 
  CheckCircle, 
  XCircle,
  Zap,
  Code,
  FileText,
  User,
  Shield,
  Volume2,
  VolumeX,
  Save,
  RotateCcw,
  Loader2
} from "lucide-react";
import {
  getNotificationSettings,
  updateNotificationSettings,
  getNotificationFrequency,
  updateNotificationFrequency,
  getQuietHours,
  updateQuietHours,
  updateNotificationPreference,
  updateNotificationFrequencyLocal,
  updateQuietHoursLocal,
  resetNotificationSuccess,
} from "../slice/settingsSlice";

export default function NotificationSettings() {
  const dispatch = useDispatch();
  
  // Redux state
  const {
    notificationSettings,
    notificationFrequency,
    quietHours,
    notificationLoading,
    notificationError,
    notificationSuccess,
  } = useSelector((state) => state.settings);

  // Local state for immediate UI updates
  const [localNotifPrefs, setLocalNotifPrefs] = useState(notificationSettings);
  const [localFrequency, setLocalFrequency] = useState(notificationFrequency);
  const [localQuietHours, setLocalQuietHours] = useState(quietHours);
  const [isBulkSave, setIsBulkSave] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    dispatch(getNotificationSettings());
    dispatch(getNotificationFrequency());
    dispatch(getQuietHours());
  }, [dispatch]);

  // Update local state when Redux state changes
  useEffect(() => {
    setLocalNotifPrefs(notificationSettings);
  }, [notificationSettings]);

  useEffect(() => {
    setLocalFrequency(notificationFrequency);
  }, [notificationFrequency]);

  useEffect(() => {
    setLocalQuietHours(quietHours);
  }, [quietHours]);

  // Show success message only for bulk saves, not individual toggles
  useEffect(() => {
    if (notificationSuccess && isBulkSave) {
      toast.success("Notification settings saved successfully!");
      dispatch(resetNotificationSuccess());
      setIsBulkSave(false); // Reset the flag
    } else if (notificationSuccess && !isBulkSave) {
      // Just reset the success state without showing toast for individual toggles
      dispatch(resetNotificationSuccess());
    }
  }, [notificationSuccess, dispatch, isBulkSave]);

  const toggleNotif = async (type) => {
    const newValue = !localNotifPrefs[type];
    const oldValue = localNotifPrefs[type];
    
    // Optimistically update UI
    setLocalNotifPrefs((prev) => ({ ...prev, [type]: newValue }));
    dispatch(updateNotificationPreference({ key: type, value: newValue }));
    
    // Show immediate toast
    const action = newValue ? 'enabled' : 'disabled';
    const notificationType = notificationTypes.find(n => n.key === type)?.label || type;
    toast.success(`${notificationType} ${action} successfully!`);
    
    try {
      // Make immediate API call for this specific notification
      await dispatch(updateNotificationSettings({ [type]: newValue })).unwrap();
    } catch (error) {
      // Revert on error
      setLocalNotifPrefs((prev) => ({ ...prev, [type]: oldValue }));
      dispatch(updateNotificationPreference({ key: type, value: oldValue }));
      toast.error(`Failed to ${action} ${notificationType}. Please try again.`);
      console.error('Failed to update notification setting:', error);
    }
  };

  const updateFrequency = async (type, value) => {
    const oldValue = localFrequency[type];
    
    // Optimistically update UI
    setLocalFrequency((prev) => ({ ...prev, [type]: value }));
    dispatch(updateNotificationFrequencyLocal({ key: type, value }));
    
    // Show immediate toast
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} frequency updated to ${value}!`);
    
    try {
      // Make immediate API call
      await dispatch(updateNotificationFrequency({ [type]: value })).unwrap();
    } catch (error) {
      // Revert on error
      setLocalFrequency((prev) => ({ ...prev, [type]: oldValue }));
      dispatch(updateNotificationFrequencyLocal({ key: type, value: oldValue }));
      toast.error(`Failed to update ${type} frequency. Please try again.`);
      console.error('Failed to update notification frequency:', error);
    }
  };

  const updateQuietHoursSetting = async (key, value) => {
    const oldValue = localQuietHours[key];
    
    // Optimistically update UI
    setLocalQuietHours((prev) => ({ ...prev, [key]: value }));
    dispatch(updateQuietHoursLocal({ key, value }));
    
    // Show immediate toast
    const settingName = key === 'enabled' ? 'Quiet hours' : `${key} time`;
    const action = key === 'enabled' ? (value ? 'enabled' : 'disabled') : `set to ${value}`;
    toast.success(`${settingName} ${action} successfully!`);
    
    try {
      // Make immediate API call
      await dispatch(updateQuietHours({ [key]: value })).unwrap();
    } catch (error) {
      // Revert on error
      setLocalQuietHours((prev) => ({ ...prev, [key]: oldValue }));
      dispatch(updateQuietHoursLocal({ key, value: oldValue }));
      toast.error(`Failed to update ${settingName}. Please try again.`);
      console.error('Failed to update quiet hours:', error);
    }
  };

  const toggleQuietHours = () => {
    const newValue = !localQuietHours.enabled;
    updateQuietHoursSetting('enabled', newValue);
  };

  const handleSaveNotifications = async () => {
    setIsBulkSave(true); // Set flag to indicate this is a bulk save
    try {
      await Promise.all([
        dispatch(updateNotificationSettings(localNotifPrefs)).unwrap(),
        dispatch(updateNotificationFrequency(localFrequency)).unwrap(),
        dispatch(updateQuietHours(localQuietHours)).unwrap(),
      ]);
      // Toast will be shown by the useEffect when notificationSuccess becomes true
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      toast.error('Failed to save settings. Please try again.');
      setIsBulkSave(false); // Reset flag on error
    }
  };

  const handleResetToDefault = () => {
    const defaultNotifPrefs = {
      email: true,
      sms: false,
      push: true,
      reminders: true,
      projectUpdates: true,
      xpNotifications: true,
      aiSuggestions: true,
      profileReminders: false,
      securityAlerts: true,
      soundEnabled: true,
    };
    
    const defaultFrequency = {
      email: "daily",
      push: "immediate",
      reminders: "weekly"
    };
    
    const defaultQuietHours = {
      enabled: false,
      start: "22:00",
      end: "08:00"
    };

    setLocalNotifPrefs(defaultNotifPrefs);
    setLocalFrequency(defaultFrequency);
    setLocalQuietHours(defaultQuietHours);
    
    // Update Redux state
    Object.entries(defaultNotifPrefs).forEach(([key, value]) => {
      dispatch(updateNotificationPreference({ key, value }));
    });
    
    Object.entries(defaultFrequency).forEach(([key, value]) => {
      dispatch(updateNotificationFrequencyLocal({ key, value }));
    });
    
    Object.entries(defaultQuietHours).forEach(([key, value]) => {
      dispatch(updateQuietHoursLocal({ key, value }));
    });
    
    toast.success("Notification settings reset to default values!");
  };

  const notificationTypes = [
    {
      key: "email",
      label: "Email Notifications",
      description: "Receive updates via email",
      icon: Mail,
      color: "text-blue-400"
    },
    {
      key: "sms",
      label: "SMS Notifications",
      description: "Get text message alerts",
      icon: Smartphone,
      color: "text-green-400"
    },
    {
      key: "push",
      label: "Push Notifications",
      description: "Browser and mobile push alerts",
      icon: Bell,
      color: "text-purple-400"
    },
    {
      key: "reminders",
      label: "Reminder Notifications",
      description: "Task and deadline reminders",
      icon: Clock,
      color: "text-yellow-400"
    },
    {
      key: "projectUpdates",
      label: "Project Updates",
      description: "New project assignments and updates",
      icon: FileText,
      color: "text-indigo-400"
    },
    {
      key: "xpNotifications",
      label: "XP & Gamification",
      description: "Achievement and progress notifications",
      icon: Zap,
      color: "text-orange-400"
    },
    {
      key: "aiSuggestions",
      label: "AI Suggestions",
      description: "AI-powered recommendations and insights",
      icon: Code,
      color: "text-cyan-400"
    },
    {
      key: "profileReminders",
      label: "Profile Reminders",
      description: "Profile completion and update prompts",
      icon: User,
      color: "text-pink-400"
    },
    {
      key: "securityAlerts",
      label: "Security Alerts",
      description: "Account security and login notifications",
      icon: Shield,
      color: "text-red-400"
    },
    {
      key: "soundEnabled",
      label: "Sound Notifications",
      description: "Play sounds for notifications",
      icon: Volume2,
      color: "text-emerald-400"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Notification Settings
          </h2>
        </div>
        <p className="text-gray-300 text-sm">
          Customize how and when you receive notifications from SkillBridge Pro
        </p>
      </div>

      {/* Notification Preferences */}
      <div className="bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-yellow-400" />
          Notification Preferences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notificationTypes.map(({ key, label, description, icon: Icon, color }) => (
            <div
              key={key}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r from-slate-700 to-slate-600 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{label}</h4>
                    <p className="text-xs text-gray-400">{description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleNotif(key)}
                  disabled={notificationLoading}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 ${
                    localNotifPrefs[key] 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                      : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                      localNotifPrefs[key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {/* Status Badge */}
              <div className="flex justify-end">
                <Badge
                  variant={localNotifPrefs[key] ? "success" : "error"}
                  className="text-xs"
                >
                  {localNotifPrefs[key] ? (
                    <><CheckCircle className="w-3 h-3 mr-1" /> Enabled</>
                  ) : (
                    <><XCircle className="w-3 h-3 mr-1" /> Disabled</>
                  )}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frequency Settings */}
      <div className="bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-400" />
          Notification Frequency
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="select"
            label="Email Frequency"
            value={localFrequency.email}
            onChange={(e) => updateFrequency('email', e.target.value)}
            disabled={notificationLoading}
            options={[
              { value: "immediate", label: "Immediate" },
              { value: "daily", label: "Daily Digest" },
              { value: "weekly", label: "Weekly Summary" }
            ]}
          />
          
          <Input
            type="select"
            label="Push Notifications"
            value={localFrequency.push}
            onChange={(e) => updateFrequency('push', e.target.value)}
            disabled={notificationLoading}
            options={[
              { value: "immediate", label: "Immediate" },
              { value: "batched", label: "Batched (Every 15 min)" },
              { value: "hourly", label: "Hourly" }
            ]}
          />
          
          <Input
            type="select"
            label="Reminders"
            value={localFrequency.reminders}
            onChange={(e) => updateFrequency('reminders', e.target.value)}
            disabled={notificationLoading}
            options={[
              { value: "daily", label: "Daily" },
              { value: "weekly", label: "Weekly" },
              { value: "monthly", label: "Monthly" }
            ]}
          />
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          {localQuietHours.enabled ? (
            <VolumeX className="w-5 h-5 text-red-400" />
          ) : (
            <Volume2 className="w-5 h-5 text-green-400" />
          )}
          Quiet Hours
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">Enable Quiet Hours</h4>
              <p className="text-sm text-gray-400">Pause notifications during specified hours</p>
            </div>
            <button
              onClick={toggleQuietHours}
              disabled={notificationLoading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 ${
                localQuietHours.enabled 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                  : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  localQuietHours.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {localQuietHours.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Start Time</label>
                <input
                  type="time"
                  value={localQuietHours.start}
                  onChange={(e) => updateQuietHoursSetting('start', e.target.value)}
                  disabled={notificationLoading}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">End Time</label>
                <input
                  type="time"
                  value={localQuietHours.end}
                  onChange={(e) => updateQuietHoursSetting('end', e.target.value)}
                  disabled={notificationLoading}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {notificationError && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-300 text-sm">{notificationError}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <Button
          variant="outline"
          onClick={handleResetToDefault}
          disabled={notificationLoading}
          className="flex items-center gap-2 hover:scale-105 transition-transform duration-300 disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Default
        </Button>
        <Button
          onClick={handleSaveNotifications}
          disabled={notificationLoading}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 flex items-center gap-2 hover:scale-105 transition-all duration-300 disabled:opacity-50"
        >
          {notificationLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {notificationLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
