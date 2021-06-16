import dispatch from "./bridge";

function debug(...args: any[]) {
  dispatch(args, "LOG_DEBUG");
}

function trace(...args: any[]) {
  dispatch(args, "LOG_TRACE");
}

function log(...args: any[]) {
  dispatch(args, "LOG_LOG");
}

function warn(...args: any[]) {
  dispatch(args, "LOG_WARN");
}

function error(...args: any[]) {
  dispatch(args, "LOG_ERROR");
}

function exception(...args: any[]) {
  dispatch(args, "LOG_EXCEPTION");
}

export default {
  debug,
  trace,
  log,
  warn,
  error,
  exception
};
