import React from "react";
import { Clock } from "lucide-react";

const BillingHistory = () => {
  const history = [
    { id: 1, date: "2025-08-01", amount: "$29.99", status: "Paid" },
    { id: 2, date: "2025-07-01", amount: "$29.99", status: "Paid" },
    { id: 3, date: "2025-06-01", amount: "$29.99", status: "Failed" },
  ];

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <Clock className="w-6 h-6 text-purple-400" /> Billing History
      </h2>
      <ul className="divide-y divide-white/10">
        {history.map((item) => (
          <li
            key={item.id}
            className="py-3 flex justify-between items-center text-gray-200"
          >
            <span>{item.date}</span>
            <span className="font-semibold">{item.amount}</span>
            <span
              className={`px-3 py-1 text-xs rounded-lg font-medium ${
                item.status === "Paid"
                  ? "bg-green-500/20 text-green-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              {item.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BillingHistory;
