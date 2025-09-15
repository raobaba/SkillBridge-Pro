import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Briefcase,
  Star,
  Tag,
  ChevronRight,
  Heart,
} from "lucide-react";

const ProjectCard = ({ project }) => {
  const [expanded, setExpanded] = useState(false);
  const [favorited, setFavorited] = useState(false);

  const statusColors = {
    Active: "from-green-500 to-emerald-600",
    Completed: "from-blue-500 to-indigo-600",
    Upcoming: "from-yellow-500 to-orange-500",
    Draft: "from-gray-400 to-gray-600",
  };

  const priorityColors = {
    High: "from-red-500 to-red-600",
    Medium: "from-yellow-400 to-yellow-500",
    Low: "from-green-400 to-green-500",
  };

  const today = new Date();
  const deadline = new Date(project.deadline);
  const daysLeft = Math.max(
    0,
    Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-2xl p-6 shadow-2xl border border-white/10 hover:scale-[1.03] hover:shadow-xl transition-transform duration-300 ease-in-out flex flex-col justify-between group">
      {/* Header: Title + Status + Priority */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">{project?.title}</h2>
        <div className="flex flex-wrap gap-2">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${statusColors[project?.status]} text-white`}
          >
            {project?.status}
          </span>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${priorityColors[project?.priority]} text-white`}
          >
            {project?.priority} Priority
          </span>
        </div>
      </div>

      {/* Collapsible Description */}
      <p
        className={`text-gray-300 text-sm mb-4 ${expanded ? "" : "line-clamp-3"} cursor-pointer`}
        onClick={() => setExpanded(!expanded)}
      >
        {project?.description}
      </p>

      {/* Info Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-gray-300 text-sm mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          <span>{project?.startDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-pink-400" />
          <span>
            {project?.deadline} ({daysLeft} days left)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-purple-400" />
          <span>{project?.roleNeeded}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-green-400" />
          <span>{project?.applicantsCount} Applicants</span>
        </div>
      </div>

      {/* Team Members */}
      {project?.team && (
        <div className="flex -space-x-3 mb-4">
          {project.team.map((member, idx) => (
            <img
              key={idx}
              src={member.avatar}
              alt={member.name}
              className="w-10 h-10 rounded-full border-2 border-black hover:scale-110 transition-transform"
              title={member.name}
            />
          ))}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project?.tags.map((tag, idx) => (
          <span
            key={idx}
            className="px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 flex items-center gap-1 hover:scale-105 transition-transform"
          >
            <Tag className="w-3 h-3" />
            {tag}
          </span>
        ))}
      </div>

      {/* Ratings */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < project?.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
            }`}
          />
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex gap-2 items-center">
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:from-blue-600 hover:to-indigo-700 transition-all">
            View Details
          </button>
          <button onClick={() => setFavorited(!favorited)}>
            <Heart
              className={`w-6 h-6 cursor-pointer ${
                favorited ? "text-pink-500 fill-pink-500" : "text-gray-400"
              }`}
            />
          </button>
        </div>
        <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-white" />
      </div>

      {/* Badges: New Applicants & Activity */}
      <div className="flex flex-wrap gap-2 mt-3">
        {project?.newApplicants > 0 && (
          <div className="px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-600 text-xs font-semibold rounded-full text-white inline-block">
            {project.newApplicants} New Applicants
          </div>
        )}
        {project?.activity && (
          <div className="px-3 py-1 bg-gradient-to-r from-green-400 to-teal-500 text-xs font-semibold rounded-full text-white inline-block">
            {project.activity}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
