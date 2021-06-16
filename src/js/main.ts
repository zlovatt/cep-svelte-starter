import App from "./app/App.svelte";
import Prefs from "./utils/prefs";
import PrefKey from "../prefKey";
import Config from "../config";
import Log from "./utils/log";

if (!process.env.BROWSER_DEBUG) {
  require("./extendscript");

  const { checkVersions } = require("./utils/_utils");

  if (Prefs.get(PrefKey.Utils.UserDebug)) {
    Config.globals.debug = true;
  }

  Log.initLevel();
  checkVersions();
}

require("@adobe/spectrum-css/dist/icons/loadIcons")(
  "node_modules/@adobe/spectrum-css/dist/icons/spectrum-css-icons-medium.svg"
);

const app = new App({
  target: document.body
});

window["app"] = app;

export default app;
