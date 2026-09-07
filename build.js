/* Bundles the modular repo into playable HTML.
   shell.html is the one chrome template. This writes:
     index.html         — modular (link + script src) for local development
     monomythian.html   — CSS + JS inlined, runs from file:// */
const fs = require("fs"), path = require("path");
const R = __dirname;

const shell = fs.readFileSync(path.join(R, "shell.html"), "utf8");
if (shell.indexOf("__HEAD__") === -1 || shell.indexOf("__SCRIPTS__") === -1) {
  throw new Error("shell.html must contain __HEAD__ and __SCRIPTS__ placeholders");
}

const css = fs.readFileSync(path.join(R, "styles/terminal.css"), "utf8");

const jsFiles = [
  "src/engine/core.js","src/engine/ui.js","src/engine/apps.js",
  "src/engine/connect.js","src/engine/scene.js",
  "src/content/archive-data.js","src/content/hosts.js",
  "src/content/cycles/cycle1.js","src/content/cycles/cycle2.js",
  "src/content/cycles/cycle3.js","src/content/cycles/cycle4.js",
  "src/content/cycles/cycle5.js","src/content/cycles/cycle6.js",
  "src/content/cycles/cycle7.js","src/content/cycles/cycle8.js",
  "src/main.js"
];
let js = jsFiles.map(f =>
  "\n/* ===== " + f + " ===== */\n" + fs.readFileSync(path.join(R, f), "utf8")
).join("\n");

if (js.indexOf("</script") !== -1) throw new Error("JS contains </script — cannot inline safely");
if (js.indexOf("<!--") !== -1) throw new Error('JS contains "<!--" — cannot inline safely');

function stamp(head, scripts) {
  return shell.replace("__HEAD__", head).replace("__SCRIPTS__", scripts);
}

const modularHead = '<link rel="stylesheet" href="styles/terminal.css">';
const modularScripts = [
  "<!-- engine (order matters) -->",
  ...["src/engine/core.js","src/engine/ui.js","src/engine/apps.js","src/engine/connect.js","src/engine/scene.js"]
    .map(f => '<script src="' + f + '"></script>'),
  "",
  "<!-- content -->",
  ...["src/content/archive-data.js","src/content/hosts.js"].map(f => '<script src="' + f + '"></script>'),
  ...[1,2,3,4,5,6,7,8].map(n => '<script src="src/content/cycles/cycle' + n + '.js"></script>'),
  "",
  "<!-- boot -->",
  '<script src="src/main.js"></script>'
].join("\n");

const indexPath = path.join(R, "index.html");
fs.writeFileSync(indexPath, stamp(modularHead, modularScripts));
console.log("wrote " + indexPath);

const bundleHead = "<style>\n" + css + "\n</style>";
const bundleScripts = "<script>\n" + js + "\n</script>";
const outPath = path.join(R, "monomythian.html");
fs.writeFileSync(outPath, stamp(bundleHead, bundleScripts));
console.log("wrote " + outPath + " (" + Math.round(fs.statSync(outPath).size/1024) + " KB)");
