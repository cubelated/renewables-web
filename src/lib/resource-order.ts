import type { ResourceGuide, ResourceLanguage } from "../content/resources/types";

// An explicit hint for the catalog's supported residences. Never infer a country
// from a UTC offset or interface language: both are shared across borders.
const timeZoneResidences = new Map([
  ["Asia/Taipei", "TW"], ["ROC", "TW"],
  ["Asia/Jakarta", "ID"], ["Asia/Djakarta", "ID"], ["Asia/Pontianak", "ID"],
  ["Asia/Makassar", "ID"], ["Asia/Ujung_Pandang", "ID"], ["Asia/Jayapura", "ID"],
]);

export function residenceForTimeZone(timeZone: string | null): string | undefined {
  return timeZone ? timeZoneResidences.get(timeZone) : undefined;
}

export function readDeviceTimeZone(): string | null {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone || null; }
  catch { return null; }
}

// Hydration and prerendering start without a residence suggestion and with
// alphabetical order, regardless of the build machine's zone. Device preferences
// are read only in the browser.
export const serverDeviceTimeZone = (): null => null;
export function subscribeDeviceTimeZone(onChange: () => void): () => void {
  window.addEventListener("focus", onChange);
  document.addEventListener("visibilitychange", onChange);
  return () => {
    window.removeEventListener("focus", onChange);
    document.removeEventListener("visibilitychange", onChange);
  };
}

/** Reorder already-matched guides; the hint never changes applicability. */
export function sortResourceGuides(guides: readonly ResourceGuide[], language: ResourceLanguage, timeZone: string | null): ResourceGuide[] {
  const residence = residenceForTimeZone(timeZone);
  const collator = new Intl.Collator(language, { sensitivity: "base", numeric: true });
  const title = (guide: ResourceGuide) => (guide.translations[language] ?? guide.translations.en).title;
  return [...guides].sort((a, b) => {
    const priority = Number(Boolean(residence && b.residences.includes(residence))) - Number(Boolean(residence && a.residences.includes(residence)));
    return priority || collator.compare(title(a), title(b)) || (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0);
  });
}
