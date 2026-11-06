import { ChevronRight, HelpCircle, Sparkles } from "lucide-react";
import { faqs } from "../../content/faqs";
import { product } from "../../content/product";
import { CtaLink, FeaturePoint, SectionHeader } from "./shared";

export function Pricing() {
  const { free, pro } = product.plans;
  return (
    <section id="pricing" className="relative z-10 overflow-hidden bg-gradient-to-br from-[#081638] via-[#123f9b] to-[#5b35b5] px-6 py-24" aria-labelledby="pricing-title" data-section-event="landing_pricing_view">
      <span id="pro" className="absolute top-0" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-fuchsia-400/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.10)_1px,transparent_0)] bg-[length:28px_28px] opacity-30" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-blue-100 backdrop-blur">
            <Sparkles size={16} aria-hidden="true" />Free & Pro
          </div>
          <h2 id="pricing-title" className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">More room. More reminders. Smarter renewals.</h2>
          <p className="mt-4 text-lg leading-8 text-blue-100">Start free with scanning and renewal checklists. Upgrade when you need more flexibility.</p>
        </div>
        <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2">
          <article className="flex flex-col rounded-[2rem] border border-white/80 bg-white p-8 shadow-2xl shadow-slate-950/10 sm:p-10" aria-labelledby="free-title">
            <h3 id="free-title" className="text-2xl font-black">Renewables Free</h3>
            <p className="mt-3 leading-7 text-slate-600">Everything you need to stay on top of essential deadlines.</p>
            <p className="my-7 text-3xl font-black tracking-tight">Free forever</p>
            <CtaLink destination="web" location="pricing-free" variant="secondary">Get Started Free</CtaLink>
            <ul className="mt-8 space-y-4 border-t border-slate-200 pt-8">
              {[
                `${free.activeItems} active items`, `${free.reminderTimes} reminder times per item`, `${free.images} image per item`,
                "Document scanning", "Renewal checklists", "Country-specific templates",
                "Calendar and widgets on supported platforms", "Cloud synchronization",
              ].map((point) => <FeaturePoint key={point}>{point}</FeaturePoint>)}
            </ul>
            <p className="mt-auto pt-8 text-sm leading-6 text-slate-500">Recurring renewals and CSV export require Pro.</p>
          </article>
          <article className="flex flex-col rounded-[2rem] border border-violet-200 bg-gradient-to-br from-white to-violet-50 p-8 shadow-2xl shadow-slate-950/10 sm:p-10" aria-labelledby="pro-title">
            <h3 id="pro-title" className="text-2xl font-black">Renewables Pro</h3>
            <p className="mt-3 leading-7 text-slate-600">More room, more reminders, and less repetitive work.</p>
            <p className="my-7 text-3xl font-black tracking-tight">{product.pricing.proLabel}</p>
            <CtaLink destination="play" location="pricing-pro" event="landing_pro_click">Explore Pro</CtaLink>
            <ul className="mt-8 space-y-4 border-t border-slate-200 pt-8">
              {[
                "Unlimited active items", `${pro.reminderTimes} reminder times per item`, `${pro.images} images per item`,
                "Smart recurring renewals", "CSV export", "Everything in Free",
              ].map((point) => <FeaturePoint key={point}>{point}</FeaturePoint>)}
            </ul>
            <p className="mt-auto pt-8 text-sm leading-6 text-slate-500">Open Account in the mobile app to explore Pro and current subscription options.</p>
          </article>
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-7 text-blue-100">{product.pricing.storeNote} Scanning and widgets require a supported mobile device; the iOS app is coming soon.</p>
      </div>
    </section>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="relative z-10 px-6 py-24" aria-label="Frequently asked questions">
      <div className="mx-auto max-w-4xl">
        <SectionHeader eyebrow="Frequently Asked Questions" title="Know before you start."
          description="Clear answers about scanning, reminders, renewal checklists, supported platforms, and your account." />
        <div className="mt-12 space-y-4">
          {faqs.map(({ question, answer }) => (
            <details key={question} className="faq-item group rounded-2xl border border-white/80 bg-white/80 p-6 shadow-lg shadow-blue-500/5 backdrop-blur transition duration-300 hover:border-blue-100 hover:bg-white open:border-blue-100 open:bg-white open:shadow-xl open:shadow-blue-500/10" name="landing-faq">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-5 font-black text-slate-900 marker:content-none">
                <span className="flex items-center gap-3"><HelpCircle size={20} className="shrink-0 text-[#246df3]" aria-hidden="true" />{question}</span>
                <ChevronRight size={20} className="shrink-0 text-slate-400 transition group-open:rotate-90 group-open:text-[#246df3]" aria-hidden="true" />
              </summary>
              <p className="ml-8 mt-4 leading-7 text-slate-600 sm:pr-8">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
