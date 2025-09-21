import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "../../../components/header";
import { Footer } from "../../../components";

// Role-specific components
import DeveloperMatchmaking from "../components/DeveloperMatchmaking";
import ProjectOwnerMatchmaking from "../components/ProjectOwnerMatchmaking";
import AdminMatchmaking from "../components/AdminMatchmaking";

const Matchmaking = () => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const renderRoleBasedContent = () => {
    if (!user?.role) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-gray-300">Please log in to access matchmaking features.</p>
          </div>
        </div>
      );
    }

    switch (user.role) {
      case 'developer':
        return <DeveloperMatchmaking user={user} />;
      case 'project-owner':
        return <ProjectOwnerMatchmaking user={user} />;
      case 'admin':
        return <AdminMatchmaking user={user} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Invalid Role</h2>
              <p className="text-gray-300">Your role doesn't have access to matchmaking features.</p>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-300">Loading matchmaking dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {renderRoleBasedContent()}
      <Footer />
    </>
  );
};

export default Matchmaking;