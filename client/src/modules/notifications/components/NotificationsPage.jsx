import React, { useState } from "react";
import Navbar from "../../../components/header/dashboard";
import { CheckCircle, Bell, Zap, Code, FileText } from "lucide-react";
import { Button } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Footer } from "../../../components/ui/Footer";
import { useSelector } from "react-redux";

export default function NotificationsPage() {
  const user = useSelector((state) => state.user?.user);
  const [list, setList] = useState([
    {
      id: 1,
      type: "Project",
      title: "New Project Assigned",
      message: "You have been assigned to the AI Dashboard project.",
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      type: "Profile",
      title: "Profile Update Reminder",
      message: "Update your skills to improve match accuracy.",
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      type: "XP",
      title: "Weekly XP Report",
      message: "You earned 150 XP this week. Keep going!",
      read: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 4,
      type: "AI",
      title: "Resume Enhancement Available",
      message: "AI has suggested improvements for your resume.",
      read: false,
      createdAt: new Date().toISOString(),
    },
  ]);

  const [activeTab, setActiveTab] = useState("All");

  const handleMarkRead = (id) => {
    setList((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleMarkAllRead = () => {
    setList((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const filteredList =
    activeTab === "All"
      ? list
      : list.filter((notif) => notif.type === activeTab);

  const typeIcon = (type) => {
    switch (type) {
      case "Project":
        return <FileText className='w-5 h-5 text-blue-400' />;
      case "XP":
        return <Zap className='w-5 h-5 text-yellow-400' />;
      case "AI":
        return <Code className='w-5 h-5 text-green-400' />;
      case "Profile":
        return <Bell className='w-5 h-5 text-purple-400' />;
      default:
        return <Bell className='w-5 h-5 text-gray-400' />;
    }
  };

  const tabs = ["All", "Project", "XP", "AI", "Profile"];

  return (
    <>
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
        <Navbar data={user} isSearchBar={false} />

        <div className='max-w-5xl mx-auto px-4 py-6 sm:py-8'>
          {/* Header */}
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 sm:gap-0'>
            <h1 className='text-2xl sm:text-3xl font-bold flex items-center space-x-2'>
              <Bell className='w-6 h-6' />
              <span>Notifications</span>
            </h1>
            <Button
              variant='outline'
              onClick={handleMarkAllRead}
              className='w-full sm:w-auto'
            >
              Mark All as Read
            </Button>
          </div>

          {/* Tabs */}
          <div className='flex flex-wrap gap-2 sm:gap-4 mb-6'>
            {tabs.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                onClick={() => setActiveTab(tab)}
                className='text-sm'
              >
                {tab}
              </Button>
            ))}
          </div>

          {/* Notification List */}
          <div className='space-y-4'>
            {filteredList.length === 0 ? (
              <p className='text-gray-400'>You have no notifications.</p>
            ) : (
              filteredList.map((notif) => (
                <div
                  key={notif.id}
                  className={`bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center transition-all duration-300 gap-3 ${
                    notif.read ? "opacity-50" : "opacity-100"
                  }`}
                >
                  <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-1'>
                    <div className='flex items-center gap-2'>
                      {typeIcon(notif.type)}
                      <span className='font-semibold'>{notif.title}</span>
                      <Badge>{notif.type}</Badge>
                    </div>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:gap-4'>
                      <span className='text-gray-300 text-sm'>
                        {notif.message}
                      </span>
                      <span className='text-gray-400 text-xs mt-1 sm:mt-0'>
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {!notif.read && (
                    <Button
                      variant='default'
                      onClick={() => handleMarkRead(notif.id)}
                      className='ml-0 sm:ml-4 mt-2 sm:mt-0 flex-shrink-0'
                    >
                      <CheckCircle className='w-4 h-4 mr-1' />
                      Mark Read
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
