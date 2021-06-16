# ZL Svelte Template

Based on [cep-svelte-starter](https://github.com/Klustre/cep-svelte-starter) from [@klustre](https://github.com/Klustre).

---

# Features

## General Features:

- Automatically generates `manifest.xml` and `.debug`
- Supports multiple extensions in the extension bundle
- gulp-based build system
- Compile to jsxbin on `npm run build`
- Symlinks the panel to the extensions folder
- Sets the CSXS debug flags
- Watches files for changes & performs HMR (Hot Module Replacement)
- Extracts CSS from Svelte components to a single CSS file
- Console build process logging
- .env support in all src files

## JS Features:

- [Typescript](https://www.typescriptlang.org/docs) & [svelte](https://svelte.dev/docs)
- aescripts CEP framework integration
  - incl. shared, centralized prefs management
- Logging to file with standard ZL log methods
- Capture events dispatched from jsx
- Includes Adobe's [Spectrum CSS](https://github.com/adobe/spectrum-css)
- Debug in-browser with `npm run start:browser` instead of `npm run start`
- Automatic mangling of `obj["key"]`-style keys, for greater obfuscation & security

## JSX Features:

- [Typescript](https://www.typescriptlang.org/docs) & [aequery](https://www.npmjs.com/package/aequery)
- `console.log/warn/error` to print to debugger console
- `Log.debug/trace/info/warning/error/fatal` to print to console & log file
- Functions written to `$.global[Config.id]`
- Allows separate Extendscript files for each Adobe CC app
  - Use one extendscript.config.js per file, or:
  - in your `jsx/main.ts`, check hostapp and route to specific code for each.

---

# Getting Started

## Clone the starter with [Degit](https://github.com/Rich-Harris/degit).

This clones the repo without the whole Git history.

```bash
npx degit zlovatt/zl-template-svelte zlovatt-svelte-template
```

## Install dependencies

```bash
cd zlovatt-svelte-template
npm install
```

## Start the dev environment

```bash
npm start
```

## Mandatory edits

- `package.json` - Define CEP panel & general info
- `/src/` - Set up config / prefkey / everything
- `.env` - Set analytics code & CEP signing
  - See `.env.example` for reference

Find the extension under `Window > Extensions` and start developing 👍

---

# Troubleshooting

## 'undefined' svelte modules

Using any Svelte modules throws an error where the component is `undefined`. This is likely due to a double inclusion of `svelte/internal`.

Possible workarounds:

- **Import the module from `svelte/internal`**
  `import { createEventDispatcher } from 'svelte/internal'`
- **Remove the modules from Svelte after npm install**
  `"postinstall": "rimraf node_modules/svelte/*.mjs"`

_See https://github.com/sveltejs/svelte/issues/2896 and https://github.com/DeMoorJasper/parcel-plugin-svelte/issues/46#issuecomment-494556534_

## Configuring CEP-Bundler

`/scripts/config/panel.config.js` & `/scripts/config/extendscript.config.js`

_See [cep-bundler-core](https://github.com/adobe-extension-tools/cep-bundler-core)_
