import React from "react";
import { User, Lock } from "lucide-react";
import { Button } from "../../../components";

export default function ProfileSettings({
  formData,
  handleInputChange,
  handleSaveProfile,
}) {
  return (
    <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
      <h2 className='text-xl font-semibold flex items-center gap-2'>
        <User className='w-5 h-5 text-cyan-400' /> Profile Settings
      </h2>
      <div className='space-y-3'>
        <input
          type='text'
          name='name'
          value={formData.name}
          onChange={handleInputChange}
          placeholder='Name'
          className='w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none'
        />
        <input
          type='email'
          name='email'
          value={formData.email}
          onChange={handleInputChange}
          placeholder='Email'
          className='w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none'
        />
      </div>
      <Button onClick={handleSaveProfile}>Save Profile</Button>
    </section>
  );
}
