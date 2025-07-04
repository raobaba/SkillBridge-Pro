import React from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";
import PropTypes from "prop-types";

const ScrollBar = ({
  children,
  sbRef,
  scrollStyle = "",
  height = "100%",
  width = "100%",
  vertical = "scroll",
  horizontal = "hidden",
  autohide = "leave",
  style = {},
  ...rest
}) => {
  return (
    <OverlayScrollbarsComponent
      ref={sbRef}
      options={{
        scrollbars: { autoHide: autohide },
        overflowBehavior: { x: horizontal, y: vertical },
      }}
      style={{ maxHeight: height, maxWidth: width, ...style }}
      className={scrollStyle}
      {...rest}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
};

ScrollBar.propTypes = {
  children: PropTypes.node.isRequired,
  sbRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  scrollStyle: PropTypes.string,
  vertical: PropTypes.oneOf(["scroll", "hidden", "visible", "auto"]),
  horizontal: PropTypes.oneOf(["scroll", "hidden", "visible", "auto"]),
  autohide: PropTypes.oneOf(["leave", "scroll", "move", "never"]),
  height: PropTypes.string,
  width: PropTypes.string,
  style: PropTypes.object,
};

export default ScrollBar;
