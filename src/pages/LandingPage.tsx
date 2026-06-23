import type React from "react";
import {
    Bell,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Cloud,
    FileText,
    ShieldCheck,
    Sparkles,
} from "lucide-react";

const GOOGLE_PLAY_URL = "#";
const APP_STORE_URL = "#";

const features = [
    {
        icon: Clock3,
        title: "Expiry Tracking",
        description:
            "Track passports, IDs, licenses, insurance policies, subscriptions, warranties, and renewals.",
    },
    {
        icon: Bell,
        title: "Smart Reminders",
        description:
            "Get timely reminders before important dates so renewals do not slip through.",
    },
    {
        icon: CalendarDays,
        title: "Calendar View",
        description:
            "See upcoming renewals and deadlines in a clean, easy-to-scan timeline.",
    },
];

const benefits = [
    {
        icon: Bell,
        title: "Smart reminders",
    },
    {
        icon: CalendarDays,
        title: "Calendar view",
    },
    {
        icon: ShieldCheck,
        title: "Organized records",
    },
    {
        icon: Cloud,
        title: "Cloud sync",
    },
];

const screenshots = [
    {
        src: "/screenshot-template.jpg",
        alt: "Renewly template screen",
        title: "Templates",
    },
    {
        src: "/screenshot-category.jpg",
        alt: "Renewly category screen",
        title: "Categories",
    },
    {
        src: "/screenshot-calendar.jpg",
        alt: "Renewly calendar screen",
        title: "Calendar",
    },
];

