import React, { useState, useMemo } from "react";
import { 
  Bell, 
  Shield, 
  AlertTriangle, 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle,
  XCircle,
  Search,
  Archive,
  Calendar,
  Award,
  Briefcase,
  TrendingUp,
  Target,
  FileText,
  CreditCard,
  Flag,
  Eye,
  Settings
} from "lucide-react";
import { Badge, Button } from "../../../components";
import { motion } from "framer-motion";

const AdminNotifications = ({ user }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "Flagged User",
      title: "Suspicious User Activity",
      message: "User 'john_doe123' has been flagged for suspicious behavior. Multiple fake reviews detected.",
      read: false,
      priority: "high",
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      category: "moderation",
      action: "Review User"
    },
    {
      id: 2,
      type: "Dispute Report",
      title: "Payment Dispute Filed",
      message: "Project 'E-commerce Platform' has a payment dispute between developer and project owner. Investigation needed.",
      read: false,
      priority: "high",
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      category: "dispute",
      action: "Investigate"
    },
    {
      id: 3,
      type: "System Alert",
      title: "High Server Load Detected",
      message: "Server load is at 85%. Consider scaling resources or investigating potential issues.",
      read: false,
      priority: "medium",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      category: "system",
      action: "View Metrics"
    },
    {
      id: 4,
      type: "Billing Alert",
      title: "Payment Processing Issue",
      message: "Payment gateway is experiencing 5% failure rate. Check payment processor status.",
      read: true,
      priority: "high",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      category: "billing",
      action: "Check Gateway"
    },
    {
      id: 5,
      type: "Moderation Task",
      title: "Content Review Required",
      message: "15 new project descriptions need review for inappropriate content. Automated filters flagged them.",
      read: false,
      priority: "medium",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      category: "moderation",
      action: "Review Content"
    },
    {
      id: 6,
      type: "Security Alert",
      title: "Unusual Login Pattern",
      message: "Multiple failed login attempts detected from IP 192.168.1.100. Consider blocking or investigating.",
      read: true,
      priority: "high",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      category: "security",
      action: "Block IP"
    },
    {
      id: 7,
      type: "Platform Health",
      title: "Database Performance Issue",
      message: "Database query response time increased by 200%. Check for optimization opportunities.",
      read: false,
      priority: "medium",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      category: "system",
      action: "Optimize DB"
    },
    {
      id: 8,
      type: "User Verification",
      title: "Bulk Account Verification",
      message: "50 new user accounts require manual verification. Review documentation and approve.",
      read: true,
      priority: "low",
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      category: "verification",
      action: "Verify Accounts"
    },
    {
      id: 9,
      type: "Feature Request",
      title: "Popular Feature Request",
      message: "Video call integration has been requested by 200+ users. Consider prioritizing development.",
      read: false,
      priority: "low",
      createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      category: "feature",
      action: "Review Request"
    },
    {
      id: 10,
      type: "Compliance Alert",
      title: "GDPR Compliance Check",
      message: "Quarterly GDPR compliance review is due. Ensure all data handling practices are compliant.",
      read: false,
      priority: "medium",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      category: "compliance",
      action: "Start Review"
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
      case "Flagged User": return <Flag className="w-5 h-5 text-red-400" />;
      case "Dispute Report": return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case "System Alert": return <Settings className="w-5 h-5 text-blue-400" />;
      case "Billing Alert": return <CreditCard className="w-5 h-5 text-yellow-400" />;
      case "Moderation Task": return <Shield className="w-5 h-5 text-purple-400" />;
      case "Security Alert": return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case "Platform Health": return <TrendingUp className="w-5 h-5 text-green-400" />;
      case "User Verification": return <Users className="w-5 h-5 text-cyan-400" />;
      case "Feature Request": return <Briefcase className="w-5 h-5 text-indigo-400" />;
      case "Compliance Alert": return <FileText className="w-5 h-5 text-pink-400" />;
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

  const tabs = ["All", "Flagged User", "Dispute Report", "System Alert", "Billing Alert", "Moderation Task", "Security Alert", "Platform Health", "User Verification", "Feature Request", "Compliance Alert"];
  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <div className="w-full px-6 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <Bell className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Admin Notifications
                </h1>
                <p className="text-gray-300 text-sm">
                  {unreadCount} unread notifications • System & moderation alerts
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

export default AdminNotifications;
