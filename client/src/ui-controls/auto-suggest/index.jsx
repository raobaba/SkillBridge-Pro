import React, { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import PropTypes from "prop-types";
import classNames from "classnames";
// import "./style.css";
import { map } from "lodash";

import OutsideClickHandler from "react-outside-click-handler";
import { getTestId } from "../../services/utils";
import ScrollBar from "../scrollbar";

const AutoSuggest = ({
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
  ...rest
}) => {
  const [isOpen, setOpen] = useState(true);
  useEffect(() => {
    setOpen(true);
  }, [options]);
  const menuItems = map(options, (option, index) => {
    let isSelected = (value && value[optionValue]) === option[optionValue];
    let dataTestId = getTestId(`${id}_${option[optionLabel]}`);
    return (
      <Menu.Item key={index} datatestid={dataTestId}>
        {({ active }) => (
          <span
            onClick={() => onChange && onChange(option)}
            className={classNames(itemStyle, {
              "block px-3 pt-1.5 pb-2 text-sm custom-text-size hover:text-color-text w-full ellipsis overflow-hidden whitespace-nowrap": true,
              "cursor-pointer text-color-text font-medium bg-gray-150 rounded-xs-2":
                active || isSelected,
              "text-gray-500": !active || !isSelected,
            })}
          >
            {option[optionLabel]}
          </span>
        )}
      </Menu.Item>
    );
  });

  const menuItemLength = options?.length > 5;
  return (
    <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
      <Menu
        id={id}
        as="div"
        className={classNames(dropdownStyle, "relative inline-block text-left")}
        {...rest}
      >
        <Transition
          show={isOpen}
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
              "outline-none overflow-y-hidden overflow-x-hidden origin-top-right z-50 w-full absolute right-0 rounded-sm-4 shadow-lg bg-white ring-1 dd-shadow ring-black ring-opacity-0 focus:outline-none",
              menuStyle
            )}
            {...rest}
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
          </Menu.Items>
        </Transition>
      </Menu>
    </OutsideClickHandler>
  );
};

AutoSuggest.propTypes = {
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

AutoSuggest.defaultProps = {
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
export default AutoSuggest;
