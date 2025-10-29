import React, { useState, useMemo } from "react";
import { 
  Bell, 
  Users, 
  MessageCircle, 
  DollarSign, 
  Clock, 
  AlertCircle,
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
  CreditCard
} from "lucide-react";
import { Badge, Button } from "../../../components";
import { motion } from "framer-motion";

const ProjectOwnerNotifications = ({ user }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "New Applicant",
      title: "New Application Received",
      message: "John Smith applied for your 'E-commerce Platform Development' project. Review their profile and skills.",
      read: false,
      priority: "high",
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      category: "application",
      action: "Review Application"
    },
    {
      id: 2,
      type: "Recommended Developer",
      title: "Developer Recommendation",
      message: "We found Sarah Johnson, a Senior React Developer with 5+ years experience, perfect for your project.",
      read: false,
      priority: "medium",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      category: "recommendation",
      action: "View Profile"
    },
    {
      id: 3,
      type: "Project Update",
      title: "Project Progress Update",
      message: "Mike Chen completed the user authentication module. The project is 60% complete.",
      read: false,
      priority: "medium",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      category: "progress",
      action: "View Progress"
    },
    {
      id: 4,
      type: "Billing Reminder",
      title: "Payment Due Soon",
      message: "Your monthly subscription payment of $99 is due in 3 days. Update your payment method if needed.",
      read: true,
      priority: "high",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      category: "billing",
      action: "Pay Now"
    },
    {
      id: 5,
      type: "Chat Message",
      title: "New Chat Message",
      message: "Alex Rodriguez sent you a message: 'I have some questions about the project requirements.'",
      read: false,
      priority: "low",
      createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      category: "chat",
      action: "Reply"
    },
    {
      id: 6,
      type: "Task Deadline",
      title: "Task Deadline Alert",
      message: "The 'Database Design' task assigned to Sarah Johnson is due tomorrow. Check progress.",
      read: true,
      priority: "medium",
      createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      category: "deadline",
      action: "Check Progress"
    },
    {
      id: 7,
      type: "Project Milestone",
      title: "Milestone Completed",
      message: "The 'Frontend Development' milestone has been completed by the development team. Review the deliverables.",
      read: false,
      priority: "medium",
      createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
      category: "milestone",
      action: "Review Deliverables"
    },
    {
      id: 8,
      type: "Team Invitation",
      title: "Team Member Invitation",
      message: "You've been invited to join the 'AI Development Team' by TechCorp. Accept to collaborate.",
      read: true,
      priority: "low",
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      category: "invitation",
      action: "Accept Invitation"
    },
    {
      id: 9,
      type: "Budget Alert",
      title: "Budget Usage Alert",
      message: "You've used 80% of your project budget. Consider upgrading or optimizing costs.",
      read: false,
      priority: "high",
      createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
      category: "budget",
      action: "View Budget"
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
      case "New Applicant": return <Users className="w-5 h-5 text-green-400" />;
      case "Recommended Developer": return <Target className="w-5 h-5 text-blue-400" />;
      case "Project Update": return <Briefcase className="w-5 h-5 text-purple-400" />;
      case "Billing Reminder": return <CreditCard className="w-5 h-5 text-red-400" />;
      case "Chat Message": return <MessageCircle className="w-5 h-5 text-cyan-400" />;
      case "Task Deadline": return <Clock className="w-5 h-5 text-orange-400" />;
      case "Project Milestone": return <Award className="w-5 h-5 text-yellow-400" />;
      case "Team Invitation": return <Users className="w-5 h-5 text-indigo-400" />;
      case "Budget Alert": return <DollarSign className="w-5 h-5 text-pink-400" />;
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

  const tabs = ["All", "New Applicant", "Recommended Developer", "Project Update", "Billing Reminder", "Chat Message", "Task Deadline", "Project Milestone", "Team Invitation", "Budget Alert"];
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
                  Project Owner Notifications
                </h1>
                <p className="text-gray-300 text-sm">
                  {unreadCount} unread notifications • Project & billing updates
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

export default ProjectOwnerNotifications;
