import React from 'react';
import { X } from 'lucide-react';
import Button from '../Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  iconBg = "bg-gradient-to-r from-blue-500 to-purple-500",
  children,
  size = "large", // small, medium, large, xlarge
  showCloseButton = true,
  closeOnBackdropClick = true,
  className = ""
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    small: "max-w-md",
    medium: "max-w-2xl", 
    large: "max-w-4xl",
    xlarge: "max-w-6xl"
  };

  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className={`bg-slate-900 rounded-2xl border border-white/10 w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden flex flex-col ${className}`}>
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={`p-2 ${iconBg} rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h3 className="text-2xl font-semibold text-white">{title}</h3>
              {subtitle && (
                <p className="text-gray-400 text-sm">{subtitle}</p>
              )}
            </div>
          </div>
          {showCloseButton && (
            <Button 
              onClick={onClose} 
              variant="ghost"
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-colors duration-300"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;