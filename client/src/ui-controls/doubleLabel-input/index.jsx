import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { inputTypeEnum } from "../../services/constants";
import { IcAdd } from "../../assets";
import Dropdown from "../dropdown";
import { countryOptions } from "../../services/constants";
import LinkButton from "../link-button";

const InputBox = ({
  id,
  label: name,
  placeholder,
  type,
  onChange,
  isDisabled,
  value,
  inputStyle,
  imageStyle,
  image,
  secondName,
  textbtn = false,
  labelClass,
  maxLength = 50,
  countryPhoneCode = false,
  countryCodeDisabled = false,
  onCountryChange,
  linkBtnClick,
  ...rest
}) => {
  const [inputType, setInputType] = useState(type || "text");
  const [selectedCountry, setSelectedCountry] = useState(countryOptions[0]);

  const isTypePassword = type === inputTypeEnum.password;

  const handleInputChange = (e) => {
    if (e.target.value.length <= maxLength) {
      onChange && onChange(e);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 items-center">
        {name && (
          <label
            htmlFor={name}
            className={classNames(
              "text-txt-md-13 text-color-text block",
              labelClass,
            )}
          >
            {name}
          </label>
        )}
        {secondName && (
          <div className="text-txt-md-13 text-color-text block text-end">
            {secondName}
          </div>
        )}
      </div>

      <div className="rounded-sm-4 relative mt-1 flex gap-2">
        {countryPhoneCode && (
          <div className="">
            <Dropdown
              id="country-code"
              options={countryOptions}
              optionLabel="name"
              optionValue="name"
              value={selectedCountry}
              dropdownStyle="!w-19" // button width
              menuStyle="!w-19" // dropdown menu width
              itemStyle="text-xs px-3 py-2" // option item size
              isDisabled={countryCodeDisabled}
              onChange={(val) => {
                setSelectedCountry(val);
                onCountryChange && onCountryChange(val);
              }}
              placeholder="Country code"
            />
          </div>
        )}

        <input
          id={id}
          type={inputType}
          autoComplete="off"
          name={name}
          value={value}
          onChange={handleInputChange}
          className={classNames(
            inputStyle,
            "border-grayBorder rounded-sm-6 input-text-field block w-full pr-10 pl-3 shadow-sm disabled:opacity-50 sm:text-sm",
          )}
          placeholder={placeholder}
          disabled={isDisabled}
          maxLength={maxLength}
          {...rest}
        />

        {(image || textbtn) && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {image && (
              <img
                className={classNames(
                  imageStyle,
                  "text-secondary-theme h-4 w-4",
                )}
                src={
                  isTypePassword && inputType === inputTypeEnum.text
                    ? IcAdd
                    : image
                }
                alt=""
                onClick={
                  isTypePassword
                    ? () =>
                        setInputType(
                          inputType === inputTypeEnum.text
                            ? inputTypeEnum.password
                            : inputTypeEnum.text,
                        )
                    : () => {}
                }
              />
            )}
            {textbtn && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <LinkButton
                  isActive={true}
                  label="APPLY"
                  onClick={linkBtnClick} // You can customize this
                  btnStyle="!text-[#999999] !text-txt-md-14 ml-2"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

InputBox.propTypes = {
  id: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  inputStyle: PropTypes.string,
  image: PropTypes.string,
  imageStyle: PropTypes.string,
  maxLength: PropTypes.any,
  labelClass: PropTypes.string,
  countryPhoneCode: PropTypes.bool,
  onCountryChange: PropTypes.func,
  textbtn: PropTypes.bool,
  countryCodeDisabled: PropTypes.bool,
};

InputBox.defaultProps = {
  id: "text-input",
  placeholder: "Enter",
  type: "text",
  value: "",
  isDisabled: false,
  inputStyle: "",
  image: "",
  imageStyle: "",
  maxLength: 50,
  labelClass: "",
  countryPhoneCode: false,
  onCountryChange: null,
  textbtn: false,
  countryCodeDisabled: false,
};

export default InputBox;
