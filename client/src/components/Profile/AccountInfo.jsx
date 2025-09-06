import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

export default function AccountInfo({ userData }) {
  return (
    <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
      <h2 className='text-xl font-semibold mb-4'>Account Info</h2>
      <p>
        <strong>Role:</strong> {userData?.role || "N/A"}
      </p>
      <p>
        <strong>Email Verified:</strong>{" "}
        {userData?.isEmailVerified ? (
          <CheckCircle className='inline w-4 h-4 text-green-400' />
        ) : (
          <XCircle className='inline w-4 h-4 text-red-400' />
        )}
      </p>
      <p>
        <strong>Joined:</strong>{" "}
        {userData?.createdAt
          ? new Date(userData.createdAt).toLocaleDateString()
          : "N/A"}
      </p>
      <p>
        <strong>Last Updated:</strong>{" "}
        {userData?.updatedAt
          ? new Date(userData.updatedAt).toLocaleDateString()
          : "N/A"}
      </p>
    </div>
  );
}
