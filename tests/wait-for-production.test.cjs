/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const test = require("node:test");
const { readCommitMarker, waitForProduction } = require("./wait-for-production.cjs");

const oldSha = "a".repeat(40);
const newSha = "b".repeat(40);

test("reads the deployed commit from the homepage HTML", () => {
  assert.equal(readCommitMarker(`<html><head><meta content="${newSha}" name="site-commit"></head></html>`), newSha);
  assert.equal(readCommitMarker("<html><head></head></html>"), "missing");
});

test("waits for the expected live version before continuing", async () => {
  const observed = [];
  const result = await waitForProduction({
    expectedSha: newSha,
    intervalMs: 1,
    timeoutMs: 1000,
    log: message => observed.push(message),
    fetchImpl: async url => {
      assert.equal(url.searchParams.get("ci_sha"), newSha);
      const attempt = Number(url.searchParams.get("ci_attempt"));
      const marker = url.hostname === "bezdna-bar.ru"
        ? (attempt < 2 ? oldSha : newSha)
        : (attempt < 3 ? oldSha : newSha);
      return new Response(`<meta name="site-commit" content="${marker}">`);
    },
  });
  assert.equal(result.attempts, 3);
  assert.deepEqual(result.urls, ["https://bezdna-bar.ru/", "https://bezdna-site.vercel.app/menu/"]);
  assert.match(observed.at(-1), /confirmed/);
});

test("fails clearly when the Vercel menu stays stale or unavailable", async () => {
  await assert.rejects(
    waitForProduction({
      expectedSha: newSha,
      timeoutMs: 35,
      intervalMs: 1,
      log: () => {},
      fetchImpl: async url => new Response(`<meta name="site-commit" content="${url.hostname === "bezdna-bar.ru" ? newSha : oldSha}">`),
    }),
    /did not reach .*bezdna-site\.vercel\.app\/menu\/: HTTP 200, site-commit=aaa/,
  );
  await assert.rejects(
    waitForProduction({
      expectedSha: newSha,
      timeoutMs: 35,
      intervalMs: 1,
      log: () => {},
      fetchImpl: async url => {
        if (url.hostname === "bezdna-bar.ru") return new Response(`<meta name="site-commit" content="${newSha}">`);
        throw new Error("connection refused");
      },
    }),
    /did not reach .*bezdna-site\.vercel\.app\/menu\/: request error: connection refused/,
  );
});
