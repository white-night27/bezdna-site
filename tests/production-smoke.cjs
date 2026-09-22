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

      const food = page.locator("#menu");
      await food.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1200);

      const resourceSummary = await page.evaluate(() => {
        const nav = performance.getEntriesByType("navigation")[0];
        const resources = performance.getEntriesByType("resource").map((entry) => ({
          name: entry.name,
          initiatorType: entry.initiatorType,
          duration: Math.round(entry.duration),
          transferSize: entry.transferSize || 0,
          encodedBodySize: entry.encodedBodySize || 0,
          nextHopProtocol: entry.nextHopProtocol || "",
        }));
        const totalTransfer = resources.reduce((sum, item) => sum + item.transferSize, 0);
        const largest = [...resources]
          .sort((a,b) => b.transferSize - a.transferSize)
          .slice(0, 12);
        const slowest = [...resources]
          .sort((a,b) => b.duration - a.duration)
          .slice(0, 12);
        return {
          navigation: nav ? {
            duration: Math.round(nav.duration),
            domContentLoaded: Math.round(nav.domContentLoadedEventEnd),
            loadEventEnd: Math.round(nav.loadEventEnd),
            transferSize: nav.transferSize || 0,
            encodedBodySize: nav.encodedBodySize || 0,
            nextHopProtocol: nav.nextHopProtocol || "",
          } : null,
          requestCount: resources.length,
          totalTransfer,
          largest,
          slowest,
        };
      });

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

      const requestedUi = await page.evaluate(() => {
        const menu = document.querySelector(".header-menu-cta");
        const ribsCard = document.querySelector(".food-card-ribs");
        const burgerCard = document.querySelector(".food-card-burger");
        const pizza = document.querySelector(".food-card-pizza img");
        const phone = document.querySelector(".contact-phone a");
        const rr = ribsCard?.getBoundingClientRect();
        const br = burgerCard?.getBoundingClientRect();
        const pr = phone?.getBoundingClientRect();
        const phoneStyle = phone ? getComputedStyle(phone) : null;
        const pizzaStyle = pizza ? getComputedStyle(pizza) : null;
        return {
          menuHref: menu?.getAttribute("href") || "",
          menuVisible: !!menu && getComputedStyle(menu).display !== "none" && menu.getBoundingClientRect().width > 0,
          ribsWidth: rr?.width || 0,
          burgerWidth: br?.width || 0,
          phoneHeight: pr?.height || 0,
          phoneLineHeight: phoneStyle ? parseFloat(phoneStyle.lineHeight) || 0 : 0,
          phoneWhiteSpace: phoneStyle?.whiteSpace || "",
          pizzaLoaded: !!pizza && pizza.complete && pizza.naturalWidth > 0,
          pizzaMask: pizzaStyle?.maskImage || pizzaStyle?.webkitMaskImage || "",
          pizzaBlend: pizzaStyle?.mixBlendMode || "",
        };
      });

      for (const img of imageInfo) {
        if (!img.complete || img.naturalWidth < 1) issues.push(`broken image: ${img.src}`);
      }

      const ribs = imageInfo.find(x => x.src?.includes("ribs-krutoyar"));
      if (!ribs) issues.push("ribs image not found");
      if (ribs && ribs.objectFit !== "contain") issues.push(`ribs object-fit is ${ribs.objectFit}, expected contain`);
      if (!requestedUi.menuVisible || requestedUi.menuHref !== "/menu/") {
        issues.push(`top menu CTA is not a visible direct /menu/ link: ${requestedUi.menuHref}`);
      }
      if (!device.isMobile && requestedUi.ribsWidth <= requestedUi.burgerWidth * 1.35) {
        issues.push(`ribs are not the dominant food card: ribs=${requestedUi.ribsWidth}, burger=${requestedUi.burgerWidth}`);
      }
      if (requestedUi.phoneWhiteSpace !== "nowrap") {
        issues.push(`phone white-space is ${requestedUi.phoneWhiteSpace}, expected nowrap`);
      }
      if (requestedUi.phoneLineHeight && requestedUi.phoneHeight > requestedUi.phoneLineHeight * 1.35) {
        issues.push(`phone wraps to multiple lines: height=${requestedUi.phoneHeight}, lineHeight=${requestedUi.phoneLineHeight}`);
      }
      if (!requestedUi.pizzaLoaded) issues.push("pizza image did not load");
      if (!requestedUi.pizzaMask || requestedUi.pizzaMask === "none") issues.push("pizza cutout mask is not active");

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (overflow > 4) issues.push(`horizontal overflow ${overflow}px`);

      await page.screenshot({ path:path.join(out,`${device.name}-home.png`), fullPage:true });
      await food.screenshot({ path:path.join(out,`${device.name}-food.png`) });

      const routeChecks = [
        { path:"/menu/", selector:"#menu-content", titlePart:"Меню" },
        { path:"/contacts/", selector:"#contacts-content", titlePart:"БЕЗДНА" },
      ];
      const routes = [];
      for (const route of routeChecks) {
        const routeStarted = Date.now();
        const routeResponse = await page.goto(baseUrl + route.path, { waitUntil:"domcontentloaded", timeout:45000 });
        const routeMs = Date.now() - routeStarted;
        if (!routeResponse || !routeResponse.ok()) {
          issues.push(`route navigation failed: ${route.path} — ${routeResponse?.status() || "no response"}`);
        }
        await page.waitForSelector(route.selector, { state:"visible", timeout:15000 });
        const routeTitle = await page.title();
        if (!routeTitle.includes(route.titlePart)) {
          issues.push(`unexpected ${route.path} title: ${routeTitle}`);
        }
        const routeTextLength = await page.locator("main").innerText().then(text => text.trim().length);
        if (routeTextLength < 100) {
          issues.push(`suspiciously empty route: ${route.path} (${routeTextLength} chars)`);
        }
        const routeOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (routeOverflow > 4) issues.push(`${route.path} horizontal overflow ${routeOverflow}px`);
        await page.screenshot({
          path:path.join(out,`${device.name}-${route.path.includes("menu") ? "menu" : "contacts"}.png`),
          fullPage:true,
        });
        routes.push({ path:route.path, routeMs, title:routeTitle, textLength:routeTextLength });
      }

      report.push({ device:device.name, domMs, title, resourceSummary, imageInfo, requestedUi, routes, failedRequests, issues });
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
