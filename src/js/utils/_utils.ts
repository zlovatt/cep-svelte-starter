import { getHostEnvironment } from "cep-interface";

import Config from "../../config";
import PrefKey from "../../prefKey";

import Prefs from "./prefs";
import Log from "./log";

let fs = null;
let path = null;

if (!process.env.BROWSER_DEBUG) {
  fs = require("fs");
  path = require("path");
}

/**
 * Builds a date string in format YYYYMMDD
 *
 * @returns YYYYMMDD
 */
function buildDateString(): string {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();

  const formattedmm = (mm < 10 ? "0" : "") + mm;
  const formatteddd = (dd < 10 ? "0" : "") + dd;

  return `${yyyy.toString()}${formattedmm.toString()}${formatteddd.toString()}`;
}

/**
 * Builds a time string in format HHMMSS
 *
 * @returns HHMMSS
 */
function buildTimeString(): string {
  const date = new Date();
  const hh = date.getHours();
  const mm = date.getMinutes();
  const ss = date.getSeconds();

  const formattedmm = (mm < 10 ? "0" : "") + mm;
  const formattedss = (ss < 10 ? "0" : "") + ss;

  return `${hh.toString()}${formattedmm.toString()}${formattedss.toString()}`;
}

/**
 * Returns `true` if argument is null or undefined, false otherwise
 *
 * @param o The value to check
 * @return  Whether item is null or undefined
 */
function isNullOrUndefined(o: any): o is undefined {
  // Using truthiness to capture both 'undefined' and 'null'
  return o == null;
}

/**
 * Used for setting the default value in functions. Returns the first argument
 * is not undefined, else it returns `defaultVal`.
 *
 * @param value      The value to check
 * @param defaultVal The value to use if `value` is `undefined`
 * @return           `value` if it is not `undefined`, else `defaultVal`
 */
function setDefault(value: any, defaultVal: any): any {
  return typeof value == "undefined" ? defaultVal : value;
}

/**
 * Checks last used AE/tool/licenses vs current
 */
function checkVersions() {
  Log.trace("→ checkVersions");

  const hostEnv = getHostEnvironment();

  const versionsMatch = Prefs.get(PrefKey.Utils.LastVersion) === Config.version;
  const aeVersionsMatch =
    Prefs.get(PrefKey.Utils.LastAEVersion) === hostEnv.appVersion;

  if (!versionsMatch || !aeVersionsMatch) {
    Log.log(
      "AE v" + hostEnv.appVersion + " - " + Config.name + " v" + Config.version
    );
    Prefs.set(PrefKey.Utils.LastVersion, Config.version);
    Prefs.set(PrefKey.Utils.LastAEVersion, hostEnv.appVersion);
  }

  Log.trace("← checkVersions");
}

function recursiveMakeDir(dir: string) {
  if (process.env.BROWSER_DEBUG) {
    return;
  }

  if (fs.existsSync(dir)) {
    return true;
  }

  const dirname = path.dirname(dir);
  recursiveMakeDir(dirname);
  fs.mkdirSync(dir);
}

function ensurePathExists(filePath) {
  if (fs.existsSync(filePath)) {
    return;
  }

  recursiveMakeDir(filePath);
}

export {
  buildDateString,
  buildTimeString,
  isNullOrUndefined,
  setDefault,
  checkVersions,
  ensurePathExists
};
