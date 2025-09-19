import React, { useState } from "react";
import { User, Phone, Video, MoreVertical, Search, Settings, Archive, Star } from "lucide-react";

const ChatHeader = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastSeen, setLastSeen] = useState("Active now");

  const handleCall = (type) => {
    console.log(`${type} call initiated`);
    // Call functionality would be implemented here
  };

  const handleSearch = () => {
    console.log("Search clicked");
    // Search functionality would be implemented here
  };

  const handleSettings = () => {
    console.log("Settings clicked");
    // Settings functionality would be implemented here
  };

  const handleArchive = () => {
    console.log("Archive clicked");
    // Archive functionality would be implemented here
  };

  const handleStar = () => {
    console.log("Star clicked");
    // Star functionality would be implemented here
  };

  return (
    <div className="relative">
      {/* Enhanced Chat Header Container */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm p-4 shadow-2xl border-b border-white/10 relative overflow-visible z-50">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 blur-3xl"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          {/* Enhanced User Info */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                {user.name.charAt(0)}
              </div>
              {/* Enhanced Online status dot */}
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full animate-pulse shadow-lg">
                <span className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></span>
              </span>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-white font-semibold text-lg">{user.name}</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-sm text-gray-300">{lastSeen}</p>
              </div>
            </div>
          </div>

          {/* Simplified Action Icons */}
          <div className="flex items-center gap-2">
            {/* Voice Call button */}
            <button
              onClick={() => handleCall('Voice')}
              className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 hover:from-blue-500/30 hover:via-purple-500/30 hover:to-pink-500/30 transition-all duration-300 hover:scale-110 group"
              title="Voice Call"
            >
              <Phone className="w-5 h-5 text-gray-300 group-hover:text-green-400 transition-colors duration-300" />
            </button>

            {/* Video Call button */}
            <button
              onClick={() => handleCall('Video')}
              className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 hover:from-blue-500/30 hover:via-purple-500/30 hover:to-pink-500/30 transition-all duration-300 hover:scale-110 group"
              title="Video Call"
            >
              <Video className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-colors duration-300" />
            </button>

            {/* More Options Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 hover:from-blue-500/30 hover:via-purple-500/30 hover:to-pink-500/30 transition-all duration-300 hover:scale-110 group"
                title="More options"
              >
                <MoreVertical className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
              </button>

              {/* Enhanced Dropdown Menu with High Z-Index */}
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-black/40 backdrop-blur-sm rounded-xl border border-white/20 shadow-2xl overflow-hidden z-[99999]">
                  <div className="p-2">
                    {/* Search */}
                    <button
                      onClick={() => {
                        handleSearch();
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-blue-500/20 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                      <Search className="w-4 h-4" />
                      Search Messages
                    </button>
                    
                    {/* View Profile */}
                    <button
                      onClick={() => {
                        console.log("View profile clicked");
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-blue-500/20 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      View Profile
                    </button>

                    {/* Star/Favorite */}
                    <button
                      onClick={() => {
                        handleStar();
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-blue-500/20 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                      <Star className="w-4 h-4" />
                      Add to Favorites
                    </button>

                    {/* Archive */}
                    <button
                      onClick={() => {
                        handleArchive();
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-blue-500/20 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                      <Archive className="w-4 h-4" />
                      Archive Chat
                    </button>

                    {/* Settings */}
                    <button
                      onClick={() => {
                        handleSettings();
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-blue-500/20 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Chat Settings
                    </button>

                    {/* Divider */}
                    <div className="my-2 border-t border-white/10"></div>

                    {/* Mute Notifications */}
                    <button
                      onClick={() => {
                        console.log("Mute notifications clicked");
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-blue-500/20 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Mute Notifications
                    </button>

                    {/* Block User */}
                    <button
                      onClick={() => {
                        console.log("Block user clicked");
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                      <MoreVertical className="w-4 h-4" />
                      Block User
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[99998]"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default ChatHeader;
