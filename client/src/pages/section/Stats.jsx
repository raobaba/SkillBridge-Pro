import React from "react";
const Stats = ({ stats }) => {
  return (
    <section className='py-16 bg-black/20 backdrop-blur-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-8'>
          {stats.map((stat, index) => (
            <div key={index} className='text-center'>
              <div className='text-3xl lg:text-4xl font-bold text-blue-400 mb-2'>
                {stat.value}
              </div>
              <div className='text-gray-400'>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
