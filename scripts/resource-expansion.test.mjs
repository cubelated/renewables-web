import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer } from "vite";
import { createServer as createHttpServer } from "node:http";

let server, catalog, copy;
before(async () => {
  server = await createServer({ server: { middlewareMode: true, hmr: { server: createHttpServer() } }, appType: "custom", optimizeDeps: { noDiscovery: true, entries: [] } });
  catalog = await server.ssrLoadModule("/src/content/resources/guides.ts");
  copy = (await server.ssrLoadModule("/src/content/resources/locales.ts")).resourceCopy;
});
after(async () => { await server?.close(); });
const find = (filters) => catalog.findGuides({ ...catalog.emptyFilters, nationality: "ID", residence: "TW", ...filters });

test("expanded catalog covers every requested topic with substantive, source-cited data", () => {
  for (const document of ["passport", "arc", "gold-card", "aprc", "nhi", "drivers-license", "international-driving-permit", "dental-care", "work-permit", "employment-contract", "bank-card", "rental-contract", "national-id", "language-certificate", "health-certificate", "police-clearance"]) {
    assert(catalog.publishedGuides.some((guide) => guide.document === document), document);
  }
  for (const guide of catalog.publishedGuides.filter((guide) => guide.serviceType)) {
    assert(guide.timing?.sourceIds.length, guide.id);
    assert(guide.translations.en.scope.length > 100, guide.id);
    assert(guide.translations.en.steps.length >= 2 && guide.translations.en.conditionalRequirements.length > 0);
  }
});
test("student permits and qualifying graduate work rights remain different categories", () => {
  assert.deepEqual(find({ document: "work-permit", status: "student" }).map((g) => g.id), ["tw-student-work"]);
  assert.deepEqual(find({ document: "work-permit", status: "overseas-student" }).map((g) => g.id), ["tw-student-work"]);
  const graduates = find({ document: "work-permit", status: "job-seeker" });
  assert.deepEqual(graduates.map((g) => g.id), ["tw-graduate-work"]);
  assert.match(graduates[0].translations.en.beforeYouStart[0].text, /without a separate work permit/);
  assert.match(graduates[0].translations.en.scope, /Not a blanket work exemption/);
  assert.deepEqual(find({ document: "work-permit", status: "worker" }), []);
});
test("worker, student and other-resident insurance and health resources are scoped", () => {
  assert(find({ document: "nhi", status: "student" }).every((g) => g.id === "tw-nhi-students"));
  assert.deepEqual(find({ document: "nhi", status: "worker" }).map((g) => g.id), ["tw-nhi-employees"]);
  assert.deepEqual(find({ document: "nhi", status: "dependent" }).map((g) => g.id), ["tw-nhi-other-residents"]);
  assert.deepEqual(find({ document: "health-certificate", status: "student" }).map((g) => g.id), ["tw-health-students"]);
  assert.deepEqual(find({ document: "health-certificate", status: "worker" }).map((g) => g.id), ["tw-health-workers"]);
  assert.deepEqual(find({ document: "health-certificate", status: "professional" }).map((g) => g.id), ["tw-health-residence"]);
  assert(catalog.needsResidenceStatus({ ...catalog.emptyFilters, residence: "TW", document: "nhi" }));
});
test("Gold Card and APRC do not become an ordinary ARC renewal or universal eligibility promise", () => {
  const gold = find({ document: "gold-card", status: "gold-card" })[0];
  assert.equal(gold.id, "tw-gold-card");
  assert.match(gold.timing.text, /cutoff/);
  assert.match(gold.translations.en.importantNotes[0].text, /residence-only/);
  const aprc = find({ document: "aprc", status: "student" })[0];
  assert.equal(aprc.serviceType, "application");
  assert.match(aprc.translations.en.scope, /does not establish/);
  assert.deepEqual(find({ nationality: "TW", document: "gold-card" }), []);
  assert.deepEqual(find({ nationality: "TW", document: "aprc" }), []);
  for (const nationality of ["CN", "HK", "MO"]) {
    assert.deepEqual(find({ nationality, document: "arc", status: "worker" }), []);
    assert.deepEqual(find({ nationality, document: "aprc" }), []);
  }
  const related = catalog.relatedGuides(find({ document: "passport" })[0]);
  assert(related.length <= 4);
  assert(!related.some((guide) => guide.nationalities.kind === "only" && !guide.nationalities.codes.includes("ID")));
});
test("government instructions and private issuer examples are explicitly distinguished", () => {
  const bank = find({ document: "bank-card" })[0];
  assert(bank.sources.every((source) => source.kind === "issuer"));
  assert.match(bank.translations.en.scope, /CTBC-specific policies/);
  for (const source of bank.sources) {
    assert(catalog.isOfficialUrl(source.url));
    assert(!catalog.isOfficialUrl(`${source.url}&redirect=https://evil.test`));
  }
});
test("dates distinguish benefits, issuer acceptance, event-based changes and actual documents", () => {
  const get = (id) => catalog.publishedGuides.find((guide) => guide.id === id);
  assert.equal(get("tw-nhi-dental").timing.kind, "recurring-benefit");
  for (const id of ["ielts-results", "toeic-results", "tocfl-results", "toefl-results"]) assert.equal(get(id).timing.kind, "recipient-policy");
  for (const id of ["tw-national-id", "tw-employment-contract", "tw-rental-contract"]) assert.equal(get(id).timing.kind, "event-based");
  assert.match(get("tocfl-results").timing.text, /not proof.*expires/);
  assert.match(get("ielts-results").timing.text, /may accept older results/);
  assert.match(get("tw-driving-renewal").timing.text, /2026-05-31/);
  assert.match(get("tw-police-certificate").translations.en.beforeYouStart[0].text, /Foreign nationals.*in-person/);
});
test("National ID and Indonesian-issued international permit cannot leak across citizenship or residence", () => {
  assert.deepEqual(find({ document: "national-id" }), []);
  assert.equal(find({ nationality: "TW", document: "national-id" })[0].id, "tw-national-id");
  assert.deepEqual(find({ document: "international-driving-permit" }), []);
  assert.equal(find({ residence: "ID", document: "international-driving-permit" })[0].id, "id-international-driving");
  assert.deepEqual(find({ nationality: "TW", residence: "ID", document: "international-driving-permit" }), []);
});
test("all interface languages label new topics and statuses without publishing unreviewed translations", () => {
  for (const language of catalog.RESOURCE_LANGUAGES) {
    for (const guide of catalog.publishedGuides) {
      assert(copy[language].documents[guide.document]);
      for (const status of guide.residenceStatuses ?? []) assert(copy[language].statuses[status]);
    }
    assert(copy[language].coverage.includes("{count}"));
  }
  assert(!catalog.resolveResourcePath("/zh-tw/resources/taiwan-employment-gold-card-renewal"));
});
