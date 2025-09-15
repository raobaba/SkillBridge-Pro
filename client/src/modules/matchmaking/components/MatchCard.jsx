import React from "react";
import { Badge, Button } from "../../../components";
import { User, MessageCircle } from "lucide-react";

export default function MatchCard({ match }) {
  const getScoreVariant = (score) => {
    if (score >= 80) return "success";
    if (score >= 50) return "warning";
    return "error";
  };

  return (
    <div className="relative bg-black/20 backdrop-blur-sm p-4 rounded-2xl border border-white/10 space-y-3 hover:bg-white/5 transition">
      {match.matchScore >= 90 && <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 text-xs font-bold rounded">Top Match</div>}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{match.name}</h3>
        <Badge variant={getScoreVariant(match.matchScore)}>{match.matchScore}%</Badge>
      </div>

      <p className="text-gray-400">{match.title || "No title"} | {match.experience || 0} yrs exp</p>

      <div className="flex flex-wrap gap-2 mt-2">
        {match.skills?.map((skill) => (
          <Badge key={skill.name || skill} variant="info">{skill.name} {skill.level ? `(${skill.level})` : ""}</Badge>
        ))}
      </div>

      <div className="flex justify-between text-gray-400 mt-2 text-sm">
        <span>{match.location || "Unknown"}</span>
        <span>{match.availability || "Full-Time"}</span>
      </div>

      <div className="flex justify-end gap-2 mt-3">
        <Button className="flex items-center gap-1" variant="secondary"><User className="w-4 h-4" /> View Profile</Button>
        <Button className="flex items-center gap-1" variant="primary"><MessageCircle className="w-4 h-4" /> Message</Button>
      </div>
    </div>
  );
}
