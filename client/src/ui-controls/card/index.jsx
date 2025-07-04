import React from "react";
// import './style.css';
import classNames from "classnames";
import PropTypes from "prop-types";

const Card = ({
  isHoverEnable,
  isDisabled,
  children,
  onClick,
  cardStyle,
  childStyle,

  ...rest
}) => {
  var cardClass = classNames(cardStyle, {
    "rounded-sm-4 bg-white": true,
    "card-repeat": isHoverEnable,
    "card-disabled": isDisabled,
  });

  var childClass = classNames(childStyle, {});

  return (
    <div onClick={onClick}>
      <div className={cardClass} {...rest}>
        <div className={childClass}>{children}</div>
      </div>
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  isHoverEnable: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
  cardStyle: PropTypes.string,
  childStyle: PropTypes.string,
};
Card.defaultProps = {
  isHoverEnable: false,
  isDisabled: false,
};

export default Card;
