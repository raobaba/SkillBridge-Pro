import React, { useState } from "react";
import { Search, Plus, MessageCircle, Users, Settings, Archive, Star } from "lucide-react";
import { Button } from "../../../components";

const ChatSidebar = ({ users = [], onSelectUser, activeUser, userRole, permissions }) => {
  const [search, setSearch] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [filterType, setFilterType] = useState("all"); // all, favorites, archived, groups, system, flagged

  const filteredUsers = (users || []).filter((u) => {
    if (!u) return false;
    
    const matchesSearch = u.name?.toLowerCase().includes(search?.toLowerCase()) ?? false;
    const matchesFilter = filterType === "all" || 
                         (filterType === "favorites" && u.isFavorite) ||
                         (filterType === "archived" && u.isArchived) ||
                         (filterType === "groups" && u.chatType === "group") ||
                         (filterType === "system" && u.isSystem) ||
                         (filterType === "flagged" && u.isFlagged);
    return matchesSearch && matchesFilter;
  });

  const handleNewChat = () => {
    console.log("New chat clicked");
    setShowNewChat(true);
    // New chat functionality would be implemented here
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  return (
    <div className="w-92 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm h-full border-r border-white/10 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 blur-3xl"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Enhanced Header */}
        <div className="p-4 border-b border-white/10">
          {/* Enhanced Search Bar */}
          <div className="relative flex items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 border border-white/20 rounded-xl overflow-hidden focus-within:border-blue-500/50 transition-all duration-300">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" />
              <input
                type="text"
                placeholder="Search chats..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-0 border-0 transition-all duration-300"
              />
            </div>
            
            {/* Plus Icon Button */}
            <Button
              onClick={handleNewChat}
              variant="ghost"
              size="sm"
              className="h-[42px] p-2 rounded-xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 hover:from-blue-500/30 hover:via-purple-500/30 hover:to-pink-500/30 transition-all duration-300 hover:scale-110 group flex-shrink-0 flex items-center justify-center"
              title="New Chat"
            >
              <Plus className="w-5 h-5 text-gray-300 group-hover:text-blue-300 transition-colors duration-300" />
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-2 border-b border-white/10">
          <div className="flex gap-1 bg-black/20 backdrop-blur-sm rounded-lg p-1 flex-wrap">
            <Button
              onClick={() => handleFilterChange("all")}
              variant="ghost"
              size="sm"
              className={`px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 ${
                filterType === "all"
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              All
            </Button>
            <Button
              onClick={() => handleFilterChange("favorites")}
              variant="ghost"
              size="sm"
              className={`px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 ${
                filterType === "favorites"
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              <Star className="w-3 h-3 inline mr-1" />
              Favorites
            </Button>
            {(userRole === 'developer' || userRole === 'project-owner') && (
              <Button
                onClick={() => handleFilterChange("groups")}
                variant="ghost"
                size="sm"
                className={`px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 ${
                  filterType === "groups"
                    ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <Users className="w-3 h-3 inline mr-1" />
                Groups
              </Button>
            )}
            <Button
              onClick={() => handleFilterChange("system")}
              variant="ghost"
              size="sm"
              className={`px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 ${
                filterType === "system"
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              <MessageCircle className="w-3 h-3 inline mr-1" />
              System
            </Button>
            {userRole === 'admin' && (
              <Button
                onClick={() => handleFilterChange("flagged")}
                variant="ghost"
                size="sm"
                className={`px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 ${
                  filterType === "flagged"
                    ? "bg-gradient-to-r from-red-500 via-pink-500 to-red-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <Archive className="w-3 h-3 inline mr-1" />
                Flagged
              </Button>
            )}
            <Button
              onClick={() => handleFilterChange("archived")}
              variant="ghost"
              size="sm"
              className={`px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 ${
                filterType === "archived"
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              <Archive className="w-3 h-3 inline mr-1" />
              Archived
            </Button>
          </div>
        </div>

        {/* Enhanced User List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden sidebar-scrollbar">
          {(filteredUsers || []).map((user, index) => {
            if (!user) return null;
            
            return (
              <div
                key={user?.id || index}
                onClick={() => onSelectUser?.(user)}
                className={`group relative flex items-center gap-3 p-4 cursor-pointer transition-all duration-300 ${
                  activeUser?.id === user?.id
                    ? "bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 border-l-4 border-blue-500 shadow-lg"
                    : "hover:bg-black/20"
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
              {/* Enhanced Avatar */}
              <div className="relative group/avatar">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover/avatar:scale-110 transition-transform duration-300 ${
                  user?.isSystem ? 'bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500' :
                  user?.isFlagged ? 'bg-gradient-to-br from-red-500 via-pink-500 to-red-500' :
                  user?.isGroup ? 'bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500' :
                  user?.role === 'project-owner' ? 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500' :
                  user?.role === 'developer' ? 'bg-gradient-to-br from-green-500 via-teal-500 to-blue-500' :
                  'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'
                }`}>
                  {user?.isSystem ? '⚙️' : user?.isGroup ? '👥' : user?.name?.charAt(0) || '?'}
                </div>
                {/* Enhanced Status Dot */}
                <span className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-slate-900 rounded-full shadow-lg ${
                  user?.isFlagged ? 'bg-red-500 animate-pulse' :
                  user?.isSystem ? 'bg-yellow-500' :
                  user?.status === 'online' ? 'bg-green-500 animate-pulse' :
                  user?.status === 'away' ? 'bg-yellow-500' :
                  'bg-gray-500'
                }`}>
                  {user?.status === 'online' && !user?.isFlagged && !user?.isSystem && (
                    <span className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></span>
                  )}
                </span>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{user?.name || 'Unknown User'}</p>
                    {/* Role indicators */}
                    {user?.isSystem && (
                      <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded border border-yellow-500/30">
                        System
                      </span>
                    )}
                    {user?.isFlagged && (
                      <span className="px-1.5 py-0.5 bg-red-500/20 text-red-300 text-xs rounded border border-red-500/30">
                        Flagged
                      </span>
                    )}
                    {user?.isGroup && (
                      <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded border border-purple-500/30">
                        Group
                      </span>
                    )}
                    {!user?.isSystem && !user?.isFlagged && !user?.isGroup && user?.role && (
                      <span className={`px-1.5 py-0.5 text-xs rounded border ${
                        user.role === 'project-owner' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                        user.role === 'developer' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                        'bg-gray-500/20 text-gray-300 border-gray-500/30'
                      }`}>
                        {user.role?.replace('_', ' ').toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {user?.isFavorite && (
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    )}
                    {(user?.unreadCount || 0) > 0 && (
                      <span className={`px-2 py-1 text-white text-xs rounded-full font-bold min-w-[20px] text-center ${
                        user?.isFlagged ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                        user?.isSystem ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'
                      }`}>
                        {user?.unreadCount || 0}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-300 truncate flex-1 min-w-0 pr-2">
                    {user?.lastMessage || "Tap to chat"}
                  </p>
                  <p className="text-xs text-gray-400 flex-shrink-0">
                    {user?.lastSeen || "now"}
                  </p>
                </div>
              </div>

              {/* Hover effect indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            );
          })}

          {(filteredUsers?.length || 0) === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-500 mb-3" />
              <p className="text-gray-400 text-sm mb-2">
                {search ? "No chats found" : "No chats available"}
              </p>
              {!search && (
                <Button
                  onClick={handleNewChat}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  Start New Chat
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => console.log("Settings clicked")}
              variant="ghost"
              size="sm"
              className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 hover:from-blue-500/30 hover:via-purple-500/30 hover:to-pink-500/30 transition-all duration-300 hover:scale-110 group"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-300 group-hover:text-blue-300 transition-colors duration-300" />
            </Button>
            
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatSidebar;
