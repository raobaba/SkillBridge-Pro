import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import ChatBox from "../components/ChatBox";
import ChatSidebar from "../components/ChatSidebar";
import { useNavigate } from "react-router-dom";
import { Menu, X, Shield, Users, MessageCircle, AlertTriangle } from "lucide-react";

const staticUsers = [
  { 
    id: 1, 
    name: "Alice Johnson", 
    role: "project-owner",
    lastMessage: "Thanks for the help with the design!",
    lastSeen: "2 min ago",
    isFavorite: true,
    isArchived: false,
    unreadCount: 0,
    status: "online",
    avatar: "AJ",
    chatType: "direct",
    projectId: "proj-001"
  },
  { 
    id: 2, 
    name: "Bob Smith", 
    role: "developer",
    lastMessage: "Can you review the PR when you get a chance?",
    lastSeen: "5 min ago",
    isFavorite: false,
    isArchived: false,
    unreadCount: 2,
    status: "online",
    avatar: "BS",
    chatType: "direct"
  },
  { 
    id: 3, 
    name: "Charlie Brown", 
    role: "project-owner",
    lastMessage: "Good morning! Ready for the meeting?",
    lastSeen: "1 hour ago",
    isFavorite: true,
    isArchived: false,
    unreadCount: 0,
    status: "away",
    avatar: "CB",
    chatType: "group",
    projectId: "proj-002"
  },
  { 
    id: 4, 
    name: "Diana Prince", 
    role: "developer",
    lastMessage: "The new features look amazing!",
    lastSeen: "3 hours ago",
    isFavorite: false,
    isArchived: false,
    unreadCount: 1,
    status: "offline",
    avatar: "DP",
    chatType: "direct"
  },
  { 
    id: 5, 
    name: "E-commerce Platform Team", 
    role: "group",
    lastMessage: "Ethan Hunt: Mission accomplished! 🎯",
    lastSeen: "yesterday",
    isFavorite: false,
    isArchived: true,
    unreadCount: 0,
    status: "offline",
    avatar: "EP",
    chatType: "group",
    projectId: "proj-001",
    isGroup: true
  },
  { 
    id: 6, 
    name: "Fiona Green", 
    role: "project-owner",
    lastMessage: "Let's schedule a call for next week",
    lastSeen: "2 days ago",
    isFavorite: true,
    isArchived: false,
    unreadCount: 0,
    status: "offline",
    avatar: "FG",
    chatType: "direct",
    projectId: "proj-003"
  },
  { 
    id: 7, 
    name: "George Wilson", 
    role: "developer",
    lastMessage: "The database migration is complete",
    lastSeen: "1 week ago",
    isFavorite: false,
    isArchived: true,
    unreadCount: 0,
    status: "offline",
    avatar: "GW",
    chatType: "direct"
  },
  { 
    id: 8, 
    name: "Hannah Davis", 
    role: "developer",
    lastMessage: "Thanks for the great presentation!",
    lastSeen: "now",
    isFavorite: false,
    isArchived: false,
    unreadCount: 3,
    status: "online",
    avatar: "HD",
    chatType: "direct"
  },
  { 
    id: 9, 
    name: "System Notifications", 
    role: "system",
    lastMessage: "New match found for your skills!",
    lastSeen: "5 min ago",
    isFavorite: false,
    isArchived: false,
    unreadCount: 1,
    status: "online",
    avatar: "SN",
    chatType: "system",
    isSystem: true
  },
  { 
    id: 10, 
    name: "Flagged Chat #123", 
    role: "admin",
    lastMessage: "User reported inappropriate content",
    lastSeen: "1 hour ago",
    isFavorite: false,
    isArchived: false,
    unreadCount: 1,
    status: "online",
    avatar: "FC",
    chatType: "moderation",
    isFlagged: true
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
  const navigate = useNavigate();
  const { user } = useSelector((state) => state?.user || {});
  const [activeUser, setActiveUser] = useState(staticUsers?.[0] || null);
  const [messages, setMessages] = useState(staticMessages || {});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterType, setFilterType] = useState("all"); // all, direct, groups, system, flagged

  // Role-based user filtering
  const getFilteredUsers = () => {
    if (!user?.role) return staticUsers || [];

    const currentUserRole = user.role;
    
    return (staticUsers || []).filter(chatUser => {
      // System notifications are visible to all roles
      if (chatUser?.isSystem) return true;
      
      // Flagged chats are only visible to admins
      if (chatUser?.isFlagged && currentUserRole !== 'admin') return false;
      
      // Role-based filtering
      switch (currentUserRole) {
        case 'developer':
          // Can chat with project owners and other developers
          // Can join group chats when accepted
          return ['project-owner', 'developer', 'group'].includes(chatUser?.role) || 
                 chatUser?.chatType === 'group';
        
        case 'project-owner':
          // Can chat with developers and other project owners
          // Can create/manage project group chats
          return ['developer', 'project-owner', 'group'].includes(chatUser?.role) || 
                 chatUser?.chatType === 'group';
        
        case 'admin':
          // Can see flagged chats for moderation
          // Read-only access to flagged chats
          return chatUser?.isFlagged || chatUser?.role === 'admin';
        
        default:
          return true;
      }
    });
  };

  const filteredUsers = getFilteredUsers() || [];

  // Set default active user if none selected and users are available
  useEffect(() => {
    if (!activeUser && filteredUsers?.length > 0) {
      setActiveUser(filteredUsers[0]);
    }
  }, [activeUser, filteredUsers]);

  // Role-based permissions
  const getRolePermissions = () => {
    if (!user?.role) return { canSendMessages: false, canCreateGroups: false, canModerate: false, canJoinGroups: false };
    
    switch (user.role) {
      case 'developer':
        return {
          canSendMessages: true,
          canCreateGroups: false,
          canModerate: false,
          canJoinGroups: true
        };
      case 'project-owner':
        return {
          canSendMessages: true,
          canCreateGroups: true,
          canModerate: false,
          canJoinGroups: true
        };
      case 'admin':
        return {
          canSendMessages: false, // Read-only for flagged chats
          canCreateGroups: false,
          canModerate: true,
          canJoinGroups: false
        };
      default:
        return { canSendMessages: false, canCreateGroups: false, canModerate: false, canJoinGroups: false };
    }
  };

  const permissions = getRolePermissions();

  const handleSend = (text) => {
    // Check if user can send messages based on role and chat type
    if (!permissions?.canSendMessages) {
      console.log("You don't have permission to send messages in this chat");
      return;
    }

    // For flagged chats, admins have read-only access
    if (activeUser?.isFlagged && user?.role === 'admin') {
      console.log("This is a flagged chat - read-only access for moderation");
      return;
    }

    if (!text?.trim()) return;

    const currentMessages = messages?.[activeUser?.id] || [];
    const newMessage = {
      id: (currentMessages?.length || 0) + 1,
      sender: "me",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: new Date().toISOString(),
      status: "sent"
    };
    
    setMessages(prev => ({
      ...prev,
      [activeUser?.id]: [...currentMessages, newMessage],
    }));
  };

  return (
    <>
      {/* Role-based Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 px-4 py-1 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div onClick={()=>navigate('/')}>
              <h1 className="text-xl font-bold text-white">Communication Center</h1>
              <p className="text-sm text-gray-300">
                {user?.role === 'developer' && 'Chat with Project Owners & Join Group Discussions'}
                {user?.role === 'project-owner' && 'Manage Team Communications & Project Chats'}
                {user?.role === 'admin' && 'Monitor Flagged Chats & System Notifications'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {user?.role === 'admin' && (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-lg border border-red-500/30">
                <Shield className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-300">Moderation Mode</span>
              </div>
            )}
            {user?.role === 'project-owner' && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-300">Team Management</span>
              </div>
            )}
            {user?.role === 'developer' && (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-lg border border-green-500/30">
                <MessageCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-300">Collaboration</span>
              </div>
            )}
          </div>
        </div>
      </div>

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
            users={filteredUsers}
            activeUser={activeUser}
            onSelectUser={(user) => {
              setActiveUser(user);
              setSidebarOpen(false); // Close sidebar on mobile after selection
            }}
            userRole={user?.role}
            permissions={permissions}
          />
        </div>

        {/* Chat Area */}
        <div className="flex flex-col flex-1 bg-gradient-to-b from-slate-900 to-indigo-900">
          {activeUser && <ChatHeader user={activeUser} permissions={permissions} />}
          <MessageList messages={activeUser ? (messages?.[activeUser?.id] || []) : []} />
          {permissions?.canSendMessages && !activeUser?.isFlagged && (
            <ChatBox onSend={handleSend} />
          )}
          {!permissions?.canSendMessages && (
            <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm p-4 border-t border-white/10">
              <div className="flex items-center justify-center gap-2 text-gray-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">Read-only access for this chat</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatContainer;
