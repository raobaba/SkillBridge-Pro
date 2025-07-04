/**
 * --------------------------------------------------------
 * File        : Acknowledge.js
 * Description : Component for displaying an error or acknowledgment message
 *               with an optional icon. This is commonly used for error or
 *               warning notifications.
 * Authors     : Developer team
 * Created On  : 2025-04-30
 * Updated On  : 2025-04-30
 * --------------------------------------------------------
 * Notes:
 * - The icon and message are displayed within a centered div.
 * - The icon is customizable through the `errorIcon` prop.
 * - The `Label` component from the UI controls is used for displaying the message.
 */



import React from "react";
import { Label } from "../../ui-controls";
import classNames from "classnames";

const Acknowledge = ({ message, errorIcon }) => {
  return (
    <div className="h-hp-161 flex items-center justify-center">
      <div>
        <div className="mb-mtp-10 bg-error w-wp-48 h-hp-48 m-auto flex items-center justify-center rounded-full">
          <div className={classNames("text-5xl text-red-500", errorIcon)}></div>
        </div>
        <span className="text-black-500 text-txt-lg-18 w-wp-300 leading-leading-24 mt-0.5 block">
          {/* <div className="text-black-500 text-txt-lg-18 font-medium text-center">
            {errorStatus}
          </div> */}
          <Label
            label={message}
            className={classNames(
              "text-txt-lg-18 block text-center font-medium",
            )}
          />
        </span>
      </div>
    </div>
  );
};
Acknowledge.defaultProps = {
  labelStyle: "text-lg flex items-center -mt-1 text-primary-theme",
  label: "Acknowledge",
  labelSize: "lg",
  message: "Something went wrong",
};

export default Acknowledge;
