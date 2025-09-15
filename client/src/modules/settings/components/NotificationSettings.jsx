import React, { useState } from "react";
import Navbar from "../../../components/header";
import { Footer } from "../../../components";
import { Badge, Button } from "../../../components";
import { Bell } from "lucide-react";

export default function NotificationSettings() {
  // Static demo user data
  const user = {
    name: "John Doe",
    notificationPrefs: {
      email: true,
      sms: false,
      push: true,
      reminders: true,
    },
  };

  // Notification state
  const [notifPrefs, setNotifPrefs] = useState(user.notificationPrefs);

  const toggleNotif = (type) =>
    setNotifPrefs((prev) => ({ ...prev, [type]: !prev[type] }));

  const handleSaveNotifications = () =>
    alert("Notifications saved: " + JSON.stringify(notifPrefs, null, 2));

  return (
    <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
      <h2 className='text-xl font-semibold flex items-center gap-2'>
        <Bell className='w-5 h-5 text-yellow-400' /> Notification Preferences
      </h2>
      <div className='flex flex-col space-y-2'>
        {Object.keys(notifPrefs).map((type) => (
          <div key={type} className='flex items-center justify-between'>
            <span className='capitalize'>{type}</span>
            <Badge
              variant={notifPrefs[type] ? "success" : "error"}
              onClick={() => toggleNotif(type)}
              className='cursor-pointer'
            >
              {notifPrefs[type] ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        ))}
      </div>
      <Button onClick={handleSaveNotifications}>Save Notifications</Button>
    </section>
  );
}
