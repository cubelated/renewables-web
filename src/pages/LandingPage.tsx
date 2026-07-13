import {
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  CloudSync,
  HelpCircle,
  MessageCircleQuestion,
  Smartphone,
  Sparkles,
  WandSparkles, Infinity
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.cubelated.renewly";

const features = [
  {
    icon: Bell,
    title: "Easy reminders",
    description:
      "Start from a ready-made template and choose when you want to be reminded.",
    href: "#easy-reminders",
  },
  {
    icon: CalendarDays,
    title: "Calendar view",
    description:
      "See upcoming expiries and renewal dates in a calendar built for quick planning.",
    href: "#calendar",
  },
  {
    icon: Smartphone,
    title: "Home screen widget",
    description:
      "Check urgent items and dates coming within 30 days without opening the app.",
    href: "#widget",
  },
  {
    icon: CloudSync,
    title: "Cloud sync",
    description:
      "Sign in to keep your items synchronized and ready across supported devices.",
    href: "#cloud-sync",
  },
];

const syncAvatars = [
  {
    src: "/avatars/1.jpg",
    alt: "Illustrated user avatar",
  },
  {
    src: "/avatars/2.jpg",
    alt: "Illustrated user avatar",
  },
  {
    src: "/avatars/3.jpg",
    alt: "Illustrated user avatar",
  },
  {
    src: "/avatars/4.jpg",
    alt: "Illustrated user avatar",
  },
];

const faqs = [
  {
    question: "What can I track with Renewables?",
    answer:
      "You can track passports, IDs, visas, licenses, insurance policies, warranties, subscriptions, vehicle documents, certifications, and almost anything with an expiry or renewal date.",
  },
  {
    question: "How do reminders work?",
    answer:
      "Choose how far in advance you want to be notified for each item. Free accounts include one reminder per item, while Pro supports up to five reminder times per item.",
  },
  {
    question: "What is included with Renewables Pro?",
    answer:
      "Pro includes unlimited active items, up to five reminder times per item, and recurring renewals with Auto-create next expiry and Ask after renew modes.",
  },
  {
    question: "How do recurring renewals work?",
    answer:
      "After you mark an item as renewed, Auto-create next expiry calculates its next date from your schedule. Ask after renew prompts you to choose the next date. In both modes, Renewables records the completed renewal and carries the item forward.",
  },
  {
    question: "Is Renewables available on iPhone?",
    answer:
      "The Android app is available on Google Play. The iPhone app and its home screen widget are currently coming soon.",
  },
  {
    question: "Is my information synchronized?",
    answer:
      "When you are signed in, your Renewables data is securely synchronized so your important records remain available across supported devices.",
  },
];

export default function LandingPage() {
  const pageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (pageRef.current) pageRef.current.dataset.motionReady = "true";

    const elements =
      pageRef.current?.querySelectorAll<HTMLElement>("[data-reveal]");

    if (!elements?.length) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      elements.forEach((element) => (element.dataset.visible = "true"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.visible = "true";
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -48px" },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <main
      ref={pageRef}
      className="relative min-h-screen overflow-hidden bg-[#f7fbff] text-slate-950"
    >
      <MotionStyles />
      <BackgroundDecor />

      <nav
        data-reveal="down"
        className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6"
      >
        <a
          href="/"
          className="flex items-center gap-3"
          aria-label="Renewables home"
        >
          <img
            src="/logo.png"
            alt="Renewables logo"
            className="h-11 w-11 rounded-xl shadow-md shadow-blue-500/20"
          />
          <span className="text-2xl font-black tracking-tight">Renewables</span>
        </a>

        <div className="hidden items-center gap-6 text-sm font-semibold text-slate-700 lg:flex xl:gap-8">
          <a href="#features" className="transition hover:text-[#246df3]">
            Features
          </a>
          <a href="#pro" className="transition hover:text-[#246df3]">
            Pro
          </a>
          <a href="#faq" className="transition hover:text-[#246df3]">
            FAQ
          </a>
          <a href="/privacy" className="transition hover:text-[#246df3]">
            Privacy
          </a>
          <a href="/support" className="transition hover:text-[#246df3]">
            Support
          </a>
        </div>
      </nav>

      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-10 lg:grid-cols-2 lg:pb-32 lg:pt-20">
        <div data-reveal="left">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#246df3]/15 bg-white/75 px-4 py-2 text-sm font-black text-[#246df3] shadow-sm backdrop-blur">
            <Sparkles size={16} />
            Your life admin, organized
          </div>

          <h1 className="mt-8 max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Track documents and expiry dates,{" "}
            <span className="bg-gradient-to-r from-[#246df3] via-[#4458ff] to-[#7a5cff] bg-clip-text text-transparent">
              all in one place
            </span>
            .
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Keeping track of your documents alone is a{" "}
            <span className="underline">troublesome task</span>.<br></br>
            Renewables helps you stay ahead of every important dates life asks
            you to remember.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <StoreButton type="google" href={GOOGLE_PLAY_URL} />
            <StoreButton type="apple" />
          </div>
        </div>

        <div
          data-reveal="right"
          className="relative mx-auto flex min-h-[560px] w-full max-w-xl items-center justify-center overflow-visible"
        >
          {/* Soft background glow */}
          <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
            <div className="h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-[#246df3]/20 via-[#7a5cff]/10 to-cyan-300/10 blur-3xl" />
          </div>

          {/* Clean background card */}
          <div className="absolute z-10 h-[380px] w-[450px] rounded-[3rem] border border-white/70 bg-white/50 shadow-2xl shadow-blue-500/10 backdrop-blur-2xl" />

          {/* Subtle accent layer */}
          <div className="absolute z-20 h-[530px] w-[380px] rotate-[5deg] rounded-[2.75rem] bg-gradient-to-br from-[#246df3]/90 via-[#4f63ff]/85 to-[#8b5cf6]/80 shadow-2xl shadow-blue-500/25" />

          {/* Light pattern overlay */}
          <div className="absolute z-30 h-[430px] w-[400px] rotate-[8deg] rounded-[2.75rem] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.28)_1px,transparent_0)] bg-[length:24px_24px] opacity-35" />

          {/* Phone image - always centered */}
          <div className="motion-float relative z-40 w-full max-w-[380px]">
            <img
              src="/app-phone.png"
              alt="Renewables app preview on phone"
              className="mx-auto w-full drop-shadow-[0_45px_90px_rgba(30,64,175,0.42)] transition duration-500 hover:scale-[1.015]"
            />
          </div>
        </div>
      </section>

      <section
        id="features"
        className="relative z-10 scroll-mt-8 border-y border-white/80 bg-white/65 px-6 py-24 backdrop-blur"
      >
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Everything you need"
            title="Built for real-life deadlines."
            description="Add what matters, choose when to be reminded, and see what needs attention next."
          />

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <a
                  key={feature.title}
                  href={feature.href}
                  data-reveal
                  style={
                    { "--reveal-delay": `${index * 90}ms` } as CSSProperties
                  }
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

      <section
        id="easy-reminders"
        className="relative z-10 scroll-mt-8 px-6 py-24"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <FeatureScreenshot
            src="/screenshot-template.png"
            alt="Renewables templates for common documents and renewals"
            reveal="left"
          />

          <div data-reveal="right">
            <FeatureEyebrow icon={Bell}>Easy reminders</FeatureEyebrow>
            <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
              Start quickly with a template, then choose when to be reminded.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Pick a template for common life-admin items such as passports,
              insurance, warranties, subscriptions, and licenses. Each one gives
              you a useful starting point, while keeping the due date and
              reminder timing fully under your control.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Ready-made templates for common expiry dates",
                "Two reminder per item on Free",
                "Up to five reminder times per item on Pro",
              ].map((point) => (
                <FeaturePoint key={point}>{point}</FeaturePoint>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        id="calendar"
        className="relative z-10 scroll-mt-8 border-y border-white/80 bg-white/65 px-6 py-24 backdrop-blur"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div data-reveal="left" className="lg:order-1">
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
              src="/screenshot-calendar.png"
              alt="Renewables calendar showing upcoming expiry dates"
              reveal="right"
            />
          </div>
        </div>
      </section>

      <section id="widget" className="relative z-10 scroll-mt-8 px-6 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div data-reveal="left">
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
            data-reveal="right"
            className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-[#0f2f7a] to-[#246df3] p-8 text-white shadow-2xl shadow-blue-500/20 transition duration-500 hover:-translate-y-1 hover:shadow-blue-500/30 sm:p-10"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />
            <div className="relative">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-200">
                Widget preview
              </p>
              <h3 className="mt-3 text-3xl font-black">
                See what needs attention next.
              </h3>

              <div className="mt-8 rounded-[2rem] border border-white/10 bg-[#111827] p-5 shadow-2xl shadow-slate-950/40 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src="/logo.png"
                      alt="Renewables logo"
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
        className="relative z-10 scroll-mt-8 border-y border-white/80 bg-white/65 px-6 py-24 backdrop-blur"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div data-reveal="left">
            <FeatureEyebrow icon={CloudSync}>Cloud sync</FeatureEyebrow>
            <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
              Your items stay with your account.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Every signed-in account has its Renewables items synchronized in
              the cloud. Sign back in on a supported device to fetch your
              tracked items and continue where you left off.
            </p>
          </div>

          <div
            data-reveal="right"
            className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0f46d9] via-[#246df3] to-[#7a5cff] p-8 text-white shadow-2xl shadow-blue-500/20 sm:p-10"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-cyan-300/25 blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-100">
                    One account
                  </p>
                  <p className="mt-2 text-2xl font-black">Always in sync</p>
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

      <section
        id="pro"
        className="relative z-10 scroll-mt-8 overflow-hidden bg-gradient-to-br from-[#081638] via-[#123f9b] to-[#5b35b5] px-6 py-24 text-white"
      >
        <div className="motion-drift-one pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="motion-drift-two pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.10)_1px,transparent_0)] bg-[length:28px_28px] opacity-30" />

        <div className="relative mx-auto max-w-7xl">
          <div data-reveal className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-blue-100 backdrop-blur">
              <Sparkles size={16} />
              Renewables Pro
            </div>
            <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
              More room. More reminders. Smarter renewals.
            </h2>
            <p className="mt-4 text-lg leading-8 text-blue-100">
              Upgrade to track everything without limits, add more reminder times, and keep
              recurring items moving forward your way.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <div data-reveal="left" className="h-full">
              <ProFeature
                icon={Infinity}
                title="Unlimited active items"
                description="Track every document, subscription, warranty, and renewal that matters without an active-item limit."
                points={[
                  "No limit on active items",
                  "Keep every important deadline together",
                ]}
              />
            </div>

            <div
              data-reveal="right"
              style={{ "--reveal-delay": "75ms" } as CSSProperties}
              className="h-full"
            >
              <ProFeature
                icon={Bell}
                title="Up to 5 reminders"
                description="Choose up to five reminder times for each item, from an early heads-up to a final reminder near the due date."
                points={[
                  "Customize reminder timing per item",
                  "Get multiple chances to take action",
                ]}
              />
            </div>

            <div
              data-reveal="left"
              style={{ "--reveal-delay": "150ms" } as CSSProperties}
              className="h-full"
            >
              <ProFeature
                icon={MessageCircleQuestion}
                title="Ask after renewal"
                description="When the next date can vary, Renewables asks you to choose it after marking the current renewal complete."
                points={[
                  "Ideal for flexible renewal schedules",
                  "Confirm the next expiry before continuing",
                  "Carries your current reminders forward",
                ]}
              />
            </div>

            <div
              data-reveal="right"
              style={{ "--reveal-delay": "225ms" } as CSSProperties}
              className="h-full"
            >
              <ProFeature
                icon={WandSparkles}
                title="Auto-create next renewal"
                description="For predictable schedules, Renewables calculates the next expiry automatically when you complete the current renewal."
                points={[
                  "Ideal for fixed renewal schedules",
                  "Carries your current reminders forward",
                  "Stops at your chosen end date or renewal count",
                ]}
              />
            </div>
          </div>

          <div
            data-reveal
            style={{ "--reveal-delay": "300ms" } as CSSProperties}
            className="mx-auto mt-10 flex max-w-2xl items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-5 text-left shadow-xl shadow-slate-950/10 backdrop-blur"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
              <Smartphone size={23} />
            </div>

            <div>
              <p className="font-black text-white">Upgrade inside the app</p>
              <p className="mt-1 text-sm leading-6 text-blue-100">
                Open Renewables, go to Account settings, and select Upgrade to Pro.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="relative z-10 scroll-mt-8 px-6 pb-24 pt-24">
        <div className="mx-auto max-w-4xl">
          <SectionHeader
            eyebrow="Frequently Asked Questions"
            title="Know before you start."
            description="Clear answers about reminders, recurring renewals, supported platforms, and your account."
          />

          <div className="mt-12 space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                data-reveal
                style={{ "--reveal-delay": `${index * 55}ms` } as CSSProperties}
                className="faq-item group rounded-2xl border border-white/80 bg-white/80 p-6 shadow-lg shadow-blue-500/5 backdrop-blur transition duration-300 hover:border-blue-100 hover:bg-white open:border-blue-100 open:bg-white open:shadow-xl open:shadow-blue-500/10"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-black text-slate-900 marker:content-none">
                  <span className="flex items-center gap-3">
                    <HelpCircle size={20} className="shrink-0 text-[#246df3]" />
                    {faq.question}
                  </span>
                  <ChevronRight
                    size={20}
                    className="shrink-0 text-slate-400 transition group-open:rotate-90 group-open:text-[#246df3]"
                  />
                </summary>
                <p className="ml-8 mt-4 pr-8 leading-7 text-slate-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 pb-24">
        <div
          data-reveal
          className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#0f46d9] via-[#246df3] to-[#7a5cff] p-8 text-white shadow-2xl shadow-blue-500/25 transition duration-500 hover:-translate-y-1 hover:shadow-blue-500/35 sm:p-10"
        >
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Renewables logo"
                  className="h-14 w-14 rounded-2xl shadow-xl shadow-blue-950/20"
                />
                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Take the next deadline off your mind.
                </h2>
              </div>

              <p className="mt-4 text-blue-100">
                Track renewals, expiry dates, and reminders—all in one place.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <StoreButton type="google" href={GOOGLE_PLAY_URL} compact />
              <StoreButton type="apple" compact />
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/70 bg-white/75 px-6 py-10 backdrop-blur">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Renewables logo"
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
    </main>
  );
}

function BackgroundDecor() {
  return (
    <>
      <div className="motion-drift-one pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="motion-drift-two pointer-events-none absolute -right-40 top-40 h-[32rem] w-[32rem] rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="motion-pulse-soft pointer-events-none absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-300/20 blur-3xl" />
    </>
  );
}

function MotionStyles() {
  return (
    <style>{`
      html {
        scroll-behavior: smooth;
      }

      [data-motion-ready="true"] [data-reveal] {
        opacity: 0;
        transform: translate3d(0, 28px, 0);
        transition:
          opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) var(--reveal-delay, 0ms),
          transform 700ms cubic-bezier(0.22, 1, 0.36, 1) var(--reveal-delay, 0ms);
        will-change: opacity, transform;
      }

      [data-motion-ready="true"] [data-reveal="left"] {
        transform: translate3d(-32px, 0, 0);
      }

      [data-motion-ready="true"] [data-reveal="right"] {
        transform: translate3d(32px, 0, 0);
      }

      [data-motion-ready="true"] [data-reveal="down"] {
        transform: translate3d(0, -18px, 0);
      }

      [data-motion-ready="true"] [data-reveal][data-visible="true"] {
        opacity: 1;
        transform: translate3d(0, 0, 0);
        will-change: auto;
      }

      .motion-float {
        animation: renewables-float 6s ease-in-out infinite;
      }

      .motion-drift-one {
        animation: renewables-drift-one 13s ease-in-out infinite alternate;
      }

      .motion-drift-two {
        animation: renewables-drift-two 15s ease-in-out infinite alternate;
      }

      .motion-pulse-soft {
        animation: renewables-pulse-soft 8s ease-in-out infinite;
      }

      .faq-item[open] > p {
        animation: renewables-faq-in 280ms ease-out both;
      }

      @keyframes renewables-float {
        0%, 100% { transform: translate3d(0, 0, 0); }
        50% { transform: translate3d(0, -10px, 0); }
      }

      @keyframes renewables-drift-one {
        from { transform: translate3d(0, 0, 0) scale(1); }
        to { transform: translate3d(28px, 20px, 0) scale(1.08); }
      }

      @keyframes renewables-drift-two {
        from { transform: translate3d(0, 0, 0) scale(1); }
        to { transform: translate3d(-24px, 28px, 0) scale(1.06); }
      }

      @keyframes renewables-pulse-soft {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1; }
      }

      @keyframes renewables-faq-in {
        from { opacity: 0; transform: translate3d(0, -6px, 0); }
        to { opacity: 1; transform: translate3d(0, 0, 0); }
      }

      @media (prefers-reduced-motion: reduce) {
        html { scroll-behavior: auto; }

        [data-motion-ready="true"] [data-reveal] {
          opacity: 1;
          transform: none;
          transition: none;
        }

        .motion-float,
        .motion-drift-one,
        .motion-drift-two,
        .motion-pulse-soft,
        .faq-item[open] > p {
          animation: none;
        }
      }
    `}</style>
  );
}

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div data-reveal className="mx-auto max-w-3xl text-center">
      <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-[#246df3]/10 px-4 py-2 text-sm font-black text-[#246df3]">
        <Sparkles size={16} />
        {eyebrow}
      </div>

      <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
        {title}
      </h2>

      <p className="mt-4 text-lg leading-8 text-slate-600">{description}</p>
    </div>
  );
}

