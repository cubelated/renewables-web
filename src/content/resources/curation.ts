import type { CitedText, GuideContent, OfficialSource, ResourceGuide } from "./types";

export const anyNationality = { kind: "any" } as const;
export const foreignNationals = { kind: "foreign-national", excludedCodes: ["TW", "CN", "HK", "MO"] } as const;
export const citizenOf = (...codes: string[]): ResourceGuide["nationalities"] => ({ kind: "only", codes });
export const cited = (text: string, ...sources: OfficialSource[]): CitedText => ({ text, sourceIds: sources.map((source) => source.id) });

type CuratedInput = Pick<ResourceGuide, "id" | "slug" | "nationalities" | "residences" | "document" | "serviceType" | "timing"> & {
  reviewedOn: string;
  updatedOn?: string;
  authority: string;
  sources: OfficialSource[];
  residenceStatuses?: ResourceGuide["residenceStatuses"];
  keywords: string[];
  content: GuideContent;
};

/** Only explicitly authored definitions enter this helper; no country/document combinations are generated. */
export function curatedGuide(input: CuratedInput): ResourceGuide {
  const { content, authority, ...metadata } = input;
  return {
    ...metadata, authority: { name: authority, sourceId: input.sources[0].id }, primarySourceId: input.sources[0].id,
    updatedOn: input.updatedOn ?? input.reviewedOn, reviewedOn: input.reviewedOn, editorialStatus: "published",
    translationReviews: { en: input.reviewedOn }, translations: { en: content },
  };
}
