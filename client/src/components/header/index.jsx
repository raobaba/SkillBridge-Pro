// components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Code, Menu, X, User, Bell, MessageSquare, Search } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getToken } from "../../services/utils";
import Input from "../Input";
import Button from "../Button";
import ConfirmModal from "../modal/ConfirmModal";
import { logOut } from "../../modules/authentication/slice/userSlice";

const Navbar = ({
  onLogoutClick,
  data = null,
  isSearchBar = false,
  isHome = false,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAvatarBroken, setIsAvatarBroken] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const messagesRef = useRef(null);
  const [notifications, setNotifications] = useState(4);
  const [messages, setMessages] = useState(1);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [expandedMessageIndex, setExpandedMessageIndex] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [messagesList, setMessagesList] = useState(
    Array(messages)
      .fill("")
      .map((_, i) => ({
        id: i + 1,
        text: `Preview content for message ${i + 1}`,
        fullText: `This is the full detailed message content of message ${i + 1}. It contains all the important details you need to know. Here we describe the message context, relevant instructions, and additional information to ensure clarity and understanding. You can read, reply, or take necessary actions based on this content.`,
        sender: "User",
      }))
  );

  const token = getToken();
  const userFromRedux = useSelector((state) => state.user?.user);
  const user = isHome ? userFromRedux : data;

  const homeMenuItems = [
    { label: "Features", link: "#features" },
    { label: "How it Works", link: "#how-it-works" },
    { label: "Testimonials", link: "#testimonials" },
    { label: "Pricing", link: "#pricing" },
  ];

  const doLogout = async () => {
    try {
      await dispatch(logOut());
    } finally {
      dispatch({ type: "signin/logout" });
      navigate("/");
    }
  };

  const userDropdownItems = [
    { label: "Profile", action: () => navigate("/profile") },
    { label: "Dashboard", action: () => navigate("/dashboard") },
    { label: "Notifications", action: () => navigate("/notifications") },
    { label: "Settings", action: () => navigate("/settings") },
    { label: "Portfolio Sync", action: () => navigate("/portfolio-sync") },
    { label: "Logout", action: () => setIsLogoutOpen(true) },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close user dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
      // Close notifications panel
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
      // Close messages panel
      if (messagesRef.current && !messagesRef.current.contains(event.target)) {
        setMessagesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
    <nav
      className={`fixed top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-sm border-b border-white/10 ${
        !isHome ? "sticky" : ""
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link to='/' className='flex items-center space-x-2 cursor-pointer'>
            <div className='w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center'>
              <Code className='w-5 h-5 text-white' />
            </div>
            <span className='font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hidden sm:inline md:text-2xl lg:text-3xl'>
              SkillBridge Pro
            </span>
          </Link>

          {/* Desktop Menu (Home only) */}
          {isHome && (
            <div className='hidden md:flex flex-1 justify-end items-center space-x-6'>
              {homeMenuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  className='text-gray-300 hover:text-white transition-colors'
                >
                  {item.label}
                </a>
              ))}

              {/* Avatar on far right */}
              {token && (
                <div
                  className='relative ml-4 hidden sm:block'
                  ref={dropdownRef}
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  {!isAvatarBroken && user?.avatarUrl ? (
                    <img
                      src={user?.avatarUrl}
                      alt={user?.name || "Profile"}
                      className='w-8 h-8 rounded-full border-2 border-white/20 cursor-pointer'
                      onError={() => setIsAvatarBroken(true)}
                    />
                  ) : (
                    <div className='w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center border-2 border-white/20 cursor-pointer'>
                      <User className='w-5 h-5 text-white' />
                    </div>
                  )}
                  {isUserDropdownOpen && (
                    <div className='absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg z-50'>
                      {userDropdownItems.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            item.action();
                            setIsUserDropdownOpen(false);
                          }}
                          className='px-4 py-2 text-gray-300 hover:bg-white/10 cursor-pointer transition-colors'
                        >
                          {item.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Auth Buttons if not logged in */}
              {!token && (
                <>
                  <button
                    onClick={() => navigate("/auth")}
                    className='text-gray-300 hover:text-white cursor-pointer transition-colors'
                  >
                    Sign In
                  </button>
                  <button className='bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105'>
                    Get Started
                  </button>
                </>
              )}
            </div>
          )}

          {/* Other Navbar: Search + notifications + messages + avatar */}
          {!isHome && (
            <>
              {isSearchBar && (
                <div className='hidden md:flex flex-1 max-w-md mx-8'>
                  <Input
                    type='text'
                    placeholder='Search projects, skills, or companies...'
                    value={""} // replace with state variable
                    onChange={() => {}} // replace with handler
                    leftIcon={Search}
                    className='w-full'
                  />
                </div>
              )}
              <div className='flex items-center space-x-4'>
                {/* Notifications */}
                <div className='relative' ref={notificationsRef}>
                  <Button
                    variant='ghost'
                    size='md'
                    className='relative p-2 rounded-lg'
                    onClick={() => setNotificationsOpen((prev) => !prev)}
                  >
                    <Bell className='w-5 h-5' />
                    {notifications > 0 && (
                      <span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs rounded-full flex items-center justify-center'>
                        {notifications}
                      </span>
                    )}
                  </Button>

                  {/* Notifications Panel */}
                  {notificationsOpen && (
                    <div className='absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg z-50 p-3'>
                      <h4 className='text-gray-200 font-semibold mb-2'>
                        Notifications
                      </h4>
                      <div className='max-h-64 overflow-y-auto'>
                        {[...Array(notifications)].map((_, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              navigate("/notifications");
                              setNotificationsOpen(false);
                            }}
                            className='px-3 py-2 mb-2 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors'
                          >
                            <p className='text-gray-300 text-sm'>
                              Notification {index + 1}
                            </p>
                            <p className='text-gray-400 text-xs'>
                              Details of the notification...
                            </p>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => {
                          navigate("/notifications");
                          setNotificationsOpen(false);
                        }}
                        className='w-full cursor-pointer mt-2 text-blue-400 hover:text-blue-500 text-sm'
                      >
                        View All
                      </button>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className='relative' ref={messagesRef}>
                  <Button
                    variant='ghost'
                    size='md'
                    className='relative p-2 rounded-lg'
                    onClick={() => setMessagesOpen((prev) => !prev)}
                  >
                    <MessageSquare className='w-5 h-5' />
                    {messages > 0 && (
                      <span className='absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-xs rounded-full flex items-center justify-center'>
                        {messages}
                      </span>
                    )}
                  </Button>

                  {messagesOpen && (
                    <div className='absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg z-50 p-3 flex flex-col transition-all duration-300 max-h-[80vh]'>
                      <h4 className='text-gray-200 font-semibold mb-2'>
                        Messages
                      </h4>

                      <div className='overflow-y-auto flex-1'>
                        {messagesList.map((msg, index) => (
                          <div
                            key={msg.id}
                            onClick={() => {
                              if (expandedMessageIndex === index) {
                                navigate("/chat"); // redirect when already expanded
                              } else {
                                setExpandedMessageIndex(index); // expand message
                              }
                            }}
                            className={`px-3 py-2 mb-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors ${
                              expandedMessageIndex === index
                                ? "bg-gray-700"
                                : ""
                            }`}
                          >
                            <p className='text-gray-300 text-sm'>{`Message ${msg.id}`}</p>
                            <p className='text-gray-400 text-xs whitespace-pre-wrap'>
                              {expandedMessageIndex === index
                                ? msg.fullText
                                : msg.text}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Input area only when expanded */}
                      {expandedMessageIndex !== null && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            if (!messageInput.trim()) return;
                            const updatedMessages = [...messagesList];
                            updatedMessages[expandedMessageIndex].fullText +=
                              "\n" + messageInput;
                            setMessagesList(updatedMessages);
                            setMessageInput("");
                          }}
                          className='mt-2 flex space-x-2'
                        >
                          <input
                            type='text'
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder='Type a message...'
                            className='flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500'
                          />
                          <button
                            type='submit'
                            className='px-4 py-2 cursor-pointer bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium'
                          >
                            Send
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </div>

                {/* Avatar + Username */}
                <div
                  className='relative flex items-center'
                  ref={dropdownRef}
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  {!isAvatarBroken && user?.avatarUrl ? (
                    <img
                      src={user?.avatarUrl}
                      alt={user?.name || "Profile"}
                      className='w-10 h-10 rounded-full border-2 border-white/20 cursor-pointer'
                      onError={() => setIsAvatarBroken(true)}
                    />
                  ) : (
                    <div className='w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border-2 border-white/20 cursor-pointer'>
                      <User className='w-6 h-6 text-white' />
                    </div>
                  )}

                  {/* Username */}
                  {user?.name && (
                    <span className='ml-2 text-sm font-medium text-gray-200 hidden sm:block'>
                      {user.name}
                    </span>
                  )}

                  {/* User Dropdown */}
                  {isUserDropdownOpen && (
                    <div className='absolute right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg z-50'>
                      {userDropdownItems.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            item.action();
                            setIsUserDropdownOpen(false);
                          }}
                          className='px-4 py-2 text-gray-300 hover:bg-white/10 cursor-pointer transition-colors'
                        >
                          {item.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Mobile Menu Toggle for Home */}
          {isHome && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors'
              aria-label='Toggle Menu'
            >
              {isMenuOpen ? (
                <X className='w-6 h-6' />
              ) : (
                <Menu className='w-6 h-6' />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu for Home */}
      {isHome && isMenuOpen && (
        <div className='md:hidden bg-black/90 backdrop-blur-sm border-t border-white/10'>
          <div className='px-4 py-4 space-y-3'>
            {homeMenuItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                onClick={() => setIsMenuOpen(false)}
                className='block text-gray-300 hover:text-white transition-colors'
              >
                {item.label}
              </a>
            ))}

            {token ? (
              userDropdownItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    item.action();
                    setIsMenuOpen(false);
                  }}
                  className='block text-gray-300 hover:text-white transition-colors cursor-pointer'
                >
                  {item.label}
                </div>
              ))
            ) : (
              <>
                <button
                  className='block text-gray-300 hover:text-white transition-colors'
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/auth");
                  }}
                >
                  Sign In
                </button>
                <button className='w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-2 rounded-lg font-medium transition-all duration-300'>
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
    {/* Global Logout Confirm Modal */}
    <ConfirmModal
      isOpen={isLogoutOpen}
      title="Logout"
      message="Are you sure you want to logout?"
      onCancel={() => setIsLogoutOpen(false)}
      onConfirm={() => {
        setIsLogoutOpen(false);
        doLogout();
      }}
    />
    </>
  );
};

export default React.memo(Navbar);
