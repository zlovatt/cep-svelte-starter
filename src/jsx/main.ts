import Config from "../config";
import Log from "./utils/log";
import explode from "./actions/explode";
import buildError from "./utils/buildError";

function runCommand() {
  Log.trace("→ runCommand");

  app.beginUndoGroup(Config.name + ": Do Something");

  let status: ESStatus;

  try {
    explode();
    status = { type: "success", msg: "Exploded successfully" };
  } catch (e) {
    status = {
      type: "error",
      msg: e.message,
      err: e.stack ? e : buildError("Uncaught error!", "main.ts", e)
    };
  } finally {
    app.endUndoGroup();
  }

  Log.trace("← runCommand");
  return JSON.stringify(status);
}

function appName() {
  return BridgeTalk.appName;
}

$.global[Config.id] = {
  runCommand,
  appName
};
