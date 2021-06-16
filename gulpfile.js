require("dotenv").config();

const argv = require("yargs").argv;
const concat = require("gulp-concat");
const del = require("del");
const { spawn, execSync } = require("child_process");
const fs = require("fs");
const gulp = require("gulp");
const gulpWebpack = require("webpack-stream");
const os = require("os");
const path = require("path");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const zxpSignCmd = require("zxp-sign-cmd");

const SCRIPTS_DIR = "./scripts";
const CONFIG_DIR = `${SCRIPTS_DIR}/config`;
const CERT_DIR = `${SCRIPTS_DIR}/_temp`;
const DIST_DIR = "./dist";
const PACKAGE_DIR = "./release";

const Log = require(`${SCRIPTS_DIR}/log`);

const pkg = require("./package.json");

const RELEASE_NAME = `${pkg.name}-${pkg.version}`;
const RELEASE_DIR = `${PACKAGE_DIR}/${RELEASE_NAME}`;
const RELEASE_PATH = `${RELEASE_DIR}/${RELEASE_NAME}.zxp`;

// Webpack config paths
const devPort = 8080;
const jsxConfigPath = `${CONFIG_DIR}/extendscript.config`;
const cepConfigPath = `${CONFIG_DIR}/panel.config`;

// CEP Info
const cepVersion = 9;
const cefClientPath = path.resolve(
  `D:/Work/Dropbox/Projects/Scripts/_Etc/CEP/CEP_${cepVersion}/cefclient/`
);

const certOptions = {
  // The country associated with the certificate
  country: process.env.CEP_SIGN_COUNTRY,

  // The state or province associated with the certificate
  province: process.env.CEP_SIGN_PROVINCE,

  // The organization associated with the certificate
  org: process.env.CEP_SIGN_ORG,

  // The commonName for the certificate
  name: process.env.CEP_SIGN_NAME,

  // The password for the certificate
  password: process.env.CEP_SIGN_PASSWORD,

  // The path that the certificate will be exported to
  output: `${CERT_DIR}/cert.p12`
};

// Set env vars
const launch = argv.launch || false;
const browser = argv.browser || false;
if (browser) {
  process.env.BROWSER_DEBUG = 1;
}
process.env.DEV_PORT = devPort;

/******* RELEASE MODE *******/
function createCert() {
  Log.info("Creating cert...", "createCert");

  return zxpSignCmd.selfSignedCert(certOptions, function (error, result) {
    if (error) {
      Log.error(error, "createCert");
      return;
    }

    Log.success(`Cert successfully created: ${result}`, "createCert");
    resolve(result);
  });
}

async function signPackage(cb) {
  if (!fs.existsSync(certOptions.output)) {
    await createCert();
  }

  Log.info("Waiting for build to finish...", "signPackage");

  await new Promise((resolve) => setTimeout(resolve, 15000));

  Log.info("Done waiting!", "signPackage");

  zxpSignCmd.sign(
    {
      input: DIST_DIR,
      output: RELEASE_PATH,
      cert: certOptions.output,
      password: certOptions.password
    },
    (error, result) => {
      if (error) {
        Log.error(error, "signPackage");
        return;
      }

      Log.success(result, "signPackage");
      cb();
    }
  );
}

gulp.task("build:jsx", function () {
  const config = require(jsxConfigPath);

  return gulp
    .src(["./src/jsx/main.ts"])
    .pipe(gulpWebpack(config))
    .pipe(gulp.dest("dist/"));
});

gulp.task("build:cep", function () {
  const config = require(cepConfigPath);

  return gulp
    .src(["./src/js/main.ts"])
    .pipe(gulpWebpack(config))
    .pipe(gulp.dest("dist/"));
});

/** Shitty workaround for Windows */
gulp.task("export:jsxbin", (cb) => {
  var vscExtFolderPath = path.join(os.homedir(), ".vscode", "extensions");

  var vscodeExtFolder = fs
    .readdirSync(vscExtFolderPath)
    .filter((x) => x.indexOf("adobe.extendscript-debug") > -1);
  if (vscodeExtFolder.length <= 0) {
    Log.error("VS Code ExtendScript Extension not Installed", "export:jsxbin");
    throw new Error("### VS Code ExtendScript Extension not Installed");
  }

  var jsxbinExporter = path.join(
    vscExtFolderPath,
    vscodeExtFolder.pop(),
    "public-scripts",
    "exportToJSX.js"
  );

  const sourceES = `${DIST_DIR}/extendscript.js`;

  execSync(`node "${jsxbinExporter}" -n "${sourceES}"`, {
    encoding: "UTF-8"
  });

  del(`${DIST_DIR}/extendscript.js`);

  Log.success("Copied jsxbin(s)!", "export:jsxbin");
  cb();
});

/******* DEV MODE *******/
gulp.task("watch:jsx", function () {
  const config = require(jsxConfigPath);

  return gulp
    .src(["./src/jsx/main.ts"])
    .pipe(
      gulpWebpack({
        watch: true,
        config
      })
    )
    .pipe(gulp.dest("dist/"));
});

async function watchCEP(cb) {
  const config = require(cepConfigPath);
  await new Promise((resolve) => setTimeout(resolve, 5000));

  new WebpackDevServer(webpack(config), {
    stats: {
      colors: true
    },
    contentBase: path.join(__dirname, "dist"),
    publicPath: "/",
    port: devPort,
    hot: true
  }).listen(devPort, "localhost", function (err) {
    if (err) {
      Log.error(err, "watchCEP");
      return;
    }

    launchDebugger();
    Log.success(`CEP watching at: http://localhost:${devPort}`, "watchCEP");
  });

  cb();
}

function launchDebugger() {
  if (!launch) {
    return;
  }

  let launchCmd;

  if (browser) {
    launchCmd = spawn("start", [`http://localhost:${devPort}`], {
      shell: true,
      detached: true,
      stdio: "ignore"
    });
  } else {
    launchCmd = spawn("cefclient", ["--url=localhost:3007"], {
      cwd: cefClientPath,
      shell: true,
      detached: true,
      stdio: "ignore"
    });
  }

  launchCmd.unref();
}

/******* ENTRY *******/
function logStatus(cb) {
  Log.info("ENV: " + process.env.NODE_ENV);
  Log.info("DEVPORT: " + devPort);
  Log.info("LAUNCH: " + launch);
  Log.info("BROWSER: " + browser);

  cb();
}

function clean(cb) {
  del.sync([CERT_DIR, DIST_DIR, RELEASE_DIR], {
    force: true
  });

  cb();
}

gulp.task("reset", gulp.series(logStatus, clean));

gulp.task(
  "default",
  gulp.series("reset", gulp.parallel("watch:jsx", watchCEP))
);

gulp.task(
  "build",
  gulp.series("reset", "build:jsx", "build:cep", "export:jsxbin", signPackage)
);
