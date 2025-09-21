import React, { useState } from "react";
import { Search, XCircle, MapPin, Clock, Star, Award, Zap } from "lucide-react";
import { motion } from "framer-motion";

const FilterBar = ({ filters, setFilters, role = "developer" }) => {
  const [search, setSearch] = useState(filters.search || "");
  const [location, setLocation] = useState(filters.location || "");
  const [experience, setExperience] = useState(filters.experience || "");
  const [skills, setSkills] = useState(filters.skills || "");
  const [rating, setRating] = useState(filters.rating || "");

  const handleSearch = () => {
    setFilters({ 
      search, 
      location, 
      experience, 
      skills, 
      rating 
    });
  };

  const handleReset = () => {
    setSearch("");
    setLocation("");
    setExperience("");
    setSkills("");
    setRating("");
    setFilters({ 
      search: "", 
      location: "", 
      experience: "", 
      skills: "", 
      rating: "" 
    });
  };

  const activeFiltersCount = [location, experience, skills, rating].filter(Boolean).length;

  const getPlaceholder = () => {
    if (role === "developer") return "Search projects by title, company, or skills...";
    if (role === "project-owner") return "Search developers by name, skills, or location...";
    return "Search...";
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Search className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Search & Filter</h3>
            <p className="text-gray-300 text-sm">
              {role === "developer" ? "Find your perfect project" : 
               role === "project-owner" ? "Find your perfect developer" : 
               "Search"}
            </p>
          </div>
        </div>
        {activeFiltersCount > 0 && (
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full font-medium">
            {activeFiltersCount} filters active
          </span>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={getPlaceholder()}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Location */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Experience */}
        <div className="relative">
          <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
          >
            <option value="">Any Experience</option>
            <option value="0-2">0-2 years</option>
            <option value="3-5">3-5 years</option>
            <option value="6-10">6-10 years</option>
            <option value="10+">10+ years</option>
          </select>
        </div>

        {/* Skills */}
        <div className="relative">
          <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Rating */}
        <div className="relative">
          <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
          >
            <option value="">Any Rating</option>
            <option value="5">5 Stars</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-all flex items-center gap-2"
          >
            <XCircle className="w-4 h-4" />
            Reset
          </motion.button>
        </div>

        <div className="text-sm text-gray-400">
          {role === "developer" ? "Find projects that match your skills" : 
           role === "project-owner" ? "Find developers for your projects" : 
           "Search results"}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;