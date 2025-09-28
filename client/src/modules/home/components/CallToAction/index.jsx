import React from "react";
import { useNavigate } from "react-router-dom";
import { getCTAButtons, handleNavigationAction } from "../../homeNavigationConfig";

const CallToAction = () => {
  const navigate = useNavigate();
  const ctaButtons = getCTAButtons();

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-12 border border-white/10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to <span className="text-blue-400">Bridge</span> Your Future?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already bridging their skills
            to success and transforming their careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {ctaButtons.map((button, index) => (
              <button
                key={index}
                className={button.className}
                onClick={() => handleNavigationAction(button.action, button.path, navigate)}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
