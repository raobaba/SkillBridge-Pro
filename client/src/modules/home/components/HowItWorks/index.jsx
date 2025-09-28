import React from "react";

const HowItWorks = ({ howItWorksContent }) => {
  return (
    <section id="how-it-works" className="py-20 bg-black/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            {howItWorksContent.heading}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {howItWorksContent.subtitle}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {howItWorksContent.steps.map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                {item.icon}
              </div>
              <div className="text-blue-400 font-bold text-lg mb-2">
                Step {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
              <p className="text-gray-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
