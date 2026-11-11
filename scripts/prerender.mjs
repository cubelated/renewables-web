import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getPageSeo,
  INDEXED_PATHS,
  render,
  renderSeoHead,
  ocrVideo,
} from "../.ssr/entry-server.js";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const distDir = path.join(projectRoot, "dist");
const ssrDir = path.join(projectRoot, ".ssr");
const template = await readFile(path.join(distDir, "index.html"), "utf8");

const videoFile = await stat(path.join(distDir, "media/ocr-demo.mp4")).catch((error) => {
  if (error.code === "ENOENT") return null;
  throw error;
});
if (videoFile && videoFile.size !== ocrVideo.byteLength) {
  throw new Error("The OCR recording changed. Inspect it and update src/content/ocr-video.ts before building; its byte length is required for correct range responses.");
}

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
  if (!renderedApp.includes("<h1")) {
    throw new Error(`Refusing to emit an empty or incomplete page for ${pathname}`);
  }
  const withoutSeo = html
    .replace(/\s*<title[^>]*data-seo[^>]*>[\s\S]*?<\/title>/gi, "")
    .replace(/\s*<(?:meta|link)[^>]*data-seo[^>]*>/gi, "")
    .replace(
      /\s*<script[^>]*data-seo[^>]*>[\s\S]*?<\/script>/gi,
      "",
    );

  // Only the homepage uses the phone hero; other routes must not download it.
  const pageTemplate = pathname === "/" ? withoutSeo : withoutSeo.replace(/\s*<link\b[^>]*rel="preload"[^>]*href="\/app-phone\.webp"[^>]*>/gi, "");
  return pageTemplate
    .replace('<html lang="en">', `<html lang="${seo.language}">`)
    .replace("</head>", `${renderSeoHead(seo)}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${renderedApp}</div>`);
}
