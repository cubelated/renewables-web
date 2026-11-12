import { faqs } from "./content/faqs";
import { product } from "./content/product";
import { CALCULATOR_LANGUAGES, CALCULATOR_LOCALES, calculatorLocaleForPath } from "./content/calculator-locales";
import { calculatorCopy } from "./content/expiry-calculator";
import type { CalculatorLanguage } from "./content/expiry-calculator";
import { availableLanguages, directoryPath, guidePath, publishedGuides, resolveResourcePath, RESOURCE_LANGUAGES, RESOURCE_PATHS } from "./content/resources/guides";
import { resourceCopy } from "./content/resources/locales";
import { resourceDiscoveryCopy } from "./content/resources/discovery";
import { sortResourceGuides } from "./lib/resource-order";

export const SITE_URL = "https://renewables.cubelated.com";
export const SOCIAL_IMAGE_URL = `${SITE_URL}/social-preview.png`;
export const GOOGLE_PLAY_URL = product.googlePlayUrl;

export const INDEXED_PATHS = ["/", "/privacy", "/terms", "/support", ...Object.values(CALCULATOR_LOCALES).map((locale) => locale.path), ...RESOURCE_PATHS];

type IndexedPath = (typeof INDEXED_PATHS)[number];

export type PageSeo = {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  language: string;
  ogLocale: string;
  imageAlt: string;
  alternates: { language: string; url: string }[];
  alternateLocales: string[];
  structuredData: Record<string, unknown> | null;
  pageType?: "website" | "article";
  modifiedOn?: string;
};

const HOME_DESCRIPTION =
  "Scan documents, track expiry dates, set reminders, and prepare for renewals with guided checklists. Get started free with Renewables.";

const PAGE_COPY: Record<
  IndexedPath,
  Pick<PageSeo, "title" | "description">
> = {
  [CALCULATOR_LOCALES.en.path]: CALCULATOR_LOCALES.en,
  [CALCULATOR_LOCALES["zh-TW"].path]: CALCULATOR_LOCALES["zh-TW"],
  [CALCULATOR_LOCALES["id-ID"].path]: CALCULATOR_LOCALES["id-ID"],
  "/": {
    title: "Renewables - Document Expiry Tracker & Renewal Reminder",
    description: HOME_DESCRIPTION,
  },
  "/privacy": {
    title: "Privacy Policy | Renewables",
    description:
      "Read how the Renewables life admin and expiry tracker collects, uses, stores, and protects account, reminder, and subscription information.",
  },
  "/terms": {
    title: "Terms of Service | Renewables",
    description:
      "Read the terms that govern use of the Renewables life admin, expiry tracking, reminder, and recurring renewal services.",
  },
  "/support": {
    title: "Renewables Support & Account Deletion",
    description:
      "Get help with the Renewables life admin and expiry tracker, including account deletion, billing, subscriptions, and technical support.",
  },
};

