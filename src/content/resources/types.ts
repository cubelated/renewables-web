export type ResourceLanguage = "en" | "id-ID" | "zh-TW";
export type DocumentCategory = "passport" | "arc" | "gold-card" | "aprc" | "visa" | "work-permit" | "drivers-license" | "international-driving-permit" | "insurance" | "nhi" | "dental-care" | "employment-contract" | "bank-card" | "rental-contract" | "national-id" | "language-certificate" | "health-certificate" | "police-clearance" | "vehicle-registration";
export type ResidenceStatus = "student" | "overseas-student" | "worker" | "professional" | "teacher" | "gold-card" | "job-seeker" | "permanent-resident" | "foreign-resident" | "dependent" | "citizen" | "other";
export type ServiceType = "renewal" | "application" | "replacement" | "benefit" | "review";
export type TimingKind = "printed-expiry" | "authority-window" | "recurring-benefit" | "recipient-policy" | "event-based";
export type EditorialStatus = "published" | "draft" | "unavailable";

export type OfficialSource = {
  id: string;
  title: string;
  organization: string;
  url: string;
  claims: string[];
  checkedOn: string;
  updatedOn?: string;
  access: "direct" | "official-index" | "unavailable";
  note?: string;
  kind?: "government" | "issuer";
};

export type CitedText = { text: string; sourceIds: string[] };
export type GuideContent = {
  title: string;
  summary: string;
  scope: string;
  beforeYouStart: CitedText[];
  commonRequirements: CitedText[];
  conditionalRequirements: CitedText[];
  suggestions: string[];
  steps: CitedText[];
  importantNotes: CitedText[];
};

export type ResourceGuide = {
  id: string;
  slug: string;
  nationalities: { kind: "any" } | { kind: "only"; codes: string[] } | { kind: "foreign-national"; excludedCodes: string[] };
  residences: string[];
  document: DocumentCategory;
  residenceStatuses?: ResidenceStatus[];
  authority: { name: string; sourceId: string };
  primarySourceId: string;
  sources: OfficialSource[];
  keywords: string[];
  updatedOn: string;
  reviewedOn: string;
  editorialStatus: EditorialStatus;
  serviceType?: ServiceType;
  timing?: CitedText & { kind: TimingKind };
  translations: Partial<Record<ResourceLanguage, GuideContent>> & { en: GuideContent };
  translationReviews: Partial<Record<ResourceLanguage, string>>;
};

export type ResourceFilters = {
  nationality: string;
  residence: string;
  document: DocumentCategory | "";
  status: ResidenceStatus | "";
  query: string;
};
