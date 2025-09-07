import React from "react";

export default function ReportsPanel({ reports = [] }) {
  if (!reports.length)
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Reports & Moderation</h3>
        <p className="text-gray-400">No reports available.</p>
      </div>
    );

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Reports & Moderation</h3>
      <div className="flex flex-wrap gap-2">
        {reports.map((report, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm flex items-center gap-1"
          >
            {report.icon ? <span>{report.icon}</span> : null}
            <strong>{report.label}:</strong> {report.value}
          </span>
        ))}
      </div>
    </div>
  );
}
