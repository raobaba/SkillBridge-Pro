import React from "react";
import { Save, Settings, Trash, Plus } from "lucide-react";
import { Button } from "../ui/Card";

export default function QuickActions({ navigate, handleSave }) {
  return (
    <div className='bg-white/5 border border-white/10 rounded-xl p-6'>
      <h3 className='text-lg font-semibold mb-4'>Quick Actions</h3>
      <div className='grid grid-cols-2 gap-4'>
        <Button onClick={handleSave} variant='default'>
          <Save className='w-4 h-4 mr-1' /> Save
        </Button>
        <Button onClick={() => navigate("/settings")} variant='outline'>
          <Settings className='w-4 h-4 mr-1' /> Settings
        </Button>
        <Button onClick={() => navigate("/notifications")} variant='outline'>
          <Trash className='w-4 h-4 mr-1' /> Notifications
        </Button>
        <Button variant='outline'>
          <Plus className='w-4 h-4 mr-1' /> Add Info
        </Button>
      </div>
    </div>
  );
}
