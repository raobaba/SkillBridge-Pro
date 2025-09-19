import React, { useState, createContext, useContext } from "react";
import { 
  List, 
  ChevronDown, 
  ArrowUpDown, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Clock, 
  MapPin, 
  Award, 
  Zap, 
  Target, 
  Filter,
  Check,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SelectContext = createContext();

function Select({ children, value, onValueChange }) {
  const [open, setOpen] = useState(false);
  const handleSelect = (val) => { onValueChange(val); setOpen(false); };
  return <SelectContext.Provider value={{ value, onSelect: handleSelect, open, setOpen }}>
    <div className="relative inline-block">{children}</div>
  </SelectContext.Provider>;
}

function SelectTrigger({ children, className, icon: Icon }) {
  const { open, setOpen } = useContext(SelectContext);
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex justify-between items-center px-4 py-3 bg-black/20 backdrop-blur-sm rounded-xl border border-white/20 text-white cursor-pointer transition-all duration-300 hover:border-blue-500/50 hover:bg-black/30 ${className}`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-gray-300" />}
        <span className="text-sm font-medium">{children}</span>
      </div>
      <motion.div
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <ChevronDown className="w-4 h-4 text-gray-300" />
      </motion.div>
    </motion.button>
  );
}

function SelectContent({ children, className }) {
  const { open } = useContext(SelectContext);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`absolute z-50 mt-2 w-full bg-black/40 backdrop-blur-sm rounded-xl border border-white/20 shadow-2xl overflow-hidden ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SelectItem({ value, children, className, icon: Icon, description }) {
  const { onSelect, value: selectedValue } = useContext(SelectContext);
  const isSelected = selectedValue === value;
  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      whileTap={{ scale: 0.98 }}
      className={`px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-3 ${
        isSelected 
          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-l-4 border-blue-500 text-white font-semibold" 
          : "text-gray-300 hover:text-white"
      } ${className}`}
      onClick={() => onSelect(value)}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
      <div className="flex-1">
        <div className="text-sm font-medium">{children}</div>
        {description && (
          <div className="text-xs text-gray-400 mt-1">{description}</div>
        )}
      </div>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"
        />
      )}
    </motion.div>
  );
}

export default function SortDropdown({ sortOption, setSortOption, onReset }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const basicOptions = [
    { 
      label: "Relevance", 
      value: "relevance", 
      icon: Target, 
      description: "Best matches first",
      category: "basic"
    },
    { 
      label: "Highest Match", 
      value: "highest", 
      icon: TrendingUp, 
      description: "Highest match % first",
      category: "basic"
    },
    { 
      label: "Lowest Match", 
      value: "lowest", 
      icon: TrendingDown, 
      description: "Lowest match % first",
      category: "basic"
    },
  ];

  const advancedOptions = [
    { 
      label: "Experience (High to Low)", 
      value: "experienceDesc", 
      icon: Award, 
      description: "Most experienced first",
      category: "advanced"
    },
    { 
      label: "Experience (Low to High)", 
      value: "experienceAsc", 
      icon: Award, 
      description: "Least experienced first",
      category: "advanced"
    },
    { 
      label: "Rating (High to Low)", 
      value: "ratingDesc", 
      icon: Star, 
      description: "Highest rated first",
      category: "advanced"
    },
    { 
      label: "Rating (Low to High)", 
      value: "ratingAsc", 
      icon: Star, 
      description: "Lowest rated first",
      category: "advanced"
    },
    { 
      label: "Availability", 
      value: "availability", 
      icon: Clock, 
      description: "By availability status",
      category: "advanced"
    },
    { 
      label: "Location A-Z", 
      value: "locationAsc", 
      icon: MapPin, 
      description: "Alphabetical by location",
      category: "advanced"
    },
    { 
      label: "Location Z-A", 
      value: "locationDesc", 
      icon: MapPin, 
      description: "Reverse alphabetical",
      category: "advanced"
    },
    { 
      label: "Response Rate", 
      value: "responseRate", 
      icon: Zap, 
      description: "Fastest responders first",
      category: "advanced"
    },
    { 
      label: "Recently Active", 
      value: "recentlyActive", 
      icon: Clock, 
      description: "Most recently active",
      category: "advanced"
    },
  ];

  const allOptions = [...basicOptions, ...advancedOptions];
  const selectedOption = allOptions.find(opt => opt.value === sortOption);

  const handleSortChange = (value) => {
    setSortOption(value);
    // Auto-hide advanced options after selection
    if (advancedOptions.some(opt => opt.value === value)) {
      setShowAdvanced(false);
    }
  };

  const handleReset = () => {
    setSortOption("relevance");
    if (onReset) onReset();
  };

  return (
    <div className="relative">
      {/* Main Sort Dropdown */}
      <Select value={sortOption} onValueChange={handleSortChange}>
        <SelectTrigger 
          icon={selectedOption?.icon || ArrowUpDown} 
          className="w-64 flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            {selectedOption?.icon && <selectedOption.icon className="w-4 h-4" />}
            {selectedOption?.label || "Sort by"}
          </span>
        </SelectTrigger>
        <SelectContent className="w-80">
          {/* Basic Options */}
          <div className="p-2">
            <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Quick Sort
            </div>
            {basicOptions.map((opt) => (
              <SelectItem 
                key={opt.value} 
                value={opt.value}
                icon={opt.icon}
                description={opt.description}
              >
                {opt.label}
              </SelectItem>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 my-2"></div>

          {/* Advanced Toggle */}
          <div className="px-4 py-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between text-sm text-gray-300 hover:text-white transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span>Advanced Sorting</span>
              </div>
              <motion.div
                animate={{ rotate: showAdvanced ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </button>
          </div>

          {/* Advanced Options */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-2">
                  <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Advanced Options
                  </div>
                  {advancedOptions.map((opt) => (
                    <SelectItem 
                      key={opt.value} 
                      value={opt.value}
                      icon={opt.icon}
                      description={opt.description}
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reset Button */}
          <div className="border-t border-white/10 p-2">
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Default
            </button>
          </div>
        </SelectContent>
      </Select>

      {/* Sort Info Badge */}
      {selectedOption && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg"
        >
          {selectedOption.category === "advanced" ? "Advanced" : "Quick"}
        </motion.div>
      )}

      {/* Sort Statistics */}
      <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Target className="w-3 h-3" />
          <span>1,247 results</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>Updated 2 min ago</span>
        </div>
      </div>
    </div>
  );
}
