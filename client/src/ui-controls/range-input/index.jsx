import React, { useCallback, useEffect, useState, useRef } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
// import "./style.css";
import { getTestId } from "../../services/utils";

const RangeInput = ({
  id,
  min,
  max,
  minLabel,
  maxLabel,
  selectedMin,
  selectedMax,
  onChange,
  isDisabled,
  sliderStyle,
  thumbStyle,
  datatestid,
  textStyle,
  ...rest
}) => {
  const [minVal, setMinVal] = useState(selectedMin);
  const [maxVal, setMaxVal] = useState(selectedMax);
  const minValRef = useRef(null);
  const maxValRef = useRef(null);
  const range = useRef(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    setMinVal(selectedMin || 0);
    setMaxVal(selectedMax || 0);
  }, [selectedMin, selectedMax]);

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value); // Preceding with '+' converts the value from type string to type number

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);

  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        ref={minValRef}
        datatestid={getTestId(`${datatestid} min`)}
        onMouseUp={() => onChange({ min: minVal, max: maxVal })}
        onChange={(event) => {
          const value = Math.min(+event.target.value, maxVal - 1);
          setMinVal(value);
          event.target.value = value.toString();
        }}
        className={classnames(
          "disabled:opacity-50 thumb thumb--zindex-3",
          thumbStyle,
          {
            "thumb--zindex-5": minVal > max - 100,
          }
        )}
        disabled={isDisabled}
        {...rest}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        ref={maxValRef}
        datatestid={getTestId(`${datatestid} max`)}
        onMouseUp={() => onChange({ min: minVal, max: maxVal })}
        onChange={(event) => {
          const value = Math.max(+event.target.value, minVal + 1);
          setMaxVal(value);
          event.target.value = value.toString();
        }}
        className={classnames(
          "disabled:opacity-50 thumb thumb--zindex-4",
          thumbStyle
        )}
        disabled={isDisabled}
        {...rest}
      />

      <div className={classnames("slider", sliderStyle)}>
        <div className="slider-track" />
        <div ref={range} className="slider-range" />
        {minLabel && <div className="slider-left-value">{minLabel}</div>}
        {maxLabel && (
          <div className="slider-right-value">
            <span className={textStyle}>{maxLabel}</span>
          </div>
        )}
      </div>
    </>
  );
};

RangeInput.propTypes = {
  id: PropTypes.string,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  sliderStyle: PropTypes.string,
  thumbStyle: PropTypes.string,
  minLabel: PropTypes.string,
  maxLabel: PropTypes.string,
  selectedMin: PropTypes.number,
  selectedMax: PropTypes.number,
};

RangeInput.defaultProps = {
  id: "range-input",
  isDisabled: false,
  sliderStyle: "w-52",
  thumbStyle: "w-52",
  minLabel: "",
  maxLabel: "",
};

export default RangeInput;
