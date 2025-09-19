import React, { useState, useMemo } from "react";
import Navbar from "../../../components/header";
import { 
  CheckCircle, 
  Bell, 
  Zap, 
  Code, 
  FileText, 
  User, 
  Shield, 
  Trash2, 
  Filter, 
  Search, 
  SortAsc, 
  SortDesc,
  MoreVertical,
  Archive,
  Star,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Badge, Button } from "../../../components";
import { Footer } from "../../../components";
import { useSelector } from "react-redux";

export default function NotificationsPage() {
  const user = useSelector((state) => state.user?.user);
  const [list, setList] = useState([
    {
      id: 1,
      type: "Project",
      title: "New Project Assigned",
      message: "You have been assigned to the AI Dashboard project. This is an exciting opportunity to work with cutting-edge technology.",
      read: false,
      priority: "high",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      category: "assignment"
    },
    {
      id: 2,
      type: "Profile",
      title: "Profile Update Reminder",
      message: "Update your skills to improve match accuracy and get better project recommendations.",
      read: false,
      priority: "medium",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      category: "reminder"
    },
    {
      id: 3,
      type: "XP",
      title: "Weekly XP Report",
      message: "You earned 150 XP this week. Keep going! You're on track to reach the next level.",
      read: true,
      priority: "low",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      category: "achievement"
    },
    {
      id: 4,
      type: "AI",
      title: "Resume Enhancement Available",
      message: "AI has suggested improvements for your resume. Review the suggestions to boost your profile.",
      read: false,
      priority: "high",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      category: "suggestion"
    },
    {
      id: 5,
      type: "Security",
      title: "Login from New Device",
      message: "We detected a login from a new device. If this wasn't you, please secure your account.",
      read: false,
      priority: "high",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      category: "security"
    },
    {
      id: 6,
      type: "Project",
      title: "Project Deadline Reminder",
      message: "The AI Dashboard project deadline is approaching. Make sure to submit your work on time.",
      read: true,
      priority: "medium",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      category: "reminder"
    }
  ]);

  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showArchived, setShowArchived] = useState(false);

  const handleMarkRead = (id) => {
    setList((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleMarkAllRead = () => {
    setList((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const handleDeleteNotification = (id) => {
    setList((prev) => prev.filter((notif) => notif.id !== id));
  };

  const handleToggleSelection = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(notifId => notifId !== id)
        : [...prev, id]
    );
  };

  const handleBulkAction = (action) => {
    if (action === "markRead") {
      setList(prev => prev.map(notif => 
        selectedNotifications.includes(notif.id) 
          ? { ...notif, read: true }
          : notif
      ));
    } else if (action === "delete") {
      setList(prev => prev.filter(notif => !selectedNotifications.includes(notif.id)));
    }
    setSelectedNotifications([]);
  };

  const filteredAndSortedList = useMemo(() => {
    let filtered = list.filter(notif => {
      const matchesTab = activeTab === "All" || notif.type === activeTab;
      const matchesSearch = searchQuery === "" || 
        notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notif.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesArchived = showArchived ? notif.read : !notif.read;
      
      return matchesTab && matchesSearch && matchesArchived;
    });

    // Sort notifications
    filtered.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });

    return filtered;
  }, [list, activeTab, searchQuery, sortBy, showArchived]);

  const typeIcon = (type) => {
    switch (type) {
      case "Project":
        return <FileText className='w-5 h-5 text-blue-400' />;
      case "XP":
        return <Zap className='w-5 h-5 text-yellow-400' />;
      case "AI":
        return <Code className='w-5 h-5 text-green-400' />;
      case "Profile":
        return <User className='w-5 h-5 text-purple-400' />;
      case "Security":
        return <Shield className='w-5 h-5 text-red-400' />;
      default:
        return <Bell className='w-5 h-5 text-gray-400' />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "medium": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "low": return "text-green-400 bg-green-400/10 border-green-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const tabs = ["All", "Project", "XP", "AI", "Profile", "Security"];
  const unreadCount = list.filter(notif => !notif.read).length;

  return (
    <>
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
        <Navbar data={user} isSearchBar={false} />

        <div className='max-w-6xl mx-auto px-4 py-6 sm:py-8'>
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 mb-6">
            <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <Bell className='w-8 h-8 text-white' />
                </div>
                <div>
                  <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                    Notifications
                  </h1>
                  <p className="text-gray-300 text-sm">
                    {unreadCount} unread notifications
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  variant='outline'
                  onClick={handleMarkAllRead}
                  className="hover:scale-105 transition-transform duration-300"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowArchived(!showArchived)}
                  className="hover:scale-105 transition-transform duration-300"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  {showArchived ? "Show Active" : "Show Archived"}
                </Button>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="hover:scale-105 transition-transform duration-300"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="priority">By Priority</option>
                </select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedNotifications.length > 0 && (
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 text-sm">
                    {selectedNotifications.length} notification(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleBulkAction("markRead")}
                      className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Mark Read
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkAction("delete")}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Tabs */}
          <div className='flex flex-wrap gap-2 mb-6'>
            {tabs.map((tab) => {
              const count = tab === "All" 
                ? list.filter(n => showArchived ? n.read : !n.read).length
                : list.filter(n => n.type === tab && (showArchived ? n.read : !n.read)).length;
              
              return (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "outline"}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm hover:scale-105 transition-all duration-300 ${
                    activeTab === tab 
                      ? "bg-gradient-to-r from-blue-500 to-purple-500" 
                      : ""
                  }`}
                >
                  {tab}
                  {count > 0 && (
                    <Badge className="ml-2 text-xs">
                      {count}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>

          {/* Enhanced Notification List */}
          <div className='space-y-4'>
            {filteredAndSortedList.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className='text-gray-400 text-lg'>No notifications found</p>
                <p className="text-gray-500 text-sm mt-2">
                  {searchQuery ? "Try adjusting your search terms" : "You're all caught up!"}
                </p>
              </div>
            ) : (
              filteredAndSortedList.map((notif) => (
                <div
                  key={notif.id}
                  className={`bg-white/5 border border-white/10 rounded-xl p-5 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02] group ${
                    notif.read ? "opacity-60" : "opacity-100"
                  } ${selectedNotifications.includes(notif.id) ? "ring-2 ring-blue-500" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notif.id)}
                      onChange={() => handleToggleSelection(notif.id)}
                      className="mt-1 w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                    />

                    {/* Icon with Priority Indicator */}
                    <div className="relative">
                      <div className={`p-3 rounded-xl bg-gradient-to-r from-slate-700 to-slate-600 group-hover:scale-110 transition-transform duration-300`}>
                        {typeIcon(notif.type)}
                      </div>
                      {!notif.read && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                              {notif.title}
                            </h3>
                            <Badge className={getPriorityColor(notif.priority)}>
                              {notif.priority}
                            </Badge>
                            <Badge variant="outline">{notif.type}</Badge>
                          </div>
                          
                          <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                            {notif.message}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {getTimeAgo(notif.createdAt)}
                            </div>
                            <span className="capitalize">{notif.category}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {!notif.read && (
                            <Button
                              size="sm"
                              onClick={() => handleMarkRead(notif.id)}
                              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:scale-105 transition-all duration-300"
                            >
                              <CheckCircle className='w-4 h-4 mr-1' />
                              Mark Read
                            </Button>
                          )}
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteNotification(notif.id)}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:scale-105 transition-all duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
