import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../../../components/header";
import { Footer, CircularLoader } from "../../../components";

// Role-specific components
import DeveloperDashboard from "../components/DeveloperDashboard";
import ProjectOwnerDashboard from "../components/ProjectOwnerDashboard";
import AdminDashboard from "../components/AdminDashboard";

const Gamification = () => {
  const { user } = useSelector((state) => state.user);
  const [initialLoading, setInitialLoading] = useState(true);

  // Get all loading states from gamification slice
  const {
    loading,
    statsLoading,
    reviewsLoading,
    endorsementsLoading,
    leaderboardLoading,
    achievementsLoading,
  } = useSelector((state) => state.gamification || {});

  // Combined loading flag - show CircularLoader for any in-flight request
  const isBusy = Boolean(
    loading ||
    statsLoading ||
    reviewsLoading ||
    endorsementsLoading ||
    leaderboardLoading ||
    achievementsLoading ||
    initialLoading
  );

  useEffect(() => {
    // Simulate initial loading user data
    const timer = setTimeout(() => setInitialLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const renderRoleBasedContent = () => {
    if (!user?.role) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-gray-300">Please log in to access gamification features.</p>
          </div>
        </div>
      );
    }

    switch (user.role) {
      case 'developer':
        return <DeveloperDashboard user={user} />;
      case 'project-owner':
        return <ProjectOwnerDashboard user={user} />;
      case 'admin':
        return <AdminDashboard user={user} />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Invalid Role</h2>
              <p className="text-gray-300">Your role doesn't have access to gamification features.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Navbar />
      {renderRoleBasedContent()}
      <Footer />
      {isBusy && (
        <div className="fixed inset-0 z-[9999]">
          <CircularLoader />
        </div>
      )}
    </>
  );
};

export default Gamification;
