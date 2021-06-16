const aeq: AEQuery = require("aequery");

/**
 * Builds an error message from info
 *
 * @param msg      Custom error message
 * @param fileName Filename the error occurred in
 * @param err      Original error
 * @returns        Formatted error message
 */
export default function buildError(
  msg: string,
  fileName: string,
  err?: ESError
): ZLError {
  /**
   * Gets stack data
   * @returns {String} Stack data
   */
  function getStack() {
    let stack = aeq.arrayEx($.stack.split("\n"));
    stack.length -= 3;

    return stack
      .filter(function (line) {
        return line.indexOf("anonymous()") === -1;
      })
      .join(" >> ");
  }

  fileName = aeq.setDefault(
    fileName,
    File.decode($.fileName).replace(/^.*[\|\/]/, "")
  );

  const regexTest = /[^\\|^\/]*$/g.exec(fileName);

  if (regexTest) {
    fileName = regexTest[0];
  }

  if (aeq.isNullOrUndefined(fileName)) {
    fileName = "";
  }

  let errorObj: ZLError = {
    message: msg,
    file: fileName,
    stack: getStack()
  };

  if (err) {
    errorObj.error = `${err.name}: ${err.description}`;
  }

  return errorObj;
}
