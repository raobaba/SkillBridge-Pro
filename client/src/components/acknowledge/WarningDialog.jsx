/**
 * --------------------------------------------------------
 * File        : WarningDialog.jsx
 * Description : A dialog box component that displays a warning message
 *               when there are unsaved changes. It includes options to
 *               continue with the action or close the dialog.
 * Authors     : Developer team
 * Created On  : 2025-04-30
 * Updated On  : 2025-04-30
 * --------------------------------------------------------
 * Notes:
 * - The `DialogBox` component is used here to render the dialog.
 * - The dialog displays an error icon and a "Continue" button.
 * - The `onClose` and `onAction` handlers are passed down as props for flexibility.
 * - The dialog's status is set to `SUCCESS` and it is designed to show a footer.
 */

import React from "react";
import { DialogBox } from "../../components";

const WarningDialog = ({
  onClose,
  title = "You have unsaved changes",
  onAction = () => {},
}) => {
  return (
    <div className="delete-dialog mt-1 pt-5">
      <DialogBox
        label={title}
        subLabel=""
        avatarIcon="icon-URL-not-found1 text-ic-30 text-red-500"
        avatarBtnStyle="bg-error -mb-1"
        actionButton="Continue"
        onAction={onAction}
        onClose={onClose}
        isActionButtonEnable={true}
        actionButtonIcon=""
        showFooter={true}
        dialogStatus="SUCCESS"
        showDynamicIcon={false}
      >
        <div className="h-10"></div>
      </DialogBox>
    </div>
  );
};

export default WarningDialog;
