import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../slice/userSlice";
import { Input, Button } from "../../../components";
import OAuthButtons from "../../../components/shared/OAuthButtons";
import { useAuthForm } from "../../../components/hooks/useAuthForm";

const SignUp = ({ switchMode }) => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const initialFormData = {
    name: "",
    email: "",
    role: "",
    domains: "",
    experience: "",
    availability: "full-time",
    password: "",
  };

  const requiredFields = ["name", "email", "role", "domains", "experience", "availability", "password"];

  const {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit,
    handleAuthStateChange
  } = useAuthForm(initialFormData, requiredFields);

  // Handle auth state changes
  useEffect(() => {
    handleAuthStateChange();
  }, [handleAuthStateChange]);

  const onSubmit = useCallback(async (data) => {
    try {
      const result = await dispatch(registerUser(data));
      if (result?.payload?.status === 201) {
        switchMode();
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  }, [dispatch, switchMode]);

  return (
    <div className='space-y-6'>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Input
            label='Full Name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='Enter your full name'
            error={errors.name}
            required
          />
          <Input
            type='email'
            label='Email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='Enter your email'
            error={errors.email}
            required
          />
          <Input
            label='Role'
            name='role'
            type='select'
            value={formData.role}
            onChange={handleChange}
            error={errors.role}
            options={[
              { value: "", label: "Select Role" },
              { value: "developer", label: "Developer" },
              { value: "admin", label: "Admin" },
              { value: "project-owner", label: "Project Owner" },
            ]}
            required
          />
          <Input
            type='number'
            label='Experience (years)'
            name='experience'
            value={formData.experience}
            onChange={handleChange}
            min={0}
            placeholder='0'
            error={errors.experience}
            required
          />
          <Input
            label='Preferred Domains'
            name='domains'
            value={formData.domains}
            onChange={handleChange}
            placeholder='Web Dev, AI/ML, Mobile...'
            error={errors.domains}
            required
          />
          <Input
            label='Availability'
            name='availability'
            type='select'
            value={formData.availability}
            onChange={handleChange}
            error={errors.availability}
            options={[
              { value: "full-time", label: "Full-time" },
              { value: "part-time", label: "Part-time" },
              { value: "freelance", label: "Freelance" },
            ]}
            required
          />
        </div>

        <Input
          type='password'
          label='Password'
          name='password'
          value={formData.password}
          onChange={handleChange}
          placeholder='Create a strong password'
          error={errors.password}
          showToggle={true}
          isVisible={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          required
        />

        <Button
          type='submit'
          disabled={loading}
          className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 rounded-lg transition-all font-medium text-sm transform hover:scale-[1.02] active:scale-[0.98]'
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <p className='text-center text-sm text-gray-400'>
        Already have an account?{" "}
        <span
          onClick={switchMode}
          className='text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition-colors'
        >
          Sign In
        </span>
      </p>

      {/* OAuth Buttons */}
      <OAuthButtons />
    </div>
  );
};

export default SignUp;
