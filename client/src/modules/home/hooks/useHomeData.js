import { useState, useEffect } from "react";
import { features } from "../data/features.jsx";
import { stats } from "../data/stats";
import { testimonials } from "../data/testimonials";
import { pricingPlans } from "../data/pricing";
import { heroContent, howItWorksContent, pricingContent } from "../data/navigation.jsx";

export const useHomeData = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return {
    features,
    stats,
    testimonials,
    pricingPlans,
    heroContent,
    howItWorksContent,
    pricingContent,
    activeFeature,
    setActiveFeature,
  };
};
