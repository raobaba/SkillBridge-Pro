import React from "react";
import { User, Phone, Video, MoreVertical } from "lucide-react";

const ChatHeader = ({ user }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-black/30 backdrop-blur-md">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            {user.name.charAt(0)}
          </div>
          {/* Online status dot */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></span>
        </div>
        <div>
          <h2 className="text-white font-semibold text-sm sm:text-base">{user.name}</h2>
          <p className="text-xs text-gray-400 hidden sm:block">Active now</p>
        </div>
      </div>

      {/* Action Icons */}
      <div className="flex gap-3 sm:gap-4 text-gray-300">
        <button
          aria-label="Voice Call"
          className="hover:text-white transition-colors active:scale-90"
        >
          <Phone className="w-5 h-5" />
        </button>
        <button
          aria-label="Video Call"
          className="hover:text-white transition-colors active:scale-90"
        >
          <Video className="w-5 h-5" />
        </button>
        <button
          aria-label="More Options"
          className="hover:text-white transition-colors active:scale-90"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
