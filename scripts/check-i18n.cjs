#!/usr/bin/env node
/**
 * i18n coverage checker for the NetBrid dashboard.
 *
 * 1. Loads src/i18n/zh-map.ts (runtime keys).
 * 2. Scans all .tsx/.ts under src/ (excluding src/i18n) for:
 *      <TransText>English Text</TransText>       (static children)
 *      <TransText en="...">...</TransText>
 *      zhMap["English Text"] / zhMap['English Text']
 * 3. Reports strings that have no entry in zh-map.ts.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");

// ---- load zhMap ---------------------------------------------------------
const mapSrc = fs
  .readFileSync(path.join(SRC, "i18n", "zh-map.ts"), "utf8")
  .replace(/const zhMap: Record<string, string> =/, "const zhMap =")
  .replace(/export default zhMap;?/, "module.exports=zhMap;");
const tmp = "/tmp/.zhmap-check.cjs";
fs.writeFileSync(tmp, mapSrc);
delete require.cache[tmp];
const zhMap = require(tmp);
const keys = new Set(Object.keys(zhMap));

// ---- walk ---------------------------------------------------------------
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "i18n" || e.name === "node_modules") continue;
      walk(p, out);
    } else if (/\.(tsx?|jsx?)$/.test(e.name)) {
      out.push(p);
    }
  }
  return out;
}

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");

const norm = (s) => decode(s).replace(/\s+/g, " ").trim();

const missing = new Map(); // text -> [files]
const used = new Map(); // text -> [files]

function add(map, text, file) {
  const t = norm(text);
  if (!t) return;
  if (!map.has(t)) map.set(t, []);
  map.get(t).push(path.relative(ROOT, file));
}

for (const file of walk(SRC)) {
  const src = fs.readFileSync(file, "utf8");

  // <TransText>static text</TransText> — children without tags/braces
  const re = /<TransText(?:\s[^>]*)?>([^<>{}]+)<\/TransText>/g;
  let m;
  while ((m = re.exec(src))) add(used, m[1], file);

  // <TransText en="..."> — the en prop is display text
  const reEn = /<TransText\s+en=["']([^"']+)["']/g;
  while ((m = reEn.exec(src))) add(used, m[1], file);

  // zhMap["..."] / zhMap['...']
  const reMap = /zhMap\[\s*["']((?:[^"'\\]|\\.)*)["']\s*\]/g;
  while ((m = reMap.exec(src))) add(used, m[1].replace(/\\(["'])/g, "$1"), file);
}

for (const [text, files] of used) {
  if (!keys.has(text)) missing.set(text, files);
}

console.log(`zh-map entries: ${keys.size}`);
console.log(`referenced strings: ${used.size}`);
console.log(`missing translations: ${missing.size}`);
if (missing.size) {
  console.log("\n--- MISSING ---");
  for (const [text, files] of [...missing].sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`${JSON.stringify(text)}\t${files.length}x\t${files[0]}`);
  }
}
