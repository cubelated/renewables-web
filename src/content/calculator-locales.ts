import type { CalculatorLanguage } from "./expiry-calculator";

type CalculatorLocale = {
  language: CalculatorLanguage;
  path: string;
  label: string;
  ogLocale: string;
  title: string;
  description: string;
  imageAlt: string;
  browserRequirements: string;
  features: readonly string[];
};

export const CALCULATOR_LOCALES = {
  en: {
    language: "en", path: "/tools/expiry-calculator", label: "English", ogLocale: "en_US",
    title: "Free Expiry Date Calculator & Calendar Converter | Renewables",
    description: "Count days until expiry, compare dates, plan reminders, and convert Gregorian, ROC, Buddhist and Japanese dates. Free, private, with time zone support.",
    imageAlt: "Renewables document expiry tracker dashboard",
    browserRequirements: "Requires JavaScript. Calculations run locally in your browser.",
    features: ["Expiry countdown", "Calendar date difference", "Reminder date arithmetic", "Conversion between Gregorian, ROC, Thai Buddhist and Japanese era calendars", "Explicit date input and result formats", "IANA time zone selection"],
  },
  "zh-TW": {
    language: "zh-TW", path: "/zh-tw/tools/expiry-calculator", label: "繁體中文", ogLocale: "zh_TW",
    title: "免費到期日計算器與曆法換算 | Renewables",
    description: "免費計算距離到期天數、比較日期與規劃提醒，支援西元、民國、泰國佛曆及日本年號雙向換算。可自訂日期格式與時區，免登入，所有計算均在瀏覽器本機完成。",
    imageAlt: "Renewables 證件到期追蹤儀表板",
    browserRequirements: "需要 JavaScript，所有計算均在瀏覽器本機執行。",
    features: ["到期倒數", "日期差距計算", "提醒日期加減", "西元、民國、泰國佛曆與日本年號雙向換算", "自訂輸入與結果日期格式", "IANA 時區選擇"],
  },
  "id-ID": {
    language: "id-ID", path: "/id/tools/expiry-calculator", label: "Bahasa Indonesia", ogLocale: "id_ID",
    title: "Kalkulator Kedaluwarsa & Konversi Kalender Gratis | Renewables",
    description: "Hitung hari hingga kedaluwarsa, selisih tanggal, dan tanggal pengingat. Konversi kalender Masehi, ROC, Buddha Thailand, dan era Jepang. Gratis tanpa akun.",
    imageAlt: "Dasbor pelacakan kedaluwarsa dokumen Renewables",
    browserRequirements: "Memerlukan JavaScript. Perhitungan berjalan secara lokal di browser Anda.",
    features: ["Hitung mundur kedaluwarsa", "Selisih tanggal kalender", "Perhitungan tanggal pengingat", "Konversi antara kalender Masehi, ROC, Buddha Thailand dan era Jepang", "Format input dan hasil tanggal pilihan", "Pilihan zona waktu IANA"],
  },
} as const satisfies Record<CalculatorLanguage, CalculatorLocale>;

export const CALCULATOR_LANGUAGES = Object.keys(CALCULATOR_LOCALES) as CalculatorLanguage[];

/** Match only real published paths; callers normalize trailing slashes first. */
export function calculatorLocaleForPath(path: string) {
  return Object.values(CALCULATOR_LOCALES).find((locale) => locale.path === path) ?? null;
}
