import React from "react";
// import "./style.css";
import classNames from "classnames";
import PropTypes from "prop-types";

import { sizeEnum } from "../../services/constants";
import { Tooltip } from "..";

const Checkbox = ({
  size,
  id,
  name,
  isDisabled,
  isRounded,
  onChange,
  label,
  description,
  isChecked,
  inputStyle,
  lblClass,
  tooltipStyle,
  tooltipLabelStyle,
  isEnableTooltip,
  isOverflowEllipsis,
  ...rest
}) => {
  var checkboxClass = classNames(inputStyle, "disabled:opacity-50", {
    "h-3 w-3": size === sizeEnum.small,
    "h-4 w-4": size === sizeEnum.medium,
    "h-5 w-5": size === sizeEnum.large,
    "text-color-text border-secondary-theme": true,
    "opacity-50": isDisabled,
    "cursor-pointer": !isDisabled,
    "text-secondary-theme": !isChecked,
    "rounded-none": isRounded,
  });

  var labelClass = classNames(lblClass, {
    "cursor-pointer": !isDisabled,
    "font-medium text-gray-500:": isChecked,
    "text-secondary-theme": !isChecked,
    "text-gray-500 opacity-50": isDisabled,
    "hover:text-color-text": !isDisabled,
    "overflow-Hidden": isOverflowEllipsis,
  });

  const onLabelClick = (event, value) => {
    event.preventDefault();
    onChange(value);
  };
  let labelItem = (
    <label
      htmlFor={label}
      className={labelClass}
      onClick={isDisabled ? () => {} : (e) => onLabelClick(e, !isChecked)}
    >
      {label}
    </label>
  );
  return (
    <>
      <div className="flex items-center">
        <div className="flex h-5 items-center">
          <label
            className="flex"
            style={{ border: "1px transparent red", height: "15px" }}
          >
            <input
              id={id}
              name={name}
              type="checkbox"
              checked={isChecked}
              className={checkboxClass}
              disabled={isDisabled}
              onChange={(e) => onChange(e.target.checked)}
              {...rest}
            />
          </label>
        </div>
        {label ? (
          description && isEnableTooltip ? (
            <div className="tooltip-Claim-Checkbox">
              <Tooltip
                label={description}
                tooltipStyle={classNames("tooltip-shadow")}
                lblStyle={tooltipLabelStyle}
                place={"top"}
                tagStyle={"mb-0.5"}
              >
                {labelItem}
              </Tooltip>
            </div>
          ) : (
            labelItem
          )
        ) : null}

        {/* {description ? <p className="text-gray-400">{description}</p> : null} */}
      </div>
    </>
  );
};

Checkbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  id: PropTypes.any,
  name: PropTypes.string,
  size: PropTypes.string,
  description: PropTypes.string,
  isDisabled: PropTypes.bool,
  isChecked: PropTypes.bool,
  isRounded: PropTypes.bool,
  lblClass: PropTypes.string,
  inputStyle: PropTypes.string,
};
Checkbox.defaultProps = {
  id: "check",
  name: "checkbox",
  size: "md",
  isDisabled: false,
  isChecked: false,
  isRounded: false,
  tooltipStyle: "tooltip-style",
  tooltipLabelStyle: "labelClass uppercase",
  isOverflowEllipsis: false,
};

export default Checkbox;
