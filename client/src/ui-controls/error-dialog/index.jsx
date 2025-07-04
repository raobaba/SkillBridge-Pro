import React from "react";
import PropTypes from "prop-types";
import { Dialog } from "../index";
import { Avatar } from "../index";
import { Button } from "../index";
import DangerCircle from "../../assets/icons/DangerCircle.svg";

const ErrorDialog = ({
  show,
  onClose,
  onConfirm,
  dialogHeader,
  dialogDetail,
  confirmText = "Exit",
  cancelText = "Cancel",
  isSingleButtonDialog,
}) => {
  return (
    <Dialog visible={show} closeModal={onClose} dialogStyle="!rounded-2xl">
      <div className="text-center ">
        <Avatar src={DangerCircle} />

        <div className="flex justify-center mt-4 text-lg leading-none font-medium text-black">
        <div className=""> 
          {dialogHeader}
          </div>
        </div>

        <div className="flex justify-center mt-2 mb-4 text-sm leading-none font-medium text-slate-500">
          <div className="w-[90%]"> 
          {dialogDetail}
          </div>
        </div>

        <div className="flex justify-center gap-4">
          {isSingleButtonDialog ? (
            <Button
              name="Okay"
              onClick={onClose}
              isActive={true}
              btnStyle="pb-1 pl-4 pr-4 rounded-sm !text-white !bg-primary-theme"
            />
          ) : (
            <>
              {" "}
              <Button
                name={cancelText}
                onClick={onClose}
                isActive={true}
                btnStyle="pb-1 w-[131px] h-[34px] rounded-sm !text-black !bg-white"
              />
              {confirmText && (
                <Button
                  name={confirmText}
                  onClick={() => {
                    onClose();
                    onConfirm && onConfirm();
                  }}
                  isActive={true}
                  isHoverEnable={false}
                  btnStyle="pb-1 w-[131px] h-[34px] rounded-sm !bg-red-500 text-white border-none"
                />
              )}
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
};

ErrorDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func,
  dialogHeader: PropTypes.string,
  dialogDetail: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

export default ErrorDialog;
