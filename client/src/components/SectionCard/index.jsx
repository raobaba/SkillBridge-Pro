import React from 'react';

const SectionCard = ({ 
  icon: Icon, 
  title, 
  children, 
  iconColor = "text-blue-400",
  className = "",
  headerClassName = ""
}) => {
  return (
    <div className={`bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 ${className}`}>
      <h3 className={`text-xl font-semibold text-white mb-4 flex items-center gap-2 ${headerClassName}`}>
        {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
        {title}
      </h3>
      {children}
    </div>
  );
};

export default SectionCard;
