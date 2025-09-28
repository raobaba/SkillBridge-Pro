import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../../components";
import { Footer } from "../../../components";
import { useDispatch } from "react-redux";
import { logOut } from "../../authentication/slice/userSlice";
import ConfirmModal from "../../../components/modal/ConfirmModal";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import HowItWorks from "../components/HowItWorks";
import Pricing from "../components/Pricing";
import CallToAction from "../components/CallToAction";
import { useHomeData } from "../hooks/useHomeData";
import { 
  getHeroButtons,
  handleNavigationAction 
} from "../homeNavigationConfig";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Use custom hook for home data
  const {
    features,
    stats,
    testimonials,
    pricingPlans,
    heroContent: baseHeroContent,
    howItWorksContent,
    pricingContent: basePricingContent,
    activeFeature,
    setActiveFeature,
  } = useHomeData();

  // Enhanced hero content with dynamic buttons
  const heroContent = {
    ...baseHeroContent,
    buttons: getHeroButtons().map(button => ({
      ...button,
      icon: button.icon ? <button.icon className='w-5 h-5 ml-2 inline-block' /> : null,
      onClick: () => handleNavigationAction(button.action, button.path, navigate)
    })),
  };

  // Enhanced pricing content with plans
  const pricingContent = {
    ...basePricingContent,
    plans: pricingPlans,
  };

  const handleLogout = async () => {
    await dispatch(logOut());
    setIsLogoutModalOpen(false);
    navigate("/auth");
  };

  return (
    <Layout isHome={true} showBreadcrumb={false}>
      {/*Hero Section */}
      <Hero heroContent={heroContent} />
      {/* Stats Section */}
      <Stats stats={stats} />

      {/* Features Section */}
      <Features
        features={features}
        activeFeature={activeFeature}
        setActiveFeature={setActiveFeature}
      />

      {/* How It Works Section */}
      <HowItWorks howItWorksContent={howItWorksContent} />

      {/* Testimonials Section */}
      <Testimonials testimonials={testimonials} />

      {/* Pricing Section */}
      <Pricing pricingContent={pricingContent} />

      {/* CTA Section */}
      <CallToAction />
      <Footer />
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title='Logout Confirmation'
        message='Are you sure you want to logout?'
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </Layout>
  );
}
