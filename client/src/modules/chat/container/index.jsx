import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import ChatBox from "../components/ChatBox";
import ChatSidebar from "../components/ChatSidebar";
import { useNavigate } from "react-router-dom";
import { Menu, X, Shield, Users, MessageCircle, AlertTriangle, Code, ArrowLeft } from "lucide-react";
import { CircularLoader } from "../../../components";
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
  const refreshTimeoutRef = useRef(null); // Ref to track refresh timeout
  const isRefreshingRef = useRef(false); // Flag to prevent multiple simultaneous refreshes

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
      console.log('[Socket] 📨 Received new_message event:', data);
      const { conversationId, message } = data;
      
      if (!conversationId || !message) {
        console.warn('[Socket] ⚠️ Invalid new_message data:', { conversationId, message });
        return;
      }
      
      console.log('[Socket] Processing message for conversation:', conversationId);

      // Transform message to frontend format
      const isCurrentUser = Number(message.senderId) === Number(currentUserId);
      const senderName = isCurrentUser 
        ? (user?.name || "You")
        : (usersMap[message.senderId]?.name || "Unknown");
      const senderRole = isCurrentUser 
        ? (user?.role || "developer")
        : (usersMap[message.senderId]?.role || "developer");
      
      const timestamp = message.createdAt || message.timestamp;
      const date = timestamp ? new Date(timestamp) : new Date();
      
      const transformedMessage = {
        id: message.id,
        sender: isCurrentUser ? "me" : senderName, // Keep "me" for isSent check
        senderId: message.senderId, // Include senderId for robust isSent check
        senderName: senderName, // Actual name for display
        senderRole: senderRole, // Role for display
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
          console.log('[Socket] ⚠️ Message already exists, skipping duplicate:', transformedMessage.id);
          return prev;
        }
        console.log('[Socket] ✅ Adding message to state:', transformedMessage);
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
      
      if (!conversationId || Number(userId) === Number(currentUserId)) return;

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
  }, [currentUserId, activeUser?.conversationId, usersMap, user]);

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
  const fetchConversations = useCallback(async () => {
      if (!currentUserId) return;

      try {
        setLoadingConversations(true);
      console.log('[ChatContainer] Fetching conversations for user:', currentUserId, 'role:', user?.role);

        // For project owners: Fetch groups they created (role=admin) + all direct messages
        // For developers: Fetch all conversations (groups + direct messages)
        let conversationsData = [];
        
                 if (user?.role === 'project-owner') {
           // Project owner: Fetch groups where they have participant role='project-owner' (created by them)
           // Backend will automatically filter by role='project-owner' when type='group' for project owners
           const groupsResponse = await getConversationsApi({ type: 'group' });
           const groupsData = groupsResponse?.data?.data || groupsResponse?.data || [];
           
           // Fetch all direct messages (no role filter for direct messages)
           const directResponse = await getConversationsApi({ type: 'direct' });
           const directData = directResponse?.data?.data || directResponse?.data || [];
           
           // Combine groups (they created with role='project-owner') + direct messages
           conversationsData = [...groupsData, ...directData];
           
           console.log('[ChatContainer] Project owner conversations:', {
             groupsCreated: groupsData.length,
             directMessages: directData.length,
             total: conversationsData.length
           });
        } else {
          // Developer: Fetch all conversations (groups they're in + direct messages)
          const conversationsResponse = await getConversationsApi({});
          conversationsData = conversationsResponse?.data?.data || conversationsResponse?.data || [];
          
          console.log('[ChatContainer] Developer conversations:', {
            total: conversationsData.length,
            conversations: conversationsData.map(c => ({ id: c.id, name: c.name, type: c.type }))
          });
        }

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

        // No need for client-side filtering - backend handles it based on role
        // For project owners: Backend returns only groups where role='admin' + all direct messages
        // For developers: Backend returns all conversations they're in
        
        // Merge server data with existing state to preserve manually added conversations
        setConversations(prev => {
          // Get IDs from server response
          const serverIds = new Set(conversationsData.map(c => c.id));
          
          // Keep manually added conversations that aren't in server response yet
          // (They should appear within a few seconds once backend commits)
          const manuallyAdded = prev.filter(conv => {
            // Keep conversations that:
            // 1. Are not in server response (manually added, not yet committed)
            // 2. Are group conversations (only type we manually add)
            // 3. Were created recently (within last 30 seconds)
            if (!serverIds.has(conv.id) && conv.type === 'group' && conv.createdAt) {
              const createdTime = new Date(conv.createdAt).getTime();
              const now = Date.now();
              const age = now - createdTime;
              // Keep if created within last 30 seconds
              if (age < 30000) {
                console.log(`[ChatContainer] Preserving manually added conversation ${conv.id} (not yet in server response)`);
                return true;
              }
            }
            return false;
          });
          
          // Combine: server data first (has latest info), then manually added that aren't in server yet
          const merged = [...conversationsData, ...manuallyAdded];
         
         // Remove duplicates (in case server now has the conversation)
         const unique = merged.reduce((acc, conv) => {
           if (!acc.find(c => c.id === conv.id)) {
             acc.push(conv);
           }
           return acc;
         }, []);
         
         // After setting state, check if we need to select a conversation from URL
         // Use setTimeout to ensure state update is processed first
         setTimeout(() => {
           const searchParams = new URLSearchParams(window.location.search);
           const conversationIdParam = searchParams.get('conversationId');
           const createdParam = searchParams.get('created');
           
           if (conversationIdParam) {
             // Check in the merged conversations (both server and manually added)
             const foundConv = unique.find(c => c.id === Number(conversationIdParam));
             if (foundConv) {
               console.log('[ChatContainer] Selecting conversation from URL:', foundConv.id);
               // Transform and select it
               const transformed = {
                 id: foundConv.id,
                 conversationId: foundConv.id,
                 name: foundConv.name || 'Group Chat',
                 role: foundConv.type === 'group' ? 'group' : 'developer',
                 chatType: foundConv.type,
                 isGroup: foundConv.type === 'group',
               };
               setActiveUser(transformed);
               // Clean up URL
               window.history.replaceState({}, '', '/chat');
               return;
             }
           }
           
           // Fallback: Find the most recent group conversation if created param exists
           if (createdParam && unique.length > 0) {
             const groupConversations = unique.filter(c => c.type === 'group');
             if (groupConversations.length > 0) {
               const newestConv = groupConversations.sort((a, b) => 
                 new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt)
               )[0];
               console.log('[ChatContainer] Selecting newly created group conversation:', newestConv.id);
               // Transform and select it
               const transformed = {
                 id: newestConv.id,
                 conversationId: newestConv.id,
                 name: newestConv.name || 'Group Chat',
                 role: 'group',
                 chatType: 'group',
                 isGroup: true,
               };
               setActiveUser(transformed);
             }
           }
         }, 0);
         
         return unique;
       });
      } catch (error) {
        console.error("Error fetching conversations:", error);
      console.error("Error details:", error.response || error.message);
      } finally {
        setLoadingConversations(false);
      }
  }, [currentUserId, user?.role]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Listen for refresh event and URL parameter
  useEffect(() => {
    // Check for refresh parameter in URL (only once)
    const checkAndRefresh = () => {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('refresh') === 'true' && !isRefreshingRef.current) {
        // Remove the refresh parameter from URL
        window.history.replaceState({}, '', '/chat');
        
        // Set refreshing flag
        isRefreshingRef.current = true;
        
        // Single refresh attempt (no retries for URL parameter)
        setTimeout(async () => {
          try {
            await fetchConversations();
          } catch (error) {
            console.error('[ChatContainer] Error refreshing conversations from URL:', error);
          } finally {
            isRefreshingRef.current = false;
          }
        }, 500);
      }
    };

    // Initial check (only once)
    checkAndRefresh();

    // Listen for custom refresh event with retry logic
    const handleRefresh = (event) => {
      // Prevent multiple simultaneous refresh attempts
      if (isRefreshingRef.current) {
        console.log('[ChatContainer] Refresh already in progress, skipping...');
        return;
      }
      
      console.log('[ChatContainer] Refresh event received:', event.detail);
      const eventDetail = event?.detail || {};
      const conversationId = eventDetail.conversationId;
      const conversation = eventDetail.conversation;
      const action = eventDetail.action;
      
             // If we have conversation data from the event (just created or direct message), add it immediately to state
      if ((action === 'created' || action === 'direct_message') && conversation && conversation.id) {
        console.log('[ChatContainer] Adding newly created/conversation to state immediately:', conversation.id, action);
        
        // Transform the conversation to match our format
        const transformedConv = {
          id: conversation.id,
          type: conversation.type || (action === 'direct_message' ? 'direct' : 'group'),
          name: conversation.name || (action === 'direct_message' ? 'Direct Message' : 'Group Chat'),
          projectId: conversation.projectId || null,
          status: conversation.status || 'active',
          isFlagged: conversation.isFlagged || false,
          lastMessage: null,
          participant: {
            unreadCount: 0,
            isArchived: false,
            isFavorite: false,
            isMuted: false,
            lastReadAt: null,
          },
          otherParticipantIds: conversation.otherParticipantIds || [],
          participantIds: conversation.participantIds || [],
          participants: conversation.participants || [],
          updatedAt: conversation.updatedAt || conversation.createdAt || new Date().toISOString(),
          createdAt: conversation.createdAt || new Date().toISOString(),
        };
        
        // Add to conversations state immediately
        setConversations(prev => {
          // Check if already exists to avoid duplicates
          const exists = prev.some(c => c.id === transformedConv.id);
          if (exists) {
            console.log('[ChatContainer] Conversation already exists in state, updating it');
            // Update existing conversation instead of skipping
            return prev.map(c => c.id === transformedConv.id ? transformedConv : c);
          }
          console.log('[ChatContainer] Adding new conversation to state:', transformedConv.id);
          // Add new conversation at the beginning (most recent first)
          return [transformedConv, ...prev];
        });
        
        // Transform and select it immediately
        const isDirect = action === 'direct_message' || transformedConv.type === 'direct';
        const transformed = {
          id: conversation.id,
          conversationId: conversation.id,
          name: conversation.name || (isDirect ? 'Direct Message' : 'Group Chat'),
          role: isDirect ? 'developer' : 'group',
          chatType: isDirect ? 'direct' : 'group',
          isGroup: !isDirect,
        };
        console.log('[ChatContainer] Selecting newly created/conversation:', transformed.id, action);
        setActiveUser(transformed);
      }
      
      // Only do a single refresh attempt if we have a conversation ID to look for
      if (conversationId && (action === 'created' || action === 'direct_message')) {
        // Set refreshing flag
        isRefreshingRef.current = true;
        
        // Single refresh attempt after a delay to allow backend to commit
        if (refreshTimeoutRef.current) {
          clearTimeout(refreshTimeoutRef.current);
        }
        
        refreshTimeoutRef.current = setTimeout(async () => {
          try {
            console.log('[ChatContainer] Refreshing conversations to sync with server...');
            await fetchConversations();
            
            // Conversation should be preserved by fetchConversations if it was manually added recently
            // No need to verify here since fetchConversations handles merging now
          } catch (error) {
            console.error('[ChatContainer] Error refreshing conversations:', error);
          } finally {
            isRefreshingRef.current = false;
          }
        }, 1000); // Single attempt after 1 second
      }
    };

    window.addEventListener('refreshConversations', handleRefresh);

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      window.removeEventListener('refreshConversations', handleRefresh);
      isRefreshingRef.current = false;
    };
  }, [fetchConversations]);

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

      // If messages already loaded, don't reload (unless it's a new group that might have welcome message)
      // For new groups, always fetch to ensure welcome message is visible
      const isNewGroup = activeUser?.isGroup && !messages[conversationId];
      if (messages[conversationId]?.length > 0 && !isNewGroup) {
        return;
      }

      try {
        setLoadingMessages(prev => ({ ...prev, [conversationId]: true }));

        const messagesResponse = await getMessagesApi(conversationId, 50, 0);
        const messagesData = messagesResponse?.data?.data || messagesResponse?.data || [];

        // Transform messages to frontend format
        const transformedMessages = messagesData.map(msg => {
          const isCurrentUser = Number(msg.senderId) === Number(currentUserId);
          const senderName = isCurrentUser 
            ? (user?.name || "You")
            : (usersMap[msg.senderId]?.name || "Unknown");
          const senderRole = isCurrentUser 
            ? (user?.role || "developer")
            : (usersMap[msg.senderId]?.role || "developer");
          
          const timestamp = msg.createdAt || msg.timestamp;
          const date = timestamp ? new Date(timestamp) : new Date();
          
          return {
            id: msg.id,
            sender: isCurrentUser ? "me" : senderName, // Keep "me" for isSent check
            senderId: msg.senderId, // Include senderId for robust isSent check
            senderName: senderName, // Actual name for display
            senderRole: senderRole, // Role for display
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
    console.log('[HandleSend] Starting send message process', { 
      text: text?.trim(), 
      conversationId: activeUser?.conversationId,
      userRole: user?.role,
      permissions: permissions?.canSendMessages 
    });

    // Check if user can send messages based on role and chat type
    if (!permissions?.canSendMessages) {
      console.warn("[HandleSend] ❌ You don't have permission to send messages in this chat");
      return;
    }

    // For flagged chats, admins have read-only access
    if (activeUser?.isFlagged && user?.role === 'admin') {
      console.warn("[HandleSend] ❌ This is a flagged chat - read-only access for moderation");
      return;
    }

    if (!text?.trim() || !activeUser?.conversationId) {
      console.warn("[HandleSend] ❌ Invalid input:", { text: text?.trim(), conversationId: activeUser?.conversationId });
      return;
    }

    const conversationId = activeUser.conversationId;
    const socket = socketRef.current;

    console.log('[HandleSend] Socket status:', { 
      hasSocket: !!socket, 
      connected: socket?.connected,
      socketId: socket?.id 
    });

    try {
      // Try sending via Socket.io first (real-time)
      if (socket && socket.connected) {
        console.log('[HandleSend] 📡 Sending via Socket.io');
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
          senderId: currentUserId, // Include senderId for robust isSent check
          senderName: user?.name || "You",
          senderRole: user?.role || "developer",
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
        
        console.log('[HandleSend] ✅ Message sent via Socket.io, optimistic update added');
      } else {
        // Fallback to REST API if Socket.io is not available
        console.log('[HandleSend] 📡 Socket.io not available, using REST API fallback');
        const response = await sendMessageApi({
          conversationId,
          content: text.trim(),
          messageType: "text",
        });
        
        console.log('[HandleSend] ✅ REST API response:', response);

        // Optimistically add message to UI
        const currentMessages = messages?.[conversationId] || [];
        const newMessage = {
          id: Date.now(), // Temporary ID
          sender: "me",
          senderId: currentUserId, // Include senderId for robust isSent check
          senderName: user?.name || "You",
          senderRole: user?.role || "developer",
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
        try {
          console.log('[HandleSend] 🔄 Refreshing messages from server...');
          const messagesResponse = await getMessagesApi(conversationId, 50, 0);
          const messagesData = messagesResponse?.data?.data || messagesResponse?.data || [];
          
          console.log('[HandleSend] 📨 Received messages from server:', messagesData.length);
          
          const transformedMessages = messagesData.map(msg => {
            const isCurrentUser = msg.senderId === currentUserId;
            const senderName = isCurrentUser 
              ? (user?.name || "You")
              : (usersMap[msg.senderId]?.name || "Unknown");
            const senderRole = isCurrentUser 
              ? (user?.role || "developer")
              : (usersMap[msg.senderId]?.role || "developer");
            
            const timestamp = msg.createdAt || msg.timestamp;
            const date = timestamp ? new Date(timestamp) : new Date();
            
            return {
              id: msg.id,
              sender: isCurrentUser ? "me" : senderName, // Keep "me" for isSent check
              senderName: senderName, // Actual name for display
              senderRole: senderRole, // Role for display
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
          
          console.log('[HandleSend] ✅ Messages updated in UI');

          // Refresh conversations to update last message
          // Use fetchConversations to ensure proper merging with manually added conversations
          await fetchConversations();
        } catch (refreshError) {
          console.error('[HandleSend] ⚠️ Error refreshing messages (non-critical):', refreshError);
          // Don't fail the send - message was already sent successfully
        }
      }
    } catch (error) {
      console.error("[HandleSend] ❌ Error sending message:", error);
      // Remove optimistic message if send failed
      setMessages(prev => {
        const conversationMessages = prev[conversationId] || [];
        // Remove the last temporary message if it exists
        const filtered = conversationMessages.filter(msg => 
          !msg.id.toString().startsWith('temp-') && msg.id !== Date.now()
        );
        return {
          ...prev,
          [conversationId]: filtered,
        };
      });
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
      {/* Enhanced Header with SkillBridge Pro Branding */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: SkillBridge Pro Logo & Back Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
                title="Go back to Dashboard"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-xl sm:text-2xl">
                    SkillBridge Pro
                  </span>
                  <div className="text-xs text-gray-400 mt-0.5">Communication Center</div>
                </div>
                <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors sm:hidden" />
              </button>
              
              {/* Mobile: Chat Title */}
              <div className="sm:hidden flex items-center gap-2 ml-2">
                <MessageCircle className="w-5 h-5 text-white" />
                <h1 className="text-lg font-bold text-white">Chat</h1>
              </div>
            </div>

            {/* Right: Role Badge & Desktop Description */}
            <div className="flex items-center gap-4">
              {/* Desktop: Description */}
              <div className="hidden md:block text-right">
                <p className="text-sm text-gray-300">
                  {user?.role === 'developer' && 'Chat with Project Owners & Join Group Discussions'}
                  {user?.role === 'project-owner' && 'Manage Team Communications & Project Chats'}
                  {user?.role === 'admin' && 'Monitor Flagged Chats & System Notifications'}
                </p>
              </div>
              
              {/* Role Badge */}
              {user?.role === 'admin' && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 rounded-lg border border-red-500/30">
                  <Shield className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-300 hidden sm:inline">Moderation Mode</span>
                </div>
              )}
              {user?.role === 'project-owner' && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-blue-300 hidden sm:inline">Team Management</span>
                </div>
              )}
              {user?.role === 'developer' && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 rounded-lg border border-green-500/30">
                  <MessageCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-300 hidden sm:inline">Collaboration</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile toggle button */}
      <div className="sm:hidden flex justify-start p-2 bg-slate-900 border-b border-white/10">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-700 text-white transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Chat Container */}
      <div className="flex h-[calc(100vh-112px)] sm:h-[calc(100vh-64px)] w-full max-w-full mx-auto overflow-hidden shadow-lg bg-slate-900">
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
            isLoading={loadingMessages[activeUser?.conversationId] || false}
            typingUsers={typingUsers[activeUser?.conversationId] || new Set()}
            currentUserId={currentUserId}
          />
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