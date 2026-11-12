import type { ResourceLanguage } from "./types";

export const resourceOrderCopy: Record<ResourceLanguage, { regional: string; alphabetical: string }> = {
  en: {
    regional: "{residence} guides first, then alphabetical by title. Your device time zone is an approximate hint; select your residence for more relevant results.",
    alphabetical: "Guides are ordered alphabetically by title.",
  },
  "id-ID": {
    regional: "Panduan untuk {residence} ditampilkan lebih dahulu, lalu menurut abjad judul. Zona waktu perangkat hanya perkiraan; pilih tempat tinggal untuk hasil yang lebih sesuai.",
    alphabetical: "Panduan diurutkan menurut abjad judul.",
  },
  "zh-TW": {
    regional: "優先顯示{residence}適用的指南，再依標題排序。裝置時區僅供推測；選擇居住地可找到更適合的結果。",
    alphabetical: "指南依標題排序。",
  },
};
