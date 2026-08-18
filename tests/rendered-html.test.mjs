import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import test from "node:test";

async function readBuiltHomeHtml() {
  const appDir = new URL("../.next/server/app/", import.meta.url);
  const files = await readdir(appDir, { recursive: true });
  const htmlPath = files.find((file) => file === "index.html" || /(?:^|\/)page\.html$/.test(file));

  assert.ok(htmlPath, "expected Next.js to emit a prerendered home page");
  return readFile(new URL(`../.next/server/app/${htmlPath}`, import.meta.url), "utf8");
}

test("renders the supplied Bezdna reference design and content", async () => {
  const html = await readBuiltHomeHtml();
  assert.match(html, /БЕЗДНА — тапрум и кухня, Санкт-Петербург/);
  assert.match(html, /Комната с кранами/);
  assert.match(html, /Рижский проспект/);
  assert.match(html, /\+7 \(967\) 976-56-56/);
  assert.match(html, /Свиные рёбра/);
  assert.match(html, /src="\/logo\.svg"/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("keeps content and brand assets easy to replace", async () => {
  const content = await readFile(new URL("../app/content.ts", import.meta.url), "utf8");
  assert.match(content, /export const venue =/);
  assert.match(content, /export const legalDetails =/);
  assert.match(content, /export const menuCategories =/);
  assert.match(content, /export const features =/);
  await stat(new URL("../public/logo.svg", import.meta.url));
  await stat(new URL("../public/favicon.svg", import.meta.url));
  await stat(new URL("../public/og.png", import.meta.url));
  await stat(new URL("../reference/index-original.html", import.meta.url));
});

test("identifies the site owner and links to legal details", async () => {
  const html = await readBuiltHomeHtml();
  assert.match(html, /ООО «Б Е З Д Н А ТАПРУМ И КУХНЯ»/);
  assert.match(html, /href="\/legal"/);
  assert.match(html, /Адрес заведения/);

  const legalSource = await readFile(new URL("../app/legal/page.tsx", import.meta.url), "utf8");
  assert.match(legalSource, /legalDetails\.ownerName/);
  assert.match(legalSource, /legalDetails\.legalAddress/);
  assert.match(legalSource, /mailto:/);
});
