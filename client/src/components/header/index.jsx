// components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Code, Menu, X, User } from "lucide-react";
import { useSelector } from "react-redux";
import { getToken } from "../../services/utils";

const Navbar = ({ onLogoutClick }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAvatarBroken, setIsAvatarBroken] = useState(false);
  const user = useSelector((state) => state.user?.user);
  const token = getToken();
  const dropdownRef = useRef(null);

  const menuItems = [
    { label: "Features", link: "#features" },
    { label: "How it Works", link: "#how-it-works" },
    { label: "Testimonials", link: "#testimonials" },
    { label: "Pricing", link: "#pricing" },
  ];

  const userDropdownItems = [
    { label: "Profile", action: () => navigate("/profile") },
    { label: "Dashboard", action: () => navigate("/dashboard") },
    { label: "Notifications", action: () => navigate("/notifications") },
    { label: "Settings", action: () => navigate("/settings") },
    { label: "Portfolio Sync", action: () => navigate("/portfolio-sync") },
    {
      label: "Logout",
      action: () => onLogoutClick(),
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className='fixed top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-sm border-b border-white/10'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center'>
              <Code className='w-5 h-5 text-white' />
            </div>
            <span className='font-bold bg-gradient-to-r from-blue-400 to-purple-400             bg-clip-text text-transparent hidden sm:inline md:text-2xl lg:text-3xl'>
              SkillBridge Pro
            </span>
          </div>

          {/* Desktop Menu */}
          <div className='hidden md:flex items-center space-x-8'>
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className='text-gray-300 hover:text-white transition-colors'
              >
                {item.label}
              </a>
            ))}

            {token ? (
              // User Avatar and Dropdown
              <div className='relative' ref={dropdownRef}>
                {!isAvatarBroken && user?.avatarUrl ? (
                  <img
                    src={user?.avatarUrl}
                    alt={user?.name}
                    className='w-10 h-10 rounded-full cursor-pointer border-2 border-white/20'
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    onError={() => setIsAvatarBroken(true)}
                  />
                ) : (
                  <div
                    className='w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer border-2 border-white/20'
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  >
                    <User className='w-6 h-6 text-white' />
                  </div>
                )}

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
            ) : (
              <>
                <button
                  onClick={() => navigate("/auth")}
                  className='text-gray-300 hover:text-white cursor-pointer transition-colors'
                >
                  Sign In
                </button>
                <button className='bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105'>
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors'
            aria-label='Toggle Menu'
          >
            {isMenuOpen ? (
              <X className='w-6 h-6' />
            ) : (
              <Menu className='w-6 h-6' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className='md:hidden bg-black/90 backdrop-blur-sm border-t border-white/10'>
          <div className='px-4 py-4 space-y-3'>
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                onClick={() => setIsMenuOpen(false)}
                className='block text-gray-300 hover:text-white transition-colors'
              >
                {item.label}
              </a>
            ))}

            {user ? (
              userDropdownItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    item.action();
                    setIsMenuOpen(false);
                  }}
                  className='block text-gray-300 hover:text-white transition-colors cursor-pointer'
                >
                  {item.label}
                </div>
              ))
            ) : (
              <>
                <button
                  className='block text-gray-300 hover:text-white transition-colors'
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/auth");
                  }}
                >
                  Sign In
                </button>
                <button className='w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-2 rounded-lg font-medium transition-all duration-300'>
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default React.memo(Navbar);
