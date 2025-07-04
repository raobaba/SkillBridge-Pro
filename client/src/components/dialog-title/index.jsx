/**
 * --------------------------------------------------------
 * File        : DialogTitle.js
 * Description : A reusable component that renders the title section
 *               of a dialog box. It includes an avatar (icon), 
 *               main label, and optional subtitle. This component 
 *               provides flexibility to customize the appearance 
 *               of the dialog's header.
 * 
 * Notes:
 * - The component can render a dialog header with both a subtitle and a main title.
 * - If no subtitle is provided, only the main label and avatar are displayed.
 * - The `avatar` icon is optional and customizable in terms of size and style.
 * - The component is primarily used within dialog boxes to display a clean and structured header.
 * --------------------------------------------------------
 */


import React from "react";
import { Avatar, Label } from "../../ui-controls";

const DialogTitle = ({
  labelStyle,
  label,
  subLabel,
  labelSize,
  subLabelSize,
  subLabelStyle,
  avatarSize,
  avatarIcon,
  avatarStyle,
  avatarBtnStyle,
}) => {
  return (
    <>
      <div className="flex items-center">
        <div className=" ">
          <Avatar
            size={avatarSize}
            icon={avatarIcon}
            iconStyle={avatarStyle}
            btnStyle={avatarBtnStyle}
          />
        </div>
        <div className="pl-3.5 flex flex-col">
          {subLabel ? (
            <Label
              size={subLabelSize}
              label={subLabel}
              lblStyle={subLabelStyle}
            />
          ) : null}
          <Label size={labelSize} label={label} lblStyle={labelStyle} />
        </div>
      </div>
    </>
  );
};

export default DialogTitle;
