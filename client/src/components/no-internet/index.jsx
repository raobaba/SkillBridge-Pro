import React, { useState } from "react";
import { Dialog, Label } from "../../ui-controls";
import classNames from "classnames";

const NoInternet = () => {
  const [isVisible, setVisible] = useState(true);
  const errorIcon = "icon-no-internet";

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Dialog
        dialogStyle="error-dialog"
        closeModal={onClose}
        visible={isVisible}
        outSideClickOff={true}
      >
        <div className="flex justify-center h-hp-161">
          <div>
            <div className="flex items-center mb-mtp-10 justify-center  w-wp-48 h-hp-48 rounded-full m-auto mt-3.5">
              <div
                className={classNames("text-primary text-5xl", errorIcon)}
              ></div>
            </div>
            <span className="mt-0.5 text-black-500 text-txt-lg-18 block w-wp-325 leading-leading-24">
              <Label
                label={"Oops!"}
                className={"text-txt-lg-18 font-medium text-center block"}
              />
              <Label
                label={
                  "Slow or no internet connection. Please check your internet settings."
                }
                className={"text-txt-lg-18 font-medium text-center block"}
              />
            </span>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default NoInternet;
