import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { LinkButton } from "../index"; // Adjust path as needed

const AlertBanner = ({
  icon,
  highlightText,
  mainText,
  additionalText,
  onClose,
  containerStyle,
  highlightClass,
  textClass,
}) => {
  return (
    <div
      className={classNames(
        "relative bg-orange-alert text-txt-md-12 px-4 py-2 w-full line-clamp-1 h-8",
        containerStyle
      )}
    >
      {icon && (
        <img src={icon} alt="icon" className="inline-block h-5 w-5 mr-2" />
      )}

      <p className="inline font-semibold">
        {mainText}{" "}
        {highlightText && (
          <span className={classNames("text-red-500", highlightClass)}>
            <span className="inline">{highlightText}</span>
          </span>
        )}{" "}
        {additionalText && (
          <span className={classNames("inline mb-2", textClass)}>{additionalText}</span>
        )}
      </p>

      <LinkButton
        isActive={true}
        label="×" //TODO use icon instead
        btnStyle="btn-style !text-2xl !text-gray-600 absolute right-2 top-1/2 transform -translate-y-1/2"
        onClick={onClose}
      />
    </div>
  );
};

AlertBanner.propTypes = {
  icon: PropTypes.string,
  highlightText: PropTypes.string,
  mainText: PropTypes.string,
  additionalText: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  containerStyle: PropTypes.string,
  highlightClass: PropTypes.string,
  textClass: PropTypes.string,
};

AlertBanner.defaultProps = {
  icon: "",
  highlightText: "",
  mainText: "",
  additionalText: "",
  containerStyle: "",
  highlightClass: "",
  textClass: "",
};

export default AlertBanner;
