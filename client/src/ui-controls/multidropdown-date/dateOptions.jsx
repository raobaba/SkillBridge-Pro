import React, { useRef } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Menu } from "@headlessui/react";
import { useSpring, animated } from "react-spring";
import { map } from "lodash";
import { getTestId } from "../../services/utils";
import { useState } from "react";
import { TextInput, Button } from "../index";

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
  const [customFromDate, setCustomFromDate] = useState("");
  const [customToDate, setCustomToDate] = useState("");
  const [showDateInputs, setShowDateInputs] = useState(false);

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
        },
  );

  const menuItems = map(data[optionItems], (option, index) => {
    const isChildrenExist = hasChildren(option[optionItems]);
    const isSelected = (value && value[optionValue]) === option[optionValue];
    const isToggle = openLevels.includes(option[optionValue]);

    let dataTestLabel = getTestId(option[optionLabel]);
    return (
      <div
        key={index}
        datatestid={`${dataTestId}_${dataTestLabel}`}
        status={option.isDisable ? "disabled" : "enabled"}
      >
        <Menu.Item key={option[optionValue]} disabled={option.isDisable}>
          {({ active }) => (
            <div className={classNames(innerItemStyle)}>
              {setShowDateInputs(true)}
            </div>
          )}
        </Menu.Item>
        {showDateInputs && (
          <div className="flex flex-col gap-2 bg-white p-3 text-black">
            <div className="flex items-center gap-2">
              <label className="w-12 text-sm font-medium">From:</label>
              <div className="relative w-full">
                <TextInput
                  id={"date"}
                  type="date"
                  placeholder={"YYYY/MM/DD"}
                  // label={"Date of Birth"}
                  name={"dob"}
                  // value={basicDetails.dob || ""}
                  onChange={(e) => setCustomFromDate(e.target.value)}
                  inputStyle="!text-[#999999] !font-[450] !text-txt-md-12 !w-32"
                  labelClass={"!text-sm"}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="w-12 text-sm font-medium">To:</label>
              <div className="relative w-full">
                <TextInput
                  id={"date"}
                  type="date"
                  placeholder={"YYYY/MM/DD"}
                  // label={"Date of Birth"}
                  name={"dob"}
                  // value={basicDetails.dob || ""}
                  onChange={(e) => setCustomToDate(e.target.value)}
                  inputStyle="!text-[#999999] !font-[450] !text-txt-md-12 !w-32"
                  labelClass={"!text-sm"}
                />
              </div>
            </div>

            <Button
              size={"md"}
              name={"Apply"}
              isDisabled={false}
              isActive={true}
              onClick={() => {
                onSelect({
                  id: "custom_range",
                  label: `Custom: ${customFromDate} - ${customToDate}`,
                  from: customFromDate,
                  to: customToDate,
                });
                setShowDateInputs(false); // Hide the custom date inputs after selection
              }}
              btnStyle="w-full !font-medium disabled:opacity-40 !bg-primary-theme rounded-sm-4 focus:outline-none text-white bg-primary-theme hover:bg-black-400 font-medium trans-ease-in h-hp-32 pb-0.5 cursor-pointer"
            />
          </div>
        )}
        {/* <span
                onClick={
                  option.isDisable
                    ? () => {}
                    : !isChildrenExist
                      ? () => {
                          // Show custom range input UI
                          if (option[optionValue] === "range") {
                          } else {
                            onSelect(option);
                          }
                        }
                      : () => onToggleLevel(option[optionValue])
                }
                className={classNames(itemStyle, "levels", {
                  "icn-clr block px-1.5 py-1.5 pt-2 pl-4 text-xs": true,
                  "bg-gray-150 text-color-text font-medium": isToggle,
                  "text-color-text font-medium": active || isSelected,
                  "hover:text-color-text text-gray-500 hover:font-medium":
                    !isToggle && !option.isDisable,
                  "cursor-pointer": !option.isDisable,
                  "text-secondary-theme": option.isDisable,
                })}
              >
                 {option[optionLabel]} 
              </span> */}

        {isChildrenExist && isToggle && (
          <div
            className="absolute top-0 left-[-100%] z-5000 w-full rounded bg-white shadow-md"
            style={{ transform: "translateX(-100%)" }} // Use translateX if left-[-100%] does not work as expected
          >
            <Options
              id={id}
              value={value}
              data={option}
              onSelect={onSelect}
              openLevels={openLevels}
              onToggleLevel={onToggleLevel}
              optionLabel={optionLabel}
              optionValue={optionValue}
              optionItems={optionItems}
              itemStyle={itemStyle}
              innerItemStyle={innerItemStyle}
            />
          </div>
        )}
      </div>
    );
  });

  return (
    <>
      {hasChildren(data[optionItems]) && (
        <animated.div style={{ ...slideInStyles }} className="relative">
          <div
            ref={heightRef}
            className="relative transition duration-100 ease-out"
          >
            {menuItems}
          </div>
        </animated.div>
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
