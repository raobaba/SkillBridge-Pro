import React from "react";
import { forEach, map } from "lodash";

import { getTestId } from "../../services/utils";
import Radio from "../radio";

const RadioGroup = ({ radios, onChange, groupStyle, datatestid, ...rest }) => {
  const onRadioClick = (selectedRadio, index) => {
    let radioList = [];
    if (radios?.length) {
      forEach(radios, (radio, radioIndex) => {
        radioList = [
          ...radioList,
          {
            ...radio,
            isSelected: radio.isSelected ? false : radioIndex === index,
          },
        ];
      });
    }
    onChange &&
      onChange(radioList, {
        ...selectedRadio,
        isSelected: radioList[index].isSelected,
      });
  };

  const renderList = map(radios, (radio, index) => {
    const { code, name, isSelected } = radio;
    return (
      <div key={code} className="m-2 mr-0 w-wp-40">
        <Radio
          key={code || name}
          id={code || name}
          datatestid={getTestId(`${datatestid} ${name}`)}
          status={"enabled"}
          name={name}
          label={name}
          isChecked={isSelected}
          onChange={() => onRadioClick({ ...radio, isSelected: true }, index)}
          {...rest}
        />
      </div>
    );
  });
  return (
    <>
      <div className={groupStyle}>{renderList}</div>
    </>
  );
};

export default RadioGroup;
