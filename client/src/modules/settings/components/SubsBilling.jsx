import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge, Button } from "../../../components";
import { CreditCard, Save, Loader2 } from "lucide-react";
import {
  getSubscription,
  updateSubscription,
  resetSubscriptionSuccess,
} from "../slice/settingsSlice";

const SubsBilling = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user) || {};
  
  // Redux state
  const {
    subscription,
    subscriptionLoading,
    subscriptionError,
    subscriptionSuccess,
  } = useSelector((state) => state.settings);

  // Local state for immediate UI updates
  const [localSubscription, setLocalSubscription] = useState(subscription);

  // Load settings on component mount
  useEffect(() => {
    dispatch(getSubscription());
  }, [dispatch]);

  // Update local state when Redux state changes
  useEffect(() => {
    setLocalSubscription(subscription);
  }, [subscription]);

  // Show success message
  useEffect(() => {
    if (subscriptionSuccess) {
      alert("Subscription settings saved successfully!");
      dispatch(resetSubscriptionSuccess());
    }
  }, [subscriptionSuccess, dispatch]);

  const handleSaveSubscription = async () => {
    try {
      await dispatch(updateSubscription(localSubscription)).unwrap();
    } catch (error) {
      console.error('Failed to save subscription settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  return (
    <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
      <h2 className='text-xl font-semibold flex items-center gap-2'>
        <CreditCard className='w-5 h-5 text-green-400' /> Subscription / Billing
      </h2>
      
      {/* Error Display */}
      {subscriptionError && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-300 text-sm">{subscriptionError}</p>
        </div>
      )}
      
      <div className='flex items-center justify-between'>
        <span>Current Plan</span>
        <Badge variant='info'>{localSubscription?.plan || user.subscription || "Free"}</Badge>
      </div>
      
      <div className='flex items-center justify-between'>
        <span>Status</span>
        <Badge variant={localSubscription?.status === 'active' ? 'success' : 'warning'}>
          {localSubscription?.status || "Active"}
        </Badge>
      </div>
      
      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSaveSubscription}
          disabled={subscriptionLoading}
          className="flex items-center gap-2 disabled:opacity-50"
        >
          {subscriptionLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {subscriptionLoading ? 'Saving...' : 'Save Subscription Settings'}
        </Button>
      </div>
      
      <Button>Manage Subscription</Button>
    </section>
  );
};

export default SubsBilling;
