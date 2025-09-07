import React from "react";
import { CheckCircle, XCircle, User } from "lucide-react";

export default function AccountInfo({ userData }) {
  const infoItems = [
    { label: "Role", value: userData?.role || "N/A" },
    {
      label: "Email Verified",
      value: userData?.isEmailVerified ? (
        <CheckCircle className="inline w-4 h-4 text-green-400" />
      ) : (
        <XCircle className="inline w-4 h-4 text-red-400" />
      ),
    },
    {
      label: "Joined",
      value: userData?.createdAt
        ? new Date(userData.createdAt).toLocaleDateString()
        : "N/A",
    },
    {
      label: "Last Updated",
      value: userData?.updatedAt
        ? new Date(userData.updatedAt).toLocaleDateString()
        : "N/A",
    },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-yellow-400" />
        Account Info
      </h3>
      <div className="flex flex-wrap gap-2">
        {infoItems.map((item, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm flex items-center gap-1"
          >
            <strong>{item.label}:</strong> {item.value}
          </span>
        ))}
      </div>
    </div>
  );
}
