// utils/logger.js
import winston from "winston";
import "winston-daily-rotate-file";
import path from "path";

const logDir = path.join(process.cwd(), "logs");

// Daily rotate transport (creates a new file per day)
const transport = new winston.transports.DailyRotateFile({
  filename: "app-%DATE%.log",
  dirname: logDir,
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,  // compress old logs
  maxSize: "20m",       // max file size
  maxFiles: "14d"       // keep logs for 14 days
});

const logger = winston.createLogger({
  level: "info", // levels: error, warn, info, http, verbose, debug, silly
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      (info) => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console(), // show logs in terminal
    transport                        // write logs to files
  ]
});

export default logger;
