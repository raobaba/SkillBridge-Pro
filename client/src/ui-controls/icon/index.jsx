import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { sizeEnum } from "../../services/constants";

const Icon = ({ size, imgStyle, icon, onClick, isDisabled, ...rest }) => {
  var iconClass = classNames(imgStyle, icon, {
    "text-sm": size === sizeEnum.extraSmall,
    "text-base": size === sizeEnum.small,
    "text-lg": size === sizeEnum.medium,
    "text-ic-lg": size === sizeEnum.large,
    "cursor-pointer": !isDisabled,
    "opacity-40": isDisabled,
  });

  return (
    <>
      <span
        className={iconClass}
        onClick={isDisabled ? () => {} : onClick}
        {...rest}
      />
    </>
  );
};

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  size: PropTypes.string,
  imgStyle: PropTypes.string,
  isDisabled: PropTypes.bool,
};
Icon.defaultProps = {
  size: "sm",
  isDisabled: false,
};

export default Icon;
