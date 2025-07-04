import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "../pages/Home";

const Routing = () => {
  return (
    <Router>
      <Suspense>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default Routing;
