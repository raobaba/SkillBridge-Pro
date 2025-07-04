// components/Scrollbar.jsx
import React from "react";
import PropTypes from "prop-types";

const Scrollbar = ({
  children,
  maxHeight = "100vh",
  maxWidth = "100%",
  horizontal = "auto",
  vertical = "auto",
  autoHide = false,
  className = "",
  style = {},
}) => {
  const customStyles = {
    maxHeight,
    maxWidth,
    overflowX: horizontal,
    overflowY: vertical,
    ...style,
  };

  return (
    <div
      className={`${className} scrollbar-wrapper ${
        autoHide ? "scrollbar-autohide" : ""
      }`}
      style={customStyles}
    >
      {children}
    </div>
  );
};

Scrollbar.propTypes = {
  children: PropTypes.node.isRequired,
  maxHeight: PropTypes.string,
  maxWidth: PropTypes.string,
  horizontal: PropTypes.oneOf(["auto", "scroll", "hidden"]),
  vertical: PropTypes.oneOf(["auto", "scroll", "hidden"]),
  autoHide: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Scrollbar;
