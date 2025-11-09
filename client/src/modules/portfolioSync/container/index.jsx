import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../../../components/header";
import { Footer, CircularLoader } from "../../../components";

// Role-specific components
import DeveloperPortfolioSync from "../components/DeveloperPortfolioSync";
import ProjectOwnerPortfolioSync from "../components/ProjectOwnerPortfolioSync";
import AdminPortfolioSync from "../components/AdminPortfolioSync";

const PortfolioSync = () => {
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
            <p className="text-gray-300">Please log in to access PortfolioSync features.</p>
          </div>
        </div>
      );
    }

    switch (user.role) {
      case 'developer':
        return <DeveloperPortfolioSync user={user} />;
      case 'project-owner':
        return <ProjectOwnerPortfolioSync user={user} />;
      case 'admin':
        return <AdminPortfolioSync user={user} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Invalid Role</h2>
              <p className="text-gray-300">Your role doesn't have access to PortfolioSync features.</p>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <CircularLoader />
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

export default PortfolioSync;
