import React from "react";
import { Users, LayoutDashboard, DollarSign } from "lucide-react"; // Lucide icons

export default function AnalyticsSnapshot({ stats = [] }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      {/* Heading with icon */}
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        📊 Analytics Snapshot
      </h3>

      {stats.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-center">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="px-3 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg flex flex-col items-center justify-center gap-1"
            >
              {/* Icon */}
              {item.icon && (
                <span className="text-2xl">
                  {React.cloneElement(item.icon, {
                    color: item.color || "#FACC15",
                    size: 24,
                  })}
                </span>
              )}
              {/* Value */}
              <p
                className="text-2xl font-bold"
                style={{ color: item.color || "#FACC15" }}
              >
                {item.value}
              </p>
              {/* Label */}
              <p className="text-sm text-center">{item.label}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No analytics data available.</p>
      )}
    </div>
  );
}
