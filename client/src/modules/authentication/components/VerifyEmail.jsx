import React, { useEffect, useState, useCallback } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyEmail } from "../slice/userSlice";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [localStatus, setLocalStatus] = useState("loading");

  const handleVerification = useCallback(async () => {
    if (!token) {
      setLocalStatus("error");
      return;
    }

    try {
      const result = await dispatch(verifyEmail(token));
      if (result?.payload?.status === 200) {
        setLocalStatus("success");
        setTimeout(() => {
          navigate("/auth");
        }, 2000);
      } else {
        setLocalStatus("error");
      }
    } catch (error) {
      console.error("Email verification error:", error);
      setLocalStatus("error");
    }
  }, [token, dispatch, navigate]);

  useEffect(() => {
    handleVerification();
  }, [handleVerification]);

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
