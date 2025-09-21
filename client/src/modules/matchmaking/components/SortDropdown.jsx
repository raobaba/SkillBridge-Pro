import React, { useState } from "react";
import { ChevronDown, TrendingUp, TrendingDown, Star, Clock, MapPin, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SortDropdown = ({ sortOption, setSortOption, role = "developer" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getSortOptions = () => {
    if (role === "developer") {
      return [
        { label: "Best Match", value: "matchScore", icon: TrendingUp },
        { label: "Newest", value: "newest", icon: Clock },
        { label: "Salary High to Low", value: "salaryDesc", icon: TrendingDown },
        { label: "Salary Low to High", value: "salaryAsc", icon: TrendingUp },
        { label: "Company A-Z", value: "companyAsc", icon: MapPin },
      ];
    } else if (role === "project-owner") {
      return [
        { label: "Best Match", value: "matchScore", icon: TrendingUp },
        { label: "Rating High to Low", value: "ratingDesc", icon: Star },
        { label: "Experience High to Low", value: "experienceDesc", icon: Award },
        { label: "Recently Active", value: "recentlyActive", icon: Clock },
        { label: "Location A-Z", value: "locationAsc", icon: MapPin },
      ];
    }
    return [
      { label: "Best Match", value: "matchScore", icon: TrendingUp },
      { label: "Newest", value: "newest", icon: Clock },
    ];
  };

  const options = getSortOptions();
  const selectedOption = options.find(opt => opt.value === sortOption) || options[0];

  const handleSelect = (value) => {
    setSortOption(value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:border-blue-500/50 transition-all w-48"
      >
        <div className="flex items-center gap-2">
          <selectedOption.icon className="w-4 h-4" />
          <span className="text-sm font-medium">{selectedOption.label}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full bg-black/40 backdrop-blur-sm rounded-lg border border-white/20 shadow-2xl overflow-hidden"
          >
            {options.map((option) => (
              <motion.button
                key={option.value}
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(option.value)}
                className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center gap-3 ${
                  sortOption === option.value
                    ? "bg-blue-500/20 text-white font-semibold border-l-4 border-blue-500"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <option.icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{option.label}</span>
                {sortOption === option.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-blue-500 rounded-full ml-auto flex-shrink-0"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortDropdown;