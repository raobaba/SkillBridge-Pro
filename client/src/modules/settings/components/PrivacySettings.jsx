import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Button } from "../../../components";
import { Shield, Save, Loader2 } from "lucide-react";
import {
  getPrivacySettings,
  updatePrivacySettings,
  updatePrivacyPreference,
  resetPrivacySuccess,
} from "../slice/settingsSlice";

export default function PrivacySettings() {
  const dispatch = useDispatch();
  
  // Redux state
  const {
    privacySettings,
    privacyLoading,
    privacyError,
    privacySuccess,
  } = useSelector((state) => state.settings);

  // Local state for immediate UI updates
  const [localPrivacyPrefs, setLocalPrivacyPrefs] = useState(privacySettings);

  // Load settings on component mount
  useEffect(() => {
    dispatch(getPrivacySettings());
  }, [dispatch]);

  // Update local state when Redux state changes
  useEffect(() => {
    setLocalPrivacyPrefs(privacySettings);
  }, [privacySettings]);

  // Show success message
  useEffect(() => {
    if (privacySuccess) {
      alert("Privacy settings saved successfully!");
      dispatch(resetPrivacySuccess());
    }
  }, [privacySuccess, dispatch]);

  const togglePrivacy = (type) => {
    const newValue = !localPrivacyPrefs[type];
    setLocalPrivacyPrefs((prev) => ({ ...prev, [type]: newValue }));
    dispatch(updatePrivacyPreference({ key: type, value: newValue }));
  };

  const handleSavePrivacy = async () => {
    try {
      await dispatch(updatePrivacySettings(localPrivacyPrefs)).unwrap();
    } catch (error) {
      console.error('Failed to save privacy settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  return (
    <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
      <h2 className='text-xl font-semibold flex items-center gap-2'>
        <Shield className='w-5 h-5 text-red-400' /> Privacy Settings
      </h2>
      
      {/* Error Display */}
      {privacyError && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-300 text-sm">{privacyError}</p>
        </div>
      )}
      
      <div className='flex flex-col space-y-2'>
        {Object.keys(localPrivacyPrefs).map((type) => (
          <div key={type} className='flex items-center justify-between'>
            <span className="text-gray-300 capitalize">
              {type.replace(/([A-Z])/g, " $1").trim()}
            </span>
            <Badge
              variant={localPrivacyPrefs[type] ? "success" : "error"}
              onClick={() => togglePrivacy(type)}
              className='cursor-pointer hover:opacity-80 transition-opacity'
            >
              {localPrivacyPrefs[type] ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        ))}
      </div>
      
      <Button 
        onClick={handleSavePrivacy}
        disabled={privacyLoading}
        className="flex items-center gap-2 disabled:opacity-50"
      >
        {privacyLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {privacyLoading ? 'Saving...' : 'Save Privacy'}
      </Button>
    </section>
  );
}
