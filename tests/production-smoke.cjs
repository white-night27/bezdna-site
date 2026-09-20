/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");

const { chromium } = require(process.env.PLAYWRIGHT_MODULE);
const baseUrl = "https://bezdna-bar.ru";
const out = path.resolve("artifacts/production");
fs.mkdirSync(out, { recursive: true });

const devices = [
  { name: "desktop", viewport: { width: 1536, height: 960 }, isMobile: false },
  { name: "mobile", viewport: { width: 390, height: 844 }, isMobile: true },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const failures = [];
  const report = [];

  for (const device of devices) {
    const context = await browser.newContext({
      viewport: device.viewport,
      isMobile: device.isMobile,
      deviceScaleFactor: device.isMobile ? 2 : 1,
      userAgent: device.isMobile
        ? "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1"
        : undefined,
    });

    const page = await context.newPage();
    const issues = [];
    const failedRequests = [];

    page.on("pageerror", e => issues.push(`pageerror: ${e.message}`));
    page.on("console", m => { if (m.type() === "error") issues.push(`console: ${m.text()}`); });
    page.on("requestfailed", req => failedRequests.push({
      url:req.url(), method:req.method(), error:req.failure()?.errorText || "unknown"
    }));
    page.on("response", res => {
      if (res.status() >= 400) issues.push(`HTTP ${res.status()}: ${res.url()}`);
    });

    const started = Date.now();
    try {
      const response = await page.goto(baseUrl + "/", { waitUntil:"domcontentloaded", timeout:45000 });
      const domMs = Date.now() - started;
      if (!response || !response.ok()) issues.push(`navigation status ${response?.status() || "no response"}`);

      await page.waitForSelector("main", { state:"visible", timeout:15000 });
      await page.waitForTimeout(1500);

      const title = await page.title();
      if (!title.includes("БЕЗДНА")) issues.push(`unexpected title: ${title}`);

      const imageInfo = await page.evaluate(() => {
        const imgs = [...document.querySelectorAll(".food-gallery img")];
        return imgs.map(img => {
          const r = img.getBoundingClientRect();
          const cs = getComputedStyle(img);
          return {
            src: img.getAttribute("src"),
            complete: img.complete,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            width: Math.round(r.width),
            height: Math.round(r.height),
            objectFit: cs.objectFit,
            objectPosition: cs.objectPosition,
            display: cs.display,
            position: cs.position,
          };
        });
      });

      for (const img of imageInfo) {
        if (!img.complete || img.naturalWidth < 1) issues.push(`broken image: ${img.src}`);
      }

      const ribs = imageInfo.find(x => x.src?.includes("ribs-krutoyar"));
      if (!ribs) issues.push("ribs image not found");
      if (ribs && ribs.objectFit !== "contain") issues.push(`ribs object-fit is ${ribs.objectFit}, expected contain`);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (overflow > 4) issues.push(`horizontal overflow ${overflow}px`);

      const food = page.locator("#menu");
      await food.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);

      await page.screenshot({ path:path.join(out,`${device.name}-home.png`), fullPage:true });
      await food.screenshot({ path:path.join(out,`${device.name}-food.png`) });

      report.push({ device:device.name, domMs, title, imageInfo, failedRequests, issues });
    } catch (e) {
      issues.push(`exception: ${e.stack || e.message}`);
      report.push({ device:device.name, failedRequests, issues });
    }

    if (issues.length) failures.push({ device:device.name, issues });
    await context.close();
  }

  await browser.close();
  fs.writeFileSync(path.join(out,"report.json"), JSON.stringify(report,null,2));
  console.log(JSON.stringify(report,null,2));

  if (failures.length) process.exit(1);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
