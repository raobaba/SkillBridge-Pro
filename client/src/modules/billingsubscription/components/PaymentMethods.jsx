import React from "react";
import { CreditCard, Wallet } from "lucide-react";

const PaymentMethods = () => {
  const methods = [
    { id: 1, type: "Credit Card", last4: "4242", default: true },
    { id: 2, type: "PayPal", email: "user@example.com", default: false },
  ];

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <Wallet className="w-6 h-6 text-blue-400" /> Payment Methods
      </h2>
      <ul className="space-y-3">
        {methods.map((method) => (
          <li
            key={method.id}
            className="flex justify-between items-center bg-white/5 p-4 rounded-xl hover:scale-[1.02] transition-transform"
          >
            <div>
              <p className="font-semibold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-pink-400" />
                {method.type}
              </p>
              <p className="text-sm text-gray-400">
                {method.last4
                  ? `**** **** **** ${method.last4}`
                  : method.email}
              </p>
            </div>
            {method.default && (
              <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-lg shadow-md">
                Default
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentMethods;
