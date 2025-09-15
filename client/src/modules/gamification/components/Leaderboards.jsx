import React from "react";
import { Crown } from "lucide-react";
import { motion } from "framer-motion";

const leaderboardData = [
  { id: 1, name: "Alice", xp: 4200 },
  { id: 2, name: "Rajan", xp: 3800 },
  { id: 3, name: "John", xp: 3500 },
  { id: 4, name: "Mia", xp: 3200 },
  { id: 5, name: "Leo", xp: 2900 },
];

const Leaderboards = () => {
  return (
    <div className="p-6 rounded-2xl bg-black/20 backdrop-blur-md shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Crown className="w-6 h-6 text-yellow-400" /> Leaderboards
      </h2>
      <ul className="space-y-3">
        {leaderboardData.map((user, index) => (
          <motion.li
            key={user.id}
            whileHover={{ scale: 1.02 }}
            className="flex justify-between items-center px-4 py-2 rounded-xl bg-white/10 shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-white">
                #{index + 1}
              </span>
              <span className="text-white">{user.name}</span>
            </div>
            <span className="text-indigo-400 font-semibold">{user.xp} XP</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboards;
