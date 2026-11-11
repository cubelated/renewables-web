import assert from "node:assert/strict";
import test from "node:test";
import { addDate, availableTimeZones, convertCalendarDate, DateCalculatorError, differenceInDays, formatCalendarDate, formatDate, formatRocDate, formatWeekday, gregorianToRocYear, inputDate, INPUT_CALENDARS, isLeapYear, isoDate, NUMERIC_DATE_FORMATS, parseDate, parseOffset, rocToGregorianYear, todayInZone, weeksAndDays, zoneDescription } from "../src/lib/date-calculator.ts";
import { copyResult } from "../src/lib/calculator-clipboard.ts";
import { serverClock } from "../src/lib/calculator-clock.ts";
import { calculatorCopy, interpolate } from "../src/content/expiry-calculator.ts";
const date = (value) => parseDate(value);
const error = (code) => (value) => value instanceof DateCalculatorError && value.code === code;

test("Gregorian and ROC years round-trip, including 民國115年 = 2026", () => {
  assert.equal(rocToGregorianYear(115), 2026);
  assert.equal(gregorianToRocYear(2026), 115);
  assert.equal(rocToGregorianYear(1), 1912);
  assert.equal(rocToGregorianYear(8088), 9999);
  assert.equal(formatRocDate(date("2026-11-11"), "zh-TW"), "民國115年11月11日");
  assert.equal(inputDate(date("2026-11-11"), "roc"), "115/11/11");
});
for (const value of ["115/11/11", "115.11.11", "115-11-11", "民國115年11月11日"]) {
  test(`ROC format: ${value}`, () => assert.equal(isoDate(parseDate(value, "roc")), "2026-11-11"));
}
test("ROC example and year boundaries", () => {
  assert.equal(isoDate(parseDate("民國116年2月28日", "roc")), "2027-02-28");
  for (const year of [0, -1, 8089, NaN, Infinity, 1.2]) assert.throws(() => rocToGregorianYear(year), error("rocRange"));
  assert.throws(() => gregorianToRocYear(1911), error("rocRange"));
  assert.throws(() => parseDate("0/1/1", "roc"), error("rocRange"));
});
test("Thai Buddhist inputs use Gregorian month/day rules and a 543-year offset", () => {
  for (const value of ["2569/11/11", "2569.11.11", "2569-11-11", "BE 2569-11-11"]) {
    assert.equal(isoDate(parseDate(value, "buddhist")), "2026-11-11");
  }
  assert.equal(inputDate(date("2026-11-11"), "buddhist"), "2569/11/11");
  assert.equal(isoDate(parseDate("2484/1/1", "buddhist")), "1941-01-01");
  assert.equal(isoDate(parseDate("10542/12/31", "buddhist")), "9999-12-31");
  assert.equal(isoDate(parseDate("2567/2/29", "buddhist")), "2024-02-29");
  assert.throws(() => parseDate("2569/2/29", "buddhist"), error("invalidDate"));
  assert.throws(() => parseDate("2483/12/31", "buddhist"), error("buddhistRange"));
  assert.throws(() => parseDate("10543/1/1", "buddhist"), error("buddhistRange"));
  assert.throws(() => inputDate(date("1940-12-31"), "buddhist"), error("buddhistRange"));
  assert.equal(isoDate(addDate(parseDate("2570/1/31", "buddhist"), 1, "months")), "2027-02-28");
});
test("Japanese era input accepts abbreviations, full era names and kanji", () => {
  for (const value of ["R8/11/11", "r8-11-11", "Reiwa 8.11.11", "令和8年11月11日"]) {
    assert.equal(isoDate(parseDate(value, "japanese")), "2026-11-11");
  }
  assert.equal(isoDate(parseDate("令和元年5月1日", "japanese")), "2019-05-01");
  assert.equal(inputDate(date("2026-11-11"), "japanese"), "R8/11/11");
  assert.equal(isoDate(parseDate("M6/1/1", "japanese")), "1873-01-01");
  assert.equal(isoDate(parseDate("H4/2/29", "japanese")), "1992-02-29");
  assert.throws(() => parseDate("R8/2/29", "japanese"), error("invalidDate"));
});
test("Japanese era boundaries are validated down to the day", () => {
  const boundaries = [
    ["M45/7/29", "T1/7/30", "1912-07-29", "1912-07-30"],
    ["T15/12/24", "S1/12/25", "1926-12-24", "1926-12-25"],
    ["S64/1/7", "H1/1/8", "1989-01-07", "1989-01-08"],
    ["H31/4/30", "R1/5/1", "2019-04-30", "2019-05-01"],
  ];
  for (const [before, after, isoBefore, isoAfter] of boundaries) {
    assert.equal(isoDate(parseDate(before, "japanese")), isoBefore);
    assert.equal(isoDate(parseDate(after, "japanese")), isoAfter);
    assert.equal(inputDate(date(isoBefore), "japanese"), before);
    assert.equal(inputDate(date(isoAfter), "japanese"), after);
  }
  for (const value of ["M45/7/30", "T1/7/29", "T15/12/25", "S1/12/24", "S64/1/8", "H1/1/7", "H31/5/1", "R1/4/30", "R0/5/1", "M5/12/31"]) {
    assert.throws(() => parseDate(value, "japanese"), error("japaneseRange"), value);
  }
  assert.throws(() => inputDate(date("1872-12-31"), "japanese"), error("japaneseRange"));
});
test("switching between all supported input calendars preserves the actual date", () => {
  for (const calendar of ["gregorian", "roc", "buddhist", "japanese"]) {
    const value = date("2026-11-11");
    assert.deepEqual(parseDate(inputDate(value, calendar), calendar), value);
  }
});
test("all 16 calendar pairs support all explicit numeric input and output orders", () => {
  const value = date("2026-12-05");
  for (const from of INPUT_CALENDARS) for (const to of INPUT_CALENDARS) {
    for (const sourceFormat of NUMERIC_DATE_FORMATS) for (const targetFormat of NUMERIC_DATE_FORMATS) {
      const source = inputDate(value, from, sourceFormat);
      const result = convertCalendarDate(source, from, to, sourceFormat, targetFormat);
      assert.deepEqual(parseDate(result, to, targetFormat), value, `${from}/${sourceFormat} → ${to}/${targetFormat}`);
    }
  }
});
test("ambiguous numeric dates follow the selected order and never guess", () => {
  assert.equal(isoDate(parseDate("05/12/2026", "gregorian", "dmy")), "2026-12-05");
  assert.equal(isoDate(parseDate("05/12/2026", "gregorian", "mdy")), "2026-05-12");
  assert.throws(() => parseDate("2026-12-05", "gregorian", "dmy"), error("format"));
  assert.throws(() => parseDate("05/12/2026", "gregorian", "ymd"), error("format"));
  assert.throws(() => parseDate("31/02/2026", "gregorian", "dmy"), error("invalidDate"));
  assert.throws(() => parseDate("12/05/26", "gregorian", "mdy"), error("format"));
  assert.equal(isoDate(parseDate("令和元年5月1日", "japanese", "dmy")), "2019-05-01");
  assert.equal(isoDate(parseDate("民國115年11月11日", "roc", "mdy")), "2026-11-11");
});
test("conversion targets validate their own range, independently of the source", () => {
  assert.equal(convertCalendarDate("1900-01-01", "gregorian", "gregorian"), "1900-01-01");
  assert.equal(convertCalendarDate("1900-01-01", "gregorian", "japanese"), "M33/1/1");
  assert.throws(() => convertCalendarDate("1900-01-01", "gregorian", "roc"), error("rocRange"));
  assert.throws(() => convertCalendarDate("1940-01-01", "gregorian", "buddhist"), error("buddhistRange"));
  assert.throws(() => convertCalendarDate("1872-12-31", "gregorian", "japanese"), error("japaneseRange"));
});
test("written result formats localize the selected calendar while preserving its date", () => {
  const value = date("2026-11-11");
  for (const locale of ["en-US", "zh-TW", "id-ID"]) for (const calendar of INPUT_CALENDARS) {
    const rendered = formatCalendarDate(value, calendar, "long", locale);
    const intl = new Intl.DateTimeFormat(locale, { calendar: { gregorian: "gregory", roc: "roc", buddhist: "buddhist", japanese: "japanese" }[calendar], timeZone: "UTC", year: "numeric", month: "long", day: "numeric", weekday: "long", ...(calendar === "gregorian" ? {} : { era: "short" }) }).format(new Date("2026-11-11T00:00:00Z"));
    assert.equal(rendered, intl);
  }
  assert.equal(formatCalendarDate(value, "gregorian", "dmy", "en-US"), "11/11/2026");
  assert.equal(formatCalendarDate(value, "japanese", "mdy", "en-US"), "11/11/R8");
});
test("Gregorian years are explicit; no automatic ROC or locale parsing", () => {
  for (const value of ["115/11/11", "115-11-11", "26-11-11", "11/12/2026", "2026-11-11T00:00:00Z", "2026-11-11 trailing"]) assert.throws(() => parseDate(value), error("format"));
  assert.equal(isoDate(date("0115-11-11")), "0115-11-11");
  assert.throws(() => parseDate("115/11-11", "roc"), error("format"));
});
test("leap years include the 100/400 year rules", () => {
  for (const year of [2000, 2024, 2400]) assert(isLeapYear(year));
  for (const year of [1900, 2027, 2100]) assert(!isLeapYear(year));
  assert.equal(isoDate(date("2000-02-29")), "2000-02-29");
  assert.equal(isoDate(parseDate("113/2/29", "roc")), "2024-02-29");
});
test("impossible full dates are rejected in both calendars", () => {
  for (const value of ["2027-02-29", "2024-02-30", "1900-02-29", "2026-04-31", "2026-00-01", "2026-13-01", "2026-01-00"]) assert.throws(() => date(value), error("invalidDate"));
  for (const value of ["115/2/29", "113/2/30", "115/13/11"]) assert.throws(() => parseDate(value, "roc"), error("invalidDate"));
  assert.throws(() => date("0000-01-01"), error("range"));
  assert.throws(() => date(""), error("required"));
});
test("today zero, tomorrow one, past dates negative, and example countdown", () => {
  const today = date("2026-11-11");
  assert.equal(differenceInDays(today, today), 0);
  assert.equal(differenceInDays(today, date("2026-11-12")), 1);
  assert.equal(differenceInDays(today, date("2026-11-10")), -1);
  assert.equal(differenceInDays(today, date("2027-05-15")), 185);
  assert.deepEqual(weeksAndDays(185), { weeks: 26, days: 3 });
  assert.deepEqual(weeksAndDays(-8), { weeks: 1, days: 1 });
});
test("exclusive-start differences cross years and leap days", () => {
  assert.equal(differenceInDays(date("2026-12-31"), date("2027-01-01")), 1);
  assert.equal(differenceInDays(date("2024-02-28"), date("2024-03-01")), 2);
  assert.equal(differenceInDays(date("2027-01-01"), date("2026-12-31")), -1);
});
test("month arithmetic clamps in leap and non-leap years", () => {
  assert.equal(isoDate(addDate(date("2027-01-31"), 1, "months")), "2027-02-28");
  assert.equal(isoDate(addDate(date("2024-01-31"), 1, "months")), "2024-02-29");
  assert.equal(isoDate(addDate(date("2024-03-31"), -1, "months")), "2024-02-29");
  assert.equal(isoDate(addDate(date("2027-01-31"), -2, "months")), "2026-11-30");
  assert.equal(isoDate(addDate(date("2027-01-31"), 2, "months")), "2027-03-31");
});
test("year arithmetic clamps leap days without assuming 365 days", () => {
  assert.equal(isoDate(addDate(date("2024-02-29"), 1, "years")), "2025-02-28");
  assert.equal(isoDate(addDate(date("2024-02-29"), 4, "years")), "2028-02-29");
  assert.equal(isoDate(addDate(date("2024-01-01"), 1, "years")), "2025-01-01");
});
test("positive, negative, zero and week offsets, including reminders", () => {
  const start = date("2027-05-15");
  assert.equal(isoDate(addDate(start, -30, "days")), "2027-04-15");
  assert.equal(isoDate(addDate(start, 30, "days")), "2027-06-14");
  assert.equal(isoDate(addDate(start, -2, "weeks")), "2027-05-01");
  assert.equal(isoDate(addDate(start, 0, "months")), "2027-05-15");
  for (const offset of [7, 14, 30, 60, 90]) assert.equal(differenceInDays(addDate(start, -offset, "days"), start), offset);
});
test("numeric validation and bounded results prevent overflow", () => {
  for (const value of ["", " ", "1.5", "1e3", "Infinity", "NaN", "1000001", "-1000001", "1 day"]) assert.throws(() => parseOffset(value), error("amount"));
  assert.equal(parseOffset("-30"), -30);
  assert.equal(parseOffset("+30"), 30);
  assert.throws(() => addDate(date("2026-01-01"), Infinity, "days"), error("amount"));
  assert.throws(() => addDate(date("9999-12-31"), 1, "days"), error("range"));
  assert.throws(() => addDate(date("0001-01-01"), -1, "months"), error("range"));
  assert.throws(() => addDate(date("2026-01-01"), 1000000, "years"), error("range"));
  assert.equal(isoDate(addDate(date("0099-12-31"), 1, "days")), "0100-01-01");
});
test("Taiwan versus UTC near midnight preserves input date", () => {
  const instant = new Date("2026-11-10T16:01:00Z");
  const expiry = date("2026-11-11");
  assert.equal(isoDate(todayInZone("Asia/Taipei", instant)), "2026-11-11");
  assert.equal(isoDate(todayInZone("UTC", instant)), "2026-11-10");
  assert.equal(differenceInDays(todayInZone("Asia/Taipei", instant), expiry), 0);
  assert.equal(differenceInDays(todayInZone("UTC", instant), expiry), 1);
  assert.equal(isoDate(expiry), "2026-11-11");
});
test("Indonesia’s three IANA zones determine today independently", () => {
  const instant = new Date("2026-11-10T16:30:00Z");
  assert.equal(isoDate(todayInZone("Asia/Jakarta", instant)), "2026-11-10");
  assert.equal(isoDate(todayInZone("Asia/Makassar", instant)), "2026-11-11");
  assert.equal(isoDate(todayInZone("Asia/Jayapura", instant)), "2026-11-11");
});
test("DST spring and fall: calendar days differ from elapsed timestamps", () => {
  for (const [start, end, hours] of [["2026-03-08T05:00:00Z", "2026-03-09T04:00:00Z", 23], ["2026-11-01T04:00:00Z", "2026-11-02T05:00:00Z", 25]]) {
    const a = new Date(start), b = new Date(end);
    assert.equal((b - a) / 3600000, hours);
    assert.equal(differenceInDays(todayInZone("America/New_York", a), todayInZone("America/New_York", b)), 1);
  }
  assert.equal(isoDate(todayInZone("Europe/London", new Date("2026-03-29T23:30:00Z"))), "2026-03-30");
  assert.equal(isoDate(todayInZone("Australia/Sydney", new Date("2026-10-04T13:30:00Z"))), "2026-10-05");
  assert.notEqual(zoneDescription("America/New_York", "en-US", new Date("2026-01-01")), zoneDescription("America/New_York", "en-US", new Date("2026-07-01")));
});
test("localized formatting preserves the date in all three languages", () => {
  const value = date("2026-11-11");
  assert.match(formatDate(value, "en-US"), /Wednesday, November 11, 2026/);
  assert.match(formatDate(value, "zh-TW"), /2026年11月11日/);
  assert.match(formatDate(value, "id-ID"), /11 November 2026/);
  assert.equal(formatWeekday(value, "en-US"), "Wednesday");
  assert.equal(formatWeekday(value, "zh-TW"), "星期三");
  assert.equal(formatWeekday(value, "id-ID"), "Rabu");
  assert.equal(isoDate(value), "2026-11-11");
});
test("supported zone selection includes required zones and DST regions", () => {
  const zones = availableTimeZones();
  for (const zone of ["Asia/Taipei", "Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura", "UTC", "America/New_York", "Europe/London"]) assert(zones.includes(zone));
  assert.throws(() => todayInZone("Invalid/Zone"), error("zone"));
});
test("copy writes only the requested result and handles failures", async () => {
  const writes = [];
  assert(await copyResult("Result: 2027-05-15", { writeText: async (text) => { writes.push(text); } }));
  assert.deepEqual(writes, ["Result: 2027-05-15"]);
  assert.equal(await copyResult("Result", { writeText: async () => { throw new Error("Denied"); } }), false);
  assert.equal(await copyResult("", { writeText: async () => assert.fail("empty results must not be written") }), false);
  assert.equal(await copyResult("Result", undefined), false);
});
test("SSR clock is stable regardless of host time zone or time", () => assert.equal(serverClock(), null));
test("translations contain the same keys, errors and complete explanatory content", () => {
  for (const copy of Object.values(calculatorCopy)) {
    assert.deepEqual(Object.keys(copy).sort(), Object.keys(calculatorCopy.en).sort());
    assert.deepEqual(Object.keys(copy.errors).sort(), Object.keys(calculatorCopy.en.errors).sort());
    assert.equal(copy.guides.length, calculatorCopy.en.guides.length);
    assert.equal(copy.faqs.length, calculatorCopy.en.faqs.length);
  }
  assert.equal(interpolate("{days} days", { days: 30 }), "30 days");
});
