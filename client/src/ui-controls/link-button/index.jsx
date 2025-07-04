import React from "react";
import classNames from "classnames";
// import './style.css';
import PropTypes from "prop-types";

const LinkButton = ({
  onClick,
  label,
  isDisabled,
  isActive,
  btnStyle,
  ...rest
}) => {
  var linkClass = classNames(btnStyle, {
    "disable-link font-thin mr-2 inline-block": isDisabled,
    "link hover:text-black-500 cursor-pointer inline-block mr-2 mb-1 hover:font-medium":
      !isDisabled,
  });

  return isActive ? (
    <span
      onClick={!isDisabled ? onClick : () => {}}
      className={linkClass}
      {...rest}
    >
      {label}
    </span>
  ) : null;
};
LinkButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  isActive: PropTypes.bool,
  btnStyle: PropTypes.string,
};
LinkButton.defaultProps = {
  label: "Click",
  isDisabled: false,
  isActive: true,
};

export default LinkButton;
