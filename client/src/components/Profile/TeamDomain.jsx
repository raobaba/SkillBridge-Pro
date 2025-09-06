import React from "react";
import Input from "../Input";

export default function TeamDomain({ editing, form, handleChange, userData }) {
  return (
    <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
      <h2 className='text-xl font-semibold mb-4'>Team & Domain</h2>
      {editing ? (
        <div className='space-y-3'>
          <Input
            name='teamSize'
            value={form?.teamSize || ""}
            onChange={handleChange}
            placeholder='Team Size'
            className='bg-white/10'
          />
          <Input
            name='domainExpertise'
            value={form?.domainExpertise || ""}
            onChange={handleChange}
            placeholder='Domain Expertise'
            className='bg-white/10'
          />
        </div>
      ) : (
        <>
          <p>
            <strong>Team Size:</strong> {userData?.teamSize || "N/A"}
          </p>
          <p>
            <strong>Domain Expertise:</strong>{" "}
            {userData?.domainExpertise || "N/A"}
          </p>
        </>
      )}
    </div>
  );
}
