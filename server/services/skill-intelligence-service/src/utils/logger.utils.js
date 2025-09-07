/**
 * ---------------------------------
 * File: logger.utils.js
 * Description:
 * This file configures and exports logging mechanisms using `morgan` and `winston` for an Express application.
 * It handles both HTTP access logs and application-level logs (info, errors).
 * - `morgan` is used for logging HTTP requests and responses.
 * - `winston` is used for logging application events with rotating log files for error and combined logs.
 * 
 * Functionality:
 * - **Access Logs**: Managed by `morgan`, which logs HTTP request details to a rotating file every day.
 * - **Error Logs**: Managed by `winston`, which creates a new error log file daily, keeping the last 30 days of logs.
 * - **Combined Logs**: `winston` also logs combined information (info and above) to a rotating file with the same retention policy.
 * 
 * Dependencies:
 * - `morgan`: HTTP request logging middleware for Express.
 * - `winston`: A versatile logging library for node.js.
 * - `winston-daily-rotate-file`: A transport for rotating log files with `winston`.
 * - `rotating-file-stream`: A library for managing log file rotation with customizable intervals.
 * - `path`, `fs`: Node.js utilities for file and directory management.
 * 
 * Author: Rameshware Marbate
 * Created On: May-07-2025
 * Updated On: May-07-2025
 * 
 * Notes:
 * - The log directory is created if it does not already exist.
 * - Logs are saved to a directory named `log` located two levels above the current file's directory.
 * - The logging setup includes:
 *     - `dev`: Logs in the 'dev' format for development.
 *     - `combined`: Logs all HTTP requests to rotating files.
 *     - `logger`: A custom Winston logger for combined and error-level logs.
 * ---------------------------------
 */



const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const path = require('path');
const fs = require('fs');
const winston = require("winston");
require("winston-daily-rotate-file");

// Define log directory path
const logDirectory = path.resolve(__dirname, '../../log');

// Ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Create a rotating write stream for access logs (handled by morgan)
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
})

// Create a rotating transport for error logs (handled by winston)
const errorTransport = new winston.transports.DailyRotateFile({
    filename: path.join(logDirectory, "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxFiles: "30d",
    level: "error",
});

// Create a rotating transport for combined logs (info and higher levels)
const combinedTransport = new winston.transports.DailyRotateFile({
    filename: path.join(logDirectory, "combined-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxFiles: "30d",
});

// Create Winston logger with formatting and transports
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}] ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        combinedTransport,
        errorTransport,
    ],
});

// Export morgan middlewares and the winston logger
module.exports = {
    dev: morgan('dev'),
    combined: morgan('combined', { stream: accessLogStream }),
    logger
}