export default function LandingPage() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#f7fbff] text-slate-950">
            <BackgroundDecor />

            <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
                <a href="/" className="flex items-center gap-3" aria-label="Renewly home">
                    <img
                        src="/logo.png"
                        alt="Renewly logo"
                        className="h-11 w-11 rounded-xl shadow-md shadow-blue-500/20"
                    />
                    <span className="text-2xl font-black tracking-tight">Renewly</span>
                </a>

                <div className="hidden items-center gap-8 text-sm font-semibold text-slate-700 md:flex">
                    <a href="#features" className="transition hover:text-[#246df3]">
                        Features
                    </a>
                    <a href="#screenshots" className="transition hover:text-[#246df3]">
                        Screenshots
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
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#246df3]/15 bg-white/75 px-4 py-2 text-sm font-black text-[#246df3] shadow-sm backdrop-blur">
                        <Sparkles size={16} />
                        Expiry dates made easy
                    </div>

                    <h1 className="mt-8 max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                        Never miss an{" "}
                        <span className="bg-gradient-to-r from-[#246df3] via-[#4458ff] to-[#7a5cff] bg-clip-text text-transparent">
                            expiry date
                        </span>{" "}
                        again.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                        Renewly helps you manage passports, IDs, licenses, subscriptions,
                        insurance policies, warranties, and other important deadlines from
                        one simple dashboard.
                    </p>

                    <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                        <StoreButton type="google" href={GOOGLE_PLAY_URL} />
                        <StoreButton type="apple" href={APP_STORE_URL} />
                    </div>

                    <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {benefits.map((benefit) => {
                            const Icon = benefit.icon;

                            return (
                                <div
                                    key={benefit.title}
                                    className="rounded-2xl border border-white/80 bg-white/70 p-4 shadow-lg shadow-blue-500/5 backdrop-blur"
                                >
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#246df3]/10 text-[#246df3]">
                                        <Icon size={21} />
                                    </div>
                                    <p className="mt-3 text-sm font-black leading-5 text-slate-800">
                                        {benefit.title}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="relative mx-auto flex min-h-[520px] w-full max-w-xl items-center justify-center lg:justify-end">
                    {/* Soft outer glow */}
                    <div className="absolute h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-[#246df3]/25 via-[#7a5cff]/20 to-cyan-300/20 blur-3xl" />

                    {/* Decorative glass panel */}
                    <div className="absolute right-4 top-10 hidden h-[420px] w-[360px] rotate-6 rounded-[3rem] border border-white/70 bg-white/35 shadow-2xl shadow-blue-500/10 backdrop-blur-xl lg:block" />

                    {/* Gradient card behind phone */}
                    <div className="absolute h-[430px] w-[340px] rotate-[-7deg] rounded-[3rem] bg-gradient-to-br from-[#246df3] via-[#4458ff] to-[#8b5cf6] opacity-90 shadow-2xl shadow-blue-500/30" />

                    {/* Pattern overlay */}
                    <div className="absolute h-[430px] w-[340px] rotate-[-7deg] rounded-[3rem] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.35)_1px,transparent_0)] bg-[length:22px_22px] opacity-40" />

                    {/* Floating mini cards */}
                    <div className="absolute left-2 top-24 hidden rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-xl shadow-blue-500/10 backdrop-blur-xl lg:block">
                        <p className="text-xs font-bold text-slate-500">Next renewal</p>
                        <p className="mt-1 text-sm font-black text-slate-900">Passport · 30 days</p>
                    </div>

                    <div className="absolute bottom-24 right-0 hidden rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-xl shadow-blue-500/10 backdrop-blur-xl lg:block">
                        <p className="text-xs font-bold text-slate-500">Reminder</p>
                        <p className="mt-1 text-sm font-black text-[#246df3]">Active</p>
                    </div>

                    {/* Phone image */}
                    <img
                        src="/app-phone.png"
                        alt="Renewly app preview on phone"
                        className="relative z-10 w-full max-w-[430px] drop-shadow-[0_45px_90px_rgba(30,64,175,0.45)] transition duration-500 hover:scale-[1.015]"
                    />
                </div>
            </section>

            <section
                id="features"
                className="relative z-10 border-y border-white/80 bg-white/65 px-6 py-24 backdrop-blur"
            >
                <div className="mx-auto max-w-7xl">
                    <SectionHeader
                        eyebrow="Everything you need"
                        title="Built for practical life admin."
                        description="Simple enough for daily use. Structured enough for important records."
                    />

                    <div className="mt-16 grid gap-6 md:grid-cols-3">
                        {features.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <article
                                    key={feature.title}
                                    className="group rounded-[2rem] border border-white/80 bg-white/80 p-8 shadow-xl shadow-blue-500/5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10"
                                >
                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#246df3] to-[#7a5cff] text-white shadow-lg shadow-blue-500/25">
                                        <Icon size={30} />
                                    </div>

                                    <h3 className="text-xl font-black">{feature.title}</h3>

                                    <p className="mt-3 leading-7 text-slate-600">
                                        {feature.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section id="screenshots" className="relative z-10 px-6 py-24">
                <div className="mx-auto max-w-7xl">
                    <SectionHeader
                        eyebrow="App Preview"
                        title="Designed for everyday life."
                        description="Quickly view urgent items, upcoming renewals, and important deadlines."
                    />

                    <div className="mt-16 grid gap-8 md:grid-cols-3">
                        {screenshots.map((screenshot) => (
                            <article
                                key={screenshot.src}
                                className="rounded-[2rem] border border-white/80 bg-white/75 p-4 shadow-2xl shadow-blue-500/10 backdrop-blur"
                            >
                                <img
                                    src={screenshot.src}
                                    alt={screenshot.alt}
                                    className="aspect-[9/19] w-full rounded-[1.5rem] object-cover"
                                />
                                <p className="px-2 pt-4 text-center text-sm font-black text-slate-700">
                                    {screenshot.title}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative z-10 px-6 pb-24">
                <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#0f46d9] via-[#246df3] to-[#7a5cff] p-8 text-white shadow-2xl shadow-blue-500/25 sm:p-10">
                    <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/logo.png"
                                    alt="Renewly logo"
                                    className="h-14 w-14 rounded-2xl shadow-xl shadow-blue-950/20"
                                />
                                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                                    Start tracking what matters.
                                </h2>
                            </div>

                            <p className="mt-4 text-blue-100">
                                Keep your documents, renewals, and important dates organized in
                                one simple app.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <StoreButton type="google" href={GOOGLE_PLAY_URL} compact />
                            <StoreButton type="apple" href={APP_STORE_URL} compact />
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
                                alt="Renewly logo"
                                className="h-10 w-10 rounded-xl"
                            />
                            <span className="text-xl font-black">Renewly</span>
                        </div>

                        <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">
                            A simple expiry tracker for documents, renewals, subscriptions,
                            and important deadlines.
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
                    © {new Date().getFullYear()} Renewly. All rights reserved.
                </div>
            </footer>
        </main>
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

type SectionHeaderProps = {
    eyebrow: string;
    title: string;
    description: string;
};

function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
    return (
        <div className="mx-auto max-w-3xl text-center">
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

type StoreButtonProps = {
    type: "google" | "apple";
    href: string;
    compact?: boolean;
};

function StoreButton({ type, href, compact = false }: StoreButtonProps) {
    const isGoogle = type === "google";

    return (
        <a
            href={href}
            className={[
                "inline-flex items-center justify-center gap-3 rounded-2xl bg-slate-950 text-white shadow-xl shadow-slate-900/10 transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-[#246df3]/25",
                compact ? "px-5 py-3" : "px-6 py-4",
            ].join(" ")}
            aria-label={isGoogle ? "Get it on Google Play" : "Download on the App Store"}
        >
            <img
                src={isGoogle ? "/google-play-logo.svg" : "/apple-logo.png"}
                alt=""
                className="h-8 w-8 shrink-0 object-contain"
                aria-hidden="true"
            />

            <span className="text-left leading-none">
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-white/70">
                    {isGoogle ? "Get it on" : "Download on the"}
                </span>
                <span className="mt-1 block text-lg font-black">
                    {isGoogle ? "Google Play" : "App Store"}
                </span>
            </span>
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