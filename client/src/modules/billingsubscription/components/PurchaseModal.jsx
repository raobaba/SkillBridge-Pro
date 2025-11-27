import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { X, CreditCard, Plus, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { Button } from "../../../components";
import { 
  purchaseSubscription, 
  getPaymentMethods, 
  addPaymentMethod,
  getBillingData 
} from "../slice/billingSlice";

const PurchaseModal = ({ isOpen, onClose, plan, onSuccess }) => {
  const dispatch = useDispatch();
  const { paymentMethods, loading, error } = useSelector((state) => state.billing);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    type: "Credit Card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    email: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen && paymentMethods.length === 0) {
      dispatch(getPaymentMethods());
    }
    // Set default payment method if available
    if (paymentMethods.length > 0 && !selectedPaymentMethod) {
      const defaultMethod = paymentMethods.find(m => m.default) || paymentMethods[0];
      setSelectedPaymentMethod(defaultMethod?.id || null);
    }
  }, [isOpen, paymentMethods, dispatch, selectedPaymentMethod]);

  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addPaymentMethod(paymentFormData)).unwrap();
      await dispatch(getPaymentMethods());
      setShowAddPaymentForm(false);
      setPaymentFormData({
        type: "Credit Card",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardholderName: "",
        email: "",
      });
    } catch (error) {
      console.error('Failed to add payment method:', error);
      toast.error('Failed to add payment method. Please try again.');
    }
  };

  const handlePurchase = async () => {
    if (!plan) return;

    // For free plan, no payment method needed
    if (plan.name.toLowerCase() === 'free') {
      setIsProcessing(true);
      try {
        await dispatch(purchaseSubscription({ 
          planId: plan.id, 
          paymentMethodId: null 
        })).unwrap();
        // Refresh billing data to get updated subscription
        await dispatch(getBillingData());
        toast.success('Subscription updated successfully! You now have access to Free plan features.');
        onSuccess && onSuccess();
        onClose();
      } catch (error) {
        console.error('Failed to purchase subscription:', error);
        toast.error(error?.message || 'Failed to purchase subscription. Please try again.');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // For paid plans, require payment method
    if (!selectedPaymentMethod && paymentMethods.length === 0) {
      toast.warning('Please add a payment method before purchasing a paid plan.');
      setShowAddPaymentForm(true);
      return;
    }

    if (!selectedPaymentMethod) {
      toast.warning('Please select a payment method.');
      return;
    }

    setIsProcessing(true);
    try {
      await dispatch(purchaseSubscription({ 
        planId: plan.id, 
        paymentMethodId: selectedPaymentMethod 
      })).unwrap();
      // Refresh billing data to get updated subscription with new features
      await dispatch(getBillingData());
      toast.success(`Congratulations! You've successfully upgraded to the ${plan.name} plan. You now have access to all premium features including unlimited projects!`);
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to purchase subscription:', error);
      toast.error(error?.message || 'Failed to purchase subscription. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm" style={{ zIndex: 9999 }}>
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-2xl p-6 w-full max-w-2xl mx-4 border border-white/10 shadow-2xl" style={{ zIndex: 10000 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Purchase {plan?.name} Plan</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            disabled={isProcessing}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Plan Summary */}
        <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">{plan?.name} Plan</h3>
              <p className="text-gray-300 text-sm">{plan?.period}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{plan?.price}</div>
              <p className="text-gray-400 text-sm">per {plan?.period === 'forever' ? 'forever' : 'month'}</p>
            </div>
          </div>
          <div className="space-y-2">
            {plan?.features?.slice(0, 3).map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method Selection */}
        {plan?.name.toLowerCase() !== 'free' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Select Payment Method</h3>
            
            {!showAddPaymentForm ? (
              <>
                {paymentMethods.length === 0 ? (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-400" />
                      <p className="text-yellow-200 text-sm">
                        No payment methods found. Please add one to continue.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 mb-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedPaymentMethod === method.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-blue-400" />
                            <div>
                              <p className="text-white font-semibold">{method.type}</p>
                              <p className="text-gray-400 text-sm">
                                {method.last4 ? `**** **** **** ${method.last4}` : method.email}
                              </p>
                            </div>
                            {method.default && (
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                                Default
                              </span>
                            )}
                          </div>
                          {selectedPaymentMethod === method.id && (
                            <CheckCircle className="w-5 h-5 text-blue-400" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  onClick={() => setShowAddPaymentForm(true)}
                  className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Payment Method
                </Button>
              </>
            ) : (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h4 className="text-white font-semibold mb-4">Add Payment Method</h4>
                <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Card Number</label>
                    <input
                      type="text"
                      value={paymentFormData.cardNumber}
                      onChange={(e) => setPaymentFormData({ ...paymentFormData, cardNumber: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        value={paymentFormData.expiryDate}
                        onChange={(e) => setPaymentFormData({ ...paymentFormData, expiryDate: e.target.value })}
                        placeholder="MM/YY"
                        className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">CVV</label>
                      <input
                        type="text"
                        value={paymentFormData.cvv}
                        onChange={(e) => setPaymentFormData({ ...paymentFormData, cvv: e.target.value })}
                        placeholder="123"
                        className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      value={paymentFormData.cardholderName}
                      onChange={(e) => setPaymentFormData({ ...paymentFormData, cardholderName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => setShowAddPaymentForm(false)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      disabled={loading}
                    >
                      {loading ? 'Adding...' : 'Add Payment Method'}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white"
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            onClick={handlePurchase}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            disabled={isProcessing || (plan?.name.toLowerCase() !== 'free' && !selectedPaymentMethod && paymentMethods.length === 0)}
          >
            {isProcessing ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Purchase ${plan?.name} Plan`
            )}
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

export default PurchaseModal;

