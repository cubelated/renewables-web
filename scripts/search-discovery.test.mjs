import assert from "node:assert/strict";
import test from "node:test";
import { isAllowedByRobots, indexabilityIssues } from "./check-search-discovery.mjs";

test("search crawl checks distinguish search access from managed training-bot restrictions", () => {
  const robots = "User-agent: *\nContent-Signal: search=yes,ai-train=no\nAllow: /\nUser-agent: GPTBot\nDisallow: /\nUser-agent: *\nAllow: /\nDisallow: /api/";
  for (const agent of ["Googlebot", "bingbot", "OAI-SearchBot"]) {
    assert(isAllowedByRobots(robots, agent, "/id/resources"));
    assert(!isAllowedByRobots(robots, agent, "/api/private"));
  }
  assert(!isAllowedByRobots(robots, "GPTBot", "/resources"));
});

test("crawler-specific rules, merged groups and longest matching paths take precedence", () => {
  const robots = "User-agent: *\nAllow: /\nUser-agent: OAI-SearchBot\nDisallow: /resources\nUser-agent: OAI-SearchBot\nAllow: /resources/public$\nDisallow: /*?private=*\nAllow: /resources/tie\nDisallow: /resources/tie";
  assert(!isAllowedByRobots(robots, "OAI-SearchBot", "/resources"));
  assert(isAllowedByRobots(robots, "OAI-SearchBot", "/resources/public"));
  assert(!isAllowedByRobots(robots, "OAI-SearchBot", "/resources/public/extra"));
  assert(isAllowedByRobots(robots, "OAI-SearchBot", "/resources/tie"));
  assert(!isAllowedByRobots(robots, "OAI-SearchBot", "/other?private=yes"));
  assert(isAllowedByRobots(robots, "Googlebot", "/resources"));
});

const expected = { canonical: "https://renewables.cubelated.com/id/resources", language: "id-ID" };
const html = '<html lang="id-ID"><head><title>Panduan | Renewables</title><link rel="canonical" href="https://renewables.cubelated.com/id/resources"><meta name="robots" content="index, follow"></head><body><h1>Panduan</h1></body></html>';
const headers = () => new Headers({ "content-type": "text/html" });

test("discovery checks accept prerendered localized canonical pages", () => {
  assert.deepEqual(indexabilityIssues(html, headers(), expected), []);
});

test("discovery checks detect header exclusions, unavailable snippets, challenges and wrong locales", () => {
  const blocked = headers(); blocked.set("x-robots-tag", "noindex"); blocked.set("cf-mitigated", "challenge");
  assert.deepEqual(indexabilityIssues(html.replace("index, follow", "index, nosnippet"), blocked, { ...expected, canonical: "https://renewables.cubelated.com/resources", language: "en" }), ["Indexing is disabled", "Search snippets are disabled", "Canonical does not match the published URL", "Published language does not match the build", "Cloudflare returned a challenge"]);
  assert(indexabilityIssues(html.replace("index, follow", "max-snippet:0"), headers(), expected).includes("Search snippets are disabled"));
});
