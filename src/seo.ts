import { faqs } from "./content/faqs";

export const SITE_URL = "https://renewables.cubelated.com";
export const SOCIAL_IMAGE_URL = `${SITE_URL}/social-preview.png`;
export const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.cubelated.renewly";

export const INDEXED_PATHS = ["/", "/privacy", "/terms", "/support"] as const;

type IndexedPath = (typeof INDEXED_PATHS)[number];

export type PageSeo = {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  structuredData: Record<string, unknown> | null;
};

const HOME_DESCRIPTION =
  "Track passports, IDs, subscriptions, warranties, and other expiry dates in one life admin app with reminders, calendar planning, and recurring renewals.";

const PAGE_COPY: Record<
  IndexedPath,
  Pick<PageSeo, "title" | "description">
> = {
  "/": {
    title: "Renewables: Life Admin & Expiry Reminder App",
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
    structuredData: path === "/" ? homeStructuredData() : null,
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
        offers: {
          "@type": "Offer",
          price: 0,
          url: GOOGLE_PLAY_URL,
        },
        featureList: [
          "Expiry date tracking",
          "Renewal reminders",
          "Life admin templates",
          "Calendar planning",
          "Recurring renewals",
          "Android home screen widget",
          "Cloud synchronization",
        ],
        publisher: {
          "@type": "Organization",
          name: "Cubelated",
          url: "https://cubelated.com/",
        },
        sameAs: [GOOGLE_PLAY_URL],
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
