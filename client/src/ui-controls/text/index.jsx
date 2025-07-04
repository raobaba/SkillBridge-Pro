import React from "react";
// import './style.css';
import classNames from "classnames";
import PropTypes from "prop-types";

const Text = ({
  value,
  txtStyle,
  block,
  inlineBlock,
  isHoverEnable,
  ...rest
}) => {
  var txtClass = classNames(txtStyle, {
    "txt-hover-b-s": isHoverEnable,
    " block": block,
    "inline-block": inlineBlock,
  });

  var txtWraprClass = classNames({
    " block": block,
    "inline-block": inlineBlock,
    
  });

  return (
    <div className={txtWraprClass} id={value}>
      <span value={value} className={txtClass} {...rest}>
        {value}
      </span>
    </div>
  );
};

Text.propTypes = {
  value: PropTypes.any.isRequired,
  txtStyle: PropTypes.string,
};

export default Text;
