import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { sizeEnum } from "../../services/constants";

const IconButton = ({
  icSize,
  icon,
  data,
  onClick,
  btnStyle,
  iconStyle,
  valueStyle,
  isDisabled,
  isRounded,
  title,
  isHoverEnable,
  ...rest
}) => {
  var btnClass = classNames(btnStyle, "disabled:opacity-50", {
    "text-white focus:outline-none rounded": true,
    "flex justify-center items-center relative": true,
    "bg-gray-300": isDisabled,
    "rounded-full": isRounded,
    "bg-gray-300 hover:bg-primary-theme": isHoverEnable && !isDisabled,
    "h-5 w-5": icSize === sizeEnum.small,
    "h-6 w-6": icSize === sizeEnum.medium,
    "h-7 w-7": icSize === sizeEnum.large,
  });
  var icClass = classNames(iconStyle, icon, {
    "text-xxs": icSize === sizeEnum.small,
    "text-sm": icSize === sizeEnum.medium,
    "text-3xl": icSize === sizeEnum.large,
  });
  var dataClass = classNames(valueStyle, {
    "text-xxs font-medium flex items-center h-5": icSize === sizeEnum.small,
    "text-sm font-medium leading-3": icSize === sizeEnum.medium,
    "text-base font-medium leading-3": icSize === sizeEnum.large,
  });
  return (
    <>
      <button
        type="button"
        className={btnClass}
        onClick={isDisabled ? () => {} : onClick}
        disabled={isDisabled}
        {...rest}
      >
        {icon ? <span className={icClass}></span> : null}
        {data ? <span className={dataClass}>{data}</span> : null}
      </button>
    </>
  );
};

IconButton.propTypes = {
  icon: PropTypes.string,
  onClick: PropTypes.func,
  data: PropTypes.any,
  icSize: PropTypes.string,
  isDisabled: PropTypes.bool,
  isRounded: PropTypes.bool,
  btnStyle: PropTypes.string,
  iconStyle: PropTypes.string,
};
IconButton.defaultProps = {
  size: "md",
  icSize: "sm",
  title: "icButton",
  isDisabled: false,
  isHoverEnable: false,
};
export default IconButton;
