import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const distDir = path.join(projectRoot, "dist");
const pages = [
  {
    file: "index.html",
    canonical: "https://renewables.cubelated.com/",
    robots: "index, follow",
    structuredData: true,
  },
  {
    file: "privacy/index.html",
    heading: "Privacy Policy",
    canonical: "https://renewables.cubelated.com/privacy",
    robots: "index, follow",
  },
  {
    file: "terms/index.html",
    heading: "Terms of Service",
    canonical: "https://renewables.cubelated.com/terms",
    robots: "index, follow",
  },
  {
    file: "support/index.html",
    heading: "How can we help?",
    canonical: "https://renewables.cubelated.com/support",
    robots: "index, follow",
  },
  {
    file: "tools/expiry-calculator/index.html",
    heading: "Expiry date calculator",
    canonical: "https://renewables.cubelated.com/tools/expiry-calculator",
    robots: "index, follow",
    calculator: true,
    language: "en", ogLocale: "en_US",
    title: "Free Expiry Date Calculator & Calendar Converter | Renewables",
    content: ["How expiry countdowns work", "How reminder offsets work", "How calendar conversion works", "How date differences are counted", "Choosing a date format", "Which calendars can I convert?", "Why time zones matter", "Frequently asked questions", "185 days", "民國115年11月11日"],
  },
  {
    file: "zh-tw/tools/expiry-calculator/index.html",
    heading: "到期日計算器",
    canonical: "https://renewables.cubelated.com/zh-tw/tools/expiry-calculator",
    robots: "index, follow", calculator: true,
    language: "zh-TW", ogLocale: "zh_TW",
    title: "免費到期日計算器與曆法換算 | Renewables",
    content: ["到期倒數如何計算？", "提醒日期如何計算？", "曆法換算如何運作？", "日期差距如何計算？", "如何選擇日期格式？", "支援哪些曆法換算？", "為什麼時區很重要？", "常見問題", "185天", "民國115年11月11日"],
  },
  {
    file: "id/tools/expiry-calculator/index.html",
    heading: "Kalkulator kedaluwarsa",
    canonical: "https://renewables.cubelated.com/id/tools/expiry-calculator",
    robots: "index, follow", calculator: true,
    language: "id-ID", ogLocale: "id_ID",
    title: "Kalkulator Kedaluwarsa & Konversi Kalender Gratis | Renewables",
    content: ["Cara kerja hitung mundur kedaluwarsa", "Cara menghitung tanggal pengingat", "Cara kerja konversi kalender", "Cara menghitung selisih tanggal", "Memilih format tanggal", "Kalender apa yang dapat dikonversi?", "Mengapa zona waktu penting", "Pertanyaan umum", "185 hari", "hitung masa berlaku dokumen"],
  },
  {
    file: "404.html",
    canonical: "https://renewables.cubelated.com/404",
    robots: "noindex, follow",
  },
];