type FeatureEyebrowProps = {
  icon: LucideIcon;
  children: string;
};

function FeatureEyebrow({ icon: Icon, children }: FeatureEyebrowProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-[#246df3]/10 px-4 py-2 text-sm font-black text-[#246df3]">
      <Icon size={16} />
      {children}
    </div>
  );
}

type FeaturePointProps = {
  children: string;
};

function FeaturePoint({ children }: FeaturePointProps) {
  return (
    <li className="flex items-start gap-3 font-semibold text-slate-700">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <Check size={14} strokeWidth={3} />
      </span>
      <span>{children}</span>
    </li>
  );
}

type FeatureScreenshotProps = {
  src: string;
  alt: string;
  reveal: "left" | "right";
};

function FeatureScreenshot({ src, alt, reveal }: FeatureScreenshotProps) {
  return (
    <div
      data-reveal={reveal}
      className="relative mx-auto flex w-full max-w-xl justify-center overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#e8f2ff] via-white to-[#eeeaff] p-8 shadow-2xl shadow-blue-500/10 sm:p-12"
    >
      <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-12 h-56 w-56 rounded-full bg-violet-300/30 blur-3xl" />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="relative max-h-[640px] w-auto max-w-full rounded-[1.75rem] object-contain shadow-slate-900/15 transition duration-500 hover:scale-[1.015]"
      />
    </div>
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

type ProFeatureProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  points: string[];
};

function ProFeature({
  icon: Icon,
  title,
  description,
  points,
}: ProFeatureProps) {
  return (
    <article className="group relative h-full overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.14] sm:p-10">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-300/15 blur-3xl transition group-hover:bg-cyan-300/25" />
      <div className="relative">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-cyan-300/30 to-violet-300/30 text-white shadow-lg shadow-slate-950/20 backdrop-blur">
          <Icon size={27} />
        </div>
        <h3 className="mt-6 text-2xl font-black tracking-tight text-white">
          {title}
        </h3>
        <p className="mt-3 leading-7 text-blue-100">{description}</p>
        <ul className="mt-6 space-y-3">
          {points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-3 text-sm font-semibold text-white/90"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-300/20 text-emerald-200 ring-1 ring-emerald-200/20">
                <Check size={13} strokeWidth={3} />
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

type StoreButtonProps = {
  type: "google" | "apple";
  href?: string;
  compact?: boolean;
};

function StoreButton({ type, href, compact = false }: StoreButtonProps) {
  const isGoogle = type === "google";
  const isAvailable = isGoogle && Boolean(href);
  const className = [
    "inline-flex items-center justify-center gap-3 rounded-2xl text-white shadow-xl transition duration-300 focus:outline-none focus:ring-4 focus:ring-[#246df3]/25",
    isAvailable
      ? "bg-slate-950 shadow-slate-900/10 hover:-translate-y-0.5 hover:bg-slate-800"
      : "cursor-not-allowed border border-white/10 bg-slate-800/90 shadow-slate-900/5",
    compact ? "px-5 py-3" : "px-6 py-4",
  ].join(" ");

  const content = (
    <>
      <img
        src={isGoogle ? "/google-play-logo.svg" : "/apple-logo.png"}
        alt=""
        className="h-8 w-8 shrink-0 object-contain"
        aria-hidden="true"
      />

      <span className="text-left leading-none">
        <span className="block text-[10px] font-semibold uppercase tracking-wide text-white/70">
          {isGoogle ? "Get it on" : "iPhone app"}
        </span>
        <span className="mt-1 block text-lg font-black">
          {isGoogle ? "Google Play" : "Coming Soon"}
        </span>
      </span>
    </>
  );

  if (!isAvailable) {
    return (
      <span
        className={className}
        aria-label="Renewables for iPhone is coming soon"
        aria-disabled="true"
      >
        {content}
      </span>
    );
  }

  return (
    <a
      href={href}
      className={className}
      aria-label="Get Renewables on Google Play"
    >
      {content}
    </a>
  );
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