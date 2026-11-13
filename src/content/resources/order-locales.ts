import type { ResourceLanguage } from "./types";

export const resourceOrderCopy: Record<ResourceLanguage, { regional: string; alphabetical: string; residenceSuggested: string; residenceHelp: string }> = {
  en: {
    regional: "{residence} guides first, then alphabetical by title. Your device time zone is an approximate hint; select your residence for more relevant results.",
    alphabetical: "Guides are ordered alphabetically by title.",
    residenceSuggested: "Suggested from your browser time zone, which may differ from your location. Check or change your residence.",
    residenceHelp: "Choose where you currently live, or leave blank to browse all locations.",
  },
  "id-ID": {
    regional: "Panduan untuk {residence} ditampilkan lebih dahulu, lalu menurut abjad judul. Zona waktu perangkat hanya perkiraan; pilih tempat tinggal untuk hasil yang lebih sesuai.",
    alphabetical: "Panduan diurutkan menurut abjad judul.",
    residenceSuggested: "Saran berdasarkan zona waktu browser, yang mungkin berbeda dari lokasi Anda. Periksa atau ubah tempat tinggal Anda.",
    residenceHelp: "Pilih tempat tinggal Anda saat ini, atau kosongkan untuk melihat semua lokasi.",
  },
  "zh-TW": {
    regional: "優先顯示{residence}適用的指南，再依標題排序。裝置時區僅供推測；選擇居住地可找到更適合的結果。",
    alphabetical: "指南依標題排序。",
    residenceSuggested: "依瀏覽器時區預選，可能與實際所在地不同。請確認或變更居住地。",
    residenceHelp: "選擇目前居住地，或留空以瀏覽所有地區。",
  },
};
