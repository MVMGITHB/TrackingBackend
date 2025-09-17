// routes/logsRoute.js
import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const logDir = path.join(process.cwd(), "logs");


function parseLogFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  return content
    .split(/\r?\n/)
    .filter(line => line.trim().length > 0)
    .map(line => {
      const match = line.match(/^\[(.*?)\]\s+(\w+):\s+(.*)$/);
      if (match) {
        return {
          timestamp: match[1], // e.g. "2025-09-17 10:43:58"
          level: match[2],     // INFO, WARN, ERROR
          message: match[3]    // actual log message
        };
      }
      return { raw: line };
    });
}

// ✅ Route 1: Get logs by date
router.get("/byDate", (req, res) => {
  try {
    const { date } = req.query; // YYYY-MM-DD
    if (!date) {
      return res.status(400).json({ message: "Please provide a date (YYYY-MM-DD)" });
    }

    const fileName = `app-${date}.log`;
    const filePath = path.join(logDir, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: `No logs found for date ${date}` });
    }

    const logs = parseLogFile(filePath);
    res.json({ [fileName]: logs });
  } catch (err) {
    res.status(500).json({ message: "Error reading logs", error: err.message });
  }
});

// ✅ Route 2: Get logs by date + time range
router.get("/byDateRange", (req, res) => {
  try {
    const { date, start, end } = req.query; 
    // date = YYYY-MM-DD, start = HH:mm:ss, end = HH:mm:ss

    if (!date || !start || !end) {
      return res.status(400).json({
        message: "Please provide date, start, and end params. Example: ?date=2025-09-17&start=10:43:58&end=11:43:58"
      });
    }

    const fileName = `app-${date}.log`;
    const filePath = path.join(logDir, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: `No logs found for date ${date}` });
    }

    const logs = parseLogFile(filePath);

    // Filter by time range
    const filteredLogs = logs.filter(log => {
      if (!log.timestamp) return false;
      const logTime = log.timestamp.split(" ")[1]; // "10:43:58"
      return logTime >= start && logTime <= end;
    });

    res.json({ [fileName]: filteredLogs });
  } catch (err) {
    res.status(500).json({ message: "Error filtering logs", error: err.message });
  }
});



// all logs
router.get("/allLogs", (req, res) => {
  try {
    const { date } = req.query; // optional ?date=2025-09-17

    let files = fs.readdirSync(logDir).filter(f => f.endsWith(".log"));

    // If date is provided, only include that day’s log file
    if (date) {
      const fileName = `app-${date}.log`;
      files = files.filter(f => f === fileName);
      if (files.length === 0) {
        return res.status(404).json({ message: `No logs found for date ${date}` });
      }
    }

    let allLogs = {};

    files.forEach(file => {
      const filePath = path.join(logDir, file);
      const content = fs.readFileSync(filePath, "utf8");

      let logLines = content
        .split(/\r?\n/)
        .filter(line => line.trim().length > 0)
        .map(line => {
          const match = line.match(/^\[(.*?)\]\s+(\w+):\s+(.*)$/);
          if (match) {
            return {
              timestamp: match[1],  // "2025-09-17 10:43:58"
              level: match[2],      // INFO, WARN, ERROR
              message: match[3]     // log message
            };
          }
          return { raw: line };
        });

      // ✅ Sort logs by timestamp in descending order (latest first)
      logLines.sort((a, b) => {
        if (!a.timestamp || !b.timestamp) return 0;
        return b.timestamp.localeCompare(a.timestamp);
      });

      allLogs[file] = logLines;
    });

    res.json(allLogs);
  } catch (err) {
    res.status(500).json({ message: "Error reading logs", error: err.message });
  }
});



// List all log files
router.get("/files", (req, res) => {
  try {
    const files = fs.readdirSync(logDir).filter((f) => f.endsWith(".log"));
    res.json({ files });
  } catch (err) {
    res.status(500).json({ message: "Error listing log files", error: err.message });
  }
});

// Read a specific log file
router.get("/:file", (req, res) => {
  try {
    const filePath = path.join(logDir, req.params.file);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Log file not found" });
    }
    const content = fs.readFileSync(filePath, "utf8");
    res.type("text/plain").send(content);
  } catch (err) {
    res.status(500).json({ message: "Error reading log file", error: err.message });
  }
});

export default router;
