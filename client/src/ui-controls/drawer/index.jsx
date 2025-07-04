import React from "react";
// import "./style.css";
import classNames from "classnames";
import PropTypes from "prop-types";
import { positionEnum } from "../../services/constants";

const Drawer = ({
  id,
  children,
  isOpenDrawer,
  closeDrawer,
  position,
  ...rest
}) => {
  var drawerClass = classNames({
    "drawer h-full drawer-end": position === positionEnum.right,
    "drawer h-full": position === positionEnum.left,
  });
  return (
    <div className={drawerClass}>
      <input
        id={id}
        type="checkbox"
        checked={isOpenDrawer}
        onChange={() => {}}
        className="drawer-toggle"
        {...rest}
      />
      {children}
    </div>
  );
};

Drawer.propTypes = {
  children: PropTypes.node.isRequired,
  isDrawerOpen: PropTypes.bool,
  position: PropTypes.oneOf([positionEnum.left, positionEnum.right]),
};

export default Drawer;
