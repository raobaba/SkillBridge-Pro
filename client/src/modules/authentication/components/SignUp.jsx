import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../slice/userSlice";
import { Input, Button } from "../../../components";
import OAuthButtons from "../../../components/shared/OAuthButtons";
import { useAuthForm } from "../../../components/hooks/useAuthForm";
import DeveloperSignUp from "./DeveloperSignUp";
import ProjectOwnerSignUp from "./ProjectOwnerSignUp";
import AdminSignUp from "./AdminSignUp";

const SignUp = ({ switchMode, onRoleChange }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [showRoleForm, setShowRoleForm] = useState(false);

  // Get role-specific initial form data
  const getInitialFormData = (role) => {
    const baseData = {
      name: "",
      email: "",
      role: role || "",
      password: "",
    };

    if (role === "developer") {
      return {
        ...baseData,
        domains: "",
        experience: "",
        availability: "full-time",
        location: "",
      };
    } else if (role === "project-owner") {
      return {
        ...baseData,
        company: "",
        location: "",
        website: "",
        businessType: "",
      };
    } else if (role === "admin") {
      return {
        ...baseData,
        adminKey: "",
      };
    }

    return baseData;
  };

  // Get role-specific required fields
  const getRequiredFields = (role) => {
    const baseFields = ["name", "email", "role", "password"];

    if (role === "developer") {
      return [...baseFields, "domains", "experience", "availability"];
    } else if (role === "project-owner") {
      return baseFields; // Company and other fields are optional
    } else if (role === "admin") {
      return [...baseFields, "adminKey"];
    }

    return baseFields;
  };

  const [requiredFields, setRequiredFields] = useState(["name", "email", "role", "password"]);
  const initialForm = getInitialFormData("");

  const {
    formData,
    errors,
    loading,
    handleChange: baseHandleChange,
    setFormData: setFormDataFromHook,
    handleAuthStateChange
  } = useAuthForm(initialForm, requiredFields);

  // Custom handleChange that updates both formData and role
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If role is being changed, reset form and show role selection
    if (name === "role") {
      setSelectedRole(value);
      setShowRoleForm(false);
      const newFormData = getInitialFormData(value);
      setFormDataFromHook(newFormData);
      setRequiredFields(getRequiredFields(value));
    } else {
      baseHandleChange(e);
    }
  };

  // Handle role selection
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    const newFormData = getInitialFormData(role);
    setFormDataFromHook(newFormData);
    setRequiredFields(getRequiredFields(role));
    setShowRoleForm(true);
    if (onRoleChange) {
      onRoleChange(role);
    }
  };

  // Handle back to role selection
  const handleBackToRoleSelection = () => {
    setSelectedRole("");
    setShowRoleForm(false);
    setFormDataFromHook(getInitialFormData(""));
    setRequiredFields(["name", "email", "role", "password"]);
    if (onRoleChange) {
      onRoleChange("");
    }
  };

  // Handle auth state changes
  useEffect(() => {
    handleAuthStateChange();
  }, [handleAuthStateChange]);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      return;
    }

    try {
      // Prepare data based on role
      const submitData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password,
      };

      // Add role-specific fields
      if (formData.role === "developer") {
        submitData.domains = formData.domains;
        submitData.experience = formData.experience;
        submitData.availability = formData.availability;
        if (formData.location) submitData.location = formData.location;
      } else if (formData.role === "project-owner") {
        if (formData.company) submitData.company = formData.company;
        if (formData.location) submitData.location = formData.location;
        if (formData.website) submitData.website = formData.website;
        if (formData.businessType) submitData.businessType = formData.businessType;
        // Set defaults for required fields that backend expects
        submitData.domains = formData.company || "N/A";
        submitData.experience = "0";
        submitData.availability = "full-time";
      } else if (formData.role === "admin") {
        submitData.adminKey = formData.adminKey;
        // Set defaults for required fields that backend expects
        submitData.domains = "N/A";
        submitData.experience = "0";
        submitData.availability = "full-time";
      }

      const result = await dispatch(registerUser(submitData));
      if (result?.payload?.status === 201) {
        switchMode();
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  }, [dispatch, switchMode, formData, requiredFields]);

  // Role selection screen
  if (!showRoleForm) {
    return (
      <div className='space-y-6'>
        <div className='text-center mb-6'>
          <h2 className='text-2xl font-bold text-white mb-2'>Choose Your Role</h2>
          <p className='text-gray-400 text-sm'>Select the type of account you want to create</p>
        </div>

        <div className='grid grid-cols-1 gap-4'>
          <button
            type='button'
            onClick={() => handleRoleSelect("developer")}
            className='p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg hover:border-blue-500/60 hover:bg-blue-600/30 transition-all text-left group'
          >
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-semibold text-white mb-1 group-hover:text-blue-300'>👨‍💻 Developer</h3>
                <p className='text-sm text-gray-400'>Find projects, build your portfolio, and grow your career</p>
              </div>
              <span className='text-2xl'>→</span>
            </div>
          </button>

          <button
            type='button'
            onClick={() => handleRoleSelect("project-owner")}
            className='p-6 bg-gradient-to-r from-green-600/20 to-teal-600/20 border border-green-500/30 rounded-lg hover:border-green-500/60 hover:bg-green-600/30 transition-all text-left group'
          >
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-semibold text-white mb-1 group-hover:text-green-300'>🏢 Project Owner</h3>
                <p className='text-sm text-gray-400'>Post projects, hire developers, and build your team</p>
              </div>
              <span className='text-2xl'>→</span>
            </div>
          </button>

          <button
            type='button'
            onClick={() => handleRoleSelect("admin")}
            className='p-6 bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-lg hover:border-red-500/60 hover:bg-red-600/30 transition-all text-left group'
          >
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-semibold text-white mb-1 group-hover:text-red-300'>🔐 Admin</h3>
                <p className='text-sm text-gray-400'>Manage platform, users, and system settings</p>
              </div>
              <span className='text-2xl'>→</span>
            </div>
          </button>
        </div>

        <p className='text-center text-sm text-gray-400'>
          Already have an account?{" "}
          <span
            onClick={switchMode}
            className='text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition-colors'
          >
            Sign In
          </span>
        </p>
      </div>
    );
  }

  // Role-specific form screen
  return (
    <div className='space-y-6'>
      {/* Back button */}
      <button
        type='button'
        onClick={handleBackToRoleSelection}
        className='flex items-center text-sm text-gray-400 hover:text-gray-300 transition-colors'
      >
        <span className='mr-2'>←</span> Back to Role Selection
      </button>

      {/* Role-specific form */}
      {selectedRole === "developer" && (
        <DeveloperSignUp
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          onSubmit={onSubmit}
          loading={loading}
        />
      )}

      {selectedRole === "project-owner" && (
        <ProjectOwnerSignUp
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          onSubmit={onSubmit}
          loading={loading}
        />
      )}

      {selectedRole === "admin" && (
        <AdminSignUp
          formData={formData}
          errors={errors}
          handleChange={handleChange}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          onSubmit={onSubmit}
          loading={loading}
        />
      )}

      <p className='text-center text-sm text-gray-400'>
        Already have an account?{" "}
        <span
          onClick={switchMode}
          className='text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition-colors'
        >
          Sign In
        </span>
      </p>

      {/* OAuth Buttons - only show for developer and project-owner */}
      {(selectedRole === "developer" || selectedRole === "project-owner") && <OAuthButtons />}
    </div>
  );
};

export default SignUp;