export function normalizePath(pathname: string): string {
  pathname = pathname.split(/[?#]/)[0];
  if (!pathname || pathname === "/") return "/";
  return `/${pathname.split("/").filter(Boolean).join("/")}`;
}

export function getPageSeo(pathname: string): PageSeo {
  const path = normalizePath(pathname);
  const resource = resolveResourcePath(path);
  if (resource) {
    const { language, guide } = resource;
    const content = guide?.translations[language];
    const t = resourceCopy[language];
    const canonical = `${SITE_URL}${path}`;
    const languages = guide ? availableLanguages(guide) : RESOURCE_LANGUAGES;
    const localizedPath = (lang: typeof language) => guide ? guidePath(guide, lang) : directoryPath(lang);
    const title = `${content?.title ?? resourceDiscoveryCopy[language].metaTitle} | Renewables`;
    const description = content?.summary ?? t.metaDescription;
    return {
      title, description, canonical, language,
      robots: "index, follow, max-image-preview:large, max-snippet:-1",
      ogLocale: CALCULATOR_LOCALES[language].ogLocale,
      imageAlt: t.seoImageAlt,
      pageType: guide ? "article" : "website", modifiedOn: guide?.updatedOn ?? "2026-11-12",
      alternates: [...languages.map((lang) => ({ language: lang, url: `${SITE_URL}${localizedPath(lang)}` })), { language: "x-default", url: `${SITE_URL}${localizedPath("en")}` }],
      alternateLocales: languages.filter((lang) => lang !== language).map((lang) => CALCULATOR_LOCALES[lang].ogLocale),
      structuredData: {
        "@context": "https://schema.org", "@graph": [
          publisherStructuredData(),
          websiteStructuredData(),
          {
            "@type": "BreadcrumbList", "@id": `${canonical}#breadcrumbs`,
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Renewables", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: t.name, item: `${SITE_URL}${directoryPath(language)}` },
              ...(content ? [{ "@type": "ListItem", position: 3, name: content.title, item: canonical }] : []),
            ],
          },
          ...(content && guide ? [{
            "@type": "WebPage", "@id": `${canonical}#page`, url: canonical,
            name: content.title, inLanguage: language, lastReviewed: guide.reviewedOn,
            dateModified: guide.updatedOn, mainEntity: { "@id": `${canonical}#article` },
            description, isPartOf: { "@id": `${SITE_URL}/#website` },
            breadcrumb: { "@id": `${canonical}#breadcrumbs` }, isAccessibleForFree: true,
          }] : []),
          content && guide ? {
            "@type": "Article", "@id": `${canonical}#article`, headline: content.title,
            description, inLanguage: language, mainEntityOfPage: { "@id": `${canonical}#page` },
            dateModified: guide.updatedOn,
            author: { "@id": `${SITE_URL}/#organization` },
            publisher: { "@id": `${SITE_URL}/#organization` },
            isPartOf: { "@id": `${SITE_URL}${directoryPath(language)}#directory` },
            about: { "@type": "Thing", name: t.documents[guide.document] },
            isAccessibleForFree: true,
            citation: guide.sources.filter((source) => source.access !== "unavailable").map((source) => source.url),
          } : {
            "@type": "CollectionPage", "@id": `${canonical}#directory`, url: canonical,
            name: t.name, description, inLanguage: language, dateModified: "2026-11-12", isAccessibleForFree: true,
            publisher: { "@id": `${SITE_URL}/#organization` },
            isPartOf: { "@id": `${SITE_URL}/#website` },
            mainEntity: { "@id": `${canonical}#guides` },
          },
          ...(!guide ? [{
            "@type": "ItemList", "@id": `${canonical}#guides`, numberOfItems: publishedGuides.length,
            itemListElement: sortResourceGuides(publishedGuides, language, null).map((entry, index) => {
              const version = entry.translations[language] ? language : "en";
              const translated = entry.translations[version]!;
              return {
                "@type": "ListItem", position: index + 1,
                item: { "@type": "WebPage", url: `${SITE_URL}${guidePath(entry, version)}`, name: translated.title, description: translated.summary, inLanguage: version },
              };
            }),
          }] : []),
        ],
      },
    };
  }
  const copy = PAGE_COPY[path as IndexedPath];
  const locale = calculatorLocaleForPath(path);
  const shared = {
    language: locale?.language ?? "en",
    ogLocale: locale?.ogLocale ?? "en_US",
    imageAlt: locale?.imageAlt ?? "Renewables document expiry tracker dashboard",
    alternates: locale ? [
      ...Object.values(CALCULATOR_LOCALES).map((entry) => ({ language: entry.language, url: `${SITE_URL}${entry.path}` })),
      { language: "x-default", url: `${SITE_URL}${CALCULATOR_LOCALES.en.path}` },
    ] : [],
    alternateLocales: locale ? Object.values(CALCULATOR_LOCALES).filter((entry) => entry.language !== locale.language).map((entry) => entry.ogLocale) : [],
  };

  if (!copy) {
    return {
      ...shared,
      title: "Page Not Found | Renewables",
      description:
        "The requested page could not be found. Return to Renewables to track expiry dates, renewals, and life admin reminders.",
      canonical: `${SITE_URL}${path}`,
      robots: "noindex, follow",
      structuredData: null,
    };
  }

  return {
    ...shared,
    ...copy,
    canonical: path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`,
    robots: "index, follow, max-image-preview:large",
    structuredData: path === "/" ? homeStructuredData() : locale ? calculatorStructuredData(locale.language) : null,
  };
}

function publisherStructuredData(): Record<string, unknown> {
  return {
    "@type": "Organization", "@id": `${SITE_URL}/#organization`,
    name: product.name, url: `${SITE_URL}/`,
    sameAs: [product.webAppUrl, product.googlePlayUrl],
  };
}

function websiteStructuredData(): Record<string, unknown> {
  return {
    "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: `${SITE_URL}/`,
    name: product.name, inLanguage: CALCULATOR_LANGUAGES,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** Stable last-modified records. Building the site never advances these dates. */
export function getPageModifiedOn(pathname: string): string {
  const path = normalizePath(pathname);
  const resource = resolveResourcePath(path);
  if (resource) return resource.guide?.updatedOn ?? "2026-11-12";
  if (path === "/" || calculatorLocaleForPath(path)) return "2026-11-12";
  return "2026-07-29";
}

function calculatorStructuredData(language: CalculatorLanguage): Record<string, unknown> {
  const locale = CALCULATOR_LOCALES[language];
  const url = `${SITE_URL}${locale.path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      publisherStructuredData(),
      websiteStructuredData(),
      {
        "@type": "WebPage", "@id": `${url}#page`, url,
        name: locale.title, description: locale.description,
        inLanguage: language, isAccessibleForFree: true,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: { "@id": `${url}#calculator` },
        breadcrumb: { "@id": `${url}#breadcrumbs` },
      },
      {
        "@type": "WebApplication", "@id": `${url}#calculator`, url,
        name: locale.title.replace(" | Renewables", ""), description: locale.description,
        mainEntityOfPage: { "@id": `${url}#page` },
        applicationCategory: "UtilitiesApplication", operatingSystem: "Any",
        browserRequirements: locale.browserRequirements,
        isAccessibleForFree: true, inLanguage: CALCULATOR_LANGUAGES,
        featureList: locale.features,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "BreadcrumbList", "@id": `${url}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Renewables", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: calculatorCopy[language].title, item: url },
        ],
      },
    ],
  };
}

function homeStructuredData(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      publisherStructuredData(),
      { ...websiteStructuredData(), alternateName: "Renewables Life Admin Tracker", description: HOME_DESCRIPTION },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#app`,
        name: "Renewables",
        alternateName: "Renewables Life Admin & Expiry Tracker",
        url: `${SITE_URL}/`,
        image: SOCIAL_IMAGE_URL,
        description: HOME_DESCRIPTION,
        applicationCategory: "UtilitiesApplication",
        applicationSubCategory: "Life admin and expiry tracking",
        operatingSystem: "Android, Web",
        downloadUrl: GOOGLE_PLAY_URL,
        featureList: [
          "On-device document scanning on supported Android devices",
          "Expiry date tracking",
          `Customizable reminders: ${product.plans.free.reminderTimes} times per item on Free, ${product.plans.pro.reminderTimes} on Pro`,
          "Editable renewal preparation checklists",
          "General and selected Taiwan and Indonesia document templates",
          "Calendar planning",
          "Recurring renewals (Pro)",
          "CSV export of current item records (Pro)",
          "Renewal history",
          "Android home screen widget",
          "Cloud synchronization",
        ],
        publisher: {
          "@type": "Organization",
          name: "Cubelated",
          url: "https://cubelated.com/",
        },
        sameAs: [GOOGLE_PLAY_URL, product.webAppUrl],
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };
}
