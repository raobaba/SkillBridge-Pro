import React, { useState, useEffect } from "react";
import {
  Users,
  Code,
  Zap,
  Trophy,
  MessageSquare,
  GitBranch,
  Star,
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  Github,
  Linkedin,
  Mail,
  Brain,
  Target,
  Calendar,
  Shield,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/header";
import { Footer } from "../components/ui/Footer";
import { useDispatch } from "react-redux";
import { logOut } from "../modules/authentication/slice/userSlice";
import ConfirmModal from "../components/modal/ConfirmModal";
import Hero from "./section/Hero";
import Stats from "./section/Stats";
import Feature from "./section/Feature";
import Testimonials from "./section/Testimonials";
import HowItWorks from "./section/HowItWorks";
import Pricing from "./section/Pricing";
import CallToAction from "./section/CallToAction";

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeFeature, setActiveFeature] = useState(0);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const features = [
    {
      icon: <Users className='w-8 h-8' />,
      title: "Smart Matchmaking",
      description:
        "AI-powered matching connects you with perfect collaborators based on skills, experience, and project needs.",
    },
    {
      icon: <Brain className='w-8 h-8' />,
      title: "AI-Enhanced Profiles",
      description:
        "Let AI optimize your resume, enhance project descriptions, and suggest personalized learning paths.",
    },
    {
      icon: <Code className='w-8 h-8' />,
      title: "Portfolio Sync",
      description:
        "Automatically sync your GitHub, LinkedIn, and StackOverflow profiles to showcase your real skills.",
    },
    {
      icon: <MessageSquare className='w-8 h-8' />,
      title: "Real-Time Collaboration",
      description:
        "Built-in chat, task management, and project tracking to keep your team synchronized.",
    },
    {
      icon: <Trophy className='w-8 h-8' />,
      title: "Gamified Experience",
      description:
        "Earn XP, unlock badges, and climb leaderboards as you complete projects and help others.",
    },
    {
      icon: <TrendingUp className='w-8 h-8' />,
      title: "Skill Intelligence",
      description:
        "Stay ahead with trend analysis, skill gap identification, and career path recommendations.",
    },
  ];

  const stats = [
    { value: "50K+", label: "Active Developers" },
    { value: "25K+", label: "Projects Completed" },
    { value: "95%", label: "Match Success Rate" },
    { value: "150+", label: "Countries" },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Full Stack Developer",
      company: "TechCorp",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b1e0?w=64&h=64&fit=crop&crop=face",
      quote:
        "Found my perfect co-founder through DevCollab. The AI matching is incredibly accurate!",
    },
    {
      name: "Marcus Rodriguez",
      role: "Startup Founder",
      company: "InnovateLab",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      quote:
        "Hired 3 amazing developers for my startup. The skill verification system is a game-changer.",
    },
    {
      name: "Priya Patel",
      role: "Open Source Maintainer",
      company: "CoreLibs",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      quote:
        "The platform helped me find passionate contributors for my open-source projects.",
    },
  ];

  const heroContent = {
    title: (
      <>
        Bridge Your Skills
        <br />
        <span className='text-white'>To Success</span>
      </>
    ),
    subtitle:
      "The professional platform where developers connect, collaborate, and accelerate their careers. Bridge the gap between your skills and your next opportunity with AI-powered matching.",
    buttons: [
      {
        label: "Start Collaborating",
        icon: <ArrowRight className='w-5 h-5 ml-2 inline-block' />,
        className:
          "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl",
      },
      {
        label: "Watch Demo",
        icon: null,
        className:
          "border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-white/5",
      },
    ],
  };

  const howItWorksContent = {
    heading: (
      <>
        How It <span className='text-purple-400'>Works</span>
      </>
    ),
    subtitle:
      "Get started in minutes and find your perfect collaboration match.",
    steps: [
      {
        step: "01",
        title: "Create Your Profile",
        description:
          "Sign up with GitHub, LinkedIn, or email. Our AI analyzes your skills and experience.",
        icon: <Users className='w-8 h-8' />,
      },
      {
        step: "02",
        title: "Get Matched",
        description:
          "Our intelligent algorithm connects you with relevant projects and collaborators.",
        icon: <Target className='w-8 h-8' />,
      },
      {
        step: "03",
        title: "Start Building",
        description:
          "Chat, collaborate, and manage projects with built-in tools and gamification.",
        icon: <Zap className='w-8 h-8' />,
      },
    ],
  };

  const pricingContent = {
    heading: (
      <>
        Simple <span className='text-yellow-400'>Pricing</span>
      </>
    ),
    subtitle: "Choose the plan that fits your collaboration needs.",
    plans: [
      {
        name: "Free",
        price: "$0",
        period: "forever",
        features: [
          "Basic profile creation",
          "Limited project matching",
          "Basic chat functionality",
          "Community support",
        ],
        popular: false,
      },
      {
        name: "Pro",
        price: "$19",
        period: "month",
        features: [
          "Advanced AI matching",
          "Unlimited project posts",
          "Priority support",
          "Advanced analytics",
          "Portfolio sync",
          "Skill gap analysis",
        ],
        popular: true,
      },
      {
        name: "Enterprise",
        price: "$99",
        period: "month",
        features: [
          "Everything in Pro",
          "Team management",
          "Custom integrations",
          "Dedicated support",
          "Advanced security",
          "Custom branding",
        ],
        popular: false,
      },
    ],
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await dispatch(logOut());
    setIsLogoutModalOpen(false);
    navigate("/auth");
  };

  return (
    <div className='min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
      {/* Navigation */}
      <Navbar onLogoutClick={() => setIsLogoutModalOpen(true)} />

      {/*Hero Section */}
      <Hero heroContent={heroContent} />
      {/* Stats Section */}
      <Stats stats={stats} />

      {/* Features Section */}
      <Feature
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
    </div>
  );
}
