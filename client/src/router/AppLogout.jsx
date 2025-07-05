import React from "react";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
// import { logout } from "../modules/sign-in/slice/signinSlice";
import { useNavigate } from "react-router-dom";

const events = [
  "load",
  "mousemove",
  "mousedown",
  "click",
  "scroll",
  "keypress",
];

const AppLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const timer = useRef(null);

  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
  };

  const startLogoutTimer = () => {
    resetTimer();
    timer.current = setTimeout(() => {
      cleanup();
      // dispatch(logout());
      navigate("/sign-in?expired=true");
    }, 1000 * 500); // ~8 min
  };

  const cleanup = () => {
    events.forEach((event) => window.removeEventListener(event, activityHandler));
    resetTimer();
  };

  const activityHandler = () => {
    resetTimer();
    startLogoutTimer();
  };

  useEffect(() => {
    events.forEach((event) => window.addEventListener(event, activityHandler));
    startLogoutTimer();
    return cleanup;
  }, []);

  return null;
};

export default AppLogout;
