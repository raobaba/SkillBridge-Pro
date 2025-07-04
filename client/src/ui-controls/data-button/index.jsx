import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { positionEnum, sizeEnum } from "../../services/constants";

const DataButton = ({
  size,
  name,
  data,
  icon,
  icSize,
  icPosition,
  onClick,
  isDisabled,
  isActive,
  isGrayed,
  isHoverEnable,
  btnStyle,
  iconStyle,
  ...rest
}) => {
  var btnClass = classNames(btnStyle, "disabled:opacity-40", {
    "items-center flex justify-center rounded-sm-4 focus:outline-none": true,
    "text-white bg-primary-theme hover:bg-black-400 font-normal": isActive,
    "text-color-text": !isActive && !isGrayed,
    "text-white bg-gray-300": isGrayed && !isActive,
    "px-2 py-1 text-xxs": size === sizeEnum.small,
    "text-sm h-hp-32 pb-0.5": size === sizeEnum.medium,
    "px-4 py-1 text-base": size === sizeEnum.large,
    "cursor-pointer": !isDisabled,
    "opacity-40 pointer-events-none": isDisabled,
    "text-white hover:bg-black-400 hover:text-white": isHoverEnable,
  });

  var icClass = classNames(iconStyle, icon, {
    "text-base": icSize === sizeEnum.small,
    "text-2xl": icSize === sizeEnum.medium,
    "text-5xl": icSize === sizeEnum.large,
    "opacity-40": isDisabled,
    "text-white": isActive,
  });

  return (
    <>
      <button
        type="button"
        className={btnClass}
        onClick={() => onClick && onClick()}
        disabled={isDisabled}
        {...rest}
      >
        {icon && icPosition === positionEnum.left ? (
          <span className={icClass} />
        ) : null}
        {name}
        {icon && icPosition === positionEnum.right ? (
          <span className={icClass} />
        ) : null}

        {data !== undefined && data !== "" ? (
          <span className="text-xxs text-color-text h-6 w-6 mt-0.5 items-center flex ml-2 justify-center bg-white font-medium rounded-2xl">
            <span className="flex items-center -mt-0.5px -ml-0.5px">
              {data}
            </span>
          </span>
        ) : null}
      </button>
    </>
  );
};

DataButton.propTypes = {
  size: PropTypes.string,
  name: PropTypes.string,
  data: PropTypes.any,
  icon: PropTypes.string,
  icSize: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
  isGrayed: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isHoverEnable: PropTypes.bool,
  btnStyle: PropTypes.string,
  iconStyle: PropTypes.string,
  icPosition: PropTypes.oneOf([positionEnum.left, positionEnum.right]),
};
DataButton.defaultProps = {
  size: "",
  icSize: "md",
  icPosition: "left",
  name: "",
  btnStyle: "",
  iconStyle: "",
};
export default DataButton;
