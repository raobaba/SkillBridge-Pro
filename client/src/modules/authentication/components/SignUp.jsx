import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Github, Linkedin, Mail } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearAuthState } from "../slice/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Input, Button } from "../../../components";

const SignUp = ({ switchMode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
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
      dispatch(clearAuthState());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
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
      if (result?.payload?.status === 201) switchMode();
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
        <Input
          label='Full Name'
          name='name'
          value={formData.name}
          onChange={handleChange}
          placeholder='Enter your full name'
          required
        />
        <Input
          type='email'
          label='Email'
          name='email'
          value={formData.email}
          onChange={handleChange}
          placeholder='Enter your email'
          required
        />
        <Input
          label='Role'
          name='role'
          type='select'
          value={formData.role}
          onChange={handleChange}
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
          required
        />
        <Input
          label='Preferred Domains'
          name='domains'
          value={formData.domains}
          onChange={handleChange}
          placeholder='Web Dev, AI/ML, Mobile...'
          required
        />
        <Input
          label='Availability'
          name='availability'
          type='select'
          value={formData.availability}
          onChange={handleChange}
          options={[
            { value: "full-time", label: "Full-time" },
            { value: "part-time", label: "Part-time" },
            { value: "freelance", label: "Freelance" },
          ]}
          required
        />
      </div>

      <Input
        type={showPassword ? "text" : "password"}
        label='Password'
        name='password'
        value={formData.password}
        onChange={handleChange}
        placeholder='Create a strong password'
        showToggle={true}
        isVisible={showPassword}
        onToggle={() => setShowPassword(!showPassword)}
        required
      />

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 rounded-lg transition-all font-medium text-sm transform hover:scale-[1.02] active:scale-[0.98]'
      >
        {loading ? "Creating Account..." : "Create Account"}
      </Button>

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
          <Button
            onClick={() => handleOAuthClick("github")}
            className='flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all border border-white/10 hover:border-white/20'
          >
            <Github size={16} />
            <span className='hidden sm:inline'>GitHub</span>
          </Button>
          <Button
            onClick={() => handleOAuthClick("google")}
            className='flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all border border-white/10 hover:border-white/20'
          >
            <Mail size={16} />
            <span className='hidden sm:inline'>Google</span>
          </Button>
          <Button
            onClick={() => handleOAuthClick("linkedin")}
            className='flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all border border-white/10 hover:border-white/20'
          >
            <Linkedin size={16} />
            <span className='hidden sm:inline'>LinkedIn</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
