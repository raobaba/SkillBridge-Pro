// AiCareer.jsx
import React from "react";
import CareerRecommender from "../components/CareerRecommender";
import ResumeEnhancer from "../components/ResumeEnhancer";
import SkillGapAnalyzer from "../components/SkillGapAnalyzer";
import Navbar from "../../../components/header";
import { Footer } from "../../../components/Footer";

const AiCareer = () => {
  return (
    <>
      <Navbar />
      <div className="p-6 space-y-6 sm:space-y-8 max-w-6xl mx-auto">
        <CareerRecommender />
        <ResumeEnhancer />
        <SkillGapAnalyzer />
      </div>
      <Footer />
    </>
  );
};

export default AiCareer;
