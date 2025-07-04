/**
 * --------------------------------------------------------
 * File        : DialogBox.jsx
 * Description : A reusable dialog box component that displays 
 *               a customizable dialog with a title, optional 
 *               subtitle, dynamic icons, and action buttons.
 *               The dialog can be used for success or error 
 *               messages, confirmations, and other custom content.
 *               It provides flexible configurations for buttons, 
 *               header style, icons, and footer content.
 * Authors     : Developer team
 * Created On  : 2025-04-30
 * Updated On  : 2025-04-30
 * --------------------------------------------------------
 * Notes:
 * - Supports both a success and default dialog layout based on the `dialogStatus` prop.
 * - Offers flexible button configurations for actions like cancel or confirm.
 * - Dynamically adjusts button states (enabled/disabled) and visibility of footer.
 */



import React from "react";
import { DataButton } from "../../ui-controls";
import { DialogTitle, DialogTitleSuccess } from "..";

const DialogBox = ({
  onClose,
  onAction,
  children,
  labelStyle,
  label,
  labelSize,
  avatarSize,
  avatarIcon,
  avatarStyle,
  avatarBtnStyle,
  subLabel,
  subLabelSize,
  subLabelStyle,
  showFooter,
  showSingleButton,
  actionButton,
  actionButtonIcon,
  isActionButtonEnable,
  headerStyle,
  dialogStatus,
  showDynamicIcon,
}) => {
  const closeModal = () => {
    onClose && onClose();
  };

  return (
    <>
      <div className={headerStyle}>
        {dialogStatus === "SUCCESS" ? (
          <DialogTitleSuccess
            labelStyle={labelStyle}
            label={label}
            labelSize={labelSize}
            avatarSize={avatarSize}
            avatarIcon={avatarIcon}
            avatarStyle={avatarStyle}
            avatarBtnStyle={avatarBtnStyle}
            subLabel={subLabel}
            subLabelSize={subLabelSize}
            subLabelStyle={subLabelStyle}
            showDynamicIcon={showDynamicIcon}
          />
        ) : (
          <DialogTitle
            labelStyle={labelStyle}
            label={label}
            labelSize={labelSize}
            avatarSize={avatarSize}
            avatarIcon={avatarIcon}
            avatarStyle={avatarStyle}
            avatarBtnStyle={avatarBtnStyle}
            subLabel={subLabel}
            subLabelSize={subLabelSize}
            subLabelStyle={subLabelStyle}
          />
        )}
      </div>
      {children}
      {showFooter && showSingleButton ? (
        <DataButton
          size={"md"}
          name={actionButton}
          isActive={true}
          isDisabled={false}
          isHoverEnable={true}
          btnStyle={"w-full trans-ease-in"}
          onClick={onAction}
        />
      ) : showFooter ? (
        <div className="flex justify-between items-center">
          <DataButton
            size={"md"}
            name={"Cancel"}
            icPosition={"left"}
            isGrayed={false}
            isDisabled={false}
            isHoverEnable={false}
            btnStyle={"w-full border border-gray-300 mr-1"}
            onClick={closeModal}
          />
          <DataButton
            size={"md"}
            icon={actionButtonIcon || ""}
            name={actionButton}
            icPosition={"left"}
            isGrayed={true}
            isActive={true}
            isDisabled={!isActionButtonEnable}
            isHoverEnable={false}
            btnStyle={"w-full ml-1"}
            onClick={onAction}
          />
        </div>
      ) : null}
    </>
  );
};
DialogBox.defaultProps = {
  labelStyle: "text-lg flex items-center -mt-0.5 font-medium text-color-text",
  label: "",
  labelSize: "lg",
  avatarSize: "md",
  avatarIcon: "text-orange-300 text-ic-xxl icon-claim-line",
  avatarStyle: "",
  avatarBtnStyle: "bg-dialog-circle h-12 w-12 rounded-full",
  subLabel: "",
  subLabelSize: "sm",
  subLabelStyle: "leading-none text-black-500 pt-1",
  showFooter: true,
  showSingleButton: false,
  headerStyle: "flex justify-start items-center h-10 mb-5 custom-flex",
};

export default DialogBox;
