import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../slice/userSlice";
import { useNavigate } from "react-router-dom";
import { Input, Button } from "../../../components";
import OAuthButtons from "../../../components/shared/OAuthButtons";
import { useAuthForm } from "../../../components/hooks/useAuthForm";

const SignIn = ({ switchMode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginFailed, setLoginFailed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const initialFormData = {
    email: "",
    password: "",
    role: "developer",
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
      if (result?.payload?.status === 200) {
        navigate("/");
      } else {
        // Login failed - show forgot password option
        setLoginFailed(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginFailed(true);
    }
  }, [dispatch, navigate]);

  return (
    <div className='space-y-6'>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {/* Email */}
        <Input
          type='email'
          label='Email'
          name='email'
          placeholder='Enter your email'
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          required
        />

        {/* Role Dropdown */}
        <div>
          <label className='block mb-2 text-sm font-medium text-gray-300'>
            Role
          </label>
          <select
            name='role'
            value={formData.role}
            onChange={handleChange}
            className='w-full bg-white/10 px-4 py-3 rounded-lg border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all'
          >
            <option className='bg-black text-white' value='developer'>
              Developer
            </option>
            <option className='bg-black text-white' value='project-owner'>
              Project Owner
            </option>
            <option className='bg-black text-white' value='admin'>
              Admin
            </option>
          </select>
        </div>

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

        {/* Forgot Password if login failed */}
        {loginFailed && (
          <div className='mt-2 text-right'>
            <p
              onClick={() => navigate("/forgot-password")}
              className='text-sm text-blue-400 hover:underline cursor-pointer'
            >
              Forgot Password?
            </p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type='submit'
          disabled={loading}
          className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 rounded-lg transition-all font-medium text-sm transform hover:scale-[1.02] active:scale-[0.98]'
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <p className='text-center text-sm text-gray-400'>
        Don't have an account?{" "}
        <span
          onClick={switchMode}
          className='text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition-colors'
        >
          Sign Up
        </span>
      </p>

      {/* OAuth Buttons */}
      <OAuthButtons />
    </div>
  );
};

export default SignIn;
