// components/ApplicantsList.jsx
import React, { useState } from "react";
import { Star, Heart, Search } from "lucide-react";

const ApplicantsList = () => {
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("name");
  const [favorites, setFavorites] = useState([]);

  const applicants = [
    {
      name: "Alice Johnson",
      role: "Frontend Developer",
      skills: ["React", "TailwindCSS", "Next.js"],
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      status: "Applied",
      rating: 4,
      notes: "Top Performer in last project",
    },
    {
      name: "Michael Smith",
      role: "Backend Developer",
      skills: ["Node.js", "Express", "MongoDB"],
      avatar: "https://randomuser.me/api/portraits/men/33.jpg",
      status: "Shortlisted",
      rating: 5,
      notes: "Strong in DB optimization",
    },
    {
      name: "Sara Williams",
      role: "Data Scientist",
      skills: ["Python", "Pandas", "TensorFlow"],
      avatar: "https://randomuser.me/api/portraits/women/55.jpg",
      status: "Interviewing",
      rating: 3,
      notes: "Needs more ML project exposure",
    },
    {
      name: "David Lee",
      role: "Full Stack Developer",
      skills: ["React", "Node.js", "Docker", "AWS"],
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      status: "Applied",
      rating: 4,
      notes: "Good team player",
    },
  ];

  const statusColors = {
    Applied: "bg-blue-500/30 text-blue-400",
    Shortlisted: "bg-green-500/30 text-green-400",
    Interviewing: "bg-yellow-500/30 text-yellow-400",
  };

  const skillColors = [
    "from-purple-400 to-pink-500",
    "from-blue-400 to-indigo-500",
    "from-green-400 to-teal-500",
    "from-yellow-400 to-orange-400",
  ];

  const filteredApplicants = applicants
    .filter(
      (app) =>
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        app.role.toLowerCase().includes(search.toLowerCase()) ||
        app.skills.some((skill) =>
          skill.toLowerCase().includes(search.toLowerCase())
        )
    )
    .sort((a, b) => {
      if (sortOption === "name") return a.name.localeCompare(b.name);
      if (sortOption === "rating") return b.rating - a.rating;
      if (sortOption === "status") return a.status.localeCompare(b.status);
      return 0;
    });

  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 rounded-2xl p-6 shadow-lg backdrop-blur-sm border border-white/10 space-y-4">
      <h2 className="text-2xl font-bold text-white">Applicants Overview</h2>

      {/* Search + Sort */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search by name, role, or skill..."
            className="w-full px-4 py-2 rounded-xl bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute right-3 top-3 w-5 h-5 text-blue-400" />
        </div>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2 rounded-xl bg-black/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="name">Sort by Name</option>
          <option value="rating">Sort by Rating</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      {/* Applicants Table */}
      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr className="text-left text-gray-400 uppercase text-xs tracking-wider">
              <th className="px-4 py-2">Applicant</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Skills</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Rating</th>
              <th className="px-4 py-2">Favorite</th>
              <th className="px-4 py-2">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredApplicants.map((app, idx) => (
              <tr
                key={idx}
                className="hover:bg-white/5 transition-colors duration-200"
              >
                {/* Applicant Name + Avatar */}
                <td className="px-4 py-3 flex items-center gap-3">
                  <img
                    src={app.avatar}
                    alt={app.name}
                    className="w-10 h-10 rounded-full border-2 border-blue-400"
                  />
                  <span className="text-white font-medium">{app.name}</span>
                </td>

                {/* Role */}
                <td className="px-4 py-3 text-gray-300">{app.role}</td>

                {/* Skills */}
                <td className="px-4 py-3 flex flex-wrap gap-2">
                  {app.skills.map((skill, i) => (
                    <span
                      key={i}
                      className={`px-2 py-1 rounded-full text-xs text-white bg-gradient-to-r ${skillColors[i % skillColors.length]}`}
                      title={skill}
                    >
                      {skill}
                    </span>
                  ))}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColors[app.status]}`}
                  >
                    {app.status}
                  </span>
                </td>

                {/* Rating */}
                <td className="px-4 py-3 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < app.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-500"
                      }`}
                    />
                  ))}
                </td>

                {/* Favorite Button */}
                <td className="px-4 py-3">
                  <Heart
                    className={`w-5 h-5 cursor-pointer ${
                      favorites.includes(idx)
                        ? "text-pink-500 fill-pink-500"
                        : "text-gray-400"
                    }`}
                    onClick={() =>
                      setFavorites((prev) =>
                        prev.includes(idx)
                          ? prev.filter((f) => f !== idx)
                          : [...prev, idx]
                      )
                    }
                  />
                </td>

                {/* Notes */}
                <td className="px-4 py-3 text-gray-300">{app.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No applicants found */}
      {filteredApplicants.length === 0 && (
        <p className="text-gray-400 text-center py-6">No applicants found.</p>
      )}
    </div>
  );
};

export default ApplicantsList;
