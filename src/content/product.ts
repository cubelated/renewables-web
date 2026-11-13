// Marketing facts only. This does not configure app entitlements or billing.
// Limits supplied by the live-plan configuration in the redesign brief.
export const product = {
  name: "Renewables",
  alternateSiteNames: ["Renewables by Cubelated", "renewables.cubelated.com"],
  webAppUrl: "https://app.renewables.cubelated.com/",
  googlePlayUrl:
    "https://play.google.com/store/apps/details?id=com.cubelated.renewly",
  iosStatus: "Coming soon",
  description:
    "Stay ahead of important deadlines with document scanning, customizable reminders, and guided renewal checklists—all in one place.",
  plans: {
    free: { activeItems: 10, reminderTimes: 2, images: 1 },
    pro: { activeItems: null, reminderTimes: 5, images: 5 },
  },
  // Leave numeric prices unpublished until confirmed against a live store product.
  pricing: {
    proLabel: "See in-app pricing",
    storeNote:
      "Subscriptions are purchased in the supported mobile app. Final prices and currencies may vary by region and store.",
  },
} as const;

export const templateGroups = [
  {
    title: "Everyday essentials",
    subtitle: "General templates",
    items: ["Passport & visa", "Work permit", "Driver’s license", "Insurance & vehicle documents"],
  },
  {
    title: "Taiwan",
    subtitle: "Selected local documents",
    items: ["ARC (Alien Resident Certificate)", "Taiwan Employment Gold Card"],
  },
  {
    title: "Indonesia",
    subtitle: "Selected local documents",
    items: ["Indonesian Passport", "Police Clearance (SKCK)", "Vehicle Tax (PKB)", "STNK — Five-year Renewal"],
  },
] as const;
