import React from "react";
import PropTypes from "prop-types";
import { useTransition, config, animated } from "react-spring";
import LinkButton from "../link-button/index";

const Modal = ({
  visible,
  closeModal,
  children,
  title,
  bodyStyle,
  ...rest
}) => {
  const onCloseModal = () => {
    closeModal && closeModal();
  };

  const transition = useTransition(visible, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: config.slow,
  });

  return (
    <>
      {transition((style, visible) =>
        visible ? (
          <animated.div
            style={style}
            className="bg-bg-dialog fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-labelledby="modalTitle"
            aria-hidden="false"
          >
            <div
              className={`relative mx-4 w-full max-w-md rounded-xl bg-white shadow-lg ${bodyStyle}`}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-4">
                {title ? (
                  <h3 id="modalTitle" className="text-txt-md-15 font-bold">
                    {title}
                  </h3>
                ) : (
                  <div></div>
                )}
                <button
                  className="cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={onCloseModal}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="p-4">{children}</div>
            </div>
          </animated.div>
        ) : null,
      )}
    </>
  );
};

Modal.propTypes = {
  visible: PropTypes.bool,
  children: PropTypes.node,
  closeModal: PropTypes.func.isRequired,
  title: PropTypes.string,
  onSave: PropTypes.func,
  showFooter: PropTypes.bool,
};

export default Modal;
