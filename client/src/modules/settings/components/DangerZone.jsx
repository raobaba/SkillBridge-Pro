import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "../../../components";
import {
  deleteUser,
  resetProfileSuccess,
} from "../slice/settingsSlice";

export default function DangerZone() {
  const dispatch = useDispatch();
  
  // Redux state
  const {
    profileLoading,
    profileError,
    profileSuccess,
  } = useSelector((state) => state.settings);

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  // Show success message
  useEffect(() => {
    if (profileSuccess) {
      toast.success("Account deleted successfully!");
      dispatch(resetProfileSuccess());
      // Redirect to login or home page
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }
  }, [profileSuccess, dispatch]);

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      toast.error("Please type 'DELETE' to confirm account deletion");
      return;
    }

    try {
      await dispatch(deleteUser()).unwrap();
    } catch (error) {
      console.error('Failed to delete account:', error);
      toast.error('Failed to delete account. Please try again.');
    }
  };

  return (
    <section className='bg-red-600/20 backdrop-blur-sm p-6 rounded-2xl border border-red-500/30 space-y-4 text-white'>
      <h2 className='text-xl font-semibold flex items-center gap-2'>
        <AlertTriangle className='w-5 h-5 text-red-400' />
        Danger Zone
      </h2>
      
      {/* Error Display */}
      {profileError && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-300 text-sm">{profileError}</p>
        </div>
      )}
      
      <p className='text-gray-200 text-sm'>
        Delete your account permanently. This action cannot be undone.
      </p>
      
      {!showConfirm ? (
        <Button 
          variant='destructive'
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Account
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-300 text-sm mb-2">
              <strong>Warning:</strong> This will permanently delete your account and all associated data.
            </p>
            <p className="text-gray-300 text-sm">
              Type <strong>DELETE</strong> in the box below to confirm:
            </p>
          </div>
          
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="w-full p-3 rounded-xl bg-white/10 border border-red-500/30 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:outline-none"
          />
          
          <div className="flex gap-3">
            <Button 
              onClick={handleDeleteAccount}
              disabled={profileLoading || confirmText !== "DELETE"}
              variant='destructive'
              className="flex items-center gap-2 disabled:opacity-50"
            >
              {profileLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              {profileLoading ? 'Deleting...' : 'Confirm Delete'}
            </Button>
            
            <Button 
              onClick={() => {
                setShowConfirm(false);
                setConfirmText("");
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
