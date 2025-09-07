import React from "react";

export default function CollaborationRequests({requests}) {

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">🤝 Collaboration Requests</h2>
      <ul className="space-y-3">
        {requests.map((req, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center bg-white/5 p-3 rounded-lg"
          >
            <div>
              <p className="font-medium">{req.name}</p>
              <p className="text-sm text-gray-400">{req.skill}</p>
            </div>
            <div className="space-x-2">
              <button className="px-3 py-1 text-xs rounded-lg bg-green-500/20 text-green-400">
                Accept
              </button>
              <button className="px-3 py-1 text-xs rounded-lg bg-red-500/20 text-red-400">
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
