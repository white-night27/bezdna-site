/* eslint-disable @typescript-eslint/no-require-imports */
const { performance } = require("node:perf_hooks");

const liveUrls = ["https://bezdna-bar.ru/", "https://bezdna-site.vercel.app/menu/"];

function readCommitMarker(html) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const name = tag.match(/\bname=["']([^"']+)["']/i)?.[1];
    if (name === "site-commit") return tag.match(/\bcontent=["']([^"']+)["']/i)?.[1] || "missing";
  }
  return "missing";
}

async function waitForProduction({
  expectedSha,
  urls = liveUrls,
  timeoutMs = 300_000,
  requestTimeoutMs = 10_000,
  intervalMs = 5_000,
  fetchImpl = fetch,
  log = console.log,
}) {
  if (!/^[0-9a-f]{40}$/i.test(expectedSha || "")) throw new Error("EXPECTED_SHA must be a full Git SHA");
  if (!Array.isArray(urls) || urls.length === 0) throw new Error("At least one live URL is required");
  const started = performance.now();
  const deadline = started + timeoutMs;
  let attempts = 0;
  let lastObservation = "none";

  while (performance.now() < deadline) {
    attempts += 1;
    const observations = await Promise.all(urls.map(async url => {
      const probe = new URL(url);
      probe.searchParams.set("ci_sha", expectedSha);
      probe.searchParams.set("ci_attempt", String(attempts));
      const remainingMs = Math.max(1, Math.round(deadline - performance.now()));

      try {
        const response = await fetchImpl(probe, {
          headers: { "Cache-Control": "no-cache", Accept: "text/html" },
          cache: "no-store",
          signal: AbortSignal.timeout(Math.min(requestTimeoutMs, remainingMs)),
        });
        const html = await response.text();
        const observedSha = response.ok ? readCommitMarker(html) : "unread";
        return {
          ready: response.ok && observedSha.toLowerCase() === expectedSha.toLowerCase(),
          detail: `${url}: HTTP ${response.status}, site-commit=${observedSha}`,
        };
      } catch (error) {
        return { ready: false, detail: `${url}: request error: ${error.message}` };
      }
    }));
    lastObservation = observations.map(observation => observation.detail).join(" | ");
    if (observations.every(observation => observation.ready)) {
      log(`Live deployment confirmed on ${urls.length} URL(s) after ${attempts} attempt(s): ${expectedSha}`);
      return { attempts, urls };
    }

    log(`Waiting for live ${expectedSha}: attempt ${attempts}, ${lastObservation}`);
    const sleepMs = Math.min(intervalMs, Math.max(0, deadline - performance.now()));
    if (sleepMs > 0) await new Promise(resolve => setTimeout(resolve, sleepMs));
  }

  throw new Error(`Live deployment did not reach ${expectedSha} on all URLs within ${Math.round(timeoutMs / 1000)}s (${attempts} attempts; last: ${lastObservation}). Check Cloudflare Pages, Vercel production, and custom-domain delivery.`);
}

module.exports = { readCommitMarker, waitForProduction };

if (require.main === module) {
  waitForProduction({ expectedSha: process.env.EXPECTED_SHA }).catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
