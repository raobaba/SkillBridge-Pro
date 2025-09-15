import React from "react";
import { Star } from "lucide-react";

const SubscriptionPlans = () => {
  const plans = [
    {
      id: 1,
      name: "Basic",
      price: "$9.99",
      features: ["1 Project", "Email Support"],
    },
    {
      id: 2,
      name: "Pro",
      price: "$29.99",
      features: ["10 Projects", "Priority Support"],
    },
    {
      id: 3,
      name: "Enterprise",
      price: "$99.99",
      features: ["Unlimited Projects", "24/7 Support"],
    },
  ];

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Star className="w-6 h-6 text-pink-400" /> Subscription Plans
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white/10 border border-white/20 rounded-2xl p-6 flex flex-col items-center text-center hover:scale-[1.03] transition-transform"
          >
            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
            <p className="text-3xl font-extrabold my-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {plan.price}
            </p>
            <ul className="text-sm text-gray-300 mb-4 space-y-2">
              {plan.features.map((f, idx) => (
                <li key={idx}>✅ {f}</li>
              ))}
            </ul>
            <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:opacity-90 transition">
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