const titles = new Set();
const descriptions = new Set();
for (const page of pages) {
  const html = await readFile(path.join(distDir, page.file), "utf8");
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
  assert(head, `${page.file} needs a complete HTML head`);
  const pageTitles = [...head.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
  assert(pageTitles.length === 1 && pageTitles[0][1].trim(), `${page.file} needs exactly one nonempty title`);
  const title = pageTitles[0][1];
  assert(html.includes(`<html lang="${page.language ?? "en"}">`), `${page.file} has an incorrect document language`);
  assert(metaContent(head, "property", "og:locale") === (page.ogLocale ?? "en_US"), `${page.file} has an incorrect social locale`);
  const description = metaContent(head, "name", "description");
  assert(!titles.has(title), `${page.file} duplicates another page title`);
  assert(!descriptions.has(description), `${page.file} duplicates another page description`);
  titles.add(title); descriptions.add(description);
  assert([...head.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/gi)].length === 1, `${page.file} needs exactly one canonical`);
  assert(metaContent(head, "property", "og:title") === title, `${page.file} social title differs from its title`);
  assert(metaContent(head, "property", "og:description") === description, `${page.file} social description differs from its description`);
  assert(metaContent(head, "property", "og:url") === page.canonical, `${page.file} social URL differs from its canonical`);
  assert(metaContent(head, "name", "twitter:title") === title, `${page.file} Twitter title differs from its title`);
  assert(metaContent(head, "name", "twitter:description") === description, `${page.file} Twitter description differs from its description`);
  const socialImage = metaContent(head, "property", "og:image");
  assert(metaContent(head, "name", "twitter:image") === socialImage, `${page.file} social images differ`);
  assert(metaContent(head, "name", "twitter:image:alt") === metaContent(head, "property", "og:image:alt"), `${page.file} needs consistent social image descriptions`);
  const imageUrl = new URL(socialImage);
  assert(imageUrl.protocol === "https:", `${page.file} needs an HTTPS social image`);
  if (imageUrl.origin === "https://renewables.cubelated.com") {
    const image = await readFile(path.join(distDir, imageUrl.pathname));
    assert(image.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), `${page.file} social image must be an actual PNG`);
    assert(metaContent(head, "property", "og:image:type") === "image/png", `${page.file} has an incorrect social image MIME type`);
    assert(Number(metaContent(head, "property", "og:image:width")) === image.readUInt32BE(16), `${page.file} has incorrect social image width`);
    assert(Number(metaContent(head, "property", "og:image:height")) === image.readUInt32BE(20), `${page.file} has incorrect social image height`);
  }

  assert(html.includes("<h1"), `${page.file} must contain a pre-rendered h1`);
  assert([...html.matchAll(/<h1[\s>]/g)].length === 1, `${page.file} must have exactly one h1`);
  if (page.heading) {
    assert(
      html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] === page.heading,
      `${page.file} must render its own content instead of a fallback page`,
    );
  }
  assert(
    html.includes(`rel="canonical" href="${page.canonical}"`),
    `${page.file} has an incorrect canonical URL`,
  );
  assert(
    html.includes(`name="robots" content="${page.robots}`),
    `${page.file} has incorrect robots directives`,
  );
  assert(
    html.includes('property="og:title"'),
    `${page.file} is missing Open Graph metadata`,
  );

  const jsonLdMatches = [
    ...html.matchAll(
      /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ];

  if (page.structuredData) {
    assert(jsonLdMatches.length === 1, "Home page must contain one JSON-LD block");
    const graph = JSON.parse(jsonLdMatches[0][1])["@graph"];
    const faq = graph.find((entry) => entry["@type"] === "FAQPage");
    assert(faq.mainEntity.length === 11, "All 11 FAQs must be present in structured data");
    for (const question of faq.mainEntity) {
      assert(html.includes(escapeHtml(question.name)), `Visible FAQ missing: ${question.name}`);
      assert(html.includes(escapeHtml(question.acceptedAnswer.text)), `Visible answer differs from JSON-LD: ${question.name}`);
    }
    assert(html.includes("Scan your documents."), "Hero must be prerendered");
    assert(html.includes("Track expiry dates."), "Tracking message must be prerendered");
    assert(html.includes("Prepare for renewals."), "Renewal message must be prerendered");
    assert(html.includes("Document Expiry Tracker &amp; Renewal Reminder"), "Updated title is missing");
    let previousSection = -1;
    for (const id of ["how-it-works", "features", "renewal-assistant", "templates", "pricing", "faq"]) {
      const position = html.indexOf(`id="${id}"`);
      assert(position > previousSection, `Section missing or out of order: ${id}`);
      previousSection = position;
    }
    assert(!graph.some((entry) => entry.aggregateRating || entry.review), "Do not publish invented ratings or reviews");
    const software = graph.find((entry) => entry["@type"] === "SoftwareApplication");
    assert(software.operatingSystem === "Android, Web", "Only released platforms belong in JSON-LD");
    assert(!software.offers, "Do not publish unverified subscription prices");
    assert(html.includes("Scan your documents.<br/>") && html.includes("Save time."), "Scanning section copy must be prerendered");
    const videos = [...html.matchAll(/<video\b[^>]*>/g)];
    assert(videos.length <= 1, "Only one OCR player may be rendered");
    if (videos.length) {
      const video = videos[0][0];
      assert(video.includes('preload="none"'), "Video must not preload");
      assert(!/\bsrc=|\bautoPlay\b|\bautoplay\b|\bloop\b/.test(video), "Attach the video source only after user interaction");
      const poster = video.match(/poster="([^"]+)"/)?.[1];
      assert(poster, "Video needs a poster");
      await access(path.join(distDir, poster));
      await access(path.join(distDir, "media/ocr-demo.mp4"));
    }
    const hero = html.match(/<img[^>]*class="[^"]*\bhero-phone\b[^"]*"[^>]*>/)?.[0];
    assert(hero && !hero.includes('loading="lazy"'), "Hero image must load eagerly");
    assert(hero.includes('fetchPriority="high"') || hero.includes('fetchpriority="high"'), "Hero must have high fetch priority");
    const hrefs = [...html.matchAll(/<a\b[^>]*href="([^"]*)"/g)].map((match) => match[1]);
    for (const href of hrefs) {
      assert(href && href !== "#", "All links need a real destination");
      if (href.startsWith("#")) assert(html.includes(`id="${href.slice(1)}"`), `Broken section link: ${href}`);
    }
  } else if (page.calculator) {
    assert(jsonLdMatches.length === 1, "Calculator needs its own JSON-LD block");
    const graph = JSON.parse(jsonLdMatches[0][1])["@graph"];
    assert(!graph.some((entry) => entry["@type"] === "FAQPage" || entry.aggregateRating || entry.review), "Do not reuse homepage FAQs or invent ratings");
    const app = graph.find((entry) => entry["@type"] === "WebApplication");
    assert(app?.isAccessibleForFree === true && app?.offers?.price === "0", "Calculator must be described truthfully as free");
    const webPage = graph.find((entry) => entry["@type"] === "WebPage");
    const website = graph.find((entry) => entry["@type"] === "WebSite");
    const breadcrumbs = graph.find((entry) => entry["@type"] === "BreadcrumbList");
    assert(webPage?.url === page.canonical && app?.url === page.canonical, "Calculator schema URLs must match its canonical");
    assert(webPage?.mainEntity?.["@id"] === app?.["@id"] && app?.mainEntityOfPage?.["@id"] === webPage?.["@id"], "Calculator schema must connect the page and application");
    assert(webPage?.inLanguage === page.language, "Calculator schema language must match the prerendered language");
    assert(["en", "zh-TW", "id-ID"].every((language) => app?.inLanguage?.includes(language)), "Calculator app schema must describe supported languages");
    assert(website?.["@id"] === webPage?.isPartOf?.["@id"], "Calculator schema must identify its website");
    assert(breadcrumbs?.["@id"] === webPage?.breadcrumb?.["@id"], "Calculator must connect its breadcrumb schema");
    assert(breadcrumbs?.itemListElement?.at(-1)?.item === page.canonical, "Breadcrumb destination must match the calculator canonical");
    assert(new Set(graph.map((entry) => entry["@id"])).size === graph.length, "Calculator schema IDs must be unique");
    assert(title === escapeHtml(page.title), "Localized calculator title is missing");
    assert(escapeHtml(webPage.name) === title && escapeHtml(webPage.description) === description, "Localized page schema and metadata must agree");
    assert(escapeHtml(app.description) === description && escapeHtml(`${app.name} | Renewables`) === title, "Application schema must be localized");
    const alternates = [...head.matchAll(/<link\b[^>]*rel="alternate"[^>]*>/g)];
    const expectedAlternates = [...pages.filter((entry) => entry.calculator).map((entry) => [entry.language, entry.canonical]), ["x-default", "https://renewables.cubelated.com/tools/expiry-calculator"]];
    assert(alternates.length === expectedAlternates.length, "Every calculator needs all language alternates and x-default");
    for (const [language, url] of expectedAlternates) {
      assert(alternates.filter(([tag]) => tag.includes(`hreflang="${language}"`) && tag.includes(`href="${url}"`)).length === 1, `Missing reciprocal alternate for ${language} on ${page.file}`);
    }
    const alternateLocales = [...head.matchAll(/<meta\b[^>]*property="og:locale:alternate"[^>]*>/g)].map(([tag]) => tag.match(/content="([^"]*)"/)?.[1]);
    assert(alternateLocales.length === 2 && pages.filter((entry) => entry.calculator && entry.language !== page.language).every((entry) => alternateLocales.includes(entry.ogLocale)), "Calculator social locale alternatives must match translated pages");
    for (const entry of pages.filter((entry) => entry.calculator)) {
      const url = new URL(entry.canonical);
      assert(new RegExp(`<a\\b[^>]*href="${url.pathname}"[^>]*`, "i").test(html), `Calculator must contain a crawlable link to ${entry.language}`);
    }
    assert(html.includes('class="calc-workspace" data-nosnippet=""'), "Calculator controls should not supply search snippet text");
    assert(!/<details[^>]*class="calc-help"[^>]*\bopen(?:[=\s>])/.test(html), "SEO explanations must preserve the minimal collapsed help layout");
    assert(!html.includes('href="/app-phone.webp"'), "Calculator must not preload the unrelated homepage hero");
    for (const text of page.content) {
      assert(html.includes(text), `Calculator explanation must be prerendered: ${text}`);
    }
    const headings = [...html.matchAll(/<h([1-6])\b[^>]*>/g)].map((match) => Number(match[1]));
    for (let i = 1; i < headings.length; i++) assert(headings[i] <= headings[i - 1] + 1, "Calculator heading levels must not skip");
    const home = await readFile(path.join(distDir, "index.html"), "utf8");
    const header = home.match(/<header\b[^>]*>([\s\S]*?)<\/header>/)?.[1];
    assert(header?.includes('href="/tools/expiry-calculator"'), "Homepage navigation must link to the calculator");
    const calculatorLinks = [...home.matchAll(/<a\b[^>]*href="\/tools\/expiry-calculator"[^>]*>([\s\S]*?)<\/a>/g)];
    assert(calculatorLinks.some((link) => link[1].replace(/<[^>]*>/g, "").trim() === "Free expiry date calculator"), "Homepage needs a descriptive calculator link");
    assert(html.includes('href="https://app.renewables.cubelated.com/"'), "Calculator web CTA must use the verified destination");
    assert(html.includes('href="https://play.google.com/store/apps/details?id=com.cubelated.renewly"'), "Calculator Play CTA must use the verified destination");
  } else {
    assert(
      jsonLdMatches.length === 0,
      `${page.file} must not reuse home-page structured data`,
    );
  }

  for (const [, tag, src] of html.matchAll(/(<img\b[^>]*src="([^"]+)"[^>]*>)/g)) {
    assert(/\bwidth="\d+"/.test(tag) && /\bheight="\d+"/.test(tag), `Image dimensions missing: ${src}`);
    assert(/\balt="[^"]*"/.test(tag), `Image alt missing: ${src}`);
    if (src.startsWith("/")) await access(path.join(distDir, src));
  }
}

