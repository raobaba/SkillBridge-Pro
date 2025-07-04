/**
 * --------------------------------------------------------
 * File        : FullScreen.jsx
 * Description : Displays a fullscreen circular loader animation.
 * 
 * Notes:
 * - Uses `lottie-web` to render a circular loader animation from JSON.
 * - Positioned in the center of the screen and loops indefinitely.
 * - Cleans up the animation instance on component unmount.
 * --------------------------------------------------------
 */



import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import circularloader from "../../assets/animation/loader.json";

const FullScreen = () => {
  const container = useRef(null);
  const animationInstance = useRef(null);

  useEffect(() => {
    // Load the animation once
    animationInstance.current = lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: circularloader,
    });

    // Cleanup on unmount
    return () => {
      animationInstance.current?.destroy();
    };
  }, []);

  return (
    <div className="loaderPosition flex items-center justify-center">
      <div className="loaderBounce" ref={container}></div>
    </div>
  );
};

export default FullScreen;
