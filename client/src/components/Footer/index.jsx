import React from "react";
import { Code, Github, Linkedin, Mail, ArrowRight, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <div className="relative">
      {/* Footer */}
      <footer className='bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm border-t border-white/10 py-16 relative overflow-hidden'>
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"></div>
        
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
          <div className='grid md:grid-cols-4 gap-8 mb-12'>
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className='flex items-center space-x-3 mb-6'>
                <div className='w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg'>
                  <Code className='w-5 h-5 text-white' />
                </div>
                <span className='text-xl font-bold text-white'>
                  SkillBridge Pro
                </span>
              </div>
              <p className='text-gray-300 mb-6 leading-relaxed'>
                The professional platform for bridging skills to success and
                accelerating career growth with AI-powered insights.
              </p>
              <div className='flex space-x-4'>
                <div className="group cursor-pointer">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center hover:from-blue-500 hover:to-purple-600 transition-all duration-300 group-hover:scale-110">
                    <Github className='w-4 h-4 text-gray-300 group-hover:text-white transition-colors duration-300' />
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center hover:from-blue-500 hover:to-purple-600 transition-all duration-300 group-hover:scale-110">
                    <Linkedin className='w-4 h-4 text-gray-300 group-hover:text-white transition-colors duration-300' />
                  </div>
                </div>
                <div className="group cursor-pointer">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-lg flex items-center justify-center hover:from-blue-500 hover:to-purple-600 transition-all duration-300 group-hover:scale-110">
                    <Mail className='w-4 h-4 text-gray-300 group-hover:text-white transition-colors duration-300' />
                  </div>
                </div>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className='font-bold mb-6 text-white text-lg'>Product</h4>
              <div className='space-y-3'>
                <div className='group flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-1'>
                  <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-blue-400' />
                  <span>Features</span>
                </div>
                <div className='group flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-1'>
                  <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-blue-400' />
                  <span>Pricing</span>
                </div>
                <div className='group flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-1'>
                  <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-blue-400' />
                  <span>API</span>
                </div>
                <div className='group flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-1'>
                  <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-blue-400' />
                  <span>Integrations</span>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className='font-bold mb-6 text-white text-lg'>Company</h4>
              <div className='space-y-3'>
                <div className='group flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-1'>
                  <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-purple-400' />
                  <span>About</span>
                </div>
                <div className='group flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-1'>
                  <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-purple-400' />
                  <span>Blog</span>
                </div>
                <div className='group flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-1'>
                  <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-purple-400' />
                  <span>Careers</span>
                </div>
                <div className='group flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-1'>
                  <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-purple-400' />
                  <span>Contact</span>
                </div>
              </div>
            </div>

            {/* Support Links */}
            <div>
              <h4 className='font-bold mb-6 text-white text-lg'>Support</h4>
              <div className='space-y-3'>
                <div className='group flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-1'>
                  <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-pink-400' />
                  <span>Help Center</span>
                </div>
                <div className='group flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-1'>
                  <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-pink-400' />
                  <span>Community</span>
                </div>
                <div className='group flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-1'>
                  <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-pink-400' />
                  <span>Status</span>
                </div>
                <div className='group flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer transition-all duration-300 hover:translate-x-1'>
                  <ArrowRight className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-pink-400' />
                  <span>Privacy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className='border-t border-white/10 pt-8'>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <span>&copy; 2025 SkillBridge Pro. All rights reserved.</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
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
