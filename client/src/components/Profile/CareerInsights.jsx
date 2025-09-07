import React from "react";
import { BarChart2 } from "lucide-react";

export default function CareerInsights({ insights = [] }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BarChart2 className="w-5 h-5 text-yellow-400" />
        Career Insights
      </h3>
      {insights.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {insights.map((item, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm flex items-center gap-1"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No career insights available.</p>
      )}
    </div>
  );
}
