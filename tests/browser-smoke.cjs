/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");

const playwrightPath = process.env.PLAYWRIGHT_MODULE;
if (!playwrightPath) {
  throw new Error("PLAYWRIGHT_MODULE is required");
}
const { chromium } = require(playwrightPath);

const baseUrl = (process.env.BASE_URL || "http://127.0.0.1:4173").replace(/\/$/, "");
const artifactsDir = path.resolve("artifacts");
fs.mkdirSync(path.join(artifactsDir, "screenshots"), { recursive: true });
fs.mkdirSync(path.join(artifactsDir, "traces"), { recursive: true });

const routes = [
  { path: "/", marker: "Кухня Бездны" },
  { path: "/menu/", marker: "Меню Бездны" },
  { path: "/contacts/", marker: "Найти вход" },
];

const devices = [
  { name: "desktop", viewport: { width: 1440, height: 900 }, isMobile: false },
  { name: "mobile", viewport: { width: 390, height: 844 }, isMobile: true },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const failures = [];

  for (const device of devices) {
    const context = await browser.newContext({ viewport: device.viewport });
    await context.tracing.start({ screenshots: true, snapshots: true, sources: true });

    for (const route of routes) {
      const page = await context.newPage();
      const issues = [];

      page.on("pageerror", (error) => issues.push(`pageerror: ${error.message}`));
      page.on("console", (message) => {
        if (message.type() === "error") issues.push(`console: ${message.text()}`);
      });
      page.on("requestfailed", (request) => {
        issues.push(`request failed: ${request.method()} ${request.url()} — ${request.failure()?.errorText || "unknown"}`);
      });
      page.on("response", (response) => {
        if (response.status() >= 400) {
          issues.push(`HTTP ${response.status()}: ${response.url()}`);
        }
      });

      const url = baseUrl + route.path;
      try {
        const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
        if (!response || !response.ok()) {
          issues.push(`navigation failed: ${response?.status() || "no response"} ${url}`);
        }

        await page.waitForSelector("main", { state: "visible", timeout: 10000 });
        await page.waitForTimeout(500);

        const title = await page.title();
        if (!title.includes("БЕЗДНА")) issues.push(`unexpected title: ${title}`);

        const bodyText = await page.locator("body").innerText();
        if (!bodyText.includes(route.marker)) {
          issues.push(`missing expected text: ${route.marker}`);
        }

        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (overflow > 4) issues.push(`horizontal overflow: ${overflow}px`);

        if (route.path === "/") {
          if (device.isMobile) {
            const toggle = page.locator("#navToggle");
            if (!(await toggle.isVisible())) {
              issues.push("mobile nav toggle is not visible");
            } else {
              await toggle.click();
              const drawer = page.locator("#navDrawer");
              if (!(await drawer.isVisible())) issues.push("mobile nav drawer did not open");
              await page.keyboard.press("Escape");
            }
          } else {
            if (!(await page.locator(".nav-links").isVisible())) issues.push("desktop nav is not visible");
            if (await page.locator("#navToggle").isVisible()) issues.push("mobile nav toggle visible on desktop");
          }
        }

        await page.screenshot({
          path: path.join(artifactsDir, "screenshots", `${device.name}-${route.path === "/" ? "home" : route.path.replaceAll("/", "")}.png`),
          fullPage: true,
        });
      } catch (error) {
        issues.push(`exception: ${error.stack || error.message}`);
      } finally {
        await page.close();
      }

      if (issues.length) {
        failures.push({ device: device.name, route: route.path, issues });
      }
    }

    await context.tracing.stop({ path: path.join(artifactsDir, "traces", `${device.name}.zip`) });
    await context.close();
  }

  await browser.close();

  if (failures.length) {
    console.error(JSON.stringify(failures, null, 2));
    process.exit(1);
  }

  console.log(`Browser smoke tests passed against ${baseUrl}`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
