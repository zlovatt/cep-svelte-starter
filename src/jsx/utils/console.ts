import dispatch from "./bridge";

function log(...args: any[]) {
  dispatch(args, "CONSOLE_LOG");
}

function warn(...args: any[]) {
  dispatch(args, "CONSOLE_WARN");
}

function error(...args: any[]) {
  dispatch(args, "CONSOLE_ERROR");
}

export default {
  log,
  warn,
  error
};
