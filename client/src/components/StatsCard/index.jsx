import React from 'react';

const StatsCard = ({ 
  icon: Icon, 
  value, 
  label, 
  description, 
  gradientFrom, 
  gradientTo, 
  progressWidth, 
  className = "" 
}) => {
  return (
    <div className={`bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <h3 className="text-white font-semibold mb-1">{label}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
      {progressWidth !== undefined && (
        <div className="mt-3 h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${gradientFrom} ${gradientTo}`}
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default StatsCard;
