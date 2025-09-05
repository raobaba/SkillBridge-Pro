import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassPassword, clearAuthState } from "../slice/userSlice";
import Circular from "../../../components/loader/Circular";
import { toast } from "react-toastify";
import { Input, Button } from "../../../components";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    dispatch(resetPassPassword({ token, password: newPassword }));
  };

  useEffect(() => {
    if (passwordError) toast.error(passwordError);
  }, [passwordError]);

  useEffect(() => {
    if (error) toast.error(error.message || "Reset failed. Try again.");
    if (message?.includes("Password reset")) {
      toast.success(message || "Password reset successful");
      setTimeout(() => {
        dispatch(clearAuthState());
        navigate("/auth");
      }, 2000);
    }
  }, [error, message, dispatch, navigate]);

  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {loading && <Circular />}
      <div className="bg-black/30 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Reset Your Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <Input
            type={showNewPassword ? "text" : "password"}
            label="New Password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            showToggle={true}
            isVisible={showNewPassword}
            onToggle={toggleNewPasswordVisibility}
          />

          {/* Confirm Password */}
          <Input
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm Password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            showToggle={true}
            isVisible={showConfirmPassword}
            onToggle={toggleConfirmPasswordVisibility}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 rounded-lg transition-all font-medium text-sm transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
