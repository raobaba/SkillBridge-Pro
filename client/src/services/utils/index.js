/**
 * --------------------------------------------------------
 * File        : utils.js
 * Description : Common utility functions used across the app for formatting,
 *               validation, token management, string parsing, and more.
 * Authors     : Developer team
 * Created On  : 2025-04-15
 * Updated On  : 2025-04-30
 * --------------------------------------------------------
 * Notes:
 * - Includes helpers like number formatting, date formatting, text width measurement.
 * - Provides token storage and retrieval using sessionStorage.
 * - Used globally for simplifying repetitive tasks.
 */

import moment from "moment";
import { find, trim } from "lodash";
import { TOKEN_KEY } from "../constants";

const getTestId = (text) => {
  if (text && typeof text === "string") {
    return text?.replace(/ /g, "_")?.toLowerCase();
  }
  return "";
};
const dateRangeFormat = (startDate, endDate) => {
  if (startDate && endDate) {
    let dateString = `${moment(startDate).format("MM.DD.YYYY")} - ${moment(
      endDate,
    ).format("MM.DD.YYYY")}`;
    return dateString;
  }
  return "";
};

const numberFormat = (number) => {
  if (number) {
    let formattedNumber = Number(number).toLocaleString();
    return formattedNumber;
  }
  return number;
};

const dateFormat = (date, format) => {
  if (date && format) {
    const newDate = new Date(date);
    if (newDate instanceof Date && !isNaN(newDate)) {
      let dateString = moment(newDate).format(format);
      return dateString;
    }
  }
  return "-";
};

const toISODateString = (date) => {
  if (date) {
    let dateString = new Date(moment(date).add(5.5, "h")).toISOString();
    return dateString;
  }
  return "";
};
const findElementByKey = (list = [], key, keyName) => {
  if (list && key) {
    let element = find(list, (item) => item[keyName] === key);
    return element || "";
  }
  return {};
};

function getTextWidth(text, font) {
  if (!text) {
    return 0;
  }
  // if given, use cached canvas for better performance
  // else, create new canvas
  var canvas =
    getTextWidth.canvas ||
    (getTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
}

const abbreviateNumber = (num, fixed) => {
  if (!num) {
    return "0";
  }
  num = num * 1;
  fixed = !fixed || fixed < 0 ? 0 : fixed; // number of decimal places to show
  var precisionPower = num.toPrecision(2).split("e"), // get power
    floorValue =
      precisionPower?.length === 1
        ? 0
        : Math.floor(Math.min(precisionPower[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
    decimalValue =
      floorValue < 1
        ? num.toFixed(0 + fixed)
        : (num / Math.pow(10, floorValue * 3)).toFixed(1 + fixed), // divide by power
    absoluteValue = decimalValue < 0 ? decimalValue : Math.abs(decimalValue), // enforce -0 is 0
    abbreviated = absoluteValue + ["", "K", "M", "B", "T"][floorValue]; // append power
  return abbreviated;
};

const abbreviateCount = (num, fixed) => {
  if (!num) {
    return "0";
  }
  num = num * 1;
  if (num > 99000) {
    return "99k+";
  }
  fixed = !fixed || fixed < 0 ? 0 : fixed; // number of decimal places to show
  var precisionPower = num.toPrecision(2).split("e"), // get power
    floorValue =
      precisionPower?.length === 1
        ? 0
        : Math.floor(Math.min(precisionPower[1].slice(1), 14) / 3), // floor at decimals, ceiling at trillions
    decimalValue =
      floorValue < 1
        ? num.toFixed(0 + fixed)
        : (num / Math.pow(10, floorValue * 3)).toFixed(1 + fixed), // divide by power
    absoluteValue = decimalValue < 0 ? decimalValue : Math.abs(decimalValue); // enforce -0 is 0
  let stringNum = absoluteValue?.toString()?.split(".")[0];
  let abbreviated = stringNum + ["", "K", "M", "B", "T"][floorValue]; // append power
  if (parseFloat(stringNum) < parseFloat(absoluteValue)) {
    return abbreviated + "+"; // append power
  } else {
    return abbreviated;
  }
};

function numberWithCommas(num = 0, type) {
  if (num === null) num = 0;
  num *= 1;
  if (type) {
    return num.toLocaleString("en-US");
  }
  return Math.round(num).toLocaleString("en-US");
}

const formatAmount = (value, type) => {
  let amount = numberWithCommas(value, type);
  return `$${amount || 0}`;
};

const getLastNameInitials = (text) => {
  if (text) {
    let data = `${text}`;
    data = data.split(" ");
    if (data.length === 2) {
      return `${data[1].charAt(0).toUpperCase()},${data[0]}`;
    } else if (data.length === 1) {
      return data;
    }
  }
  return "";
};

const setToken = (token) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(TOKEN_KEY, token);
  }
};

const getToken = () => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem(TOKEN_KEY);
    return token;
  }
  return "";
};
const validateEmail = (email) => {
  const pattern = new RegExp(
    /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
  );
  return pattern.test(email);
};

const validateName = (name) => {
  const pattern = new RegExp(/^[A-Za-z]+( [A-Za-z]+)*$/);
  return pattern.test(name);
};

const validateZipcode = (zipcode) => {
  const regex = /^[A-Za-z0-9]{3,9}$/;
  return regex.test(zipcode);
};

const formatIndianNumber = (num) => {
  return new Intl.NumberFormat("en-IN").format(num);
};
const getNameInitials = (text) => {
  if (text) {
    let data = `${text}`;
    data = data.split(" ");
    if (data.length === 2) {
      return `${data[0].charAt(0)}${data[1].charAt(0)}`;
    } else if (data.length === 1) {
      return data[0].charAt(0);
    }
  }
  return "";
};
const getItemsMargin = (itemLength = 0) => {
  if (window.innerHeight < 722) {
    if (itemLength === 1) {
      return "";
    } else if (itemLength === 2) {
      return "";
    } else if (itemLength === 3) {
      return "";
    } else if (itemLength === 4) {
      return "-mt-mbp-182";
    } else if (itemLength === 5) {
      return "-mt-mbp-215";
    } else if (itemLength > 5) {
      return "-mt-mbp-222";
    }
    return "";
  }
};
const isValidString = (str) => {
  return !/[~`!#$%()@^&*+=\\[\]\\';,/{}|\\":<>?]/g.test(str);
};

const formatInput = (input) => {
  // Remove non-digits
  const digits = input.replace(/\D/g, "").slice(0, 9);
  // Format as 111-222-333
  const parts = [];
  if (digits.length > 0) parts.push(digits.slice(0, 3));
  if (digits.length > 3) parts.push(digits.slice(3, 6));
  if (digits.length > 6) parts.push(digits.slice(6, 9));
  return parts.join("-");
};
const maskNumber = (value, hideLength = -4) => {
  const endDigits = value?.slice(hideLength);
  return endDigits?.padStart(value?.length, "*");
};

const capitalizeFirstLetter = (val) => {
  if (!trim(val)) {
    return "";
  }
  return String(val)?.charAt(0)?.toUpperCase() + String(val)?.slice(1);
};

export {
  getToken,
  getTextWidth,
  getTestId,
  numberFormat,
  dateRangeFormat,
  dateFormat,
  toISODateString,
  findElementByKey,
  formatAmount,
  numberWithCommas,
  abbreviateCount,
  abbreviateNumber,
  getLastNameInitials,
  getNameInitials,
  getItemsMargin,
  isValidString,
  validateEmail,
  validateName,
  setToken,
  formatInput,
  validateZipcode,
  maskNumber,
  capitalizeFirstLetter,
  formatIndianNumber,
};
