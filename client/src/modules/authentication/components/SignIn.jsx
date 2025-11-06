import React, { useState } from "react";
import DeveloperSignIn from "./DeveloperSignIn";
import ProjectOwnerSignIn from "./ProjectOwnerSignIn";
import AdminSignIn from "./AdminSignIn";

const SignIn = ({ switchMode, onRoleChange }) => {
  const [selectedRole, setSelectedRole] = useState("");

  // Handle role selection
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (onRoleChange) {
      onRoleChange(role);
    }
  };

  // Handle back to role selection
  const handleBackToRoleSelection = () => {
    setSelectedRole("");
    if (onRoleChange) {
      onRoleChange("");
    }
  };

  // Role selection screen
  if (!selectedRole) {
    return (
      <div className='space-y-6'>
        <div className='text-center mb-6'>
        
          <p className='text-gray-400 text-sm'>Select your account type to continue</p>
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
                <p className='text-sm text-gray-400'>Sign in to access your developer dashboard</p>
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
                <p className='text-sm text-gray-400'>Sign in to manage your projects and team</p>
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
                <p className='text-sm text-gray-400'>Sign in to access admin dashboard</p>
              </div>
              <span className='text-2xl'>→</span>
            </div>
          </button>
        </div>

        <p className='text-center text-sm text-gray-400'>
          Don't have an account?{" "}
          <span
            onClick={switchMode}
            className='text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition-colors'
          >
            Sign Up
          </span>
        </p>
      </div>
    );
  }

  // Role-specific sign-in screen
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
        <DeveloperSignIn switchMode={switchMode} />
      )}

      {selectedRole === "project-owner" && (
        <ProjectOwnerSignIn switchMode={switchMode} />
      )}

      {selectedRole === "admin" && (
        <AdminSignIn switchMode={switchMode} />
      )}
    </div>
  );
};

export default SignIn;
