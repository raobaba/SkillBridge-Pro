import React from "react";
import { Lock } from "lucide-react";
import { Button } from "../../../components";

export default function AccountSettings({
  formData,
  handleInputChange,
  handleSaveProfile,
}) {
  return (
    <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
      <h2 className='text-xl font-semibold flex items-center gap-2'>
        <Lock className='w-5 h-5 text-pink-400' /> Account Settings
      </h2>
      <div className='space-y-3'>
        {["password", "newPassword", "confirmPassword"].map((field) => (
          <input
            key={field}
            type='password'
            name={field}
            value={formData[field]}
            onChange={handleInputChange}
            placeholder={
              field === "password"
                ? "Current Password"
                : field === "newPassword"
                  ? "New Password"
                  : "Confirm Password"
            }
            className='w-full p-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-1 focus:ring-pink-400 focus:outline-none'
          />
        ))}
      </div>
      <Button onClick={handleSaveProfile}>Change Password</Button>
    </section>
  );
}
