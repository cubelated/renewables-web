import { AuthorityLink } from "./ResourceLayout";
import { countries } from "../../content/resources/countries";
import { guidePath, publishedGuides } from "../../content/resources/guides";
import { workforceProfiles, workforceProfileSources } from "../../content/resources/workforce-profiles";
import type { ResourceFilters, ResourceLanguage } from "../../content/resources/types";

const copy = {
  en: { title: "Home-country document notes", intro: "Check only the records that apply to your actual employment or application. These notes are available in English.", passport: "Reviewed passport starting guide", gap: "Taiwan passport checklist not yet verified", extra: "Other records to check when applicable", skip: "No additional recurring home-country renewal has been verified for this profile.", sources: "Research sources and official starting points", reviewed: "Last reviewed", conditional: "Only when requested", supporting: "Supporting record / change check", event: "Travel, employment or identity event" },
  "id-ID": { title: "Catatan dokumen negara asal", intro: "Periksa hanya catatan yang sesuai dengan pekerjaan atau permohonan Anda. Catatan tersedia dalam bahasa Inggris.", passport: "Panduan awal paspor yang telah ditinjau", gap: "Daftar dokumen paspor di Taiwan belum diverifikasi", extra: "Catatan lain untuk diperiksa bila berlaku", skip: "Belum ada perpanjangan berkala tambahan dari negara asal yang diverifikasi untuk profil ini.", sources: "Sumber penelitian dan rujukan resmi", reviewed: "Terakhir ditinjau", conditional: "Hanya bila diminta", supporting: "Dokumen pendukung / pemeriksaan perubahan", event: "Peristiwa perjalanan, pekerjaan, atau identitas" },
  "zh-TW": { title: "原屬國家／地區文件備註", intro: "只需確認適用於實際工作或申請的文件。以下研究備註目前提供英文版本。", passport: "已核對的護照申請起點指南", gap: "尚未核實在台護照申辦文件清單", extra: "適用時才需確認的其他文件", skip: "目前未核實此類別有其他須定期更新的原屬國家／地區文件。", sources: "研究來源與官方聯絡起點", reviewed: "最後核對", conditional: "僅於被要求時", supporting: "佐證文件／資料變更確認", event: "旅行、就業或身分變更事項" },
};

export default function WorkforceCountryNotes({ filters, language }: { filters: ResourceFilters; language: ResourceLanguage }) {
  if (filters.residence && filters.residence !== "TW") return null;
  const profile = workforceProfiles.find((entry) => entry.country === filters.nationality);
  if (!profile) return null;
  const t = copy[language];
  const passport = publishedGuides.find((guide) => guide.id === profile.passportGuideId);
  const records = profile.records.filter((item) => !filters.status || !item.statuses || item.statuses.includes(filters.status));
  const sources = workforceProfileSources(profile);
  return <aside className="resource-country-notes" aria-labelledby="resource-country-notes-title" data-workforce-country={profile.country}>
    <h2 id="resource-country-notes-title">{t.title}: {countries.find((country) => country.code === profile.country)?.names[language]}</h2>
    <p className="resource-small">{t.intro}</p>
    {passport ? <p>{t.passport}: <a href={guidePath(passport)} lang="en">{passport.translations.en.title}</a></p> : <p className="resource-access-note">{t.gap}</p>}
    {records.length ? <><h3>{t.extra}</h3><ul>{records.map((item) => <li key={item.title}><strong lang="en">{item.title}</strong><span className="resource-record-kind">{t[item.tracking]}</span><p lang="en">{item.note}</p>{item.guideIds.map((id) => { const guide = publishedGuides.find((entry) => entry.id === id)!; return <a className="resource-country-guide" key={id} href={guidePath(guide)} lang="en">{guide.translations.en.title}</a>; })}</li>)}</ul></> : <p className="resource-small">{t.skip}</p>}
    <p lang="en">{profile.limitation}</p>
    <details><summary>{t.sources}</summary><ul>{sources.map((source) => <li key={source.id}><AuthorityLink url={source.url}>{source.title}</AuthorityLink><p className="resource-small" lang="en">{source.organization} · {source.access}{source.note && ` · ${source.note}`}</p></li>)}</ul></details>
    <p className="resource-small">{t.reviewed}: <time dateTime={profile.reviewedOn}>{profile.reviewedOn}</time></p>
  </aside>;
}
