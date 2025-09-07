import React from "react";

export default function DeveloperAccess({
  title = "Developer Access",
  developers = [],
  columns = ["Name", "Role", "Status"],
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {developers.length > 0 ? (
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-300 border-b border-white/10">
              {columns.map((col, idx) => (
                <th key={idx} className="pb-2 pr-4">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {developers.map((dev, idx) => (
              <tr key={idx} className="border-b border-white/10">
                <td className="py-2 pr-4">{dev.name}</td>
                <td className="py-2 pr-4 text-gray-300">{dev.role}</td>
                <td className="py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      dev.status.toLowerCase() === "active"
                        ? "bg-green-500/20 text-green-400"
                        : dev.status.toLowerCase() === "invited"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {dev.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-400">No developers found.</p>
      )}
    </div>
  );
}
