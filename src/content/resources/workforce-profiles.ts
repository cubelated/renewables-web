import { matchesApplicability, emptyFilters, publishedGuides } from "./guides";
import { countries } from "./countries";
import { isOfficialUrl } from "./source-policy";
import { workforceSources as s } from "./workforce-sources";
import type { OfficialSource, ResidenceStatus } from "./types";

export type WorkforceRecord = {
  title: string;
  tracking: "conditional" | "supporting" | "event";
  note: string;
  sources: OfficialSource[];
  guideIds: string[];
  statuses?: ResidenceStatus[];
};
export type WorkforceProfile = {
  country: string;
  reviewedOn: string;
  context: "migrant-and-professional" | "professional" | "teacher-research";
  passportGuideId?: string;
  references: OfficialSource[];
  records: WorkforceRecord[];
  limitation: string;
};

const record = (title: string, tracking: WorkforceRecord["tracking"], note: string, sources: OfficialSource[], guideIds: string[] = [], statuses?: ResidenceStatus[]): WorkforceRecord => ({ title, tracking, note, sources, guideIds, statuses });
const teacherRecords = record("Teaching qualification records", "conditional", "If applying for a teaching role, confirm the program's accepted degree and qualification pathway. Keep the degree as evidence; track a licence only when its issuer actually sets a validity or renewal condition.", [s.teachingProgram, s.teachingAppendix], ["tw-public-teacher-docs", "tw-cram-teacher-docs"], ["teacher", "professional"]);

