import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgetPassPassword, clearAuthState } from "../slice/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Circular from "../../../components/loader/Circular";
import { Input, Button } from "../../../components";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email.");
    dispatch(forgetPassPassword({ email }));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(clearAuthState());
    }

    if (error) {
      toast.error(error.message || "Something went wrong.");
      dispatch(clearAuthState());
    }
  }, [message, error, dispatch]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
      {loading && <Circular />}
      <div className='bg-black/30 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text'>
          Forgot Password?
        </h2>
        <p className='text-gray-400 text-sm text-center mb-6'>
          Enter your registered email address. We'll send you a link to reset
          your password.
        </p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <Input
            type='email'
            label='Email Address'
            placeholder='you@example.com'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full'
          />

          <Button
            type='submit'
            disabled={loading}
            className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 rounded-lg transition-all font-medium text-sm transform hover:scale-[1.02] active:scale-[0.98]'
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>

        <div className='mt-6 text-center text-sm text-gray-400'>
          Remember your password?{" "}
          <Button
            variant='link'
            onClick={() => navigate("/auth")}
            className='text-blue-400 hover:underline p-0'
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
