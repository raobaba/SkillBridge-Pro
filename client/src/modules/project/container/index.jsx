import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Button, Footer } from "../../../components";
import Navbar from "../../../components/header/index";
// Role-specific components
import DeveloperProjects from "../components/DeveloperProjects";
import ProjectOwnerProjects from "../components/ProjectOwnerProjects";
import AdminProjects from "../components/AdminProjects";
// Project actions
import { 
  listProjects, 
  getMyInvites, 
  getProjectRecommendations,
  getProjectFavorites,
  searchProjects,
  clearProjectState 
} from "../slice/projectSlice";

export default function Project() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { 
    projects, 
    myInvites, 
    recommendations, 
    favorites,
    searchResults,
    projectStats,
    loading: projectLoading,
    error: projectError,
    message: projectMessage
  } = useSelector((state) => state.project);
  
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load initial data based on user role
    const loadInitialData = async () => {
      try {
        // Load projects for all roles
        await dispatch(listProjects()).unwrap();
        
        // Load role-specific data
        if (user?.role === 'developer') {
          await Promise.all([
            dispatch(getMyInvites()).unwrap(),
            dispatch(getProjectRecommendations(10)).unwrap(),
            dispatch(getProjectFavorites()).unwrap()
          ]);
        } else if (user?.role === 'project-owner') {
          // Load owner's projects
          await dispatch(listProjects({ ownerId: user.id })).unwrap();
        } else if (user?.role === 'admin') {
          // Load all projects for admin
          await dispatch(listProjects()).unwrap();
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role) {
      loadInitialData();
    } else {
      setLoading(false);
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

    // Common props for all components
    const commonProps = {
      user,
      projects,
      myInvites,
      recommendations,
      favorites,
      searchResults,
      projectStats,
      dispatch,
      loading: projectLoading,
      error: projectError,
      message: projectMessage,
      searchQuery,
      setSearchQuery,
      handleSearch
    };

    switch (user.role) {
      case 'developer':
        return <DeveloperProjects {...commonProps} />;
      case 'project-owner':
        return <ProjectOwnerProjects {...commonProps} />;
      case 'admin':
        return <AdminProjects {...commonProps} />;
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

  if (loading || projectLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-300">Loading projects...</p>
          {projectError && (
            <p className="text-red-400 text-sm mt-2">Error: {projectError}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar isSearchBar={true} />
      {renderRoleBasedContent()}
      <Footer />
    </>
  );
}


