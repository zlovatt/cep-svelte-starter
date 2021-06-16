import Config from "../../config";
import PrefKey from "../../prefKey";
import { buildDateString, buildTimeString, ensurePathExists } from "./_utils";
import Prefs from "./prefs";

let fs = null;
let cp = null;
let path = null;

if (!process.env.BROWSER_DEBUG) {
  fs = require("fs");
  cp = require("child_process");
  path = require("path");
}

let level = 2;
const levelsMap = ["debug", "trace", "log", "warn", "error", "exception"];

/**
 * Formats log text; writes to console if debug, writes to file
 *
 * @param logLevel Log level to log
 * @param content  Log content
 * @returns        Formatted log line
 */
function _log(logLevel: 0 | 1 | 2 | 3 | 4 | 5, content: any[]): string {
  if (logLevel < getLevel()) {
    return "";
  }

  printData(logLevel, content);

  content = content.map((item) =>
    typeof item === "string" ? item : JSON.stringify(item)
  );

  const timeStr = buildDateString() + "." + buildTimeString();
  const line = [levelsMap[logLevel], timeStr, ...content].join(" :: ");

  const logFilePath = getLogFilePath();

  if (!fs.existsSync(logFilePath)) {
    clear();
  }

  let logContents = fs.readFileSync(logFilePath);

  if (logContents.length > Config.globals.logMaxSize) {
    clear();
  }

  fs.appendFileSync(logFilePath, `${line}\n`, (err: Error) => {
    if (err) {
      const errMsg = `Could not write log... ${logFilePath.toString()} - ${err.toString()}`;
      console.error(errMsg);
      throw err;
    }

    console.log("Write to log successfully");
  });

  return line;
}

/**
 * Logs data to console
 *
 * @param logLevel Log level to log
 * @param header   Log line header
 * @param content  Content to log
 */
function printData(logLevel: 0 | 1 | 2 | 3 | 4 | 5, content: any[]) {
  if (logLevel < getLevel()) {
    return;
  }

  console[levelsMap[logLevel]](...content);
}

/**
 * Gets log file path
 *
 * @returns Log file path
 */
function getLogFilePath(): string {
  ensurePathExists(Config.globals.resourcePath);
  return path.join(Config.globals.resourcePath, `${Config.name} Log.txt`);
}

/**
 * Sets the logging level to parameter
 *
 * @param logLevel New logging level
 * @returns        New level value
 */
function setLevel(logLevel: number): number {
  level = logLevel;
  return level;
}

/**
 * Gets the logging level
 * @returns Level value
 */
function getLevel(): number {
  return level;
}

/**
 * Reveals the log file in Finder/Explorer
 */
function reveal() {
  const logFilePath = getLogFilePath();
  cp.spawn("open", [logFilePath]);
}

/**
 * Wipes the log file
 */
function clear() {
  const logFilePath = getLogFilePath();
  fs.appendFileSync(logFilePath, "");
}

/**
 * Sets log level based on global debug pref, or user debug pref
 * Sets the logging level to 0 ('debug') if debug mode, else 2 ('log')
 */
function initLevel() {
  setLevel(Config.globals.debug || Prefs.get(PrefKey.Utils.UserDebug) ? 0 : 2);
}

/**
 * Logs as debug, used for weird, techy, archaic stuff
 *
 * @param content Content to log
 * @returns       Formatted log line
 */
function debug(...content: any[]): string {
  return _log(0, content);
}

/**
 * Logs as trace, used to follow data flow.
 * warning: VERY verbose
 *
 * @param content Content to log
 * @returns       Formatted log line
 */
function trace(...content: any[]): string {
  return _log(1, content);
}

/**
 * Logs as log, used for... general stuff
 *
 * @param content Content to log
 * @returns       Formatted log line
 */
function log(...content: any[]): string {
  return _log(2, content);
}

/**
 * Logs as warn, used for non-blocking errors or potential issues
 *
 * @param content Content to log
 * @returns       Formatted log line
 */
function warn(...content: any[]): string {
  return _log(3, content);
}

/**
 * Logs as error, used for... errors
 *
 * @param content Content to log
 * @returns       Formatted log line
 */
function error(...content: any[]): string {
  return _log(4, content);
}

/**
 * Logs as exception, used for BIG PROBLEMS
 *
 * @param content Content to log
 * @returns       Formatted log line
 */
function exception(...content: any[]): string {
  return _log(5, content);
}

export default {
  getLogFilePath,

  levelsMap,

  setLevel,
  getLevel,
  reveal,
  clear,
  initLevel,

  debug,
  trace,
  log,
  warn,
  error,
  exception
};
