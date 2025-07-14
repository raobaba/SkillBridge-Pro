const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const path = require('path');
const fs = require('fs');
const winston = require("winston");
require("winston-daily-rotate-file");

const logDirectory = path.resolve(__dirname, '../../log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
})

const errorTransport = new winston.transports.DailyRotateFile({
    filename: path.join(logDirectory, "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxFiles: "30d", // Keep logs for 30 days
    level: "error",
});

const combinedTransport = new winston.transports.DailyRotateFile({
    filename: path.join(logDirectory, "combined-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxFiles: "30d",
});

// Create Winston logger
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}] ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(), // Log to console
        combinedTransport, // Save all logs
        errorTransport, // Save errors separately
    ],
});


module.exports = {
    dev: morgan('dev'),
    combined: morgan('combined', { stream: accessLogStream }),
    logger
}