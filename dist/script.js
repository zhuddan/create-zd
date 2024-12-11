#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/figures.js
var require_figures = __commonJS({
  "node_modules/.pnpm/prompts@2.4.2/node_modules/prompts/lib/util/figures.js"(exports2, module2) {
    "use strict";
    var main2 = {
      arrowUp: "\u2191",
      arrowDown: "\u2193",
      arrowLeft: "\u2190",
      arrowRight: "\u2192",
      radioOn: "\u25C9",
      radioOff: "\u25EF",
      tick: "\u2714",
      cross: "\u2716",
      ellipsis: "\u2026",
      pointerSmall: "\u203A",
      line: "\u2500",
      pointer: "\u276F"
    };
    var win = {
      arrowUp: main2.arrowUp,
      arrowDown: main2.arrowDown,
      arrowLeft: main2.arrowLeft,
      arrowRight: main2.arrowRight,
      radioOn: "(*)",
      radioOff: "( )",
      tick: "\u221A",
      cross: "\xD7",
      ellipsis: "...",
      pointerSmall: "\xBB",
      line: "\u2500",
      pointer: ">"
    };
    var figures2 = process.platform === "win32" ? win : main2;
    module2.exports = figures2;
  }
});

// src/cli.ts
var import_node_process2 = __toESM(require("process"));
var import_node_path2 = __toESM(require("path"));
var import_node_fs2 = __toESM(require("fs"));
var import_kolorist2 = require("kolorist");
var p2 = __toESM(require("@clack/prompts"));

// src/utils/cancel.ts
var import_kolorist = require("kolorist");
var import_figures = __toESM(require_figures());
var cancelMesssage = `${(0, import_kolorist.red)(import_figures.default.cross)} ${(0, import_kolorist.bold)("\u64CD\u4F5C\u5DF2\u53D6\u6D88")}`;
function onCancel() {
  throw new Error(cancelMesssage);
}

// src/utils/file.ts
var import_node_fs = __toESM(require("fs"));
var import_node_path = __toESM(require("path"));
function deleteFileOrDir(filePath) {
  try {
    const stat = import_node_fs.default.lstatSync(filePath);
    if (stat.isDirectory()) {
      const files = import_node_fs.default.readdirSync(filePath);
      for (const file of files) {
        const fullPath = import_node_path.default.join(filePath, file);
        deleteFileOrDir(fullPath);
      }
      import_node_fs.default.rmdirSync(filePath);
    } else if (stat.isSymbolicLink()) {
      import_node_fs.default.unlinkSync(filePath);
    } else {
      import_node_fs.default.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(`\u5220\u9664 ${filePath} \u65F6\u51FA\u9519:`, error.message);
  }
}
function isEmpty(dir) {
  if (!import_node_fs.default.existsSync(dir)) {
    return true;
  }
  const files = import_node_fs.default.readdirSync(dir);
  if (files.length === 0) {
    return true;
  }
  if (files.length === 1 && files[0] === ".git") {
    return true;
  }
  return false;
}

// src/create-vue.ts
var import_node_process = __toESM(require("process"));
var p = __toESM(require("@clack/prompts"));
async function createVue() {
  const group3 = await p.group(
    {
      router: () => p.select({
        message: "\u662F\u5426\u4F7F\u7528 vue-router ?",
        options: [
          { label: "\u4E0D\u4F7F\u7528", value: "none" },
          { label: "unplugin-vue-router (\u6587\u4EF6\u7CFB\u7EDF\u8DEF\u7531,\u63A8\u8350)", value: "vue-router" },
          { label: "vue-router", value: "vue-router" }
        ]
      })
    },
    {
      onCancel: () => {
        p.cancel("Operation cancelled.");
        import_node_process.default.exit(0);
      }
    }
  );
  console.log(group3);
  return group3;
}

// src/constants/index.ts
var c = __toESM(require("kolorist"));
var frameworkOptions = [
  {
    label: c.green("Vue"),
    value: "vue"
  },
  {
    label: c.cyan("React"),
    value: "react"
  }
];

// src/cli.ts
async function init() {
  const text2 = "ZD-CREATOR";
  let colorText = "";
  const startColor = { r: 59, g: 209, b: 145 };
  const endColor = { r: 43, g: 76, b: 238 };
  for (let i = 0; i < text2.length; i++) {
    const ratio = i / (text2.length - 1);
    const red3 = Math.round(startColor.r + (endColor.r - startColor.r) * ratio);
    const green2 = Math.round(startColor.g + (endColor.g - startColor.g) * ratio);
    const blue = Math.round(startColor.b + (endColor.b - startColor.b) * ratio);
    colorText += (0, import_kolorist2.bold)(`\x1B[38;2;${red3};${green2};${blue}m${text2[i]}\x1B[0m`);
  }
  const output = import_node_process2.default.stdout.isTTY && import_node_process2.default.stdout.getColorDepth() > 8 ? colorText : (0, import_kolorist2.lightCyan)((0, import_kolorist2.bold)(text2));
  console.log();
  console.log(output);
  console.log();
  return await p2.group(
    {
      projectName: () => p2.text({
        message: "\u8BF7\u8F93\u5165\u9879\u76EE\u540D\u79F0",
        initialValue: "my-app"
      }),
      framework: ({ results }) => p2.select({
        message: "\u8BF7\u9009\u62E9\u4E00\u4E2A\u6846\u67B6",
        options: frameworkOptions
      })
    },
    {
      onCancel: ({ results }) => {
        p2.cancel("Operation cancelled.");
        import_node_process2.default.exit(0);
      }
    }
  );
}
function shouldOverwrite() {
  return p2.confirm({
    message: "\u6587\u4EF6\u5DF2\u7ECF\u5B58\u5728, \u662F\u5426\u8986\u76D6\u6587\u4EF6\u5939?",
    initialValue: false,
    active: "\u662F",
    inactive: "\u5426"
  });
}
async function main() {
  try {
    const { projectName, framework } = await init();
    const cwd = import_node_process2.default.cwd();
    const root = import_node_path2.default.join(cwd, projectName);
    const userAgent = import_node_process2.default.env.npm_config_user_agent ?? "";
    const packageManager = /pnpm/.test(userAgent) ? "pnpm" : /yarn/.test(userAgent) ? "yarn" : "npm";
    const overwrite = isEmpty(projectName) ? true : await shouldOverwrite();
    if (overwrite) {
      if (!import_node_fs2.default.existsSync(projectName)) {
        import_node_fs2.default.mkdirSync(projectName);
      } else {
        import_node_fs2.default.readdirSync(projectName).forEach((e) => {
          deleteFileOrDir(`${projectName}/${e}`);
        });
      }
      if (framework === "vue") {
        await createVue();
      }
    } else {
      onCancel();
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    import_node_process2.default.exit(0);
  }
}

// src/index.ts
main();
