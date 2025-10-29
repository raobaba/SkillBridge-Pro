import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { User, Save, Loader2 } from "lucide-react";
import { Button } from "../../../components";
import {
  getUserProfile,
  updateUserProfile,
  updateUserProfileField,
  resetProfileSuccess,
} from "../slice/settingsSlice";

export default function ProfileSettings({
  formData,
  handleInputChange,
  handleSaveProfile,
}) {
  const dispatch = useDispatch();
  
  // Redux state
  const {
    userProfile,
    profileLoading,
    profileError,
    profileSuccess,
  } = useSelector((state) => state.settings);

  // Local state for immediate UI updates
  const [localFormData, setLocalFormData] = useState({
    name: formData.name || "",
    email: formData.email || "",
  });

  // Load profile on component mount
  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  // Update local state when Redux state changes
  useEffect(() => {
    if (userProfile && Object.keys(userProfile).length > 0) {
      setLocalFormData({
        name: userProfile.name || "",
        email: userProfile.email || "",
      });
    }
  }, [userProfile]);

  // Show success message
  useEffect(() => {
    if (profileSuccess) {
      toast.success("Profile updated successfully!");
      dispatch(resetProfileSuccess());
    }
  }, [profileSuccess, dispatch]);

  const handleInputChangeLocal = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({ ...prev, [name]: value }));
    dispatch(updateUserProfileField({ key: name, value }));
    
    // Also call parent handler for backward compatibility
    if (handleInputChange) {
      handleInputChange(e);
    }
  };

  const handleSaveProfileLocal = async () => {
    try {
      await dispatch(updateUserProfile(localFormData)).unwrap();
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save profile. Please try again.');
    }
  };

  return (
    <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
      <h2 className='text-xl font-semibold flex items-center gap-2'>
        <User className='w-5 h-5 text-cyan-400' /> Profile Settings
      </h2>
      
      {/* Error Display */}
      {profileError && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-300 text-sm">{profileError}</p>
        </div>
      )}
      
      <div className='space-y-3'>
        <input
          type='text'
          name='name'
          value={localFormData.name}
          onChange={handleInputChangeLocal}
          placeholder='Name'
          disabled={profileLoading}
          className='w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none disabled:opacity-50'
        />
        <input
          type='email'
          name='email'
          value={localFormData.email}
          onChange={handleInputChangeLocal}
          placeholder='Email'
          disabled={profileLoading}
          className='w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none disabled:opacity-50'
        />
      </div>
      
      <Button 
        onClick={handleSaveProfileLocal}
        disabled={profileLoading}
        className="flex items-center gap-2 disabled:opacity-50"
      >
        {profileLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {profileLoading ? 'Saving...' : 'Save Profile'}
      </Button>
    </section>
  );
}
