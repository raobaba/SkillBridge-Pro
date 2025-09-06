import React from "react";

export default function Notification({ userData }) {
  return (
    <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
      <h2 className='text-xl font-semibold mb-4'>Notification Preferences</h2>
      <p>
        <strong>Email:</strong>{" "}
        {userData?.notificationPrefs?.email ? "Enabled" : "Disabled"}
      </p>
      <p>
        <strong>SMS:</strong>{" "}
        {userData?.notificationPrefs?.sms ? "Enabled" : "Disabled"}
      </p>
    </div>
  );
}
