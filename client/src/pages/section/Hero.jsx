import React from "react";
const Hero = ({heroContent}) => {
  return (
    <section className='relative overflow-hidden pt-20'>
      <div className='absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl'></div>
      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32'>
        <div className='text-center'>
          <h1 className='text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>
            {heroContent.title}
          </h1>
          <p className='text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed'>
            {heroContent.subtitle}
          </p>

          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            {heroContent.buttons.map((btn, idx) => (
              <button key={idx} className={btn.className}>
                {btn.label}
                {btn.icon}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
