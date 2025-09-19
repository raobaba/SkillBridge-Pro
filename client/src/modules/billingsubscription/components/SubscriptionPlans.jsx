import React from "react";
import { Star, Check, Zap, Crown, Building2 } from "lucide-react";

const SubscriptionPlans = () => {
  const plans = [
    {
      id: 1,
      name: "Basic",
      price: "$9.99",
      period: "month",
      features: ["1 Project", "Email Support", "Basic Analytics", "Standard Templates"],
      icon: <Zap className="w-4 h-4" />,
      popular: false,
      color: "from-blue-500 to-indigo-500"
    },
    {
      id: 2,
      name: "Pro",
      price: "$29.99",
      period: "month",
      features: ["10 Projects", "Priority Support", "Advanced Analytics", "Premium Templates", "API Access"],
      icon: <Crown className="w-4 h-4" />,
      popular: true,
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      name: "Enterprise",
      price: "$99.99",
      period: "month",
      features: ["Unlimited Projects", "24/7 Support", "Custom Analytics", "White-label", "Dedicated Manager"],
      icon: <Building2 className="w-4 h-4" />,
      popular: false,
      color: "from-emerald-500 to-teal-500"
    },
  ];

  const getPlanIcon = (plan) => {
    return plan.icon;
  };

  const getPlanColor = (plan) => {
    return plan.color;
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-2xl"></div>
      
      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
            <Star className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Subscription Plans
          </h2>
        </div>
        <p className="text-gray-300 text-sm">Choose the perfect plan for your needs and unlock your potential</p>
      </div>

      {/* Plans Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, idx) => (
          <div
            key={plan.id}
            className={`group relative bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.05] hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer overflow-hidden min-h-[400px] ${
              plan.popular ? 'ring-2 ring-blue-500/50' : ''
            }`}
            style={{
              animationDelay: `${idx * 200}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 z-20">
                <div className="px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold rounded-full shadow-lg">
                  Most Popular
                </div>
              </div>
            )}

            {/* Card background effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getPlanColor(plan)}/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl`}></div>
            
            {/* Card content */}
            <div className="relative z-10 flex flex-col items-center text-center h-full">
              {/* Plan Icon */}
              <div className={`w-12 h-12 bg-gradient-to-br ${getPlanColor(plan)}/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white">
                  {getPlanIcon(plan)}
                </div>
              </div>

              {/* Plan Name */}
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors duration-300">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {plan.price}
                  </span>
                  <span className="text-sm text-gray-300">/{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <div className="flex-1 mb-6">
                <ul className="space-y-3 text-sm text-gray-300">
                  {plan.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-center gap-3">
                      <div className={`w-5 h-5 bg-gradient-to-r ${getPlanColor(plan)} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-left">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button className={`w-full px-6 py-3 rounded-lg bg-gradient-to-r ${getPlanColor(plan)} text-white font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 group-hover:shadow-xl`}>
                {plan.popular ? 'Get Started' : 'Choose Plan'}
              </button>
            </div>

            {/* Hover effect indicator */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-8">
        <div className="text-center">
          <p className="text-xs text-gray-300 mb-2">
            All plans include 30-day money-back guarantee
          </p>
          <p className="text-xs text-gray-300">
            Need help choosing? <span className="text-blue-400 hover:text-blue-300 cursor-pointer transition-colors duration-300">Contact our sales team</span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SubscriptionPlans;
