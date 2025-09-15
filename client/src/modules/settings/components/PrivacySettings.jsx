import React, { useState } from "react";
import Navbar from "../../../components/header";
import { Footer } from "../../../components";
import { Badge, Button } from "../../../components";
import { Shield } from "lucide-react";

export default function PrivacySettings() {
  // Static demo user data
  const user = {
    name: "John Doe",
    privacyPrefs: {
      profilePublic: true,
      dataSharing: false,
      searchVisibility: true,
      personalizedAds: false,
    },
  };

  // Privacy state
  const [privacyPrefs, setPrivacyPrefs] = useState(user.privacyPrefs);

  const togglePrivacy = (type) =>
    setPrivacyPrefs((prev) => ({ ...prev, [type]: !prev[type] }));

  const handleSavePrivacy = () =>
    alert("Privacy settings saved: " + JSON.stringify(privacyPrefs, null, 2));

  return (
    <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
      <h2 className='text-xl font-semibold flex items-center gap-2'>
        <Shield className='w-5 h-5 text-red-400' /> Privacy Settings
      </h2>
      <div className='flex flex-col space-y-2'>
        {Object.keys(privacyPrefs).map((type) => (
          <div key={type} className='flex items-center justify-between'>
            <span>{type.replace(/([A-Z])/g, " $1")}</span>
            <Badge
              variant={privacyPrefs[type] ? "success" : "error"}
              onClick={() => togglePrivacy(type)}
              className='cursor-pointer'
            >
              {privacyPrefs[type] ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        ))}
      </div>
      <Button onClick={handleSavePrivacy}>Save Privacy</Button>
    </section>
  );
}
