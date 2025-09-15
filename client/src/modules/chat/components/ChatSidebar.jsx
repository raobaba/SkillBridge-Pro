import React, { useState } from "react";

const ChatSidebar = ({ users, onSelectUser, activeUser }) => {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-64 bg-slate-800 h-full border-r border-gray-700 flex flex-col">
      {/* Header */}
      <h2 className="text-white font-bold p-4 border-b border-gray-700">
        Chats
      </h2>

      {/* Search Bar */}
      <div className="px-3 pb-2">
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-slate-700 text-gray-200 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelectUser(user)}
            className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
              activeUser?.id === user.id
                ? "bg-slate-700 border-l-4 border-indigo-500"
                : "hover:bg-slate-700"
            }`}
          >
            <div className="relative">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {user.name.charAt(0)}
              </div>
              {/* Status Dot */}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full"></span>
            </div>
            <div>
              <p className="text-gray-200 font-medium">{user.name}</p>
              <p className="text-xs text-gray-400 truncate max-w-[150px]">
                Tap to chat
              </p>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">
            No chats found
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
