import type { ReactNode } from "react";
import { ArrowRight, ExternalLink, Globe2 } from "lucide-react";
import { Brand } from "../landing/shared";
import { product } from "../../content/product";
import { resourceCopy } from "../../content/resources/locales";
import { directoryPath, languageLabels, RESOURCE_LANGUAGES } from "../../content/resources/guides";
import type { ResourceLanguage } from "../../content/resources/types";
import { CALCULATOR_LOCALES } from "../../content/calculator-locales";
import "../../pages/resources.css";

export default function ResourceLayout({ language, children }: { language: ResourceLanguage; children: ReactNode }) {
  const t = resourceCopy[language];
  return <div className="resource-site" lang={language}>
    <a className="resource-skip" href="#resource-main">{language === "zh-TW" ? "跳至主要內容" : language === "id-ID" ? "Langsung ke konten" : "Skip to content"}</a>
    <header className="resource-header resource-container">
      <Brand />
      <nav aria-label={t.name}>
        <a href={directoryPath(language)}>{t.name}</a>
        <a href={CALCULATOR_LOCALES[language].path}>{language === "zh-TW" ? "計算器" : language === "id-ID" ? "Kalkulator" : "Calculator"}</a>
        <a href="/#pricing">{language === "zh-TW" ? "方案" : language === "id-ID" ? "Paket" : "Pricing"}</a>
      </nav>
    </header>
    {children}
    <footer className="resource-footer resource-container"><a href="/">Renewables</a><nav aria-label="Renewables"><a href={directoryPath(language)}>{t.name}</a><a href="/privacy">{language === "zh-TW" ? "隱私權" : language === "id-ID" ? "Privasi" : "Privacy"}</a><a href="/support">{t.support}</a></nav></footer>
  </div>;
}

export function InterfaceLanguages({ language, onChange }: { language: ResourceLanguage; onChange: (language: ResourceLanguage) => void }) {
  return <div className="resource-language"><Globe2 size={16} aria-hidden="true" /><label htmlFor="resource-language">{resourceCopy[language].language}</label><select id="resource-language" value={language} onChange={(event) => onChange(event.target.value as ResourceLanguage)}>{RESOURCE_LANGUAGES.map((value) => <option key={value} value={value} lang={value}>{languageLabels[value]}</option>)}</select></div>;
}

export function AuthorityLink({ url, children }: { url: string; children: ReactNode }) {
  // Every caller uses a validated static catalog URL; no user destination is accepted.
  return <a href={url} target="_blank" rel="noopener noreferrer" className="resource-official" referrerPolicy="no-referrer">{children}<ExternalLink size={13} aria-label="(external link, opens in a new tab)" /></a>;
}

export function ResourceCta({ language }: { language: ResourceLanguage }) {
  const t = resourceCopy[language];
  return <section className="resource-cta" aria-labelledby="resource-cta-title"><div><h2 id="resource-cta-title">{t.cta}</h2><p>{t.ctaText}</p></div><div className="resource-actions"><a className="resource-button primary" href={product.webAppUrl}>{t.track}<ArrowRight size={17} aria-hidden="true" /></a><a className="resource-button" href={product.googlePlayUrl}>{t.android}</a></div></section>;
}
