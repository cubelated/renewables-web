import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getPageSeo,
  INDEXED_PATHS,
  render,
} from "../.ssr/entry-server.js";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const distDir = path.join(projectRoot, "dist");
const ssrDir = path.join(projectRoot, ".ssr");
const template = await readFile(path.join(distDir, "index.html"), "utf8");

for (const pathname of INDEXED_PATHS) {
  await writePage(pathname, pathname === "/" ? "index.html" : `${pathname.slice(1)}/index.html`);
}

await writePage("/404", "404.html");
await rm(ssrDir, { recursive: true, force: true });

async function writePage(pathname, outputPath) {
  const destination = path.join(distDir, outputPath);
  const html = injectPage(template, pathname);

  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, html);
}

function injectPage(html, pathname) {
  const seo = getPageSeo(pathname);
  const renderedApp = render(pathname);
  const withoutSeo = html
    .replace(/\s*<title[^>]*data-seo[^>]*>[\s\S]*?<\/title>/gi, "")
    .replace(/\s*<(?:meta|link)[^>]*data-seo[^>]*>/gi, "")
    .replace(
      /\s*<script[^>]*data-seo[^>]*>[\s\S]*?<\/script>/gi,
      "",
    );

  return withoutSeo
    .replace("</head>", `${renderHead(seo)}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${renderedApp}</div>`);
}

function renderHead(seo) {
  const title = escapeHtml(seo.title);
  const description = escapeHtml(seo.description);
  const canonical = escapeHtml(seo.canonical);
  const image = "https://renewables.cubelated.com/social-preview.png";
  const structuredData = seo.structuredData
    ? `\n\t<script type="application/ld+json" data-seo="structured-data">${JSON.stringify(
        seo.structuredData,
      ).replaceAll("<", "\\u003c")}</script>`
    : "";

  return `
	<title data-seo="title">${title}</title>
	<meta name="description" content="${description}" data-seo="description" />
	<meta name="robots" content="${escapeHtml(seo.robots)}" data-seo="robots" />
	<link rel="canonical" href="${canonical}" data-seo="canonical" />
	<meta property="og:type" content="website" data-seo="og" />
	<meta property="og:site_name" content="Renewables" data-seo="og" />
	<meta property="og:locale" content="en_US" data-seo="og" />
	<meta property="og:title" content="${title}" data-seo="og" />
	<meta property="og:description" content="${description}" data-seo="og" />
	<meta property="og:url" content="${canonical}" data-seo="og" />
	<meta property="og:image" content="${image}" data-seo="og" />
	<meta property="og:image:width" content="1200" data-seo="og" />
	<meta property="og:image:height" content="630" data-seo="og" />
	<meta property="og:image:alt" content="Renewables life admin and expiry reminder app" data-seo="og" />
	<meta name="twitter:card" content="summary_large_image" data-seo="twitter" />
	<meta name="twitter:title" content="${title}" data-seo="twitter" />
	<meta name="twitter:description" content="${description}" data-seo="twitter" />
	<meta name="twitter:image" content="${image}" data-seo="twitter" />${structuredData}`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
