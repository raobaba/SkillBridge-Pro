// components/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Bell, MessageSquare, Code, Search, User } from "lucide-react";
import Button from "../Button";
import Input from "../Input";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({
  notifications,
  messages,
  data,
  isSearchBar = true,
  onLogoutClick,
}) {
  const [isAvatarBroken, setIsAvatarBroken] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const userDropdownItems = [
    { label: "Profile", action: () => navigate("/profile") },
    { label: "Dashboard", action: () => navigate("/dashboard") },
    { label: "Notifications", action: () => navigate("/notifications") },
    { label: "Settings", action: () => navigate("/settings") },
    { label: "Portfolio Sync", action: () => navigate("/portfolio-sync") },
    { label: "Logout", action: () => onLogoutClick?.() },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className='bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo + Text */}
          <Link to='/' className='flex items-center space-x-2 cursor-pointer'>
            <div className='w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center'>
              <Code className='w-5 h-5 text-white' />
            </div>
            <span className='font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hidden sm:inline md:text-2xl lg:text-3xl'>
              SkillBridge Pro
            </span>
          </Link>

          {/* Search Bar */}
          {isSearchBar && (
            <div className='hidden md:flex flex-1 max-w-md mx-8'>
              <Input
                type='text'
                placeholder='Search projects, skills, or companies...'
                value={""} // replace with state variable
                onChange={(e) => setSearchValue(e.target.value)} // replace with handler
                leftIcon={Search}
                className='w-full'
              />
            </div>
          )}

          {/* Actions */}
          <div className='flex items-center space-x-4'>
            {/* Notifications */}
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

            {/* Messages */}
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

            {/* Avatar + Dropdown */}
            <div className='relative' ref={dropdownRef}>
              <div
                className='flex items-center gap-2 cursor-pointer'
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              >
                {!isAvatarBroken && data?.avatarUrl ? (
                  <img
                    src={data?.avatarUrl}
                    alt={data?.name || "Profile"}
                    className='w-8 h-8 rounded-full border-2 border-white/20'
                    onError={() => setIsAvatarBroken(true)}
                  />
                ) : (
                  <div className='w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center border-2 border-white/20'>
                    <User className='w-5 h-5 text-white' />
                  </div>
                )}

                <span className='hidden sm:block text-sm font-medium'>
                  {data?.name}
                </span>
              </div>

              {isUserDropdownOpen && (
                <div className='absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg z-50'>
                  {userDropdownItems.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        item.action();
                        setIsUserDropdownOpen(false);
                      }}
                      className='px-4 py-2 text-gray-300 hover:bg-white/10 cursor-pointer transition-colors'
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
