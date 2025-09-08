import React from "react";

export default function InfoCard({
  icon,
  title,
  items = [],
  fallback = "No data available.",
  isKeyValue = false,
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      {/* Header */}
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h3>

      {/* Content */}
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item, idx) =>
            isKeyValue ? (
              <span
                key={idx}
                className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm flex items-center gap-1"
              >
                <strong>{item.label}:</strong> {item.value}
              </span>
            ) : (
              <span
                key={idx}
                className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm flex items-center gap-1"
              >
                {item}
              </span>
            )
          )}
        </div>
      ) : (
        <p className="text-gray-400">{fallback}</p>
      )}
    </div>
  );
}
