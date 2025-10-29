import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Github, Save, Loader2 } from "lucide-react";
import { Badge, Button } from "../../../components";
import {
  getIntegrations,
  updateIntegrations,
  updateIntegrationPreference,
  resetIntegrationSuccess,
} from "../slice/settingsSlice";

export default function Integrations({ integrations, toggleIntegration }) {
  const dispatch = useDispatch();
  
  // Redux state
  const {
    integrations: reduxIntegrations,
    integrationLoading,
    integrationError,
    integrationSuccess,
  } = useSelector((state) => state.settings);

  // Use Redux state if available, otherwise fall back to props
  const currentIntegrations = reduxIntegrations && Object.keys(reduxIntegrations).length > 0 
    ? reduxIntegrations 
    : integrations;

  // Local state for immediate UI updates
  const [localIntegrations, setLocalIntegrations] = useState(currentIntegrations);

  // Load settings on component mount
  useEffect(() => {
    dispatch(getIntegrations());
  }, [dispatch]);

  // Update local state when Redux state changes
  useEffect(() => {
    if (reduxIntegrations && Object.keys(reduxIntegrations).length > 0) {
      setLocalIntegrations(reduxIntegrations);
    }
  }, [reduxIntegrations]);

  // Show success message
  useEffect(() => {
    if (integrationSuccess) {
      alert("Integration settings saved successfully!");
      dispatch(resetIntegrationSuccess());
    }
  }, [integrationSuccess, dispatch]);

  const handleToggleIntegration = (type) => {
    const newValue = !localIntegrations[type];
    setLocalIntegrations((prev) => ({ ...prev, [type]: newValue }));
    
    // Update Redux state
    dispatch(updateIntegrationPreference({ key: type, value: newValue }));
    
    // Also call the parent's toggle function for backward compatibility
    if (toggleIntegration) {
      toggleIntegration(type);
    }
  };

  const handleSaveIntegrations = async () => {
    try {
      await dispatch(updateIntegrations(localIntegrations)).unwrap();
    } catch (error) {
      console.error('Failed to save integration settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  return (
    <section className='bg-black/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10 space-y-4'>
      <h2 className='text-xl font-semibold flex items-center gap-2'>
        <Github className='w-5 h-5 text-gray-200' /> Integrations
      </h2>
      
      {/* Error Display */}
      {integrationError && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-300 text-sm">{integrationError}</p>
        </div>
      )}
      
      <div className='flex flex-col space-y-2'>
        {Object.keys(localIntegrations).map((type) => (
          <div key={type} className='flex items-center justify-between'>
            <span className='capitalize'>{type}</span>
            <Badge
              variant={localIntegrations[type] ? "success" : "error"}
              onClick={() => handleToggleIntegration(type)}
              className='cursor-pointer hover:opacity-80 transition-opacity'
            >
              {localIntegrations[type] ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        ))}
      </div>
      
      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSaveIntegrations}
          disabled={integrationLoading}
          className="flex items-center gap-2 disabled:opacity-50"
        >
          {integrationLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {integrationLoading ? 'Saving...' : 'Save Integration Settings'}
        </Button>
      </div>
    </section>
  );
}
