import { faqs } from "./content/faqs";
import { product } from "./content/product";

export const SITE_URL = "https://renewables.cubelated.com";
export const SOCIAL_IMAGE_URL = `${SITE_URL}/social-preview.png`;
export const GOOGLE_PLAY_URL = product.googlePlayUrl;

export const INDEXED_PATHS = ["/", "/privacy", "/terms", "/support", "/tools/expiry-calculator"] as const;

type IndexedPath = (typeof INDEXED_PATHS)[number];

export type PageSeo = {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  structuredData: Record<string, unknown> | null;
};

const HOME_DESCRIPTION =
  "Scan documents, track expiry dates, set reminders, and prepare for renewals with guided checklists. Get started free with Renewables.";

const PAGE_COPY: Record<
  IndexedPath,
  Pick<PageSeo, "title" | "description">
> = {
  "/tools/expiry-calculator": {
    title: "Free Expiry Date Calculator & Calendar Converter | Renewables",
    description: "Count days until expiry, compare dates, plan reminders, and convert Gregorian, ROC, Buddhist and Japanese dates. Free, private, with time zone support.",
  },
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
  if (!pathname || pathname === "/") return "/";
  return `/${pathname.split("/").filter(Boolean).join("/")}`;
}

export function getPageSeo(pathname: string): PageSeo {
  const path = normalizePath(pathname);
  const copy = PAGE_COPY[path as IndexedPath];

  if (!copy) {
    return {
      title: "Page Not Found | Renewables",
      description:
        "The requested page could not be found. Return to Renewables to track expiry dates, renewals, and life admin reminders.",
      canonical: `${SITE_URL}${path}`,
      robots: "noindex, follow",
      structuredData: null,
    };
  }

  return {
    ...copy,
    canonical: path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`,
    robots: "index, follow, max-image-preview:large",
    structuredData: path === "/" ? homeStructuredData() : path === "/tools/expiry-calculator" ? calculatorStructuredData() : null,
  };
}

function calculatorStructuredData(): Record<string, unknown> {
  const url = `${SITE_URL}/tools/expiry-calculator`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite", "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`, name: "Renewables", inLanguage: "en",
      },
      {
        "@type": "WebPage", "@id": `${url}#page`, url,
        name: PAGE_COPY["/tools/expiry-calculator"].title,
        description: PAGE_COPY["/tools/expiry-calculator"].description,
        inLanguage: "en", isAccessibleForFree: true,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: { "@id": `${url}#calculator` },
        breadcrumb: { "@id": `${url}#breadcrumbs` },
      },
      {
        "@type": "WebApplication", "@id": `${url}#calculator`, url,
        name: "Free Expiry Date Calculator & Calendar Converter",
        description: PAGE_COPY["/tools/expiry-calculator"].description,
        mainEntityOfPage: { "@id": `${url}#page` },
        applicationCategory: "UtilitiesApplication", operatingSystem: "Any",
        browserRequirements: "Requires JavaScript. Calculations run locally in your browser.",
        isAccessibleForFree: true, inLanguage: ["en", "zh-TW", "id-ID"],
        featureList: ["Expiry countdown", "Calendar date difference", "Reminder date arithmetic", "Conversion between Gregorian, ROC, Thai Buddhist and Japanese era calendars", "Explicit date input and result formats", "IANA time zone selection"],
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "BreadcrumbList", "@id": `${url}#breadcrumbs`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Renewables", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Expiry date calculator", item: url },
        ],
      },
    ],
  };
}

function homeStructuredData(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: "Renewables",
        alternateName: "Renewables Life Admin Tracker",
        description: HOME_DESCRIPTION,
        inLanguage: "en",
      },
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
