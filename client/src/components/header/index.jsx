// components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Code, Menu, X, User, Bell, MessageSquare, Search } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getToken } from "../../services/utils";
import {Button,Input} from "../../components"
import ConfirmModal from "../modal/ConfirmModal";
import { logOut } from "../../modules/authentication/slice/userSlice";

const Navbar = ({
  onLogoutClick,
  data = null,
  isSearchBar = false,
  isHome = false,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAvatarBroken, setIsAvatarBroken] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownRefHome = useRef(null);
  const dropdownRefApp = useRef(null);
  const notificationsRef = useRef(null);
  const messagesRef = useRef(null);
  const [notifications, setNotifications] = useState(4);
  const [messages, setMessages] = useState(1);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [expandedMessageIndex, setExpandedMessageIndex] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [messagesList, setMessagesList] = useState(
    Array(messages)
      .fill("")
      .map((_, i) => ({
        id: i + 1,
        text: `Preview content for message ${i + 1}`,
        fullText: `This is the full detailed message content of message ${i + 1}. It contains all the important details you need to know. Here we describe the message context, relevant instructions, and additional information to ensure clarity and understanding. You can read, reply, or take necessary actions based on this content.`,
        sender: "User",
      }))
  );

  const token = getToken();
  const userFromRedux = useSelector((state) => state.user?.user);
  const user = userFromRedux || data;
  

  const homeMenuItems = [
    { label: "Features", link: "#features" },
    { label: "How it Works", link: "#how-it-works" },
    { label: "Testimonials", link: "#testimonials" },
    { label: "Pricing", link: "#pricing" },
  ];

  const doLogout = async () => {
    try {
      await dispatch(logOut());
    } finally {
      dispatch({ type: "signin/logout" });
      navigate("/");
    }
  };

  // Function to close all dropdowns
  const closeAllDropdowns = () => {
    setIsUserDropdownOpen(false);
    setIsNotificationsOpen(false);
    setIsMessagesOpen(false);
    setIsMenuOpen(false);
  };

  // Function to open user dropdown and close others
  const handleUserDropdownToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle user dropdown
    if (isUserDropdownOpen) {
      setIsUserDropdownOpen(false);
    } else {
      toggleDropdown('user');
    }
  };

  // Helper function to toggle dropdowns with better UX
  const toggleDropdown = (dropdownType) => {
    // Close all other dropdowns first
    setIsUserDropdownOpen(false);
    setNotificationsOpen(false);
    setMessagesOpen(false);
    setIsMenuOpen(false);

    // Open the requested dropdown
    switch (dropdownType) {
      case 'user':
        setIsUserDropdownOpen(true);
        break;
      case 'notifications':
        setNotificationsOpen(true);
        break;
      case 'messages':
        setMessagesOpen(true);
        break;
      default:
        break;
    }
  };

  const userDropdownItems = [
    { label: "Profile", action: () => navigate("/profile") },
    { label: "Dashboard", action: () => navigate("/dashboard") },
    { label: "Notifications", action: () => navigate("/notifications") },
    { label: "Settings", action: () => navigate("/settings") },
    { label: "Portfolio Sync", action: () => navigate("/portfolio-sync") },
    { label: "Logout", action: () => setIsLogoutOpen(true) },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is on dropdown content - if so, don't close
      if (event.target.closest('[data-dropdown-content]')) {
        return;
      }
      
      // Check if click is outside any dropdown
      const isOutsideHome = !dropdownRefHome.current || !dropdownRefHome.current.contains(event.target);
      const isOutsideApp = !dropdownRefApp.current || !dropdownRefApp.current.contains(event.target);
      
      // Close user dropdown if click is outside both (or if both refs don't exist)
      if (isOutsideHome && isOutsideApp) {
        setIsUserDropdownOpen(false);
      }
      
      // Close notifications panel
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
      // Close messages panel
      if (messagesRef.current && !messagesRef.current.contains(event.target)) {
        setMessagesOpen(false);
      }
    };

    // Use mousedown instead of click to avoid conflicts
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-sm border-b border-white/10 ${
        !isHome ? "sticky" : ""
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link to='/' className='flex items-center space-x-2 cursor-pointer'>
            <div className='w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center'>
              <Code className='w-5 h-5 text-white' />
            </div>
            <span className='font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hidden sm:inline md:text-2xl lg:text-3xl'>
              SkillBridge Pro
            </span>
          </Link>

          {/* Desktop Menu (Home only) */}
          {isHome && (
            <div className='hidden md:flex flex-1 justify-end items-center space-x-6'>
              {homeMenuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  {item.label}
                </a>
              ))}

              {/* Avatar on far right */}
              {token && (
                <div className='relative ml-4 hidden sm:block'>
                  <div
                    ref={dropdownRefHome}
                    onClick={handleUserDropdownToggle}
                    className='cursor-pointer'
                  >
                    {!isAvatarBroken && user?.avatarUrl ? (
                      <img
                        src={user?.avatarUrl}
                        alt={user?.name || "Profile"}
                        className='w-8 h-8 rounded-full border-2 border-white/20'
                        onError={() => setIsAvatarBroken(true)}
                      />
                    ) : (
                      <div className='w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center border-2 border-white/20'>
                        <User className='w-5 h-5 text-white' />
                      </div>
                    )}
                  </div>
                  
                  {/* Dropdown positioned relative to the outer container */}
                  {isUserDropdownOpen && (
                    <div 
                      className='absolute right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg z-50 p-1'
                      style={{ 
                        maxWidth: 'min(12rem, calc(100vw - 2rem))',
                        right: '0',
                        left: 'auto'
                      }}
                      data-dropdown-content
                    >
                      {userDropdownItems.map((item, index) => (
                        <div
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            item.action();
                            setIsUserDropdownOpen(false);
                          }}
                          className='w-full cursor-pointer px-3 py-2 text-gray-300 hover:bg-gray-700/50 hover:text-white text-sm font-normal rounded'
                        >
                          {item.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Auth Buttons if not logged in */}
              {!token && (
                <>
                  <Button
                    onClick={() => navigate("/auth")}
                    variant="ghost"
                    className='text-gray-300 hover:text-white'
                  >
                    Sign In
                  </Button>
                  <Button 
                    className='bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105'
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Other Navbar: Search + notifications + messages + avatar */}
          {!isHome && (
            <>
              {isSearchBar && (
                <div className='hidden md:flex flex-1 max-w-md mx-8'>
                  <Input
                    type='text'
                    placeholder='Search projects, skills, or companies...'
                    value={""} // replace with state variable
                    onChange={() => {}} // replace with handler
                    leftIcon={Search}
                    className='w-full'
                  />
                </div>
              )}
              <div className='flex items-center space-x-4'>
                {/* Notifications */}
                <div className='relative' ref={notificationsRef}>
                  <Button
                    variant='ghost'
                    size='md'
                    className='relative p-2 rounded-lg'
                    onClick={() => toggleDropdown('notifications')}
                  >
                    <Bell className='w-5 h-5' />
                    {notifications > 0 && (
                      <span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs rounded-full flex items-center justify-center'>
                        {notifications}
                      </span>
                    )}
                  </Button>

                  {/* Notifications Panel */}
                  {notificationsOpen && (
                    <div 
                      className='absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg z-50 p-3'
                      data-dropdown-content
                    >
                      <h4 className="text-gray-200 font-semibold mb-2">Notifications</h4>
                      <div className="max-h-64 overflow-y-auto">
                        {[...Array(notifications)].map((_, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              navigate("/notifications");
                              setNotificationsOpen(false);
                            }}
                            className="px-3 py-2 mb-2 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                          >
                            <p className="text-gray-300 text-sm">Notification {index + 1}</p>
                            <p className="text-gray-400 text-xs">Details of the notification...</p>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={() => {
                          navigate("/notifications");
                          setNotificationsOpen(false);
                        }}
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2 text-blue-400 hover:text-blue-500"
                      >
                        View All
                      </Button>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className='relative' ref={messagesRef}>
                  <Button
                    variant='ghost'
                    size='md'
                    className='relative p-2 rounded-lg'
                    onClick={() => toggleDropdown('messages')}
                  >
                    <MessageSquare className='w-5 h-5' />
                    {messages > 0 && (
                      <span className='absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-xs rounded-full flex items-center justify-center'>
                        {messages}
                      </span>
                    )}
                  </Button>

                  {messagesOpen && (
                    <div 
                      className='absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg z-50 p-3'
                      data-dropdown-content
                    >
                      <h4 className="text-gray-200 font-semibold mb-2">Messages</h4>
                      <div className="max-h-64 overflow-y-auto">
                        {[...Array(messages)].map((_, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              navigate("/chat");
                              setMessagesOpen(false);
                            }}
                            className="px-3 py-2 mb-2 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                          >
                            <p className="text-gray-300 text-sm">Message {index + 1}</p>
                            <p className="text-gray-400 text-xs">Preview content...</p>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={() => {
                          navigate("/chat");
                          setMessagesOpen(false);
                        }}
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2 text-blue-400 hover:text-blue-500"
                      >
                        View All Messages
                      </Button>
                    </div>
                  )}
                </div>

                {/* Avatar + Username */}
                <div className='relative flex items-center'>
                  <div
                    ref={dropdownRefApp}
                    onClick={handleUserDropdownToggle}
                    className='flex items-center cursor-pointer'
                  >
                    {!isAvatarBroken && user?.avatarUrl ? (
                      <img
                        src={user?.avatarUrl}
                        alt={user?.name || "Profile"}
                        className='w-10 h-10 rounded-full border-2 border-white/20'
                        onError={() => setIsAvatarBroken(true)}
                      />
                    ) : (
                      <div className='w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border-2 border-white/20'>
                        <User className='w-6 h-6 text-white' />
                      </div>
                    )}

                  </div>

                  {/* User Dropdown positioned relative to the outer container */}
                  {isUserDropdownOpen && (
                    <div 
                      className='absolute right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg z-50 p-1'
                      data-dropdown-content
                      style={{ 
                        maxWidth: 'min(12rem, calc(100vw - 2rem))',
                        right: '0',
                        left: 'auto'
                      }}
                    >
                      {userDropdownItems.map((item, index) => (
                        <div
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            item.action();
                            setIsUserDropdownOpen(false);
                          }}
                          className='w-full cursor-pointer px-3 py-2 text-gray-300 hover:bg-gray-700/50 hover:text-white text-sm font-normal rounded'
                        >
                          {item.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Mobile Menu Toggle for Home */}
          {isHome && (
            <Button
              onClick={() => {
                closeAllDropdowns();
                setIsMenuOpen(true);
              }}
              variant="ghost"
              size="sm"
              className='md:hidden p-2 hover:bg-gray-700/50'
              aria-label='Toggle Menu'
            >
              {isMenuOpen ? (
                <X className='w-6 h-6' />
              ) : (
                <Menu className='w-6 h-6' />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu for Home */}
      {isHome && isMenuOpen && (
        <div className='md:hidden bg-black/90 backdrop-blur-sm border-t border-white/10'>
          <div className='px-4 py-4 space-y-3'>
            {homeMenuItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                onClick={() => setIsMenuOpen(false)}
                className='block text-gray-300 hover:text-white transition-colors'
              >
                {item.label}
              </a>
            ))}

            {token ? (
              userDropdownItems.map((item, index) => (
                <Button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    item.action();
                    setIsMenuOpen(false);
                  }}
                  variant="ghost"
                  className='w-full justify-start text-gray-300 hover:text-white text-sm font-normal'
                >
                  {item.label}
                </Button>
              ))
            ) : (
              <>
                <Button
                  variant="ghost"
                  className='block text-gray-300 hover:text-white'
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/auth");
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  className='w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
    {/* Global Logout Confirm Modal */}
    <ConfirmModal
      isOpen={isLogoutOpen}
      title="Logout"
      message="Are you sure you want to logout?"
      onCancel={() => setIsLogoutOpen(false)}
      onConfirm={() => {
        setIsLogoutOpen(false);
        doLogout();
      }}
    />
    </>
  );
};

export default React.memo(Navbar);
