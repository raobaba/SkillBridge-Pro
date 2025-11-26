import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, Mic, MicOff } from "lucide-react";
import {Button,Input} from "../../../components"


const ChatBox = ({ onSend, onTyping, typingUsers }) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleSend = () => {
    if (!message?.trim()) return;
    
    // Stop typing indicator
    onTyping?.(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    
    onSend?.(message);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    const newValue = e?.target?.value || "";
    setMessage(newValue);

    // Handle typing indicator
    if (onTyping) {
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Start typing indicator if there's text
      if (newValue.trim().length > 0) {
        onTyping(true);
        
        // Auto-stop typing after 3 seconds of no input
        typingTimeoutRef.current = setTimeout(() => {
          onTyping(false);
        }, 3000);
      } else {
        // Stop typing if input is empty
        onTyping(false);
      }
    }
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    // Voice recording functionality would be implemented here
  };

  const handleFileUpload = () => {

  };

  const handleEmojiClick = () => {

  };

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="relative">
      {/* Enhanced Chat Input Container */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm py-1 px-3 shadow-2xl border border-white/10 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 blur-2xl"></div>

        <div className="relative z-10">
          {/* Main input area */}
          <div className="flex items-center gap-1.5">
            {/* Attachment button */}
            <Button
              onClick={handleFileUpload}
              variant="ghost"
              size="sm"
              className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 hover:from-blue-500/30 hover:via-purple-500/30 hover:to-pink-500/30 transition-all duration-300 group"
              title="Attach file"
            >
              <Paperclip className="w-4 h-4 text-gray-300 group-hover:text-blue-300 transition-colors duration-300" />
            </Button>

            {/* Message input */}
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                type="text"
                aria-label="Type a message"
                placeholder="Type your message here..."
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full px-2.5 py-1 rounded-lg bg-black/20 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 border border-white/10 transition-all duration-300 hover:border-blue-500/30 text-sm"
              />

              {/* Character count */}
              {(message?.length || 0) > 0 && (
                <div className="absolute bottom-0.5 right-2 text-[10px] text-gray-500">
                  {message?.length || 0}
                </div>
              )}
            </div>

            {/* Emoji button */}
            <Button
              onClick={handleEmojiClick}
              variant="ghost"
              size="sm"
              className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 hover:from-blue-500/30 hover:via-purple-500/30 hover:to-pink-500/30 transition-all duration-300 group"
              title="Add emoji"
            >
              <Smile className="w-4 h-4 text-gray-300 group-hover:text-blue-300 transition-colors duration-300" />
            </Button>

            {/* Voice recording button */}
            <Button
              onClick={handleVoiceToggle}
              variant="ghost"
              size="sm"
              className={`p-1.5 rounded-lg transition-all duration-300 group ${isRecording
                  ? "bg-gradient-to-br from-red-500/30 via-pink-500/30 to-red-500/30 animate-pulse"
                  : "bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 hover:from-blue-500/30 hover:via-purple-500/30 hover:to-pink-500/30"
                }`}
              title={isRecording ? "Stop recording" : "Start voice message"}
            >
              {isRecording ? (
                <MicOff className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors duration-300" />
              ) : (
                <Mic className="w-4 h-4 text-gray-300 group-hover:text-blue-300 transition-colors duration-300" />
              )}
            </Button>

            {/* Send button */}
            <Button
              onClick={handleSend}
              disabled={!message?.trim()}
              className={`p-1.5 rounded-lg transition-all duration-300 ${message?.trim()
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 hover:shadow-lg hover:shadow-blue-500/25"
                  : "bg-gray-600/50 opacity-50 cursor-not-allowed"
                }`}
              title="Send message"
            >
              <Send className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
