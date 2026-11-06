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
    file: "404.html",
    canonical: "https://renewables.cubelated.com/404",
    robots: "noindex, follow",
  },
];

for (const page of pages) {
  const html = await readFile(path.join(distDir, page.file), "utf8");

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
for (const page of pages.slice(0, 4)) {
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

console.log(`Validated SEO output for ${pages.length} pages.`);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
