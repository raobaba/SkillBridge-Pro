import React, { Fragment } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";
import classNames from "classnames";
// import "./style.css";
import { map, some } from "lodash";
import Checkbox from "../checkbox";
import ScrollBar from "../scrollbar";

const CheckboxDropdown = ({
  id,
  placeholder,
  options = [],
  optionLabel,
  optionValue,
  onChange,
  isDisabled,
  value = [],
  mainStyle,
  dropdownStyle,
  menuStyle,
  itemStyle,
  btnStyle,
  iconStyle,
  checkboxStyle,
  checkboxSize,
  checkboxLabelStyle,
  ...rest
}) => {
  const onCheckClick = (option, isChecked) => {
    let list = [...(value ?? [])];
    if (isChecked) {
      list = [
        ...list,
        {
          [optionLabel]: option[optionLabel],
          [optionValue]: option[optionValue],
          isSelected: true,
        },
      ];
    } else {
      list = list.filter((item) => item[optionValue] !== option[optionValue]);
    }
    onChange && onChange(list);
  };
  const menuItems = map(options, (option, index) => {
    let isSelected = some(
      value,
      (item) => item[optionValue] === option[optionValue]
    );
    return (
      <MenuItem key={index}>
        {({ active }) => (
          <>
            <span
              className={classNames(itemStyle, {
                "block px-3 pt-2 pb-1.5 text-sm custom-text-size hover:text-color-text w-full ellipsis overflow-hidden whitespace-nowrap": true,
                "cursor-pointer checkbox-dd-active font-normal bg-gray-150 rounded-xs-2":
                  active || isSelected,
                "text-color-text": !active || !isSelected,
              })}
            >
              <Checkbox
                key={id + option[optionLabel]}
                id={id + option[optionLabel]}
                name={option[optionLabel]}
                size={checkboxSize}
                label={option[optionLabel]}
                inputStyle={checkboxStyle}
                lblClass={checkboxLabelStyle}
                isDisabled={option.isDisabled}
                onChange={(isChecked) => onCheckClick(option, isChecked)}
                isChecked={isSelected}
                isOverflowEllipsis={true}
              />
            </span>
          </>
        )}
      </MenuItem>
    );
  });

  const menuItemLength = options?.length > 5;
  let selectedValues = placeholder;
  if (value?.length > 1) {
    selectedValues = `${value[0][optionLabel] ?? ""} +${value?.length - 1}`;
  } else if (value?.length) {
    selectedValues = `${value[0][optionLabel] ?? ""}`;
  }
  return (
    <Menu
      id={id}
      as="div"
      className={classNames(
        dropdownStyle,
        "relative inline-block text-left w-full"
      )}
      {...rest}
    >
      {({ open }) => (
        <>
          <>
            <MenuButton
              className={classNames(mainStyle, {
                "border border-primary-theme": open,
                "border-secondary-theme": !open,
                "disabled:opacity-50 w-full text-left rounded-sm-4 border shadow-sm px-3 text-sm focus:outline-none focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 py-2 svg-algnmt": true,
                "cursor-default": isDisabled,
              })}
              disabled={isDisabled}
            >
              <div className={btnStyle}>{selectedValues}</div>
              <ChevronDownIcon
                className={classNames(iconStyle, {
                  "-mr-1 ml-2 h-5 w-5": true,
                })}
                aria-hidden="true"
              />
            </MenuButton>
          </>

          <Transition
            show={open || false}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems
              static
              className={classNames(
                "outline-none overflow-y-hidden overflow-x-hidden origin-top-right z-50 w-full absolute right-0 mt-2 rounded-sm-4 shadow-lg bg-white ring-1 dd-shadow ring-black ring-opacity-0 focus:outline-none",
                menuStyle
              )}
            >
              <ScrollBar
                scrollStyle="max-scroll"
                maxHeight={menuItemLength ? `h-hp-137` : `h-full`}
                maxWidth={`100%`}
                horizontal={"hidden"}
                verticle={"scroll"}
                autohide={"scroll"}
              >
                <div className="py-1 px-1">{menuItems}</div>
              </ScrollBar>
            </MenuItems>
          </Transition>
        </>
      )}
    </Menu>
  );
};

CheckboxDropdown.propTypes = {
  id: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.array.isRequired,
  optionLabel: PropTypes.string.isRequired,
  optionValue: PropTypes.string.isRequired,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  dropdownStyle: PropTypes.string,
  mainStyle: PropTypes.string,
  menuStyle: PropTypes.string,
  itemStyle: PropTypes.string,
  btnStyle: PropTypes.string,
  iconStyle: PropTypes.string,
};

CheckboxDropdown.defaultProps = {
  id: "dropdown",
  placeholder: "Select",
  options: [],
  value: [],
  isDisabled: false,
  dropdownStyle: "w-full",
  menuStyle: "",
  itemStyle: "",
  iconStyle: "",
  checkboxStyle: "rounded-xs-2",
  checkboxSize: "sm",
  checkboxLabelStyle:
    "pl-2 text-xs pb-px text-custom-clr hover:font-medium custom-space",
};
export default CheckboxDropdown;
