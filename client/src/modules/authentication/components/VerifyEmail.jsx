import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail, clearAuthState } from "../slice/userSlice";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.user);

  const [localStatus, setLocalStatus] = useState("loading");

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token));
    } else {
      setLocalStatus("error");
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (loading) {
      toast.info("Verifying your email...");
    } else if (message) {
      toast.success(message || "Email verified successfully!");
      navigate("/auth");
      dispatch(clearAuthState());
    } else if (error) {
      toast.error(error || "Verification failed");
      dispatch(clearAuthState());
    }
  }, [loading, message, error, dispatch, navigate]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white'>
      <div className='bg-black/30 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl text-center max-w-md w-full'>
        {localStatus === "loading" ? (
          <p className='text-gray-400'>Verifying your email...</p>
        ) : localStatus === "success" ? (
          <>
            <CheckCircle className='text-green-400 w-10 h-10 mx-auto mb-4' />
            <h2 className='text-2xl font-bold mb-2'>Email Verified!</h2>
            <p className='text-gray-400'>You can now log in to your account.</p>
          </>
        ) : (
          <>
            <XCircle className='text-red-400 w-10 h-10 mx-auto mb-4' />
            <h2 className='text-2xl font-bold mb-2'>Verification Failed</h2>
            <p className='text-gray-400'>
              Invalid or expired verification link.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
