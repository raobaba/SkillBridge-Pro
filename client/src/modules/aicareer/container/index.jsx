// AiCareer.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import CareerRecommender from "../components/CareerRecommender";
import ResumeEnhancer from "../components/ResumeEnhancer";
import SkillGapAnalyzer from "../components/SkillGapAnalyzer";
import ProjectOptimizer from "../components/ProjectOptimizer";
import TeamAnalyzer from "../components/TeamAnalyzer";
import DeveloperMatcher from "../components/DeveloperMatcher";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import SkillTrends from "../components/SkillTrends";
import PlatformInsights from "../components/PlatformInsights";
import Navbar from "../../../components/header";
import { Footer } from "../../../components/Footer";

const AiCareer = () => {
  const { user } = useSelector((state) => state.user);

  const [userRole, setUserRole] = useState("project-owner");

  useEffect(() => {
    if (user?.role) {
      setUserRole(user.role);
    }
  }, [user]);

  const renderDeveloperTools = () => (
    <div className="p-6 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">AI Career Tools</h1>
        <p className="text-gray-300">Personalized career development and skill enhancement</p>
      </div>
      <CareerRecommender />
      <ResumeEnhancer />
      <SkillGapAnalyzer />
    </div>
  );

  const renderProjectOwnerTools = () => (
    <div className="p-6 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">AI Project Tools</h1>
        <p className="text-gray-300">Optimize projects and find the best developers</p>
      </div>
      <ProjectOptimizer />
      <TeamAnalyzer />
      <DeveloperMatcher />
    </div>
  );

  const renderAdminTools = () => (
    <div className="p-6 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">AI Analytics Dashboard</h1>
        <p className="text-gray-300">System-wide insights and platform optimization</p>
      </div>
      <AnalyticsDashboard />
      <SkillTrends />
      <PlatformInsights />
    </div>
  );

  const renderContent = () => {
    switch (user?.role) {
      case "developer":
        return renderDeveloperTools();
      case "project-owner":
        return renderProjectOwnerTools();
      case "admin":
        return renderAdminTools();
      default:
        return renderDeveloperTools();
    }
  };

  return (
    <>
      <Navbar />
      {renderContent()}
      <Footer />
    </>
  );
};

export default AiCareer;
