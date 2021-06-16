import * as csInterface from "cep-interface";
import * as path from "path";

// Load JSX event listeners
import "./actions/jsxListeners";

if (process.env.NODE_ENV !== "production") {
  const bundle = require("!!raw-loader!../../dist/extendscript.js");
  csInterface.evalExtendscript(bundle.default);
} else {
  const __dirname = csInterface.getSystemPath("extension");
  const extensionPath = csInterface.getExtensionPath();
  const jsxbinPath = path.join(__dirname, "extendscript.jsxbin");

  csInterface.evalExtendscript(
    [
      `$.global.extensionPath = ${JSON.stringify(extensionPath)};`,
      `$.evalFile(${JSON.stringify(jsxbinPath)})`
    ].join("\n")
  );
}
