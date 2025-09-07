/**
 * ---------------------------------
 * File: common.utils.js
 * Description:
 * This file contains utility functions used for various tasks across the application. 
 * It includes:
 * - A function for generating a 6-digit numeric OTP (One-Time Password).
 * - A function for retrieving the key of a given value from an object.
 * 
 * Author: Rameshware Marbate
 * Created On: May-07-2025
 * Updated On: May-07-2025
 * 
 * Notes:
 * - `generateOtp`: Generates a random 6-digit OTP that can be used for authentication or verification purposes.
 * - `getKeyByValue`: Helps to find the key in an object that corresponds to a given value.
 * ---------------------------------
 */

const moment = require("moment");

// Generate a 6-digit numeric OTP
const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};

// Get the key from an object that matches a given value
const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};
const getEnoExpiryDate = (expiryDate) => {
  const expiry = new Date(expiryDate);
  if (!expiryDate || isNaN(expiry.getTime())) return null;
  return moment(expiry).add(3, 'y').toDate();
};
const getStatusByExpiryDate = (expiryDate = '') => {
  const expiry = new Date(expiryDate);

  if (!expiryDate || isNaN(expiry.getTime())) return '';

  const today = new Date();
  const in60Days = moment(today).add(60, 'days').toDate();

  if (expiry < today) {
    return 'Expired';
  } else if (expiry <= in60Days) {
    return 'Expiring Soon';
  }

  return '';
};
const sanitizeDateFields = (obj, dateFields) => {
  const sanitized = { ...obj };
  for (const field of dateFields) {
    if (sanitized[field] === '') {
      sanitized[field] = null;
    }
  }
  return sanitized;
};
const getLicenseExpiryDate = (expiryDate) => {
  const expiry = new Date(expiryDate);
  if (!expiryDate || isNaN(expiry.getTime())) return null;
  return moment(expiry).add(2, 'y').toDate();
};
module.exports = {
  generateOtp,
  getKeyByValue,
  getEnoExpiryDate,
  getStatusByExpiryDate,
  sanitizeDateFields,
  getLicenseExpiryDate
};