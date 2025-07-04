/**
 * --------------------------------------------------------
 * File        : Circular.jsx
 * Description : Displays a circular loading animation using Lottie.
 * 
 * Notes:
 * - Uses Lottie to render a bounce loader animation in the center of the screen.
 * - The animation is looped and autoplayed on component mount, and cleaned up on unmount.
 * --------------------------------------------------------
 */


import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import bounceLoader from "../../assets/animation/loader.json";
const Circular = () => {
  const container = useRef(null);
  const animationInstance = useRef(null);

  useEffect(() => {
    // Load the animation once
    animationInstance.current = lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: bounceLoader,
    });

    // Cleanup on unmount
    return () => {
      animationInstance.current?.destroy();
    };
  }, []);

  return (
    <div className="absolute z-[9999] grid h-full w-full items-center justify-center !bg-[#5487ff4f]">
      <div className="loaderBounce h-[120px]" ref={container}></div>
    </div>
  );
};

export default Circular;
