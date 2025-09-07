import React from "react";
import { BarChart } from "lucide-react";

export default function SystemMetrics({ metrics = [] }) {
  if (!metrics.length)
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart className="w-5 h-5 text-yellow-400" />
          System Metrics
        </h3>
        <p className="text-gray-400">No system metrics available.</p>
      </div>
    );

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BarChart className="w-5 h-5 text-yellow-400" />
        System Metrics
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className="px-3 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg flex flex-col items-center justify-center gap-1"
          >
            <p
              className="text-2xl font-bold"
              style={{ color: metric.color || "#FACC15" }}
            >
              {metric.value}
            </p>
            <p className="text-sm text-center">{metric.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
