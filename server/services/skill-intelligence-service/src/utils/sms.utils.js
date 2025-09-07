/**
 * ---------------------------------
 * File: sms.utils.js
 * Description:
 * This file contains a function for sending SMS messages via the TextLocal API.
 * It validates the input data, prepares the request payload, and sends the SMS request 
 * to TextLocal using the Axios library. The function returns the API response or error 
 * in case of failure.
 * 
 * Key Features:
 * - **Validation**: Validates phone number format (Indian numbers) and checks for empty messages.
 * - **API Request**: Uses the TextLocal API for sending SMS with dynamic message and phone number.
 * - **Environment Variables**: Loads API details such as `SMS_API_KEY` and `SMS_SENDER` from environment variables for security.
 * 
 * Dependencies:
 * - `axios`: Library to make HTTP requests to external APIs.
 * - `qs`: Library for formatting data for URL-encoded requests.
 * - `dotenv`: Loads environment variables to securely manage configuration.
 * 
 * Author: Rameshware Marbate
 * Created On: May-07-2025
 * Updated On: May-07-2025
 * 
 * Notes:
 * - Requires environment variables like `SMS_API_KEY`, `SMS_SENDER` to work correctly.
 * - The mobile number must be in a valid format (Indian mobile numbers starting with 6-9).
 * - The function returns the response from the TextLocal API or an error if the request fails.
 * ---------------------------------
 */

const dotenv = require("dotenv");
dotenv.config();
const axios = require("axios");
const qs = require("qs");

async function sendSms(number, message) {
  try {
    // Load API details from environment variables
    const apiKey = process.env.SMS_API_KEY;
    const sender = process.env.SMS_SENDER;

    if (!apiKey) throw new Error("SMS API Key is missing!");
    if (!number || !/^[6-9]\d{9}$/.test(number)) throw new Error("Invalid mobile number.");
    if (!message || message.trim() === "") throw new Error("Message cannot be empty.");

    // Prepare the payload
    const data = qs.stringify({
      apikey: apiKey,
      message: message,
      sender: sender,
      numbers: "91" + number,
    });

    // Send SMS request
    const response = await axios.post("https://api.textlocal.in/send/", data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // Return API response
    return response.data;
  } catch (error) {
    console.error("SMS Error:", error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { sendSms };
