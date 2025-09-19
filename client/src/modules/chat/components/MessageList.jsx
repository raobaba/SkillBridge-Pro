import React, { useEffect, useRef, useState } from "react";
import MessageItem from "./MessageItem";
import { ArrowDown, Loader2 } from "lucide-react";

const MessageList = ({ messages, isLoading = false }) => {
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isAtBottom]);

  // Handle scroll events
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setIsAtBottom(isNearBottom);
    setShowScrollButton(scrollTop > 200 && !isNearBottom);
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsAtBottom(true);
    setShowScrollButton(false);
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = [];
    let currentDate = null;
    let currentGroup = [];

    messages.forEach((message, index) => {
      const messageDate = new Date(message.timestamp || Date.now()).toDateString();
      
      if (currentDate !== messageDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: currentGroup });
        }
        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });

    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup });
    }

    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Enhanced Message Container */}
      <div 
        ref={messagesContainerRef}
        className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent"
        onScroll={handleScroll}
      >
        <div className="p-4 space-y-1">
          {messageGroups.map((group, groupIndex) => (
            <div key={group.date} className="space-y-1">
              {/* Date Separator */}
              <div className="flex items-center justify-center my-6">
                <div className="px-4 py-2 bg-black/20 backdrop-blur-sm rounded-full border border-white/10">
                  <span className="text-xs text-gray-400 font-medium">
                    {formatDate(group.date)}
                  </span>
                </div>
              </div>

              {/* Messages for this date */}
              {group.messages.map((msg, msgIndex) => (
                <MessageItem 
                  key={msg.id} 
                  message={msg}
                  isFirstInGroup={msgIndex === 0}
                  isLastInGroup={msgIndex === group.messages.length - 1}
                />
              ))}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-sm rounded-full border border-white/10">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                <span className="text-xs text-gray-400">Loading messages...</span>
              </div>
            </div>
          )}

          {/* Empty state */}
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Start a conversation</h3>
              <p className="text-sm text-gray-400 max-w-sm">
                Send a message to begin chatting. Your messages will appear here.
              </p>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} className="h-1" />
        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-4 p-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
          title="Scroll to bottom"
        >
          <ArrowDown className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/5 via-blue-900/5 to-indigo-900/5 pointer-events-none"></div>
    </div>
  );
};

export default MessageList;
