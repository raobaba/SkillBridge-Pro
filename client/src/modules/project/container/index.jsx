import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Footer, CircularLoader } from "../../../components";
import Navbar from "../../../components/header/index";
// Role-specific components
import DeveloperProjects from "../components/DeveloperProjects";
import ProjectOwnerProjects from "../components/ProjectOwnerProjects";
import AdminProjects from "../components/AdminProjects";
// Project actions
import { 
  listProjects, 
  getMyInvites, 
  getProjectFavorites,
  searchProjects,
  clearProjectState,
  // New public discovery thunks
  getPublicProjects,
  getProjectCategories,
  getFilterOptions,
  // Application tracking
  getMyApplications,
  getMyApplicationsCount,
} from "../slice/projectSlice";

export default function Project() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { 
    projects, 
    myInvites, 
    recommendations, 
    favorites,
    saves,
    appliedProjects,
    searchResults,
    projectStats,
    // New public discovery state
    publicProjects,
    projectCategories,
    filterOptions,
    error: projectError,
    message: projectMessage
  } = useSelector((state) => state.project);
 
  const {

    loading,
    projectsLoading,
    projectLoading,
    invitesLoading,
    favoritesLoading,
    savesLoading,

  } = useSelector((state) => state.project);
  
  const [searchQuery, setSearchQuery] = useState("");

  // Unified loading flag: show CircularLoader for any in-flight request
  const isBusy = Boolean(loading ||invitesLoading || favoritesLoading ||savesLoading ||projectLoading ||
    projectsLoading
  );

  useEffect(() => {
    // Load initial data based on user role - only call APIs needed for specific role
    const loadInitialData = async () => {
      try {
        if (!user?.role) return;

        // Load role-specific data only
        if (user.role === 'developer') {
          // Developer only needs: public projects, categories, filters, invites, favorites, and applications
          await Promise.all([
            dispatch(getPublicProjects()).unwrap(),
            dispatch(getProjectCategories()).unwrap(),
            dispatch(getFilterOptions()).unwrap(),
            dispatch(getMyInvites()).unwrap(),
            dispatch(getProjectFavorites()).unwrap(),
            dispatch(getMyApplications()).unwrap(),
            dispatch(getMyApplicationsCount()).unwrap()
          ]);
        } else if (user.role === 'project-owner') {
          // Project owner only needs: public projects, categories, filters, and their own projects
          await Promise.all([
            dispatch(getPublicProjects()).unwrap(),
            dispatch(getProjectCategories()).unwrap(),
            dispatch(getFilterOptions()).unwrap(),
            dispatch(listProjects({ ownerId: user.id })).unwrap()
          ]);
        } else if (user.role === 'admin') {
          // Admin needs: public projects, categories, filters, and all projects
          await Promise.all([
            dispatch(getPublicProjects()).unwrap(),
            dispatch(getProjectCategories()).unwrap(),
            dispatch(getFilterOptions()).unwrap(),
            dispatch(listProjects()).unwrap()
          ]);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    // Load data only when user role is available
    if (user?.role) {
      loadInitialData();
    }
  }, [dispatch, user?.role, user?.id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(clearProjectState());
    };
  }, [dispatch]);

  // Search function
  const handleSearch = async (query) => {
    if (query.trim()) {
      try {
        await dispatch(searchProjects({ query })).unwrap();
      } catch (error) {
        console.error('Search error:', error);
      } finally {
      }
    }
  };

  const renderRoleBasedContent = () => {
    if (!user?.role) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-gray-300">Please log in to access project features.</p>
          </div>
        </div>
      );
    }

    // Base props that all roles need
    const baseProps = {
      user,
      dispatch,
      loading: isBusy,
      error: projectError,
      message: projectMessage,
      searchQuery,
      setSearchQuery,
      handleSearch,
      // Public discovery data (available to all roles)
      publicProjects,
      projectCategories,
      filterOptions,
    };

    switch (user.role) {
      case 'developer':
        // Developer only needs: invites, favorites, saves, appliedProjects, searchResults
        return <DeveloperProjects {...baseProps} 
          myInvites={myInvites}
          favorites={favorites}
          saves={saves}
          appliedProjects={appliedProjects}
          searchResults={searchResults}
        />;
      case 'project-owner':
        // Project owner only needs: projects, projectStats, searchResults
        return <ProjectOwnerProjects {...baseProps} 
          projects={projects}
          projectStats={projectStats}
          searchResults={searchResults}
        />;
      case 'admin':
        // Admin needs: projects, projectStats, searchResults, and all other data
        return <AdminProjects {...baseProps} 
          projects={projects}
          myInvites={myInvites}
          recommendations={recommendations}
          favorites={favorites}
          saves={saves}
          appliedProjects={appliedProjects}
          searchResults={searchResults}
          projectStats={projectStats}
        />;
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Invalid Role</h2>
              <p className="text-gray-300">Your role doesn't have access to project features.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Navbar isSearchBar={false} />
      {renderRoleBasedContent()}
      <Footer />
      {isBusy && (
        <div className="fixed inset-0 z-[9999]">
          <CircularLoader />
        </div>
      )}
    </>
  );
}


