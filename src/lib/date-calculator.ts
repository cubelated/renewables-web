/** Date-only values are Gregorian tuples, never local-midnight timestamps. */
export type CalendarDate = Readonly<{ year: number; month: number; day: number }>;
export const INPUT_CALENDARS = ["gregorian", "roc", "buddhist", "japanese"] as const;
export type Calendar = (typeof INPUT_CALENDARS)[number];
export const NUMERIC_DATE_FORMATS = ["ymd", "dmy", "mdy"] as const;
export type NumericDateFormat = (typeof NUMERIC_DATE_FORMATS)[number];
export type DateDisplayFormat = NumericDateFormat | "long";
export type DateUnit = "days" | "weeks" | "months" | "years";
export type DateErrorCode = "required" | "format" | "invalidDate" | "rocRange" | "buddhistRange" | "japaneseRange" | "range" | "amount" | "zone";
export class DateCalculatorError extends Error {
  readonly code: DateErrorCode;
  constructor(code: DateErrorCode) { super(code); this.code = code; }
}
export const MAX_OFFSET = 1_000_000;
const DAY_MS = 86_400_000;

export function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}
export function daysInMonth(year: number, month: number): number {
  return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] ?? 0;
}
export function validateDate(date: CalendarDate): CalendarDate {
  const { year, month, day } = date;
  if (![year, month, day].every(Number.isInteger) || year < 1 || year > 9999) throw new DateCalculatorError("range");
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) throw new DateCalculatorError("invalidDate");
  return date;
}
export function rocToGregorianYear(year: number): number {
  if (!Number.isInteger(year) || year < 1 || year > 8088) throw new DateCalculatorError("rocRange");
  return year + 1911;
}
export function gregorianToRocYear(year: number): number {
  if (!Number.isInteger(year) || year < 1912 || year > 9999) throw new DateCalculatorError("rocRange");
  return year - 1911;
}
// Japan adopted Gregorian month/day rules in 1873. Earlier lunar dates are excluded.
const JAPANESE_ERAS = [
  { code: "M", name: "Meiji", kanji: "明治", offset: 1867, start: "1873-01-01" },
  { code: "T", name: "Taisho", kanji: "大正", offset: 1911, start: "1912-07-30" },
  { code: "S", name: "Showa", kanji: "昭和", offset: 1925, start: "1926-12-25" },
  { code: "H", name: "Heisei", kanji: "平成", offset: 1988, start: "1989-01-08" },
  { code: "R", name: "Reiwa", kanji: "令和", offset: 2018, start: "2019-05-01" },
] as const;
function parseJapaneseDate(value: string): CalendarDate {
  const match = /^(Meiji|Taisho|Showa|Heisei|Reiwa|[MTSHR])\s*(\d{1,4})([/.-])(\d{1,2})\3(\d{1,2})$/i.exec(value);
  const kanji = /^(明治|大正|昭和|平成|令和)\s*(\d{1,4}|元)年\s*(\d{1,2})月\s*(\d{1,2})日$/.exec(value);
  if (!match && !kanji) throw new DateCalculatorError("format");
  const eraName = (kanji?.[1] ?? match![1]).toLowerCase();
  const index = JAPANESE_ERAS.findIndex((era) => [era.code.toLowerCase(), era.name.toLowerCase(), era.kanji].includes(eraName));
  const era = JAPANESE_ERAS[index];
  const eraYear = kanji?.[2] === "元" ? 1 : Number(kanji?.[2] ?? match![2]);
  if (eraYear < 1) throw new DateCalculatorError("japaneseRange");
  const date = validateDate({ year: era.offset + eraYear, month: Number(kanji?.[3] ?? match![4]), day: Number(kanji?.[4] ?? match![5]) });
  const iso = isoDate(date);
  const next = JAPANESE_ERAS[index + 1];
  if (iso < era.start || (next && iso >= next.start)) throw new DateCalculatorError("japaneseRange");
  return date;
}
export function parseDate(input: string, calendar: Calendar = "gregorian", format: NumericDateFormat = "ymd"): CalendarDate {
  const value = input.trim();
  if (!value) throw new DateCalculatorError("required");
  // Written era dates are unambiguous. Numeric order is always explicitly chosen.
  const writtenEra = /^(?:民國|明治|大正|昭和|平成|令和)/.test(value);
  if (format !== "ymd" && !writtenEra) {
    const match = /^(\d{1,2})([/.-])(\d{1,2})\2(.+)$/.exec(value);
    if (!match) throw new DateCalculatorError("format");
    const month = format === "dmy" ? match[3] : match[1];
    const day = format === "dmy" ? match[1] : match[3];
    const separator = calendar === "gregorian" ? "-" : "/";
    return parseDate(`${match[4]}${separator}${month}${separator}${day}`, calendar);
  }
  if (calendar === "japanese") return parseJapaneseDate(value);
  if (calendar === "buddhist") {
    const match = /^(?:BE\s*)?(\d{4,5})([/.-])(\d{1,2})\2(\d{1,2})$/i.exec(value);
    if (!match) throw new DateCalculatorError("format");
    const year = Number(match[1]) - 543;
    // Modern Thai civil years begin on January 1 from 1941 onward.
    if (year < 1941 || year > 9999) throw new DateCalculatorError("buddhistRange");
    return validateDate({ year, month: Number(match[3]), day: Number(match[4]) });
  }
  // Gregorian input always requires an explicit four-digit Gregorian year.
  const match = calendar === "gregorian"
    ? /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value)
    : /^(\d{1,4})([/.-])(\d{1,2})\2(\d{1,2})$/.exec(value);
  const chinese = calendar === "roc" ? /^民國\s*(\d{1,4})年\s*(\d{1,2})月\s*(\d{1,2})日$/.exec(value) : null;
  if (!match && !chinese) throw new DateCalculatorError("format");
  const parts = chinese ? [chinese[1], chinese[2], chinese[3]]
    : calendar === "roc" ? [match![1], match![3], match![4]] : [match![1], match![2], match![3]];
  const [year, month, day] = parts.map(Number);
  return validateDate({ year: calendar === "roc" ? rocToGregorianYear(year) : year, month, day });
}
export function isoDate(date: CalendarDate): string {
  validateDate(date);
  return `${String(date.year).padStart(4, "0")}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
}
export function inputDate(date: CalendarDate, calendar: Calendar, format: NumericDateFormat = "ymd"): string {
  if (format !== "ymd") {
    const year = inputDate(date, calendar).split(/[/-]/)[0];
    const month = String(date.month).padStart(2, "0");
    const day = String(date.day).padStart(2, "0");
    return format === "dmy" ? `${day}/${month}/${year}` : `${month}/${day}/${year}`;
  }
  validateDate(date);
  if (calendar === "japanese") {
    const iso = isoDate(date);
    const era = [...JAPANESE_ERAS].reverse().find((candidate) => iso >= candidate.start);
    if (!era) throw new DateCalculatorError("japaneseRange");
    return `${era.code}${date.year - era.offset}/${date.month}/${date.day}`;
  }
  if (calendar === "buddhist") {
    if (date.year < 1941) throw new DateCalculatorError("buddhistRange");
    return `${date.year + 543}/${date.month}/${date.day}`;
  }
  return calendar === "gregorian" ? isoDate(date) : `${gregorianToRocYear(date.year)}/${date.month}/${date.day}`;
}
function utcDate(date: CalendarDate): Date {
  validateDate(date);
  // setUTCFullYear avoids Date.UTC's special interpretation of years 0–99.
  const value = new Date(0);
  value.setUTCFullYear(date.year, date.month - 1, date.day);
  return value;
}
function fromUtc(value: Date): CalendarDate {
  return validateDate({ year: value.getUTCFullYear(), month: value.getUTCMonth() + 1, day: value.getUTCDate() });
}
export function differenceInDays(start: CalendarDate, end: CalendarDate): number {
  // These UTC coordinates encode calendar ordinals, not elapsed zoned time.
  return (utcDate(end).getTime() - utcDate(start).getTime()) / DAY_MS;
}
export function parseOffset(input: string): number {
  if (!/^[+-]?\d+$/.test(input.trim())) throw new DateCalculatorError("amount");
  const value = Number(input);
  if (!Number.isSafeInteger(value) || Math.abs(value) > MAX_OFFSET) throw new DateCalculatorError("amount");
  return value;
}
export function addDate(date: CalendarDate, amount: number, unit: DateUnit): CalendarDate {
  validateDate(date);
  if (!Number.isSafeInteger(amount) || Math.abs(amount) > MAX_OFFSET) throw new DateCalculatorError("amount");
  if (unit === "days" || unit === "weeks") {
    return fromUtc(new Date(utcDate(date).getTime() + amount * (unit === "weeks" ? 7 : 1) * DAY_MS));
  }
  const totalMonths = (date.year - 1) * 12 + date.month - 1 + amount * (unit === "years" ? 12 : 1);
  const year = Math.floor(totalMonths / 12) + 1;
  const month = ((totalMonths % 12) + 12) % 12 + 1;
  return validateDate({ year, month, day: Math.min(date.day, daysInMonth(year, month)) });
}
export function weeksAndDays(days: number): { weeks: number; days: number } {
  return { weeks: Math.floor(Math.abs(days) / 7), days: Math.abs(days) % 7 };
}
export function todayInZone(zone: string, instant: Date = new Date()): CalendarDate {
  try {
    const parts = new Intl.DateTimeFormat("en-US-u-ca-gregory-nu-latn", {
      timeZone: zone, year: "numeric", month: "numeric", day: "numeric",
    }).formatToParts(instant);
    const part = (type: string) => Number(parts.find((entry) => entry.type === type)?.value);
    return validateDate({ year: part("year"), month: part("month"), day: part("day") });
  } catch { throw new DateCalculatorError("zone"); }
}
export function formatDate(date: CalendarDate, locale: string): string {
  return new Intl.DateTimeFormat(locale, { calendar: "gregory", timeZone: "UTC", year: "numeric", month: "long", day: "numeric", weekday: "long" }).format(utcDate(date));
}
export function formatWeekday(date: CalendarDate, locale: string): string {
  return new Intl.DateTimeFormat(locale, { timeZone: "UTC", weekday: "long" }).format(utcDate(date));
}
export function formatCalendarDate(date: CalendarDate, calendar: Calendar, format: DateDisplayFormat, locale: string): string {
  // Validate each calendar's supported range even when Intl could extrapolate it.
  const numeric = inputDate(date, calendar, format === "long" ? "ymd" : format);
  if (format !== "long") return numeric;
  const calendarId = { gregorian: "gregory", roc: "roc", buddhist: "buddhist", japanese: "japanese" }[calendar];
  return new Intl.DateTimeFormat(locale, {
    calendar: calendarId, timeZone: "UTC", year: "numeric", month: "long", day: "numeric", weekday: "long",
    ...(calendar === "gregorian" ? {} : { era: "short" as const }),
  }).format(utcDate(date));
}
export function convertCalendarDate(input: string, from: Calendar, to: Calendar, inputFormat: NumericDateFormat = "ymd", outputFormat: DateDisplayFormat = "ymd", locale = "en-US"): string {
  return formatCalendarDate(parseDate(input, from, inputFormat), to, outputFormat, locale);
}
export function formatRocDate(date: CalendarDate, locale: string): string {
  validateDate(date);
  const year = gregorianToRocYear(date.year);
  return locale === "zh-TW" ? `民國${year}年${date.month}月${date.day}日` : `ROC ${year}/${date.month}/${date.day}`;
}
export function zoneDescription(zone: string, locale: string, instant: Date): string {
  return new Intl.DateTimeFormat(locale, { timeZone: zone, timeZoneName: "long" }).formatToParts(instant).find((part) => part.type === "timeZoneName")?.value ?? zone;
}
export const FEATURED_ZONES = ["Asia/Taipei", "Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura", "UTC"] as const;
const FALLBACK_ZONES = ["America/New_York", "America/Los_Angeles", "America/Chicago", "America/Toronto", "America/Sao_Paulo", "Europe/London", "Europe/Paris", "Europe/Berlin", "Africa/Johannesburg", "Asia/Tokyo", "Asia/Seoul", "Asia/Singapore", "Asia/Kolkata", "Australia/Sydney", "Pacific/Auckland"];
export function availableTimeZones(): string[] {
  const intl = Intl as typeof Intl & { supportedValuesOf?: (key: string) => string[] };
  return [...new Set([...FEATURED_ZONES, ...(intl.supportedValuesOf?.("timeZone") ?? FALLBACK_ZONES)])].sort();
}
