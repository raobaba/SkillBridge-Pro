/**
 * --------------------------------------------------------
 * File        : DialogTitleSuccess.js
 * Description : A component used for rendering a successful dialog title with an avatar 
 *               and a dynamic icon (optional). It displays the main title and an optional 
 *               subtitle in a structured manner.
 * 
 * Notes:
 * - The component supports showing a dynamic success icon (green checkmark) when the 
 * - The main title label (`label`) and optional subtitle (`subLabel`) can be customized 
 * - It's designed to be used in dialog boxes where a success message needs to be displayed.
 * --------------------------------------------------------
 */



import React from "react";
import { Avatar, Label } from "../../ui-controls";

const DialogTitleSuccess = ({
  labelStyle,
  label,
  subLabel,
  labelSize,
  subLabelSize,
  subLabelStyle,
  avatarSize,
  avatarIcon,
  avatarBtnStyle,
  showDynamicIcon,
}) => {
  return (
    <>
      <div className="">
        <div className="m-auto w-wp-48 pt-3 mb-3.5">
          <Avatar
            size={avatarSize}
            icon={
              showDynamicIcon ? "text-xl icon-check text-green-500" : avatarIcon
            }
            iconStyle={"avatarStyle"}
            btnStyle={showDynamicIcon ? "bg-green-300" : avatarBtnStyle}
          />
        </div>
        <div className="flex flex-col mb-4 text-center">
          {subLabel ? (
            <Label
              size={subLabelSize}
              label={subLabel}
              lblStyle={subLabelStyle}
            />
          ) : null}
          <Label
            size={labelSize}
            label={label}
            lblStyle={"text-black-500 txt-lrg-18 font-medium label-lg mt-1"}
          />
        </div>
      </div>
    </>
  );
};

DialogTitleSuccess.defaultProps = {
  avatarIcon: "text-xl icon-check text-green-500",
  avatarBtnStyle: "bg-green-300",
  showDynamicIcon: true,
};

export default DialogTitleSuccess;
