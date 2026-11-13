import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { createServer as createHttpServer } from "node:http";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { readFile } from "node:fs/promises";

let server, catalog, seo, App, copy, discovery, renderSeoHead;
before(async () => {
  server = await createServer({ server: { middlewareMode: true, hmr: { server: createHttpServer() } }, appType: "custom", optimizeDeps: { noDiscovery: true, entries: [] } });
  catalog = await server.ssrLoadModule("/src/content/resources/guides.ts");
  seo = await server.ssrLoadModule("/src/seo.ts");
  copy = (await server.ssrLoadModule("/src/content/resources/locales.ts")).resourceCopy;
  discovery = (await server.ssrLoadModule("/src/content/resources/discovery.ts")).resourceDiscoveryCopy;
  renderSeoHead = (await server.ssrLoadModule("/src/lib/seo-head.ts")).renderSeoHead;
  App = (await server.ssrLoadModule("/src/react-app/App.tsx")).default;
});
after(async () => { await server?.close(); });
const match = (filters) => catalog.findGuides({ ...catalog.emptyFilters, ...filters }).map((guide) => guide.id);
const render = (path) => renderToString(createElement(App, { path }));

test("the subdomain has one consistent Renewables site-name preference rather than the parent domain", async () => {
  const website = (path) => seo.getPageSeo(path).structuredData?.["@graph"].filter((entry) => entry["@type"] === "WebSite") ?? [];
  const primary = website("/");
  assert.equal(primary.length, 1);
  assert.equal(primary[0].name, "Renewables");
  assert.equal(primary[0].url, "https://renewables.cubelated.com/");
  assert.deepEqual(primary[0].alternateName, ["Renewables by Cubelated", "renewables.cubelated.com"]);
  for (const path of seo.INDEXED_PATHS) {
    const entries = website(path);
    assert(entries.length <= 1);
    if (entries.length) assert.deepEqual(entries[0].alternateName, primary[0].alternateName);
    assert(renderSeoHead(seo.getPageSeo(path)).includes('property="og:site_name" content="Renewables"'));
  }
  assert(render("/").includes("Renewables by Cubelated"));
  const manifest = JSON.parse(await readFile("public/site.webmanifest", "utf8"));
  assert.equal(manifest.name, "Renewables");
  assert.equal(manifest.short_name, "Renewables");
  assert((await readFile("index.html", "utf8")).includes('name="application-name" content="Renewables"'));
});

