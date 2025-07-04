import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const ReferralCard = ({
  isValid = true,
  imageSrc,
  referredByText = "Referred by",
  referredByName,
  className,
  imageClassName,
}) => {
  if (!isValid) {
    return (
      <div
        className={classNames(
          "relative h-min w-full max-w-md rounded-lg bg-[#F4F7FE] p-6 text-center",
          className,
        )}
      >
        {/* Error Icon */}
        <div className="mb-4 flex justify-center">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-red-600"></div>
            <div className="absolute top-[30%] left-1/2 h-4 w-1 -translate-x-1/2 rounded-sm bg-red-600"></div>
            <div className="absolute bottom-[25%] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-red-600"></div>
          </div>
        </div>

        {/* Error Text */}
        <div className="mb-1 text-lg font-semibold text-red-800">
          Sponsor Agent GFI Code Invalid
        </div>
        <p className="text-links text-sm">
          Enter the correct Sponsor Agent GFI Code to proceed further or reach
          out to
          <a href="mailto:coding@mygfi.com" className="ml-1 text-blue-500">
            coding@mygfi.com
          </a>
          for assistance.
        </p>
      </div>
    );
  }

  return (
    <div
      className={classNames(
        "relative w-full max-w-xs overflow-hidden rounded-lg bg-[#F4F7FE] p-4 text-center",
        className,
      )}
    >
      {/* Image */}
      <div className="mt-2 flex justify-center">
        <img
          src={imageSrc}
          alt={referredByName}
          className={classNames(
            "h-24 w-24 rounded-full object-cover shadow-md",
            imageClassName,
          )}
        />
      </div>

      {/* Text */}
      <div className="mt-6 space-y-1">
        <div className="text-txt-16 font-medium text-slate-500">
          {referredByText}
        </div>
        <div className="text-txt-22.4px font-semibold text-indigo-900">
          {referredByName}
        </div>
      </div>
    </div>
  );
};

ReferralCard.propTypes = {
  isValid: PropTypes.bool,
  imageSrc: PropTypes.string,
  referredByText: PropTypes.string,
  referredByName: PropTypes.string,
  className: PropTypes.string,
  imageClassName: PropTypes.string,
};

export default ReferralCard;
