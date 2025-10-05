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
import ConfirmModal from "../modal/ConfirmModal";
import { logOut } from "../../modules/authentication/slice/userSlice";
import { useDispatch } from "react-redux";
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

  // Mock data for notifications and messages
  const [notifications] = useState(4);
  const [messages] = useState(1);

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
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
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
            <Link to="/dashboard" className="flex items-center space-x-2 cursor-pointer">
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
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs rounded-full flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </Button>

                {isNotificationsOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg z-50 p-3"
                    data-dropdown-content
                  >
                    <h4 className="text-gray-200 font-semibold mb-2">Notifications</h4>
                    <div className="max-h-64 overflow-y-auto">
                      {[...Array(notifications)].map((_, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            navigate("/notifications");
                            setIsNotificationsOpen(false);
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
                        setIsNotificationsOpen(false);
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
              <div className="relative dropdown-container">
                <Button
                  variant="ghost"
                  size="md"
                  className="relative p-2 rounded-lg"
                  onClick={() => toggleDropdown('messages')}
                >
                  <MessageSquare className="w-5 h-5" />
                  {messages > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-xs rounded-full flex items-center justify-center">
                      {messages}
                    </span>
                  )}
                </Button>

                {isMessagesOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg z-50 p-3"
                    data-dropdown-content
                  >
                    <h4 className="text-gray-200 font-semibold mb-2">Messages</h4>
                    <div className="max-h-64 overflow-y-auto">
                      {[...Array(messages)].map((_, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            navigate("/chat");
                            setIsMessagesOpen(false);
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
                        setIsMessagesOpen(false);
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
                        console.log('Avatar image failed to load:', user?.avatarUrl);
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
                  className={`p-3 rounded-lg transition-all duration-200 hover:scale-105 ${
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
