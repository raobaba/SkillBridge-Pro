import React, { useState } from "react";
import { Search, Plus, MessageCircle, Users, Settings, Archive, Star } from "lucide-react";

const ChatSidebar = ({ users, onSelectUser, activeUser }) => {
  const [search, setSearch] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [filterType, setFilterType] = useState("all"); // all, favorites, archived

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterType === "all" || 
                         (filterType === "favorites" && u.isFavorite) ||
                         (filterType === "archived" && u.isArchived);
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
    <div className="w-72 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm h-full border-r border-white/10 flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 blur-3xl"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Enhanced Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-xl flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-blue-400" />
              Chats
            </h2>
            <button
              onClick={handleNewChat}
              className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 hover:from-blue-500/30 hover:via-purple-500/30 hover:to-pink-500/30 transition-all duration-300 hover:scale-110 group"
              title="New Chat"
            >
              <Plus className="w-5 h-5 text-gray-300 group-hover:text-blue-300 transition-colors duration-300" />
            </button>
          </div>

          {/* Enhanced Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/20 backdrop-blur-sm text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 border border-white/10 transition-all duration-300 hover:border-blue-500/30"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 py-2 border-b border-white/10">
          <div className="flex gap-1 bg-black/20 backdrop-blur-sm rounded-lg p-1">
            <button
              onClick={() => handleFilterChange("all")}
              className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 ${
                filterType === "all"
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange("favorites")}
              className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 ${
                filterType === "favorites"
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Star className="w-3 h-3 inline mr-1" />
              Favorites
            </button>
            <button
              onClick={() => handleFilterChange("archived")}
              className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all duration-300 ${
                filterType === "archived"
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Archive className="w-3 h-3 inline mr-1" />
              Archived
            </button>
          </div>
        </div>

        {/* Enhanced User List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
          {filteredUsers.map((user, index) => (
            <div
              key={user.id}
              onClick={() => onSelectUser(user)}
              className={`group relative flex items-center gap-3 p-4 cursor-pointer transition-all duration-300 ${
                activeUser?.id === user.id
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
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover/avatar:scale-110 transition-transform duration-300">
                  {user.name.charAt(0)}
                </div>
                {/* Enhanced Status Dot */}
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full animate-pulse shadow-lg">
                  <span className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></span>
                </span>
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-center justify-between">
                  <p className="text-white font-medium truncate flex-1 min-w-0 pr-2">{user.name}</p>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {user.isFavorite && (
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    )}
                    {user.unreadCount > 0 && (
                      <span className="px-2 py-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-xs rounded-full font-bold min-w-[20px] text-center">
                        {user.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-300 truncate flex-1 min-w-0 pr-2">
                    {user.lastMessage || "Tap to chat"}
                  </p>
                  <p className="text-xs text-gray-400 flex-shrink-0">
                    {user.lastSeen || "now"}
                  </p>
                </div>
              </div>

              {/* Hover effect indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-500 mb-3" />
              <p className="text-gray-400 text-sm mb-2">
                {search ? "No chats found" : "No chats available"}
              </p>
              {!search && (
                <button
                  onClick={handleNewChat}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  Start New Chat
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => console.log("Settings clicked")}
              className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 hover:from-blue-500/30 hover:via-purple-500/30 hover:to-pink-500/30 transition-all duration-300 hover:scale-110 group"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-300 group-hover:text-blue-300 transition-colors duration-300" />
            </button>
            
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
