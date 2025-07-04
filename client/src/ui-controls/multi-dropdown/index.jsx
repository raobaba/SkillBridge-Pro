import React, { useState, Fragment } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";
import classNames from "classnames";
// import "./style.css";
import { map } from "lodash";
import Options from "./Options";
import { getTestId } from "../../services/utils";
import ScrollBar from "../scrollbar";

const MultiDropdown = ({
  id,
  placeholder,
  options,
  optionLabel,
  optionValue,
  optionItems,
  onChange,
  isDisabled,
  value,
  dropdownStyle,
  menuStyle,
  itemStyle,
  blockStyle,
  btnStyle,
  innerItemStyle,
  frontMenuStyle,
  itemsScrollHeight,
  ...rest
}) => {
  const [openLevels, setOpenLevels] = useState([]);
  const hasChildren = (children = []) => !!children?.length;
  // let isToggle = false;

  const onToggleLevel = (level) => {
    if (level === null) {
      setOpenLevels([]);
    } else if (openLevels.includes(level)) {
      setOpenLevels(openLevels.filter((item) => item !== level));
    } else {
      setOpenLevels([...openLevels, level]);
    }
  };

  const onSelect = (option) => {
    setOpenLevels([]);
    onChange(option);
  };

  // const slideInStyles = useSpring({
  //   from: { rotateZ: 0 },
  //   to: { rotateZ: isToggle ? 180 : 0 },
  // });

  var dropdownClass = classNames(dropdownStyle, {
    "relative w-full inline-block text-left": true,
  });

  var menuClass = classNames(menuStyle, {
    "rounded-sm-4 shadow-lg bg-white ring-black ring-opacity-5 focus:outline-none": true,
  });

  const menuItems = map(options, (option, index) => {
    let isSelected = (value && value[optionValue]) === option[optionValue];
    let isChildrenExist = hasChildren(option[optionItems]);
    const isToggle = openLevels.includes(option[optionValue]);
    const Icon = isToggle ? ChevronDownIcon : ChevronRightIcon;

    var iconClass = classNames({
      "ic-chevron": true,
      "ic-chevron-animate": isToggle,
    });

    let dataTestId = getTestId(`${id}_${option[optionLabel]}`);

    return (
      <div key={index} datatestid={dataTestId}>
        <MenuItem>
          {({ active }) =>
            isChildrenExist ? (
              <>
                <span
                  onClick={() => onToggleLevel(option[optionValue])}
                  className={classNames(itemStyle, "levels", {
                    "menulist-span": true,
                    "menulist-onHover": isToggle,
                    "menulist-offHover": !isToggle,
                    "bg-gray-150": active || isSelected,
                  })}
                >
                  {option[optionLabel]}

                  <span>
                    <Icon className={iconClass} aria-hidden="true" />
                  </span>
                </span>
              </>
            ) : (
              <span
                onClick={() => onSelect(option)}
                className={classNames(itemStyle, {
                  "menulist-no-child custom-text-size": true,
                  "menulist-no-child-active": active || isSelected,
                  "text-gray-500": !active || !isSelected,
                })}
              >
                <span className="w-full ellipsis overflow-hidden whitespace-nowrap">
                  {option[optionLabel]}
                </span>
              </span>
            )
          }
        </MenuItem>
        <Options
          id={id}
          dataTestId={dataTestId}
          openLevels={openLevels}
          onToggleLevel={onToggleLevel}
          onSelect={onSelect}
          optionLabel={optionLabel}
          optionValue={optionValue}
          optionItems={optionItems}
          value={value}
          data={option}
          itemStyle={itemStyle}
          innerItemStyle={innerItemStyle}
        />
      </div>
    );
  });

  return (
    <Menu id={id} as="div" className={dropdownClass} {...rest}>
      {({ open }) => (
        <>
          <div className={blockStyle}>
            <MenuButton
              className={classNames(btnStyle, {
                "dropdown-input": true,
                "svg-align": true,
                "border-primary-theme": open,
                "border-secondary-theme": !open,
              })}
              disabled={isDisabled}
            >
              <div className="dd-ellipsis">
                {(value && value[optionLabel]) || placeholder}
              </div>
              <ChevronDownIcon
                className="-mr-1 ml-2 h-5 w-5 text-color-text"
                aria-hidden="true"
              />
            </MenuButton>
          </div>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems static className={menuClass}>
              {/* <div className="py-0 child">{menuItems}</div> */}
              <ScrollBar
                scrollStyle={itemsScrollHeight}
                maxHeight={`500px`}
                maxWidth={`100%`}
                horizontal={"hidden"}
                verticle={"scroll"}
                autohide={"move"}
              >
                <div className={classNames(frontMenuStyle, "py-0 child px-2")}>
                  {menuItems}
                </div>
              </ScrollBar>
            </MenuItems>
          </Transition>
        </>
      )}
    </Menu>
  );
};

MultiDropdown.propTypes = {
  id: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.array.isRequired,
  optionLabel: PropTypes.string.isRequired,
  optionValue: PropTypes.string.isRequired,
  optionItems: PropTypes.string.isRequired,
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  dropdownStyle: PropTypes.string,
  menuStyle: PropTypes.string,
  itemStyle: PropTypes.string,
  blockStyle: PropTypes.string,
  btnStyle: PropTypes.string,
};

MultiDropdown.defaultProps = {
  id: "dropdown",
  placeholder: "Select",
  options: [],
  value: {},
  isDisabled: false,
  dropdownStyle: "",
  menuStyle: "",
  itemStyle: "",
};
export default MultiDropdown;
