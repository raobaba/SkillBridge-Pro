import React from "react";
import Input from "../Input";
import { Users } from "lucide-react";

export default function TeamDomain({ editing, form, handleChange, userData }) {
  const infoItems = [
    { label: "Team Size", value: userData?.teamSize || "N/A" },
    { label: "Domain Expertise", value: userData?.domainExpertise || "N/A" },
  ];

  return (
    <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
      <h3 className='text-lg font-semibold mb-4 flex items-center gap-2'>
        <Users className='w-5 h-5 text-yellow-400' />
        Team & Domain
      </h3>

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
        <div className='flex flex-wrap gap-2'>
          {infoItems.map((item, idx) => (
            <span
              key={idx}
              className='px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm flex items-center gap-1'
            >
              <strong>{item.label}:</strong> {item.value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
