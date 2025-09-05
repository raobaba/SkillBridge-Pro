import React from "react";

const Button = ({
  children,
  onClick,
  variant = "default", // default, outline, ghost, link
  size = "md", // sm, md, lg
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = "",
  type = "button",
  ...props
}) => {
  // Variant classes
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
    ghost: "bg-transparent text-blue-600 hover:bg-blue-100",
    link: "bg-transparent text-blue-600 underline hover:text-blue-800",
  };

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 
        ${variantClasses[variant]} ${sizeClasses[size]} 
        ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      {...props}
    >
      {LeftIcon && <LeftIcon className="w-4 h-4" />}
      {children}
      {RightIcon && <RightIcon className="w-4 h-4" />}
    </button>
  );
};

export default Button;
