import React from "react";
import { Code, Github, Linkedin, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <div>
      {/* Footer */}
      <footer className='bg-black/40 backdrop-blur-sm border-t border-white/10 py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid md:grid-cols-4 gap-8'>
            <div>
              <div className='flex items-center space-x-2 mb-4'>
                <div className='w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center'>
                  <Code className='w-5 h-5 text-white' />
                </div>
                <span className='text-xl font-bold'>SkillBridge Pro</span>
              </div>
              <p className='text-gray-400 mb-4'>
                The professional platform for bridging skills to success and
                accelerating career growth.
              </p>
              <div className='flex space-x-4'>
                <Github className='w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors' />
                <Linkedin className='w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors' />
                <Mail className='w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors' />
              </div>
            </div>

            <div>
              <h4 className='font-semibold mb-4'>Product</h4>
              <div className='space-y-2 text-gray-400'>
                <div className='hover:text-white cursor-pointer transition-colors'>
                  Features
                </div>
                <div className='hover:text-white cursor-pointer transition-colors'>
                  Pricing
                </div>
                <div className='hover:text-white cursor-pointer transition-colors'>
                  API
                </div>
                <div className='hover:text-white cursor-pointer transition-colors'>
                  Integrations
                </div>
              </div>
            </div>

            <div>
              <h4 className='font-semibold mb-4'>Company</h4>
              <div className='space-y-2 text-gray-400'>
                <div className='hover:text-white cursor-pointer transition-colors'>
                  About
                </div>
                <div className='hover:text-white cursor-pointer transition-colors'>
                  Blog
                </div>
                <div className='hover:text-white cursor-pointer transition-colors'>
                  Careers
                </div>
                <div className='hover:text-white cursor-pointer transition-colors'>
                  Contact
                </div>
              </div>
            </div>

            <div>
              <h4 className='font-semibold mb-4'>Support</h4>
              <div className='space-y-2 text-gray-400'>
                <div className='hover:text-white cursor-pointer transition-colors'>
                  Help Center
                </div>
                <div className='hover:text-white cursor-pointer transition-colors'>
                  Community
                </div>
                <div className='hover:text-white cursor-pointer transition-colors'>
                  Status
                </div>
                <div className='hover:text-white cursor-pointer transition-colors'>
                  Privacy
                </div>
              </div>
            </div>
          </div>

          <div className='border-t border-white/10 mt-8 pt-8 text-center text-gray-400'>
            <p>&copy; 2025 SkillBridge Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
