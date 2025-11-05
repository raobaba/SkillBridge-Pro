import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { X, User, Crown, Code, Users } from "lucide-react";
import { getConversationParticipantsApi, getChatUsersApi } from "../slice/chatAction";
import Button from "../../../components/Button";

const ParticipantListModal = ({ isOpen, onClose, conversationId, conversationName }) => {
  const { user } = useSelector((state) => state?.user || {});
  const currentUserId = user?.id || user?.userId;
  const [participants, setParticipants] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
                            className={`flex items-center gap-3 p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors ${isCurrentUser ? 'ring-1 ring-purple-500/50' : ''}`}
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
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadge(participant.role)}`}>
                              {getRoleLabel(participant.role)}
                            </span>
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

