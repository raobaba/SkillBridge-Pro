import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  Key, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Settings, 
  Save, 
  RotateCcw, 
  Trash2, 
  Download, 
  Upload, 
  Bell, 
  Globe, 
  Database, 
  Zap, 
  Star, 
  Award, 
  Activity, 
  BarChart3, 
  TrendingUp, 
  Target, 
  Clock, 
  Info, 
  HelpCircle, 
  ExternalLink, 
  Copy, 
  Share2, 
  Edit, 
  Plus, 
  Minus, 
  X 
} from "lucide-react";
import { Button } from "../../../components";
import {
  changePassword,
  resetPasswordSuccess,
} from "../slice/settingsSlice";

export default function AccountSettings({
  formData,
  handleInputChange,
  handleSaveProfile,
}) {
  const dispatch = useDispatch();
  
  // Redux state
  const {
    passwordLoading,
    passwordError,
    passwordSuccess,
  } = useSelector((state) => state.settings);
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    newPassword: false,
    confirmPassword: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Show success message
  useEffect(() => {
    if (passwordSuccess) {
      toast.success("Password changed successfully!");
      dispatch(resetPasswordSuccess());
      // Clear form
      setFormData(prev => ({
        ...prev,
        password: "",
        newPassword: "",
        confirmPassword: ""
      }));
    }
  }, [passwordSuccess, dispatch]);

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    handleInputChange(e);
    
    if (name === 'newPassword') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.password) newErrors.password = "Current password is required";
    if (!formData?.newPassword) newErrors.newPassword = "New password is required";
    if (formData?.newPassword && formData?.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    if (formData?.newPassword !== formData?.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await dispatch(changePassword({
        currentPassword: formData.password,
        newPassword: formData.newPassword
      })).unwrap();
    } catch (error) {
      console.error('Failed to change password:', error);
      toast.error('Failed to change password. Please try again.');
    }
  };

  const getPasswordStrengthColor = (strength) => {
    if (strength <= 2) return "from-red-500 to-red-600";
    if (strength <= 3) return "from-yellow-500 to-orange-500";
    if (strength <= 4) return "from-blue-500 to-blue-600";
    return "from-green-500 to-green-600";
  };

  const getPasswordStrengthText = (strength) => {
    if (strength <= 2) return "Weak";
    if (strength <= 3) return "Fair";
    if (strength <= 4) return "Good";
    return "Strong";
  };


  return (
    <section className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
          <Lock className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white">Account Settings</h2>
      </div>

      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        {/* Error Display */}
        {passwordError && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-300 text-sm">{passwordError}</p>
          </div>
        )}
        
        {/* Password Change Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Current Password</label>
            <div className="relative">
              <input
                type={showPasswords.password ? "text" : "password"}
                name="password"
                value={formData?.password || ""}
                onChange={handlePasswordChange}
                placeholder="Enter your current password"
                className={`w-full p-3 rounded-xl bg-white/10 border text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 ${
                  errors.password ? "border-red-500" : "border-white/20"
                }`}
              />
              <Button
                type="button"
                onClick={() => togglePasswordVisibility('password')}
                variant="ghost"
                size="sm"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPasswords.password ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">New Password</label>
            <div className="relative">
              <input
                type={showPasswords.newPassword ? "text" : "password"}
                name="newPassword"
                value={formData?.newPassword || ""}
                onChange={handlePasswordChange}
                placeholder="Enter your new password"
                className={`w-full p-3 rounded-xl bg-white/10 border text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 ${
                  errors.newPassword ? "border-red-500" : "border-white/20"
                }`}
              />
              <Button
                type="button"
                onClick={() => togglePasswordVisibility('newPassword')}
                variant="ghost"
                size="sm"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPasswords.newPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData?.newPassword && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-400 text-xs">Password Strength</span>
                  <span className={`text-xs font-medium ${
                    passwordStrength <= 2 ? "text-red-400" :
                    passwordStrength <= 3 ? "text-yellow-400" :
                    passwordStrength <= 4 ? "text-blue-400" : "text-green-400"
                  }`}>
                    {getPasswordStrengthText(passwordStrength)}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getPasswordStrengthColor(passwordStrength)} transition-all duration-300`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
            
            {errors.newPassword && <p className="text-red-400 text-xs mt-1">{errors.newPassword}</p>}
          </div>

          <div>
            <label className="block text-gray-300 mb-2 text-sm font-medium">Confirm New Password</label>
            <div className="relative">
              <input
                type={showPasswords.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData?.confirmPassword || ""}
                onChange={handlePasswordChange}
                placeholder="Confirm your new password"
                className={`w-full p-3 rounded-xl bg-white/10 border text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 ${
                  errors.confirmPassword ? "border-red-500" : "border-white/20"
                }`}
              />
              <Button
                type="button"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                variant="ghost"
                size="sm"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPasswords.confirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            type="submit" 
            variant="default" 
            size="lg"
            disabled={passwordLoading}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:scale-105 transition-all duration-300"
          >
            {passwordLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Changing...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Change Password
              </>
            )}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            size="lg"
            className="flex-1 hover:scale-105 transition-transform duration-300"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Advanced Security Options */}
        {showAdvanced && (
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              Advanced Security
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              <Button
                className="bg-white/5 hover:bg-white/10 p-3 rounded-lg border border-white/10 transition-all duration-300 hover:scale-105 text-left w-full"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm font-medium">Enable 2FA</span>
                </div>
              </Button>
              
              <Button
                className="bg-white/5 hover:bg-white/10 p-3 rounded-lg border border-white/10 transition-all duration-300 hover:scale-105 text-left w-full"
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span className="text-white text-sm font-medium">Login History</span>
                </div>
              </Button>
            </div>
          </div>
        )}

        {/* Toggle Advanced */}
        <Button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          variant="ghost"
          className="w-full bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm"
        >
          <Settings className="w-4 h-4" />
          {showAdvanced ? "Hide Advanced" : "Show Advanced"}
        </Button>
      </form>
    </section>
  );
}
