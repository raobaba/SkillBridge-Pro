import React from "react";
// import "./style.css";
import classNames from "classnames";
import PropTypes from "prop-types";
import { sizeEnum } from "../../services/constants";

const AvatarButton = ({
  size,
  title,
  isRounded,
  isDisabled,
  src,
  isSelected,
  onClick,
  isHover,
  tooltip,
  data,
  value,
  btnStyle,
  valueStyle,
  dataStyle,
  ...rest
}) => {
  var imgClass = classNames({
    "rounded-full": isRounded,
    "h-8 w-8": size === sizeEnum.small,
    "h-12 w-12": size === sizeEnum.medium,
    "h-14 w-14": size === sizeEnum.large,
    "on-hover": isHover,
    "cursor-pointer": true,
  });

  var btnClass = classNames(btnStyle, {
    "inline-block relative content": true,
    "content-hov": isHover,
    "disabled-op50": isDisabled,

    "flex justify-center items-center relative rounded-full": true,
    "bg-dialog-circle text-orange-300": data && !src,
  });

  var toggleClass = classNames({
    "content-overlay p-3.5 rounded-full h-full w-full opacity-0 border-black":
      !isSelected,
    "content-added rounded-full h-full w-full opacity-100 p-2.5": isSelected,
  });

  var dataClass = classNames(valueStyle, dataStyle, {
    "text-base font-normal": true,
  });

  const onAddClick = () => {
    onClick(value);
  };

  return (
    <>
      <span className="has-tooltip-btn relative">
        <span className="tooltip-btn rounded shadow-lg p-1 bg-gray-100 -mt-10 -ml-3">
          <span className="-mt-px">{tooltip}</span>
        </span>

        <div className={btnClass} onClick={onAddClick} {...rest}>
          <div className={toggleClass}></div>
          {src ? (
            <img className={imgClass} src={src} alt={title} />
          ) : data ? (
            <span className={dataClass}>{data}</span>
          ) : null}
        </div>
      </span>
    </>
  );
};

AvatarButton.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  isRounded: PropTypes.bool.isRequired,
  src: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  size: PropTypes.string,
  title: PropTypes.string,
  isHover: PropTypes.bool,
  tooltip: PropTypes.string,
  value: PropTypes.object,
  imgStyle: PropTypes.string,
  btnStyle: PropTypes.string,
};
AvatarButton.defaultProps = {
  isDisabled: false,
  isRounded: true,
  isHover: false,
  size: "md",
  title: "avatar",
};

export default AvatarButton;
