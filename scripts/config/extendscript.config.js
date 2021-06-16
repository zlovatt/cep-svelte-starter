const path = require("path");
const { createConfig } = require("cep-bundler-webpack");

const config = createConfig({
  out: path.join(__dirname, "../../dist"),
  type: "extendscript",
  entry: "./src/jsx/main.ts",
  isDev: process.env.NODE_ENV === "development"
});

module.exports = config;
