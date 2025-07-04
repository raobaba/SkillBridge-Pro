import React from "react";
import PropTypes from "prop-types";
import { Dialog, Avatar, Button } from "../index";
const SelectAgentStatus = ({
  show,
  onClose,
  onSelectStatus, // Set by AdminDashboard
}) => {
  return (
    <Dialog visible={show} closeModal={onClose} dialogStyle="!rounded-2xl">
      <div className="flex justify-center gap-4">
        <Button
          name="Reject"
          onClick={() => {
            onSelectStatus("Rejected"); // Send key
            onClose();
          }}
          isActive={true}
          btnStyle="pb-1 w-[131px] h-[34px] rounded-sm bg-red-500 text-white"
        />
        <Button
          name="Approve"
          onClick={() => {
            onSelectStatus("Approved"); // Send key
            onClose();
          }}
          isActive={true}
          btnStyle="pb-1 w-[131px] h-[34px] rounded-sm bg-green-600 text-white"
        />
      </div>
    </Dialog>
  );
};



SelectAgentStatus.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectStatus: PropTypes.func.isRequired,
  dialogHeader: PropTypes.string,
  dialogDetail: PropTypes.string,
};

export default SelectAgentStatus;
