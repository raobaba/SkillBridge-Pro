// components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Code, Menu, X, User, Bell, MessageSquare, Search } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getToken } from "../../services/utils";
import {Button,Input} from "../../components"
import { ConfirmModal } from "../index";
import { logOut } from "../../modules/authentication/slice/userSlice";
import { getNotifications, getUnreadCount } from "../../modules/notifications/slice/notificationSlice";
import { getConversations } from "../../modules/chat/slice/chatSlice";

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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);

  const token = getToken();
  const userFromRedux = useSelector((state) => state.user?.user);
  const user = userFromRedux || data;
  
  // Get notifications from Redux store
  const notificationsList = useSelector((state) => state.notifications?.notifications || []);
  const unreadCount = useSelector((state) => state.notifications?.unreadCount || 0);
  const notificationsLoading = useSelector((state) => state.notifications?.loading || false);
  
  // Get chat conversations from Redux store
  const conversationsRaw = useSelector((state) => state.chat?.conversations);
  const chatLoading = useSelector((state) => state.chat?.loading || false);
  
  // Ensure conversations is always an array
  const conversations = Array.isArray(conversationsRaw) ? conversationsRaw : [];
  
  // Calculate total unread messages count from all conversations
  // Based on API response structure: { participant: { unreadCount: number } }
  const totalUnreadMessages = conversations.reduce((total, conv) => {
    if (!conv || !conv.participant) return total;
    const unreadCount = Number(conv.participant.unreadCount) || 0;
    return total + unreadCount;
  }, 0);
  
  // Get recent conversations sorted by last message timestamp (most recent first)
  const recentConversations = conversations
    .filter(conv => conv && conv.lastMessage && !conv.participant?.isArchived)
    .sort((a, b) => {
      const timeA = new Date(a.lastMessage?.timestamp || 0).getTime();
      const timeB = new Date(b.lastMessage?.timestamp || 0).getTime();
      return timeB - timeA;
    })
    .slice(0, 5); // Show only 5 most recent
  

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

  // Fetch notifications when component mounts and user is logged in
  useEffect(() => {
    if (token && user) {
      // Fetch unread count immediately
      dispatch(getUnreadCount());
      
      // Fetch recent notifications (limit to 10 for dropdown, both read and unread)
      dispatch(getNotifications({ limit: 10 }));
      
      // Fetch conversations for messages
      dispatch(getConversations({ archived: false }));
    }
  }, [token, user, dispatch]);

  // Refresh notifications when dropdown opens
  useEffect(() => {
    if (notificationsOpen && token && user) {
      dispatch(getUnreadCount());
      dispatch(getNotifications({ limit: 10 }));
    }
  }, [notificationsOpen, token, user, dispatch]);

  // Refresh conversations when messages dropdown opens
  useEffect(() => {
    if (messagesOpen && token && user) {
      dispatch(getConversations({ archived: false }));
    }
  }, [messagesOpen, token, user, dispatch]);

  // Format date helper
  const formatNotificationDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

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
                    {unreadCount > 0 && (
                      <span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold'>
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Button>

                  {/* Notifications Panel */}
                  {notificationsOpen && (
                    <div 
                      className='absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg z-50 p-3'
                      data-dropdown-content
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-gray-200 font-semibold">Notifications</h4>
                        {unreadCount > 0 && (
                          <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
                            {unreadCount} unread
                          </span>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notificationsLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                          </div>
                        ) : notificationsList.length === 0 ? (
                          <div className="text-center py-8">
                            <Bell className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                            <p className="text-gray-400 text-sm">No notifications yet</p>
                          </div>
                        ) : (
                          notificationsList.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() => {
                                navigate(notification.actionUrl || "/notifications");
                                setNotificationsOpen(false);
                              }}
                              className={`px-3 py-2 mb-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors border-l-2 ${
                                !notification.read 
                                  ? 'bg-gray-800 border-blue-500' 
                                  : 'bg-gray-800/50 border-transparent'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium truncate ${
                                    !notification.read ? 'text-white' : 'text-gray-300'
                                  }`}>
                                    {notification.title}
                                  </p>
                                  <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  {notification.type && (
                                    <span className="inline-block mt-1 text-xs text-gray-500 bg-gray-700/50 px-2 py-0.5 rounded">
                                      {notification.type}
                                    </span>
                                  )}
                                </div>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                                )}
                              </div>
                              {notification.createdAt && (
                                <p className="text-gray-500 text-xs mt-1">
                                  {formatNotificationDate(notification.createdAt)}
                                </p>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                      {notificationsList.length > 0 && (
                        <Button
                          onClick={() => {
                            navigate("/notifications");
                            setNotificationsOpen(false);
                          }}
                          variant="ghost"
                          size="sm"
                          className="w-full mt-2 text-blue-400 hover:text-blue-500"
                        >
                          View All Notifications
                        </Button>
                      )}
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
                    {totalUnreadMessages > 0 && (
                      <span className='absolute -top-1 -right-1 min-w-[20px] h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-semibold px-1.5'>
                        {totalUnreadMessages > 99 ? '99+' : totalUnreadMessages}
                      </span>
                    )}
                  </Button>

                  {messagesOpen && (
                    <div 
                      className='absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg z-50 p-3'
                      data-dropdown-content
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-gray-200 font-semibold">Messages</h4>
                        {totalUnreadMessages > 0 && (
                          <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
                            {totalUnreadMessages} unread
                          </span>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {chatLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                          </div>
                        ) : recentConversations.length === 0 ? (
                          <div className="text-center py-8">
                            <MessageSquare className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                            <p className="text-gray-400 text-sm">No messages yet</p>
                          </div>
                        ) : (
                          recentConversations.map((conversation) => {
                            const unreadCount = conversation.participant?.unreadCount || 0;
                            const lastMessage = conversation.lastMessage;
                            const isUnread = unreadCount > 0;
                            
                            return (
                              <div
                                key={conversation.id}
                                onClick={() => {
                                  navigate(`/chat?conversation=${conversation.id}`);
                                  setMessagesOpen(false);
                                }}
                                className={`px-3 py-2 mb-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors border-l-2 ${
                                  isUnread 
                                    ? 'bg-gray-800 border-blue-500' 
                                    : 'bg-gray-800/50 border-transparent'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className={`text-sm font-medium truncate ${
                                        isUnread ? 'text-white' : 'text-gray-300'
                                      }`}>
                                        {conversation.name || 'Unknown User'}
                                      </p>
                                      {conversation.type === 'group' && (
                                        <span className="text-xs text-gray-500 bg-gray-700/50 px-1.5 py-0.5 rounded">
                                          Group
                                        </span>
                                      )}
                                    </div>
                                    {lastMessage && (
                                      <>
                                        <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                                          {lastMessage.content}
                                        </p>
                                        <p className="text-gray-500 text-xs mt-1">
                                          {formatNotificationDate(lastMessage.timestamp)}
                                        </p>
                                      </>
                                    )}
                                  </div>
                                  {isUnread && (
                                    <div className="flex flex-col items-end gap-1">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                                      {unreadCount > 1 && (
                                        <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                          {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                      {recentConversations.length > 0 && (
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
                      )}
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
