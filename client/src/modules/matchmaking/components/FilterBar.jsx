import React, { useState, useEffect, createContext, useContext } from "react";
import { Search, XCircle, Filter, ChevronDown, MapPin, Clock, Users, Star, Award, Zap, Target, Flame, Shield, Calendar, TrendingUp, Settings, RefreshCw } from "lucide-react";
import { Button, Input } from "../../../components";
import { motion, AnimatePresence } from "framer-motion";

const SelectContext = createContext();

function Select({ children, value, onValueChange }) {
  const [open, setOpen] = useState(false);
  const handleSelect = (val) => {
    onValueChange(val);
    setOpen(false);
  };
  return (
    <SelectContext.Provider value={{ value, onSelect: handleSelect, open, setOpen }}>
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  );
}

function SelectTrigger({ children, className, icon: Icon }) {
  const { open, setOpen } = useContext(SelectContext);
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex justify-between items-center px-4 py-3 bg-black/20 backdrop-blur-sm rounded-xl border border-white/20 text-white cursor-pointer w-full transition-all duration-300 hover:border-blue-500/50 hover:bg-black/30 ${className}`}
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

function SelectItem({ value, children, className, icon: Icon }) {
  const { onSelect, value: selectedValue } = useContext(SelectContext);
  const isSelected = selectedValue === value;
  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
      whileTap={{ scale: 0.98 }}
      className={`px-4 py-3 cursor-pointer transition-all duration-200 flex items-center gap-2 ${
        isSelected 
          ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-l-4 border-blue-500 text-white font-semibold" 
          : "text-gray-300 hover:text-white"
      } ${className}`}
      onClick={() => onSelect(value)}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span className="text-sm">{children}</span>
      {isSelected && <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto" />}
    </motion.div>
  );
}

export default function FilterBar({ filters, setFilters }) {
  const [search, setSearch] = useState(filters.search || "");
  const [availability, setAvailability] = useState(filters.availability || "");
  const [location, setLocation] = useState(filters.location || "");
  const [experience, setExperience] = useState(filters.experience || "");
  const [skills, setSkills] = useState(filters.skills || "");
  const [rating, setRating] = useState(filters.rating || "");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => setFilters({ ...filters, search }), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const handleApplyFilters = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setFilters({ 
      ...filters, 
      search, 
      availability, 
      location, 
      experience, 
      skills, 
      rating 
    });
    setIsLoading(false);
  };

  const handleResetFilters = () => {
    setSearch("");
    setAvailability("");
    setLocation("");
    setExperience("");
    setSkills("");
    setRating("");
    setFilters({ 
      search: "", 
      availability: "", 
      location: "", 
      experience: "", 
      skills: "", 
      rating: "" 
    });
  };

  const activeFiltersCount = [availability, location, experience, skills, rating].filter(Boolean).length;

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 backdrop-blur-sm p-6 rounded-2xl border border-white/10 mb-8">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl"></div>
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 blur-3xl"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Find Your Perfect Match</h2>
              <p className="text-gray-300 text-sm">Discover talented professionals and opportunities</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <span className="px-3 py-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-xs rounded-full font-medium">
                {activeFiltersCount} filters active
              </span>
            )}
            <Button
              onClick={() => setShowAdvanced(!showAdvanced)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              {showAdvanced ? "Simple" : "Advanced"}
            </Button>
          </div>
        </div>

        {/* Main Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name, skills, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-black/20 backdrop-blur-sm rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 transition-colors duration-300 text-lg"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Select value={availability} onValueChange={setAvailability}>
            <SelectTrigger icon={Clock} className="w-full">
              {availability || "Availability"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="" icon={Clock}>Any Availability</SelectItem>
              <SelectItem value="Full-Time" icon={Clock}>Full-Time</SelectItem>
              <SelectItem value="Part-Time" icon={Clock}>Part-Time</SelectItem>
              <SelectItem value="Freelance" icon={Clock}>Freelance</SelectItem>
              <SelectItem value="Contract" icon={Clock}>Contract</SelectItem>
              <SelectItem value="Internship" icon={Clock}>Internship</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-black/20 backdrop-blur-sm rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 transition-colors duration-300"
            />
          </div>

          <Select value={experience} onValueChange={setExperience}>
            <SelectTrigger icon={Award} className="w-full">
              {experience || "Experience"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="" icon={Award}>Any Experience</SelectItem>
              <SelectItem value="Entry" icon={Award}>Entry Level (0-2 years)</SelectItem>
              <SelectItem value="Mid" icon={Award}>Mid Level (3-5 years)</SelectItem>
              <SelectItem value="Senior" icon={Award}>Senior Level (6-10 years)</SelectItem>
              <SelectItem value="Lead" icon={Award}>Lead Level (10+ years)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={rating} onValueChange={setRating}>
            <SelectTrigger icon={Star} className="w-full">
              {rating || "Rating"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="" icon={Star}>Any Rating</SelectItem>
              <SelectItem value="5" icon={Star}>5 Stars</SelectItem>
              <SelectItem value="4" icon={Star}>4+ Stars</SelectItem>
              <SelectItem value="3" icon={Star}>3+ Stars</SelectItem>
              <SelectItem value="2" icon={Star}>2+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  Advanced Filters
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="relative">
                    <Zap className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Skills (e.g., React, Python, Design)"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-black/20 backdrop-blur-sm rounded-xl border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 transition-colors duration-300"
                    />
                  </div>

                  <Select value={filters.industry || ""} onValueChange={(val) => setFilters({...filters, industry: val})}>
                    <SelectTrigger icon={Shield} className="w-full">
                      {filters.industry || "Industry"}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="" icon={Shield}>Any Industry</SelectItem>
                      <SelectItem value="Technology" icon={Shield}>Technology</SelectItem>
                      <SelectItem value="Finance" icon={Shield}>Finance</SelectItem>
                      <SelectItem value="Healthcare" icon={Shield}>Healthcare</SelectItem>
                      <SelectItem value="Education" icon={Shield}>Education</SelectItem>
                      <SelectItem value="Marketing" icon={Shield}>Marketing</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.salary || ""} onValueChange={(val) => setFilters({...filters, salary: val})}>
                    <SelectTrigger icon={TrendingUp} className="w-full">
                      {filters.salary || "Salary Range"}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="" icon={TrendingUp}>Any Salary</SelectItem>
                      <SelectItem value="0-50k" icon={TrendingUp}>$0 - $50k</SelectItem>
                      <SelectItem value="50k-100k" icon={TrendingUp}>$50k - $100k</SelectItem>
                      <SelectItem value="100k-150k" icon={TrendingUp}>$100k - $150k</SelectItem>
                      <SelectItem value="150k+" icon={TrendingUp}>$150k+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleApplyFilters}
                disabled={isLoading}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleResetFilters}
                variant="outline"
                className="flex items-center gap-2 border-white/20 text-gray-300 hover:text-white hover:border-red-500/50 hover:bg-red-500/10 px-6 py-3 rounded-xl transition-all duration-300"
              >
                <XCircle className="w-4 h-4" />
                Reset All
              </Button>
            </motion.div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>1,247 professionals found</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Last updated: 2 min ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
