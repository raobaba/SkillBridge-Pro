import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { useTransition, config, animated } from "react-spring";
import LinkButton from "../link-button/index";

const Dialog = ({
  label,
  modalStyle,
  visible,
  closeModal,
  children,
  outerDivStyle,
  dialogStyle,
  outSideClickOff, // not needed anymore, but kept if you want to keep the prop
  ...rest
}) => {
  const onCloseModel = () => {
    closeModal && closeModal();
  };

  const transition = useTransition(visible, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    config: config.slow,
  });

  const dialogClass = classNames({
    "modal-box-custom showBlock fade": visible,
  });

  const modalDialogStyle = classNames(dialogStyle, {
    "modal-content": true,
  });

  const modalDivStyle = classNames(outerDivStyle, {
    "modal-dialog-custom": true,
  });

  return (
    <>
      {transition((style, visible) =>
        visible ? (
          <animated.div
            style={style}
            className={dialogClass}
            id="dialog_confirm_map"
            role="dialog"
            aria-labelledby="dialog_confirm_mapLabel"
            aria-hidden="true"
          >
            <div className={modalDivStyle}>
              <div className={modalDialogStyle}>
                {/* Close Button */}

                <LinkButton
                  isActive={true}
                  label="&times;"
                  btnStyle={
                    "btn-style !text-2xl !text-gray-600 absolute top-1 right-1"
                  }
                  onClick={onCloseModel}
                />

                {children}
              </div>
            </div>
          </animated.div>
        ) : null,
      )}
    </>
  );
};

Dialog.propTypes = {
  lblStyle: PropTypes.string,
  tooltipStyle: PropTypes.string,
  position: PropTypes.string,
  visible: PropTypes.bool,
  children: PropTypes.node,
  modalStyle: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
};
Dialog.defaultProps = {
  modalStyle: "modal-content",
};

export default Dialog;
