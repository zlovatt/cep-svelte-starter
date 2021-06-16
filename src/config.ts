const pkg = require("../package.json");
const path = require("path");

// Shared config between hosts
const Config = {
  name: pkg.cep.name,
  version: pkg.version,
  id: pkg.cep.id,

  defaults: {
    userDebug: false,
    lastVersion: "0.0.0",
    lastAEVersion: ""
  } as any,

  globals: {
    debug: process.env.NODE_ENV === "development",
    resourcePath: path.join(
      process.env.APPDATA || process.env.HOME + "/Library/Application Support",
      "aescripts",
      pkg.cep.name
    ),
    logMaxSize: 5000000
  }
};

export default Config;
