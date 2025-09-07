import React from "react";
import { Briefcase } from "lucide-react";

export default function PortfolioShowcase({ projects = [], featured = "" }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Briefcase className="w-8 h-8 mr-2 text-amber-400" /> Portfolio Showcase
      </h2>
      <ul className="space-y-2 text-gray-300">
        {projects.map((proj, idx) => (
          <li key={idx}>
            🔗 GitHub Repo:{" "}
            <span className="text-blue-400 underline">{proj}</span>
          </li>
        ))}
        {featured && <li>📂 Featured Project: {featured}</li>}
      </ul>
    </div>
  );
}
