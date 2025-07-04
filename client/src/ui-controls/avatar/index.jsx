import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { useSpring, animated } from "react-spring";
import { sizeEnum } from "../../services/constants";

const Avatar = ({
  size,
  title,
  isRounded,
  isDisabled,
  src,
  icon,
  data,
  onClick,
  notification,
  imgStyle,
  iconStyle,
  btnStyle,
  valueStyle,
  notifyStyle,
  transition,
  dataStyle,
  isClickable,
  ...rest
}) => {
  const rotateIn = useSpring({
    from: { transform: "rotate(0deg)" },
    to: {
      transform: transition ? "rotate(45deg)" : "rotate(0deg)",
    },
    config: { duration: 200 },
  });

  var imgClass = classNames(imgStyle, {
    "rounded-full": isRounded,
    "h-3 w-3": size === sizeEnum.doubleExtraSmall,
    "h-6 w-6": size === sizeEnum.extraSmall,
    "h-9 w-9": size === sizeEnum.small,
    "h-12 w-12": size === sizeEnum.medium,
    "h-14 w-14": size === sizeEnum.large,
    "h-20 w-20": size === sizeEnum.extraLarge
  });

  var iconClass = classNames(iconStyle, icon, {
    'text-sm': size === sizeEnum.small,
    'text-lg': size === sizeEnum.medium,
    // 'text-lg': size === sizeEnum.large,
  });

  var btnClass = classNames(btnStyle, {
    "flex justify-center items-center relative rounded-full": true,
    "bg-dialog-circle text-orange-300": data && !src,
    "opacity-50": isDisabled,
    "h-9 w-9 rounded-full": icon && size === sizeEnum.small,
    "h-12 w-12 rounded-full": icon && size === sizeEnum.medium,
    "h-14 w-14 rounded-full": icon && size === sizeEnum.large,
  });

  var dataClass = classNames(valueStyle, dataStyle, {
    "font-normal": true,
  });

  var notifyClass = classNames(notifyStyle, {
    "bg-green-500": notification === "active",
    "bg-red-500": notification === "inactive",
    "absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white": true,
  });

  return (
    <div
      className={btnClass}
      onClick={isDisabled ? () => { } : () => onClick && onClick(data)}
      {...rest}
    >
      {src ? <img className={imgClass} src={src} alt={title} /> : null}

      {icon ? (
        <animated.div
          style={{ ...rotateIn }}
          className={iconClass}
        ></animated.div>
      ) : null}

      {data ? (
        <span className={dataClass}>
          <span className="-mt-2px">{data}</span>
        </span>
      ) : null}
      {notification ? <span className={notifyClass} /> : null}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  icon: PropTypes.string,
  data: PropTypes.any,
  notification: PropTypes.string,
  isDisabled: PropTypes.bool,
  isRounded: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.string,
  title: PropTypes.string,
  imgStyle: PropTypes.string,
  btnStyle: PropTypes.string,
  valueStyle: PropTypes.string,
  notifyStyle: PropTypes.string,
  transition: PropTypes.bool,
};
Avatar.defaultProps = {
  isDisabled: false,
  isRounded: true,
  size: "md",
  title: "avatar",
  notification: "",
  transition: false,
};

export default Avatar;
