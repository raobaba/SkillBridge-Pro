import React, { createRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
// import "./style.css";
import {
  dateRangeFormat,
  dateFormat,
  toISODateString,
  findElementByKey,
  getTestId,
} from "../../services/utils";
import { datePickerEnum } from "../../services/constants";
import Label from "../label";
import Dropdown from "../dropdown";

let oneDay = 60 * 60 * 24 * 1000;
let inputRef = createRef();
const daysMap = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const getDateDetails = (date, years = []) => {
  let now = date ? new Date(date) : new Date();
  let currentYear = now.getFullYear();
  let currentMonth = now.getMonth();
  let selectedYear = findElementByKey(years, currentYear, "value");
  let leaves = (selectedYear && selectedYear.leaves) || [];
  let months = (selectedYear && selectedYear.months) || [];

  return {
    currentYear: { label: currentYear, value: currentYear, leaves, months },
    currentMonth,
  };
};
const Datepicker = ({
  id,
  placeholder,
  onChange,
  isDisabled,
  startDate,
  endDate,
  years = [],
  activeTab,
  inputStyle,
  isDropdownVisible,
  datatestid,
  ...rest
}) => {
  let { currentYear, currentMonth } = getDateDetails(startDate, years);
  let startTimestamp = startDate ? new Date(startDate).getTime() : "";
  let endTimestamp = endDate ? new Date(endDate).getTime() : "";

  const [year, setYear] = useState(currentYear);
  const months = year.months || [];
  const [month, setMonth] = useState({
    label: months?.length ? months[currentMonth].label : currentMonth,
    value: currentMonth,
  });

  const [monthDetails, setMonthDetails] = useState(null);
  const [currentStartDate, setStartDate] = useState(startTimestamp || null);
  const [currentEndDate, setEndDate] = useState(endTimestamp || null);
  const [focusOn, setFocus] = useState(activeTab);

  useEffect(() => {
    setMonthDetails(getMonthDetails(year.value, month.value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const onYearChange = (value) => {
    setYear(value);
  };
  const onMonthChange = (value) => {
    setMonth(value);
  };

  const isStartDate = (day) => {
    if (day.month !== 0) {
      return false;
    }
    return (
      dateFormat(day.timestamp, "MM-DD-YY") ===
      dateFormat(currentStartDate, "MM-DD-YY")
    );
  };
  const isEndDate = (day) => {
    if (day.month !== 0) {
      return false;
    }
    return (
      dateFormat(day.timestamp, "MM-DD-YY") ===
      dateFormat(currentEndDate, "MM-DD-YY")
    );
  };

  const hasHoliday = (day) => {
    let leaves = year.leaves || [];
    return leaves.some((date) => {
      let timestamp = new Date(dateFormat(date, "MM-DD-YY")).getTime();
      return (
        dateFormat(day.timestamp, "MM-DD-YY") ===
        dateFormat(timestamp, "MM-DD-YY")
      );
    });
  };

  const validateDate = (day) => {
    if (focusOn === datePickerEnum.startDate && currentEndDate) {
      if (
        dateFormat(day.timestamp, "MM-DD-YY") ===
        dateFormat(currentStartDate, "MM-DD-YY")
      ) {
        return false;
      }
      return day.timestamp > currentEndDate;
    } else if (focusOn === datePickerEnum.endDate && currentStartDate) {
      if (
        dateFormat(day.timestamp, "MM-DD-YY") ===
        dateFormat(currentEndDate, "MM-DD-YY")
      ) {
        return false;
      }
      return (
        day.timestamp +
          (Date.now() % oneDay) +
          new Date().getTimezoneOffset() * 1000 * 60 <=
        currentStartDate
      );
    }
    return false;
  };

  const getNumberOfDays = (year, month) => {
    return 42 - new Date(year, month, 42).getDate();
  };

  const getMonthDetails = (year, month) => {
    let firstDay = new Date(year, month).getDay();
    let numberOfDays = getNumberOfDays(year, month);
    let monthArray = [];
    let firstRow = [];
    let lastRow = [];
    let rows = month === 1 ? 6 : 7;
    let currentDay = null;
    let index = 0;
    let cols = 7;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        currentDay = getDayDetails({
          index,
          numberOfDays,
          firstDay,
          year,
          month,
        });
        if (row === 0) {
          firstRow = [...firstRow, currentDay];
        } else if (row === 6) {
          lastRow = [...lastRow, currentDay];
        } else {
          monthArray = [...monthArray, currentDay];
        }
        index++;
      }
      if (row === 0 && firstRow.some(({ date }) => date === 1)) {
        monthArray = [...firstRow, ...monthArray];
      } else if (row === 6 && lastRow.some(({ date }) => date >= 28)) {
        monthArray = [...monthArray, ...lastRow];
      }
    }
    return monthArray;
  };

  const getDayDetails = (args) => {
    let date = args.index - args.firstDay - 6;
    let day = args.index % 7;
    let prevMonth = args.month - 1;
    let prevYear = args.year;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear--;
    }
    let prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);
    let _date =
      (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;
    let month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
    let timestamp = new Date(args.year, args.month, _date).getTime();
    return {
      date: _date,
      day,
      month,
      timestamp,
      dayString: daysMap[day],
    };
  };

  const getDateFromDateString = (dateValue) => {
    let dateData = dateValue.split("-").map((d) => parseInt(d, 10));
    if (dateData?.length < 3) return null;

    let year = dateData[0];
    let month = dateData[1];
    let date = dateData[2];
    return { year, month, date };
  };

  const updateDateFromInput = () => {
    let dateValue = inputRef.current.value;
    let dateData = getDateFromDateString(dateValue);
    if (dateData !== null) {
      setMonthDetails(getMonthDetails(dateData.year, dateData.month - 1));
    }
  };

  const onDateClick = (day) => {
    const date = toISODateString(new Date(year.value, month.value, day.date));
    if (focusOn === datePickerEnum.startDate) {
      if (
        dateFormat(day.timestamp, "MM-DD-YY") ===
        dateFormat(currentStartDate, "MM-DD-YY")
      ) {
        setStartDate("");
        setOnChange({
          startDate: "",
          endDate: currentEndDate ? toISODateString(currentEndDate) : "",
          activeTab: focusOn,
        });
      } else {
        setStartDate(day.timestamp);
        setFocus(datePickerEnum.endDate);
        setOnChange({
          startDate: date,
          endDate: currentEndDate ? toISODateString(currentEndDate) : "",
          activeTab: datePickerEnum.endDate,
        });
      }
    } else if (focusOn === datePickerEnum.endDate) {
      if (
        dateFormat(day.timestamp, "MM-DD-YY") ===
        dateFormat(currentEndDate, "MM-DD-YY")
      ) {
        setEndDate("");
        setOnChange({
          startDate: currentStartDate ? toISODateString(currentStartDate) : "",
          endDate: "",
          activeTab: focusOn,
        });
      } else {
        setEndDate(day.timestamp);
        setOnChange({
          startDate: currentStartDate ? toISODateString(currentStartDate) : "",
          endDate: date,
          activeTab: focusOn,
        });
      }
    }
  };

  const setOnChange = (data) => {
    onChange && onChange(data);
  };

  const onStartDate = () => {
    if (currentStartDate) {
      let { currentYear, currentMonth } = getDateDetails(
        currentStartDate,
        years
      );
      setYear(currentYear);
      setMonth({
        label: months?.length ? months[currentMonth].label : currentMonth,
        value: currentMonth,
      });
    }
    setFocus(datePickerEnum.startDate);
  };

  const onEndDate = () => {
    if (currentEndDate) {
      let { currentYear, currentMonth } = getDateDetails(currentEndDate, years);
      setYear(currentYear);
      setMonth({
        label: months?.length ? months[currentMonth].label : currentMonth,
        value: currentMonth,
      });
    }
    setFocus(datePickerEnum.endDate);
  };
  /**
   *  Renderers
   */

  const renderCalendar = () => {
    let days =
      monthDetails &&
      monthDetails.map((day, index) => {
        let disabled = day.month !== 0 || validateDate(day) || hasHoliday(day);
        return (
          <div
            className={
              "c-day-container " +
              ((isStartDate(day) && focusOn === datePickerEnum.startDate) ||
              (isEndDate(day) && focusOn === datePickerEnum.endDate)
                ? " highlight-green"
                : "" + (disabled ? " disabled" : ""))
            }
            key={index}
            datatestid={getTestId(`${datatestid}${day.date}`)}
            status={disabled ? "disabled" : "enabled"}
          >
            <div className="cdc-day text-txt-10 text-black-500 font-light">
              <span
                className="dates"
                onClick={disabled ? () => {} : () => onDateClick(day)}
              >
                {day.date}
              </span>
            </div>
          </div>
        );
      });

    return (
      <div className="c-container">
        <div className="cc-head">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d, i) => (
            <div key={i} className="cch-name leading-leading-30 text-txt-10">
              {d}
            </div>
          ))}
        </div>
        <div className="cc-body">{days}</div>
      </div>
    );
  };

  var startContainer = classNames({
    "start-btn": true,
    "on-focus": focusOn === datePickerEnum.startDate,
    "off-focus": focusOn !== datePickerEnum.startDate,
  });

  var endContainer = classNames({
    "end-btn": true,
    "on-focus": focusOn === datePickerEnum.endDate,
    "off-focus": focusOn !== datePickerEnum.endDate,
  });

  let formatedDate = dateRangeFormat(currentStartDate, currentEndDate);
  return (
    <>
      {formatedDate ? (
        <div className="flex px-0 py-0 mb-2 justify-center">
          <Label
            lblStyle={"period-txt text-secondary-theme"}
            label={`Period: ${formatedDate}`}
          />
        </div>
      ) : null}
      <div className="hidden sm:block">
        <div className="relative mb-2 z-0 rounded-lg flex" aria-label="Tabs">
          <span
            datatestid={getTestId(`${datatestid} start date`)}
            onClick={() => onStartDate()}
            className={startContainer}
          >
            <span>Start Date</span>
          </span>

          <span
            datatestid={getTestId(`${datatestid} end date`)}
            onClick={() => onEndDate()}
            className={endContainer}
          >
            <span>End Date</span>
          </span>
        </div>
      </div>
      {isDropdownVisible ? (
        <div className="flex mb-1">
          <div className="dd-first">
            <Dropdown
              id="month"
              placeholder="Month"
              datatestid={getTestId(`${datatestid} month`)}
              status={isDisabled ? "disabled" : "enabled"}
              options={months}
              optionLabel="label"
              optionValue="value"
              onChange={onMonthChange}
              value={month}
              menuStyle="menu"
              isDisabled={isDisabled}
              mainStyle={"dropdown-main dd-first dp-cstm"}
              btnStyle={"text-xs text-black-500"}
              iconStyle={"text-gray-300"}
              itemStyle={"dp-m-items"}
            />
          </div>
          <Dropdown
            id="year"
            placeholder="Year"
            datatestid={getTestId(`${datatestid}  year`)}
            status={isDisabled ? "disabled" : "enabled"}
            options={years}
            optionLabel="label"
            optionValue="value"
            onChange={onYearChange}
            value={year}
            menuStyle="menu testing"
            isDisabled={isDisabled}
            mainStyle={"dropdown-main dp-cstm"}
            btnStyle={"text-xs text-black-500"}
            itemStyle={"dp-m-items"}
            iconStyle={"text-gray-300"}
            dropdownStyle={"w-4/5"}
          />
        </div>
      ) : null}
      <div className="grid">
        <div className="MyDatePicker">
          <div className="mdp-input" style={{ display: "none" }}>
            <input
              id={id}
              type="date"
              onChange={updateDateFromInput}
              ref={inputRef}
              placeholder={placeholder}
              disabled={isDisabled}
              className={classNames(inputStyle, "disabled:opacity-50")}
              {...rest}
            />
          </div>
          <div className="mdp-container">
            <div className="mdpc-body">{renderCalendar()}</div>
          </div>
        </div>
      </div>
    </>
  );
};

Datepicker.propTypes = {
  id: PropTypes.string,
  placeholder: PropTypes.string,
  startDate: PropTypes.any,
  endDate: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  years: PropTypes.array,
  inputStyle: PropTypes.string,
  isDropdownVisible: PropTypes.bool,
};

Datepicker.defaultProps = {
  id: "date-input",
  placeholder: "",
  isDisabled: false,
  inputStyle: "",
  years: [],
  isDropdownVisible: false,
};
export default Datepicker;
