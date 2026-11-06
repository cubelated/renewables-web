import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

test("video prerendering defers the MP4 and provides an accessible preview", async () => {
  const server = await createServer({
    server: { middlewareMode: true }, appType: "custom",
    optimizeDeps: { noDiscovery: true, entries: [] },
  });
  try {
    const { default: FeatureVideo } = await server.ssrLoadModule("/src/components/FeatureVideo.tsx");
    const html = renderToString(createElement(FeatureVideo, {
      src: "/media/ocr-demo.mp4", poster: "/screenshot-ocr-review.webp", posterWidth: 700, posterHeight: 1501,
    }));
    const videos = [...html.matchAll(/<video\b[^>]*>/g)];
    assert.equal(videos.length, 1);
    assert(videos[0][0].includes('preload="none"'));
    assert(videos[0][0].includes('poster="/screenshot-ocr-review.webp"'));
    assert(!/\bsrc=|\bautoPlay\b|\bautoplay\b|\bloop\b/.test(videos[0][0]));
    assert(/<button[^>]*type="button"[^>]*aria-label="Play the Renewables document scanning demonstration"/.test(html));
    assert(html.includes("<noscript>"));
    const fallback = renderToString(createElement(FeatureVideo, {
      src: null, poster: "/screenshot-ocr-review.webp", posterWidth: 700, posterHeight: 1501,
    }));
    assert(!fallback.includes("<video"));
    assert(!fallback.includes("<button"));
    assert(fallback.includes('src="/screenshot-ocr-review.webp"'));
    assert(fallback.includes("video is currently unavailable"));
  } finally {
    await server.close();
  }
});
