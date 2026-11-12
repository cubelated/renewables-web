import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeftRight, ArrowRight, Bell, CalendarCheck2, CalendarDays, CalendarPlus2, CalendarRange, Check, ChevronDown, CircleAlert, CircleHelp, Globe2, History, Hourglass, RotateCcw, Settings2, ShieldCheck, Smartphone, Copy } from "lucide-react";
import { calculatorCopy, interpolate } from "../content/expiry-calculator";
import type { CalculatorLanguage } from "../content/expiry-calculator";
import { CALCULATOR_LANGUAGES, CALCULATOR_LOCALES } from "../content/calculator-locales";
import { product } from "../content/product";
import LanguageMenu from "../components/calculator/LanguageMenu";
import TimeZoneSelect from "../components/calculator/TimeZoneSelect";
import { addDate, availableTimeZones, DateCalculatorError, differenceInDays, FEATURED_ZONES, formatCalendarDate, formatWeekday, INPUT_CALENDARS, inputDate, isoDate, NUMERIC_DATE_FORMATS, parseDate, parseOffset, todayInZone, weeksAndDays, zoneDescription } from "../lib/date-calculator";
import type { Calendar, CalendarDate, DateDisplayFormat, DateUnit, NumericDateFormat } from "../lib/date-calculator";
import { copyResult } from "../lib/calculator-clipboard";
import { clientClock, serverClock, subscribeClock } from "../lib/calculator-clock";
import "./expiry-calculator.css";
import { directoryPath } from "../content/resources/guides";

type Mode = "countdown" | "difference" | "arithmetic" | "converter";
type InputFormat = NumericDateFormat | "native";
type Fields = { expiry: string; start: string; end: string; convert: string };
const EMPTY_FIELDS: Fields = { expiry: "", start: "", end: "", convert: "" };
const MODES: Mode[] = ["countdown", "difference", "arithmetic", "converter"];
const MODE_ICONS = { countdown: Hourglass, difference: CalendarRange, arithmetic: CalendarPlus2, converter: ArrowLeftRight };
const locales = { en: "en-US", "zh-TW": "zh-TW", "id-ID": "id-ID" };
const EXAMPLE_DATE: CalendarDate = { year: 2026, month: 11, day: 11 };

