import React from "react";
import { User, Mail, MapPin, Save, X, Settings, Trash } from "lucide-react";
import { Input, Button } from "../ui/Card";

export default function UserCard({
  form,
  userData,
  editing,
  imgError,
  handleChange,
  handleAvatarChange,
  handleSave,
  setEditing,
  handleDelete,
  setImgError,
}) {
  return (
    <div className='bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 space-y-4 sm:space-y-0'>
      {/* Avatar */}
      <div className='w-24 h-24 rounded-full border-2 border-blue-400 overflow-hidden bg-gray-800 relative'>
        <label className='cursor-pointer w-full h-full flex items-center justify-center'>
          {form?.avatarPreview ? (
            <img
              src={form.avatarPreview}
              alt='Preview'
              className='w-full h-full object-cover'
            />
          ) : !imgError && userData?.avatarUrl ? (
            <img
              src={userData.avatarUrl}
              alt={userData?.name || "User"}
              className='w-full h-full object-cover'
              onError={() => setImgError(true)}
            />
          ) : (
            <User className='w-12 h-12 text-gray-300' />
          )}
          <Input
            accept='image/*'
            type='file'
            onChange={handleAvatarChange}
            className='hidden'
          />
        </label>
      </div>

      {/* Info */}
      <div className='flex-1 text-center sm:text-left'>
        {editing ? (
          <Input
            name='name'
            value={form?.name || ""}
            onChange={handleChange}
            className='text-2xl font-bold bg-white/10'
          />
        ) : (
          <h1 className='text-2xl font-bold'>{userData?.name || "Unnamed"}</h1>
        )}

        <p className='text-gray-400 flex items-center justify-center sm:justify-start'>
          <Mail className='w-4 h-4 mr-2' /> {userData?.email || "No email"}
        </p>
        <p className='text-gray-400 flex items-center justify-center sm:justify-start'>
          <MapPin className='w-4 h-4 mr-2' /> {userData?.location || "Unknown"}
        </p>
      </div>

      {/* Actions */}
      <div className='flex space-x-2'>
        {editing ? (
          <>
            <Button onClick={handleSave} variant='default'>
              <Save className='w-4 h-4 mr-1' /> Save
            </Button>
            <Button onClick={() => setEditing(false)} variant='outline'>
              <X className='w-4 h-4 mr-1' /> Cancel
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setEditing(true)} variant='default'>
              <Settings className='w-4 h-4 mr-1' /> Edit
            </Button>
            <Button onClick={handleDelete} variant='outline'>
              <Trash className='w-4 h-4 mr-1' /> Deactivate
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