// Finite, manually researched profiles. Country presence never selects a job,
// proves citizenship/eligibility, or generates a procedural page.
export const workforceProfiles: WorkforceProfile[] = [
  { country: "ID", reviewedOn: "2026-11-12", context: "migrant-and-professional", passportGuideId: "id-passport-tw", references: [], records: [], limitation: "No additional recurring home-country renewal is verified here. The domestic SKCK and SIM Internasional guides must not be treated as overseas procedures or requirements for every Indonesian worker." },
  { country: "PH", reviewedOn: "2026-11-12", context: "migrant-and-professional", passportGuideId: "ph-passport-tw", references: [s.mecoWorkerContacts], records: [record("OFW clearance, verified contract and OWWA coverage", "event", "Check these separate records with MWO/OWWA for the actual travel or employment transaction. This does not apply automatically to non-working students or dependents.", [s.mecoWorkerContacts, s.mecoSpecialHiring], ["ph-ofw-records"], ["worker", "professional", "teacher"])], limitation: "No universal OEC/OFW Pass validity, travel window or OWWA membership interval is inferred." },
  { country: "TH", reviewedOn: "2026-11-12", context: "migrant-and-professional", passportGuideId: "th-passport-tw", references: [], records: [], limitation: "The passport guide already explains the Thai identity-card prerequisite. No additional recurring document-renewal requirement has been verified; use the actual ID and office instructions." },
  { country: "VN", reviewedOn: "2026-11-12", context: "migrant-and-professional", references: [s.vietnam], records: [], limitation: "The official Taipei consular contact is confirmed, but a current ordinary-passport renewal checklist was not available. Ask VECO for the applicable documents and appointment route; another Vietnamese mission's checklist is not substituted." },
  { country: "MY", reviewedOn: "2026-11-12", context: "professional", passportGuideId: "my-passport-tw", references: [], records: [], limitation: "Identity, birth and residence evidence belongs to the applicable passport checklist. No recurring expiry is assigned to a birth record or MyKad without an actual issuer requirement." },
  { country: "JP", reviewedOn: "2026-11-12", context: "professional", passportGuideId: "jp-passport-tw", references: [], records: [record("Family-register evidence and linked travel records", "supporting", "Use family-register evidence only for the passport category that requests it. After replacement, check the Association's e-Gate guidance where relevant; this is a change event rather than an annual renewal.", [s.japan, s.japanChanges], ["jp-passport-tw"])], limitation: "No automatic expiry is assigned to a Japanese degree or civil-status record. Required certificate recency depends on the actual application." },
  { country: "IN", reviewedOn: "2026-11-12", context: "professional", passportGuideId: "in-passport-tw", references: [s.indiaRecruitment], records: [], limitation: "India's migrant-worker MOU is not evidence of an operational recruitment timetable. This profile covers consular/professional preparation and does not invent Aadhaar, PAN or OCI renewal requirements for Indian passport holders." },
  { country: "HK", reviewedOn: "2026-11-12", context: "professional", passportGuideId: "hk-passport-tw", references: [s.hkMacaoResidence], records: [record("Hong Kong identity-card replacement", "event", "Check the card version and Immigration's replacement arrangements before a return visit or passport application. Do not infer an annual expiry for all current cards.", [s.hongKongId], ["hk-identity-tw"]), record("Taiwan Hong Kong/Macao resident permit", "event", "Eligible holders follow NIA's distinct regional resident-permit route; an ordinary foreign-national ARC checklist is not substituted.", [s.hkMacaoResidence], ["hk-mo-work-residence"], ["professional", "teacher"])], limitation: "Hong Kong is a regional status filter, not proof of HKSAR passport entitlement or Taiwan residence eligibility. BN(O) passports are a separate British passport service." },
  { country: "MO", reviewedOn: "2026-11-12", context: "professional", passportGuideId: "mo-passport-tw", references: [s.hkMacaoResidence], records: [record("Taiwan Hong Kong/Macao resident permit", "event", "Eligible existing work-based permit holders use NIA's separate residence-extension route.", [s.hkMacaoResidence], ["hk-mo-work-residence"], ["professional", "teacher"])], limitation: "Macao residence alone does not establish passport entitlement. The permanent-resident identity record supports the passport application; no extra recurring identity-card deadline is invented." },
  { country: "US", reviewedOn: "2026-11-12", context: "professional", references: [s.usaNational, s.usaLocal], records: [record("FBI criminal-record evidence", "conditional", "Obtain this only when the receiving school or official application requests the nationwide record. A state/local check is a different document.", [s.fbi], ["us-fbi-tw"]), teacherRecords], limitation: "AIT's current passport page returned 403. The 2022 archive and U.S. domestic mailing/payment instructions are not published as a current Taiwan passport procedure." },
  { country: "GB", reviewedOn: "2026-11-12", context: "professional", passportGuideId: "gb-passport-tw", references: [s.ukPolice], records: [record("UK overseas police-certificate request", "conditional", "Confirm the exact ACRO or other record requested and its current checklist with the issuer. The ACRO portal exposed only an error shell during review; no supporting-document list or expiry is guessed.", [s.ukPolice]), teacherRecords], limitation: "The passport guide is an official overseas-service starting point; an interactive Taiwan application was not completed. No universal state teaching-licence or TEFL renewal rule applies to all British teachers." },
  { country: "CA", reviewedOn: "2026-11-12", context: "professional", passportGuideId: "ca-passport-tw", references: [], records: [record("RCMP certified criminal-record check", "conditional", "If the recipient requests it, use the correct overseas fingerprint route and verify accepted issue age and authentication.", [s.rcmp], ["ca-rcmp-tw"]), teacherRecords], limitation: "Teaching credentials are province/issuer-specific. No single Canadian licence-renewal interval is assumed." },
  { country: "AU", reviewedOn: "2026-11-12", context: "teacher-research", passportGuideId: "au-passport-tw", references: [], records: [teacherRecords], limitation: "A current AFP overseas application checklist was not accessible. Any requested Australian criminal record needs issuer/recipient confirmation; no police-check documents or renewal period are invented. Teaching registration depends on its issuer." },
  { country: "NZ", reviewedOn: "2026-11-12", context: "teacher-research", passportGuideId: "nz-passport-tw", references: [], records: [record("New Zealand conviction-history record", "conditional", "Request the record only for an actual application. MOJ distinguishes the request date from an expiry; the recipient chooses accepted recency.", [s.nzRecord, s.nzRecordAge], ["nz-record-tw"]), teacherRecords], limitation: "No annual police-record or universal teacher-credential renewal is imposed." },
  { country: "IE", reviewedOn: "2026-11-12", context: "teacher-research", passportGuideId: "ie-passport-tw", references: [], records: [record("Garda Police Certificate", "conditional", "Check permitted purpose first: a Garda Police Certificate is not general employment vetting. Use the guide only for a qualifying requested purpose.", [s.garda], ["ie-police-tw"]), teacherRecords], limitation: "Irish teacher-registration conditions are issuer-specific; no universal teaching-licence expiry is assumed." },
  { country: "ZA", reviewedOn: "2026-11-12", context: "professional", references: [s.southAfrica, s.sapS], records: [teacherRecords], limitation: "The current Taiwan passport checklist and SAPS overseas police-clearance instructions were not verified. Confirm requested identity/police records with the authority; no overseas fingerprint, fee or submission procedure is guessed." },
  { country: "KR", reviewedOn: "2026-11-12", context: "professional", references: [s.korea], records: [], limitation: "The Taipei mission's passport service was identified, but its current renewal checklist was not verified. Other-country Korean mission instructions are not substituted; no universal extra local-document expiry is added." },
  { country: "DE", reviewedOn: "2026-11-12", context: "professional", passportGuideId: "de-passport-tw", references: [], records: [], limitation: "The local passport source also covers German identity-card services. Track an existing ID's actual date if relevant, but do not turn birth/civil-status records into recurring renewals." },
  { country: "SG", reviewedOn: "2026-11-12", context: "professional", passportGuideId: "sg-passport-tw", references: [], records: [], limitation: "The passport service lists identity evidence. Singapore-citizen passports and a Singapore permanent resident's re-entry permit are distinct; no REP deadline is inferred from Singapore nationality." },
  { country: "FR", reviewedOn: "2026-11-12", context: "professional", references: [s.france], records: [], limitation: "The official French consular referral is available, but the current Taiwan passport/identity-card checklist was not verified. French visa instructions are not used for French-citizen passport renewal." },
  { country: "MM", reviewedOn: "2026-11-12", context: "professional", references: [s.myanmar], records: [], limitation: "A Taiwan-resident passport jurisdiction and current checklist were not verified. No requirement to return to Myanmar or follow a Thailand-only appointment process is asserted." },
  { country: "SZ", reviewedOn: "2026-11-12", context: "professional", references: [s.eswatini], records: [], limitation: "The national passport authority is identified, but its Taiwan-resident checklist is unverified. Domestic identity-document/fee requirements and regional travel-document rules are not applied to a Taiwan passport application." },
  { country: "RU", reviewedOn: "2026-11-12", context: "professional", references: [], records: [], limitation: "The current Taiwan-resident passport authority route and supporting-document checklist were not substantiated. No local passport guide or extra home-document renewal requirement is published." },
];

