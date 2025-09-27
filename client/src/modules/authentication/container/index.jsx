import React, { useState, useMemo, useCallback } from "react";
import { Users, Briefcase, Star, ArrowRight } from "lucide-react";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Circular from "../../../components/loader/Circular";

const Authentication = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  // Memoize features to prevent unnecessary re-renders
  const features = useMemo(() => [
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
  ], []);

  // Memoize switch mode function
  const switchMode = useCallback(() => {
    setIsSignIn(prev => !prev);
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
          {/* Left Panel (Info) */}
          <div className='hidden lg:flex lg:w-1/2 p-6 lg:p-10 items-start'>
            <div className='max-w-lg mx-auto w-full'>
              <div className='flex flex-col gap-6'>
                {/* Illustration */}
                <div className='relative'>
                  <div className='w-full h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-white/10'>
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
                  </div>
                </div>

                {/* Feature List */}
                <div className='space-y-4'>
                  {features.map((feature, index) => (
                    <div key={index} className='flex items-start space-x-3'>
                      <div className='w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-white/10'>
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
                <div className='bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-white/10'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='font-semibold text-white mb-1 text-base'>
                        Ready to get started?
                      </h3>
                      <p className='text-sm text-gray-400'>
                        Join thousands of developers and startups
                      </p>
                    </div>
                    <ArrowRight className='w-5 h-5 text-blue-400' />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel (Form) */}
          <div className='w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8'>
            <div className='w-full max-w-md h-[80vh] overflow-y-auto sidebar-scrollbar'>
              <div className='bg-black/30 border border-white/10 backdrop-blur-md rounded-2xl p-6 lg:p-8 shadow-xl'>
                <h2 className='text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text'>
                  {isSignIn ? "Welcome Back 👋" : "Join SkillBridge 🚀"}
                </h2>

                {isSignIn ? (
                  <SignIn switchMode={switchMode} />
                ) : (
                  <SignUp switchMode={switchMode} />
                )}
              </div>

              {/* Mobile Info Text */}
              <div className='lg:hidden mt-8 text-center'>
                <p className='text-gray-400 text-sm'>
                  Connect with developers and startups worldwide
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
