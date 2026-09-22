/* eslint-disable @typescript-eslint/no-require-imports */
const { performance } = require("node:perf_hooks");

const liveUrl = "https://bezdna-bar.ru/";

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
  url = liveUrl,
  timeoutMs = 300_000,
  requestTimeoutMs = 10_000,
  intervalMs = 5_000,
  fetchImpl = fetch,
  log = console.log,
}) {
  if (!/^[0-9a-f]{40}$/i.test(expectedSha || "")) throw new Error("EXPECTED_SHA must be a full Git SHA");
  const started = performance.now();
  const deadline = started + timeoutMs;
  let attempts = 0;
  let lastObservation = "none";

  while (performance.now() < deadline) {
    attempts += 1;
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
      lastObservation = `HTTP ${response.status}, site-commit=${observedSha}`;
      if (response.ok && observedSha.toLowerCase() === expectedSha.toLowerCase()) {
        log(`Live deployment confirmed after ${attempts} attempt(s): ${expectedSha}`);
        return { attempts, observedSha };
      }
    } catch (error) {
      lastObservation = `request error: ${error.message}`;
    }

    log(`Waiting for live ${expectedSha}: attempt ${attempts}, ${lastObservation}`);
    const sleepMs = Math.min(intervalMs, Math.max(0, deadline - performance.now()));
    if (sleepMs > 0) await new Promise(resolve => setTimeout(resolve, sleepMs));
  }

  throw new Error(`Live deployment did not reach ${expectedSha} within ${Math.round(timeoutMs / 1000)}s (${attempts} attempts; last: ${lastObservation}). Check Cloudflare Pages deployment and custom-domain delivery.`);
}

module.exports = { readCommitMarker, waitForProduction };

if (require.main === module) {
  waitForProduction({ expectedSha: process.env.EXPECTED_SHA }).catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
