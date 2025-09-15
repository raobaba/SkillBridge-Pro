import React, { useState } from "react";
import { Send } from "lucide-react";

const ChatBox = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() === "") return;
    onSend(message);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 flex items-center gap-3 bg-black/30 backdrop-blur-md">
      <input
        type="text"
        aria-label="Type a message"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 px-4 py-2 rounded-full bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        onClick={handleSend}
        disabled={!message.trim()}
        className={`p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white transition-transform ${
          message.trim()
            ? "hover:scale-105 active:scale-95"
            : "opacity-50 cursor-not-allowed"
        }`}
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ChatBox;
