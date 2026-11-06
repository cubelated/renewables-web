import { Bell, ClipboardCheck, Globe2, ListChecks, ScanLine } from "lucide-react";
import FeatureVideo from "../FeatureVideo";
import { ocrMedia } from "../../content/media";
import { product, templateGroups } from "../../content/product";
import { CtaLink, FeatureEyebrow, FeaturePoint, FeatureScreenshot, SectionHeader } from "./shared";

const steps = [
  { icon: ScanLine, title: "Scan or add", text: "Scan a document to find its expiry date, or add the details yourself." },
  { icon: Bell, title: "Stay reminded", text: "Choose when to receive notifications before important deadlines." },
  { icon: ClipboardCheck, title: "Prepare and renew", text: "Follow a renewal checklist, track your progress, and record your completed renewal." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative z-10 px-6 pb-24" aria-label="How it works">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Scan → Track → Prepare → Renew" title="From a document to a reminder in three steps."
          description="A simple routine for the important things you want to stay ahead of." />
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="rounded-[2rem] border border-white/80 bg-white/80 p-8 shadow-xl shadow-blue-500/5 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#246df3] to-[#7a5cff] text-white shadow-lg shadow-blue-500/25"><Icon size={26} aria-hidden="true" /></span>
                <span className="text-sm font-black text-blue-600">0{index + 1}</span>
              </div>
              <h3 className="mt-6 text-xl font-black">{title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function DocumentScanning() {
  return (
    <section id="document-scanning" className="relative z-10 scroll-mt-6 px-6 py-24" aria-labelledby="scan-title">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div className="feature-copy">
          <FeatureEyebrow icon={ScanLine}>Document scanning · Free &amp; Pro</FeatureEyebrow>
          <h2 id="scan-title" className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">Scan your documents.<br />Save time.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">Take a photo or choose an image. Renewables helps identify expiration dates, letting you review the details before saving.</p>
          <ul className="mt-8 space-y-4">
            <FeaturePoint>On-device document scanning and expiry-date detection.</FeaturePoint>
            <FeaturePoint>Manual review before saving, with editable details.</FeaturePoint>
            <FeaturePoint>Included in Free and Pro on supported Android and iOS devices.</FeaturePoint>
          </ul>
          <p className="mt-6 text-sm leading-7 text-slate-500">iOS is coming soon. The web app supports manual entry; document scanning requires a supported mobile device.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <CtaLink destination="play" location="ocr-video-play-store">Try Renewables Free</CtaLink>
            <CtaLink destination="web" location="ocr-video-web" variant="secondary">Use Web App</CtaLink>
          </div>
          <p className="mt-5 text-sm leading-7 text-slate-500">Attaching the scanned image is optional: {product.plans.free.images} image per item on Free, {product.plans.pro.images} on Pro.</p>
        </div>
        <FeatureVideo {...ocrMedia} />
      </div>
    </section>
  );
}

export function RenewalAssistant() {
  return (
    <section id="renewal-assistant" className="relative z-10 scroll-mt-6 border-y border-white/80 bg-white/65 px-6 py-24 backdrop-blur" aria-labelledby="renewal-title">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <FeatureScreenshot src="/screenshot-renewal-checklist.webp" width={700} height={1501}
            alt="Renewables passport renewal checklist showing two of six steps completed and editable preparation steps" />
        </div>
        <div className="order-1 lg:order-2">
          <FeatureEyebrow icon={ListChecks}>Renewal Assistant · Included in Free</FeatureEyebrow>
          <h2 id="renewal-title" className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">Renewing is more than remembering.</h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">Prepare with guided checklists, follow your progress, and keep a record when the renewal is complete.</p>
          <ul className="mt-8 space-y-4">
            <FeaturePoint>Document-specific checklists, with steps you can edit.</FeaturePoint>
            <FeaturePoint>Track your progress and record completed renewals.</FeaturePoint>
            <FeaturePoint>Keep renewal history and previous expiry dates.</FeaturePoint>
            <FeaturePoint>Pro supports recurring renewals for repeated deadlines.</FeaturePoint>
          </ul>
          <p className="mt-6 text-sm leading-7 text-slate-500">Checklists help you prepare. Follow the relevant authority's official renewal process; Renewables does not submit applications.</p>
        </div>
      </div>
    </section>
  );
}

export function Templates() {
  return (
    <section id="templates" className="relative z-10 scroll-mt-6 px-6 py-24" aria-labelledby="templates-title">
      <span id="easy-reminders" />
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <FeatureScreenshot src="/screenshot-template.webp" alt="Renewables template picker for common documents and renewals" />
          </div>
          <div className="order-1 lg:order-2">
            <FeatureEyebrow icon={Globe2}>Templates &amp; easy reminders</FeatureEyebrow>
            <h2 id="templates-title" className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">Prepared for the documents that matter to you.</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">Get started with templates for common documents, including location-specific examples and renewal guidance where available.</p>
            <ul className="mt-8 space-y-4">
              <FeaturePoint>Passports, residence permits, work permits, licenses, insurance, and vehicle documents.</FeaturePoint>
              <FeaturePoint>{product.plans.free.reminderTimes} reminder times per item on Free.</FeaturePoint>
              <FeaturePoint>{product.plans.pro.reminderTimes} reminder times per item on Pro.</FeaturePoint>
            </ul>
          </div>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {templateGroups.map(({ title, subtitle, items }) => (
            <article key={title} className="rounded-[2rem] border border-white/80 bg-white/80 p-8 shadow-xl shadow-blue-500/5 backdrop-blur">
              <h3 className="text-xl font-black">{title}</h3>
              <p className="mt-2 text-sm font-semibold text-[#246df3]">{subtitle}</p>
              <ul className="mt-5 list-disc space-y-2 pl-5 leading-7 text-slate-600">{items.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm leading-7 text-slate-500">Selected examples, not comprehensive country coverage. Guidance is informational. Requirements vary by authority and may change. Always confirm details with the relevant official source.</p>
      </div>
    </section>
  );
}
