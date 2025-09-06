import React, { useState } from "react";
import Navbar from "../../../components/header";
import { Footer } from "../../../components/ui/Footer";
import { Button } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Github, Linkedin, FileText, RefreshCw } from "lucide-react";
import { useSelector } from "react-redux";

export default function PortfolioSyncPage() {
  const user = useSelector((state) => state.user?.user);
  // Example user integration data
  const data = {
    name: "Rajan Kumar",
    integrations: {
      github: true,
      linkedin: false,
      personalWebsite: true,
    },
  };

  const [integrations, setIntegrations] = useState(data.integrations);
  const [syncing, setSyncing] = useState(false);

  const toggleIntegration = (type) => {
    setIntegrations((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
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
    <>
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
        <Navbar data={user} isSearchBar={false} />
        <div className='max-w-6xl mx-auto px-4 py-8'>
          <h1 className='text-4xl font-bold drop-shadow-lg mb-6'>
            Portfolio Sync
          </h1>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Left Column: Integration Status */}
            <div className='space-y-6'>
              <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <FileText className='w-5 h-5 text-cyan-400' /> Integrations
                </h2>
                <div className='flex flex-col space-y-3'>
                  {Object.keys(integrations).map((type) => (
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
            </div>

            {/* Right Column: Sync Controls */}
            <div className='space-y-6'>
              <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4 flex flex-col items-start'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <RefreshCw className='w-5 h-5 text-yellow-400' /> Sync
                  Portfolio
                </h2>
                <p className='text-gray-300'>
                  Sync your connected integrations to update your SkillBridge
                  profile. You can manually trigger a sync anytime.
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

              <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
                <h2 className='text-xl font-semibold'>Last Sync</h2>
                <p className='text-gray-400'>
                  Your portfolio was last synced:{" "}
                  <span className='font-semibold'>2 days ago</span>
                </p>
                <p className='text-gray-400'>
                  Next automatic sync:{" "}
                  <span className='font-semibold'>In 24 hours</span>
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
