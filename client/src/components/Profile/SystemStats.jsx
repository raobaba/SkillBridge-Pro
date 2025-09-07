import React from "react";
import { BarChart } from "lucide-react";

export default function SystemStats({ stats = [] }) {
  if (!stats.length)
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart className="w-5 h-5 text-yellow-400" />
          System Stats
        </h3>
        <p className="text-gray-400">No system stats available.</p>
      </div>
    );

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BarChart className="w-5 h-5 text-yellow-400" />
        System Stats
      </h3>
      <div className="flex flex-wrap gap-2">
        {stats.map((stat, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm flex items-center gap-1"
          >
            <strong>{stat.label}:</strong> {stat.value}
          </span>
        ))}
      </div>
    </div>
  );
}
