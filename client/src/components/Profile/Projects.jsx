import React from "react";
import Input from "../Input";

export default function Projects({ editing, form, handleChange, userData }) {
  return (
    <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
      <h2 className='text-xl font-semibold mb-4'>Projects</h2>
      {editing ? (
        <Input
          name='projects'
          value={form?.projects || ""}
          onChange={handleChange}
          placeholder='Projects owned (comma separated)'
          className='bg-white/10'
        />
      ) : (
        <ul className='list-disc pl-5 text-gray-300'>
          {(userData?.projects || []).length > 0 ? (
            userData.projects.map((p, i) => <li key={i}>{p}</li>)
          ) : (
            <li>No projects available</li>
          )}
        </ul>
      )}
    </div>
  );
}
