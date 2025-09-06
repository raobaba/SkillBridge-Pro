import React from "react";
import { BarChart } from "lucide-react";

export default function Progress({ userData }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <BarChart className="w-5 h-5 mr-2 text-orange-400" /> Progress
      </h2>
      <p>
        <strong>XP:</strong> {userData?.xp ?? 0}
      </p>
      <p>
        <strong>Level:</strong> {userData?.level ?? 0}
      </p>
      <p>
        <strong>Portfolio Score:</strong> {userData?.portfolioScore ?? 0}
      </p>
    </div>
  );
}
