import { indonesianPassportTaiwan } from "./indonesian-passport-taiwan";
import { taiwanArcStudents } from "./taiwan-arc-students";
import { taiwanArcWorkers } from "./taiwan-arc-workers";
import type { ResourceFilters, ResourceGuide, ResourceLanguage } from "./types";
import { additionalPassportGuides } from "./passports";
import { residenceWorkGuides } from "./taiwan-residence-work";
import { healthDrivingGuides } from "./health-driving";
import { contractRecordGuides } from "./contracts-records";
import { languageCertificateGuides } from "./language-certificates";
import { workforcePassportGuides } from "./workforce-passports";
import { workforceDocumentGuides } from "./workforce-documents";
import { isOfficialUrl } from "./source-policy";
export { isOfficialUrl } from "./source-policy";

export const RESOURCE_LANGUAGES: ResourceLanguage[] = ["en", "id-ID", "zh-TW"];
export const languageLabels: Record<ResourceLanguage, string> = { en: "English", "id-ID": "Bahasa Indonesia", "zh-TW": "繁體中文" };
const prefixes: Record<ResourceLanguage, string> = { en: "", "id-ID": "/id", "zh-TW": "/zh-tw" };
export const directoryPath = (language: ResourceLanguage) => `${prefixes[language]}/resources`;
export const guidePath = (guide: ResourceGuide, language: ResourceLanguage = "en") => `${directoryPath(language)}/${guide.slug}`;
export const emptyFilters: ResourceFilters = { nationality: "", residence: "", document: "", status: "", query: "" };

/** Publication gate, also run by prerender and tests. Dates are editorial records, never build timestamps. */
export function validateGuides(guides: ResourceGuide[]): void {
  const slugs = new Set<string>();
  const ids = new Set<string>();
  const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
  for (const guide of guides) {
    if (slugs.has(guide.slug) || ids.has(guide.id)) throw new Error(`Duplicate guide: ${guide.slug}`);
    slugs.add(guide.slug); ids.add(guide.id);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(guide.slug)) throw new Error("Invalid slug");
    if (guide.editorialStatus !== "published") continue;
    if (!guide.residences.length || !guide.document || !guide.authority.name ||
      (guide.nationalities.kind === "only" && !guide.nationalities.codes.length) ||
      (guide.nationalities.kind === "foreign-national" && !guide.nationalities.excludedCodes.length)) throw new Error("Missing applicability or authority");
    if (!validDate(guide.reviewedOn) || !validDate(guide.updatedOn)) throw new Error("Invalid editorial date");
    const sources = new Map(guide.sources.map((source) => [source.id, source]));
    if (!sources.size || sources.size !== guide.sources.length) throw new Error("Missing or duplicate sources");
    for (const id of [guide.authority.sourceId, guide.primarySourceId]) {
      const source = sources.get(id);
      if (!source || source.access === "unavailable" || !source.claims.length) throw new Error("Unverified authority or primary source");
    }
    for (const source of guide.sources) {
      if (!isOfficialUrl(source.url) || !validDate(source.checkedOn)) throw new Error(`Invalid source: ${source.id}`);
      if (source.access !== "unavailable" && source.checkedOn < guide.reviewedOn) throw new Error("Review date exceeds source review");
    }
    if (guide.timing && (!guide.timing.text.trim() || !guide.timing.sourceIds.length || guide.timing.sourceIds.some((id) => !sources.has(id) || sources.get(id)?.access === "unavailable"))) throw new Error("Unsupported timing statement");
    for (const language of RESOURCE_LANGUAGES) {
      const content = guide.translations[language];
      if (!content) continue;
      if (!validDate(guide.translationReviews[language] ?? "")) throw new Error("Translation needs a recorded review");
      if ([content.title, content.summary, content.scope].some((text) => !text.trim()) || !content.commonRequirements.length || !content.steps.length) throw new Error("Incomplete guide");
      if (/\b(?:TODO|TBD|lorem ipsum|placeholder)\b/i.test(JSON.stringify(content))) throw new Error("Placeholder content");
      for (const statement of [...content.beforeYouStart, ...content.commonRequirements, ...content.conditionalRequirements, ...content.steps, ...content.importantNotes]) {
        if (!statement.text.trim() || !statement.sourceIds.length || statement.sourceIds.some((id) => !sources.has(id) || sources.get(id)?.access === "unavailable")) throw new Error("Unsupported statement");
      }
    }
  }
}

