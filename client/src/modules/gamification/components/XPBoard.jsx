import React from "react";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";

const XPBoard = ({ currentXP = 2800, levelXP = 5000 }) => {
  const progress = Math.min((currentXP / levelXP) * 100, 100);

  return (
    <div className="p-6 rounded-2xl bg-black/20 backdrop-blur-md shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        ⚡ XP Progress
      </h2>
      <div className="relative w-full bg-white/10 rounded-full h-4 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1 }}
          className="absolute top-0 left-0 h-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
        />
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-300">
        <span>{currentXP} XP</span>
        <span>{levelXP} XP</span>
      </div>
      <div className="mt-4 flex items-center gap-2 text-indigo-300">
        <Zap className="w-5 h-5 text-yellow-400" />
        <span className="font-medium">
          Keep going! {levelXP - currentXP} XP to next level 🚀
        </span>
      </div>
    </div>
  );
};

export default XPBoard;
