import React from "react";

const Features = ({ features, activeFeature, setActiveFeature }) => {
  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Powerful Features for
            <span className="text-blue-400"> Professional Growth</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Bridge your skills to success with comprehensive tools for matching,
            collaboration, and career advancement.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Feature Cards */}
          <div className="grid gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                  activeFeature === index
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-3 rounded-lg ${
                      activeFeature === index ? "bg-blue-500" : "bg-gray-700"
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Showcase */}
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-white/10">
            <div className="aspect-square bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
              <div className="text-6xl">{features[activeFeature].icon}</div>
            </div>
            <h3 className="text-2xl font-bold mb-4">
              {features[activeFeature].title}
            </h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              {features[activeFeature].description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
