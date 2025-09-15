import React from "react";
import { User } from "lucide-react";
import { Badge } from "../../../components";

export default function SkillsExperience({ user }) {
  return (
    <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
      <h2 className='text-xl font-semibold flex items-center gap-2'>
        <User className='w-5 h-5 text-blue-400' /> Skills & Experience
      </h2>
      <div className='flex flex-col space-y-2'>
        {user.skills &&
          Object.entries(user.skills).map(([skill, level]) => (
            <div key={skill} className='flex items-center justify-between'>
              <span className='capitalize'>{skill}</span>
              <Badge variant='info'>{level}</Badge>
            </div>
          ))}
        <div className='flex items-center justify-between mt-2'>
          <span>Experience</span>
          <span>{user.experience || "0 Years"}</span>
        </div>
        <div className='flex items-center justify-between mt-2'>
          <span>Location</span>
          <span>{user.location || "Not Set"}</span>
        </div>
        <div className='flex items-center justify-between mt-2'>
          <span>Availability</span>
          <span>{user.availability || "Full-Time"}</span>
        </div>
      </div>
    </section>
  );
}
