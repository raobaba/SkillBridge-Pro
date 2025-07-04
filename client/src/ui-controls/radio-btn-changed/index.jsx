import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { sizeEnum } from "../../services/constants";

const RadioGFI = ({
  size,
  id,
  name,
  value,
  isDisabled,
  onChange,
  label,
  description,
  isChecked,
  inputStyle,
  lblClass,
  ...rest
}) => {
  // Outer circle (radio button) class
  var radioClass = classNames(inputStyle, "disabled:opacity-50", {
    "h-4 w-4": size === sizeEnum.small,  // Small size
    "h-5 w-5": size === sizeEnum.medium, // Medium size
    "h-6 w-6": size === sizeEnum.large,  // Large size
    "border-2": true, 
    "border-black": !isChecked, // Black border when unselected
    "border-cyan-500": isChecked, // Cyan border when selected
    "cursor-pointer": !isDisabled, // Pointer cursor for clickable
    "relative": true, // Positioning for inner circle
    "rounded-full": true, // Ensure circular shape
  });

  // Inner circle class
  const innerCircleClass = classNames("absolute", {
    "bg-transparent": !isChecked, // Transparent when unselected
    "bg-cyan-500": isChecked, // Cyan when selected
    "rounded-full": true, // Circle shape
    "w-2.5 h-2.5": true, // Inner circle size
    "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2": true, // Centering the inner circle
  });

  // Label class
  var labelClass = classNames(lblClass, {
    "mx-2 text-gray-500": true,
    "text-gray-500 disabled:opacity-50": isDisabled,
    "cursor-pointer": !isDisabled,
  });

  const onLabelClick = (event, value) => {
    event.preventDefault();
    onChange(value);
  };

  return (
    <div className="flex items-center">
      {/* Radio button input */}
      <input
        id={id}
        name={name}
        type="radio"
        className={radioClass}
        value={value}
        checked={isChecked}
        disabled={isDisabled}
        onChange={() => {}}
        onClick={(e) => onChange(e.target.value)}
        {...rest}
      />

      {/* Label */}
      <label
        onClick={isDisabled ? () => {} : (e) => onLabelClick(e, !isChecked)}
        htmlFor={id}
        className={labelClass}
      >
        {label}
      </label>
    </div>
  );
};

RadioGFI.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.string,
  description: PropTypes.string,
  isDisabled: PropTypes.bool,
  isChecked: PropTypes.bool,
  inputStyle: PropTypes.string,
  lblClass: PropTypes.string,
};

RadioGFI.defaultProps = {
  id: "radio",
  name: "radio-button",
  size: "md",
  label: "RadioGFI",
  isDisabled: false,
  isChecked: false,
};

export default RadioGFI;
