import React from "react";
import { forEach, map } from "lodash";
import classNames from "classnames";

import { sizeEnum } from "../../services/constants";
import { getTestId } from "../../services/utils";

const ButtonGroup = ({
  buttons,
  onClick,
  groupStyle,
  btnStyle,
  isHoverEnable,
  size = "sm",
  datatestid,
  ...rest
}) => {
  const onButtonClick = (selectedButton, index) => {
    let buttonList = [];
    if (buttons?.length) {
      forEach(buttons, (button, buttonIndex) => {
        buttonList = [
          ...buttonList,
          {
            ...button,
            isSelected: button.isSelected ? false : buttonIndex === index,
          },
        ];
      });
    }
    onClick &&
      onClick(
        buttonList,
        {
          ...selectedButton,
          isSelected: buttonList[index].isSelected,
        },
        index
      );
  };

  const renderList = map(buttons, (button, index) => {
    const { code, name, isSelected, isDisable } = button;
    var btnClass = classNames(btnStyle, "disabled:opacity-40", {
      "items-center focus:outline-none border border-gray-300 h-5 flex items-center": true,
      "px-6 py-1 w-24 h-8 text-xs": size === sizeEnum.small,
      "px-1 py-2 w-wp-98 h-hp-34 text-sm": size === sizeEnum.medium,
      "px-8 py-1 w-24 h-8 text-base": size === sizeEnum.large,
      "text-white btn-black-custom border-primary-theme font-medium":
        isSelected,
      "text-color-text ": !isSelected,
      "opacity-40 pointer-events-none": isDisable,
      "cursor-pointer": !isDisable,
      "text-white hover:bg-black-400 hover:text-white hover:border-primary-theme": true,
    });
    return (
      <button
        key={code || name}
        id={code || name}
        datatestid={getTestId(`${datatestid} ${name}`)}
        status={isDisable ? "disabled" : "enabled"}
        type="button"
        data-text={name}
        className={btnClass}
        onClick={() => onButtonClick(button, index)}
        disabled={isDisable}
        {...rest}
      >
        {name}
      </button>
    );
  });
  return (
    <>
      <div className={groupStyle}>{renderList}</div>{" "}
    </>
  );
};

export default ButtonGroup;