test("passport matching separates citizenship, residence, and issuing authority", () => {
  assert.deepEqual(match({ nationality: "ID", residence: "TW", document: "passport" }), ["id-passport-tw"]);
  assert.deepEqual(match({ nationality: "TW", residence: "TW", document: "passport" }), ["tw-passport-domestic"]);
  assert.deepEqual(match({ nationality: "PH", residence: "TW", document: "passport" }), ["ph-passport-tw"]);
  assert.deepEqual(match({ nationality: "TH", residence: "TW", document: "passport" }), ["th-passport-tw"]);
  assert.deepEqual(match({ nationality: "GB", residence: "TW", document: "passport" }), ["gb-passport-tw"]);
  for (const nationality of ["OTHER", "US", "CN", "VN"]) assert.deepEqual(match({ nationality, residence: "TW", document: "passport" }), []);
  assert.deepEqual(match({ nationality: "ID", residence: "ID", document: "passport" }), ["id-passport-domestic"]);
});
test("ARC matching respects student, migrant-worker, and unsupported statuses", () => {
  const filters = { nationality: "ID", residence: "TW", document: "arc" };
  assert.deepEqual(match(filters), ["tw-arc-students", "tw-arc-workers", "tw-arc-professionals"]);
  assert.deepEqual(match({ ...filters, status: "student" }), ["tw-arc-students"]);
  assert.deepEqual(match({ ...filters, status: "worker" }), ["tw-arc-workers"]);
  assert.deepEqual(match({ ...filters, status: "overseas-student" }), ["tw-arc-students"]);
  assert.deepEqual(match({ ...filters, status: "professional" }), ["tw-arc-professionals"]);
  for (const status of ["dependent", "gold-card", "other"]) assert.deepEqual(match({ ...filters, status }), []);
  for (const nationality of ["TW", "CN"]) assert.deepEqual(match({ ...filters, nationality }), []);
  for (const nationality of ["HK", "MO"]) assert.deepEqual(match({ ...filters, nationality, status: "professional" }), ["hk-mo-work-residence"]);
  assert.equal(match({ ...filters, nationality: "US" }).length, 3);
});
test("unsupported documents never inherit other procedures", () => {
  for (const document of ["visa", "insurance", "vehicle-registration"]) assert.deepEqual(match({ nationality: "ID", residence: "TW", document }), []);
});
test("keyword search intersects applicability and searches reviewed translations", () => {
  assert.deepEqual(match({ query: "KDEI passport", residence: "TW" }), ["id-passport-tw"]);
  assert.deepEqual(match({ query: "perpanjang paspor", nationality: "TW" }), []);
  assert.deepEqual(match({ query: "居留證延期申請", status: "student" }), ["tw-arc-students"]);
  assert.deepEqual(match({ query: "no such guide" }), []);
});
test("residence status appears only for relevant document combinations", () => {
  assert(catalog.needsResidenceStatus({ ...catalog.emptyFilters, document: "arc", residence: "TW" }));
  for (const filters of [{ document: "passport" }, { document: "arc", residence: "ID" }, { document: "arc", nationality: "TW" }]) assert(!catalog.needsResidenceStatus({ ...catalog.emptyFilters, ...filters }));
});
test("published catalog has review evidence, sources, authorities, and required applicability", () => {
  assert(catalog.publishedGuides.length >= 25);
  assert.doesNotThrow(() => catalog.validateGuides(catalog.resourceGuides));
  for (const guide of catalog.publishedGuides) {
    assert(guide.reviewedOn <= new Date().toISOString().slice(0, 10));
    assert(guide.sources.every((source) => catalog.isOfficialUrl(source.url)));
    assert(!guide.sources.find((source) => source.id === guide.authority.sourceId).access.includes("unavailable"));
  }
});
test("publication validation rejects duplicate slugs, absent evidence, placeholders, and unsafe URLs", () => {
  const first = structuredClone(catalog.resourceGuides[0]);
  assert.throws(() => catalog.validateGuides([first, first]), /Duplicate/);
  for (const mutate of [
    (guide) => { guide.authority.sourceId = "missing"; },
    (guide) => { guide.reviewedOn = ""; },
    (guide) => { guide.sources[0].url = "http://www.kdei-taipei.org/paspor"; },
    (guide) => { guide.translations.en.title = "TODO"; },
    (guide) => { guide.residences = []; },
    (guide) => { guide.translations.en.steps[0].sourceIds = ["kdei-requirements"]; },
    (guide) => { guide.translationReviews.en = ""; },
  ]) { const guide = structuredClone(first); mutate(guide); assert.throws(() => catalog.validateGuides([guide])); }
  for (const url of ["javascript:alert(1)", "https://www.kdei-taipei.org.evil.test/paspor", "https://user@www.kdei-taipei.org/paspor", "https://www.kdei-taipei.org/paspor?redirect=https://evil.test"]) assert(!catalog.isOfficialUrl(url));
});
test("draft and unavailable guides cannot be matched or indexed", () => {
  for (const editorialStatus of ["draft", "unavailable"]) {
    const fixture = { ...catalog.resourceGuides[0], slug: "not-published", editorialStatus };
    assert.deepEqual(catalog.findGuides(catalog.emptyFilters, [fixture]), []);
    assert.equal(catalog.resourceResultState(catalog.emptyFilters, [fixture]), editorialStatus === "draft" ? "needs-verification" : "unavailable");
    assert(!catalog.resolveResourcePath("/resources/not-published"));
    assert(seo.getPageSeo("/resources/not-published").robots.startsWith("noindex"));
  }
  assert.equal(catalog.resourceResultState({ ...catalog.emptyFilters, document: "insurance" }), "no-match");
});
test("every published route has unique SEO, direct SSR, a stable canonical and real content", () => {
  const titles = new Set();
  for (const path of catalog.RESOURCE_PATHS) {
    assert(seo.INDEXED_PATHS.includes(path));
    const metadata = seo.getPageSeo(path);
    assert(!titles.has(metadata.title)); titles.add(metadata.title);
    assert.equal(metadata.canonical, `https://renewables.cubelated.com${path}`);
    assert(metadata.robots.startsWith("index"));
    assert(!JSON.stringify(metadata.structuredData).includes("FAQPage"));
    const html = render(path);
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
    assert(html.includes("resource-main"));
    const guide = catalog.resolveResourcePath(path).guide;
    if (guide) {
      assert(html.includes('id="checklist"') && html.includes('id="sources"'));
      assert(html.includes(guide.reviewedOn));
      assert(html.includes('target="_blank" rel="noopener noreferrer"'));
      assert(html.includes("mailto:cubelated@gmail.com?subject="));
    }
  }
});
test("filters cannot create arbitrary canonical or indexable routes", () => {
  assert.equal(seo.getPageSeo("/resources?nationality=ID&document=passport").canonical, "https://renewables.cubelated.com/resources");
  assert(!catalog.RESOURCE_PATHS.some((path) => /[?#]/.test(path)));
  assert(seo.getPageSeo("/resources/unsupported-country").robots.startsWith("noindex"));
  assert(render("/resources/unsupported-country").includes("Page not found"));
  assert(!catalog.resolveResourcePath("/id/resources/taiwan-arc-extension-students"));
});
test("hreflang only references reviewed versions and is reciprocal", () => {
  for (const path of catalog.RESOURCE_PATHS) {
    const meta = seo.getPageSeo(path);
    const resource = catalog.resolveResourcePath(path);
    const languages = resource.guide ? catalog.availableLanguages(resource.guide) : catalog.RESOURCE_LANGUAGES;
    const alternatePath = (language) => resource.guide ? catalog.guidePath(resource.guide, language) : catalog.directoryPath(language);
    assert.deepEqual(meta.alternates, [
      ...languages.map((language) => ({ language, url: `${seo.SITE_URL}${alternatePath(language)}` })),
      { language: "x-default", url: `${seo.SITE_URL}${alternatePath("en")}` },
    ]);
    for (const alternate of meta.alternates) {
      const alternatePath = new URL(alternate.url).pathname;
      assert(catalog.RESOURCE_PATHS.includes(alternatePath));
      if (alternate.language !== "x-default") assert(seo.getPageSeo(alternatePath).alternates.some((item) => item.url === meta.canonical && item.language === meta.language));
    }
  }
});

test("resource search, social and schema metadata use the published page's actual language", () => {
  const ogLocales = { en: "en_US", "id-ID": "id_ID", "zh-TW": "zh_TW" };
  assert.equal(new Set(catalog.RESOURCE_LANGUAGES.map((language) => copy[language].seoImageAlt)).size, 3);
  for (const path of catalog.RESOURCE_PATHS) {
    const { language, guide } = catalog.resolveResourcePath(path);
    const content = guide?.translations[language];
    const metadata = seo.getPageSeo(path);
    assert.equal(metadata.title, `${content?.title ?? discovery[language].metaTitle} | Renewables`);
    assert.equal(metadata.description, content?.summary ?? copy[language].metaDescription);
    assert.equal(metadata.language, language);
    assert.equal(metadata.ogLocale, ogLocales[language]);
    assert.equal(metadata.imageAlt, copy[language].seoImageAlt);
    assert.deepEqual(metadata.alternateLocales, metadata.alternates.filter((entry) => entry.language !== language && entry.language !== "x-default").map((entry) => ogLocales[entry.language]));
    const graph = metadata.structuredData["@graph"];
    const entity = graph.find((entry) => entry["@type"] === (guide ? "Article" : "CollectionPage"));
    assert.equal(entity.inLanguage, language);
    assert.equal(entity.description, metadata.description);
    assert.equal(entity.headline ?? entity.name, content?.title ?? copy[language].name);
    assert.equal(graph.find((entry) => entry["@type"] === "BreadcrumbList").itemListElement[1].name, copy[language].name);
    const head = renderSeoHead(metadata);
    assert.equal(head.includes('property="article:modified_time"'), Boolean(guide));
    for (const field of ["og:image:alt", "twitter:image:alt"]) assert(head.includes(`content="${metadata.imageAlt}"`) && head.includes(`="${field}"`));
    const filtered = seo.getPageSeo(`${path}?language=other&nationality=ID`);
    assert.equal(filtered.canonical, metadata.canonical);
    assert.equal(filtered.title, metadata.title);
  }
});

test("directory discovery schema lists the visible published guides in their real content languages", () => {
  for (const language of catalog.RESOURCE_LANGUAGES) {
    const path = catalog.directoryPath(language);
    const metadata = seo.getPageSeo(path);
    const graph = metadata.structuredData["@graph"];
    const list = graph.find((entry) => entry["@type"] === "ItemList");
    assert.equal(list.numberOfItems, catalog.publishedGuides.length);
    const html = render(path);
    const renderedIds = [...html.matchAll(/data-guide="([^"]+)"/g)].map(([, id]) => id);
    assert.deepEqual(list.itemListElement.map((entry) => {
      const resolved = catalog.resolveResourcePath(new URL(entry.item.url).pathname);
      assert(resolved?.guide);
      assert.equal(entry.item.inLanguage, resolved.language);
      assert.equal(entry.item.name, resolved.guide.translations[resolved.language].title);
      assert(html.includes(`href="${new URL(entry.item.url).pathname}"`));
      return resolved.guide.id;
    }), renderedIds);
    assert.deepEqual(list.itemListElement.map((entry) => entry.position), renderedIds.map((_, index) => index + 1));
    assert.equal(graph.find((entry) => entry["@type"] === "CollectionPage").mainEntity["@id"], list["@id"]);
  }
});

test("resource attribution identifies Renewables separately from the official issuing authority", () => {
  for (const path of catalog.RESOURCE_PATHS) {
    const { language, guide } = catalog.resolveResourcePath(path);
    const metadata = seo.getPageSeo(path);
    const graph = metadata.structuredData["@graph"];
    const publisher = graph.find((entry) => entry["@type"] === "Organization");
    assert.equal(publisher.name, "Renewables");
    assert.equal(publisher.url, `${seo.SITE_URL}/`);
    assert.equal(new Set(graph.map((entry) => entry["@id"])).size, graph.length);
    assert(render(path).includes(`id="editorial-policy"`));
    assert(render(path).includes(discovery[language].editorialTitle));
    if (guide) {
      const article = graph.find((entry) => entry["@type"] === "Article");
      assert.equal(article.author["@id"], publisher["@id"]);
      assert.equal(article.publisher["@id"], publisher["@id"]);
      assert(article.citation.includes(guide.sources.find((source) => source.id === guide.authority.sourceId).url));
      assert(render(path).includes('class="resource-key-facts"'));
      assert(metadata.robots.includes("max-snippet:-1"));
    }
  }
});

test("missing guide translations never create indexable alternate-language copies", () => {
  for (const guide of catalog.publishedGuides) {
    for (const language of catalog.RESOURCE_LANGUAGES.filter((language) => !catalog.availableLanguages(guide).includes(language))) {
      const path = catalog.guidePath(guide, language);
      assert.equal(catalog.resolveResourcePath(path), undefined);
      assert(!seo.INDEXED_PATHS.includes(path));
      assert(seo.getPageSeo(path).robots.startsWith("noindex"));
      assert(render(path).includes("Page not found"));
      assert(!seo.getPageSeo(catalog.guidePath(guide)).alternates.some((entry) => entry.language === language));
    }
  }
});
test("directory prerenders all published guides, accessible native controls, and language fallback", () => {
  const html = render("/resources");
  for (const id of ["resource-nationality", "resource-residence", "resource-document", "resource-search"]) assert(html.includes(`id="${id}"`));
  assert(html.includes('role="status"') && html.includes('type="button"'));
  assert.equal([...html.matchAll(/data-guide=/g)].length, catalog.publishedGuides.length);
  assert(!html.includes('id="resource-status"'));
  assert(render("/zh-tw/resources").includes("此語言的翻譯尚未發布"));
  assert(render("/id/resources").includes("Perpanjangan atau Penggantian Paspor"));
});
test("Cloudflare assets retain real 404 handling and static direct-route serving", async () => {
  const config = JSON.parse(await readFile("wrangler.json", "utf8"));
  assert.equal(config.assets.not_found_handling, "404-page");
  assert.equal(config.assets.html_handling, "drop-trailing-slash");
  assert(!config.assets.run_worker_first.includes("/resources/*"));
});
