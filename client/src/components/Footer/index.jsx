import React from "react";
import { Code, Github, Linkedin, Mail, ArrowRight, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <div className="relative">
      {/* Footer */}
      <footer className='bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm border-t border-white/10 py-8 sm:py-12 lg:py-16 relative overflow-hidden'>
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"></div>
        
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-12'>
            {/* Brand Section */}
            <div className="md:col-span-2 lg:col-span-1 text-center md:text-left">
              <div className='flex items-center justify-center md:justify-start space-x-3 mb-4 sm:mb-6'>
                <div className='w-10 h-10 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg'>
                  <Code className='w-6 h-6 sm:w-5 sm:h-5 text-white' />
                </div>
                <span className='text-xl sm:text-lg lg:text-xl font-bold text-white'>
                  SkillBridge Pro
                </span>
              </div>
              <p className='text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-md mx-auto md:mx-0'>
                The professional platform for bridging skills to success and
                accelerating career growth with AI-powered insights.
              </p>
              <div className='flex justify-center md:justify-start space-x-4 sm:space-x-3'>
                <div className="group cursor-pointer">
                  <div className="w-10 h-10 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center hover:from-blue-500 hover:to-purple-600 transition-all duration-300">
                    <Github className='w-5 h-5 sm:w-4 sm:h-4 text-gray-300 group-hover:text-white transition-colors duration-300' />
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="w-10 h-10 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center hover:from-blue-500 hover:to-purple-600 transition-all duration-300">
                    <Linkedin className='w-5 h-5 sm:w-4 sm:h-4 text-gray-300 group-hover:text-white transition-colors duration-300' />
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="w-10 h-10 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center hover:from-blue-500 hover:to-purple-600 transition-all duration-300">
                    <Mail className='w-5 h-5 sm:w-4 sm:h-4 text-gray-300 group-hover:text-white transition-colors duration-300' />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Links */}
            <div className="text-center md:text-left">
              <h4 className='font-bold mb-4 sm:mb-6 text-white text-lg sm:text-base lg:text-lg'>Product</h4>
              <div className='space-y-3 sm:space-y-2 lg:space-y-3'>
                <div className='group flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-1 py-1'>
                  <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-blue-400' />
                  <span className="text-sm sm:text-base">Features</span>
                </div>
                <div className='group flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-1 py-1'>
                  <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-blue-400' />
                  <span className="text-sm sm:text-base">Pricing</span>
                </div>
                <div className='group flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-1 py-1'>
                  <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-blue-400' />
                  <span className="text-sm sm:text-base">API</span>
                </div>
                <div className='group flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-1 py-1'>
                  <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-blue-400' />
                  <span className="text-sm sm:text-base">Integrations</span>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div className="text-center md:text-left">
              <h4 className='font-bold mb-4 sm:mb-6 text-white text-lg sm:text-base lg:text-lg'>Company</h4>
              <div className='space-y-3 sm:space-y-2 lg:space-y-3'>
                <div className='group flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-1 py-1'>
                  <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-purple-400' />
                  <span className="text-sm sm:text-base">About</span>
                </div>
                <div className='group flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-1 py-1'>
                  <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-purple-400' />
                  <span className="text-sm sm:text-base">Blog</span>
                </div>
                <div className='group flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-1 py-1'>
                  <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-purple-400' />
                  <span className="text-sm sm:text-base">Careers</span>
                </div>
                <div className='group flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-1 py-1'>
                  <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-purple-400' />
                  <span className="text-sm sm:text-base">Contact</span>
                </div>
              </div>
            </div>

            {/* Support Links */}
            <div className="text-center md:text-left">
              <h4 className='font-bold mb-4 sm:mb-6 text-white text-lg sm:text-base lg:text-lg'>Support</h4>
              <div className='space-y-3 sm:space-y-2 lg:space-y-3'>
                <div className='group flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-1 py-1'>
                  <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-pink-400' />
                  <span className="text-sm sm:text-base">Help Center</span>
                </div>
                <div className='group flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-1 py-1'>
                  <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-pink-400' />
                  <span className="text-sm sm:text-base">Community</span>
                </div>
                <div className='group flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-1 py-1'>
                  <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-pink-400' />
                  <span className="text-sm sm:text-base">Status</span>
                </div>
                <div className='group flex items-center justify-center md:justify-start gap-2 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-1 py-1'>
                  <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-pink-400' />
                  <span className="text-sm sm:text-base">Privacy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className='border-t border-white/10 pt-6 sm:pt-8'>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-4">
              <div className="flex items-center gap-2 text-gray-300 text-sm sm:text-base text-center sm:text-left">
                <span>&copy; 2025 SkillBridge Pro. All rights reserved.</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm sm:text-base">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-pink-400 fill-current" />
                <span>for developers</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};