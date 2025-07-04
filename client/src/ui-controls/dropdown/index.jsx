import React, { Fragment } from "react";
import { Menu, MenuButton, MenuItem, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";
import classNames from "classnames";
// import "./style.css";
import { map } from "lodash";

import { getTestId } from "../../services/utils";
import ScrollBar from "../scrollbar";

const Dropdown = ({
  id,
  placeholder,
  options = [],
  optionLabel,
  optionValue,
  onChange,
  isDisabled,
  value,
  mainStyle,
  dropdownStyle,
  menuStyle,
  itemStyle,
  btnStyle,
  iconStyle,
  menuDirection,
  ...rest
}) => {
  const menuItems = map(options, (option, index) => {
    let isSelected = (value && value[optionValue]) === option[optionValue];
    let dataTestId = getTestId(`${id}_${option[optionLabel]}`);
    return (
      <MenuItem key={index} datatestid={dataTestId}>
        {({ active }) => (
          <span
            onClick={() => onChange && onChange(option)}
            className={classNames(itemStyle, {
              "custom-text-size hover:text-color-text ellipsis block w-full overflow-hidden px-3 pt-1.5 pb-2 text-sm whitespace-nowrap": true,
              "text-color-text bg-gray-150 rounded-xs-2 cursor-pointer font-medium":
                active || isSelected,
              "text-gray-500": !active || !isSelected,
            })}
          >
            {option[optionLabel]}
          </span>
        )}
      </MenuItem>
    );
  });

  const menuItemLength = options?.length > 5;

  return (
    <Menu
      id={id}
      as="div"
      className={classNames(dropdownStyle, "relative inline-block text-left")}
      {...rest}
    >
      {({ open }) => (
        <>
          <>
            <MenuButton
              className={classNames(mainStyle, {
                "border-primary-theme": open,
                "border-secondary-theme": !open,
                "rounded-sm-4 svg-algnmt w-full border px-3 py-2 text-left text-sm shadow-sm focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100 focus:outline-none disabled:opacity-50": true,
                "cursor-default": isDisabled,
              })}
              disabled={isDisabled}
            >
              <div className={btnStyle}>
                {(value && value[optionValue]) || placeholder}
              </div>
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
            <Menu.Items
              static
              className={classNames(
                "rounded-sm-4 dd-shadow w-full ring-opacity-0 absolute left-0 z-50 origin-top-left overflow-x-hidden overflow-y-hidden bg-white shadow-lg ring-1 ring-black outline-none focus:outline-none",
                menuStyle,
                {
                  [menuDirection]: menuDirection,
                  "mt-2": !menuDirection,
                },
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
                <div className="px-1 py-1">{menuItems}</div>
              </ScrollBar>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

Dropdown.propTypes = {
  id: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.array.isRequired,
  optionLabel: PropTypes.string.isRequired,
  optionValue: PropTypes.string.isRequired,
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  dropdownStyle: PropTypes.string,
  mainStyle: PropTypes.string,
  menuStyle: PropTypes.string,
  itemStyle: PropTypes.string,
  btnStyle: PropTypes.string,
  iconStyle: PropTypes.string,
};

Dropdown.defaultProps = {
  id: "dropdown",
  placeholder: "Select",
  options: [],
  value: {},
  isDisabled: false,
  dropdownStyle: "w-full",
  menuStyle: "",
  itemStyle: "",
  iconStyle: "",
};
export default Dropdown;
