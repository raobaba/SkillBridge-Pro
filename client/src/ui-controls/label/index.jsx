import React from "react";
// import "./style.css";
import classNames from "classnames";
import PropTypes from "prop-types";
import { sizeEnum } from "../../services/constants";

const Label = ({ label, size, lblStyle, ...rest }) => {
  var labelClass = classNames(lblStyle, {
    "label-xxs": size === sizeEnum.doubleExtraSmall,
    "label-xs": size === sizeEnum.extraSmall,
    "label-sm": size === sizeEnum.small,
    "label-md": size === sizeEnum.medium,
    "label-lg": size === sizeEnum.large,
  });

  return (
    <>
      <label className={labelClass} {...rest}>
        {label}
      </label>
    </>
  );
};

Label.propTypes = {
  label: PropTypes.any.isRequired,
  size: PropTypes.string,
  lblStyle: PropTypes.string,
};
Label.defaultProps = {
  label: "label",
  size: "sm",
};

export default Label;
