import React from "react";
// import './style.css';
import classNames from "classnames";
import PropTypes from "prop-types";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import OutsideClickHandler from "react-outside-click-handler";

const PopOverDialog = ({
  label,
  visible,
  closeModal,
  icon,
  children,
  onCloseModel,
  isPointerIcon,
  pannelClass,
  ...rest
}) => {
  var popOverStyle = classNames({
    "": true,
  });

  var popPannelStyle = classNames(pannelClass, {
    "absolute z-10 px-4 mt-2  sm:px-0": true,
  });

  var pointerIconStyle = classNames({
    "overflow-hidden rounded-sm-4 shadow-bShadowPopOvr": true,
    pointerIcon: isPointerIcon,
  });

  return (
    <OutsideClickHandler onOutsideClick={() => onCloseModel}>
      <Popover className={popOverStyle}>
        {({ open }) => (
          <>
            <Popover.Button className={"flex items-center"}>
              {icon}
            </Popover.Button>

            <>
              <Transition
                show={visible}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className={popPannelStyle}>
                  <div className={pointerIconStyle}>{children}</div>
                </Popover.Panel>
              </Transition>
            </>
          </>
        )}
      </Popover>
    </OutsideClickHandler>
  );
};

PopOverDialog.propTypes = {
  lblStyle: PropTypes.string,
  tooltipStyle: PropTypes.string,
  position: PropTypes.string,
  visible: PropTypes.bool,
  isPointerIcon: PropTypes.bool,
  children: PropTypes.node,
  pannelClass: PropTypes.string,
};

PopOverDialog.defaultProps = {
  isPointerIcon: true,
};

export default PopOverDialog;
