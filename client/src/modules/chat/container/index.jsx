import React, { useState } from "react";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import ChatBox from "../components/ChatBox";
import Navbar from "../../../components/header";
import ChatSidebar from "../components/ChatSidebar";
import { Menu, X } from "lucide-react";

const staticUsers = [
  { 
    id: 1, 
    name: "Alice Johnson", 
    lastMessage: "Thanks for the help with the design!",
    lastSeen: "2 min ago",
    isFavorite: true,
    isArchived: false,
    unreadCount: 0,
    status: "online",
    avatar: "AJ"
  },
  { 
    id: 2, 
    name: "Bob Smith", 
    lastMessage: "Can you review the PR when you get a chance?",
    lastSeen: "5 min ago",
    isFavorite: false,
    isArchived: false,
    unreadCount: 2,
    status: "online",
    avatar: "BS"
  },
  { 
    id: 3, 
    name: "Charlie Brown", 
    lastMessage: "Good morning! Ready for the meeting?",
    lastSeen: "1 hour ago",
    isFavorite: true,
    isArchived: false,
    unreadCount: 0,
    status: "away",
    avatar: "CB"
  },
  { 
    id: 4, 
    name: "Diana Prince", 
    lastMessage: "The new features look amazing!",
    lastSeen: "3 hours ago",
    isFavorite: false,
    isArchived: false,
    unreadCount: 1,
    status: "offline",
    avatar: "DP"
  },
  { 
    id: 5, 
    name: "Ethan Hunt", 
    lastMessage: "Mission accomplished! 🎯",
    lastSeen: "yesterday",
    isFavorite: false,
    isArchived: true,
    unreadCount: 0,
    status: "offline",
    avatar: "EH"
  },
  { 
    id: 6, 
    name: "Fiona Green", 
    lastMessage: "Let's schedule a call for next week",
    lastSeen: "2 days ago",
    isFavorite: true,
    isArchived: false,
    unreadCount: 0,
    status: "offline",
    avatar: "FG"
  },
  { 
    id: 7, 
    name: "George Wilson", 
    lastMessage: "The database migration is complete",
    lastSeen: "1 week ago",
    isFavorite: false,
    isArchived: true,
    unreadCount: 0,
    status: "offline",
    avatar: "GW"
  },
  { 
    id: 8, 
    name: "Hannah Davis", 
    lastMessage: "Thanks for the great presentation!",
    lastSeen: "now",
    isFavorite: false,
    isArchived: false,
    unreadCount: 3,
    status: "online",
    avatar: "HD"
  }
];

const staticMessages = {
  1: [
    { 
      id: 1, 
      sender: "Alice", 
      text: "Hey! How's the project going?", 
      time: "10:30 AM",
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      status: "delivered"
    },
    { 
      id: 2, 
      sender: "me", 
      text: "Hi Alice! It's going really well 🚀 The new features are looking great!", 
      time: "10:32 AM",
      timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
      status: "delivered"
    },
    { 
      id: 3, 
      sender: "Alice", 
      text: "That's awesome! I can't wait to see the final result. When do you think it'll be ready?", 
      time: "10:35 AM",
      timestamp: new Date(Date.now() - 30 * 1000).toISOString(),
      status: "delivered"
    },
    { 
      id: 4, 
      sender: "me", 
      text: "Probably by the end of this week. I'll keep you updated!", 
      time: "10:36 AM",
      timestamp: new Date(Date.now() - 20 * 1000).toISOString(),
      status: "delivered"
    },
    { 
      id: 5, 
      sender: "Alice", 
      text: "Perfect! Thanks for the help with the design system. It really made a difference 💯", 
      time: "10:38 AM",
      timestamp: new Date(Date.now() - 10 * 1000).toISOString(),
      status: "delivered"
    }
  ],
  2: [
    { 
      id: 1, 
      sender: "Bob", 
      text: "Yo! Did you check my PR?", 
      time: "9:00 AM",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: "delivered"
    },
    { 
      id: 2, 
      sender: "me", 
      text: "Not yet, I'll take a look in a bit", 
      time: "9:05 AM",
      timestamp: new Date(Date.now() - 115 * 60 * 1000).toISOString(),
      status: "delivered"
    },
    { 
      id: 3, 
      sender: "Bob", 
      text: "Cool, it's the authentication fix. Should be straightforward", 
      time: "9:10 AM",
      timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
      status: "delivered"
    },
    { 
      id: 4, 
      sender: "Bob", 
      text: "Can you review the PR when you get a chance? It's blocking the next release", 
      time: "9:15 AM",
      timestamp: new Date(Date.now() - 105 * 60 * 1000).toISOString(),
      status: "delivered"
    }
  ],
  3: [
    { 
      id: 1, 
      sender: "Charlie", 
      text: "Good morning! Ready for the meeting? 🌞", 
      time: "8:15 AM",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      status: "delivered"
    },
    { 
      id: 2, 
      sender: "me", 
      text: "Morning Charlie! Yes, I'm all set. See you in 15 minutes", 
      time: "8:20 AM",
      timestamp: new Date(Date.now() - 175 * 60 * 1000).toISOString(),
      status: "delivered"
    },
    { 
      id: 3, 
      sender: "Charlie", 
      text: "Great! I've prepared the quarterly reports. Should be an interesting discussion", 
      time: "8:25 AM",
      timestamp: new Date(Date.now() - 170 * 60 * 1000).toISOString(),
      status: "delivered"
    }
  ],
  4: [
    { 
      id: 1, 
      sender: "Diana", 
      text: "The new features look amazing! Great work on the UI improvements", 
      time: "7:30 AM",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      status: "delivered"
    },
    { 
      id: 2, 
      sender: "me", 
      text: "Thank you! I'm really happy with how it turned out", 
      time: "7:35 AM",
      timestamp: new Date(Date.now() - 235 * 60 * 1000).toISOString(),
      status: "delivered"
    }
  ],
  5: [
    { 
      id: 1, 
      sender: "Ethan", 
      text: "Mission accomplished! 🎯 The security audit is complete", 
      time: "Yesterday",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: "delivered"
    },
    { 
      id: 2, 
      sender: "me", 
      text: "Excellent work! Thanks for handling that", 
      time: "Yesterday",
      timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      status: "delivered"
    }
  ],
  6: [
    { 
      id: 1, 
      sender: "Fiona", 
      text: "Let's schedule a call for next week to discuss the new project", 
      time: "2 days ago",
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      status: "delivered"
    },
    { 
      id: 2, 
      sender: "me", 
      text: "Sounds good! What day works best for you?", 
      time: "2 days ago",
      timestamp: new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString(),
      status: "delivered"
    }
  ],
  7: [
    { 
      id: 1, 
      sender: "George", 
      text: "The database migration is complete. All systems are running smoothly", 
      time: "1 week ago",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "delivered"
    }
  ],
  8: [
    { 
      id: 1, 
      sender: "Hannah", 
      text: "Thanks for the great presentation today! Really insightful", 
      time: "2 min ago",
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      status: "delivered"
    },
    { 
      id: 2, 
      sender: "Hannah", 
      text: "Do you have the slides you can share?", 
      time: "1 min ago",
      timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
      status: "delivered"
    },
    { 
      id: 3, 
      sender: "Hannah", 
      text: "Also, can we schedule a follow-up meeting?", 
      time: "now",
      timestamp: new Date().toISOString(),
      status: "sent"
    }
  ]
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
      timestamp: new Date().toISOString(),
      status: "sent"
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
