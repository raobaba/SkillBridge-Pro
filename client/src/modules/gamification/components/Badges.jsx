import React from "react";
import { Medal, Star, Award } from "lucide-react";
import { motion } from "framer-motion";

const badges = [
  { id: 1, name: "Rising Star", icon: Star, color: "bg-yellow-500" },
  { id: 2, name: "Top Contributor", icon: Medal, color: "bg-indigo-500" },
  { id: 3, name: "Master Coder", icon: Award, color: "bg-pink-500" },
];

const Badges = () => {
  return (
    <div className="p-6 rounded-2xl bg-black/20 backdrop-blur-md shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">🏅 Badges</h2>
      <div className="flex flex-wrap gap-4">
        {badges.map(({ id, name, icon: Icon, color }) => (
          <motion.div
            key={id}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 shadow-md"
          >
            <span className={`p-2 rounded-full ${color}`}>
              <Icon className="w-6 h-6 text-white" />
            </span>
            <span className="text-white font-medium">{name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Badges;
