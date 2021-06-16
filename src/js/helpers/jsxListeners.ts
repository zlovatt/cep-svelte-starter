import { addEventListener } from "cep-interface";
import Log from "../utils/log";

function logData(type: string, eventData: CSXSEvent) {
  Log[type]("[JSX]", ...eventData.data);
}

// JSX Log.x() listeners
addEventListener("JSX_LOG_DEBUG", (e: CSXSEvent) => {
  logData("debug", e);
});
addEventListener("JSX_LOG_TRACE", (e: CSXSEvent) => {
  logData("trace", e);
});
addEventListener("JSX_LOG_LOG", (e: CSXSEvent) => {
  logData("log", e);
});
addEventListener("JSX_LOG_WARN", (e: CSXSEvent) => {
  logData("warn", e);
});
addEventListener("JSX_LOG_ERROR", (e: CSXSEvent) => {
  logData("error", e);
});
addEventListener("JSX_LOG_EXCEPTION", (e: CSXSEvent) => {
  logData("exception", e);
});

// JSX console.x() listeners
addEventListener("JSX_CONSOLE_LOG", function (e: CSXSEvent) {
  console.log("[JSX]", ...e.data);
});
addEventListener("JSX_CONSOLE_WARN", function (e: CSXSEvent) {
  console.warn("[JSX]", ...e.data);
});
addEventListener("JSX_CONSOLE_ERROR", function (e: CSXSEvent) {
  console.error("[JSX]", ...e.data);
});
