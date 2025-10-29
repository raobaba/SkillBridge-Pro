// AiCareer.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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

const AiCareer = () => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-300">Loading AI career tools...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {renderRoleBasedContent()}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AiCareer;