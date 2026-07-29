import { readFile } from "node:fs/promises";
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
    canonical: "https://renewables.cubelated.com/privacy",
    robots: "index, follow",
  },
  {
    file: "terms/index.html",
    canonical: "https://renewables.cubelated.com/terms",
    robots: "index, follow",
  },
  {
    file: "support/index.html",
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
    JSON.parse(jsonLdMatches[0][1]);
  } else {
    assert(
      jsonLdMatches.length === 0,
      `${page.file} must not reuse home-page structured data`,
    );
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
