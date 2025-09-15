import React, { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";

const MessageList = ({ messages }) => {
  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
