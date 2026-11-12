import type { ResourceGuide } from "./types";

export const taiwanArcStudents: ResourceGuide = {
  id: "tw-arc-students", slug: "taiwan-arc-extension-students",
  nationalities: { kind: "foreign-national", excludedCodes: ["TW", "CN", "HK", "MO"] },
  residences: ["TW"], document: "arc", residenceStatuses: ["student", "overseas-student"],
  authority: { name: "Taiwan National Immigration Agency (NIA)", sourceId: "nia-students" },
  primarySourceId: "nia-students", updatedOn: "2026-11-12", reviewedOn: "2026-11-12", editorialStatus: "published",
  keywords: ["international student", "foreign student", "ARC renewal", "居留證延期申請", "外籍學生", "izin tinggal pelajar"],
  sources: [
    { id: "nia-students", title: "0929 — Online residence applications for foreign students", organization: "National Immigration Agency", url: "https://www.immigration.gov.tw/5475/5478/141465/141808/417829/cp_news", checkedOn: "2026-11-12", updatedOn: "2026-08-28", access: "direct", claims: ["Eligibility §2", "Documents §3", "Application and collection §4", "Filing period §7(6)"] },
    { id: "nia-student-portal", title: "NIA student online application system", organization: "National Immigration Agency", url: "https://coa.immigration.gov.tw/coa-frontend/student/entry", checkedOn: "2026-11-12", access: "direct", claims: ["Student application entry point"], note: "Linked by NIA guideline 0929. No account was created and no application was submitted." },
  ],
  translationReviews: { en: "2026-11-12", "zh-TW": "2026-11-12" },
  translations: { en: {
    title: "Taiwan ARC Extension for International Students",
    summary: "Preparation for eligible foreign students extending an existing Taiwan ARC through the NIA student online system.",
    scope: "For foreign nationals with an existing study-based ARC who remain enrolled at an approved school. This guide covers continued study, not first residence, graduation, or a change of residence purpose. Mainland China, Hong Kong, Macao, and Taiwan household-registration cases need separate confirmation.",
    beforeYouStart: [{ text: "Confirm continued enrollment and your residence category with your school. Mandarin-study and overseas-compatriot cases have additional conditions.", sourceIds: ["nia-students"] }],
    commonRequirements: [
      { text: "Prepare your passport, existing ARC, a recent qualifying 2-inch photograph, and proof of enrollment issued within one month.", sourceIds: ["nia-students"] },
    ],
    conditionalRequirements: [{ text: "Mandarin students also need recent-semester attendance evidence. Overseas documents may need authentication and a Chinese translation; check the applicable section.", sourceIds: ["nia-students"] }],
    suggestions: ["Ask your school's international office to check that the enrollment evidence covers your situation.", "Keep a private copy of submissions and receipts. A school registration date and your ARC expiry date are different records."],
    steps: [
      { text: "Register and upload the required documents in the NIA student online system.", sourceIds: ["nia-students", "nia-student-portal"] },
      { text: "Monitor the application for corrections. After approval, pay within five working days.", sourceIds: ["nia-students"] },
      { text: "Follow the assigned collection route: download an electronic ARC, or print the payment receipt and collect the chip ARC at the selected NIA service center, returning the old card for an extension.", sourceIds: ["nia-students"] },
    ],
    importantNotes: [
      { text: "Guideline 0929 §7(6) says to apply within the three months before residence expires. Confirm your own circumstances with NIA. The calculator does not determine a statutory filing date.", sourceIds: ["nia-students"] },
      { text: "Use the student-specific guideline for this route. Do not substitute the general ARC checklist for a student application.", sourceIds: ["nia-students"] },
    ],
  }, "zh-TW": {
    title: "外籍學生在台灣辦理 ARC 居留證延期",
    summary: "供符合資格的外籍學生使用移民署學生線上系統，準備辦理既有居留證延期。",
    scope: "適用於持有就學事由居留證，並持續在核准學校就讀的外籍人士。本指南僅涵蓋繼續就學的延期，不涵蓋初次居留、畢業或變更居留事由。中國大陸、香港、澳門及台灣戶籍相關案件須另行確認。",
    beforeYouStart: [{ text: "請與學校確認在學狀態及居留類別。研習中文及僑生案件另有適用條件。", sourceIds: ["nia-students"] }],
    commonRequirements: [{ text: "準備護照、現有居留證、符合規格的近期兩吋照片，以及一個月內核發的在學證明。", sourceIds: ["nia-students"] }],
    conditionalRequirements: [{ text: "研習中文者另須提供最近一學期出席紀錄。境外文件可能須經驗證並附中文譯本；請確認適用條款。", sourceIds: ["nia-students"] }],
    suggestions: ["可請學校國際事務單位協助確認在學證明是否符合您的情況。", "自行保存送件資料及收據。學校註冊日期與居留證到期日是不同的紀錄。"],
    steps: [
      { text: "在移民署學生線上系統註冊，並上傳所需文件。", sourceIds: ["nia-students", "nia-student-portal"] },
      { text: "留意補件通知；核准後應於五個工作日內繳費。", sourceIds: ["nia-students"] },
      { text: "依核定方式下載電子居留證，或列印繳費收據至指定移民署服務站領取晶片居留證；延期換領時須繳回舊證。", sourceIds: ["nia-students"] },
    ],
    importantNotes: [
      { text: "0929 須知第 7(6) 點規定於居留期限屆滿前三個月內申請延期。請向移民署確認個案適用情況。計算器不會判定法定申請日期。", sourceIds: ["nia-students"] },
      { text: "本申請途徑應以學生專用須知為準，請勿以一般居留證清單取代學生申請規定。", sourceIds: ["nia-students"] },
    ],
  } },
};
