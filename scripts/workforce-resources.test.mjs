import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer } from "vite";
import { createServer as createHttpServer } from "node:http";
import { createElement } from "react";
import { renderToString } from "react-dom/server";

let server, catalog, profiles, Notes, seo;
before(async () => {
  server = await createServer({ server: { middlewareMode: true, hmr: { server: createHttpServer() } }, appType: "custom", optimizeDeps: { noDiscovery: true, entries: [] } });
  catalog = await server.ssrLoadModule("/src/content/resources/guides.ts");
  profiles = await server.ssrLoadModule("/src/content/resources/workforce-profiles.ts");
  Notes = (await server.ssrLoadModule("/src/components/resources/WorkforceCountryNotes.tsx")).default;
  seo = await server.ssrLoadModule("/src/seo.ts");
});
after(async () => { await server?.close(); });
const find = (filters) => catalog.findGuides({ ...catalog.emptyFilters, residence: "TW", ...filters });
const get = (id) => catalog.publishedGuides.find((guide) => guide.id === id);

test("finite workforce research distinguishes four migrant origins, professional groups and additional teacher research", () => {
  assert.equal(profiles.workforceProfiles.length, 23);
  assert.deepEqual(profiles.workforceProfiles.filter((profile) => profile.context === "migrant-and-professional").map((profile) => profile.country).sort(), ["ID", "PH", "TH", "VN"]);
  assert.deepEqual(profiles.workforceProfiles.filter((profile) => profile.context === "teacher-research").map((profile) => profile.country).sort(), ["AU", "IE", "NZ"]);
  assert.doesNotThrow(() => profiles.validateWorkforceProfiles(profiles.workforceProfiles));
  for (const profile of profiles.workforceProfiles) {
    assert.equal(profile.reviewedOn, "2026-11-12");
    assert(profiles.workforceProfileSources(profile).every((source) => catalog.isOfficialUrl(source.url)));
  }
});

test("each added passport guide stays within its reviewed issuer country and Taiwan residence", () => {
  for (const [country, id] of [["GB", "gb-passport-tw"], ["CA", "ca-passport-tw"], ["AU", "au-passport-tw"], ["NZ", "nz-passport-tw"], ["IE", "ie-passport-tw"], ["HK", "hk-passport-tw"], ["MO", "mo-passport-tw"], ["MY", "my-passport-tw"], ["JP", "jp-passport-tw"], ["IN", "in-passport-tw"], ["DE", "de-passport-tw"], ["SG", "sg-passport-tw"]]) {
    assert.deepEqual(find({ nationality: country, document: "passport" }).map((guide) => guide.id), [id]);
    assert(!find({ nationality: country, residence: "ID", document: "passport" }).some((guide) => guide.id === id));
  }
  for (const country of ["US", "VN", "KR", "ZA", "FR", "MM", "SZ", "RU"]) {
    assert.deepEqual(find({ nationality: country, document: "passport" }), []);
    assert(!profiles.workforceProfiles.find((profile) => profile.country === country).passportGuideId);
  }
});

test("Hong Kong/Macao residence and teacher routes never inherit ordinary migrant-worker instructions", () => {
  for (const nationality of ["HK", "MO"]) {
    assert.deepEqual(find({ nationality, document: "arc", status: "professional" }).map((guide) => guide.id), ["hk-mo-work-residence"]);
    assert.deepEqual(find({ nationality, document: "arc", status: "worker" }), []);
    assert.deepEqual(find({ nationality, document: "arc", status: "student" }), []);
    assert.deepEqual(find({ nationality, document: "aprc" }), []);
  }
  for (const nationality of ["US", "GB", "PH"]) {
    assert.deepEqual(find({ nationality, document: "work-permit", status: "teacher" }).map((guide) => guide.id), ["tw-public-teacher-docs", "tw-cram-teacher-docs"]);
    assert.deepEqual(find({ nationality, document: "arc", status: "teacher" }).map((guide) => guide.id), ["tw-arc-professionals"]);
  }
  assert.match(get("tw-public-teacher-docs").translations.en.scope, /passport alone does not establish eligibility/);
});

test("conditional home records do not become recurring expiry or general employment eligibility claims", () => {
  assert.equal(get("ph-ofw-records").timing.kind, "event-based");
  assert.equal(get("hk-identity-tw").timing.kind, "event-based");
  for (const id of ["us-fbi-tw", "ca-rcmp-tw", "nz-record-tw", "ie-police-tw"]) assert.equal(get(id).timing.kind, "recipient-policy");
  assert.match(get("ie-police-tw").translations.en.scope, /not a general certificate available for every overseas job/);
  assert.match(get("nz-record-tw").timing.text, /rather than an expiry/);
  assert(!find({ nationality: "US", document: "police-clearance" }).some((guide) => guide.id === "ca-rcmp-tw"));
  for (const profile of profiles.workforceProfiles) for (const item of profile.records) assert(["conditional", "supporting", "event"].includes(item.tracking));
});

test("country notes expose research gaps and skip extra renewals without publishing unsupported procedures", () => {
  const render = (filters) => renderToString(createElement(Notes, { language: "en", filters: { ...catalog.emptyFilters, residence: "TW", ...filters } }));
  const vietnam = render({ nationality: "VN", document: "passport" });
  assert(vietnam.includes("Taiwan passport checklist not yet verified"));
  assert(vietnam.includes("https://vnoffice-taipei.mofa.gov.vn/thu-tuc-lanh-su"));
  assert(!vietnam.includes("indonesian-passport-renewal"));
  assert(render({ nationality: "MY" }).includes("No additional recurring home-country renewal has been verified"));
  assert.equal(render({ nationality: "PH", residence: "ID" }), "");
  assert(!render({ nationality: "PH", status: "student" }).includes("OFW clearance, verified contract and OWWA coverage"));
});

test("workforce validation rejects copied country rules, unavailable evidence, unsafe sources and invalid dates", () => {
  const first = structuredClone(profiles.workforceProfiles[0]);
  assert.throws(() => profiles.validateWorkforceProfiles([first, first]), /duplicate/);
  for (const mutate of [
    (profile) => { profile.passportGuideId = "ca-passport-tw"; },
    (profile) => { profile.reviewedOn = "2026-02-30"; },
    (profile) => { profile.references = [{ ...get("ca-passport-tw").sources[0], url: "https://evil.test" }]; },
    (profile) => { profile.records = [{ title: "Wrong country", tracking: "conditional", note: "Wrong", sources: get("ca-passport-tw").sources, guideIds: ["ca-passport-tw"] }]; },
    (profile) => { profile.records = [{ title: "Unavailable", tracking: "conditional", note: "Wrong", sources: [{ ...get("ca-passport-tw").sources[0], access: "unavailable" }], guideIds: [] }]; },
  ]) { const profile = structuredClone(first); mutate(profile); assert.throws(() => profiles.validateWorkforceProfiles([profile])); }
});

test("research profiles cannot create country permutations or index an unverified passport guide", () => {
  for (const path of ["/resources/vietnamese-passport-renewal-taiwan", "/resources/us-passport-renewal-taiwan", "/resources/russian-passport-renewal-taiwan"]) {
    assert(!catalog.resolveResourcePath(path));
    assert(!seo.INDEXED_PATHS.includes(path));
    assert(seo.getPageSeo(path).robots.startsWith("noindex"));
  }
});
