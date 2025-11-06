import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../slice/userSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input, Button } from "../../../components";
import { useAuthForm } from "../../../components/hooks/useAuthForm";

const AdminSignIn = ({ switchMode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [loginFailed, setLoginFailed] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Get redirect URL from query parameters
  const redirectTo = searchParams.get('redirect_to');

  const initialFormData = {
    email: "",
    password: "",
    role: "admin",
  };

  const {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit,
    handleAuthStateChange
  } = useAuthForm(initialFormData, ["email", "password"]);

  // Reset login failed state when user starts typing
  const handleInputChange = useCallback((e) => {
    if (loginFailed) {
      setLoginFailed(false);
      setLoginError("");
    }
    handleChange(e);
  }, [loginFailed, handleChange]);

  // Handle auth state changes
  useEffect(() => {
    handleAuthStateChange();
  }, [handleAuthStateChange]);

  // Track login failures
  useEffect(() => {
    if (errors.password || errors.email) {
      setLoginFailed(true);
    }
  }, [errors]);

  const onSubmit = useCallback(async (data) => {
    try {
      const result = await dispatch(loginUser(data));
      
      // Check if action was rejected
      if (result.type === "user/login/rejected") {
        // Login failed - check error message
        const errorMessage = result?.payload?.message || result?.payload?.error || "";
        setLoginError(errorMessage);
        setLoginFailed(true);
      } else if (result?.payload?.status === 200 || result?.payload?.token) {
        // Navigate to the intended route or default to dashboard
        const targetRoute = redirectTo ? decodeURIComponent(redirectTo) : "/dashboard";
        navigate(targetRoute);
      } else {
        // Login failed - check error message
        const errorMessage = result?.payload?.message || result?.payload?.error || "";
        setLoginError(errorMessage);
        setLoginFailed(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "";
      setLoginError(errorMessage);
      setLoginFailed(true);
    }
  }, [dispatch, navigate, redirectTo]);

  return (
    <div className='space-y-6'>
      <div className='bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4'>
        <p className='text-red-400 text-sm'>
          ⚠️ This is a secure admin area. Only authorized personnel should access this section.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {/* Email */}
        <Input
          type='email'
          label='Email'
          name='email'
          placeholder='Enter your admin email'
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          required
        />

        {/* Password */}
        <Input
          type='password'
          label='Password'
          name='password'
          placeholder='Enter your password'
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          showToggle={true}
          isVisible={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          required
        />

        {/* Forgot Password - only show if password is incorrect, not if email doesn't exist */}
        {loginFailed && loginError && !loginError.toLowerCase().includes("does not exist") && (
          <div className='mt-2 text-right'>
            <p
              onClick={() => navigate("/forgot-password")}
              className='text-sm text-red-400 hover:underline cursor-pointer'
            >
              Forgot Password?
            </p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type='submit'
          disabled={loading}
          className='w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 py-3 rounded-lg transition-all font-medium text-sm transform hover:scale-[1.02] active:scale-[0.98]'
        >
          {loading ? "Signing In..." : "Sign In as Admin"}
        </Button>
      </form>

      <p className='text-center text-sm text-gray-400'>
        Don't have an account?{" "}
        <span
          onClick={switchMode}
          className='text-red-400 hover:text-red-300 hover:underline cursor-pointer transition-colors'
        >
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default AdminSignIn;

