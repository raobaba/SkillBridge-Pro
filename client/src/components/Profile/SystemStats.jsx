import React from "react";
import { BarChart } from "lucide-react";

export default function SystemStats({ userData }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <BarChart className="w-5 h-5 mr-2 text-orange-400" /> System Stats
      </h2>
      <p>
        <strong>Server Uptime:</strong> {userData?.serverUptime ?? "N/A"}
      </p>
      <p>
        <strong>Tasks Processed:</strong> {userData?.tasksProcessed ?? 0}
      </p>
      <p>
        <strong>System Load:</strong> {userData?.systemLoad ?? "N/A"}
      </p>
    </div>
  );
}
