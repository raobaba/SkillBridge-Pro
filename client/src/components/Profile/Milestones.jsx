import React from "react";

export default function Milestones({ milestones }) {
  return (
    <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
      <h2 className='text-xl font-semibold mb-4'>📅 Project Milestones</h2>
      <ul className='space-y-2'>
        {milestones.map((m, idx) => (
          <li
            key={idx}
            className='flex justify-between items-center border-b border-white/10 pb-2'
          >
            <div>
              <p className='font-medium'>{m.title}</p>
              <p className='text-sm text-gray-400'>{m.date}</p>
            </div>
            <span
              className={`px-2 py-1 text-xs rounded ${
                m.status === "Done"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {m.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