export default function ExpiryCalculatorPage({ language = "en" }: { language?: CalculatorLanguage }) {
  const [mode, setMode] = useState<Mode>("countdown");
  const [calendar, setCalendar] = useState<Calendar>("gregorian");
  const [targetCalendar, setTargetCalendar] = useState<Calendar>("gregorian");
  const [inputFormat, setInputFormat] = useState<InputFormat>("native");
  const [outputFormat, setOutputFormat] = useState<DateDisplayFormat>("ymd");
  const [zoneChoice, setZoneChoice] = useState("device");
  const [fields, setFields] = useState<Fields>(EMPTY_FIELDS);
  const [amount, setAmount] = useState("30");
  const [unit, setUnit] = useState<DateUnit>("days");
  const [operation, setOperation] = useState("subtract");
  const [copyStatus, setCopyStatus] = useState<"copied" | "copyFailed" | null>(null);
  const [notice, setNotice] = useState(false);
  const [reminder, setReminder] = useState(false);
  const amountInput = useRef<HTMLInputElement>(null);
  useEffect(() => { if (reminder) amountInput.current?.focus(); }, [reminder]);
  const now = useSyncExternalStore(subscribeClock, clientClock, serverClock);
  const t = calculatorCopy[language];
  const locale = locales[language];
  const numericInputFormat = inputFormat === "native" ? "ymd" : inputFormat;
  const deviceZone = now === null ? "UTC" : Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const zone = zoneChoice === "device" ? deviceZone : zoneChoice;
  const today = now === null ? null : todayInZone(zone, new Date(now));
  const number = (value: number) => new Intl.NumberFormat(locale).format(value);
  const unitNumber = (value: number, kind: "day" | "week") => new Intl.NumberFormat(locale, { style: "unit", unit: kind, unitDisplay: "long" }).format(value);
  const errorText = (error: unknown) => t.errors[error instanceof DateCalculatorError ? error.code : "invalidDate"];
  const readDate = (value: string) => parseDate(value, calendar, numericInputFormat);
  const dateError = (value: string) => {
    if (!value) return "";
    try { readDate(value); return ""; } catch (error) { return errorText(error); }
  };
  let amountError = "";
  try { if (parseOffset(amount) < 0) throw new DateCalculatorError("amount"); } catch (error) { amountError = errorText(error); }

  function changeInputSettings(nextCalendar: Calendar, nextFormat: InputFormat) {
    let lostDate = false;
    const converted = { ...fields };
    for (const key of Object.keys(fields) as (keyof Fields)[]) {
      if (!fields[key]) continue;
      try { converted[key] = inputDate(readDate(fields[key]), nextCalendar, nextFormat === "native" ? "ymd" : nextFormat); }
      catch { converted[key] = ""; lostDate = true; }
    }
    setFields(converted); setCalendar(nextCalendar); setInputFormat(nextFormat);
    setNotice(lostDate); setCopyStatus(null);
  }
  function updateField(key: keyof Fields, value: string) {
    setFields((previous) => ({ ...previous, [key]: value })); setNotice(false); setCopyStatus(null);
  }
  function reset() {
    setFields(EMPTY_FIELDS); setAmount("30"); setUnit("days"); setOperation("subtract");
    setNotice(false); setCopyStatus(null); setReminder(false);
  }
  function planReminder(offset: number) {
    try {
      const date = readDate(fields.expiry);
      setFields((previous) => ({ ...previous, start: inputDate(date, calendar, numericInputFormat) }));
      setMode("arithmetic"); setAmount(String(offset)); setUnit("days"); setOperation("subtract");
      setReminder(true); setCopyStatus(null);
    } catch { /* Only valid expiry dates enable these actions. */ }
  }
  function calendarSelect(target = false) {
    return <div className="calc-field"><label className="calc-icon-label" htmlFor={target ? "calc-target-calendar" : "calc-calendar"}><Globe2 size={15} aria-hidden="true" /><span>{target ? t.toCalendar : mode === "converter" ? t.fromCalendar : t.calendar}</span></label>
      <select id={target ? "calc-target-calendar" : "calc-calendar"} value={target ? targetCalendar : calendar}
        onChange={(event) => {
          if (target) { setTargetCalendar(event.target.value as Calendar); setCopyStatus(null); }
          else changeInputSettings(event.target.value as Calendar, inputFormat);
        }}>{INPUT_CALENDARS.map((value) => <option key={value} value={value}>{t[value]}</option>)}</select>
    </div>;
  }
  function formatControls() {
    return <>
      <div className="calc-field"><label htmlFor="calc-input-format">{t.inputFormat}</label><select id="calc-input-format" value={inputFormat} onChange={(event) => changeInputSettings(calendar, event.target.value as InputFormat)}>
        <option value="native">{t.native}</option>{NUMERIC_DATE_FORMATS.map((value) => <option key={value} value={value}>{t[value]}</option>)}
      </select></div>
      <div className="calc-field"><label htmlFor="calc-output-format">{t.resultFormat}</label><select id="calc-output-format" value={outputFormat} onChange={(event) => { setOutputFormat(event.target.value as DateDisplayFormat); setCopyStatus(null); }}>
        {([...NUMERIC_DATE_FORMATS, "long"] as const).map((value) => <option key={value} value={value}>{t[value]}</option>)}
      </select></div>
    </>;
  }
  function dateField(key: keyof Fields, label: string) {
    const error = dateError(fields[key]);
    const nativePicker = calendar === "gregorian" && inputFormat === "native";
    const defaultHint = { gregorian: t.gregorianHint, roc: t.rocHint, buddhist: t.buddhistHint, japanese: t.japaneseHint }[calendar];
    const rule = { gregorian: t.gregorianRule, roc: t.rocRule, buddhist: t.buddhistRule, japanese: t.japaneseRule }[calendar];
    const example = inputDate(EXAMPLE_DATE, calendar, numericInputFormat);
    const hint = inputFormat === "native" ? defaultHint : `${interpolate(t.formatHint, { format: t[numericInputFormat], example })} ${rule}`;
    return <div className="calc-field calc-date-field">
      <div className="calc-label-row"><label className="calc-icon-label" htmlFor={`date-${key}`}><CalendarDays size={16} aria-hidden="true" /><span>{label}{calendar !== "gregorian" && <span className="calc-calendar-context"> · {t[calendar]}</span>}</span></label>
        <div className="calc-date-actions"><button type="button" className="calc-text-button" disabled={!today} onClick={() => today && updateField(key, inputDate(today, calendar, numericInputFormat))}>{t.today}</button>
          {key !== "end" && <button type="button" className="calc-reset" aria-label={t.reset} title={t.reset} onClick={reset}><RotateCcw size={16} aria-hidden="true" /></button>}
        </div>
      </div>
      <input id={`date-${key}`} type={nativePicker ? "date" : "text"} value={fields[key]}
        min={nativePicker ? "0001-01-01" : undefined} max={nativePicker ? "9999-12-31" : undefined}
        placeholder={nativePicker ? undefined : example} autoComplete="off" spellCheck={false}
        aria-invalid={!!error} aria-describedby={`hint-${key}${error ? ` error-${key}` : ""}`}
        onChange={(event) => updateField(key, event.target.value)} />
      <p className="sr-only" id={`hint-${key}`}>{hint}</p>
      {error && <p className="calc-error" id={`error-${key}`}><CircleAlert size={15} aria-hidden="true" />{error}</p>}
    </div>;
  }

  let resultDate: CalendarDate | null = null;
  let difference: number | null = null;
  let resultError = "";
  let convertedDate = "";
  const hasInput = mode === "countdown" ? !!fields.expiry : mode === "converter" ? !!fields.convert : mode === "difference" ? !!fields.start && !!fields.end : !!fields.start;
  if (hasInput) {
    try {
      if (mode === "countdown") {
        resultDate = readDate(fields.expiry);
        if (today) difference = differenceInDays(today, resultDate);
      } else if (mode === "difference") {
        resultDate = readDate(fields.end); difference = differenceInDays(readDate(fields.start), resultDate);
      } else if (mode === "arithmetic") {
        if (amountError) throw new DateCalculatorError("amount");
        resultDate = addDate(readDate(fields.start), parseOffset(amount) * (operation === "subtract" ? -1 : 1), unit);
      } else {
        resultDate = readDate(fields.convert);
        convertedDate = formatCalendarDate(resultDate, targetCalendar, outputFormat, locale);
      }
    } catch (error) { resultError = errorText(error); resultDate = null; difference = null; }
  }
  const valid = !!resultDate && !resultError && (mode !== "countdown" || difference !== null);
  const resultState = resultError ? "error" : valid && mode === "countdown" ? difference === 0 ? "today" : difference! < 0 ? "past" : "upcoming" : "default";
  const ResultIcon = resultError ? CircleAlert : resultState === "today" ? CalendarCheck2 : resultState === "past" ? History : MODE_ICONS[mode];
  const breakdown = difference === null ? null : weeksAndDays(difference);
  const weeksText = breakdown ? `${unitNumber(breakdown.weeks, "week")} + ${unitNumber(breakdown.days, "day")}` : "";
  const resultLabel = mode === "countdown" ? difference === 0 ? t.due : (difference ?? 0) < 0 ? t.overdue : t.remaining
    : mode === "difference" ? t.signed : mode === "converter" ? t[targetCalendar] : t.calculated;
  const summary = valid && resultDate ? [
    t.title, t[mode],
    ...(mode === "converter" ? [`${t.fromCalendar}: ${t[calendar]} — ${fields.convert}`, `${t.toCalendar}: ${t[targetCalendar]} — ${convertedDate}`] : []),
    ...(mode === "difference" ? [`${t.start}: ${isoDate(readDate(fields.start))}`] : []),
    ...(difference === null ? [] : [`${resultLabel}: ${mode === "countdown" ? Math.abs(difference) : difference}`, weeksText]),
    `${t.gregorianResult}: ${formatCalendarDate(resultDate, "gregorian", outputFormat, locale)}`,
    `${t.referenceDate}: ${isoDate(resultDate)}`, `${t.zone}: ${zone}`,
    ...(mode === "countdown" && today ? [interpolate(t.todayIn, { zone, date: isoDate(today) }), t.dateOnly] : []),
    ...(mode === "difference" ? [t.exclusive] : []),
  ].join("\n") : "";
  const zones = now === null ? [...FEATURED_ZONES] : availableTimeZones();
  const zoneOptions = [{ value: "device", label: `${t.device}${now === null ? "" : ` — ${deviceZone}`}` }, ...zones.map((value) => ({ value, label: value }))];

  return <div className="landing expiry-page" lang={language}>
    <a href="#main-content" className="skip-link">{t.title}</a>
    <header className="calc-header calc-container">
      <a href="/" className="calc-brand" aria-label={t.home}><img src="/logo.webp" width="44" height="44" alt="" /><span>Renewables</span></a>
      <nav className="calc-header-actions" aria-label={t.navigation}>
        <LanguageMenu label={t.language} value={language} onChange={(value) => {
          const path = CALCULATOR_LOCALES[value].path;
          if (window.location.pathname !== path) {
            window.history.pushState(null, "", path);
            window.dispatchEvent(new PopStateEvent("popstate"));
          }
          setCopyStatus(null);
        }} />
      </nav>
    </header>
    <main id="main-content" className="calc-container" tabIndex={-1}>
      <div className="calc-intro"><h1>{t.title}</h1><p>{t.subtitle}</p></div>
      <div className="calc-modes" role="group" aria-label={t.mode}>{MODES.map((value) => {
        const ModeIcon = MODE_ICONS[value];
        return <button key={value} type="button" data-mode={value} aria-pressed={mode === value} onClick={() => { setMode(value); setCopyStatus(null); setReminder(false); }}><ModeIcon size={17} aria-hidden="true" /><span>{t[value]}</span></button>;
      })}</div>
      <div className="calc-workspace" data-nosnippet="">
        <section className="calc-input-card" aria-labelledby="input-heading">
          <h2 id="input-heading" className="sr-only">{t[mode]}</h2>
          <form noValidate onSubmit={(event) => event.preventDefault()}>
            {mode === "converter" && <div className="calc-converter-calendars">
              {calendarSelect()}
              <button type="button" className="calc-swap" aria-label={t.swapCalendars} title={t.swapCalendars} disabled={!!resultError}
                onClick={() => { changeInputSettings(targetCalendar, inputFormat); setTargetCalendar(calendar); }}><ArrowLeftRight size={19} aria-hidden="true" /></button>
              {calendarSelect(true)}
            </div>}
            {mode === "countdown" && dateField("expiry", t.expiry)}
            {(mode === "difference" || mode === "arithmetic") && dateField("start", t.start)}
            {mode === "difference" && dateField("end", t.end)}
            {mode === "converter" && dateField("convert", t.convertInput)}
            {mode === "arithmetic" && <>
              <div className="calc-field calc-operation-field"><label htmlFor="calc-operation">{t.operation}</label><select id="calc-operation" value={operation} onChange={(event) => { setOperation(event.target.value); setCopyStatus(null); }}><option value="add">{t.add}</option><option value="subtract">{t.subtract}</option></select></div>
              <div className="calc-offset-grid"><div className="calc-field"><label htmlFor="calc-amount">{t.amount}</label><input ref={amountInput} id="calc-amount" type="text" inputMode="numeric" value={amount} aria-invalid={!!amountError} aria-describedby={`amount-hint${amountError ? " amount-error" : ""}`} onChange={(event) => { setAmount(event.target.value); setCopyStatus(null); }} /></div>
                <div className="calc-field"><label htmlFor="calc-unit">{t.unit}</label><select id="calc-unit" value={unit} onChange={(event) => { setUnit(event.target.value as DateUnit); setCopyStatus(null); }}>{(["days", "weeks", "months", "years"] as const).map((value) => <option key={value} value={value}>{t[value]}</option>)}</select></div></div>
              <p id="amount-hint" className="sr-only">{t.amountHint}</p>{amountError && <p id="amount-error" className="calc-error"><CircleAlert size={15} aria-hidden="true" />{amountError}</p>}
            </>}
            <details className="calc-settings" id="calculator-settings">
              <summary><Settings2 size={17} aria-hidden="true" /><span>{t.settings}</span><ChevronDown size={16} aria-hidden="true" /></summary>
              <div className="calc-settings-body">
                <div className="calc-settings-grid">
                  {mode !== "converter" && calendarSelect()}{formatControls()}
                  <TimeZoneSelect value={zoneChoice} options={zoneOptions} label={t.zone} searchLabel={t.zoneSearch} emptyLabel={t.noZones} onChange={(value) => { setZoneChoice(value); setCopyStatus(null); }} />
                </div>
                {now !== null && <p className="calc-hint calc-zone-name">{zoneDescription(zone, locale, new Date(now))} · {zone}</p>}
                <p id="zone-hint" className="sr-only">{t.zoneHint}</p>
              </div>
            </details>
            <p className="calc-today">{today ? interpolate(t.todayIn, { zone, date: formatCalendarDate(today, "gregorian", "long", locale) }) : <span className="sr-only">{t.clockPending}</span>}</p>
            {notice && <p role="status" className="calc-error"><CircleAlert size={15} aria-hidden="true" />{t.settingsNotice}</p>}
          </form>
        </section>
        <div className="calc-output-column">
          <section className="calc-result-card" data-mode={mode} data-state={resultState} aria-labelledby="result-heading">
            <h2 id="result-heading"><ResultIcon size={17} aria-hidden="true" />{t.result}</h2>
            <div role="status" aria-live="polite" aria-atomic="true" className="calc-result-content">
              {valid && resultDate ? <>
                <p className="calc-result-label">{resultLabel}</p>
                {difference !== null ? <>
                  <p className="calc-result-number">{mode === "difference" && difference > 0 ? "+" : ""}{number(mode === "countdown" ? Math.abs(difference) : difference)}</p>
                  <p className="calc-weeks">{weeksText}</p>
                  {mode === "difference" && <><p>{t.absolute}: {unitNumber(Math.abs(difference), "day")}</p><p>{difference === 0 ? t.same : difference < 0 ? t.before : t.after}</p></>}
                </> : <p className="calc-result-date">{mode === "converter" ? convertedDate : formatCalendarDate(resultDate, "gregorian", outputFormat, locale)}</p>}
                <div className="calc-date-details">
                  {(difference !== null || (mode === "converter" && targetCalendar !== "gregorian")) && <p>{formatCalendarDate(resultDate, "gregorian", outputFormat, locale)}</p>}
                  <p>{formatWeekday(resultDate, locale)} · {zone}</p>
                </div>
              </> : <div className="calc-empty"><p>{resultError || t.empty}</p></div>}
            </div>
            {valid && <button type="button" className="calc-button calc-button-copy" onClick={async () => setCopyStatus(await copyResult(summary) ? "copied" : "copyFailed")}>
              {copyStatus === "copied" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}{t.copy}
            </button>}
            {copyStatus && <p className="calc-hint" role="status">{t[copyStatus]}</p>}
          </section>
          {mode === "countdown" && valid && <section className="calc-reminders" aria-labelledby="reminders-heading"><h2 id="reminders-heading"><Bell size={16} aria-hidden="true" />{t.reminders}</h2>
            <div className="calc-reminder-buttons">{[7, 14, 30, 60, 90].map((offset) => <button type="button" key={offset} aria-label={interpolate(t.beforeExpiry, { days: number(offset) })} onClick={() => planReminder(offset)}>{number(offset)}</button>)}</div>
            <button type="button" className="calc-text-button" onClick={() => planReminder(30)}>{t.custom}<ArrowRight size={15} aria-hidden="true" /></button>
          </section>}
        </div>
      </div>
      <p className="calc-quick-note"><ShieldCheck size={14} aria-hidden="true" /><span className="calc-free">{t.free}</span><span>· {t.quickNote}</span></p>
      <p className="calc-quick-note"><a href={directoryPath(language)}>{language === "zh-TW" ? "查找證件續期指南與官方資源" : language === "id-ID" ? "Temukan panduan perpanjangan dan sumber resmi" : "Find renewal guides and official resources"}</a></p>
      <section className="calc-cta" aria-labelledby="cta-heading">
        <div className="calc-cta-copy"><h2 id="cta-heading">{t.ctaTitle}</h2><p>{t.ctaText}</p></div>
        <div className="calc-cta-actions"><a href={product.webAppUrl} className="calc-button calc-button-primary"><Bell size={16} aria-hidden="true" />{t.track}<ArrowRight size={17} aria-hidden="true" /></a><a href={product.googlePlayUrl} className="calc-button calc-button-secondary"><Smartphone size={16} aria-hidden="true" />{t.android}</a></div>
        <p className="calc-hint">{t.ctaNote}</p>
      </section>
      <details className="calc-help">
        <summary><h2><CircleHelp size={17} aria-hidden="true" />{t.help}</h2><ChevronDown size={17} aria-hidden="true" /></summary>
        <div className="calc-help-body">
          <section className="calc-guides" aria-labelledby="guide-heading"><h2 id="guide-heading" className="sr-only">{t.guideTitle}</h2><div>{t.guides.map(([heading, text]) => <article key={heading}><h3>{heading}</h3><p>{text}</p></article>)}</div>
            <p>{t.dateOnly}</p><p>{t.exclusive}</p><p>{t.monthPolicy}</p>
          </section>
          <section className="calc-faq" aria-labelledby="faq-heading"><h2 id="faq-heading">{t.faqTitle}</h2>{t.faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</section>
        </div>
      </details>
      <noscript><p>{t.noScript}</p><nav aria-label={t.language}>{CALCULATOR_LANGUAGES.map((value) => <a key={value} href={CALCULATOR_LOCALES[value].path} hrefLang={value} lang={value}>{CALCULATOR_LOCALES[value].label}</a>)}</nav></noscript>
    </main>
    <footer className="calc-footer calc-container"><a href="/">Renewables</a><nav aria-label="Renewables"><a href="/privacy">{language === "zh-TW" ? "隱私權政策" : language === "id-ID" ? "Kebijakan Privasi" : "Privacy Policy"}</a><a href="/support">{language === "zh-TW" ? "支援" : language === "id-ID" ? "Bantuan" : "Support"}</a></nav></footer>
  </div>;
}
