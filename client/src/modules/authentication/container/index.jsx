import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Users, Briefcase, Star, ArrowRight, Code, Building, Shield, Target, Zap, TrendingUp, Settings, BarChart3 } from "lucide-react";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Circular from "../../../components/loader/Circular";
import { getToken } from "../../../services/utils";

const Authentication = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  
  // Get redirect URL from query parameters
  const redirectTo = searchParams.get('redirect_to');

  // Check if user is already authenticated and redirect them
  useEffect(() => {
    const token = getToken();
    const isLoggedIn = isAuthenticated && token && user;
    
    if (isLoggedIn) {
      // User is already authenticated, redirect them to intended route or dashboard
      const targetRoute = redirectTo ? decodeURIComponent(redirectTo) : "/dashboard";
      navigate(targetRoute, { replace: true });
    }
  }, [isAuthenticated, user, redirectTo, navigate]);

  // Handle role selection from SignIn/SignUp components
  const handleRoleChange = useCallback((role) => {
    setSelectedRole(role);
  }, []);

  // Role-specific features, illustrations, and CTAs
  const roleContent = useMemo(() => {
    if (!selectedRole) {
      // Default content when no role is selected
      return {
        illustration: (
          <div className='text-center space-y-3'>
            <div className='flex justify-center space-x-4'>
              <div className='w-14 h-14 bg-blue-500/30 rounded-full flex items-center justify-center'>
                <Users className='w-7 h-7 text-blue-400' />
              </div>
              <div className='w-3 h-3 bg-purple-500 rounded-full animate-pulse mt-5'></div>
              <div className='w-14 h-14 bg-purple-500/30 rounded-full flex items-center justify-center'>
                <Briefcase className='w-7 h-7 text-purple-400' />
              </div>
            </div>
            <div className='text-sm text-gray-400'>
              Developers ↔ Startups
            </div>
          </div>
        ),
        features: [
          {
            icon: <Users className='w-6 h-6' />,
            title: "Connect with Top Talent",
            description: "Find skilled developers and innovative startups",
          },
          {
            icon: <Briefcase className='w-6 h-6' />,
            title: "Project Collaboration",
            description: "Work on exciting projects and build your portfolio",
          },
          {
            icon: <Star className='w-6 h-6' />,
            title: "Skill Development",
            description: "Learn and grow with industry professionals",
          },
        ],
        cta: {
          title: "Ready to get started?",
          description: "Join thousands of developers and startups",
        },
        gradient: "from-blue-500/20 to-purple-500/20",
        borderColor: "border-blue-500/30",
      };
    }

    switch (selectedRole) {
      case "developer":
        return {
          illustration: (
            <div className='text-center space-y-3'>
              <div className='flex justify-center'>
                <div className='w-20 h-20 bg-blue-500/30 rounded-full flex items-center justify-center'>
                  <Code className='w-10 h-10 text-blue-400' />
                </div>
              </div>
              <div className='text-sm text-gray-400'>
                Build Your Developer Career
              </div>
            </div>
          ),
          features: [
            {
              icon: <Briefcase className='w-6 h-6' />,
              title: "Find Exciting Projects",
              description: "Discover projects that match your skills and interests",
            },
            {
              icon: <Star className='w-6 h-6' />,
              title: "Build Your Portfolio",
              description: "Showcase your work and grow your reputation",
            },
            {
              icon: <TrendingUp className='w-6 h-6' />,
              title: "Grow Your Skills",
              description: "Learn from real projects and industry experts",
            },
          ],
          cta: {
            title: "Start Your Developer Journey",
            description: "Join thousands of developers building amazing projects",
          },
          gradient: "from-blue-500/20 to-purple-500/20",
          borderColor: "border-blue-500/30",
        };

      case "project-owner":
        return {
          illustration: (
            <div className='text-center space-y-3'>
              <div className='flex justify-center'>
                <div className='w-20 h-20 bg-green-500/30 rounded-full flex items-center justify-center'>
                  <Building className='w-10 h-10 text-green-400' />
                </div>
              </div>
              <div className='text-sm text-gray-400'>
                Manage Your Projects
              </div>
            </div>
          ),
          features: [
            {
              icon: <Users className='w-6 h-6' />,
              title: "Hire Top Developers",
              description: "Connect with skilled developers for your projects",
            },
            {
              icon: <Target className='w-6 h-6' />,
              title: "Post Your Projects",
              description: "Get your ideas built by talented professionals",
            },
            {
              icon: <Zap className='w-6 h-6' />,
              title: "Build Your Team",
              description: "Assemble the perfect team for your startup",
            },
          ],
          cta: {
            title: "Launch Your Project",
            description: "Join thousands of project owners building with us",
          },
          gradient: "from-green-500/20 to-teal-500/20",
          borderColor: "border-green-500/30",
        };

      case "admin":
        return {
          illustration: (
            <div className='text-center space-y-3'>
              <div className='flex justify-center'>
                <div className='w-20 h-20 bg-red-500/30 rounded-full flex items-center justify-center'>
                  <Shield className='w-10 h-10 text-red-400' />
                </div>
              </div>
              <div className='text-sm text-gray-400'>
                Admin Dashboard
              </div>
            </div>
          ),
          features: [
            {
              icon: <Users className='w-6 h-6' />,
              title: "Manage Users",
              description: "Oversee platform users and maintain quality",
            },
            {
              icon: <BarChart3 className='w-6 h-6' />,
              title: "System Analytics",
              description: "Monitor platform performance and growth",
            },
            {
              icon: <Settings className='w-6 h-6' />,
              title: "Platform Control",
              description: "Configure and optimize system settings",
            },
          ],
          cta: {
            title: "Access Admin Panel",
            description: "Manage and monitor the SkillBridge platform",
          },
          gradient: "from-red-500/20 to-orange-500/20",
          borderColor: "border-red-500/30",
        };

      default:
        return null;
    }
  }, [selectedRole]);

  // Memoize switch mode function
  const switchMode = useCallback(() => {
    setIsSignIn(prev => !prev);
    setSelectedRole(""); // Reset role when switching between sign in/up
  }, []);

  // Memoize navigation handler
  const handleLogoClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative'>
      {loading && <Circular />}
      {/* Navbar */}
      <nav className='absolute top-0 left-0 right-0 z-20 p-4 lg:p-6'>
        <div className='flex items-center justify-between max-w-7xl mx-auto'>
          <div
            onClick={handleLogoClick}
            className='text-xl cursor-pointer font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text'
          >
            SkillBridge
          </div>
          <div className='hidden lg:flex items-center space-x-6 text-sm'>
            <a href='#' className='hover:text-blue-400 transition-colors'>
              Home
            </a>
            <a href='#' className='hover:text-blue-400 transition-colors'>
              About
            </a>
            <a href='#' className='hover:text-blue-400 transition-colors'>
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Glowing Background Elements */}
      <div className='absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse'></div>
      <div className='absolute top-1/2 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000'></div>
      <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-2000'></div>

      {/* Main Content Positioned to Bottom */}
      <div className='flex-grow flex flex-col justify-end'>
        <div className='flex flex-col lg:flex-row'>
          {/* Right Panel (Form) - Order 1 on mobile (first), order 2 on desktop (right side) */}
          <div className='w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8 order-1 lg:order-2'>
            <div className='w-full max-w-md lg:h-[80vh] overflow-y-auto sidebar-scrollbar'>
              <div className='bg-black/30 border border-white/10 backdrop-blur-md rounded-2xl p-6 lg:p-8 shadow-xl'>
                <h2 className='text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text'>
                  {isSignIn ? "Welcome Back 👋" : "Join SkillBridge 🚀"}
                </h2>

                {isSignIn ? (
                  <SignIn switchMode={switchMode} onRoleChange={handleRoleChange} />
                ) : (
                  <SignUp switchMode={switchMode} onRoleChange={handleRoleChange} />
                )}
              </div>
            </div>
          </div>

          {/* Left Panel (Info) - Order 2 on mobile (below form), order 1 on desktop (left side) */}
          <div className='w-full lg:w-1/2 flex p-6 lg:p-10 items-start order-2 lg:order-1'>
            <div className='max-w-lg mx-auto w-full'>
              <div className='flex flex-col gap-6'>
                {/* Illustration */}
                {roleContent && (
                  <>
                    <div className='relative'>
                      <div className={`w-full h-48 bg-gradient-to-br ${roleContent.gradient} rounded-2xl flex items-center justify-center border ${roleContent.borderColor}`}>
                        {roleContent.illustration}
                      </div>
                    </div>

                    {/* Feature List */}
                    <div className='space-y-4'>
                      {roleContent.features.map((feature, index) => (
                        <div key={index} className='flex items-start space-x-3'>
                          <div className={`w-10 h-10 bg-gradient-to-br ${roleContent.gradient} rounded-lg flex items-center justify-center border ${roleContent.borderColor}`}>
                            {feature.icon}
                          </div>
                          <div>
                            <h3 className='font-semibold text-white mb-1 text-base'>
                              {feature.title}
                            </h3>
                            <p className='text-sm text-gray-400 leading-snug'>
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Call To Action */}
                    <div className={`bg-gradient-to-r ${roleContent.gradient} rounded-xl p-4 border ${roleContent.borderColor}`}>
                      <div className='flex items-center justify-between'>
                        <div>
                          <h3 className='font-semibold text-white mb-1 text-base'>
                            {roleContent.cta.title}
                          </h3>
                          <p className='text-sm text-gray-400'>
                            {roleContent.cta.description}
                          </p>
                        </div>
                        <ArrowRight className={`w-5 h-5 ${
                          selectedRole === "developer" ? "text-blue-400" :
                          selectedRole === "project-owner" ? "text-green-400" :
                          selectedRole === "admin" ? "text-red-400" :
                          "text-blue-400"
                        }`} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
