import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
// import { logout } from "../modules/sign-in/slice/signinSlice";

const Unauthorized = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    // dispatch(logout());
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-9xl font-bold text-gray-800">401</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Unauthorized Access</h2>
      <p className="text-gray-600 max-w-md text-center mb-8 px-4">
        You don't have permission to access this page. Try logging in with a different account.
      </p>
      <Link
        onClick={handleLogout}
        to="/sign-in"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Sign In
      </Link>
    </div>
  );
};

export default Unauthorized;
