import { SOCIAL_IMAGE_URL } from "../seo";
import type { PageSeo } from "../seo";

type HeadElement = { tag: "title" | "meta" | "link" | "script"; attributes: Record<string, string>; text?: string };

/** One metadata model for prerendering, language changes and browser history. */
function headElements(seo: PageSeo): HeadElement[] {
  const meta = (attribute: "name" | "property", key: string, content: string): HeadElement => ({
    tag: "meta", attributes: { [attribute]: key, content, "data-seo": attribute === "property" ? "og" : key },
  });
  return [
    { tag: "title", attributes: { "data-seo": "title" }, text: seo.title },
    meta("name", "description", seo.description), meta("name", "robots", seo.robots),
    { tag: "link", attributes: { rel: "canonical", href: seo.canonical, "data-seo": "canonical" } },
    ...seo.alternates.map(({ language, url }): HeadElement => ({ tag: "link", attributes: { rel: "alternate", hreflang: language, href: url, "data-seo": "alternate" } })),
    meta("property", "og:type", seo.pageType ?? "website"), meta("property", "og:site_name", "Renewables"),
    ...(seo.pageType === "article" && seo.modifiedOn ? [meta("property", "article:modified_time", seo.modifiedOn)] : []),
    meta("property", "og:locale", seo.ogLocale),
    ...seo.alternateLocales.map((locale) => meta("property", "og:locale:alternate", locale)),
    meta("property", "og:title", seo.title), meta("property", "og:description", seo.description),
    meta("property", "og:url", seo.canonical), meta("property", "og:image", SOCIAL_IMAGE_URL),
    meta("property", "og:image:type", "image/png"), meta("property", "og:image:width", "1200"),
    meta("property", "og:image:height", "630"), meta("property", "og:image:alt", seo.imageAlt),
    meta("name", "twitter:card", "summary_large_image"), meta("name", "twitter:title", seo.title),
    meta("name", "twitter:description", seo.description), meta("name", "twitter:image", SOCIAL_IMAGE_URL),
    meta("name", "twitter:image:alt", seo.imageAlt),
    ...(seo.structuredData ? [{ tag: "script" as const, attributes: { type: "application/ld+json", "data-seo": "structured-data" }, text: JSON.stringify(seo.structuredData).replace(/</g, "\\u003c") }] : []),
  ];
}

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function renderSeoHead(seo: PageSeo): string {
  return headElements(seo).map(({ tag, attributes, text }) => {
    const attrs = Object.entries(attributes).map(([name, value]) => `${name}="${escapeHtml(value)}"`).join(" ");
    return tag === "meta" || tag === "link" ? `<${tag} ${attrs} />` : `<${tag} ${attrs}>${tag === "script" ? text : escapeHtml(text ?? "")}</${tag}>`;
  }).join("\n\t");
}

export function applyDocumentSeo(seo: PageSeo): void {
  const fragment = document.createDocumentFragment();
  for (const { tag, attributes, text } of headElements(seo)) {
    const element = document.createElement(tag);
    for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
    if (text !== undefined) element.textContent = text;
    fragment.append(element);
  }
  document.head.querySelectorAll("[data-seo]").forEach((element) => element.remove());
  document.head.append(fragment);
  document.documentElement.lang = seo.language;
}
