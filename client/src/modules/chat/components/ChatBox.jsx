import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile, Mic, MicOff } from "lucide-react";


const ChatBox = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef(null);

  const handleSend = () => {
    if (!message?.trim()) return;
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
    setMessage(e?.target?.value || "");
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    // Voice recording functionality would be implemented here
  };

  const handleFileUpload = () => {
    // File upload functionality would be implemented here
    console.log("File upload clicked");
  };

  const handleEmojiClick = () => {
    // Emoji picker functionality would be implemented here
    console.log("Emoji picker clicked");
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
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm p-4 shadow-2xl border border-white/10 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 blur-2xl"></div>

        <div className="relative z-10">
          {/* Main input area */}
          <div className="flex items-center gap-3">
            {/* Attachment button */}
            <button
              onClick={handleFileUpload}
              className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 hover:from-blue-500/30 hover:via-purple-500/30 hover:to-pink-500/30 transition-all duration-300 hover:scale-110 group"
              title="Attach file"
            >
              <Paperclip className="w-5 h-5 text-gray-300 group-hover:text-blue-300 transition-colors duration-300" />
            </button>

            {/* Message input */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                aria-label="Type a message"
                placeholder="Type your message here..."
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-3 rounded-xl bg-black/20 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 border border-white/10 transition-all duration-300 hover:border-blue-500/30"
              />

              {/* Character count */}
              {(message?.length || 0) > 0 && (
                <div className="absolute bottom-1 right-3 text-xs text-gray-500">
                  {message?.length || 0}
                </div>
              )}
            </div>

            {/* Emoji button */}
            <button
              onClick={handleEmojiClick}
              className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 hover:from-blue-500/30 hover:via-purple-500/30 hover:to-pink-500/30 transition-all duration-300 hover:scale-110 group"
              title="Add emoji"
            >
              <Smile className="w-5 h-5 text-gray-300 group-hover:text-blue-300 transition-colors duration-300" />
            </button>

            {/* Voice recording button */}
            <button
              onClick={handleVoiceToggle}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 group ${isRecording
                  ? "bg-gradient-to-br from-red-500/30 via-pink-500/30 to-red-500/30 animate-pulse"
                  : "bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 hover:from-blue-500/30 hover:via-purple-500/30 hover:to-pink-500/30"
                }`}
              title={isRecording ? "Stop recording" : "Start voice message"}
            >
              {isRecording ? (
                <MicOff className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors duration-300" />
              ) : (
                <Mic className="w-5 h-5 text-gray-300 group-hover:text-blue-300 transition-colors duration-300" />
              )}
            </button>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!message?.trim()}
              className={`p-3 rounded-xl transition-all duration-300 ${message?.trim()
                  ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
                  : "bg-gray-600/50 opacity-50 cursor-not-allowed"
                }`}
              title="Send message"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
