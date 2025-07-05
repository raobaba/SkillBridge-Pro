import React, { useState } from 'react';
import { Eye, EyeOff, Github, Linkedin, Mail } from 'lucide-react';

const SignIn = ({ switchMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign in data:', formData);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            className="w-full bg-white/10 px-4 py-3 rounded-lg border border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          />
        </div>

        <div className="relative">
          <label className="block mb-2 text-sm font-medium text-gray-300">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            className="w-full bg-white/10 px-4 py-3 rounded-lg border border-white/20 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          />
          <div
            className="absolute top-9 right-3 cursor-pointer text-gray-400 hover:text-white transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 rounded-lg transition-all font-medium text-sm transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Sign In
        </button>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <span
            onClick={switchMode}
            className="text-blue-400 hover:text-blue-300 hover:underline cursor-pointer transition-colors"
          >
            Sign Up
          </span>
        </p>
      </div>

      {/* Social Login */}
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-900 px-3 text-gray-400">Or continue with</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button className="flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all border border-white/10 hover:border-white/20">
            <Github size={16} />
            <span className="hidden sm:inline">GitHub</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all border border-white/10 hover:border-white/20">
            <Mail size={16} />
            <span className="hidden sm:inline">Google</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-all border border-white/10 hover:border-white/20">
            <Linkedin size={16} />
            <span className="hidden sm:inline">LinkedIn</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
