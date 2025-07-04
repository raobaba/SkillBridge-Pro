/**
 * --------------------------------------------------------
 * File        : ErrorDialog.jsx
 * Description : Reusable component for displaying an error message
 *               dialog with an icon and optional expandable content.
 * Authors     : Developer team
 * Created On  : 2025-04-30
 * Updated On  : 2025-04-30
 * --------------------------------------------------------
 * Notes:
 * - Uses Avatar and Label components for consistent UI styling.
 * - Accepts a `title` prop for dynamic error messaging.
 * - Prepares logic for height tracking (currently not in use).
 */


import { map } from "lodash";
import React, { useState, useRef, useEffect } from "react";
import { Avatar, Label, LinkButton, ScrollBar } from "../../ui-controls";

const ErrorDialog = ({
  title = "This Claim line is already a part of the selected Playlist",
}) => {
  const [isOpenViewAll, setViewAll] = useState(false);
  const heightRef = useRef();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    let newHeight = heightRef?.current?.offsetHeight ?? 0;
    setHeight(newHeight);
  }, [height, isOpenViewAll]);

  return (
    <>
      <div className="flex">
        <>
          <Avatar
            size="md"
            icon={"text-xl icon-documents text-orange-300"}
            iconStyle={""}
            btnStyle={"bg-dialog-circle h-12 w-12 rounded-full"}
          />
        </>
        <div className="flex flex-col pl-3.5">
          <Label
            size={"md"}
            label={title}
            lblStyle={"leading-none text-black-500 pb-1.5 text-base"}
          />
        </div>
      </div>
    </>
  );
};

export default ErrorDialog;
