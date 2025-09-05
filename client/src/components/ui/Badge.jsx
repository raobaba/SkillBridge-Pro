import React from "react";

export const Badge = ({ children, variant = "default" }) => {
  // You can define different variants for styling
  const variants = {
    default: "bg-white/10 text-gray-200",
    info: "bg-blue-500/20 text-blue-300",
    success: "bg-green-500/20 text-green-300",
    warning: "bg-yellow-500/20 text-yellow-300",
    error: "bg-red-500/20 text-red-300",
  };

  const classes = `text-xs px-2 py-1 rounded-full font-medium ${variants[variant] || variants.default}`;

  return <span className={classes}>{children}</span>;
};
