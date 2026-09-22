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
  const responses = [oldSha, "missing", newSha];
  const result = await waitForProduction({
    expectedSha: newSha,
    intervalMs: 1,
    timeoutMs: 1000,
    log: message => observed.push(message),
    fetchImpl: async url => {
      assert.equal(url.searchParams.get("ci_sha"), newSha);
      const marker = responses.shift();
      return new Response(`<meta name="site-commit" content="${marker}">`);
    },
  });
  assert.equal(result.attempts, 3);
  assert.match(observed.at(-1), /confirmed/);
});

test("fails clearly when live stays stale or unavailable", async () => {
  await assert.rejects(
    waitForProduction({
      expectedSha: newSha,
      timeoutMs: 35,
      intervalMs: 1,
      log: () => {},
      fetchImpl: async () => new Response(`<meta name="site-commit" content="${oldSha}">`),
    }),
    /did not reach .*last: HTTP 200, site-commit=aaa/,
  );
  await assert.rejects(
    waitForProduction({
      expectedSha: newSha,
      timeoutMs: 35,
      intervalMs: 1,
      log: () => {},
      fetchImpl: async () => { throw new Error("connection refused"); },
    }),
    /did not reach .*last: request error: connection refused/,
  );
});
