import type { ResourceLanguage } from "./types";

export const resourceDiscoveryCopy: Record<ResourceLanguage, {
  metaTitle: string;
  editorialTitle: string;
  editorialParagraphs: string[];
}> = {
  en: {
    metaTitle: "Document Renewal Guides by Country: Taiwan & Indonesia",
    editorialTitle: "How Renewables reviews these guides",
    editorialParagraphs: [
      "Renewables writes independent preparation summaries from the linked government authorities and document issuers. It does not issue documents or decide immigration eligibility.",
      "Each guide records its scope, sources and source-review date. Access limitations and conditional requirements are disclosed. Source review and translation review are recorded separately; publishing a website update does not imply that either review has been repeated.",
      "Only reviewed guides and translations are published. Where evidence is incomplete, the finder shows a gap or an official starting point. To suggest a correction, use the guide's report link and include an official reference without personal document details.",
    ],
  },
  "id-ID": {
    metaTitle: "Panduan Perpanjangan Dokumen: Taiwan & Indonesia",
    editorialTitle: "Cara Renewables meninjau panduan ini",
    editorialParagraphs: [
      "Renewables menulis ringkasan persiapan independen berdasarkan tautan instansi pemerintah dan penerbit dokumen. Renewables tidak menerbitkan dokumen atau menentukan kelayakan imigrasi.",
      "Setiap panduan mencatat cakupan, sumber, dan tanggal peninjauan sumber. Keterbatasan akses dan persyaratan bersyarat dijelaskan. Peninjauan sumber dan terjemahan dicatat terpisah; pembaruan situs tidak berarti kedua peninjauan tersebut telah diulang.",
      "Hanya panduan dan terjemahan yang telah ditinjau yang diterbitkan. Bila bukti belum lengkap, pencari menampilkan kekosongan panduan atau rujukan resmi. Untuk mengusulkan koreksi, gunakan tautan laporan pada panduan dan sertakan sumber resmi tanpa data dokumen pribadi.",
    ],
  },
  "zh-TW": {
    metaTitle: "台灣與印尼證件續期指南：護照、居留證與官方資源",
    editorialTitle: "Renewables 如何查核這些指南",
    editorialParagraphs: [
      "Renewables 依據連結的政府機關與證件核發機構資訊，撰寫獨立的準備摘要。我們不核發證件，也不判定移民或居留資格。",
      "每篇指南記錄適用範圍、來源及來源查核日期，並說明存取限制與條件式要求。來源查核與翻譯審閱分開記錄，網站更新不代表重新查核資料或翻譯。",
      "僅發布已查核的指南與已審閱的翻譯。證據不足時，搜尋工具會明示指南缺漏或提供官方起點。如需建議更正，請使用指南的回報連結，附上官方來源，勿提供個人證件資料。",
    ],
  },
};
