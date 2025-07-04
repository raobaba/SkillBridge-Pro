/**
 * --------------------------------------------------------
 * File        : Unauthorized.js
 * Description : Displays a 401 Unauthorized Access page for users
 *               who attempt to access protected routes without permissions.
 * Authors     : Developer team
 * Created On  : 2025-04-30
 * Updated On  : 2025-04-30
 * --------------------------------------------------------
 * Notes:
 * - Shows a 401 error message with a Sign-In button.
 * - Dispatches logout action on click to clear session data.
 * - Redirects the user to the sign-in page.
 */


import { logout } from "../modules/sign-in/slice/signinSlice";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  const dispatch = useDispatch();
  const onLogout = () => {
    dispatch(logout());
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <h1 className="text-9xl font-bold text-gray-800">401</h1>
      <h2 className="mb-4 text-2xl font-semibold text-gray-700">
        Unauthorized Access
      </h2>
      <p className="mb-8 max-w-md px-4 text-center text-gray-600">
        Sorry, you don't have permission to access this page. Please sign in
        with appropriate credentials.
      </p>
      <Link
        onClick={onLogout}
        to="/sign-in"
        className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors duration-200 hover:bg-blue-700"
      >
        Sign In
      </Link>
    </div>
  );
};

export default Unauthorized;
