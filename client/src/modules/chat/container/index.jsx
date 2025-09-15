import React, { useState } from "react";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import ChatBox from "../components/ChatBox";
import Navbar from "../../../components/header";
import ChatSidebar from "../components/ChatSidebar";
import { Menu, X } from "lucide-react";

const staticUsers = [
  { id: 1, name: "Alice Johnson" },
  { id: 2, name: "Bob Smith" },
  { id: 3, name: "Charlie Brown" },
];

const staticMessages = {
  1: [
    { id: 1, sender: "Alice", text: "Hey! How’s the project going?", time: "10:30 AM" },
    { id: 2, sender: "me", text: "Hi Alice! It’s going really well 🚀", time: "10:32 AM" },
  ],
  2: [
    { id: 1, sender: "Bob", text: "Yo! Did you check my PR?", time: "9:00 AM" },
  ],
  3: [
    { id: 1, sender: "Charlie", text: "Good morning! 🌞", time: "8:15 AM" },
  ],
};

const ChatContainer = () => {
  const [activeUser, setActiveUser] = useState(staticUsers[0]);
  const [messages, setMessages] = useState(staticMessages);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSend = (text) => {
    const newMessage = {
      id: messages[activeUser.id].length + 1,
      sender: "me",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages({
      ...messages,
      [activeUser.id]: [...messages[activeUser.id], newMessage],
    });
  };

  return (
    <>
      <Navbar />

      {/* Mobile toggle button */}
      <div className="sm:hidden flex justify-start p-2 bg-slate-900">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-full bg-gray-700 text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex h-[565px] w-full max-w-full mx-auto overflow-hidden shadow-lg bg-slate-900">
        {/* Sidebar */}
        <div
          className={`fixed sm:relative z-20 h-full transition-transform duration-300 bg-slate-800 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0`}
        >
          <ChatSidebar
            users={staticUsers}
            activeUser={activeUser}
            onSelectUser={(user) => {
              setActiveUser(user);
              setSidebarOpen(false); // Close sidebar on mobile after selection
            }}
          />
        </div>

        {/* Chat Area */}
        <div className="flex flex-col flex-1 bg-gradient-to-b from-slate-900 to-indigo-900">
          <ChatHeader user={activeUser} />
          <MessageList messages={messages[activeUser.id]} />
          <ChatBox onSend={handleSend} />
        </div>
      </div>
    </>
  );
};

export default ChatContainer;
