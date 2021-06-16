const chalk = require("chalk");
const log = console.log;

/**
 * Splits a message by newlines, removing blanks
 *
 * @param {String} msg Message to format
 * @returns {String[]} Message lines array
 */
function formatMsg(msg) {
  if (typeof msg !== "string") {
    return [];
  }

  msg = msg.split(/\r|\n/);
  msg = msg.filter((item) => item !== "");

  return msg;
}

/**
 * Formats & logs an error to console
 *
 * @param {Error} err Error object
 * @param {String} [title] Message title
 */
function error(err, title) {
  title = title ? title + ": " : "";
  const msg = formatMsg(err.toString());

  msg.forEach((item) => {
    log(chalk.bold.red(`[${title}ERROR]`), item);
  });

  if (this.emit) {
    this.emit("end");
  }
}

/**
 * Formats & logs success to console
 *
 * @param {String} msg     Message to log
 * @param {String} [title] Message title
 */
function success(msg, title) {
  title = title ? title + ": " : "";
  msg = formatMsg(msg);

  msg.forEach((item) => {
    log(chalk.green(`[${title}SUCCESS]`), item);
  });
}

/**
 * Formats & logs warning to console
 *
 * @param {String} msg Message to log
 * @param {String} [title] Message title
 */
function info(msg, title) {
  title = title ? title + ": " : "";
  msg = formatMsg(msg);

  msg.forEach((item) => {
    log(chalk.yellow(`[${title}INFO]`), item);
  });
}

module.exports = {
  error,
  success,
  info
};
