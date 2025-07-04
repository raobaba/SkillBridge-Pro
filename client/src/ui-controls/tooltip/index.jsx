import React from "react";
// import "./style.css";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
// import Tooltip from "rc-tooltip";
// import "rc-tooltip/assets/bootstrap.css";

const TooltipCommon = ({
  id,
  label,
  children = "",
  tooltipStyle,
  lblStyle,
  place,
  tagStyle,
  isTableColumn,
  ...rest
}) => {
  var styleClass = classNames(tooltipStyle, {
    "custom-class": true,
    "tool-large-desc": label?.length > 150,
  });

  var tag = classNames(tagStyle, {
    flex: true,
    itemsCenter: true,
  });

  return (
    <>
      {/* {isTableColumn ? (
        <Tooltip
          overlay={children}
          placement={place}
          overlayInnerClassName={"customClass-2"}
        >
          <p>{children}</p>
        </Tooltip>
      ) : (
        <>
          <span data-tip={label} className={tag} data-for={id || label}>
            {children}
          </span>

          <ReactTooltip
            id={id || label}
            place={place}
            type="light"
            effect="float"
            className={styleClass}
          />
        </>
      )} */}
      <>
        <span data-tooltip-id={id || label} className={tag}>
          {children}
        </span>

        <ReactTooltip
          id={id || label}
          content={label}
          place={place}
          effect="float"
          className={styleClass}
        />
      </>
    </>
  );
};

TooltipCommon.propTypes = {
  children: PropTypes.node.isRequired,
  label: PropTypes.any.isRequired,
  lblStyle: PropTypes.string,
  tooltipStyle: PropTypes.string,
  place: PropTypes.string,
  isTableColumn: PropTypes.bool,
};

TooltipCommon.defaultProps = {
  place: "top",
  label: "",
  isTableColumn: false,
};

export default TooltipCommon;
