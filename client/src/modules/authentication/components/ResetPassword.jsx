import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetPassPassword } from "../slice/userSlice";
import Circular from "../../../components/loader/Circular";
import { Input, Button } from "../../../components";
import { useAuthForm } from "../../../components/hooks/useAuthForm";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialFormData = {
    newPassword: "",
    confirmPassword: ""
  };

  const {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit,
    handleAuthStateChange
  } = useAuthForm(initialFormData, ["newPassword", "confirmPassword"]);

  // Handle auth state changes
  useEffect(() => {
    handleAuthStateChange();
  }, [handleAuthStateChange]);

  // Navigate to auth page on successful reset
  useEffect(() => {
    if (formData.newPassword && formData.confirmPassword && 
        formData.newPassword === formData.confirmPassword && 
        !errors.newPassword && !errors.confirmPassword) {
      // This will be handled by the success message in handleAuthStateChange
    }
  }, [formData, errors]);

  const onSubmit = useCallback(async (data) => {
    try {
      await dispatch(resetPassPassword({ 
        token, 
        password: data.newPassword 
      }));
      // Navigate after successful reset
      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    } catch (error) {
      console.error("Reset password error:", error);
    }
  }, [dispatch, token, navigate]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
      {loading && <Circular />}
      <div className='bg-black/30 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text'>
          Reset Your Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {/* New Password */}
          <Input
            type='password'
            label='New Password'
            name='newPassword'
            placeholder='Enter your new password'
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            required
            showToggle={true}
            isVisible={showNewPassword}
            onToggle={() => setShowNewPassword(!showNewPassword)}
          />

          {/* Confirm Password */}
          <Input
            type='password'
            label='Confirm Password'
            name='confirmPassword'
            placeholder='Confirm your new password'
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            showToggle={true}
            isVisible={showConfirmPassword}
            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <Button
            type='submit'
            disabled={loading}
            className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 rounded-lg transition-all font-medium text-sm transform hover:scale-[1.02] active:scale-[0.98]'
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
