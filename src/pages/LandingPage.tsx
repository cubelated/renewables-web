import { Bell, CalendarDays, Check, ChevronRight, CloudSync, ListChecks, ScanLine, Smartphone, Sparkles } from "lucide-react";
import Header from "../components/landing/Header";
import { FAQ, Pricing } from "../components/landing/PricingAndFaq";
import { CtaLink, FeatureEyebrow, FeaturePoint, FeatureScreenshot, SectionHeader } from "../components/landing/shared";
import { HowItWorks, DocumentScanning, RenewalAssistant, Templates } from "../components/landing/ProductHighlights";
import { product } from "../content/product";

const features = [
  { icon: ScanLine, title: "Document scanning", description: "Scan on a supported mobile device and review detected expiry dates before saving.", href: "#document-scanning" },
  { icon: ListChecks, title: "Renewal Assistant", description: "Prepare with editable checklists, track your progress, and record each renewal.", href: "#renewal-assistant" },
  { icon: Bell, title: "Easy reminders", description: "Start from a document template and choose when you want to be reminded.", href: "#templates" },
  { icon: CalendarDays, title: "Calendar view", description: "See upcoming expiry dates together in a calendar built for quick planning.", href: "#calendar" },
  { icon: Smartphone, title: "Home screen widget", description: "Check upcoming and urgent items at a glance on supported mobile devices.", href: "#widget" },
  { icon: CloudSync, title: "Cloud sync", description: "Sign in to keep your items synchronized across supported platforms.", href: "#cloud-sync" },
];
const syncAvatars = [1, 2, 3, 4].map((index) => ({ src: "/avatars/" + index + ".webp", alt: "Illustrated user avatar" }));