const sitemap = await readFile(path.join(distDir, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
assert(new Set(sitemapUrls).size === sitemapUrls.length, "Sitemap URLs must be unique");
assert(sitemapUrls.length === pages.filter((page) => page.robots.startsWith("index")).length, "Sitemap must contain only canonical, indexable pages");
for (const page of pages.filter((page) => page.robots.startsWith("index"))) {
  assert(
    sitemap.includes(`<loc>${page.canonical}</loc>`),
    `sitemap.xml is missing ${page.canonical}`,
  );
}

const robots = await readFile(path.join(distDir, "robots.txt"), "utf8");
assert(
  robots.includes("Sitemap: https://renewables.cubelated.com/sitemap.xml"),
  "robots.txt must advertise the sitemap",
);
assert(!/^Disallow:\s*\/\s*$/im.test(robots) && !/^Disallow:\s*\/(?:tools|zh-tw|id)(?:\/|\s|$)/im.test(robots), "robots.txt must allow public calculators");

console.log(`Validated SEO output for ${pages.length} pages.`);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function metaContent(head, attribute, name) {
  const tags = [...head.matchAll(new RegExp(`<meta\\b[^>]*\\b${attribute}="${name}"[^>]*>`, "gi"))];
  assert(tags.length === 1, `Expected exactly one ${attribute}="${name}" tag`);
  const content = tags[0][0].match(/\bcontent="([^"]*)"/)?.[1];
  assert(content?.trim(), `Empty ${name} metadata`);
  return content;
}

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
