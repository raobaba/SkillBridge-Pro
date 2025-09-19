import React, { useState } from "react";
import { motion } from "framer-motion";
import { MoreVertical, Copy, Reply, Forward, Delete, Check, CheckCheck } from "lucide-react";

const MessageItem = ({ message }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const isSent = message.sender === "me";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    setShowMenu(false);
  };

  const handleReply = () => {
    console.log("Reply to:", message.text);
    setShowMenu(false);
  };

  const handleForward = () => {
    console.log("Forward:", message.text);
    setShowMenu(false);
  };

  const handleDelete = () => {
    console.log("Delete:", message.id);
    setShowMenu(false);
  };

  const getMessageStatus = () => {
    if (isSent) {
      if (message.status === "delivered") {
        return <CheckCheck className="w-3 h-3 text-blue-400" />;
      } else if (message.status === "sent") {
        return <Check className="w-3 h-3 text-gray-400" />;
      }
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex items-end gap-3 ${isSent ? "justify-end" : "justify-start"} mb-4 group`}
    >
      {/* Enhanced Avatar for received messages */}
      {!isSent && (
        <div className="relative group/avatar">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold shadow-lg group-hover/avatar:scale-110 transition-transform duration-300">
            {message.sender.charAt(0)}
          </div>
          {/* Online status dot */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full animate-pulse"></span>
        </div>
      )}

      {/* Enhanced Message Bubble */}
      <div className="relative group/message">
        <div
          className={`group px-4 py-3 rounded-2xl max-w-[70%] sm:max-w-[60%] text-sm shadow-lg transition-all duration-300 hover:shadow-xl ${
            isSent
              ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-br-none hover:from-blue-600 hover:via-purple-600 hover:to-pink-600"
              : "bg-black/20 backdrop-blur-sm text-gray-200 rounded-bl-none border border-white/10 hover:border-blue-500/30"
          }`}
        >
          {/* Message content */}
          <div className="relative">
            <p className="whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
            
            {/* Message metadata */}
            <div className={`flex items-center justify-between mt-2 ${
              isSent ? "flex-row-reverse" : "flex-row"
            }`}>
              <span className={`text-[10px] ${
                isSent ? "text-blue-100" : "text-gray-400"
              }`}>
                {message.time}
              </span>
              
              {/* Message status for sent messages */}
              {isSent && (
                <div className="flex items-center gap-1">
                  {getMessageStatus()}
                </div>
              )}
            </div>
          </div>

          {/* Message actions menu */}
          <div className={`absolute top-2 ${
            isSent ? "left-2" : "right-2"
          } opacity-0 group-hover/message:opacity-100 transition-opacity duration-300`}>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors duration-200"
                title="Message options"
              >
                <MoreVertical className="w-3 h-3 text-gray-300" />
              </button>

              {/* Dropdown menu */}
              {showMenu && (
                <div className={`absolute ${
                  isSent ? "left-0" : "right-0"
                } top-full mt-1 w-40 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10 shadow-xl overflow-hidden z-50`}>
                  <div className="p-1">
                    <button
                      onClick={handleCopy}
                      className="w-full px-3 py-2 text-left text-xs text-gray-300 hover:text-white hover:bg-blue-500/20 rounded-md transition-colors duration-200 flex items-center gap-2"
                    >
                      <Copy className="w-3 h-3" />
                      {isCopied ? "Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={handleReply}
                      className="w-full px-3 py-2 text-left text-xs text-gray-300 hover:text-white hover:bg-blue-500/20 rounded-md transition-colors duration-200 flex items-center gap-2"
                    >
                      <Reply className="w-3 h-3" />
                      Reply
                    </button>
                    <button
                      onClick={handleForward}
                      className="w-full px-3 py-2 text-left text-xs text-gray-300 hover:text-white hover:bg-blue-500/20 rounded-md transition-colors duration-200 flex items-center gap-2"
                    >
                      <Forward className="w-3 h-3" />
                      Forward
                    </button>
                    {isSent && (
                      <button
                        onClick={handleDelete}
                        className="w-full px-3 py-2 text-left text-xs text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-md transition-colors duration-200 flex items-center gap-2"
                      >
                        <Delete className="w-3 h-3" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message tail */}
        <div className={`absolute ${
          isSent ? "right-0 bottom-0" : "left-0 bottom-0"
        } w-3 h-3 ${
          isSent 
            ? "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" 
            : "bg-black/20 backdrop-blur-sm border-l border-b border-white/10"
        } transform rotate-45 translate-y-1 ${
          isSent ? "-translate-x-1" : "translate-x-1"
        }`}></div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        ></div>
      )}
    </motion.div>
  );
};

export default MessageItem;
