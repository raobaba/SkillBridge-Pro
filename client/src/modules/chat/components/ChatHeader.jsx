import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { User, Phone, Video, MoreVertical, Search, Settings, Archive, Star, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import ParticipantListModal from "./ParticipantListModal";
import { ConfirmModal } from "../../../components";
import { deleteGroupConversation } from "../slice/chatSlice";

const ChatHeader = ({ user, permissions }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state?.user || {});
  const currentUserRole = currentUser?.role || currentUser?.roles?.[0];
  const isProjectOwner = currentUserRole === 'project-owner';
  const isDeveloper = currentUserRole === 'developer';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [lastSeen, setLastSeen] = useState("Active now");
  const menuRef = useRef(null);

  // Handle clicks outside menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        console.log('[Menu] Click outside detected, closing menu');
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      // Use a small delay to ensure the click event on button processes first
      document.addEventListener('mousedown', handleClickOutside, true);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside, true);
      };
    }
  }, [isMenuOpen]);

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

  const handleDeleteGroup = (e) => {
    console.log('[Delete Conversation] 🚀 handleDeleteGroup function called!', e);
    
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    // Get conversationId from user object (could be conversationId or id)
    const conversationId = user?.conversationId || user?.id;
  
    // Validate conversationId exists (for both group and direct chats)
    if (!conversationId) {
      console.error('[Delete Conversation] ❌ Missing conversationId', { 
        conversationId: conversationId, 
        isGroup: user?.isGroup,
        user: user
      });
      toast.error('Cannot delete: Invalid conversation');
      setIsMenuOpen(false);
      return;
    }
    
    // Close the dropdown menu and open confirmation modal
    console.log('[Delete Conversation] ⏳ Opening confirmation modal...');
    setIsMenuOpen(false);
    setIsDeleteConfirmModalOpen(true);
  };

  const handleConfirmDeleteGroup = async () => {
    // Get conversationId from user object (could be conversationId or id)
    const conversationId = user?.conversationId || user?.id;
    const conversationType = user?.isGroup ? 'group' : 'direct chat';
    
    console.log('[Delete Conversation] ✅ User confirmed deletion. Starting...', conversationId);
    setIsDeleteConfirmModalOpen(false);
    setIsDeleting(true);
    
    try {
      console.log('[Delete Conversation] 📡 Dispatching deleteGroupConversation action...', Number(conversationId));
      const result = await dispatch(deleteGroupConversation(Number(conversationId))).unwrap();
      console.log('[Delete Conversation] ✅ Success! Result:', result);
      toast.success(`${user?.isGroup ? 'Group' : 'Chat'} "${user?.name || 'chat'}" has been deleted successfully`);
      
      // Navigate away from the deleted conversation
      console.log('[Delete Conversation] 🔄 Navigating to /chat...');
      navigate('/chat');
      
      // Refresh conversations list
      setTimeout(() => {
        console.log('[Delete Conversation] 🔄 Dispatching refresh event...');
        window.dispatchEvent(new CustomEvent('refreshConversations'));
      }, 100);
    } catch (error) {
      console.error('[Delete Conversation] ❌ Error caught:', error);
      console.error('[Delete Conversation] ❌ Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status,
        payload: error?.payload,
        fullError: error
      });
      const errorMessage = error?.payload?.message || error?.message || error?.response?.data?.message || `Failed to delete ${conversationType}. Please try again.`;
      console.error('[Delete Conversation] ❌ Error message to show:', errorMessage);
      toast.error(errorMessage);
    } finally {
      console.log('[Delete Conversation] 🏁 Finally block - setting isDeleting to false');
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative">
      {/* Enhanced Chat Header Container */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm p-4 shadow-2xl border-b border-white/10 relative z-50" style={{ overflow: 'visible' }}>
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 blur-3xl"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          {/* Enhanced User Info */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                {user?.name?.charAt(0) || '?'}
              </div>
              {/* Enhanced Online status dot */}
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full animate-pulse shadow-lg">
                <span className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></span>
              </span>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 
                  className={`text-white font-semibold text-lg ${user?.isGroup ? 'cursor-pointer hover:text-purple-300 transition-colors' : ''}`}
                  onClick={() => user?.isGroup && setIsParticipantsModalOpen(true)}
                  title={user?.isGroup ? 'Click to view participants' : ''}
                >
                  {user?.name || 'Unknown User'}
                </h2>
                {/* Role indicators */}
                {user?.isSystem && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded border border-yellow-500/30">
                    System
                  </span>
                )}
                {user?.isFlagged && (
                  <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded border border-red-500/30">
                    Flagged
                  </span>
                )}
                {user?.isGroup && (
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded border border-purple-500/30">
                    Group Chat
                  </span>
                )}
                {!user?.isSystem && !user?.isFlagged && !user?.isGroup && user?.role && (
                  <span className={`px-2 py-1 text-xs rounded border ${
                    user.role === 'project-owner' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                    user.role === 'developer' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                    'bg-gray-500/20 text-gray-300 border-gray-500/30'
                  }`}>
                    {user.role?.replace('_', ' ').toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  user?.isFlagged ? 'bg-red-400 animate-pulse' :
                  user?.isSystem ? 'bg-yellow-400' :
                  user?.status === 'online' ? 'bg-green-400 animate-pulse' :
                  user?.status === 'away' ? 'bg-yellow-400' :
                  'bg-gray-400'
                }`}></div>
                <p className="text-sm text-gray-300">
                  {user?.isSystem ? 'System notifications' :
                   user?.isFlagged ? 'Flagged for moderation' :
                   user?.isGroup ? 'Group chat' :
                   lastSeen}
                </p>
              </div>
            </div>
          </div>

          {/* Role-based Action Icons */}
          <div className="flex items-center gap-2">
            {/* Voice Call button - only for direct chats */}
            {!user?.isSystem && !user?.isFlagged && permissions?.canSendMessages && (
              <Button
                onClick={() => handleCall('Voice')}
                variant="ghost"
                size="sm"
                className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 hover:from-blue-500/30 hover:via-purple-500/30 hover:to-pink-500/30 transition-all duration-300 hover:scale-110 group"
                title="Voice Call"
              >
                <Phone className="w-5 h-5 text-gray-300 group-hover:text-green-400 transition-colors duration-300" />
              </Button>
            )}

            {/* Video Call button - only for direct chats */}
            {!user?.isSystem && !user?.isFlagged && permissions?.canSendMessages && (
              <Button
                onClick={() => handleCall('Video')}
                variant="ghost"
                size="sm"
                className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 hover:from-blue-500/30 hover:via-purple-500/30 hover:to-pink-500/30 transition-all duration-300 hover:scale-110 group"
                title="Video Call"
              >
                <Video className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-colors duration-300" />
              </Button>
            )}

            {/* Moderation actions for flagged chats */}
            {user?.isFlagged && permissions?.canModerate && (
              <Button
                onClick={() => console.log('Resolve flagged chat')}
                variant="ghost"
                size="sm"
                className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300 hover:scale-110 group"
                title="Resolve Flagged Chat"
              >
                <Star className="w-5 h-5 text-gray-300 group-hover:text-green-400 transition-colors duration-300" />
              </Button>
            )}

            {/* More Options Menu */}
            <div className="relative" style={{ zIndex: 99999 }}>
              <Button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                variant="ghost"
                size="sm"
                className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 hover:from-blue-500/30 hover:via-purple-500/30 hover:to-pink-500/30 transition-all duration-300 hover:scale-110 group"
                title="More options"
              >
                <MoreVertical className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
              </Button>

              {/* Enhanced Dropdown Menu with High Z-Index - Positioned absolutely to not affect parent height */}
              {isMenuOpen && (
                <div 
                  ref={menuRef}
                  data-menu-container
                  className="absolute right-0 top-full mt-2 w-56 bg-slate-900 rounded-xl border border-white/30 shadow-2xl overflow-hidden" 
                  style={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.98)', 
                    zIndex: 100000, 
                    backdropFilter: 'blur(12px)',
                    position: 'absolute'
                  }}
                  onClick={(e) => {
                    // Prevent clicks inside menu from closing it
                    console.log('[Menu Container] Click detected, stopping propagation');
                    e.stopPropagation();
                  }}
                  onMouseDown={(e) => {
                    // Also stop on mousedown to prevent any issues
                    e.stopPropagation();
                  }}
                >
                  <div className="p-1">
                    {/* Search */}
                    <Button
                      onClick={() => {
                        handleSearch();
                        setIsMenuOpen(false);
                      }}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-3 py-2.5 text-left text-sm text-gray-300 hover:text-white hover:bg-blue-500/20 rounded-lg flex items-center gap-3"
                      style={{ margin: 0, paddingLeft: '12px', paddingRight: '12px' }}
                    >
                      <Search className="w-4 h-4 flex-shrink-0" style={{ minWidth: '16px' }} />
                      <span className="text-left">Search Messages</span>
                    </Button>
                    
                    {/* View Profile */}
                    <Button
                      onClick={() => {
                        console.log("View profile clicked");
                        setIsMenuOpen(false);
                      }}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-3 py-2.5 text-left text-sm text-gray-300 hover:text-white hover:bg-blue-500/20 rounded-lg flex items-center gap-3"
                      style={{ margin: 0, paddingLeft: '12px', paddingRight: '12px' }}
                    >
                      <User className="w-4 h-4 flex-shrink-0" style={{ minWidth: '16px' }} />
                      <span className="text-left">View Profile</span>
                    </Button>

                    {/* Star/Favorite */}
                    <Button
                      onClick={() => {
                        handleStar();
                        setIsMenuOpen(false);
                      }}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-3 py-2.5 text-left text-sm text-gray-300 hover:text-white hover:bg-blue-500/20 rounded-lg flex items-center gap-3"
                      style={{ margin: 0, paddingLeft: '12px', paddingRight: '12px' }}
                    >
                      <Star className="w-4 h-4 flex-shrink-0" style={{ minWidth: '16px' }} />
                      <span className="text-left">Add to Favorites</span>
                    </Button>

                    {/* Archive */}
                    <Button
                      onClick={() => {
                        handleArchive();
                        setIsMenuOpen(false);
                      }}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-3 py-2.5 text-left text-sm text-gray-300 hover:text-white hover:bg-blue-500/20 rounded-lg flex items-center gap-3"
                      style={{ margin: 0, paddingLeft: '12px', paddingRight: '12px' }}
                    >
                      <Archive className="w-4 h-4 flex-shrink-0" style={{ minWidth: '16px' }} />
                      <span className="text-left">Archive Chat</span>
                    </Button>

                    {/* Settings */}
                    <Button
                      onClick={() => {
                        handleSettings();
                        setIsMenuOpen(false);
                      }}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-3 py-2.5 text-left text-sm text-gray-300 hover:text-white hover:bg-blue-500/20 rounded-lg flex items-center gap-3"
                      style={{ margin: 0, paddingLeft: '12px', paddingRight: '12px' }}
                    >
                      <Settings className="w-4 h-4 flex-shrink-0" style={{ minWidth: '16px' }} />
                      <span className="text-left">Chat Settings</span>
                    </Button>

                    {/* Divider */}
                    <div className="my-2 border-t border-white/10"></div>

                    {/* Delete Conversation - For project owners in group chats OR developers in direct chats they started */}
                    {((isProjectOwner && user?.isGroup) || (isDeveloper && !user?.isGroup)) && (
                      <Button
                        onClick={(e) => {
                          console.log('[Delete Conversation] ✅✅✅ Button onClick triggered!', {
                            event: e,
                            type: e?.type,
                            target: e?.target,
                            defaultPrevented: e?.defaultPrevented,
                            isDeleting,
                            conversationId: user?.conversationId || user?.id,
                            isGroup: user?.isGroup,
                            userRole: currentUserRole
                          });
                          if (e) {
                            e.stopPropagation();
                            e.preventDefault();
                          }
                          console.log('[Delete Conversation] About to call handleDeleteGroup...');
                          handleDeleteGroup(e);
                        }}
                        variant="ghost"
                        size="sm"
                        disabled={isDeleting}
                        className="w-full justify-start px-3 py-2.5 text-left text-sm text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg flex items-center gap-3"
                        style={{ margin: 0, paddingLeft: '12px', paddingRight: '12px', cursor: 'pointer' }}
                      >
                        {isDeleting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-400 flex-shrink-0" style={{ minWidth: '16px' }}></div>
                        ) : (
                          <Trash2 className="w-4 h-4 flex-shrink-0" style={{ minWidth: '16px' }} />
                        )}
                        <span className="text-left">{isDeleting ? 'Deleting...' : user?.isGroup ? 'Delete Group' : 'Delete Chat'}</span>
                      </Button>
                    )}

                    {/* Mute Notifications */}
                    <Button
                      onClick={() => {
                        console.log("Mute notifications clicked");
                        setIsMenuOpen(false);
                      }}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start px-3 py-2.5 text-left text-sm text-gray-300 hover:text-white hover:bg-blue-500/20 rounded-lg flex items-center gap-3"
                      style={{ margin: 0, paddingLeft: '12px', paddingRight: '12px' }}
                    >
                      <Phone className="w-4 h-4 flex-shrink-0" style={{ minWidth: '16px' }} />
                      <span className="text-left">Mute Notifications</span>
                    </Button>

                    {/* Block User - Only for direct chats */}
                    {!user?.isGroup && (
                      <Button
                        onClick={() => {
                          console.log("Block user clicked");
                          setIsMenuOpen(false);
                        }}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start px-3 py-2.5 text-left text-sm text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg flex items-center gap-3"
                        style={{ margin: 0, paddingLeft: '12px', paddingRight: '12px' }}
                      >
                        <MoreVertical className="w-4 h-4 flex-shrink-0" style={{ minWidth: '16px' }} />
                        <span className="text-left">Block User</span>
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Participants Modal */}
      {user?.isGroup && (
        <ParticipantListModal
          isOpen={isParticipantsModalOpen}
          onClose={() => setIsParticipantsModalOpen(false)}
          conversationId={user?.conversationId}
          conversationName={user?.name}
          conversationType={user?.chatType || (user?.isGroup ? 'group' : 'direct')}
        />
      )}

      {/* Delete Conversation Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteConfirmModalOpen}
        title={user?.isGroup ? "Delete Group" : "Delete Chat"}
        message={`Are you sure you want to delete ${user?.isGroup ? `the group "${user?.name || 'this group'}"` : `this conversation with "${user?.name || 'this user'}"`}? This action cannot be undone.`}
        onConfirm={handleConfirmDeleteGroup}
        onCancel={() => setIsDeleteConfirmModalOpen(false)}
        onClose={() => setIsDeleteConfirmModalOpen(false)}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="default"
        cancelVariant="ghost"
      />
    </div>
  );
};

export default ChatHeader;
