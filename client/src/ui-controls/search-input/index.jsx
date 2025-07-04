import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
// import './style.css';

const SearchInput = ({
  id,
  label: name,
  placeholder,
  onChange,
  onClick,
  isDisabled,
  value,
  btnStyle,
  inputStyle,
  iconStyle,
  isLeft=false,
  ...rest
}) => {
  var inputClass = classNames(inputStyle, {
    "disabled:opacity-50 pl-2 block w-full sm:text-sm border-grayBorder rounded-sm-4 input-field pt-pd-6": true,
  });

  var iconClass = classNames(iconStyle, {
    "icon-Search text-ic-lg text-secondary-theme cursor-pointer": true,
    "opacity-30 pointer-events-none": isDisabled,
  });

  var btnClass = classNames(btnStyle, {
    "relative rounded-sm-4": true,
  });

  return (
    <>
      {name ? (
        <label htmlFor={name} className="block text-sm text-color-text">
          {name}
        </label>
      ) : null}

      <div className={btnClass}>
        <input
          id={id}
          type={"text"}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onClick && onClick(value)}
          className={inputClass}
          placeholder={placeholder}
          disabled={isDisabled}
          {...rest}
        />

        {!isLeft && <div className="absolute inset-y-0 right-0 pr-1 flex items-center">
          <span
            className={iconClass}
            onClick={() => onClick && onClick(value)}
          />
        </div>} 

        {isLeft && <div className="absolute inset-y-0 left-2 pr-1 flex items-center">
          <span
            className={iconClass}
            onClick={() => onClick && onClick(value)}
          />
        </div>}
      </div>
    </>
  );
};

SearchInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  label: PropTypes.string,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  isDisabled: PropTypes.bool,
  btnStyle: PropTypes.string,
  inputStyle: PropTypes.string,
  iconStyle: PropTypes.string,
};

SearchInput.defaultProps = {
  id: "text-input",
  placeholder: "Search",
  isDisabled: false,
  value: "",
  inputStyle: "",
  iconStyle: "",
};
export default SearchInput;
