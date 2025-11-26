import React from "react";

const Button = ({
  children,
  onClick,
  variant = "default", // default, outline, ghost, link, apply-grid, apply-list, apply-modal
  size = "md", // sm, md, lg
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = "",
  type = "button",
  isApplied = false, // For apply button variants
  ...props
}) => {
  // Variant classes
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline:
      "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
    ghost: "bg-transparent text-blue-600 hover:bg-blue-100",
    link: "bg-transparent text-blue-600 underline hover:text-blue-800",
    "apply-grid": isApplied 
      ? "bg-green-500/20 text-green-400 cursor-not-allowed" 
      : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white",
    "apply-list": isApplied 
      ? "bg-green-500/20 text-green-400 cursor-not-allowed" 
      : "bg-blue-500 hover:bg-blue-600 text-white",
    "apply-modal": isApplied 
      ? "bg-green-500/20 text-green-400 cursor-not-allowed" 
      : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white",
  };

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  // Apply button specific sizing
  const getApplyButtonSize = () => {
    if (variant === "apply-grid") return "px-3 py-2 text-sm";
    if (variant === "apply-list") return "px-4 py-2";
    if (variant === "apply-modal") return "px-4 py-2";
    return sizeClasses[size];
  };

  // Apply button specific classes
  const getApplyButtonClasses = () => {
    if (variant.startsWith("apply-")) {
      return `flex-1 rounded-lg font-semibold transition-all duration-300 ${getApplyButtonSize()}`;
    }
    return "";
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || (variant.startsWith("apply-") && isApplied)}
      className={`flex items-center justify-center gap-2 cursor-pointer
        ${variant.startsWith("apply-") ? getApplyButtonClasses() : `rounded-lg font-medium transition-all duration-200 ${sizeClasses[size]}`}
        ${variantClasses[variant]} 
        ${disabled || (variant.startsWith("apply-") && isApplied) ? "opacity-50 cursor-not-allowed" : ""} 
        ${className}`}
      {...props}
    >
      {LeftIcon && <LeftIcon className='w-4 h-4' />}
      {children}
      {RightIcon && <RightIcon className='w-4 h-4' />}
    </button>
  );
};

export default Button;
