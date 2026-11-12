/** Read-only checks against a built local preview or the production hostname. */
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const production = "https://renewables.cubelated.com";

export function isAllowedByRobots(text, userAgent, pathname) {
  const groups = [];
  let current;
  for (const line of text.split(/\r?\n/)) {
    const [key, ...rest] = line.split("#")[0].trim().split(":");
    const value = rest.join(":").trim();
    if (key?.toLowerCase() === "user-agent") {
      if (!current || current.hasRules) { current = { agents: [], rules: [], hasRules: false }; groups.push(current); }
      current.agents.push(value.toLowerCase());
    } else if (current && ["allow", "disallow"].includes(key?.toLowerCase())) {
      current.hasRules = true;
      if (value) current.rules.push({ allow: key.toLowerCase() === "allow", pattern: value });
    }
  }
  const agent = userAgent.toLowerCase();
  const score = (group) => Math.max(-1, ...group.agents.map((value) => value === "*" ? 0 : agent.includes(value) ? value.length : -1));
  const best = Math.max(-1, ...groups.map(score));
  const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = groups.filter((group) => score(group) === best).flatMap((group) => group.rules).filter(({ pattern }) => {
    const exact = pattern.endsWith("$");
    const expression = (exact ? pattern.slice(0, -1) : pattern).split("*").map(escape).join(".*");
    return new RegExp(`^${expression}${exact ? "$" : ""}`).test(pathname);
  });
  const specificity = (rule) => new TextEncoder().encode(rule.pattern.replace(/[*$]/g, "")).length;
  matches.sort((a, b) => specificity(b) - specificity(a) || Number(b.allow) - Number(a.allow));
  return matches[0]?.allow ?? true;
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(([, key, double, single]) => [key.toLowerCase(), double ?? single]));
}

export function indexabilityIssues(html, headers, expected) {
  const issues = [];
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  const directives = [headers.get("x-robots-tag") ?? "", ...[...head.matchAll(/<meta\b[^>]*>/gi)].map(([tag]) => attributes(tag)).filter((tag) => ["robots", "googlebot", "bingbot"].includes(tag.name?.toLowerCase())).map((tag) => tag.content ?? "")];
  if (directives.some((value) => /\b(?:noindex|none)\b/i.test(value))) issues.push("Indexing is disabled");
  if (directives.some((value) => /\bnosnippet\b|max-snippet\s*:\s*0\b/i.test(value))) issues.push("Search snippets are disabled");
  const canonical = [...head.matchAll(/<link\b[^>]*>/gi)].map(([tag]) => attributes(tag)).filter((tag) => tag.rel === "canonical");
  if (canonical.length !== 1 || canonical[0].href !== expected.canonical) issues.push("Canonical does not match the published URL");
  if (attributes(html.match(/<html\b[^>]*>/i)?.[0] ?? "").lang !== expected.language) issues.push("Published language does not match the build");
  if (!/<title\b[^>]*>[^<]+<\/title>/i.test(head) || !/<h1\b[^>]*>/.test(html)) issues.push("Missing prerendered title or H1");
  if (!(headers.get("content-type") ?? "").includes("text/html")) issues.push("Unexpected HTML content type");
  if (headers.get("cf-mitigated") === "challenge") issues.push("Cloudflare returned a challenge");
  return issues;
}

async function run() {
  const baseIndex = process.argv.indexOf("--base");
  const base = new URL(baseIndex < 0 ? production : process.argv[baseIndex + 1]);
  if (base.origin !== production && !(["127.0.0.1", "localhost"].includes(base.hostname) && base.protocol === "http:")) throw Error("Use the production hostname or an HTTP localhost preview");
  const request = (pathname) => fetch(new URL(pathname, base), { redirect: "manual", signal: AbortSignal.timeout(15000), headers: { "User-Agent": "Renewables-Discovery-Check/1.0" } });
  const sitemapText = await readFile("dist/sitemap.xml", "utf8");
  const urls = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => new URL(url));
  if (!urls.length || urls.some((url) => url.origin !== production || url.search || url.hash)) throw Error("Build a valid canonical sitemap first");
  const [robotsResponse, sitemapResponse] = await Promise.all([request("/robots.txt"), request("/sitemap.xml")]);
  if (robotsResponse.status !== 200 || sitemapResponse.status !== 200) throw Error("robots.txt and sitemap.xml must both return HTTP 200");
  const [robots, sitemap] = await Promise.all([robotsResponse.text(), sitemapResponse.text()]);
  const issues = [];
  if (!robots.includes(`Sitemap: ${production}/sitemap.xml`)) issues.push({ path: "/robots.txt", message: "Canonical sitemap is not advertised" });
  const actualUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
  if (new Set(actualUrls).size !== actualUrls.length || actualUrls.length !== urls.length || urls.some((url) => !actualUrls.includes(url.href))) issues.push({ path: "/sitemap.xml", message: "Live sitemap differs from the build" });
  const crawlers = ["Googlebot", "bingbot", "OAI-SearchBot"];
  for (const crawler of crawlers) for (const url of urls) if (!isAllowedByRobots(robots, crawler, url.pathname)) issues.push({ path: url.pathname, message: `${crawler} is blocked in robots.txt` });
  let next = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (next < urls.length) {
      const url = urls[next++];
      try {
        const response = await request(url.pathname);
        if (response.status !== 200) { issues.push({ path: url.pathname, message: `HTTP ${response.status}` }); continue; }
        const built = await readFile(url.pathname === "/" ? "dist/index.html" : `dist${url.pathname}/index.html`, "utf8");
        const language = attributes(built.match(/<html\b[^>]*>/i)?.[0] ?? "").lang;
        for (const message of indexabilityIssues(await response.text(), response.headers, { canonical: url.href, language })) issues.push({ path: url.pathname, message });
      } catch (error) { issues.push({ path: url.pathname, message: error.message }); }
    }
  }));
  console.log(JSON.stringify({ base: base.origin, checkedPages: urls.length, robotsCheckedFor: crawlers, issues, limitation: "HTTP and robots checks do not establish search indexing, ranking, citations, or access from a provider's actual crawler IP addresses." }, null, 2));
  if (issues.length) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await run();
