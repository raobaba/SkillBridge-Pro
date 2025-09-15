import React from "react";
import { motion } from "framer-motion";

const MessageItem = ({ message }) => {
  const isSent = message.sender === "me";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex items-end gap-2 ${isSent ? "justify-end" : "justify-start"} mb-3`}
    >
      {/* Avatar for received messages */}
      {!isSent && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
          {message.sender.charAt(0)}
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`group px-4 py-2 rounded-2xl max-w-[70%] sm:max-w-[60%] text-sm shadow-md transition ${
          isSent
            ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-none"
            : "bg-white/20 text-gray-200 rounded-bl-none"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        <span
          className={`block text-[10px] mt-1 ${
            isSent ? "text-right text-gray-300" : "text-left text-gray-400"
          }`}
        >
          {message.time}
        </span>
      </div>
    </motion.div>
  );
};

export default MessageItem;
