import React from "react";
import { BarChart } from "lucide-react";

export default function Progress({ userData }) {
  const progressItems = [
    { label: "XP", value: userData?.xp ?? 0 },
    { label: "Level", value: userData?.level ?? 0 },
    { label: "Portfolio Score", value: userData?.portfolioScore ?? 0 },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BarChart className="w-5 h-5 text-yellow-400" />
        Progress
      </h3>
      <div className="flex flex-wrap gap-2">
        {progressItems.map((item, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm flex items-center gap-1"
          >
            <strong>{item.label}:</strong> {item.value}
          </span>
        ))}
      </div>
    </div>
  );
}
