import { useState, useSyncExternalStore } from "react";
import { ArrowRight, BookOpen, Building2, CalendarDays, Search, RotateCcw } from "lucide-react";
import ResourceLayout, { AuthorityLink, InterfaceLanguages } from "../components/resources/ResourceLayout";
import { countries } from "../content/resources/countries";
import { directoryPath, emptyFilters, findGuides, guidePath, needsResidenceStatus, publishedGuides, resourceResultState } from "../content/resources/guides";
import { resourceCopy } from "../content/resources/locales";
import type { DocumentCategory, ResidenceStatus, ResourceFilters, ResourceLanguage } from "../content/resources/types";
import { CALCULATOR_LOCALES } from "../content/calculator-locales";
import { readDeviceTimeZone, residenceForTimeZone, serverDeviceTimeZone, sortResourceGuides, subscribeDeviceTimeZone } from "../lib/resource-order";
import { resourceOrderCopy } from "../content/resources/order-locales";
import WorkforceCountryNotes from "../components/resources/WorkforceCountryNotes";
import { workforceSources } from "../content/resources/workforce-sources";
import EditorialPolicy from "../components/resources/EditorialPolicy";

type FinderSelection = { filters: ResourceFilters; residenceSource: "device" | "suggestion" | "visitor" };

export default function ResourceDirectoryPage({ language = "en" }: { language?: ResourceLanguage }) {
  const [selection, setSelection] = useState<FinderSelection>({ filters: { ...emptyFilters }, residenceSource: "device" });
  const deviceTimeZone = useSyncExternalStore(subscribeDeviceTimeZone, readDeviceTimeZone, serverDeviceTimeZone);
  const deviceResidence = residenceForTimeZone(deviceTimeZone);
  // A null server snapshot keeps prerendering and hydration unpersonalized. The
  // first finder interaction captures the suggestion so later zone changes cannot
  // replace a selection while someone is using the form.
  const filters: ResourceFilters = { ...selection.filters, residence: selection.residenceSource === "device" ? deviceResidence ?? "" : selection.filters.residence };
  const residenceSuggested = selection.residenceSource === "suggestion" || selection.residenceSource === "device" && Boolean(deviceResidence);
  const orderingTimeZone = filters.residence ? null : deviceTimeZone;
  const suggestedResidence = residenceForTimeZone(orderingTimeZone);
  const suggestedResidenceName = countries.find((country) => country.code === suggestedResidence)?.names[language];
  const t = resourceCopy[language];
  const orderCopy = resourceOrderCopy[language];
  const guides = sortResourceGuides(findGuides(filters), language, orderingTimeZone);
  const resultState = resourceResultState(filters);
  const hasStatus = needsResidenceStatus(filters);
  const hkMacao = filters.nationality === "HK" || filters.nationality === "MO";
  function update(next: Partial<ResourceFilters>) {
    const updated = { ...filters, ...next };
    if (!needsResidenceStatus(updated)) updated.status = "";
    setSelection({ filters: updated, residenceSource: next.residence === undefined && residenceSuggested ? "suggestion" : "visitor" });
  }
  return <ResourceLayout language={language}>
    <main id="resource-main" className="resource-container">
      <div className="resource-topline"><nav aria-label={t.breadcrumb}><a href="/">{t.home}</a><span aria-hidden="true"> / </span><span aria-current="page">{t.name}</span></nav><InterfaceLanguages language={language} onChange={(nextLanguage) => {
        const path = directoryPath(nextLanguage);
        if (window.location.pathname !== path) {
          window.history.pushState(null, "", path);
          window.dispatchEvent(new PopStateEvent("popstate"));
        }
      }} /></div>
      <section className="resource-hero"><p className="resource-eyebrow"><BookOpen size={16} aria-hidden="true" />{t.name}</p><h1>{t.title}</h1><p>{t.subtitle}</p><div className="resource-coverage">{t.coverage.replace("{count}", String(publishedGuides.length))}</div></section>
      <form className="resource-finder" aria-label={t.name} onSubmit={(event) => event.preventDefault()}>
        <div className="resource-filter-grid">
          <div className="resource-field"><label htmlFor="resource-nationality">{t.nationality}</label><select id="resource-nationality" value={filters.nationality} onChange={(event) => update({ nationality: event.target.value })}><option value="">{t.all}</option>{countries.map((country) => <option key={country.code} value={country.code}>{country.names[language]}</option>)}</select></div>
          <div className="resource-field"><label htmlFor="resource-residence">{t.residence}</label><select id="resource-residence" value={filters.residence} aria-describedby="resource-residence-help" data-residence-source={residenceSuggested ? "time-zone" : selection.residenceSource === "device" ? "unavailable" : "manual"} onChange={(event) => update({ residence: event.target.value })}><option value="">{t.all}</option>{countries.map((country) => <option key={country.code} value={country.code}>{country.names[language]}</option>)}</select><p id="resource-residence-help" className="resource-small">{residenceSuggested ? orderCopy.residenceSuggested : orderCopy.residenceHelp}</p></div>
          <div className="resource-field"><label htmlFor="resource-document">{t.document}</label><select id="resource-document" value={filters.document} onChange={(event) => update({ document: event.target.value as DocumentCategory | "" })}><option value="">{t.all}</option>{Object.entries(t.documents).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
          {hasStatus && <div className="resource-field"><label htmlFor="resource-status">{t.status}</label><select id="resource-status" value={filters.status} onChange={(event) => update({ status: event.target.value as ResidenceStatus | "" })}><option value="">{t.all}</option>{Object.entries(t.statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>}
        </div>
        <div className="resource-search-row"><div className="resource-field"><label htmlFor="resource-search"><Search size={15} aria-hidden="true" />{t.search}</label><input id="resource-search" type="search" autoComplete="off" value={filters.query} placeholder={t.searchHint} onChange={(event) => update({ query: event.target.value })} /></div><button className="resource-button" type="button" onClick={() => setSelection({ filters: { ...emptyFilters }, residenceSource: "visitor" })}><RotateCcw size={15} aria-hidden="true" />{t.reset}</button></div>
        <p className="resource-small">{t.privacy}</p>
      </form>
      <p className="resource-scope-note">{t.foreignScope}</p>
      <WorkforceCountryNotes filters={filters} language={language} />
      <section className="resource-results" aria-labelledby="resource-results-title">
        <div className="resource-results-heading"><h2 id="resource-results-title">{t.results}</h2><p role="status" aria-live="polite" aria-atomic="true">{t.results}: {guides.length}</p></div>
        <p className="resource-order-note resource-small" data-resource-order={suggestedResidence ?? "alphabetical"}>{!filters.residence && suggestedResidenceName ? orderCopy.regional.replace("{residence}", suggestedResidenceName) : orderCopy.alphabetical}</p>
        {guides.length ? <div className="resource-card-grid">{guides.map((guide) => {
          const contentLanguage = guide.translations[language] ? language : "en";
          const content = guide.translations[contentLanguage]!;
          const source = guide.sources.find((item) => item.id === guide.primarySourceId)!;
          return <article className="resource-card" key={guide.id} data-guide={guide.id}>
            <div className="resource-card-meta"><span>{t.documents[guide.document]}</span><span>{t.serviceTypes[guide.serviceType ?? "renewal"]}</span><span>{guide.residences.map((code) => countries.find((country) => country.code === code)?.names[language] ?? code).join(" · ")}</span></div>
            <h3 lang={contentLanguage}><a href={guidePath(guide, contentLanguage)}>{content.title}</a></h3><p lang={contentLanguage}>{content.summary}</p>
            <dl><dt><Building2 size={14} aria-hidden="true" />{t.authority}</dt><dd>{guide.authority.name}</dd><dt>{t.scope}</dt><dd lang={contentLanguage}>{content.scope}</dd><dt>{t.primary}</dt><dd><AuthorityLink url={source.url}>{source.organization} · {new URL(source.url).hostname}</AuthorityLink></dd></dl>
            {source.access === "official-index" && <p className="resource-access-note">{t.limited}</p>}
            {contentLanguage !== language && <p className="resource-small">{t.english}</p>}
            <div className="resource-card-bottom"><span>{t.reviewed}: <time dateTime={guide.reviewedOn}>{guide.reviewedOn}</time></span><a href={guidePath(guide, contentLanguage)} className="resource-read">{t.open}<ArrowRight size={16} aria-hidden="true" /></a></div>
          </article>;
        })}</div> : <div className="resource-empty" role="region" aria-label={t.results}><BookOpen size={30} aria-hidden="true" /><h3>{resultState === "unavailable" ? t.guideUnavailable : resultState === "needs-verification" ? t.needsVerification : t.empty}</h3><p>{t.emptyHelp}</p>{filters.residence === "TW" && filters.document === "arc" && <AuthorityLink url={hkMacao ? workforceSources.hkMacaoResidence.url : "https://www.immigration.gov.tw/5475/5478/141465/141808/141970"}>{t.generalResidence}</AuthorityLink>}</div>}
      </section>
      <aside className="resource-tool"><CalendarDays size={26} aria-hidden="true" /><div><h2><a href={CALCULATOR_LOCALES[language].path}>{t.calculator}<ArrowRight size={18} aria-hidden="true" /></a></h2><p>{t.calculatorNote}</p></div></aside>
      <EditorialPolicy language={language} />
      <p className="resource-disclaimer">{t.disclaimer}</p>
      <noscript><p>{language === "zh-TW" ? "所有指南均可直接閱讀；篩選功能需要 JavaScript。" : language === "id-ID" ? "Semua panduan dapat dibaca langsung; filter memerlukan JavaScript." : "All guides are directly readable; interactive filtering needs JavaScript."}</p></noscript>
      <nav className="resource-translation-links" aria-label={t.language}>{(["en", "id-ID", "zh-TW"] as const).map((value) => <a key={value} href={directoryPath(value)} hrefLang={value} lang={value}>{value === "en" ? "English" : value === "id-ID" ? "Bahasa Indonesia" : "繁體中文"}</a>)}</nav>
    </main>
  </ResourceLayout>;
}
