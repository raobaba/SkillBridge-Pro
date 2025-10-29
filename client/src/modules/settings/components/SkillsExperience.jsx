import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Code, MapPin, Clock, Save, Loader2, Plus, X } from "lucide-react";
import { Button, Badge, Input } from "../../../components";
import {
  getUserProfile,
  updateUserProfile,
  updateUserProfileField,
  resetProfileSuccess,
} from "../slice/settingsSlice";

export default function SkillsExperience({ user }) {
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
    skills: {},
    experience: "",
    location: "",
    availability: "",
  });

  const [newSkill, setNewSkill] = useState({ name: "", level: "Beginner" });
  const [isEditing, setIsEditing] = useState(false);

  // Load profile on component mount
  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  // Update local state when Redux state changes
  useEffect(() => {
    if (userProfile && Object.keys(userProfile).length > 0) {
      setLocalData({
        skills: userProfile.skills || {},
        experience: userProfile.experience || "",
        location: userProfile.location || "",
        availability: userProfile.availability || "",
      });
    } else if (user) {
      // Fallback to props if Redux state is empty
      setLocalData({
        skills: user.skills || {},
        experience: user.experience || "",
        location: user.location || "",
        availability: user.availability || "",
      });
    }
  }, [userProfile, user]);

  // Show success message
  useEffect(() => {
    if (profileSuccess) {
      toast.success("Profile updated successfully!");
      dispatch(resetProfileSuccess());
      setIsEditing(false);
    }
  }, [profileSuccess, dispatch]);

  const handleInputChange = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
    dispatch(updateUserProfileField({ key: field, value }));
  };

  const addSkill = () => {
    if (newSkill.name.trim()) {
      const updatedSkills = {
        ...localData.skills,
        [newSkill.name]: newSkill.level
      };
      setLocalData(prev => ({ ...prev, skills: updatedSkills }));
      dispatch(updateUserProfileField({ key: "skills", value: updatedSkills }));
      setNewSkill({ name: "", level: "Beginner" });
    }
  };

  const removeSkill = (skillName) => {
    const updatedSkills = { ...localData.skills };
    delete updatedSkills[skillName];
    setLocalData(prev => ({ ...prev, skills: updatedSkills }));
    dispatch(updateUserProfileField({ key: "skills", value: updatedSkills }));
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
        <Code className='w-5 h-5 text-purple-400' /> Skills & Experience
      </h2>
      
      {/* Error Display */}
      {profileError && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-300 text-sm">{profileError}</p>
        </div>
      )}
      
      {/* Skills Section */}
      <div className='space-y-3'>
        <h3 className='text-lg font-medium text-white'>Skills</h3>
        
        {/* Add New Skill */}
        <div className='flex gap-2'>
          <input
            type='text'
            value={newSkill.name}
            onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
            placeholder='Add skill'
            className='flex-1 p-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-1 focus:ring-purple-400 focus:outline-none'
          />
          <Input
            type="select"
            value={newSkill.level}
            onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value }))}
            options={[
              { value: "Beginner", label: "Beginner" },
              { value: "Intermediate", label: "Intermediate" },
              { value: "Advanced", label: "Advanced" },
              { value: "Expert", label: "Expert" }
            ]}
            className="w-32"
          />
          <Button onClick={addSkill} size="sm" className="flex items-center gap-1">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Skills List */}
        <div className='flex flex-wrap gap-2'>
          {Object.entries(localData.skills).map(([skill, level]) => (
            <div key={skill} className='flex items-center gap-2 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-500/30'>
              <span className='text-white text-sm'>{skill}</span>
              <span className='text-purple-300 text-xs'>({level})</span>
              <button
                onClick={() => removeSkill(skill)}
                className='text-red-400 hover:text-red-300'
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Experience Section */}
      <div className='space-y-3'>
        <h3 className='text-lg font-medium text-white'>Experience</h3>
        <textarea
          value={localData.experience}
          onChange={(e) => handleInputChange('experience', e.target.value)}
          placeholder='Describe your experience'
          rows={3}
          className='w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-1 focus:ring-purple-400 focus:outline-none resize-none'
        />
      </div>
      
      {/* Location & Availability */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <label className='text-white text-sm font-medium flex items-center gap-2'>
            <MapPin className='w-4 h-4' /> Location
          </label>
          <input
            type='text'
            value={localData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder='Your location'
            className='w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-1 focus:ring-purple-400 focus:outline-none'
          />
        </div>
        
        <Input
          type="select"
          label="Availability"
          leftIcon={Clock}
          value={localData.availability}
          onChange={(e) => handleInputChange('availability', e.target.value)}
          options={[
            { value: "", label: "Select availability" },
            { value: "Full-time", label: "Full-time" },
            { value: "Part-time", label: "Part-time" },
            { value: "Contract", label: "Contract" },
            { value: "Freelance", label: "Freelance" },
            { value: "Not available", label: "Not available" }
          ]}
        />
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
          {profileLoading ? 'Saving...' : 'Save Skills & Experience'}
        </Button>
      </div>
    </section>
  );
}
