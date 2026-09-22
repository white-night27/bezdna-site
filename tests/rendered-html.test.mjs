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

async function readBuiltRouteHtml(route) {
  const appDir = new URL("../.next/server/app/", import.meta.url);
  const files = await readdir(appDir, { recursive: true });
  const candidates = [`${route}.html`, `${route}/index.html`, `${route}/page.html`];
  const htmlPath = files.find((file) => candidates.includes(file));

  assert.ok(htmlPath, `expected Next.js to emit a prerendered ${route} page`);
  return readFile(new URL(`../.next/server/app/${htmlPath}`, import.meta.url), "utf8");
}

test("renders the supplied Bezdna reference design and content", async () => {
  const html = await readBuiltHomeHtml();
  assert.match(html, /БЕЗДНА — тапрум и кухня, Санкт-Петербург/);
  assert.match(html, /Комната с кранами/);
  assert.match(html, /Рижский проспект/);
  assert.match(html, /\+7 \(967\) 976-56-56/);
  assert.match(html, /Открыть полное меню/);
  assert.match(html, /src="\/logo\.svg"/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.match(html, /href="tel:\+79679765656"/);
  assert.match(html, /Telegram-сообщество/);
  assert.doesNotMatch(html, /5\.0 ★ на Яндекс Картах|521 отзыв|Лучшее место 2026/);
  assert.doesNotMatch(html, /href="https:\/\/t\.me\/abyss_calling"[^>]*btn-primary/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("publishes the build commit in the live homepage HTML", async () => {
  const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");
  const expected = process.env.CF_PAGES_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || "local";
  assert.match(html, new RegExp(`<meta name="site-commit" content="${expected}"`));
});

test("renders a dedicated, indexable menu page", async () => {
  const html = await readBuiltRouteHtml("menu");
  assert.match(html, /Меню кухни — БЕЗДНА|Меню — БЕЗДНА/);
  assert.match(html, /Свиные рёбра/);
  assert.match(html, /Бургеры/);
  assert.match(html, /href="tel:\+79679765656"/);
  assert.match(html, /href="\/contacts\/?"/);
});

test("renders a dedicated route and booking page", async () => {
  const html = await readBuiltRouteHtml("contacts");
  assert.match(html, /Как найти/);
  assert.match(html, /Рижский пр/);
  assert.match(html, /16:00/);
  assert.match(html, /03:00/);
  assert.match(html, /href="tel:\+79679765656"/);
  assert.match(html, /Яндекс Карты/);
  assert.match(html, /2ГИС/);
});

test("keeps content and brand assets easy to replace", async () => {
  const content = await readFile(new URL("../app/content.ts", import.meta.url), "utf8");
  assert.match(content, /export const venue =/);
  assert.match(content, /export const legalDetails =/);
  assert.match(content, /export const menuCategories =/);
  assert.match(content, /export const features =/);
  await stat(new URL("../public/logo.svg", import.meta.url));
  await stat(new URL("../public/favicon.svg", import.meta.url));
  await stat(new URL("../public/og-preview-1200x630-v5.jpg", import.meta.url));
  await stat(new URL("../reference/index-original.html", import.meta.url));
  await stat(new URL("../public/robots.txt", import.meta.url));
  await stat(new URL("../public/sitemap.xml", import.meta.url));
});

test("publishes one canonical domain in robots and sitemap", async () => {
  const robotsSource = await readFile(new URL("../public/robots.txt", import.meta.url), "utf8");
  const sitemapSource = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  assert.match(robotsSource, /https:\/\/bezdna-bar\.ru\/sitemap\.xml/);
  assert.match(sitemapSource, /https:\/\/bezdna-bar\.ru/);
  assert.match(sitemapSource, /\/menu/);
  assert.match(sitemapSource, /\/contacts/);
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


test("exports complete HTML without the Next client runtime", async () => {
  const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");
  assert.match(html, /БЕЗДНА — тапрум и кухня, Санкт-Петербург/);
  assert.match(html, /<style[^>]*>[^<]*|<style/i);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /src="\/site\.js"/);
  assert.doesNotMatch(html, /<script[^>]+src="[^"]*_next\/static\/chunks\//i);
  assert.doesNotMatch(html, /<link[^>]+rel="(?:preload|modulepreload)"/i);
});
