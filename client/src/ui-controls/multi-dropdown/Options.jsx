import React, { useRef } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Menu } from "@headlessui/react";
import { useSpring, animated } from "react-spring";
import { map } from "lodash";
import { getTestId } from "../../services/utils";

const Options = ({
  id,
  openLevels = [],
  onToggleLevel,
  onSelect,
  value,
  data,
  optionLabel,
  optionValue,
  optionItems,
  itemStyle,
  innerItemStyle,
  dataTestId,
}) => {
  const hasChildren = (children = []) => !!children?.length;
  const isLevelOpen = openLevels.includes(data[optionValue]);

  const heightRef = useRef();
  const slideInStyles = useSpring(
    id !== "finding"
      ? {
          from: { opacity: 0, height: 0 },
          to: {
            opacity: isLevelOpen ? 1 : 0,
            height: isLevelOpen ? "auto" : 0,
          },
        }
      : {
          from: {
            opacity: 0,
            height: 0,
          },
          to: {
            opacity: isLevelOpen ? 1 : 0,
            height: isLevelOpen ? 200 : 0,
          },
        }
  );

  const menuItems = map(data[optionItems], (option, index) => {
    const isChildrenExist = hasChildren(option[optionItems]);
    const isSelected = (value && value[optionValue]) === option[optionValue];
    const isToggle = openLevels.includes(option[optionValue]);
    //const Icon = isToggle ? ChevronDownIcon : ChevronRightIcon;

    let dataTestLabel = getTestId(option[optionLabel]);
    return (
      <div
        key={index}
        datatestid={`${dataTestId}_${dataTestLabel}`}
        status={option.isDisable ? "disabled" : "enabled"}
      >
        <Menu.Item key={option[optionValue]} disabled={option.isDisable}>
          {
            ({ active }) => (
              // isChildrenExist ? (
              <div className={classNames(innerItemStyle)}>
                <span
                  onClick={
                    option.isDisable
                      ? () => {}
                      : !isChildrenExist
                      ? () => onSelect(option)
                      : () => onToggleLevel(option[optionValue])
                  }
                  className={classNames(itemStyle, "levels", {
                    "block px-1.5 pl-4 py-1.5 pt-2 text-xs icn-clr": true,
                    "bg-gray-150 text-color-text font-medium": isToggle,
                    "text-color-text font-medium": active || isSelected,
                    "text-gray-500 hover:text-color-text hover:font-medium":
                      !isToggle && !option.isDisable,
                    "cursor-pointer": !option.isDisable,
                    "text-secondary-theme": option.isDisable,
                  })}
                >
                  {option[optionLabel]}
                  {/* <span>
                    <Icon
                      className={classNames('ml-2 w-4', {
                        'text-gray-500': isSelected,
                        'text-gray-300': !isSelected,
                      })}
                      aria-hidden="true"
                    />
                  </span> */}
                </span>
              </div>
            )
            // )
            // ) : (
            //   <span
            //     onClick={() => onSelect(option)}
            //     className={classNames(itemStyle, {
            //       'block px-2.5 py-2 text-xs': true,
            //       'cursor-pointer text-secondary bg-gray-150 hover:bg-white hover:font-medium hover:text-color-text':
            //         active || isSelected,
            //       'text-secondary': !active || !isSelected,
            //     })}
            //   >
            //     {option[optionLabel]}
            //   </span>
            // )
          }
        </Menu.Item>
        {isChildrenExist && (
          <Options
            value={value}
            data={option}
            onSelect={onSelect}
            openLevels={openLevels}
            optionLabel={optionLabel}
            optionValue={optionValue}
            optionItems={optionItems}
            onToggleLevel={onToggleLevel}
          />
        )}
      </div>
    );
  });
  return (
    <>
      {hasChildren(data[optionItems]) && (
        <>
          <animated.div style={{ ...slideInStyles, overflow: "hidden" }}>
            <div
              ref={heightRef}
              className="py-1 transition ease-out duration-100"
            >
              {menuItems}
            </div>
          </animated.div>
        </>
      )}
    </>
  );
};

Options.propTypes = {
  openLevels: PropTypes.array.isRequired,
  onToggleLevel: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  optionValue: PropTypes.string.isRequired,
  optionItems: PropTypes.string.isRequired,
  value: PropTypes.object,
  data: PropTypes.object.isRequired,
};

Options.defaultProps = {
  data: {},
  value: {},
  openLevels: [],
};

export default Options;
