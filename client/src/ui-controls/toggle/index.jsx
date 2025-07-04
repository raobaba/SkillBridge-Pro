import React from "react";
// import "./style.css";
import classNames from "classnames";
import PropTypes from "prop-types";
import { sizeEnum } from "../../services/constants";

const Toggle = ({
  id,
  size,
  label,
  value,
  isDisabled,
  isToggle,
  inputStyle,
  borderStyle,
  roundStyle,
  onClick,
  ...rest
}) => {
  var inputClass = classNames(inputStyle, "disabled:opacity-50", {
    "sr-only fill-toggle": true,
  });

  var borderClass = classNames(borderStyle, {
    "outbox block border-1.9 border-opacity-100 border-gray-300 rounded-full": true,
    "h-hp-12 w-wp-18": size === sizeEnum.small,
    "h-7 w-5": size === sizeEnum.medium,
    "h-8 w-6": size === sizeEnum.large,
  });

  var roundClass = classNames(roundStyle, {
    "dot absolute left-1 top-0.7 border-1.5 border-opacity-100 border-gray-300 rounded-full transition": true,
    "h-hp-6 w-wp-6 circle-round": size === sizeEnum.small,
    "h-3 w-3": size === sizeEnum.medium,
    "h-4 w-4": size === sizeEnum.large,
  });

  let container = classNames({
    "cursor-pointer": !isDisabled,
    "flex items-center ": true,
  });
  return (
    <>
      <div className="flex items-center">
        <>
          <label className={container}>
            <div className="relative" htmlFor="toggleB">
              <input
                type="checkbox"
                id={id}
                checked={value}
                disabled={isDisabled}
                className={inputClass}
                onChange={(e) => onClick(e.target.checked, e.target.value)}
                {...rest}
              />
              <div className={borderClass}></div>
              <div className={roundClass}></div>
            </div>

            {label}
          </label>
        </>
      </div>
    </>
  );
};

Toggle.propTypes = {
  id: PropTypes.string,
  size: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isToggle: PropTypes.bool,
  inputStyle: PropTypes.string,
  borderStyle: PropTypes.string,
  roundStyle: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

Toggle.defaultProps = {
  id: "toggle",
  size: "sm",
  isDisabled: false,
  isToggle: false,
};

export default Toggle;
