import { anyNationality, cited as c, curatedGuide } from "./curation";
import { reviewedSources as s } from "./reviewed-sources";

export const languageCertificateGuides = [
  curatedGuide({
    reviewedOn: "2026-11-12",
    id: "ielts-results", slug: "ielts-score-validity-check", nationalities: anyNationality, residences: ["TW", "ID"], document: "language-certificate", serviceType: "review",
    authority: "IELTS and the organization receiving your result", sources: [s.ielts], keywords: ["IELTS", "English language", "雅思", "certificate", "two years"],
    timing: { kind: "recipient-policy", ...c("IELTS recommends considering results valid for two years after the test, but accepting organizations may accept older results. Use the recipient's exact policy and reference date, not a universal immigration deadline.", s.ielts) },
    content: {
      title: "IELTS Results: Validity, Acceptance, and Retest Planning", summary: "Distinguish IELTS's two-year recommendation from the score-age policy used by a school, employer, or application authority.",
      scope: "For IELTS result holders in Taiwan or Indonesia planning an application. IELTS is an English-language test issuer; it does not decide every recipient's admission or immigration requirements. This is not an automatic certificate-renewal service.",
      beforeYouStart: [c("Check the receiving organization's accepted test type, score-age rule, and the date on which it assesses the result. IELTS explicitly allows recipients to accept results older than its recommendation.", s.ielts)],
      commonRequirements: [c("Locate the actual test date and result/score report, and compare them with the recipient's current acceptance instructions.", s.ielts)],
      conditionalRequirements: [c("A recipient may accept an older result or require different evidence. Obtain its decision rather than assuming all IELTS results expire for every purpose on the same day.", s.ielts)],
      suggestions: ["Track the test date, application deadline, and recipient's stated score-age rule separately.", "Allow time to ask for score-delivery instructions or plan a retest if the recipient requires a newer result."],
      steps: [c("Read IELTS's score-validity explanation and ask the recipient whether your specific result is acceptable.", s.ielts), c("Use the recipient's reporting/verification instructions, or arrange a new test when needed; do not treat editing a reminder as renewing a result.", s.ielts)],
      importantNotes: [c("There is no universal immigration filing window or automatic score extension here. The recipient, test type, and actual test date govern what to check.", s.ielts)],
    },
  }),
  curatedGuide({
    reviewedOn: "2026-11-12",
    id: "toeic-results", slug: "toeic-score-validity-check", nationalities: anyNationality, residences: ["TW", "ID"], document: "language-certificate", serviceType: "review",
    authority: "ETS / your authorized TOEIC test provider and receiving organization", sources: [s.toeic], keywords: ["TOEIC", "多益", "English language", "Listening Reading", "Speaking Writing"],
    timing: { kind: "recipient-policy", ...c("ETS's official FAQ recommends that organizations consider TOEIC scores valid for up to two years. Confirm the recipient's required test, age, and reporting route before planning a retest.", s.toeic) },
    content: {
      title: "TOEIC Score Reports: Validity and Acceptance Checks", summary: "Review your TOEIC test date and accepted score-report type before a job, school, or other application.",
      scope: "For TOEIC result holders in Taiwan or Indonesia. TOEIC Listening & Reading and Speaking & Writing are distinct assessments; an institutional test report may also have a different delivery route. This guide does not treat all English certificates as interchangeable.",
      beforeYouStart: [c("Identify the actual test and the receiving organization's score requirements; ETS describes a recommended score-use period rather than an application-specific legal deadline.", s.toeic)],
      commonRequirements: [c("Locate the test date and score report and confirm the accepted score age with the recipient or authorized test provider.", s.toeic)],
      conditionalRequirements: [c("Ask how the specific score report will be supplied or verified; do not assume a workplace or school test can be used for every outside application.", s.toeic)],
      suggestions: ["Store the test date and recipient's instructions alongside the application plan.", "If a newer score is required, plan registration and reporting time instead of assigning an invented certificate-extension date."],
      steps: [c("Read the ETS FAQ and confirm the recipient's accepted TOEIC assessment and report.", s.toeic), c("Follow the authorized provider's report or retest process when the present result does not meet the recipient's requirement.", s.toeic)],
      importantNotes: [c("The FAQ's official indexed wording was reviewed; parts of the rendered page are dynamic. No universal school, employer, or immigration acceptance guarantee is made.", s.toeic)],
    },
  }),
  curatedGuide({
    reviewedOn: "2026-11-12",
    id: "tocfl-results", slug: "tocfl-chinese-certificate-check", nationalities: anyNationality, residences: ["TW", "ID"], document: "language-certificate", serviceType: "review",
    authority: "Steering Committee for the Test Of Proficiency-Huayu (SC-TOP) / receiving organization", sources: [s.tocfl, s.tocflDigital], keywords: ["TOCFL", "華語文能力測驗", "Chinese Language", "中文證書", "華測會", "Mandarin"],
    timing: { kind: "recipient-policy", ...c("Separate a recipient's accepted score age from the issuer's reissue or online-verification service period. The digital FAQ discusses a two-year results-service distinction; that is not proof that every TOCFL certificate expires after two years.", s.tocflDigital) },
    content: {
      title: "TOCFL Chinese-Language Certificates: Acceptance and Record Checks", summary: "Check the test, result date, paper/digital format, and recipient policy without confusing a service-access window with universal certificate expiry.",
      scope: "For TOCFL holders or applicants in Taiwan and Indonesia planning to use Chinese-language results. The official FAQ supplies Taiwan and overseas testing routes. This guide does not establish a single score-age policy for all scholarships, schools, or work applications.",
      beforeYouStart: [c("Confirm which test component/level and certificate format the receiving organization needs. SC-TOP provides separate information about tests in Taiwan and overseas.", s.tocfl)],
      commonRequirements: [c("Keep the test date, score report/certificate, and recipient's format/verification instructions together. Check the issuer's current paper/digital arrangements for the relevant test date.", s.tocflDigital)],
      conditionalRequirements: [c("Old paper reports are not automatically converted into digital certificates. Reissue and verification availability should be checked separately from whether a recipient accepts the score.", s.tocflDigital)],
      suggestions: ["Ask a school or employer to confirm its score-age requirement in writing when the policy is unclear.", "If the result cannot be supplied or accepted, plan the appropriate issuer contact or new test without inventing a renewal period."],
      steps: [c("Start with SC-TOP's official FAQ and the certificate platform's applicable format guidance.", s.tocfl, s.tocflDigital), c("Ask the receiving organization how it verifies your actual result and whether a newer test is needed.", s.tocflDigital)],
      importantNotes: [c("The digital-certificate FAQ was reviewed through the official index after direct access timed out. Its service windows must not be generalized into a statutory expiry or a guaranteed acceptance period.", s.tocflDigital)],
    },
  }),
  curatedGuide({
    reviewedOn: "2026-11-12",
    id: "toefl-results", slug: "toefl-score-validity-check", nationalities: anyNationality, residences: ["TW", "ID"], document: "language-certificate", serviceType: "review",
    authority: "ETS / the receiving school or organization", sources: [s.toefl], keywords: ["TOEFL", "托福", "English language", "iBT", "score report"],
    timing: { kind: "recipient-policy", ...c("ETS states that TOEFL iBT scores are valid for two years. Check the actual test date and the recipient's requirements; a report-delivery deadline is different from a personal reminder.", s.toefl) },
    content: {
      title: "TOEFL iBT Results: Score Validity and Reporting Checks", summary: "Use ETS's official score information and the receiving institution's current requirements to plan reporting or a retest.",
      scope: "For TOEFL iBT result holders in Taiwan or Indonesia. This is not a general rule for every English test, proof that every institution accepts a result, or a way to renew an old score by editing its date.",
      beforeYouStart: [c("Identify the exact test and result date, then confirm the institution's accepted assessment and score-reporting instructions.", s.toefl)],
      commonRequirements: [c("Locate your ETS score record and the receiving institution's requested score-report destination and accepted result period.", s.toefl)],
      conditionalRequirements: [c("Check whether the recipient accepts the relevant score format or combined-score presentation before arranging delivery.", s.toefl)],
      suggestions: ["Track the test date, reporting request, and application deadline as separate events.", "When planning a retest, allow time for the actual score-report process rather than assuming an immediate result."],
      steps: [c("Review the current TOEFL iBT score page and compare the result with the institution's requirements.", s.toefl), c("Use the issuer's score-reporting route, or arrange a new test where the existing result cannot meet the recipient's rules.", s.toefl)],
      importantNotes: [c("No admission, visa, or employment acceptance is guaranteed. The issuer's reporting policy and recipient's selection rules are distinct.", s.toefl)],
    },
  }),
];
