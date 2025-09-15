import React, { useState } from "react";
import FilterBar from "../components/FilterBar";
import SortDropdown from "../components/SortDropdown";
import MatchCard from "../components/MatchCard";
import Navbar from "../../../components/header";
import { Footer } from "../../../components";

// Static matches data
const staticMatches = [
  {
    id: 1,
    name: "Alice Johnson",
    title: "Frontend Developer",
    experience: 3,
    skills: [
      { name: "React", level: "Advanced" },
      { name: "Tailwind CSS", level: "Intermediate" },
    ],
    matchScore: 92,
    location: "New York",
    availability: "Full-Time",
  },
  {
    id: 2,
    name: "Bob Smith",
    title: "Backend Engineer",
    experience: 5,
    skills: [
      { name: "Node.js", level: "Advanced" },
      { name: "MongoDB", level: "Intermediate" },
    ],
    matchScore: 85,
    location: "San Francisco",
    availability: "Part-Time",
  },
  {
    id: 3,
    name: "Charlie Brown",
    title: "Data Scientist",
    experience: 2,
    skills: [
      { name: "Python", level: "Advanced" },
      { name: "Pandas", level: "Intermediate" },
    ],
    matchScore: 78,
    location: "Chicago",
    availability: "Full-Time",
  },
];

const Matchmaking = () => {
  const [filters, setFilters] = useState({
    search: "",
    availability: "",
    location: "",
  });
  const [sortOption, setSortOption] = useState("highest");

  // Filter matches
  const filteredMatches = staticMatches.filter((match) => {
    const matchesSearch = match.name
      .toLowerCase()
      .includes(filters.search.toLowerCase());
    const matchesAvailability = filters.availability
      ? match.availability === filters.availability
      : true;
    const matchesLocation = filters.location
      ? match.location.toLowerCase().includes(filters.location.toLowerCase())
      : true;
    return matchesSearch && matchesAvailability && matchesLocation;
  });

  // Sort matches
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    switch (sortOption) {
      case "highest":
        return b.matchScore - a.matchScore;
      case "lowest":
        return a.matchScore - b.matchScore;
      case "experience":
        return (b.experience || 0) - (a.experience || 0);
      case "locationAsc":
        return (a.location || "").localeCompare(b.location || "");
      case "locationDesc":
        return (b.location || "").localeCompare(a.location || "");
      default:
        return 0;
    }
  });

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
      <Navbar isSearchBar={true} />

      <div className='max-w-6xl mx-auto px-4 py-8'>
        <h1 className='text-4xl font-bold drop-shadow-lg mb-6 text-center lg:text-left'>
          Matchmaking
        </h1>

        {/* Filters & Sort */}
        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 flex-wrap'>
          {/* FilterBar: full width on small screens, auto width on large screens */}
          <div className='w-full lg:w-auto'>
            <FilterBar filters={filters} setFilters={setFilters} />
          </div>

          {/* SortDropdown: full width on small screens, fixed width on large screens */}
          <div className='w-full mb-6 lg:w-48'>
            <SortDropdown
              sortOption={sortOption}
              setSortOption={setSortOption}
            />
          </div>
        </div>

        {/* Matches Grid */}
        {sortedMatches.length === 0 ? (
          <p className='text-gray-400 col-span-full text-center mt-8'>
            No matches found. Try adjusting your filters or search.
          </p>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {sortedMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Matchmaking;
