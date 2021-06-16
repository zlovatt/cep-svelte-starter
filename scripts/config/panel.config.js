const path = require("path");
const { createConfig } = require("cep-bundler-webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");
const StringReplacePlugin = require("string-replace-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const pkg = require("../../package.json");

const isDev = process.env.NODE_ENV === "development";
const dest = path.join(__dirname, "..", "..", "dist");

const config = createConfig({
  type: "cep",
  id: pkg.cep.id,
  entry: "./src/js/main.ts",
  out: dest,
  isDev: isDev,
  devPort: process.env.DEV_PORT
});

if (process.env.BROWSER_DEBUG) {
  console.log("Starting panel in browser debug mode");
  config.target = "web";
  config.externals = undefined;
}

config.resolve.mainFields = ["svelte", "browser", "module", "main"];
config.resolve.extensions = [".mjs", ".js", ".ts", ".svelte"];
config.resolve.alias = {
  svelte: path.resolve(__dirname, "..", "..", "node_modules", "svelte")
};

config.module.rules = [
  {
    test: /\.(png|svg|jpg|gif)$/,
    use: ["file-loader"]
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/,
    use: ["file-loader"]
  },
  {
    test: /\.(html|svelte)$/,
    exclude: /node_modules/,
    use: {
      loader: "svelte-loader-hot",
      options: {
        dev: isDev,
        emitCss: true,
        hotReload: true,
        preprocess: require("svelte-preprocess")({})
      }
    }
  },
  {
    // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
    test: /\.tsx?$/,
    use: [
      {
        loader: StringReplacePlugin.replace({
          replacements: [
            {
              pattern: /\[("[^"]*")]/g,
              replacement: function (match, p1, offset, string) {
                return `[/* @mangle */${p1}/* @/mangle */]`;
              }
            }
          ]
        })
      },
      "gnirts-loader",
      "ts-loader"
    ]
  },
  {
    test: /\.css$/,
    use: [!isDev ? MiniCssExtractPlugin.loader : "style-loader", "css-loader"]
  },
  {
    // Fixes reexport errors when importing Svelte methods
    // i.e. `onMount`, `createEventDispatcher`, etc
    // -> `Can't reexport the named export 'XYZ' from non EcmaScript module`
    test: /\.(mjs)$/,
    include: /node_modules/,
    type: "javascript/auto"
  }
];

config.plugins.push(
  new MiniCssExtractPlugin({
    filename: "[name].css"
  }),
  new WriteFilePlugin({
    test: /(dialog|custom)\/.+/
  }),
  new Dotenv(),
  new StringReplacePlugin()
);

config.output = {
  path: dest,
  filename: "[name].js",
  chunkFilename: "[name].[id].js"
};

module.exports = config;
