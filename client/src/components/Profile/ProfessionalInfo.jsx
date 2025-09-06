import React from "react";
import { Input } from "../../components";

export default function ProfessionalInfo({
  editing,
  form,
  handleChange,
  userData,
}) {
  return (
    <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
      <h2 className='text-xl font-semibold mb-4'>Professional Info</h2>
      {editing ? (
        <div className='space-y-3'>
          <Input
            name='experience'
            value={form?.experience || ""}
            onChange={handleChange}
            placeholder='Experience (e.g., 3 years)'
            className='bg-white/10'
          />
          <Input
            name='availability'
            value={form?.availability || ""}
            onChange={handleChange}
            placeholder='Availability (e.g., Full-time, Freelance)'
            className='bg-white/10'
          />
          <Input
            name='domainPreferences'
            value={form?.domainPreferences || ""}
            onChange={handleChange}
            placeholder='Domain Preferences (e.g., AI, Web Dev)'
            className='bg-white/10'
          />
        </div>
      ) : (
        <>
          <p>
            <strong>Experience:</strong> {userData?.experience || "N/A"}
          </p>
          <p>
            <strong>Availability:</strong> {userData?.availability || "N/A"}
          </p>
          <p>
            <strong>Domain Preferences:</strong>{" "}
            {userData?.domainPreferences || "N/A"}
          </p>
        </>
      )}
    </div>
  );
}
