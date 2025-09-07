import React from "react";
import { Bell } from "lucide-react";

export default function Notification({ userData }) {
  const prefs = userData?.notificationPrefs || {};

  const prefItems = Object.entries(prefs).map(([key, value]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    value: value ? "Enabled" : "Disabled",
  }));

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Bell className="w-5 h-5 text-yellow-400" />
        Notification Preferences
      </h3>
      {prefItems.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {prefItems.map((item, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm flex items-center gap-1"
            >
              <strong>{item.label}:</strong> {item.value}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No notification preferences set.</p>
      )}
    </div>
  );
}
