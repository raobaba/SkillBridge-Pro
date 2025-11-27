import React from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Crown, Lock, ArrowRight, X } from "lucide-react";
import { Button } from "../../../components";

const UpgradePrompt = ({ 
  isOpen, 
  onClose, 
  title = "Upgrade Required", 
  message,
  feature,
  currentLimit,
  upgradeLimit 
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    onClose();
    navigate("/billing-subscription");
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm" style={{ zIndex: 9999 }}>
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-2xl p-6 w-full max-w-md mx-4 border border-white/10 shadow-2xl" style={{ zIndex: 10000 }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-5 h-5 text-yellow-400" />
            <p className="text-gray-300">{message || `You've reached your limit of ${currentLimit} ${feature || 'items'}.`}</p>
          </div>
          
          {upgradeLimit && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <p className="text-blue-200 text-sm">
                Upgrade to unlock up to {upgradeLimit === Infinity ? 'unlimited' : upgradeLimit} {feature || 'items'}!
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white"
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleUpgrade}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center justify-center gap-2"
          >
            Upgrade Now
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  // Render modal using portal to document body to avoid z-index stacking context issues
  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
};

export default UpgradePrompt;

