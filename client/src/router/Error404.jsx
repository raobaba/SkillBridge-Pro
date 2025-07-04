/**
 * --------------------------------------------------------
 * File        : Error404.js
 * Description : Displays a user-friendly 404 error page when a route is not found.
 * Authors     : Developer team
 * Created On  : 2025-04-30
 * Updated On  : 2025-04-30
 * --------------------------------------------------------
 * Notes:
 * - Shown for unmatched routes via the catch-all route `*` in `Routing.js`.
 * - Includes a link to redirect users back to the homepage.
 */


import React from "react";
import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-9xl font-bold text-gray-800">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-gray-600 text-center max-w-md mb-8 px-4">
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default Error404;
