import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { sizeEnum } from "../../services/constants";

const Button = ({
  size,
  name,
  onClick,
  isDisabled,
  isActive,
  isHoverEnable = false,
  isSecondary,
  btnStyle,
  children,
  ...rest
}) => {
  var btnClass = classNames(
    btnStyle,
    "disabled:opacity-40",
    {
      "items-center focus:outline-none": true,
      "px-6 w-24 h-8 text-xxs": size === sizeEnum.small,
      "px-1 pb-0.5 h-hp-32 text-sm font-medium": size === sizeEnum.medium,
      "px-8 py-1 w-24 h-8 text-base": size === sizeEnum.large,
      "border border-gray-200": isSecondary,
      "border border-gray-300": !isSecondary,
      "text-white !btn-black-custom border-primary-theme trans-ease-in":
        isActive,
      "text-color-text": !isActive,
      "!text-color-text": !isActive && isSecondary,
      "opacity-40 pointer-events-none": isDisabled,
      "cursor-pointer": !isDisabled,
      "text-white hover:bg-black-400 hover:text-white hover:border-primary-theme": isHoverEnable,
    }
  );
  return (
    <>
      <button
        type="button"
        className={btnClass}
        data-text={name}
        onClick={() => onClick && onClick()}
        disabled={isDisabled}
        {...rest}
      >
        {children || name}
      </button>
    </>
  );
};

Button.propTypes = {
  size: PropTypes.string,
  name: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  isActive: PropTypes.bool,
  isHoverEnable: PropTypes.bool,
  isSecondary: PropTypes.bool,
  btnStyle: PropTypes.string,
};
Button.defaultProps = {
  size: "md",
  name: "",
  isSecondary: false,
  btnStyle: "",
};
export default Button;
