import React from "react";

export default function ProjectOverview({ stats = [] }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">📊 Project Overview</h3>
      {stats.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <span
              key={idx}
              className="px-3 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg flex flex-col items-center justify-center gap-1"
            >
              <p className="text-2xl font-bold" style={{ color: stat.color || "#FACC15" }}>
                {stat.count}
              </p>
              <p className="text-sm">{stat.label}</p>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No project stats available.</p>
      )}
    </div>
  );
}
