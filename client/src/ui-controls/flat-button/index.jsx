import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { positionEnum, sizeEnum } from "../../services/constants";

const FlatButton = ({
  icSize,
  icon,
  label,
  onClick,
  btnStyle,
  iconStyle,
  lblStyle,
  isDisabled,
  isHoverEnable,
  icPosition,
  ...rest
}) => {
  var btnClass = classNames(btnStyle, "disabled:opacity-50 mb-1", {
    "flex items-center text-base text-color-text": true,
    "bg-gray-300 hover:bg-primary-theme": isHoverEnable,
    "cursor-pointer": !isDisabled,
    "pointer-events-none": isDisabled,
  });
  var icClass = classNames(iconStyle, icon, {
    "text-base": icSize === sizeEnum.small,
    "text-2xl": icSize === sizeEnum.medium,
    "text-5xl": icSize === sizeEnum.large,
    "opacity-40": isDisabled,
  });
  var lblClass = classNames(lblStyle, {
    "mx-0.5 pb-pd-3": true,
    "text-secondary-theme opacity-50": isDisabled,
  });
  return (
    <>
      <div
        className={btnClass}
        onClick={onClick}
        disabled={isDisabled}
        {...rest}
      >
        {icPosition === positionEnum.left ? <span className={icClass} /> : null}
        <span className={lblClass}>{label}</span>
        {icPosition === positionEnum.right ? (
          <span className={icClass} />
        ) : null}
      </div>
    </>
  );
};

FlatButton.propTypes = {
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  icSize: PropTypes.string,
  label: PropTypes.string,
  isDisabled: PropTypes.bool,
  isHoverEnable: PropTypes.bool,
  btnStyle: PropTypes.string,
  iconStyle: PropTypes.string,
  lblStyle: PropTypes.string,
  icPosition: PropTypes.oneOf([positionEnum.left, positionEnum.right]),
};
FlatButton.defaultProps = {
  icSize: "sm",
  icPosition: "left",
  isDisabled: false,
  isHoverEnable: false,
};
export default FlatButton;
