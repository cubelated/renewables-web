import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer } from "vite";
import { createServer as createHttpServer } from "node:http";

let server, order, catalog, render;
before(async () => {
  server = await createServer({ server: { middlewareMode: true, hmr: { server: createHttpServer() } }, appType: "custom", optimizeDeps: { noDiscovery: true, entries: [] } });
  order = await server.ssrLoadModule("/src/lib/resource-order.ts");
  catalog = await server.ssrLoadModule("/src/content/resources/guides.ts");
  render = (await server.ssrLoadModule("/src/react-app/entry-server.tsx")).render;
});
after(async () => { await server?.close(); });
const ids = (guides) => guides.map((guide) => guide.id);
const title = (guide, language) => (guide.translations[language] ?? guide.translations.en).title;
function assertAlphabetical(guides, language = "en") {
  const collator = new Intl.Collator(language, { sensitivity: "base", numeric: true });
  for (let i = 1; i < guides.length; i++) assert(collator.compare(title(guides[i - 1], language), title(guides[i], language)) <= 0);
}

test("time-zone hints use explicit supported residences without guessing from offsets", () => {
  assert.equal(order.residenceForTimeZone("Asia/Taipei"), "TW");
  for (const zone of ["Asia/Jakarta", "Asia/Pontianak", "Asia/Makassar", "Asia/Jayapura", "Asia/Djakarta", "Asia/Ujung_Pandang"]) assert.equal(order.residenceForTimeZone(zone), "ID");
  for (const zone of [null, "", "UTC", "Etc/GMT-8", "Asia/Shanghai", "Asia/Singapore", "America/New_York", "invalid", "toString"]) assert.equal(order.residenceForTimeZone(zone), undefined);
});

test("Taiwan and Indonesia matches precede other guides, alphabetically within both groups", () => {
  const original = ids(catalog.publishedGuides);
  for (const [zone, residence] of [["Asia/Taipei", "TW"], ["Asia/Jakarta", "ID"], ["Asia/Jayapura", "ID"]]) {
    const sorted = order.sortResourceGuides(catalog.publishedGuides, "en", zone);
    const relevant = sorted.filter((guide) => guide.residences.includes(residence));
    const other = sorted.filter((guide) => !guide.residences.includes(residence));
    assert.deepEqual(ids(sorted), [...ids(relevant), ...ids(other)]);
    assertAlphabetical(relevant); assertAlphabetical(other);
    assert.deepEqual([...ids(sorted)].sort(), [...original].sort());
  }
  assert.deepEqual(ids(catalog.publishedGuides), original, "Sorting must not mutate the catalog");
});

test("absent, hidden and unsupported time zones fall back to alphabetical order", () => {
  for (const zone of [null, "UTC", "Asia/Shanghai", "Europe/London"]) assertAlphabetical(order.sortResourceGuides(catalog.publishedGuides, "en", zone));
  const original = Intl.DateTimeFormat;
  try {
    Intl.DateTimeFormat = () => { throw new Error("Time zone unavailable"); };
    assert.equal(order.readDeviceTimeZone(), null);
  } finally { Intl.DateTimeFormat = original; }
});

test("sorting uses the displayed translation or honest English fallback", () => {
  for (const language of catalog.RESOURCE_LANGUAGES) assertAlphabetical(order.sortResourceGuides(catalog.publishedGuides, language, null), language);
  const guide = catalog.publishedGuides[0];
  const fixtures = [
    { ...guide, id: "z", slug: "z", translations: { en: { ...guide.translations.en, title: "Zulu" }, "id-ID": { ...guide.translations.en, title: "Alfa" } } },
    { ...guide, id: "a", slug: "a", translations: { en: { ...guide.translations.en, title: "Alpha" }, "id-ID": { ...guide.translations.en, title: "Zeta" } } },
  ];
  assert.deepEqual(ids(order.sortResourceGuides(fixtures, "en", null)), ["a", "z"]);
  assert.deepEqual(ids(order.sortResourceGuides(fixtures, "id-ID", null)), ["z", "a"]);
});

test("reordering does not widen applicability, infer citizenship or expose drafts", () => {
  const filters = { ...catalog.emptyFilters, nationality: "ID", residence: "TW", document: "passport" };
  assert.deepEqual(ids(order.sortResourceGuides(catalog.findGuides(filters), "en", "Asia/Jakarta")), ["id-passport-tw"]);
  assert.deepEqual(order.sortResourceGuides(catalog.findGuides({ ...filters, nationality: "US" }), "en", "Asia/Taipei"), []);
});

test("prerendering stays alphabetical independently of the build machine's time zone", () => {
  assert.equal(order.serverDeviceTimeZone(), null);
  const previous = process.env.TZ;
  try {
    const pages = ["Asia/Taipei", "Asia/Jakarta", "UTC"].map((zone) => { process.env.TZ = zone; return render("/resources"); });
    for (const html of pages) {
      const expected = order.sortResourceGuides(catalog.publishedGuides, "en", null);
      const actual = [...html.matchAll(/data-guide="([^"]+)"/g)].map((match) => match[1]);
      assert.deepEqual(actual, ids(expected));
      assert(html.includes('data-resource-order="alphabetical"'));
      assert.match(html, /id="resource-residence"[^>]*data-residence-source="unavailable"[^>]*><option value="" selected=""/);
      assert(!html.includes("Suggested from your browser time zone"), "Static HTML must not infer a visitor residence");
    }
  } finally { if (previous === undefined) delete process.env.TZ; else process.env.TZ = previous; }
});
