import React from 'react';

const MetricCard = ({ 
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
    <div className={`group bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all duration-300 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1)] ${className}`}>
      <div className="text-center">
        <div className={`mx-auto inline-flex p-2 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-lg mb-3`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="text-2xl font-bold text-white" title={description}>{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
      </div>
      {progressWidth !== undefined && (
        <div className="mt-3 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${gradientFrom} ${gradientTo}`}
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default MetricCard;
