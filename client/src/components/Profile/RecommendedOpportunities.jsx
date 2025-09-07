import React from "react";
import { Target } from "lucide-react";

export default function RecommendedOpportunities({ opportunities = [] }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-yellow-400" />
        Recommended Opportunities
      </h3>
      {opportunities.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {opportunities.map((opp, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm flex items-center gap-1"
            >
              📌 {opp.name} – Match {opp.match}%
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No recommended opportunities.</p>
      )}
    </div>
  );
}
