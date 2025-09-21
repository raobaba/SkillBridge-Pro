import React, { useState, useMemo } from "react";
import { 
  Bell, 
  Briefcase, 
  MessageCircle, 
  Star, 
  Clock, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Archive,
  Calendar,
  Award,
  Users,
  TrendingUp,
  Target,
  Zap
} from "lucide-react";
import { Badge, Button } from "../../../components";
import { motion } from "framer-motion";

const DeveloperNotifications = ({ user }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "Project Match",
      title: "New Project Match Found",
      message: "We found 3 new projects that match your React and Node.js skills. Check them out!",
      read: false,
      priority: "high",
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      category: "match",
      action: "View Projects"
    },
    {
      id: 2,
      type: "Application Update",
      title: "Application Status Update",
      message: "Your application for 'E-commerce Platform Development' has been reviewed. The project owner wants to schedule an interview.",
      read: false,
      priority: "high",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      category: "application",
      action: "Schedule Interview"
    },
    {
      id: 3,
      type: "Invitation",
      title: "Project Invitation",
      message: "Sarah Johnson invited you to join the 'AI Chatbot Development' project. You have 48 hours to respond.",
      read: false,
      priority: "medium",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      category: "invitation",
      action: "Respond"
    },
    {
      id: 4,
      type: "Task Deadline",
      title: "Task Deadline Reminder",
      message: "Your task 'Implement user authentication' is due in 2 days. Make sure to submit on time.",
      read: true,
      priority: "medium",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      category: "deadline",
      action: "View Task"
    },
    {
      id: 5,
      type: "Chat Message",
      title: "New Chat Message",
      message: "Mike Chen sent you a message: 'Hey, can you review the API documentation I shared?'",
      read: false,
      priority: "low",
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      category: "chat",
      action: "Reply"
    },
    {
      id: 6,
      type: "Endorsement",
      title: "New Endorsement Received",
      message: "Alex Rodriguez endorsed your 'React.js' skill after completing the Mobile App project.",
      read: true,
      priority: "low",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      category: "endorsement",
      action: "View Profile"
    },
    {
      id: 7,
      type: "Review",
      title: "Project Review Posted",
      message: "Your work on the 'E-commerce Platform' project has been reviewed. You received 5 stars!",
      read: false,
      priority: "medium",
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      category: "review",
      action: "View Review"
    },
    {
      id: 8,
      type: "Career Opportunity",
      title: "Career Opportunity Alert",
      message: "Based on your skills, we found a Senior Developer position at TechCorp that might interest you.",
      read: true,
      priority: "low",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      category: "career",
      action: "View Job"
    }
  ]);

  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showArchived, setShowArchived] = useState(false);

  const handleMarkRead = (id) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const handleDeleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredAndSortedList = useMemo(() => {
    let filtered = notifications.filter(notif => {
      const matchesTab = activeTab === "All" || notif.type === activeTab;
      const matchesSearch = searchQuery === "" || 
        notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notif.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesArchived = showArchived ? notif.read : !notif.read;
      
      return matchesTab && matchesSearch && matchesArchived;
    });

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
  }, [notifications, activeTab, searchQuery, sortBy, showArchived]);

  const getTypeIcon = (type) => {
    switch (type) {
      case "Project Match": return <Target className="w-5 h-5 text-blue-400" />;
      case "Application Update": return <Briefcase className="w-5 h-5 text-green-400" />;
      case "Invitation": return <Users className="w-5 h-5 text-purple-400" />;
      case "Task Deadline": return <Clock className="w-5 h-5 text-orange-400" />;
      case "Chat Message": return <MessageCircle className="w-5 h-5 text-cyan-400" />;
      case "Endorsement": return <Star className="w-5 h-5 text-yellow-400" />;
      case "Review": return <Award className="w-5 h-5 text-pink-400" />;
      case "Career Opportunity": return <TrendingUp className="w-5 h-5 text-indigo-400" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
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

  const tabs = ["All", "Project Match", "Application Update", "Invitation", "Task Deadline", "Chat Message", "Endorsement", "Review", "Career Opportunity"];
  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Developer Notifications
                </h1>
                <p className="text-gray-300 text-sm">
                  {unreadCount} unread notifications • Career & task updates
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={handleMarkAllRead}
                className="hover:scale-105 transition-transform duration-300"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
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
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const count = tab === "All" 
              ? notifications.filter(n => showArchived ? n.read : !n.read).length
              : notifications.filter(n => n.type === tab && (showArchived ? n.read : !n.read)).length;
            
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

        {/* Notification List */}
        <div className="space-y-4">
          {filteredAndSortedList.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No notifications found</p>
              <p className="text-gray-500 text-sm mt-2">
                {searchQuery ? "Try adjusting your search terms" : "You're all caught up!"}
              </p>
            </div>
          ) : (
            filteredAndSortedList.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white/5 border border-white/10 rounded-xl p-5 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02] group ${
                  notif.read ? "opacity-60" : "opacity-100"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon with Priority Indicator */}
                  <div className="relative">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-slate-700 to-slate-600 group-hover:scale-110 transition-transform duration-300">
                      {getTypeIcon(notif.type)}
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
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Read
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-105 transition-all duration-300"
                        >
                          {notif.action}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteNotification(notif.id)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:scale-105 transition-all duration-300"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DeveloperNotifications;
