import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Github, Linkedin, Mail } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthState } from "../slice/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Input, Button } from "../../../components";

const SignIn = ({ switchMode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.user);

  const [loginFailed, setLoginFailed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "developer",
  });

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearAuthState());
    }
  }, [message, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setLoginFailed(true);
      dispatch(clearAuthState());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData))
      .then((res) => {
        if (res?.payload?.status === 200) navigate("/");
      })
      .catch(console.log);
  };

  const handleOAuthClick = (provider) => {
    window.location.href = `${import.meta.env.VITE_APP_API_URL}api/v1/auth/${provider}`;
  };

  return (
    <div className='space-y-6'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {/* Email */}
        <Input
          type='email'
          label='Email'
          name='email'
          placeholder='Enter your email'
          value={formData.email}
          onChange={handleChange}
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
          type={showPassword ? "text" : "password"}
          label='Password'
          name='password'
          placeholder='Enter your password'
          value={formData.password}
          onChange={handleChange}
          required
          showToggle={true}
          isVisible={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
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

      {/* Social Login */}
      <div className='space-y-4'>
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-white/20'></div>
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='bg-gray-900 px-3 text-gray-400'>
              Or continue with
            </span>
          </div>
        </div>
        <div className='grid grid-cols-3 gap-3'>
          <button
            type='button'
            onClick={() => handleOAuthClick("github")}
            className='flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all border border-white/10 hover:border-white/20'
          >
            <Github size={16} />
            <span className='hidden sm:inline'>GitHub</span>
          </button>
          <button
            type='button'
            onClick={() => handleOAuthClick("google")}
            className='flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all border border-white/10 hover:border-white/20'
          >
            <Mail size={16} />
            <span className='hidden sm:inline'>Google</span>
          </button>
          <button
            type='button'
            onClick={() => handleOAuthClick("linkedin")}
            className='flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all border border-white/10 hover:border-white/20'
          >
            <Linkedin size={16} />
            <span className='hidden sm:inline'>LinkedIn</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
