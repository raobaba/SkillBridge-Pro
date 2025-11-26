import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Home,
  User,
  Bell,
  Settings,
  Database,
  Briefcase,
  Target,
  Trophy,
  MessageSquare,
  CreditCard,
  Brain,
  Menu,
  X,
  ChevronDown,
  LogOut,
  BarChart3,
  Users,
  Plus,
  Search,
  Filter,
  Calendar,
  FileText,
  Shield,
  Zap,
  Code,
  GitBranch,
  Star,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle,
  Eye,
  ExternalLink,
} from "lucide-react";
import {Button,Input} from "../../components"
import { ConfirmModal } from "../index";
import { logOut } from "../../modules/authentication/slice/userSlice";
import { useDispatch } from "react-redux";
import { getToken } from "../../services/utils";
import { getNotifications, getUnreadCount } from "../../modules/notifications/slice/notificationSlice";
import { getConversations } from "../../modules/chat/slice/chatSlice";
import { 
  getNavigationItems, 
  getQuickAccessItems, 
  getHomeNavItems 
} from "../../modules/home/homeNavigationConfig.js";

const Navigation = ({ isHome = false, isSearchBar = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user, (prev, next) => {
    // Only re-render if user data actually changed
    if (!prev && !next) return true;
    if (!prev || !next) return false;
    return prev.id === next.id && prev.email === next.email && prev.name === next.name;
  });
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState(null);
  const [isAvatarBroken, setIsAvatarBroken] = useState(false);

  // Get notifications from Redux store
  const token = getToken();
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

  // Get navigation items using the configuration (memoized)
  const navigationItems = useMemo(() => 
    getNavigationItems(user?.role), 
    [user?.role]
  );

  // Get quick access items using the configuration (memoized)
  const quickAccessItems = useMemo(() => 
    getQuickAccessItems(user?.role), 
    [user?.role]
  );

  const handleLogout = async () => {
    try {
      await dispatch(logOut());
    } finally {
      dispatch({ type: "signin/logout" });
      navigate("/");
    }
  };

  // Helper function to toggle dropdowns with better UX
  const toggleDropdown = (dropdownType) => {
    // Clear any existing timeout
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }

    // Close all other dropdowns first
    setIsUserDropdownOpen(false);
    setIsNotificationsOpen(false);
    setIsMessagesOpen(false);

    // Open the requested dropdown
    switch (dropdownType) {
      case 'user':
        setIsUserDropdownOpen(true);
        break;
      case 'notifications':
        setIsNotificationsOpen(true);
        break;
      case 'messages':
        setIsMessagesOpen(true);
        break;
      default:
        break;
    }
  };

  const isActivePath = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

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
    if (isNotificationsOpen && token && user) {
      dispatch(getUnreadCount());
      dispatch(getNotifications({ limit: 10 }));
    }
  }, [isNotificationsOpen, token, user, dispatch]);

  // Refresh conversations when messages dropdown opens
  useEffect(() => {
    if (isMessagesOpen && token && user) {
      dispatch(getConversations({ archived: false }));
    }
  }, [isMessagesOpen, token, user, dispatch]);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside dropdown containers
      const isOutsideDropdown = !event.target.closest('.dropdown-container') && 
                                !event.target.closest('[data-dropdown-content]');
      
      if (isOutsideDropdown) {
        setIsUserDropdownOpen(false);
        setIsNotificationsOpen(false);
        setIsMessagesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Cleanup timeout on unmount
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  if (isHome) {
    // Home page navigation (simplified)
    return (
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hidden sm:inline md:text-2xl lg:text-3xl">
                SkillBridge Pro
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              {getHomeNavItems().map((item, index) => (
                <a 
                  key={index}
                  href={item.href} 
                  className="text-gray-300 hover:text-white transition-colors"
                  title={item.description}
                >
                  {item.label}
                </a>
              ))}
              
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => navigate(user ? "/dashboard" : "/auth")}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-2 rounded-lg font-medium transition-all duration-300"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>

            {/* Mobile menu button */}
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              variant="ghost"
              size="sm"
              className="md:hidden p-2 hover:bg-gray-700/50"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-black/90 backdrop-blur-sm border-t border-white/10">
              <div className="px-4 py-4 space-y-3">
                {getHomeNavItems().map((item, index) => (
                  <a 
                    key={index}
                    href={item.href} 
                    className="block text-gray-300 hover:text-white transition-colors"
                    title={item.description}
                  >
                    {item.label}
                  </a>
                ))}
                
                <Button
                  onClick={() => {
                    navigate(user ? "/dashboard" : "/auth");
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-2 rounded-lg font-medium transition-all duration-300"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>
    );
  }

  // Main application navigation
  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hidden sm:inline md:text-2xl lg:text-3xl">
                SkillBridge Pro
              </span>
            </Link>

            {/* Search Bar */}
            {isSearchBar && (
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <Input
                  type="text"
                  placeholder="Search projects, skills, or companies..."
                  leftIcon={Search}
                  className="w-full bg-white/10 border-white/20 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Right side navigation */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative dropdown-container">
                <Button
                  variant="ghost"
                  size="md"
                  className="relative p-2 rounded-lg"
                  onClick={() => toggleDropdown('notifications')}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Button>

                {isNotificationsOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg z-50 p-3"
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
                            setIsNotificationsOpen(false);
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
                        setIsNotificationsOpen(false);
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
              <div className="relative dropdown-container">
                <Button
                  variant="ghost"
                  size="md"
                  className="relative p-2 rounded-lg"
                  onClick={() => toggleDropdown('messages')}
                >
                  <MessageSquare className="w-5 h-5" />
                  {totalUnreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-semibold px-1.5">
                      {totalUnreadMessages > 99 ? '99+' : totalUnreadMessages}
                    </span>
                  )}
                </Button>

                {isMessagesOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg z-50 p-3"
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
                                setIsMessagesOpen(false);
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
                          setIsMessagesOpen(false);
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

              {/* User Dropdown */}
              <div className="relative dropdown-container">
                <Button
                  variant="ghost"
                  className="group flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10"
                  onClick={() => toggleDropdown('user')}
                >
                  {!isAvatarBroken && user?.avatarUrl ? (
                    <img
                      src={user?.avatarUrl}
                      alt={user?.name || "Profile"}
                      className="w-8 h-8 rounded-full border-2 border-white/20"
                      onError={() => {
                      
                        setIsAvatarBroken(true);
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-gray-200 group-hover:text-white">
                    {user?.name || "User"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-white" />
                </Button>

                {isUserDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-black/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50 p-1"
                    data-dropdown-content
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-medium text-white">{user?.name || "User"}</p>
                      <p className="text-xs text-gray-400">{user?.email || "user@example.com"}</p>
                      <p className="text-xs text-blue-400 capitalize">{user?.role || "developer"}</p>
                    </div>

                    {/* Navigation Items */}
                    <div className="py-2 space-y-1">
                      {navigationItems.slice(0, 6).map((item, index) => (
                        <Button
                          key={index}
                          onClick={() => {
                            navigate(item.path);
                            setIsUserDropdownOpen(false);
                          }}
                          variant="ghost"
                          className={`w-full justify-start px-3 py-2 text-sm flex items-center space-x-3 rounded-lg ${
                            isActivePath(item.path)
                              ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                              : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Button>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/10 my-2"></div>

                    {/* Logout */}
                    <Button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        setIsLogoutOpen(true);
                      }}
                      variant="ghost"
                      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center space-x-3 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Navigation for larger screens */}
      <div className="hidden lg:block fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-black/20 backdrop-blur-sm border-r border-white/10 overflow-y-auto sidebar-scrollbar">
        <div className="p-4 space-y-2">
          {/* Quick Access */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Quick Access
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {quickAccessItems.map((item, index) => (
                <Button
                  key={index}
                  onClick={() => navigate(item.path)}
                  variant="ghost"
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    item.color === 'blue' ? 'bg-blue-500/20 hover:bg-blue-500/30' :
                    item.color === 'green' ? 'bg-green-500/20 hover:bg-green-500/30' :
                    item.color === 'purple' ? 'bg-purple-500/20 hover:bg-purple-500/30' :
                    'bg-yellow-500/20 hover:bg-yellow-500/30'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mx-auto mb-1 ${
                    item.color === 'blue' ? 'text-blue-400' :
                    item.color === 'green' ? 'text-green-400' :
                    item.color === 'purple' ? 'text-purple-400' :
                    'text-yellow-400'
                  }`} />
                  <p className="text-xs font-medium text-white text-center">{item.label}</p>
                </Button>
              ))}
            </div>
          </div>

          {/* Main Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Navigation
            </h3>
            <div className="space-y-1">
              {navigationItems.map((item, index) => (
                <Button
                  key={index}
                  onClick={() => navigate(item.path)}
                  variant="ghost"
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-3 ${
                    isActivePath(item.path)
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "text-gray-300 hover:bg-gray-700/50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-white/10">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navigationItems.slice(0, 5).map((item, index) => (
            <Button
              key={index}
              onClick={() => navigate(item.path)}
              variant="ghost"
              className={`flex flex-col items-center py-2 px-1 rounded-lg ${
                isActivePath(item.path)
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={isLogoutOpen}
        title="Logout"
        message="Are you sure you want to logout?"
        onCancel={() => setIsLogoutOpen(false)}
        onConfirm={() => {
          setIsLogoutOpen(false);
          handleLogout();
        }}
      />
    </>
  );
};

export default Navigation;
