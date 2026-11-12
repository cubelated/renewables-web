/** Optional editorial availability check, never part of runtime or proof of factual correctness. */
import { createServer } from "vite";
import { createServer as createHttpServer } from "node:http";

const server = await createServer({ server: { middlewareMode: true, hmr: { server: createHttpServer() } }, appType: "custom", optimizeDeps: { noDiscovery: true, entries: [] } });
try {
  const { publishedGuides, validateGuides } = await server.ssrLoadModule("/src/content/resources/guides.ts");
  validateGuides(publishedGuides);
  const sources = new Map(publishedGuides.flatMap((guide) => guide.sources.map((source) => [source.url, source])));
  const { workforceProfiles, workforceProfileSources } = await server.ssrLoadModule("/src/content/resources/workforce-profiles.ts");
  for (const profile of workforceProfiles) for (const source of workforceProfileSources(profile)) sources.set(source.url, source);
  for (const source of sources.values()) {
    if (!process.argv.includes("--online")) { console.log(`${source.access}\t${source.checkedOn}\t${source.url}`); continue; }
    try {
      const response = await fetch(source.url, { method: "HEAD", redirect: "manual", signal: AbortSignal.timeout(10000) });
      console.log(`${response.status}\t${source.url}${response.headers.has("location") ? `\tRedirect requires review: ${response.headers.get("location")}` : ""}`);
      if (!response.ok) process.exitCode = 1;
    } catch (error) { console.log(`UNAVAILABLE\t${source.url}\t${error.message}`); process.exitCode = 1; }
  }
} finally { await server.close(); }
