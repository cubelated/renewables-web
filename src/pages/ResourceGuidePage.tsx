import { BookOpen, CalendarDays, ChevronRight, Building2 } from "lucide-react";
import ResourceLayout, { AuthorityLink, ResourceCta } from "../components/resources/ResourceLayout";
import { availableLanguages, directoryPath, guidePath, languageLabels, relatedGuides } from "../content/resources/guides";
import { countries } from "../content/resources/countries";
import { resourceCopy } from "../content/resources/locales";
import type { CitedText, ResourceGuide, ResourceLanguage } from "../content/resources/types";
import { CALCULATOR_LOCALES } from "../content/calculator-locales";

export default function ResourceGuidePage({ guide, language }: { guide: ResourceGuide; language: ResourceLanguage }) {
  const content = guide.translations[language]!;
  const t = resourceCopy[language];
  const primary = guide.sources.find((source) => source.id === guide.primarySourceId)!;
  const reviewOnly = guide.serviceType === "review" || guide.serviceType === "benefit";
  function statement(item: CitedText) {
    return <>{item.text}<span className="resource-citations">{item.sourceIds.map((id) => <a key={id} href={`#source-${id}`} aria-label={`${t.source}: ${guide.sources.find((source) => source.id === id)?.title}`}>[{guide.sources.findIndex((source) => source.id === id) + 1}]</a>)}</span></>;
  }
  const toc = [["overview", t.overview], ["before", t.before], ["checklist", t.checklist], ["apply", reviewOnly ? t.start : t.apply], ["sources", t.sources], ["notes", t.notes]];
  return <ResourceLayout language={language}>
    <main id="resource-main" className="resource-container">
      <nav className="resource-breadcrumbs" aria-label={t.breadcrumb}><a href="/">{t.home}</a><ChevronRight size={13} aria-hidden="true" /><a href={directoryPath(language)}>{t.name}</a><ChevronRight size={13} aria-hidden="true" /><span aria-current="page">{content.title}</span></nav>
      <header className="resource-guide-header"><p className="resource-eyebrow"><BookOpen size={16} aria-hidden="true" />{t.documents[guide.document]} · {t.serviceTypes[guide.serviceType ?? "renewal"]} · {guide.residences.map((code) => countries.find((country) => country.code === code)?.names[language] ?? code).join(" / ")}</p><h1>{content.title}</h1><p>{content.summary}</p>
        <div className="resource-guide-meta"><span><Building2 size={16} aria-hidden="true" />{guide.authority.name}</span><span>{t.reviewed}: <time dateTime={guide.reviewedOn}>{guide.reviewedOn}</time></span></div>
        <p className="resource-small">{t.editorial}</p><p className="resource-source-warning">{t.sourceWarning}</p>
        <nav className="resource-translation-links" aria-label={t.language}>{availableLanguages(guide).map((value) => <a key={value} href={guidePath(guide, value)} hrefLang={value} lang={value} aria-current={value === language ? "page" : undefined}>{languageLabels[value]}</a>)}</nav>
      </header>
      <div className="resource-guide-grid">
        <aside className="resource-toc"><nav aria-label={t.name}>{toc.map(([id, title]) => <a key={id} href={`#${id}`}>{title}</a>)}</nav><div><p>{t.primary}</p><AuthorityLink url={primary.url}>{primary.organization}</AuthorityLink>{primary.access === "official-index" && <p className="resource-access-note">{t.limited}</p>}</div></aside>
        <article className="resource-guide-body">
          <section id="overview"><h2>{t.overview}</h2><p>{content.scope}</p></section>
          {guide.timing && <section className="resource-timing" id="timing"><h2>{t.timing}</h2><p className="resource-small">{t.timingKinds[guide.timing.kind]}</p><p>{statement(guide.timing)}</p></section>}
          <section id="before"><h2>{t.before}</h2><ul>{content.beforeYouStart.map((item, i) => <li key={i}>{statement(item)}</li>)}</ul></section>
          <section id="checklist"><h2>{t.checklist}</h2><h3>{reviewOnly ? t.checkPoints : t.common}</h3><ul className="resource-checklist">{content.commonRequirements.map((item, i) => <li key={i}><label><input type="checkbox" /><span>{item.text}</span></label><span>{item.sourceIds.map((id) => <a key={id} className="resource-check-source" href={`#source-${id}`}>[{t.source} {guide.sources.findIndex((source) => source.id === id) + 1}]</a>)}</span></li>)}</ul>
            <h3>{t.conditional}</h3><ul>{content.conditionalRequirements.map((item, i) => <li key={i}>{statement(item)}</li>)}</ul>
            <div className="resource-suggestions"><h3>{t.suggestions}</h3><ul>{content.suggestions.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </section>
          <section id="apply"><h2>{reviewOnly ? t.start : t.apply}</h2><ol className="resource-steps">{content.steps.map((item, i) => <li key={i}>{statement(item)}</li>)}</ol></section>
          <section id="sources"><h2>{t.sources}</h2><p className="resource-small">{t.reviewPolicy}</p><ol className="resource-source-list">{guide.sources.map((source) => <li key={source.id} id={`source-${source.id}`}><AuthorityLink url={source.url}>{source.title}</AuthorityLink><p>{source.organization} · {new URL(source.url).hostname}</p><p>{t.reviewed}: <time dateTime={source.checkedOn}>{source.checkedOn}</time>{source.updatedOn && <> · {t.sourceUpdated}: {source.updatedOn}</>}</p>{source.access === "unavailable" && <p className="resource-access-note">{t.unavailable}</p>}{source.note && <p lang="en">{source.note}</p>}</li>)}</ol></section>
          <section id="notes"><h2>{t.notes}</h2><ul>{content.importantNotes.map((item, i) => <li key={i}>{statement(item)}</li>)}</ul><a className="resource-report" href={`mailto:cubelated@gmail.com?subject=${encodeURIComponent(`Resource correction: ${guide.id}`)}&body=${encodeURIComponent(`Guide: ${content.title}\nURL: https://renewables.cubelated.com${guidePath(guide, language)}\nLast reviewed: ${guide.reviewedOn}\n\nCorrection and official reference:\n`)}`}>{t.report}</a><p className="resource-small">{t.reportPrivacy}</p></section>
          <section className="resource-related"><h2>{t.tools}</h2><a className="resource-related-link" href={CALCULATOR_LOCALES[language].path}><CalendarDays size={20} aria-hidden="true" />{t.calculator}</a><p>{t.calculatorNote}</p><h3>{t.related}</h3><ul>{relatedGuides(guide).map((item) => { const version = item.translations[language] ? language : "en"; return <li key={item.id}><a href={guidePath(item, version)} lang={version}>{item.translations[version]!.title}</a></li>; })}</ul></section>
          <ResourceCta language={language} />
          <p className="resource-disclaimer">{t.disclaimer}</p>
        </article>
      </div>
    </main>
  </ResourceLayout>;
}
