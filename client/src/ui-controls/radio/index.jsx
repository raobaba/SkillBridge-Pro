import React from "react";
// import "./style.css";
import classNames from "classnames";
import PropTypes from "prop-types";
import { sizeEnum } from "../../services/constants";

const Radio = ({
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
  var radioClass = classNames(inputStyle, "disabled:opacity-50", {
    "h-3 w-3": size === sizeEnum.small,
    "h-4 w-4": size === sizeEnum.medium,
    "h-5 w-5": size === sizeEnum.large,
    "border-1 text-black-200 border-opacity-100 border-border-thin": true,
    "cursor-pointer": !isDisabled,
  });

  var labelClass = classNames(lblClass, {
    "mx-2 text-gray-500": true,
    "text-gray-500 disabled:opacity-50": isDisabled,
    "text-color-text font-medium": isChecked,
    "cursor-pointer": !isDisabled,
  });
  const onLabelClick = (event, value) => {
    event.preventDefault();
    onChange(value);
  };
  return (
    <>
      <div className="flex items-center">
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
        <label
          onClick={isDisabled ? () => {} : (e) => onLabelClick(e, !isChecked)}
          htmlFor="push_everything"
          className={labelClass}
        >
          {label}
        </label>
      </div>
    </>
  );
};

Radio.propTypes = {
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

Radio.defaultProps = {
  id: "radio",
  name: "radio-button",
  size: "md",
  label: "Radio",
  isDisabled: false,
  isChecked: false,
};

export default Radio;
