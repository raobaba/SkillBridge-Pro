/**
 * --------------------------------------------------------
 * File        : Header.js
 * Description : A header component that renders a logo, navigation buttons (FAQs, Contact Us), 
 *               and includes mobile responsiveness features. It also includes a timeout functionality 
 *               that will trigger a logout after a certain period of inactivity.
 * --------------------------------------------------------
 * Notes:
 * - The header is fixed at the top and contains a logo and two buttons: "FAQs" and "Contact Us".
 * - It features a mobile menu that can be toggled, showing a simplified navigation for mobile users.
 * - The `inactivityTime` function detects user inactivity (mouse movement or key press) and logs out
 * 
 */



import React, { useEffect, useState } from "react";
import {
  Avatar,
  LinkButton,
} from "../../ui-controls";
import { LogoLogin } from "../../assets";

const Header = ({ children, isDisabled, user }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const inactivityTime = () => {
    let time = 0;
    window.onload = resetTimer;
    // DOM Events
    document.onmousemove = resetTimer;
    document.onkeydown = resetTimer;
    function resetTimer() {
      clearTimeout(time);
      time = setTimeout(
        () => {
          // logOut();
          // window.location.reload();
        },
        60000 * parseInt(import.meta.env.VITE_APP_LOGOUT_TIMEOUT),
      );
    }
  };

  useEffect(() => {
    inactivityTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <nav className="h-13 bg-primary-theme fixed top-0 z-10 w-full flex justify-between">
        <div className="flex px-6 w-[100%]">
          {/* Logo */}
          <div className="grid ">
            <Avatar
              size="lg"
              title="logo"
              isRounded={false}
              isDisabled={isDisabled}
              src={LogoLogin}
              imgStyle={"!h-10 w-full"}
            />
          </div>

          <div className="flex-grow"></div>

          <div className="4xl:mt-5 relative w-auto flex-none ">
            <div className="relative hidden h-14 items-center justify-end sm:flex">
              <LinkButton
                isDisabled={isDisabled}
                isActive={true}
                label={`FAQs`}
                btnStyle={"btn-style !text-white !p-2 text-txt-md-14"}
                onClick={() => {
                  window.open("/faq", "_blank");
                }}
              />

              <LinkButton
                isDisabled={isDisabled}
                isActive={true}
                label={`Contact Us`}
                btnStyle={
                  "btn-style text-txt-14 !text-white !p-2 text-txt-md-14"
                }
                onClick={() => {
                  window.open("/contact-us", "_blank");
                }}
              />
            </div>
            <div className="absolute top-2.5 right-0.2 sm:hidden">
              <button
                onClick={() => setShowMobileMenu(true)}
                className="text-white"
              >
                ☰
              </button>
            </div>

            {showMobileMenu && (
              <div className="bg-opacity-60 bg-black-100 fixed inset-0 z-50 flex justify-end sm:hidden">
                <div className="w-2/3 max-w-xs space-y-4 bg-white p-6 ml-6">
                  <button
                    className="mb-4 text-right font-bold text-sky-950"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    ✕ Close
                  </button>
                  <div className="mt-4">
                    <LinkButton
                      isDisabled={isDisabled}
                      isActive={true}
                      label={`FAQs`}
                      btnStyle={"btn-style text-txt-md-14"}
                      onClick={() => {
                        window.open("/faq", "_blank");
                      }}
                    />
                  </div>

                  <div>
                    <LinkButton
                      isDisabled={isDisabled}
                      isActive={true}
                      label={`Contact Us`}
                      btnStyle={"btn-style text-txt-14 text-txt-md-14"}
                      onClick={() => {
                        window.open("/contact-us", "_blank");
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
