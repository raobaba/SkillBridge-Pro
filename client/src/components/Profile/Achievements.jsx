import React from "react";

export default function Achievements({ userData }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Achievements</h3>
      <div className="flex flex-wrap gap-2">
        {(userData?.badges || []).length > 0 ? (
          userData.badges.map((badge, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm"
            >
              {badge}
            </span>
          ))
        ) : (
          <p className="text-gray-400">No achievements yet.</p>
        )}
      </div>
    </div>
  );
}
