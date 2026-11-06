import assert from "node:assert/strict";
import test from "node:test";
import { campaignUrl } from "../src/lib/cta-links.ts";

const web = "https://app.renewables.cubelated.com/";
const play = "https://play.google.com/store/apps/details?id=com.cubelated.renewly";

test("links work without campaign tags or a browser (including prerendering)", () => {
  assert.equal(campaignUrl(web, ""), web);
  assert.equal(campaignUrl(play, "?token=private#document"), play);
});
test("only campaign tags reach the web app", () => {
  const result = new URL(campaignUrl(web, "?utm_source=newsletter&utm_campaign=autumn-2026&email=private&item_id=secret&gclid=ad"));
  assert.deepEqual([...result.searchParams], [["utm_source", "newsletter"], ["utm_campaign", "autumn-2026"]]);
  assert.equal(result.hash, "");
});
test("Play receives an encoded install referrer and the correct package ID", () => {
  const result = new URL(campaignUrl(play, "?utm_source=homepage&utm_medium=organic&utm_content=hero"));
  assert.equal(result.searchParams.get("id"), "com.cubelated.renewly");
  assert.equal(result.searchParams.get("referrer"), "utm_source=homepage&utm_medium=organic&utm_content=hero");
  assert.equal(result.searchParams.size, 2);
});
test("email addresses, URLs, control characters, and oversized values are dropped", () => {
  const search = new URLSearchParams({ utm_source: "person@example.com", utm_medium: "https://private.test", utm_campaign: "a".repeat(101), utm_content: "private\nvalue" });
  assert.equal(campaignUrl(web, search.toString()), web);
});
test("campaign parameters never alter unapproved destinations", () => {
  const destination = "https://example.com/";
  assert.equal(campaignUrl(destination, "?utm_source=homepage"), destination);
});
