// components/Navbar.jsx
import React from "react";
import { Bell, MessageSquare, Code, Search } from "lucide-react";
import Button from "../Button";
import Input from "../Input";
import { Link } from "react-router-dom";

export default function Navbar({
  notifications,
  messages,
  data,
  isSearchBar = true,
}) {
  return (
    <header className='bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo + Text (Redirect to Home) */}
          <Link to='/' className='flex items-center space-x-2 cursor-pointer'>
            <div className='w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center'>
              <Code className='w-5 h-5 text-white' />
            </div>
            <span className='font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hidden sm:inline md:text-2xl lg:text-3xl'>
              SkillBridge Pro
            </span>
          </Link>

          {isSearchBar && (
            <div className='hidden md:flex flex-1 max-w-md mx-8'>
              <Input
                type='text'
                placeholder='Search projects, skills, or companies...'
                value={""} // replace with your state variable
                onChange={(e) => setSearchValue(e.target.value)} // replace with your handler
                leftIcon={Search} // your Search icon
                className='w-full'
              />
            </div>
          )}

          {/* Actions */}
          <div className='flex items-center space-x-4'>
            <Button
              variant='ghost'
              size='md'
              className='relative p-2 rounded-lg'
            >
              <Bell className='w-5 h-5' />
              {notifications > 0 && (
                <span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs rounded-full flex items-center justify-center'>
                  {notifications}
                </span>
              )}
            </Button>

            <Button
              variant='ghost'
              size='md'
              className='relative p-2 rounded-lg'
            >
              <MessageSquare className='w-5 h-5' />
              {messages > 0 && (
                <span className='absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-xs rounded-full flex items-center justify-center'>
                  {messages}
                </span>
              )}
            </Button>

            <div className='flex items-center space-x-2'>
              <img
                src={data?.avatarUrl}
                alt='Profile'
                className='w-8 h-8 rounded-full'
              />
              <span className='hidden sm:block text-sm font-medium'>
                {data?.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
