import React from "react";
import PropTypes from "prop-types";
import { Dialog, Avatar, Button } from "../index";
import DangerCircle from "../../assets/icons/DangerCircle.svg";
import { PaymentStatusIcon } from "../../assets/index";

const PaymentSuccessDialog = ({
  show,
  onClose,
  isSuccess, // Conditional flag for success or failure
  buttonText = "Okay", // Default text for the button
  onProceed = () => {},
}) => {
  return (
    <Dialog visible={show} closeModal={onClose} dialogStyle="!rounded-2xl">
      <div className="px-5 text-center">
        {/* Success Icon */}
        {isSuccess ? (
          <Avatar imgClass={"!h-3"} src={PaymentStatusIcon} />
        ) : (
          // Failure Icon
          <Avatar src={DangerCircle} />
        )}

        {/* Dialog Header */}
        <div className="text-txt-19 leading-snug font-semibold text-black">
          {isSuccess ? "🎉Payment Successful🎉" : "Payment Failed"}
        </div>

        {/* Dialog Details */}
        <p className="mt-2 mb-4 text-sm leading-relaxed text-slate-600">
          {isSuccess ? (
            <div className="justify-center text-center">
              <span className="text-base font-medium text-black/50">
                Profile is{" "}
              </span>
              <span className="text-base font-semibold text-green-600">
                Sent for Approval
              </span>
              <span className="font-['Mulish'] text-base font-medium text-black/50">
                {" "}
                we will soon notify you
              </span>
            </div>
          ) : (
            "There was an issue with your payment. Please try again."
          )}
        </p>

        {/* Button */}
        <div className="flex justify-center">
          <Button
            name={buttonText}
            onClick={onProceed}
            isActive={true}
            btnStyle={`py-2 px-8 rounded-sm border-none mb-2 ${
              isSuccess ? "!bg-primary-theme !text-txt-md-14" : "!bg-red-500"
            }`}
          />
        </div>
      </div>
    </Dialog>
  );
};

PaymentSuccessDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isSuccess: PropTypes.bool.isRequired, // Determines success or failure
  buttonText: PropTypes.string, // Optional custom text for the button
};

export default PaymentSuccessDialog;
