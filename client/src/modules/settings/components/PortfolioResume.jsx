import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Briefcase, FileText, Save, Loader2, Upload, ExternalLink } from "lucide-react";
import { Button } from "../../../components";
import {
  getUserProfile,
  updateUserProfile,
  updateUserProfileField,
  resetProfileSuccess,
} from "../slice/settingsSlice";

export default function PortfolioResume({ user }) {
  const dispatch = useDispatch();
  
  // Redux state
  const {
    userProfile,
    profileLoading,
    profileError,
    profileSuccess,
  } = useSelector((state) => state.settings);

  // Local state for immediate UI updates
  const [localData, setLocalData] = useState({
    portfolioUrl: "",
    portfolioScore: 0,
    resumeUrl: "",
  });

  // Load profile on component mount
  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  // Update local state when Redux state changes
  useEffect(() => {
    if (userProfile && Object.keys(userProfile).length > 0) {
      // Handle resumeUrl - it might be an object with url property or a string
      let resumeUrlValue = "";
      if (userProfile.resumeUrl) {
        if (typeof userProfile.resumeUrl === 'object' && userProfile.resumeUrl.url) {
          resumeUrlValue = userProfile.resumeUrl.url;
        } else if (typeof userProfile.resumeUrl === 'string') {
          resumeUrlValue = userProfile.resumeUrl;
        }
      }

      setLocalData({
        portfolioUrl: userProfile.portfolioUrl || "",
        portfolioScore: userProfile.portfolioScore || 0,
        resumeUrl: resumeUrlValue,
      });
    } else if (user) {
      // Fallback to props if Redux state is empty
      // Handle resumeUrl - it might be an object with url property or a string
      let resumeUrlValue = "";
      if (user.resumeUrl) {
        if (typeof user.resumeUrl === 'object' && user.resumeUrl.url) {
          resumeUrlValue = user.resumeUrl.url;
        } else if (typeof user.resumeUrl === 'string') {
          resumeUrlValue = user.resumeUrl;
        }
      }

      setLocalData({
        portfolioUrl: user.portfolioUrl || "",
        portfolioScore: user.portfolioScore || 0,
        resumeUrl: resumeUrlValue,
      });
    }
  }, [userProfile, user]);

  // Show success message
  useEffect(() => {
    if (profileSuccess) {
      toast.success("Profile updated successfully!");
      dispatch(resetProfileSuccess());
    }
  }, [profileSuccess, dispatch]);

  const handleInputChange = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
    dispatch(updateUserProfileField({ key: field, value }));
  };

  const handleSave = async () => {
    try {
      await dispatch(updateUserProfile(localData)).unwrap();
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save profile. Please try again.');
    }
  };

  return (
    <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
      <h2 className='text-xl font-semibold flex items-center gap-2'>
        <Briefcase className='w-5 h-5 text-orange-400' /> Portfolio & Resume
      </h2>
      
      {/* Error Display */}
      {profileError && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-300 text-sm">{profileError}</p>
        </div>
      )}
      
      {/* Portfolio Section */}
      <div className='space-y-3'>
        <h3 className='text-lg font-medium text-white'>Portfolio</h3>
        <div className='space-y-2'>
          <label className='text-white text-sm font-medium'>Portfolio URL</label>
          <input
            type='url'
            value={localData.portfolioUrl}
            onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
            placeholder='https://your-portfolio.com'
            className='w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-1 focus:ring-orange-400 focus:outline-none'
          />
          {localData.portfolioUrl && (
            <a
              href={localData.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm"
            >
              <ExternalLink className="w-3 h-3" />
              Visit Portfolio
            </a>
          )}
        </div>
        
        <div className='space-y-2'>
          <label className='text-white text-sm font-medium'>Portfolio Score</label>
          <input
            type='number'
            value={localData.portfolioScore}
            onChange={(e) => handleInputChange('portfolioScore', parseInt(e.target.value) || 0)}
            placeholder='0'
            min="0"
            max="100"
            className='w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-1 focus:ring-orange-400 focus:outline-none'
          />
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${localData.portfolioScore}%` }}
            ></div>
          </div>
          <p className="text-gray-400 text-xs">Portfolio Score: {localData.portfolioScore}/100</p>
        </div>
      </div>
      
      {/* Resume Section */}
      <div className='space-y-3'>
        <h3 className='text-lg font-medium text-white'>Resume</h3>
        <div className='space-y-2'>
          <label className='text-white text-sm font-medium'>Resume URL</label>
          <input
            type='url'
            value={localData.resumeUrl}
            onChange={(e) => handleInputChange('resumeUrl', e.target.value)}
            placeholder='https://your-resume.com'
            className='w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-1 focus:ring-orange-400 focus:outline-none'
          />
          {localData.resumeUrl && (
            <a
              href={localData.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-orange-400 hover:text-orange-300 text-sm"
            >
              <ExternalLink className="w-3 h-3" />
              View Resume
            </a>
          )}
        </div>
        
        {/* File Upload Placeholder */}
        <div className='border-2 border-dashed border-orange-500/30 rounded-xl p-6 text-center'>
          <FileText className='w-8 h-8 text-orange-400 mx-auto mb-2' />
          <p className='text-gray-300 text-sm mb-2'>Upload Resume File</p>
          <Button variant="outline" size="sm" className="flex items-center gap-2 mx-auto">
            <Upload className="w-4 h-4" />
            Choose File
          </Button>
          <p className='text-gray-500 text-xs mt-2'>PDF, DOC, DOCX up to 10MB</p>
        </div>
      </div>
      
      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSave}
          disabled={profileLoading}
          className="flex items-center gap-2 disabled:opacity-50"
        >
          {profileLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {profileLoading ? 'Saving...' : 'Save Portfolio & Resume'}
        </Button>
      </div>
    </section>
  );
}
