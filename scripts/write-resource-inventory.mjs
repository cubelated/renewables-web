import { writeFile } from "node:fs/promises";
import { createServer } from "vite";
import { createServer as createHttpServer } from "node:http";

const server = await createServer({ server: { middlewareMode: true, hmr: { server: createHttpServer() } }, appType: "custom", optimizeDeps: { noDiscovery: true, entries: [] } });
try {
  const { publishedGuides, guidePath } = await server.ssrLoadModule("/src/content/resources/guides.ts");
  const { workforceProfiles, workforceProfileSources } = await server.ssrLoadModule("/src/content/resources/workforce-profiles.ts");
  const cell = (value) => String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
  const nationality = (guide) => guide.nationalities.kind === "any" ? "Any (subject to guide scope)" : guide.nationalities.kind === "only" ? guide.nationalities.codes.join(", ") : `Foreign-national scope, excluding ${guide.nationalities.excludedCodes.join(", ")}`;
  const guideRows = publishedGuides.map((guide) => `| ${cell(guide.translations.en.title)} | \`${guidePath(guide)}\` | ${cell(nationality(guide))}; residence ${guide.residences.join(", ")} | ${cell(guide.residenceStatuses?.join(", ") ?? "Read guide scope")} | ${guide.serviceType ?? "renewal"} | ${guide.reviewedOn} |`).join("\n");
  const sources = new Map();
  for (const guide of publishedGuides) for (const source of guide.sources) {
    const entry = sources.get(source.url) ?? { source, guides: [], claims: new Set() };
    entry.guides.push(guide.id); source.claims.forEach((claim) => entry.claims.add(claim)); sources.set(source.url, entry);
  }
  for (const profile of workforceProfiles) for (const source of workforceProfileSources(profile)) {
    const entry = sources.get(source.url) ?? { source, guides: [], claims: new Set() };
    entry.guides.push(`profile:${profile.country}`); source.claims.forEach((claim) => entry.claims.add(claim)); sources.set(source.url, entry);
  }
  const profileRows = workforceProfiles.map((profile) => `| ${profile.country} | ${profile.context} | ${profile.passportGuideId ? `\`${guidePath(publishedGuides.find((guide) => guide.id === profile.passportGuideId))}\`` : "Checklist unverified; official starting points only where available"} | ${cell(profile.records.map((item) => `${item.title} (${item.tracking})`).join("; ") || "No additional recurring renewal verified; skip invented expiries")} | ${cell(profile.limitation)} | ${profile.reviewedOn} |`).join("\n");
  const sourceRows = [...sources.values()].map(({ source, guides, claims }) => `| [${cell(source.title)}](<${source.url}>) | ${cell(source.organization)} | ${source.kind ?? "government"} | ${source.checkedOn} | ${source.access} | ${cell([...claims].join("; "))} | ${cell(guides.join(", "))} | ${cell(source.note ?? "")} |`).join("\n");
  const markdown = `# Expanded resource and source inventory

Generated from the manually curated catalog. Generation does **not** perform a source review or advance a review date. Every date below is the recorded editorial value.

${publishedGuides.length} logical published guides; ${sources.size} unique official-authority or issuer URLs. New expansion content is English; only explicitly reviewed translations are published at alternate URLs.

## Guides and applicability

| Guide | English route | Nationality / residence | Status scope | Action | Source review |
| --- | --- | --- | --- | --- | --- |
${guideRows}

## Workforce country/region research

${workforceProfiles.length} manually reviewed profiles. The professional table reviewed is September 2026; Australia, New Zealand and Ireland are additional teaching/passport preparation profiles, not a claimed teacher-nationality whitelist. No profile establishes immigration eligibility.

| Country/region | Research context | Passport guide | Other records | Scope / research gap | Reviewed |
| --- | --- | --- | --- | --- | --- |
${profileRows}

## Authority and issuer sources

Access methods: **direct** = page content or service entry was retrieved during review; **official-index** = official indexed text reviewed with limitations recorded; **unavailable** = retained reference, not evidence for instructions. An HTTP response or entry-page visit does not verify a private application, interactive deadline, attachment, or applicant's eligibility.

| Source URL | Organization | Role | Checked | Access | Supported topics | Guide / profile IDs | Limitations |
| --- | --- | --- | --- | --- | --- | --- | --- |
${sourceRows}

## Deliberately unfilled research gaps

- Profiles with an unverified Taiwan passport checklist do not generate guide URLs. U.S., Vietnam, South Korea, South Africa, France, Myanmar, Eswatini and Russia retain explicit gaps. British guidance is a reviewed overseas-service starting point; the interactive Taiwan checklist was not completed. Other-country consular instructions, domestic mailing rules, old archives and unrelated visa pages are not substituted.
- The international-driving-permit guide covers Indonesian-issued SIM Internasional for Indonesian citizens applying in Indonesia. Recognition of a Taiwan-issued permit in Indonesia, or an Indonesian permit in Taiwan, has not been established by this release.
- New guidance has not been published in Indonesian or Traditional Chinese merely to fill a language menu. The directory offers English content transparently when a reviewed translation is absent.
- NHI professional/dependent exceptions, APRC eligibility, work-category changes, and personal examination schedules require confirmation with the responsible authority.
- Bank-card procedures are explicitly CTBC examples. Employment and rental contracts depend on the actual agreement and applicable law; they are not automatically annual renewals.
`;
  await writeFile("docs/renewal-resource-expanded-inventory.md", markdown);
  console.log(`Recorded ${publishedGuides.length} guides and ${sources.size} unique sources without changing review dates.`);
} finally { await server.close(); }
