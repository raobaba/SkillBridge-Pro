// CareerRecommender.jsx
import React from "react";

const CareerRecommender = () => {
  const recommendations = [
    { id: 1, title: "Frontend Developer", match: "92%" },
    { id: 2, title: "Backend Engineer", match: "87%" },
    { id: 3, title: "Data Scientist", match: "80%" },
  ];

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 shadow-lg border border-indigo-500/30">
      <h2 className="text-2xl font-bold text-white mb-4">Career Recommendations</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <li
            key={rec.id}
            className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-slate-800/60 to-slate-900/60 hover:scale-105 transition-transform cursor-pointer shadow-md"
          >
            <span className="text-lg font-medium text-gray-200">{rec.title}</span>
            <span className="px-3 py-1 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md">
              {rec.match}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CareerRecommender;
