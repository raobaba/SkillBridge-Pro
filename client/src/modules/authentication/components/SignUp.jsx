import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Github, Linkedin, Mail } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearAuthState } from "../slice/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = ({ switchMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector((state) => state.user);

  const [showPassword, setShowPassword] = useState(false);
  const [signInFailed, setSignInFailed] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    domains: "",
    experience: "",
    availability: "full-time",
    password: "",
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
      setSignInFailed(true);
      dispatch(clearAuthState());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  //  name, email, role, domains, experience, availability, password
  const validateForm = () => {
    console.log("formData", formData);
    const { name, email, role, domains, experience, availability, password } =
      formData;

    if (
      !name ||
      !email ||
      !role ||
      !domains ||
      !experience ||
      !availability ||
      !password
    ) {
      toast.error("All fields are required");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Invalid email format");
      return false;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await dispatch(registerUser(formData));
      if (result?.payload?.status === 201) {
        switchMode();
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Something went wrong, please try again.");
    }
  };

  const handleOAuthClick = (provider) => {
    window.location.href = `${import.meta.env.VITE_APP_API_URL}api/v1/auth/${provider}`;
  };

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block mb-2 text-sm font-medium text-gray-300'>
            Full Name
          </label>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            required
            placeholder='Enter your full name'
            className='w-full bg-white/10 px-3 py-2.5 rounded-lg border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all'
          />
        </div>

        <div>
          <label className='block mb-2 text-sm font-medium text-gray-300'>
            Email
          </label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
            placeholder='Enter your email'
            className='w-full bg-white/10 px-3 py-2.5 rounded-lg border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all'
          />
        </div>

        <div>
          <label className='block mb-2 text-sm font-medium text-gray-300'>
            Role
          </label>
          <select
            name='role'
            value={formData.role}
            onChange={handleChange}
            required
            className='w-full bg-white/10 px-3 py-2.5 rounded-lg border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all'
          >
            <option value=''>Select Role</option>
            <option value='developer'>Developer</option>
            <option value='startup'>Startup</option>
          </select>
        </div>

        <div>
          <label className='block mb-2 text-sm font-medium text-gray-300'>
            Experience (years)
          </label>
          <input
            type='number'
            name='experience'
            value={formData.experience}
            onChange={handleChange}
            min={0}
            required
            placeholder='0'
            className='w-full bg-white/10 px-3 py-2.5 rounded-lg border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all'
          />
        </div>

        <div>
          <label className='block mb-2 text-sm font-medium text-gray-300'>
            Preferred Domains
          </label>
          <input
            type='text'
            name='domains'
            value={formData.domains}
            onChange={handleChange}
            required
            placeholder='Web Dev, AI/ML, Mobile...'
            className='w-full bg-white/10 px-3 py-2.5 rounded-lg border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all'
          />
        </div>

        <div>
          <label className='block mb-2 text-sm font-medium text-gray-300'>
            Availability
          </label>
          <select
            name='availability'
            value={formData.availability}
            onChange={handleChange}
            required
            className='w-full bg-white/10 px-3 py-2.5 rounded-lg border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all'
          >
            <option value='full-time'>Full-time</option>
            <option value='part-time'>Part-time</option>
            <option value='freelance'>Freelance</option>
          </select>
        </div>
      </div>

      <div className='relative'>
        <label className='block mb-2 text-sm font-medium text-gray-300'>
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          name='password'
          value={formData.password}
          onChange={handleChange}
          required
          placeholder='Create a strong password'
          className='w-full bg-white/10 px-3 py-2.5 rounded-lg border border-white/20 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all'
        />
        <div
          className='absolute top-9 right-3 cursor-pointer text-gray-400 hover:text-white transition-colors'
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 rounded-lg transition-all font-medium text-sm transform hover:scale-[1.02] active:scale-[0.98]'
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>

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
            onClick={() => handleOAuthClick("github")}
            className='flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all border border-white/10 hover:border-white/20'
          >
            <Github size={16} />
            <span className='hidden sm:inline'>GitHub</span>
          </button>

          <button
            onClick={() => handleOAuthClick("google")}
            className='flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all border border-white/10 hover:border-white/20'
          >
            <Mail size={16} />
            <span className='hidden sm:inline'>Google</span>
          </button>

          <button
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

export default SignUp;
