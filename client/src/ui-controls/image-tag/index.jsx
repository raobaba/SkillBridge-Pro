import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

const Image = ({
  src,
  alt,
  size,
  isDisabled,
  isActive,
  isHoverEnable = false,
  imgStyle,
  ...rest
}) => {
  const imgClass = classNames(
    imgStyle,
    "transition ease-in-out duration-300",
    {
      "w-24 h-24": size === "small", // Example for small image
      "w-32 h-32": size === "medium", // Example for medium image
      "w-48 h-48": size === "large", // Example for large image
      "opacity-40 pointer-events-none": isDisabled,
      "cursor-pointer": !isDisabled,
      "hover:opacity-80": isHoverEnable && !isDisabled,
      "border-primary-theme": isActive,
    }
  );

  return (
    <img
      src={src}
      alt={alt}
      className={imgClass}
      {...rest}
      // Disable click event if image is disabled
      onClick={isDisabled ? (e) => e.preventDefault() : undefined}
    />
  );
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  size: PropTypes.string,
  isDisabled: PropTypes.bool,
  isActive: PropTypes.bool,
  isHoverEnable: PropTypes.bool,
  imgStyle: PropTypes.string,
};

Image.defaultProps = {
  size: "medium",
  isDisabled: false,
  isActive: false,
  isHoverEnable: true,
  imgStyle: "",
};

export default Image;
