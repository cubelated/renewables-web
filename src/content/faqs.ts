import { product } from "./product";

const { free, pro } = product.plans;

// Shared by the visible FAQ and FAQPage JSON-LD.
export const faqs = [
  {
    question: "Is Renewables free?",
    answer: "Yes. Renewables Free includes document scanning on supported mobile devices, renewal checklists, country-specific templates, calendar view, and cloud synchronization. Pro adds higher limits, recurring renewals, and CSV export.",
  },
  {
    question: "How many items can I track?",
    answer: `Free includes ${free.activeItems} active items. Pro includes unlimited active items. An active item is one you are still tracking, rather than an item marked complete.`,
  },
  {
    question: "How many reminders can I set?",
    answer: `Free supports ${free.reminderTimes} reminder times per item; Pro supports ${pro.reminderTimes}. Choose when to be reminded before expiry. Delivery depends on notification permissions and device settings, so check important dates yourself too.`,
  },
  {
    question: "Can I scan documents for free?",
    answer: `Yes. On-device document scanning is included in Free and Pro on supported Android and iOS devices. The iOS app is coming soon. Review any detected dates before saving; you can always edit details manually. Scanning is not available in the web app. Attaching the image is optional: Free allows ${free.images} image per item and Pro allows ${pro.images}.`,
  },
  {
    question: "Does document scanning upload my documents?",
    answer: "Text recognition processes the image on your device; the image is not uploaded for recognition. Details you choose to save sync to your account. If you choose to attach an image to an item, that attachment is uploaded for cloud storage and counts toward your plan’s image limit.",
  },
  {
    question: "What is Renewal Assistant?",
    answer: "Renewal Assistant provides document-specific preparation checklists with editable steps and progress tracking. Checklists and renewal history are available on Free. When you finish the actual renewal, record it in the app. Pro also supports recurring renewals.",
  },
  {
    question: "Are country-specific checklists official?",
    answer: "No. Templates and checklists are informational preparation aids, including selected Taiwan and Indonesia documents. Coverage is not comprehensive. Requirements vary by authority and may change. Always confirm details with the relevant official source. Renewables does not submit applications or complete official renewals for you.",
  },
  {
    question: "What features require Pro?",
    answer: `Pro provides unlimited active items, ${pro.reminderTimes} reminder times per item, ${pro.images} images per item, recurring renewal functionality, and CSV export. Document scanning, renewal checklists, templates, calendar, and cloud synchronization are included in Free. Collaboration is not currently available on either plan.`,
  },
  {
    question: "What happens when I cancel Pro?",
    answer: "Manage cancellation through the store where you subscribed. Pro remains available while your paid entitlement is active. When it expires, Free limits apply to adding or editing items, and recurring renewal functionality and CSV export require Pro again. Check your account in the app for your current subscription status.",
  },
  {
    question: "Is Renewables available on Android, iOS, and Web?",
    answer: "Android is available on Google Play, and the web app is available at app.renewables.cubelated.com. The iOS app and iOS home screen widgets are coming soon. Document scanning is a supported mobile-device feature, and Android widgets require a supported device. You can add items manually in the web app.",
  },
  {
    question: "Can I export my data?",
    answer: "Pro includes CSV export of current item records in a spreadsheet-compatible format. CSV export is not a full backup of images or renewal history.",
  },
] as const;
