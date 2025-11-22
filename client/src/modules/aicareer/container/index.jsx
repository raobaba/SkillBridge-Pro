// AiCareer.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CareerRecommender from "../components/CareerRecommender";
import ResumeEnhancer from "../components/ResumeEnhancer";
import SkillGapAnalyzer from "../components/SkillGapAnalyzer";
import ProjectOptimizer from "../components/ProjectOptimizer";
import TeamAnalyzer from "../components/TeamAnalyzer";
import DeveloperMatcher from "../components/DeveloperMatcher";
import AdminCareer from "../components/AdminCareer";
import SkillTrends from "../components/SkillTrends";
import PlatformInsights from "../components/PlatformInsights";
import Navbar from "../../../components/header";
import { Footer } from "../../../components/Footer";
import { CircularLoader } from "../../../components";
import {
  getCareerRecommendations,
  enhanceResume,
  analyzeSkillGap,
  matchDevelopers,
  optimizeProject,
  getSkillTrends,
  getPlatformInsights,
  analyzeTeam,
} from "../slice/aiCareerSlice";

const AiCareer = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const aiCareerState = useSelector((state) => state.aiCareer || {});
  
  // Check if any data is loading
  const isLoading = 
    aiCareerState.careerRecommendationsLoading ||
    aiCareerState.resumeSuggestionsLoading ||
    aiCareerState.skillGapsLoading ||
    aiCareerState.developerMatchesLoading ||
    aiCareerState.projectOptimizationsLoading ||
    aiCareerState.skillTrendsLoading ||
    aiCareerState.platformInsightsLoading ||
    aiCareerState.teamAnalysisLoading ||
    aiCareerState.loading;

  // Load data based on user role
  useEffect(() => {
    if (!user?.role) return;

    if (user.role === "developer") {
      // Load developer-specific data
      dispatch(getCareerRecommendations());
      dispatch(enhanceResume());
      dispatch(analyzeSkillGap());
    } else if (user.role === "project-owner") {
      // Load project owner-specific data
      dispatch(matchDevelopers());
      dispatch(analyzeTeam());
      // Note: optimizeProject requires projectId, will be called from component if needed
    } else if (user.role === "admin") {
      // Load admin-specific data
      dispatch(getSkillTrends());
      dispatch(getPlatformInsights());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role, dispatch]);

  const renderDeveloperTools = () => (
    <div className='w-full space-y-8'>
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-bold text-white mb-2'>AI Career Tools</h1>
        <p className='text-gray-300'>
          Personalized career development and skill enhancement
        </p>
      </div>
      <CareerRecommender />
      <ResumeEnhancer />
      <SkillGapAnalyzer />
    </div>
  );

  const renderProjectOwnerTools = () => (
    <div className='w-full p-6 space-y-8'>
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-bold text-white mb-2'>AI Project Tools</h1>
        <p className='text-gray-300'>
          Optimize projects and find the best developers
        </p>
      </div>
      <ProjectOptimizer />
      <TeamAnalyzer />
      <DeveloperMatcher />
    </div>
  );

  const renderAdminTools = () => (
    <div className='w-full p-6 space-y-8'>
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-bold text-white mb-2'>
          AI Analytics Dashboard
        </h1>
        <p className='text-gray-300'>
          System-wide insights and platform optimization
        </p>
      </div>
      <AdminCareer />
      <SkillTrends />
      <PlatformInsights />
    </div>
  );

  const renderRoleBasedContent = () => {
    if (!user?.role) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-gray-300">Please log in to access AI career features.</p>
          </div>
        </div>
      );
    }

    switch (user.role) {
      case "developer":
        return renderDeveloperTools();
      case "project-owner":
        return renderProjectOwnerTools();
      case "admin":
        return renderAdminTools();
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Invalid Role</h2>
              <p className="text-gray-300">Your role doesn't have access to AI career features.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative'>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <CircularLoader />
          </div>
        ) : (
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {renderRoleBasedContent()}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AiCareer;