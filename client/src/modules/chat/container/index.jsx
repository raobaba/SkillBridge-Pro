import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import ChatBox from "../components/ChatBox";
import ChatSidebar from "../components/ChatSidebar";
import { useNavigate } from "react-router-dom";
import { Menu, X, Shield, Users, MessageCircle, AlertTriangle } from "lucide-react";
import { 
  getConversationsApi, 
  getMessagesApi, 
  sendMessageApi,
  markAsReadApi,
  getChatUsersApi
} from "../slice/chatAction";
import { connectSocket, disconnectSocket, getSocket } from "../../../services/socket";

// System notifications and flagged chats (UI elements, not real conversations)
const systemNotifications = [
  { 
    id: 999, 
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
    id: 998, 
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

// Helper function to format time
const formatTime = (timestamp) => {
  if (!timestamp) return "now";
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

// Helper function to get initials from name
const getInitials = (name) => {
  if (!name) return "U";
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const ChatContainer = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state?.user || {});
  const [conversations, setConversations] = useState([]);
  const [usersMap, setUsersMap] = useState({}); // Map of userId -> user object
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState({}); // conversationId -> messages array
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterType, setFilterType] = useState("all"); // all, direct, groups, system, flagged
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState({});
  const [typingUsers, setTypingUsers] = useState({}); // conversationId -> Set of userIds
  const [onlineUsers, setOnlineUsers] = useState(new Set()); // Set of online user IDs
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef({}); // conversationId -> timeout

  const currentUserId = user?.id || user?.userId;

  // Initialize Socket.io connection
  useEffect(() => {
    if (!currentUserId) return;

    const socket = connectSocket();
    if (!socket) return;

    socketRef.current = socket;

    // Handle successful connection
    socket.on("connect", () => {
      console.log("✅ Socket.io connected");
    });

    // Handle disconnection
    socket.on("disconnect", (reason) => {
      console.log("❌ Socket.io disconnected:", reason);
    });

    // Handle connection errors
    socket.on("connect_error", (error) => {
      console.error("Socket.io connection error:", error.message);
    });

    // Join conversation room when active user changes
    if (activeUser?.conversationId) {
      socket.emit("join_conversation", { conversationId: activeUser.conversationId });
    }

    // Handle new message event
    socket.on("new_message", (data) => {
      const { conversationId, message } = data;
      
      if (!conversationId || !message) return;

      // Transform message to frontend format
      const isCurrentUser = message.senderId === currentUserId;
      const senderName = isCurrentUser 
        ? "me" 
        : (usersMap[message.senderId]?.name || "Unknown");
      
      const timestamp = message.createdAt || message.timestamp;
      const date = timestamp ? new Date(timestamp) : new Date();
      
      const transformedMessage = {
        id: message.id,
        sender: senderName,
        text: message.content || "",
        time: date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: timestamp || date.toISOString(),
        status: "delivered"
      };

      // Add message to state
      setMessages(prev => {
        const existingMessages = prev[conversationId] || [];
        // Check if message already exists (avoid duplicates)
        if (existingMessages.some(m => m.id === transformedMessage.id)) {
          return prev;
        }
        return {
          ...prev,
          [conversationId]: [...existingMessages, transformedMessage],
        };
      });

      // Update conversation list with new last message
      setConversations(prev => {
        return prev.map(conv => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              lastMessage: {
                id: message.id,
                content: message.content,
                senderId: message.senderId,
                timestamp: timestamp,
              },
              updatedAt: timestamp,
            };
          }
          return conv;
        });
      });

      // Auto-mark as read if this is the active conversation
      if (activeUser?.conversationId === conversationId && !isCurrentUser) {
        socket.emit("mark_read", { conversationId, messageIds: [message.id] });
      }
    });

    // Handle typing indicators
    socket.on("user_typing", (data) => {
      const { conversationId, userId, isTyping } = data;
      
      if (!conversationId || userId === currentUserId) return;

      setTypingUsers(prev => {
        const current = prev[conversationId] || new Set();
        const updated = new Set(current);
        
        if (isTyping) {
          updated.add(userId);
        } else {
          updated.delete(userId);
        }
        
        return {
          ...prev,
          [conversationId]: updated,
        };
      });
    });

    // Handle read receipts
    socket.on("messages_read", (data) => {
      const { conversationId, userId, messageIds } = data;
      
      // Update message status if needed
      if (activeUser?.conversationId === conversationId) {
        setMessages(prev => {
          const conversationMessages = prev[conversationId] || [];
          return {
            ...prev,
            [conversationId]: conversationMessages.map(msg => {
              if (messageIds.includes(msg.id)) {
                return { ...msg, status: "read" };
              }
              return msg;
            }),
          };
        });
      }
    });

    // Handle user status changes (online/offline)
    socket.on("user_status_change", (data) => {
      const { userId, status } = data;
      
      setOnlineUsers(prev => {
        const updated = new Set(prev);
        if (status === "online") {
          updated.add(userId);
        } else {
          updated.delete(userId);
        }
        return updated;
      });
    });

    // Handle joining conversation confirmation
    socket.on("joined_conversation", ({ conversationId }) => {
      console.log(`✅ Joined conversation ${conversationId}`);
    });

    // Handle errors from server
    socket.on("error", (error) => {
      console.error("Socket.io error:", error);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leave_conversation", { 
          conversationId: activeUser?.conversationId 
        });
      }
      disconnectSocket();
    };
  }, [currentUserId, activeUser?.conversationId, usersMap]);

  // Join/leave conversation rooms when active user changes
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) return;

    // Leave previous conversation
    // (This is handled by the cleanup above)

    // Join new conversation
    if (activeUser?.conversationId && !activeUser?.isSystem && !activeUser?.isFlagged) {
      socket.emit("join_conversation", { conversationId: activeUser.conversationId });
    }
  }, [activeUser?.conversationId]);

  // Fetch conversations and user details
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUserId) return;

      try {
        setLoadingConversations(true);

        // Fetch conversations
        const conversationsResponse = await getConversationsApi({});
        const conversationsData = conversationsResponse?.data?.data || conversationsResponse?.data || [];

        // Collect all participant IDs
        const participantIds = new Set();
        conversationsData.forEach(conv => {
          if (conv.otherParticipantIds?.length) {
            conv.otherParticipantIds.forEach(id => participantIds.add(id));
          }
          if (conv.participantIds?.length) {
            conv.participantIds.forEach(id => participantIds.add(id));
          }
        });

        // Fetch user details for all participants
        let usersData = [];
        if (participantIds.size > 0) {
          try {
            const usersResponse = await getChatUsersApi({ limit: 200 });
            usersData = usersResponse?.data?.data || usersResponse?.data || [];
            
            // Create users map
            const usersMapData = {};
            usersData.forEach(u => {
              usersMapData[u.id || u.userId] = u;
            });
            setUsersMap(usersMapData);
          } catch (error) {
            console.error("Error fetching user details:", error);
          }
        }

        setConversations(conversationsData);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoadingConversations(false);
      }
    };

    fetchData();
  }, [currentUserId]);

  // Transform conversations to chat user format
  const transformedConversations = useMemo(() => {
    return conversations.map(conv => {
      // For direct messages, get the other participant
      let displayName = conv.name || "Unknown";
      let displayRole = "developer";
      let otherParticipantUser = null;
      
      if (conv.type === "direct" && conv.otherParticipantIds?.length > 0) {
        const otherParticipantId = conv.otherParticipantIds[0];
        otherParticipantUser = usersMap[otherParticipantId];
        
        if (otherParticipantUser) {
          displayName = otherParticipantUser.name || otherParticipantUser.email || "Unknown User";
          displayRole = otherParticipantUser.role || "developer";
        }
      } else if (conv.type === "group") {
        displayRole = "group";
      }

      // Get last message text
      const lastMessageText = conv.lastMessage?.content || "";

      // Calculate last seen from lastReadAt or updatedAt
      const lastSeen = conv.participant?.lastReadAt 
        ? formatTime(conv.participant.lastReadAt)
        : formatTime(conv.updatedAt);

      // Get avatar
      const avatarUrl = otherParticipantUser?.avatarUrl || null;
      const avatar = avatarUrl ? null : getInitials(displayName);

      return {
        id: conv.id,
        conversationId: conv.id, // Keep reference to conversation ID
        name: displayName,
        role: displayRole,
        lastMessage: lastMessageText,
        lastSeen,
        isFavorite: conv.participant?.isFavorite || false,
        isArchived: conv.participant?.isArchived || false,
        unreadCount: conv.participant?.unreadCount || 0,
        status: onlineUsers.has(conv.otherParticipantIds?.[0] || conv.participantIds?.[0]) ? "online" : "offline",
        avatar,
        avatarUrl,
        chatType: conv.type,
        projectId: conv.projectId,
        isFlagged: conv.isFlagged || false,
        isGroup: conv.type === "group",
        otherParticipant: otherParticipantUser,
      };
    });
  }, [conversations, usersMap]);

  // Combine conversations with system notifications
  const allChatUsers = useMemo(() => {
    const chatUsers = [...transformedConversations];
    
    // Add system notifications for all roles
    chatUsers.push(...systemNotifications.filter(n => n.isSystem));

    // Add flagged chats only for admins
    if (user?.role === 'admin') {
      chatUsers.push(...systemNotifications.filter(n => n.isFlagged));
    }

    return chatUsers;
  }, [transformedConversations, user?.role]);

  // Role-based user filtering
  const getFilteredUsers = () => {
    if (!user?.role) return allChatUsers || [];

    const currentUserRole = user.role;
    
    return (allChatUsers || []).filter(chatUser => {
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

  // Fetch messages when a conversation is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeUser?.conversationId || activeUser?.isSystem || activeUser?.isFlagged) {
        return; // Don't fetch for system notifications or flagged chats
      }

      const conversationId = activeUser.conversationId;

      // If messages already loaded, don't reload
      if (messages[conversationId]?.length > 0) {
        return;
      }

      try {
        setLoadingMessages(prev => ({ ...prev, [conversationId]: true }));

        const messagesResponse = await getMessagesApi(conversationId, 50, 0);
        const messagesData = messagesResponse?.data?.data || messagesResponse?.data || [];

        // Transform messages to frontend format
        const transformedMessages = messagesData.map(msg => {
          const isCurrentUser = msg.senderId === currentUserId;
          const senderName = isCurrentUser 
            ? "me" 
            : (usersMap[msg.senderId]?.name || "Unknown");
          
          const timestamp = msg.createdAt || msg.timestamp;
          const date = timestamp ? new Date(timestamp) : new Date();
          
          return {
            id: msg.id,
            sender: senderName,
            text: msg.content || "",
            time: date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            timestamp: timestamp || date.toISOString(),
            status: msg.status || "delivered"
          };
        });

        setMessages(prev => ({
          ...prev,
          [conversationId]: transformedMessages,
        }));

        // Mark as read
        await markAsReadApi(conversationId);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoadingMessages(prev => ({ ...prev, [conversationId]: false }));
      }
    };

    fetchMessages();
  }, [activeUser?.conversationId, currentUserId, usersMap]);

  // Set default active user if none selected and users are available
  useEffect(() => {
    if (!activeUser && filteredUsers?.length > 0 && !loadingConversations) {
      setActiveUser(filteredUsers[0]);
    }
  }, [activeUser, filteredUsers, loadingConversations]);

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

  const handleSend = async (text) => {
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

    if (!text?.trim() || !activeUser?.conversationId) return;

    const conversationId = activeUser.conversationId;
    const socket = socketRef.current;

    try {
      // Try sending via Socket.io first (real-time)
      if (socket && socket.connected) {
        socket.emit("send_message", {
          conversationId,
          content: text.trim(),
          messageType: "text",
        });
        
        // Optimistically add message to UI
        const currentMessages = messages?.[conversationId] || [];
        const newMessage = {
          id: `temp-${Date.now()}`, // Temporary ID
          sender: "me",
          text: text.trim(),
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          timestamp: new Date().toISOString(),
          status: "sending"
        };
        
        setMessages(prev => ({
          ...prev,
          [conversationId]: [...currentMessages, newMessage],
        }));
      } else {
        // Fallback to REST API if Socket.io is not available
        await sendMessageApi({
          conversationId,
          content: text.trim(),
          messageType: "text",
        });

        // Optimistically add message to UI
        const currentMessages = messages?.[conversationId] || [];
        const newMessage = {
          id: Date.now(), // Temporary ID
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
          [conversationId]: [...currentMessages, newMessage],
        }));

        // Refresh messages to get the actual message from server
        const messagesResponse = await getMessagesApi(conversationId, 50, 0);
        const messagesData = messagesResponse?.data?.data || messagesResponse?.data || [];
        
        const transformedMessages = messagesData.map(msg => {
          const isCurrentUser = msg.senderId === currentUserId;
          const senderName = isCurrentUser 
            ? "me" 
            : (usersMap[msg.senderId]?.name || "Unknown");
          
          const timestamp = msg.createdAt || msg.timestamp;
          const date = timestamp ? new Date(timestamp) : new Date();
          
          return {
            id: msg.id,
            sender: senderName,
            text: msg.content || "",
            time: date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            timestamp: timestamp || date.toISOString(),
            status: msg.status || "delivered"
          };
        });

        setMessages(prev => ({
          ...prev,
          [conversationId]: transformedMessages,
        }));

        // Refresh conversations to update last message
        const conversationsResponse = await getConversationsApi({});
        const conversationsData = conversationsResponse?.data?.data || conversationsResponse?.data || [];
        setConversations(conversationsData);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle typing indicator
  const handleTyping = (isTyping) => {
    const socket = socketRef.current;
    if (!socket || !socket.connected || !activeUser?.conversationId) return;

    socket.emit("typing", {
      conversationId: activeUser.conversationId,
      isTyping,
    });

    // Clear existing timeout
    if (typingTimeoutRef.current[activeUser.conversationId]) {
      clearTimeout(typingTimeoutRef.current[activeUser.conversationId]);
    }

    // Auto-stop typing after 3 seconds of inactivity
    if (isTyping) {
      typingTimeoutRef.current[activeUser.conversationId] = setTimeout(() => {
        socket.emit("typing", {
          conversationId: activeUser.conversationId,
          isTyping: false,
        });
      }, 3000);
    }
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
          <MessageList 
            messages={activeUser?.conversationId 
              ? (messages?.[activeUser.conversationId] || []) 
              : []}
            typingUsers={typingUsers[activeUser?.conversationId] || new Set()}
          />
          {loadingMessages[activeUser?.conversationId] && (
            <div className="p-4 text-center text-gray-400">
              Loading messages...
            </div>
          )}
          {permissions?.canSendMessages && !activeUser?.isFlagged && (
            <ChatBox 
              onSend={handleSend} 
              onTyping={handleTyping}
              typingUsers={typingUsers[activeUser?.conversationId] || new Set()}
            />
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