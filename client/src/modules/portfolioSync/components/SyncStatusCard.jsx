import React, { useState } from "react";
import { Badge, Button } from "../../../components";
import { Github, Linkedin, FileText, RefreshCw } from "lucide-react";

export default function SyncStatusCard({ userData }) {
  // Use provided userData or default data
  const data = userData || {
    name: "Rajan Kumar",
    integrations: {
      github: true,
      linkedin: false,
      personalWebsite: true,
    },
  };

  const [integrations, setIntegrations] = useState(data.integrations);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("2 days ago");

  const toggleIntegration = (type) => {
    setIntegrations((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      const now = new Date();
      setLastSyncTime(now.toLocaleString());
      alert("Portfolio synced successfully!");
    }, 1500); // simulate async sync
  };

  const integrationIcon = (type) => {
    switch (type) {
      case "github":
        return <Github className='w-5 h-5 text-gray-200' />;
      case "linkedin":
        return <Linkedin className='w-5 h-5 text-blue-500' />;
      case "personalWebsite":
        return <FileText className='w-5 h-5 text-green-400' />;
      default:
        return <FileText className='w-5 h-5 text-gray-400' />;
    }
  };

  return (
    <div className='space-y-6'>
      {/* Integrations */}
      <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
        <h2 className='text-xl font-semibold flex items-center gap-2'>
          <FileText className='w-5 h-5 text-cyan-400' /> Integrations
        </h2>
        <div className='flex flex-col space-y-3'>
          {Object.keys(integrations || {}).map((type) => (
            <div
              key={type}
              className='flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10 transition hover:bg-white/10'
            >
              <div className='flex items-center gap-2'>
                {integrationIcon(type)}
                <span className='capitalize'>{type}</span>
              </div>
              <Badge
                variant={integrations[type] ? "success" : "error"}
                onClick={() => toggleIntegration(type)}
                className='cursor-pointer'
              >
                {integrations[type] ? "Connected" : "Disconnected"}
              </Badge>
            </div>
          ))}
        </div>
      </section>

      {/* Sync Control */}
      <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4 flex flex-col items-start'>
        <h2 className='text-xl font-semibold flex items-center gap-2'>
          <RefreshCw className='w-5 h-5 text-yellow-400' /> Sync Portfolio
        </h2>
        <p className='text-gray-300'>
          Sync your connected integrations to update your profile. You can
          manually trigger a sync anytime.
        </p>
        <Button
          onClick={handleSync}
          disabled={syncing}
          className='flex items-center gap-2'
        >
          {syncing ? "Syncing..." : "Sync Now"}
          <RefreshCw className='w-4 h-4 animate-spin' />
        </Button>
      </section>

      {/* Last Sync Info */}
      <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
        <h2 className='text-xl font-semibold'>Last Sync</h2>
        <p className='text-gray-400'>
          Your portfolio was last synced:{" "}
          <span className='font-semibold'>{lastSyncTime}</span>
        </p>
        <p className='text-gray-400'>
          Next automatic sync:{" "}
          <span className='font-semibold'>In 24 hours</span>
        </p>
      </section>
    </div>
  );
}
