#!/usr/bin/env node
/**
 * Reports English-looking JSX text nodes that are NOT wrapped in <TransText>.
 *
 * Usage: node scripts/scan-untranslated.cjs [files...]
 *        (no args → the merge-touched source files recorded in .scan-files)
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const CODE_HINTS = /[;(){}[\]`$\\]|=>|===|&&|\|\||\/\/|^\s*[a-z-]+:\s|^\s*\.\.\./;

function looksLikeCopy(raw) {
  const t = raw.replace(/\s+/g, " ").trim();
  if (!t || t.length < 2) return false;
  if (CODE_HINTS.test(t)) return false;
  if (!/[A-Za-z]{2}/.test(t)) return false;
  // must look like prose: has a space, or starts uppercase and is a word/phrase
  const hasSpace = /\s/.test(t);
  const startsUpper = /^[A-Z“"'(]/.test(t);
  if (!hasSpace && !startsUpper) return false;
  // single uppercase token that is likely an identifier/acronym
  if (!hasSpace && /^[A-Z0-9_]+$/.test(t)) return false;
  // camelCase / kebab / snake single tokens are code
  if (!hasSpace && /[a-z][A-Z]|_|-|\./.test(t)) return false;
  // attribute-like leftovers
  if (/^[a-z-]+=/.test(t)) return false;
  return true;
}

function stripTransText(src) {
  // keep newlines so line numbers stay accurate
  return src.replace(/<TransText\b[^>]*>[\s\S]*?<\/TransText\s*>/g, (m) =>
    m.replace(/[^\n]/g, " "),
  );
}

function lineOf(src, index) {
  return src.slice(0, index).split("\n").length;
}

const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : fs
      .readFileSync(path.join(ROOT, ".scan-files"), "utf8")
      .split("\n")
      .filter(Boolean);

let total = 0;
for (const rel of files) {
  const file = path.isAbsolute(rel) ? rel : path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  const raw = fs.readFileSync(file, "utf8");
  const src = stripTransText(raw);
  const hits = [];
  const re = />([^<>{}]+)</g;
  let m;
  while ((m = re.exec(src))) {
    const text = m[1];
    if (!looksLikeCopy(text)) continue;
    hits.push({ line: lineOf(src, m.index + 1), text: text.replace(/\s+/g, " ").trim() });
  }
  if (hits.length) {
    console.log(`\n### ${path.relative(ROOT, file)}`);
    for (const h of hits) console.log(`  ${h.line}: ${h.text}`);
    total += hits.length;
  }
}
console.log(`\nTOTAL CANDIDATES: ${total}`);
