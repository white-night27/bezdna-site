import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("out");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function keepScript(attrs) {
  return /type\s*=\s*["']application\/ld\+json["']/i.test(attrs) ||
    /src\s*=\s*["']\/site\.js["']/i.test(attrs);
}

function stripNextRuntime(html) {
  let result = html.replace(/<script\b([^>]*)>[\s\S]*?<\/script>/gi, (full, attrs) => (
    keepScript(attrs) ? full : ""
  ));

  result = result.replace(/<link\b[^>]*>/gi, (tag) => {
    const isPreload = /\brel\s*=\s*["'](?:preload|modulepreload)["']/i.test(tag);
    const isNextStylesheet = /\brel\s*=\s*["']stylesheet["']/i.test(tag) &&
      /\bhref\s*=\s*["']\/?_next\/static\/css\//i.test(tag);
    return isPreload || isNextStylesheet ? "" : tag;
  });

  return result;
}

const htmlFiles = await walk(outDir);
let changed = 0;

for (const file of htmlFiles) {
  const before = await readFile(file, "utf8");
  const after = stripNextRuntime(before);
  if (after !== before) {
    await writeFile(file, after, "utf8");
    changed += 1;
  }
}

console.log(`Stripped Next client runtime/preloads from ${changed}/${htmlFiles.length} exported HTML files.`);
