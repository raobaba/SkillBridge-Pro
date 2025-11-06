import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { X, User, Crown, Code, Users, MessageCircle, UserMinus } from "lucide-react";
import { getConversationParticipantsApi, getChatUsersApi, getOrCreateDirectConversationApi } from "../slice/chatAction";
import { removeParticipantFromGroup } from "../slice/chatSlice";
import Button from "../../../components/Button";
import { toast } from "react-toastify";

const ParticipantListModal = ({ isOpen, onClose, conversationId, conversationName, conversationType }) => {
  const { user } = useSelector((state) => state?.user || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUserId = user?.id || user?.userId;
  const currentUserRole = user?.role || user?.roles?.[0];
  const isProjectOwner = currentUserRole === 'project-owner';
  const isGroupChat = conversationType === 'group';
  const [participants, setParticipants] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messagingUserId, setMessagingUserId] = useState(null); // Track which user we're messaging
  const [removingParticipantId, setRemovingParticipantId] = useState(null); // Track which participant is being removed

  useEffect(() => {
    if (isOpen && conversationId) {
      fetchParticipants();
    } else {
      // Reset state when modal closes
      setParticipants([]);
      setUsersMap({});
      setError(null);
    }
  }, [isOpen, conversationId]);

  const fetchParticipants = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch participants
      const participantsResponse = await getConversationParticipantsApi(conversationId);
      const participantsData = participantsResponse?.data?.data || participantsResponse?.data || [];
      setParticipants(participantsData);

      // Fetch user details for all participants
      if (participantsData.length > 0) {
        const userIds = participantsData.map(p => p.userId);
        const usersResponse = await getChatUsersApi({ limit: 200 });
        const allUsers = usersResponse?.data?.data || usersResponse?.data || [];
        
        // Create users map
        const usersMapData = {};
        allUsers.forEach(u => {
          usersMapData[u.id || u.userId] = u;
        });
        setUsersMap(usersMapData);
      }
    } catch (err) {
      console.error("Error fetching participants:", err);
      setError("Failed to load participants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'project-owner':
        return <Crown className="w-4 h-4 text-blue-400" />;
      case 'developer':
        return <Code className="w-4 h-4 text-green-400" />;
      default:
        return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'project-owner':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'developer':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'project-owner':
        return 'Project Owner';
      case 'developer':
        return 'Developer';
      default:
        return 'Member';
    }
  };

  // Handle direct message to a participant
  const handleDirectMessage = async (participantUserId, participantName) => {
    // Don't allow messaging yourself
    if (currentUserId && Number(participantUserId) === Number(currentUserId)) {
      toast.info("You can't message yourself");
      return;
    }

    setMessagingUserId(participantUserId);
    try {
      // Get or create direct conversation
      const response = await getOrCreateDirectConversationApi(participantUserId);
      const conversationData = response?.data?.data || response?.data;
      
      if (conversationData && conversationData.id) {
        // Close the modal first
        onClose();
        
        // Navigate to chat with the conversation ID
        navigate(`/chat?conversationId=${conversationData.id}&refresh=true`);
        
        // Dispatch event to refresh conversations in chat container
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('refreshConversations', { 
            detail: { 
              conversationId: conversationData.id,
              conversation: conversationData,
              action: 'direct_message'
            } 
          }));
        }, 100);
        
        toast.success(`Opening direct message with ${participantName || 'user'}`);
      } else {
        toast.error('Failed to create conversation. Please try again.');
      }
    } catch (error) {
      console.error('Error creating direct conversation:', error);
      toast.error(error?.response?.data?.message || 'Failed to start conversation. Please try again.');
    } finally {
      setMessagingUserId(null);
    }
  };

  // Handle removing participant from group (project owners only)
  const handleRemoveParticipant = async (participantUserId, participantName) => {
    // Don't allow removing yourself
    if (currentUserId && Number(participantUserId) === Number(currentUserId)) {
      toast.error("You cannot remove yourself from the group");
      return;
    }

    // Confirm removal
    if (!window.confirm(`Are you sure you want to remove ${participantName || 'this participant'} from the group?`)) {
      return;
    }

    setRemovingParticipantId(participantUserId);
    try {
      await dispatch(removeParticipantFromGroup({ 
        conversationId, 
        participantId: participantUserId 
      })).unwrap();
      
      toast.success(`${participantName || 'Participant'} has been removed from the group`);
      
      // Refresh the participant list
      await fetchParticipants();
      
      // Dispatch event to refresh conversations in chat container
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('refreshConversations'));
      }, 100);
    } catch (error) {
      console.error('Error removing participant:', error);
      toast.error(error?.message || error?.response?.data?.message || 'Failed to remove participant. Please try again.');
    } finally {
      setRemovingParticipantId(null);
    }
  };

  // Group participants by role
  const groupedParticipants = participants.reduce((acc, participant) => {
    const role = participant.role || 'member';
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(participant);
    return acc;
  }, {});

  // Order: project-owner first, then developer, then others
  const roleOrder = ['project-owner', 'developer', 'member'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-slate-900 rounded-2xl border border-white/20 shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">Group Participants</h2>
              <p className="text-gray-400 text-sm">{conversationName || 'Group Chat'}</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <Button
                onClick={fetchParticipants}
                variant="ghost"
                className="text-blue-400 hover:text-blue-300"
              >
                Retry
              </Button>
            </div>
          ) : participants.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No participants found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {roleOrder.map(role => {
                if (!groupedParticipants[role]) return null;
                
                return (
                  <div key={role}>
                    <div className="flex items-center gap-2 mb-3">
                      {getRoleIcon(role)}
                      <h3 className="text-gray-300 font-medium text-sm uppercase tracking-wide">
                        {getRoleLabel(role)}s ({groupedParticipants[role].length})
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {groupedParticipants[role].map((participant) => {
                        const participantUser = usersMap[participant.userId];
                        const isCurrentUser = currentUserId && Number(participant.userId) === Number(currentUserId);
                        // For current user, use Redux user data; otherwise use participant user data
                        const displayUser = isCurrentUser ? user : participantUser;
                        const displayName = isCurrentUser ? "You" : (participantUser?.name || participantUser?.username || `User ${participant.userId}`);
                        const userEmail = displayUser?.email || '';
                        // Use current user's name for avatar if it's them, otherwise use the participant's name
                        const avatarName = isCurrentUser 
                          ? (user?.name || user?.username || 'Y') 
                          : (participantUser?.name || participantUser?.username || `User ${participant.userId}`);
                        const userAvatar = displayUser?.avatar || avatarName.charAt(0).toUpperCase();

                        return (
                          <div
                            key={participant.id}
                            onClick={() => !isCurrentUser && handleDirectMessage(participant.userId, displayName)}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                              isCurrentUser 
                                ? 'bg-black/20 ring-1 ring-purple-500/50 cursor-default' 
                                : messagingUserId === participant.userId
                                ? 'bg-blue-500/20 hover:bg-blue-500/30 cursor-pointer'
                                : 'bg-black/20 hover:bg-blue-500/20 hover:ring-1 hover:ring-blue-500/30 cursor-pointer'
                            }`}
                          >
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                                {userAvatar}
                              </div>
                              <div className="absolute -bottom-1 -right-1">
                                {getRoleIcon(participant.role)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium text-sm truncate ${isCurrentUser ? 'text-purple-300' : 'text-white'}`}>
                                {displayName}
                              </p>
                              {userEmail && (
                                <p className="text-gray-400 text-xs truncate">{userEmail}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadge(participant.role)}`}>
                                {getRoleLabel(participant.role)}
                              </span>
                              <div className="flex items-center gap-1">
                                {!isCurrentUser && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDirectMessage(participant.userId, displayName);
                                    }}
                                    className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center"
                                    title={`Message ${displayName}`}
                                    disabled={messagingUserId === participant.userId}
                                  >
                                    {messagingUserId === participant.userId ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-400"></div>
                                    ) : (
                                      <MessageCircle className="w-4 h-4" />
                                    )}
                                  </button>
                                )}
                                {/* Show remove button for project owners in group chats, only for developers (not project owners) */}
                                {isProjectOwner && isGroupChat && !isCurrentUser && participant.role === 'developer' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveParticipant(participant.userId, displayName);
                                    }}
                                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-colors flex items-center justify-center"
                                    title={`Remove ${displayName} from group`}
                                    disabled={removingParticipantId === participant.userId}
                                  >
                                    {removingParticipantId === participant.userId ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-400"></div>
                                    ) : (
                                      <UserMinus className="w-4 h-4" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-end">
          <Button
            onClick={onClose}
            variant="ghost"
            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantListModal;

