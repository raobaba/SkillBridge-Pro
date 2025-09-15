// ResumeEnhancer.jsx
import React from "react";

const ResumeEnhancer = () => {
  const suggestions = [
    "Add more measurable achievements in your experience section.",
    "Include technical keywords like React, Node.js, Docker.",
    "Tailor your resume summary to match job descriptions.",
  ];

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 shadow-lg border border-pink-500/30">
      <h2 className="text-2xl font-bold text-white mb-4">Resume Enhancer</h2>
      <ul className="space-y-3 text-gray-300">
        {suggestions.map((s, idx) => (
          <li
            key={idx}
            className="flex items-center gap-2 p-3 bg-gradient-to-r from-slate-800/50 to-slate-900/50 rounded-lg hover:scale-[1.02] transition-transform"
          >
            <span className="text-pink-400 text-lg">✦</span>
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResumeEnhancer;
