import { cited as c, curatedGuide, foreignNationals } from "./curation";
import { reviewedSources as s } from "./reviewed-sources";
import type { ResourceGuide } from "./types";

const foreignScope: ResourceGuide["nationalities"] = { kind: "foreign-national", excludedCodes: [...foreignNationals.excludedCodes] };
export const residenceWorkGuides = [
  curatedGuide({
    reviewedOn: "2026-11-12",
    id: "tw-arc-professionals", slug: "taiwan-arc-extension-professionals", nationalities: foreignScope, residences: ["TW"], document: "arc", serviceType: "renewal", residenceStatuses: ["professional", "teacher"],
    authority: "Taiwan National Immigration Agency (NIA)", sources: [s.niaGeneral], keywords: ["white collar", "professional", "employee", "外國專業人才", "居留證延期申請"],
    timing: { kind: "printed-expiry", ...c("Track work permission and the ARC separately. Ask NIA to confirm the filing window and evidence for your employment category before the residence period expires.", s.niaGeneral) },
    content: {
      title: "Taiwan ARC Extension for Foreign Professionals", summary: "Prepare an employer-based ARC extension for professional employment, separate from student, migrant-worker, and Gold Card routes.",
      scope: "For foreign professionals continuing the approved employment purpose of an existing ARC. Not a Gold Card extension, student route, job-seeking extension, employer-change assessment, or determination that all professional categories have identical work-permit rules.",
      beforeYouStart: [c("Confirm that the original residence reason continues and that the competent labor/industry authority's employment approval covers the proposed period.", s.niaGeneral)],
      commonRequirements: [c("Prepare the extension form, qualifying photo, passport and ARC originals/copies, and evidence of continued employment. NIA lists an approval letter and a recent sealed employment certificate for the employment category.", s.niaGeneral)],
      conditionalRequirements: [c("Changed residence address and a representative may require additional evidence or authorization. Work-permit exemptions and foreign-document authentication depend on the category.", s.niaGeneral)],
      suggestions: ["Ask HR who supplies the employer evidence and who files the residence application.", "Keep your employment approval, ARC, and passport as separate tracked records."],
      steps: [c("Confirm the correct service route with the NIA service center for your residence; do not reuse the student or migrant-worker online route automatically.", s.niaGeneral), c("Submit the category-specific extension evidence and follow NIA's correction, payment, and collection instructions.", s.niaGeneral)],
      importantNotes: [c("An employer's work-permit extension does not itself complete residence extension. Changes of employer or residence purpose need separate confirmation.", s.niaGeneral)],
    },
  }),
  curatedGuide({
    reviewedOn: "2026-11-12",
    id: "tw-gold-card", slug: "taiwan-employment-gold-card-renewal", nationalities: { kind: "foreign-national", excludedCodes: ["TW", "CN"] }, residences: ["TW"], document: "gold-card", serviceType: "renewal", residenceStatuses: ["gold-card", "professional"],
    authority: "Taiwan National Immigration Agency / Employment Gold Card Office", sources: [s.goldCard, s.goldCardRoute, s.goldCardTutorial], keywords: ["就業金卡", "Gold Card", "foreign specialist", "四合一", "white collar"],
    timing: { kind: "authority-window", ...c("NIA describes an extension within four months before expiry. The official portal tutorial also describes a one-month-before-expiry submission cutoff. Confirm both the legal route and live portal cutoff with the Gold Card Office; do not wait until the last month or infer a filing date from the calculator.", s.goldCard, s.goldCardTutorial) },
    content: {
      title: "Taiwan Employment Gold Card Extension and Reapplication", summary: "Distinguish an unexpired Gold Card extension, a new application after expiry, and a residence-only extension that does not extend the Gold Card itself.",
      scope: "For existing or prospective foreign specialist professionals, including eligible Hong Kong/Macao specialist applicants under the applicable NIA rules. Qualifications are assessed by the responsible professional-field authority; holding an ordinary employment ARC does not prove Gold Card eligibility.",
      beforeYouStart: [c("Check whether your card is still valid and whether you continue to meet a current qualification criterion. Extension and reapplication are different platform actions.", s.goldCardRoute)],
      commonRequirements: [c("Prepare the passport, qualifying photograph, current card details, and the professional qualification documents required by the applicable NIA category.", s.goldCard)],
      conditionalRequirements: [c("A changed professional field, changed personal information, dependents, or expired card can require different documents and a different route.", s.goldCard, s.goldCardRoute)],
      suggestions: ["Keep the qualification evidence and card expiry together, while tracking passport validity separately.", "Retain submission confirmation; a saved or unfinished platform form is not proof of submission."],
      steps: [c("Use the NIA Foreign Professionals Online Application Platform linked in guideline 0921; choose extension for an unexpired card or the applicable new application route after expiry.", s.goldCard, s.goldCardRoute), c("Upload the requested evidence and follow qualification review, payment, identity-check, and collection instructions.", s.goldCard)],
      importantNotes: [c("An NIA residence-only extension after a Gold Card ends is a separate status. Do not assume it renews the combined Gold Card or preserves the same work rights.", s.goldCard)],
    },
  }),
  curatedGuide({
    reviewedOn: "2026-11-12",
    id: "tw-aprc", slug: "taiwan-aprc-permanent-residency", nationalities: foreignScope, residences: ["TW"], document: "aprc", serviceType: "application",
    authority: "Taiwan National Immigration Agency (NIA)", sources: [s.aprc], keywords: ["APRC", "永久居留證", "permanent residency", "Gold Card", "blue collar", "white collar"],
    timing: { kind: "authority-window", ...c("APRC eligibility is a category-specific residence assessment, not an annual ARC renewal. Ask NIA to calculate qualifying residence and continuing conditions; the expiry calculator cannot determine permanent-residence eligibility.", s.aprc) },
    content: {
      title: "Taiwan APRC: Permanent Residency Eligibility and Preparation", summary: "Start an APRC assessment with NIA using your actual residence history, category, and supporting records, rather than a universal years-in-Taiwan countdown.",
      scope: "For foreign residents assessing a first APRC application or checking continuing permanent-residence obligations. Professionals, specialist professionals, dependents, and other qualifying categories have different rules. This guide does not establish that students or migrant workers qualify merely from time spent in Taiwan.",
      beforeYouStart: [c("Ask the NIA service station for your residence to identify the applicable category. NIA lists exclusions from qualifying residence and special provisions for professional categories and certain Taiwan degrees.", s.aprc)],
      commonRequirements: [c("NIA's common document list includes an APRC application, qualifying photo, new and old passports with copies, and a current ARC unless an exemption applies.", s.aprc)],
      conditionalRequirements: [c("Police certificates, financial/self-support evidence, health documentation, employment, family records, authentication, and exemptions depend on the applicable category. Obtain NIA's exact checklist before ordering time-sensitive certificates.", s.aprc)],
      suggestions: ["Organize residence-purpose history, entry/exit evidence, degrees, and employment records before requesting a category review.", "Ask the receiving authority how recent each certificate must be; do not order every possible document prematurely."],
      steps: [c("Request category and qualifying-period confirmation at the NIA service station for your residence.", s.aprc), c("Prepare that category's evidence and submit the APRC application. Follow any correction and collection instructions.", s.aprc)],
      importantNotes: [c("Permanent status has continuing conditions and can require data changes or replacement-card handling. Do not apply the ordinary ARC extension checklist or invent a recurring APRC expiry date.", s.aprc)],
    },
  }),
  curatedGuide({
    reviewedOn: "2026-11-12",
    id: "tw-student-work", slug: "taiwan-student-work-permit", nationalities: { kind: "foreign-national", excludedCodes: ["TW", "CN"] }, residences: ["TW"], document: "work-permit", serviceType: "application", residenceStatuses: ["student", "overseas-student"],
    authority: "Taiwan Ministry of Labor, Workforce Development Agency (WDA)", sources: [s.studentWork], keywords: ["僑外生", "student work permit", "part time", "international student", "overseas Chinese student"],
    timing: { kind: "printed-expiry", ...c("Read the validity and conditions of the actual student work permit. Enrollment, ARC validity, and work permission are different records; do not assume a previous semester's permission continues.", s.studentWork) },
    content: {
      title: "Taiwan Work Permits for International and Overseas Chinese Students", summary: "Find the student work-permit application route and school-reviewed evidence, separate from post-graduation work authorization.",
      scope: "For eligible enrolled foreign students and overseas Chinese/Hong Kong/Macao students described by WDA. The initial finder does not assess Taiwan nationality or household-registration cases. Admission to a school is not itself proof of permission to work.",
      beforeYouStart: [c("Confirm student-category eligibility with your school. WDA's service page distinguishes enrolled degree students from language-course students, who have an additional study-duration condition.", s.studentWork)],
      commonRequirements: [c("The service lists the application, valid passport copy, and review-fee evidence. Follow the school's evidence/copy-verification process and the current online checklist.", s.studentWork)],
      conditionalRequirements: [c("Language study and student-category rules differ. Ask the school to verify eligibility and applicable permit conditions before submitting.", s.studentWork)],
      suggestions: ["Keep school review and permit approval as separate steps in your preparation list.", "Track permit expiry and semester enrollment separately; ask the issuing authority about changes after graduation."],
      steps: [c("Apply through the WDA Foreign Professionals Work Permit online system linked from the official student service page, with the school involved as required.", s.studentWork), c("Wait for the issued permission and check its dates and conditions before relying on it for a job.", s.studentWork)],
      importantNotes: [c("Graduation changes the relevant route. Do not reuse an enrolled-student permit checklist to determine the work rights of a graduate on a job-seeking extension.", s.studentWork)],
    },
  }),
  curatedGuide({
    reviewedOn: "2026-11-12",
    id: "tw-graduate-work", slug: "taiwan-graduate-job-seeking-work-rights", nationalities: foreignScope, residences: ["TW"], document: "work-permit", serviceType: "review", residenceStatuses: ["job-seeker"],
    authority: "Taiwan Workforce Development Agency (work rights) / NIA (residence)", sources: [s.graduateWork], keywords: ["2026", "graduate", "job seeking", "覓職", "僑外生畢業", "工作免許可"],
    timing: { kind: "printed-expiry", ...c("WDA describes the exemption during the qualifying NIA-approved recent-graduate extension, up to two years. Track the actual approved residence dates and confirm what authorization is needed afterwards; a personal reminder does not extend that permission.", s.graduateWork) },
    content: {
      title: "Taiwan Graduate Job-Seeking Status: Check Your Work Rights", summary: "Current WDA guidance distinguishes eligible recent Taiwan graduates who can work during an approved extension from other jobseekers who need a separate authorization route.",
      scope: "Limited to foreign recent graduates with a Taiwan associate degree or above and the qualifying NIA-approved post-graduation extension under the current rule. Not a blanket work exemption for every job-seeking visa, visitor, former student, or overseas graduate.",
      beforeYouStart: [c("WDA says qualifying Taiwan graduates with the specified approved extension can work without a separate work permit during that period. An old school permit or a job offer alone does not establish this category.", s.graduateWork)],
      commonRequirements: [c("Check your Taiwan degree, NIA-approved residence reason and dates, and the ARC endorsement indicating the holder does not need to apply for a work permit.", s.graduateWork)],
      conditionalRequirements: [c("An older ARC may need replacement to display the endorsement. Regulated professions still require their professional qualifications or registration.", s.graduateWork)],
      suggestions: ["Show HR the public WDA explanation and ask NIA about any mismatch in the residence endorsement.", "Set a personal review reminder before the approved extension ends; do not assume the exemption renews automatically."],
      steps: [c("Confirm with NIA that your residence permission is the qualifying recent-graduate extension; ask about updating an older card where needed.", s.graduateWork), c("Have the employer check the endorsement and any profession-specific licensing. Before the period ends, confirm the next residence and employment route.", s.graduateWork)],
      importantNotes: [c("This February 2026 WDA explanation differs from older student-advisor pages that say all graduates need employer permission during job seeking. Use the current WDA rule for this narrowly defined category.", s.graduateWork)],
    },
  }),
];
