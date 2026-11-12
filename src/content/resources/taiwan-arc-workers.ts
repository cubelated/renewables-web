import type { ResourceGuide } from "./types";

export const taiwanArcWorkers: ResourceGuide = {
  id: "tw-arc-workers", slug: "taiwan-arc-extension-workers",
  nationalities: { kind: "foreign-national", excludedCodes: ["TW", "CN", "HK", "MO"] },
  residences: ["TW"], document: "arc", residenceStatuses: ["worker"],
  authority: { name: "Taiwan National Immigration Agency (NIA)", sourceId: "nia-residence" },
  primarySourceId: "wda-workers", updatedOn: "2026-11-12", reviewedOn: "2026-11-12", editorialStatus: "published",
  keywords: ["migrant worker", "foreign worker", "ARC renewal", "居留證延期申請", "移工", "perpanjangan ARC pekerja"],
  sources: [
    { id: "nia-residence", title: "0902 — Residency and extension guidelines", organization: "National Immigration Agency", url: "https://www.immigration.gov.tw/5475/5478/141465/141808/141970", checkedOn: "2026-11-12", updatedOn: "2026-04-14", access: "direct", claims: ["Continuing residence purpose §2(3)", "Employment evidence §3(1)(d)(ii)", "Extension documents §3(2)"] },
    { id: "wda-workers", title: "Timetable for applying to extend an Alien Resident Certificate (ARC)", organization: "Ministry of Labor, Workforce Development Agency", url: "https://fw.wda.gov.tw/wda-employer/home/file/2c95efb38d75b733018d781fb6c0058a", checkedOn: "2026-11-12", updatedOn: "2026-10-19", access: "direct", claims: ["Foreign-worker routes", "Employer/broker involvement", "Filing period"] },
  ],
  translationReviews: { en: "2026-11-12", "zh-TW": "2026-11-12" },
  translations: { en: {
    title: "Taiwan ARC Extension for Foreign Workers",
    summary: "A starting point for migrant workers continuing their employment-based residence, including employer-assisted and in-person routes.",
    scope: "Limited to migrant workers with an existing employment-based ARC and a continuing approved employment purpose. This is not a universal route for foreign professionals, Gold Card holders, jobseekers, dependents, or workers changing employers or residence purpose.",
    beforeYouStart: [{ text: "Confirm with NIA and your employer or broker that your worker category and continuing employment qualify for this extension route.", sourceIds: ["nia-residence", "wda-workers"] }],
    commonRequirements: [
      { text: "For the general in-person extension checklist: application form, recent qualifying photo, passport and ARC originals and copies, and evidence of the continuing residence purpose.", sourceIds: ["nia-residence"] },
      { text: "Employment evidence includes the competent authority's approval and a sealed employment certificate issued within one month. Confirm which documents apply to your worker category.", sourceIds: ["nia-residence"] },
    ],
    conditionalRequirements: [
      { text: "An agent needs authorization. Updated residence-address evidence is required when your address changes. Overseas documents can require authentication or translation.", sourceIds: ["nia-residence"] },
    ],
    suggestions: ["Agree who will file the application and how you will receive submission and collection confirmation.", "Track work-permit, passport, and ARC validity separately. Keep your own document copies and receipts."],
    steps: [
      { text: "Choose the applicable route with NIA: WDA describes online filing through an employer or labor broker using NIA's Foreign Worker Online Application System, or in-person filing by the employer or worker at the NIA service station for the residence area.", sourceIds: ["wda-workers"] },
      { text: "Confirm the route-specific document list with NIA before submission. Follow NIA's payment, correction, and collection instructions; keep the receipt.", sourceIds: ["nia-residence", "wda-workers"] },
    ],
    importantNotes: [
      { text: "WDA states that foreign workers apply within the three months before ARC expiry. Confirm applicability with NIA; no calculator reminder is a legal filing deadline.", sourceIds: ["wda-workers"] },
      { text: "NIA handles residence permission. The labor authority handles employment authorization. An extended work permit does not by itself complete an ARC extension.", sourceIds: ["nia-residence", "wda-workers"] },
    ],
  }, "zh-TW": {
    title: "外籍移工在台灣辦理 ARC 居留證延期",
    summary: "供延續原受僱居留事由的移工參考，說明雇主或仲介協助線上申請，以及臨櫃申請的起點。",
    scope: "僅適用於持有受僱事由居留證，並延續核准受僱事由的移工。本指南不通用於外籍專業人士、就業金卡持有人、求職者、依親者，或變更雇主及居留事由的案件。",
    beforeYouStart: [{ text: "請與移民署及雇主或仲介確認您的移工類別與持續受僱情況是否適用此延期途徑。", sourceIds: ["nia-residence", "wda-workers"] }],
    commonRequirements: [
      { text: "一般臨櫃延期清單包括申請表、符合規格的近期照片、護照與居留證正本及影本，以及延續原居留事由的證明。", sourceIds: ["nia-residence"] },
      { text: "受僱證明包括主管機關核准文件及一個月內核發、蓋有公司及負責人印章的在職證明。請確認您的移工類別適用哪些文件。", sourceIds: ["nia-residence"] },
    ],
    conditionalRequirements: [{ text: "委託代理人申請須附委託書；住址變更時須提供新的居住證明。境外文件可能須經驗證或附譯本。", sourceIds: ["nia-residence"] }],
    suggestions: ["事先確認由誰送件，以及如何取得送件與領證通知。", "分別追蹤工作許可、護照及居留證效期，並自行保存文件影本及收據。"],
    steps: [
      { text: "向移民署確認適用途徑。勞動力發展署說明可由雇主或仲介透過移民署移工線上申辦系統申請，或由雇主、移工本人至居住地的移民署服務站臨櫃申請。", sourceIds: ["wda-workers"] },
      { text: "送件前向移民署確認該途徑的文件清單。依移民署指示繳費、補件及領證，並保留收據。", sourceIds: ["nia-residence", "wda-workers"] },
    ],
    importantNotes: [
      { text: "勞動力發展署說明，移工應於居留證到期前三個月內申請延期。請向移民署確認適用情況；計算器的個人提醒不是法定送件期限。", sourceIds: ["wda-workers"] },
      { text: "移民署負責居留許可，勞政機關負責工作許可。工作許可延期並不代表已完成居留證延期。", sourceIds: ["nia-residence", "wda-workers"] },
    ],
  } },
};
