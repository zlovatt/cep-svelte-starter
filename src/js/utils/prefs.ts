import Config from "../../config";
import { ensurePathExists, isNullOrUndefined } from "./_utils";
import Log from "./log";

let fs = null;
let path = null;

if (!process.env.BROWSER_DEBUG) {
  fs = require("fs");
  path = require("path");
}

/**
 * Gets prefs file path
 *
 * @returns Prefs file path
 */
function getPrefsFilePath(): string {
  return path.join(Config.globals.resourcePath, `${Config.name} Settings.json`);
}

/**
 * Ensures prefs dir and path exist
 */
function ensurePrefsExists() {
  const prefsFilePath = getPrefsFilePath();
  const prefsDir = path.dirname(prefsFilePath);

  ensurePathExists(prefsDir);

  if (!fs.existsSync(prefsFilePath)) {
    fs.appendFileSync(prefsFilePath, JSON.stringify({}));
  }
}

/**
 * Gets preferences data from file
 *
 * @returns Preferences data
 */
function getPrefsData(): Object {
  ensurePrefsExists();

  const prefsFilePath = getPrefsFilePath();
  const prefsFileData = fs.readFileSync(prefsFilePath, "utf8");

  return JSON.parse(prefsFileData);
}

/**
 * Sets preferences data from object
 *
 * @param data Prefs data to write
 */
function setPrefsData(data: Object) {
  ensurePrefsExists();

  const prefsFilePath = getPrefsFilePath();
  fs.writeFileSync(prefsFilePath, JSON.stringify(data, undefined, 2), "utf8");
}

/**
 * Sets prefs value
 *
 * @param key     Pref key
 * @param val     Pref value to set
 * @param options Prefs options to use
 * @returns       Pref value as string
 */
function set(key: string, val: any, options?: PrefsOptions): string {
  if (process.env.BROWSER_DEBUG) {
    console.warn("Browser mode! Can't set prefs.");
    return;
  }

  const log = options ? options.log : undefined;

  if (log) {
    Log.trace(`Prefs.set: ${key} to ${val ? val.toString() : "INVALID VALUE"}`);
  }

  if (isNullOrUndefined(val)) {
    const errMsg = `Prefs.set: Missing value for '${key}'`;
    console.error(errMsg);
    throw errMsg;
  }

  const prefsData = getPrefsData();
  prefsData[key] = val;
  setPrefsData(prefsData);

  return val;
}

/**
 * Gets a prefs value
 *
 * @param key     Pref key
 * @param options Prefs options to use
 * @returns       Pref value
 */
function get(key: string, options?: PrefsOptions): any {
  if (process.env.BROWSER_DEBUG) {
    console.warn(`Browser mode! Getting default for ${key}`);
    return Config.defaults[key];
  }

  const log = options ? options.log : undefined;

  if (log) {
    Log.trace(`Prefs.get: '${key}'`);
  }

  const prefsData = getPrefsData();
  const val = prefsData[key];

  if (isNullOrUndefined(val)) {
    const newVal = set(key, Config.defaults[key], options);
    return newVal;
  }

  return val;
}

/**
 * Gets object of all prefs
 *
 * @returns Object of all prefs
 */
function getAll(): any {
  let prefsObj: any = {};

  for (let key in Config.defaults) {
    if (!Config.defaults.hasOwnProperty(key)) {
      continue;
    }

    prefsObj[key] = get(key, {
      log: false
    });
  }

  return prefsObj;
}

/**
 * Deletes a preference
 *
 * @param key Pref key
 * @param options Prefs options to use
 */
function remove(key: string, options?: PrefsOptions) {
  const log = options ? options.log : undefined;

  if (log) {
    Log.trace(`Prefs.remove: '${key}'`);
  }

  const prefsData = getPrefsData();
  delete prefsData[key];
  setPrefsData(prefsData);
}

/**
 * Removes all default prefs
 */
function removeAll() {
  try {
    Log.log(JSON.stringify(getAll()));
  } catch (e) {
    Log.error("Error dumping prefs... continuing to remove.");
  }

  setPrefsData({});
}

/**
 * @param key     Pref key
 * @param options Prefs options to use
 * @returns       Pref default value as string
 */
function reset(key: string, options?: PrefsOptions): string {
  Log.trace(`Prefs.reset: '${key}'`);

  set(key, Config.defaults[key], options);

  return get(key, options);
}

/**
 * Resets all prefs to default value
 *
 * @param options Prefs options to use
 */
function resetAll(options?: PrefsOptions) {
  for (let key in Config.defaults) {
    if (Config.defaults.hasOwnProperty(key)) {
      reset(key, options);
    }
  }
}

export default {
  getPrefsFilePath,

  set,
  get,
  getAll,

  remove,
  removeAll,

  reset,
  resetAll
};
