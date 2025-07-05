// components/Navbar.jsx
import React from "react";
import { Bell, MessageSquare, Code, Search } from "lucide-react";

export default function Navbar({ notifications, messages }) {
  return (
    <header className='bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center'>
              <Code className='w-5 h-5 text-white' />
            </div>
            <span className='hidden sm:inline text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
              SkillBridge Pro
            </span>
          </div>

          {/* Search Bar */}
          <div className='hidden md:flex flex-1 max-w-md mx-8'>
            <div className='relative w-full'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
              <input
                type='text'
                placeholder='Search projects, skills, or companies...'
                className='w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
          </div>

          {/* Actions */}
          <div className='flex items-center space-x-4'>
            <button className='relative p-2 rounded-lg hover:bg-white/10 transition-colors'>
              <Bell className='w-5 h-5' />
              {notifications > 0 && (
                <span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs rounded-full flex items-center justify-center'>
                  {notifications}
                </span>
              )}
            </button>
            <button className='relative p-2 rounded-lg hover:bg-white/10 transition-colors'>
              <MessageSquare className='w-5 h-5' />
              {messages > 0 && (
                <span className='absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-xs rounded-full flex items-center justify-center'>
                  {messages}
                </span>
              )}
            </button>
            <div className='flex items-center space-x-2'>
              <img
                src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
                alt='Profile'
                className='w-8 h-8 rounded-full'
              />
              <span className='hidden sm:block text-sm font-medium'>
                John Doe
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}