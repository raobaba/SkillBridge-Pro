// SkillGapAnalyzer.jsx
import React from "react";

const SkillGapAnalyzer = () => {
  const gaps = [
    { skill: "Docker", required: "Intermediate", current: "Beginner" },
    { skill: "AWS", required: "Intermediate", current: "Beginner" },
    { skill: "System Design", required: "Advanced", current: "Intermediate" },
  ];

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 shadow-lg border border-purple-500/30 overflow-x-auto">
      <h2 className="text-2xl font-bold text-white mb-4">Skill Gap Analyzer</h2>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-gradient-to-r from-slate-800 to-slate-900 text-gray-300">
            <th className="p-3">Skill</th>
            <th className="p-3">Required</th>
            <th className="p-3">Current</th>
          </tr>
        </thead>
        <tbody>
          {gaps.map((gap, idx) => (
            <tr
              key={idx}
              className={`border-t border-gray-700 ${
                idx % 2 === 0 ? "bg-slate-900/20" : "bg-slate-800/20"
              } hover:bg-slate-800/40 transition`}
            >
              <td className="p-3 text-gray-200">{gap.skill}</td>
              <td className="p-3 text-blue-400 font-medium">{gap.required}</td>
              <td className="p-3 text-pink-400 font-medium">{gap.current}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkillGapAnalyzer;