export default function LandingPage() {
  return (
    <div className="landing relative min-h-screen overflow-hidden bg-[#f7fbff] text-slate-950">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <BackgroundDecor />
      <Header />
      <main id="main-content" tabIndex={-1}>
      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-2 sm:pt-10 lg:grid-cols-2 lg:pb-32 lg:pt-20" aria-labelledby="hero-title">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#246df3]/15 bg-white/75 px-4 py-2 text-xs font-black text-[#246df3] shadow-sm backdrop-blur sm:text-sm">
            <Sparkles size={16} className="shrink-0" aria-hidden="true" />
            Your important dates, under control
          </div>

          <h1 id="hero-title" className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Scan your documents. Track expiry dates.{" "}
            <span className="bg-gradient-to-r from-[#246df3] via-[#4458ff] to-[#7a5cff] bg-clip-text text-transparent">Prepare for renewals.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-xl">
            Keep passports, permits, insurance, subscriptions, and other important deadlines organized with smart reminders and guided renewal checklists.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <StoreButton type="google" location="hero-play" />
            <CtaLink destination="web" location="hero-web" variant="secondary">Try the Web App</CtaLink>
          </div>
          <p className="mt-4 text-sm text-slate-500">Android &amp; Web available · iOS {product.iosStatus.toLowerCase()}</p>
        </div>

        <div
          className="relative mx-auto flex min-h-[410px] sm:min-h-[560px] w-full max-w-xl items-center justify-center overflow-visible"
        >
          {/* Soft background glow */}
          <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
            <div className="h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-[#246df3]/20 via-[#7a5cff]/10 to-cyan-300/10 blur-3xl" />
          </div>

          {/* Clean background card */}
          <div className="absolute z-10 h-[280px] w-full max-w-[450px] sm:h-[380px] rounded-[3rem] border border-white/70 bg-white/50 shadow-2xl shadow-blue-500/10 backdrop-blur-2xl" />

          {/* Subtle accent layer */}
          <div className="absolute z-20 h-[365px] w-[250px] sm:h-[530px] sm:w-[380px] rotate-[5deg] rounded-[2.75rem] bg-gradient-to-br from-[#246df3]/90 via-[#4f63ff]/85 to-[#8b5cf6]/80 shadow-2xl shadow-blue-500/25" />

          {/* Light pattern overlay */}
          <div className="absolute z-30 h-[330px] w-[260px] sm:h-[430px] sm:w-[400px] rotate-[8deg] rounded-[2.75rem] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.28)_1px,transparent_0)] bg-[length:24px_24px] opacity-35" />

          {/* Phone image - always centered */}
          <div className="relative z-40 w-full max-w-[260px] sm:max-w-[380px]">
            <img
              src="/app-phone.webp"
              alt="Renewables dashboard showing upcoming insurance and vehicle expiry dates"
              width="720"
              height="1280"
              fetchPriority="high"
              className="hero-phone mx-auto w-full drop-shadow-[0_45px_90px_rgba(30,64,175,0.42)] transition duration-500 hover:scale-[1.015]"
            />
          </div>
        </div>
      </section>

      <HowItWorks />
      <section
        id="features"
        className="relative z-10 scroll-mt-6 border-y border-white/80 bg-white/65 px-6 py-24 backdrop-blur"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Everything you need"
            title="An expiry tracker built for real-life deadlines."
            description="Add what matters, choose when to be reminded, and see what needs attention next."
          />

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <a
                  key={feature.title}
                  href={feature.href}
                  className="group h-full rounded-[2rem] border border-white/80 bg-white/80 p-8 shadow-xl shadow-blue-500/5 backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:border-blue-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 focus:outline-none focus:ring-4 focus:ring-[#246df3]/20"
                >
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#246df3] to-[#7a5cff] text-white shadow-lg shadow-blue-500/25 transition duration-300 group-hover:scale-105 group-hover:rotate-2">
                    <Icon size={30} />
                  </div>

                  <h3 className="text-xl font-black">{feature.title}</h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {feature.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-black text-[#246df3]">
                    Explore feature
                    <ChevronRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <DocumentScanning />
      <RenewalAssistant />
      <Templates />
      <section
        id="calendar"
        className="relative z-10 scroll-mt-6 border-y border-white/80 bg-white/65 px-6 py-24 backdrop-blur"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div className="lg:order-1">
            <FeatureEyebrow icon={CalendarDays}>Calendar view</FeatureEyebrow>
            <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
              See every important date in context.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Browse upcoming expiries by day and understand what is ahead at a
              glance. The calendar keeps deadlines visible, so you can plan
              renewals before they become urgent.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "View expiry and renewal dates by month",
                "Spot busy periods before deadlines overlap",
                "Open an item directly from its calendar date",
              ].map((point) => (
                <FeaturePoint key={point}>{point}</FeaturePoint>
              ))}
            </ul>
          </div>

          <div className="lg:order-2">
            <FeatureScreenshot
              src="/screenshot-calendar.webp"
              alt="Renewables calendar showing upcoming expiry dates"
            />
          </div>
        </div>
      </section>

      <section id="widget" className="relative z-10 scroll-mt-6 px-6 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#246df3]/10 px-4 py-2 text-sm font-black text-[#246df3]">
              <Smartphone size={16} />
              At a glance
            </div>

            <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
              Check important dates without opening the app.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              The Renewables Android widget shows items that are expired, due
              today, or expiring within the next 30 days—right from your home
              screen.
            </p>

            <div className="mt-8 rounded-[2rem] border border-blue-100 bg-white/80 p-6 shadow-xl shadow-blue-500/5 backdrop-blur transition duration-300 hover:border-blue-200 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#246df3]/10 text-[#246df3]">
                    <Smartphone size={22} />
                  </div>
                  <div>
                    <p className="font-black">Android</p>
                    <p className="text-sm text-slate-500">Available now</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                  Supported
                </span>
              </div>

              <ol className="mt-6 space-y-4">
                {[
                  "Open Renewables and make sure you are signed in.",
                  "Touch and hold an empty area on your Android home screen, then tap Widgets.",
                  "Find Renewables in the widget list.",
                  "Touch and hold the widget, then drag it to your preferred position.",
                ].map((step, index) => (
                  <li
                    key={step}
                    className="flex gap-3 text-sm leading-6 text-slate-600"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#246df3] text-xs font-black text-white">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-[#0f2f7a] to-[#246df3] p-8 text-white shadow-2xl shadow-blue-500/20 transition duration-500 hover:-translate-y-1 hover:shadow-blue-500/30 sm:p-10"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="relative">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-200">
                Widget illustration
              </p>
              <h3 className="mt-3 text-3xl font-black">
                See what needs attention next.
              </h3>

              <div className="mt-8 rounded-[2rem] border border-white/10 bg-[#111827] p-5 shadow-2xl shadow-slate-950/40 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src="/logo.webp"
                      alt="Renewables logo"
                      width="128"
                      height="128"
                      className="h-12 w-12 shrink-0 rounded-2xl shadow-lg shadow-blue-950/30 sm:h-14 sm:w-14"
                    />
                    <span className="truncate text-xl font-black tracking-tight sm:text-2xl">
                      Renewables
                    </span>
                  </div>
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#246df3] text-3xl font-light text-white shadow-lg shadow-blue-500/30 sm:h-14 sm:w-14"
                  >
                    +
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-full bg-red-600 px-4 py-3 text-center text-sm font-black text-white shadow-lg shadow-red-950/20 sm:text-base">
                    Urgent (2)
                  </div>
                  <div className="rounded-full bg-[#202a3b] px-4 py-3 text-center text-sm font-bold text-slate-200 sm:text-base">
                    Soon (6)
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <WidgetItem
                    title="Vehicle registration"
                    detail="Expired • Jul 06, 2026 • 12:00 PM"
                  />
                  <WidgetItem
                    title="Travel insurance"
                    detail="Expired • Jul 08, 2026 • 9:00 AM"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Smartphone size={20} />
                </div>
                <div>
                  <p className="text-sm font-black">iPhone widget</p>
                  <p className="text-sm text-blue-200">
                    Coming soon with the iOS app.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="cloud-sync"
        className="relative z-10 scroll-mt-6 border-y border-white/80 bg-white/65 px-6 py-24 backdrop-blur"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <FeatureEyebrow icon={CloudSync}>Cloud sync</FeatureEyebrow>
            <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
              Your items stay with your account.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Every signed-in account has its Renewables items synchronized in
              the cloud. Sign back in on a supported device to fetch your
              tracked items and continue where you left off.
            </p>
            <ul className="mt-8 space-y-4">
              <FeaturePoint>Keep renewal history and previous expiry dates.</FeaturePoint>
              <FeaturePoint>Export current item records as CSV with Pro.</FeaturePoint>
            </ul>
          </div>

          <div
            className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0f46d9] via-[#246df3] to-[#7a5cff] p-8 text-white shadow-2xl shadow-blue-500/20 sm:p-10"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-cyan-300/25 blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-100">
                    One account
                  </p>
                  <p className="mt-2 text-2xl font-black">Your dates, in sync</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur">
                  <CloudSync size={27} />
                </div>
              </div>

              <div className="mt-10 flex -space-x-3">
                {syncAvatars.map((avatar, index) => (
                  <img
                    key={avatar.src}
                    src={avatar.src}
                    alt={avatar.alt}
                    width="256"
                    height="256"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    style={{ zIndex: syncAvatars.length - index }}
                    className="h-16 w-16 rounded-full border-4 border-[#3569eb]/10 bg-white object-cover shadow-lg sm:h-20 sm:w-20"
                  />
                ))}
              </div>

              <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-emerald-950">
                  <Check size={18} strokeWidth={3} />
                </span>
                <p className="font-bold text-blue-50">
                  Sign in to fetch your latest items automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Pricing />
      <FAQ />
      <section className="relative z-10 px-6 pb-24">
        <div
          className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#0f46d9] via-[#246df3] to-[#7a5cff] p-8 text-white shadow-2xl shadow-blue-500/25 transition duration-500 hover:-translate-y-1 hover:shadow-blue-500/35 sm:p-10"
        >
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.webp"
                  alt="Renewables logo"
                  width="128"
                  height="128"
                  className="h-14 w-14 rounded-2xl shadow-xl shadow-blue-950/20"
                />
                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Take the next deadline off your mind.
                </h2>
              </div>

              <p className="mt-4 text-blue-100">Scan documents, track expiry dates, and prepare for renewals—all in one place.</p>
              <CtaLink destination="web" location="footer-web" variant="light" className="mt-5 inline-flex min-h-11 items-center gap-1 font-bold text-white underline underline-offset-4">Start Tracking for Free</CtaLink>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <StoreButton type="google" location="footer-play" compact />
              <StoreButton type="apple" compact />
            </div>
          </div>
        </div>
      </section>

      </main>
      <footer className="relative z-10 border-t border-white/70 bg-white/75 px-6 py-10 backdrop-blur">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/logo.webp"
                alt="Renewables logo"
                width="128"
                height="128"
                className="h-10 w-10 rounded-xl"
              />
              <span className="text-xl font-black">Renewables</span>
            </div>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
              Track renewals, expiry dates, and reminders—all in one place.
            </p>
          </div>

          <FooterColumn
            title="Resources"
            links={[
              { label: "Free expiry date calculator", href: "/tools/expiry-calculator" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Support", href: "/support" },
            ]}
          />
        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Renewables. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function BackgroundDecor() {
  return (
    <>
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-40 h-[32rem] w-[32rem] rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-300/20 blur-3xl" />
    </>
  );
}

type WidgetItemProps = {
  title: string;
  detail: string;
};

function WidgetItem({ title, detail }: WidgetItemProps) {
  return (
    <div className="rounded-2xl bg-[#202a3b] p-4 shadow-sm ring-1 ring-white/[0.03] transition duration-300 hover:bg-[#263247] sm:p-5">
      <p className="truncate text-base font-black text-white sm:text-lg">
        {title}
      </p>
      <p className="mt-1.5 truncate text-xs font-medium text-red-400 sm:text-sm">
        {detail}
      </p>
    </div>
  );
}


function StoreButton({ type, location = "footer-play", compact = false }: { type: "google" | "apple"; location?: string; compact?: boolean }) {
  const isGoogle = type === "google";
  const className = [
    "inline-flex items-center justify-center gap-3 rounded-2xl text-white shadow-xl transition duration-300",
    isGoogle ? "bg-slate-950 shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-slate-800" : "border border-white/10 bg-slate-800/90 shadow-slate-900/5",
    compact ? "px-5 py-3" : "px-6 py-4",
  ].join(" ");
  const content = <>
    <img src={isGoogle ? "/google-play-logo.svg" : "/apple-logo.png"} alt="" width="32" height="32" className="h-8 w-8 shrink-0 object-contain" />
    <span className="text-left leading-none">
      <span className="block text-[10px] font-semibold uppercase tracking-wide text-white/70">{isGoogle ? "Google Play" : "iPhone app"}</span>
      <span className="mt-1 block text-lg font-black">{isGoogle ? "Get Renewables" : "Coming Soon"}</span>
    </span>
  </>;
  return isGoogle ? <CtaLink destination="play" location={location} className={className} showArrow={false}>{content}</CtaLink>
    : <span className={className} aria-label="Renewables for iPhone is coming soon">{content}</span>;
}
type FooterColumnProps = {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
};

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="md:justify-self-end">
      <h3 className="font-black text-slate-900">{title}</h3>

      <div className="mt-4 flex flex-col gap-3 text-sm font-semibold text-slate-500">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="inline-flex items-center gap-1 transition hover:text-[#246df3]"
          >
            {link.label}
            <ChevronRight size={14} />
          </a>
        ))}
      </div>
    </div>
  );
}
