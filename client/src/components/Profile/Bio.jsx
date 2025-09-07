import React from "react";
import { User } from "lucide-react";

export default function Bio({ editing, form, handleChange, userData }) {
  return (
    <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
      <h2 className='text-xl font-semibold mb-4 flex items-center'>
        <User className='w-8 h-8 mr-2 text-amber-400' /> About Me
      </h2>
      {editing ? (
        <textarea
          name='bio'
          value={form?.bio || ""}
          onChange={handleChange}
          className='w-full bg-white/10 rounded-lg p-3 text-gray-100'
        />
      ) : (
        <p className='text-gray-300'>{userData?.bio || "No bio provided."}</p>
      )}
    </div>
  );
}