export function workforceProfileSources(profile: WorkforceProfile): OfficialSource[] {
  const origin = profile.context === "teacher-research" ? s.teachingProgram : s.professionals;
  const passport = publishedGuides.find((guide) => guide.id === profile.passportGuideId);
  return [...new Map([origin, ...(profile.context === "migrant-and-professional" ? [s.migrants] : []), ...(passport?.sources ?? []), ...profile.references, ...profile.records.flatMap((item) => item.sources)].map((source) => [source.id, source])).values()];
}

export function validateWorkforceProfiles(profiles: WorkforceProfile[]): void {
  const seen = new Set<string>();
  const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
  for (const profile of profiles) {
    if (seen.has(profile.country) || !countries.some((country) => country.code === profile.country)) throw Error("Invalid or duplicate workforce country");
    seen.add(profile.country);
    if (!validDate(profile.reviewedOn) || !profile.limitation.trim()) throw Error("Incomplete workforce review");
    if (profile.passportGuideId) {
      const guide = publishedGuides.find((guide) => guide.id === profile.passportGuideId);
      if (!guide || guide.document !== "passport" || !guide.residences.includes("TW") || guide.nationalities.kind !== "only" || !guide.nationalities.codes.includes(profile.country)) throw Error("Mismatched passport guide");
    }
    for (const source of workforceProfileSources(profile)) {
      if (!isOfficialUrl(source.url) || !validDate(source.checkedOn) || source.checkedOn < profile.reviewedOn) throw Error("Invalid workforce source");
    }
    for (const item of profile.records) {
      if (!item.sources.length || item.sources.some((source) => source.access === "unavailable") || !item.note.trim()) throw Error("Unsupported workforce record");
      for (const id of item.guideIds) if (!publishedGuides.some((guide) => guide.id === id && matchesApplicability(guide, { ...emptyFilters, nationality: profile.country, residence: "TW" }))) throw Error("Inapplicable workforce guide link");
    }
  }
}
validateWorkforceProfiles(workforceProfiles);
