/* c8 ignore start */
import chokidar from "chokidar";
import os from "os";
import fs from "fs";
import { resolve } from "path";
const cwd = process.cwd();

export const watch = (uri, event, timeout = 65) => {
  let lock = false;
  const fn = async () => {
    if (lock) {
      return;
    }
    lock = true;
    await Promise.resolve(event());
    setTimeout(() => {
      lock = false;
    }, timeout);
  };

  if (/(darwin|window)/.test(os.type().toLowerCase())) {
    chokidar.watch(uri).on("all", fn);
    if (fs.statSync(uri).isDirectory()) {
      fs.watch(uri, { recursive: true }, fn);
    } else {
      fs.watchFile(uri, fn);
    }
  } else {
    chokidar.watch(uri).on("all", fn);
  }
};

function fixName(p = "") {
  p = p.replace(/\./g, "");
  p = p.replace(/-/g, "_");
  p = p.replace(/\//g, "_");
  return p;
}

function makeApiCode() {
  return `/* eslint-disable */
// ---- Code generated by svelte-zero-api, CAN EDIT IT.

import { createZeroApi } from 'svelte-zero-api';
import type onWatch from 'svelte-zero-api/onWatch';

export const zeroApi = createZeroApi<typeof onWatch>({
	baseUrl: void 0,
	// get or post use memo cache time(ms)
	cacheTime: 0,
	// if have error, you can do someting
	onError: async (err) => {
		console.error('[svelte-zero-api]', err);
	}
});

  `;
}

function updateAPI(realPath = "", watchPath) {
  const fixRealPath = (inPath = "") => {
    inPath = inPath.replace(/\.(ts|js)/, "");
    // const out = inPath.replace(realPath, watchPath);
    // console.log(inPath, realPath, watchPath, out);
    return inPath;
    // return "../../" + out;
  };
  let dir = {};
  let importCode = "";
  const loadDir = (thePath, obj) => {
    const files = fs.readdirSync(thePath);
    files.forEach((file) => {
      const p = resolve(thePath, file);
      const stat = fs.statSync(p);
      const key = "'" + file.replace(/\.(ts|js)/, "") + "'";
      if (stat.isDirectory()) {
        if (!obj[key]) {
          obj[key] = {};
        }
        loadDir(p, obj[key]);
      } else if (/\.(ts|js)$/.test(file) && !/\.d\.ts$/.test(file)) {
        const importName = fixRealPath(p);
        const name = fixName(importName);
        importCode += `import * as ${name} from "${importName}";\n`;
        obj[key] = name;
      }
    });
  };
  loadDir(realPath, dir);
  const dirText = JSON.stringify(dir).replace(/\"/g, "");

  fs.writeFile(
    resolve(cwd, "node_modules", "svelte-zero-api", "__temp.ts"),
    `/* eslint-disable */
// Code generated by svelte-zero-api, DO NOT EDIT.

${importCode}
export default ${dirText}
    `,
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
}

export default function ({ routes, src } = {}) {
  routes = routes || "src/routes";
  src = src || "src";
  const realPath = resolve(cwd, routes);

  const zeroPath = resolve(cwd, src, "zeroApi.ts");

  if (!fs.existsSync(zeroPath)) {
    fs.writeFile(zeroPath, makeApiCode(), (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  updateAPI(realPath, routes);
  watch(realPath, () => {
    updateAPI(realPath, routes);
  });
  // fs.watch(realPath, { recursive: true }, (event, file) => {
  //   if (/\.ts/.test(file)) {
  //     updateAPI(realPath, routes);
  //   }
  // });
}