export const resourceGuides: ResourceGuide[] = [indonesianPassportTaiwan, taiwanArcStudents, taiwanArcWorkers, ...additionalPassportGuides, ...residenceWorkGuides, ...healthDrivingGuides, ...contractRecordGuides, ...languageCertificateGuides, ...workforcePassportGuides, ...workforceDocumentGuides];
validateGuides(resourceGuides);
export const publishedGuides = resourceGuides.filter((guide) => guide.editorialStatus === "published");
export const availableLanguages = (guide: ResourceGuide) => RESOURCE_LANGUAGES.filter((language) => guide.translations[language] && guide.translationReviews[language]);

export function matchesApplicability(guide: ResourceGuide, filters: ResourceFilters): boolean {
  if (filters.nationality) {
    const matches = guide.nationalities.kind === "any" || (guide.nationalities.kind === "only" ? guide.nationalities.codes.includes(filters.nationality) : !guide.nationalities.excludedCodes.includes(filters.nationality));
    if (!matches) return false;
  }
  return (!filters.residence || guide.residences.includes(filters.residence)) &&
    (!filters.document || guide.document === filters.document) &&
    (!filters.status || !guide.residenceStatuses || guide.residenceStatuses.includes(filters.status));
}

function matchesSearch(guide: ResourceGuide, filters: ResourceFilters): boolean {
  const words = filters.query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  const text = JSON.stringify([guide.translations, guide.authority.name, guide.keywords, guide.residences, guide.nationalities]).toLocaleLowerCase();
  return matchesApplicability(guide, filters) && words.every((word) => text.includes(word));
}

export function findGuides(filters: ResourceFilters, guides = resourceGuides): ResourceGuide[] {
  return guides.filter((guide) => guide.editorialStatus === "published" && matchesSearch(guide, filters));
}

export function resourceResultState(filters: ResourceFilters, guides = resourceGuides): "matches" | "unavailable" | "needs-verification" | "no-match" {
  if (findGuides(filters, guides).length) return "matches";
  // Only a generic availability message is exposed, never unpublished instructions.
  if (guides.some((guide) => guide.editorialStatus === "unavailable" && matchesSearch(guide, filters))) return "unavailable";
  if (guides.some((guide) => guide.editorialStatus === "draft" && matchesSearch(guide, filters))) return "needs-verification";
  return "no-match";
}

export function needsResidenceStatus(filters: ResourceFilters): boolean {
  return Boolean(filters.document) && publishedGuides.some((guide) => guide.residenceStatuses?.length && matchesApplicability(guide, { ...filters, status: "", query: "" }));
}

export function resolveResourcePath(path: string): { language: ResourceLanguage; guide?: ResourceGuide } | undefined {
  for (const language of RESOURCE_LANGUAGES) {
    if (path === directoryPath(language)) return { language };
    const guide = publishedGuides.find((entry) => entry.translations[language] && guidePath(entry, language) === path);
    if (guide) return { language, guide };
  }
}

export const RESOURCE_PATHS = [
  ...RESOURCE_LANGUAGES.map(directoryPath),
  ...publishedGuides.flatMap((guide) => availableLanguages(guide).map((language) => guidePath(guide, language))),
];

export function relatedGuides(guide: ResourceGuide): ResourceGuide[] {
  const overlapsNationality = (entry: ResourceGuide) => {
    const first = guide.nationalities, second = entry.nationalities;
    if (first.kind === "any" || second.kind === "any") return true;
    if (first.kind === "only") return first.codes.some((code) => second.kind === "only" ? second.codes.includes(code) : !second.excludedCodes.includes(code));
    if (second.kind === "only") return second.codes.some((code) => !first.excludedCodes.includes(code));
    return true;
  };
  return publishedGuides.filter((entry) => entry.id !== guide.id && overlapsNationality(entry) && entry.residences.some((code) => guide.residences.includes(code)))
    .map((entry, index) => ({ entry, index, score: (entry.document === guide.document ? 5 : 0) + (entry.residenceStatuses?.some((status) => guide.residenceStatuses?.includes(status)) ? 2 : 0) }))
    .sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 4).map(({ entry }) => entry);
}
