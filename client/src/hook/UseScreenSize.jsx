import { useState, useEffect } from "react";

const UseScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return; // Skip on server

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      let isMobile = false;
      let isTablet = false;
      let isDesktop = false;

      if (width < 768) {
        isMobile = true;
      } else if (width >= 768 && width < 1023) {
        isTablet = true;
      } else {
        isDesktop = true;
      }

      setScreenSize({
        width,
        height,
        isMobile,
        isTablet,
        isDesktop,
      });
    };

    handleResize(); // Run initially
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return screenSize;
};

export default UseScreenSize;
