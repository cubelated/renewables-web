const GOOGLE_PLAY_URL = "#";
const APP_STORE_URL = "#";

const features = [
    {
        title: "Expiry Tracking",
        description: "Track passports, IDs, licenses, insurance, subscriptions, and renewals.",
    },
    {
        title: "Smart Reminders",
        description: "Get notified before important dates so nothing slips through.",
    },
    {
        title: "Calendar View",
        description: "See upcoming renewals and deadlines in a clean timeline.",
    },
];

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-[#f7fbff] text-slate-950">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                <a href="/" className="flex items-center gap-3">
                    <img
                        src="/logo.png"
                        alt="Renewly logo"
                        className="h-10 w-10 rounded-xl"
                    />
                    <span className="text-xl font-bold tracking-tight">Renewly</span>
                </a>

                <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
                    <a href="#features" className="hover:text-[#246df3]">Features</a>
                    <a href="/privacy" className="hover:text-[#246df3]">Privacy</a>
                </div>
            </nav>

            <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-2 lg:pt-24">
                <div>
                    <div className="inline-flex rounded-full border border-[#246df3]/20 bg-[#246df3]/10 px-4 py-2 text-sm font-semibold text-[#246df3]">
                        Life admin made simple
                    </div>

                    <h1 className="mt-8 max-w-3xl text-5xl font-black tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                        Never miss an expiry date again.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                        Renewly helps you track documents, renewals, subscriptions, and
                        important deadlines with reminders, categories, and calendar view.
                    </p>

                    <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                        <a
                            href={GOOGLE_PLAY_URL}
                            className="rounded-2xl bg-[#246df3] px-7 py-4 text-center font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-[#1d5fd8]"
                        >
                            Download on Google Play
                        </a>

                        <a
                            href={APP_STORE_URL}
                            className="rounded-2xl border border-slate-200 bg-white px-7 py-4 text-center font-bold text-slate-800 transition hover:border-[#246df3]/40 hover:text-[#246df3]"
                        >
                            App Store Coming Soon
                        </a>
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-md">
                    <div className="absolute inset-0 rounded-[3rem] bg-[#246df3] blur-3xl opacity-20" />

                    <div className="relative rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-2xl backdrop-blur">
                        <div className="rounded-[1.5rem] bg-gradient-to-br from-[#3bb7df] to-[#1d36a8] p-8 text-white">
                            <img
                                src="/logo.png"
                                alt="Renewly logo"
                                className="mx-auto h-28 w-28 rounded-3xl shadow-xl"
                            />

                            <div className="mt-10 rounded-2xl bg-white/15 p-5 backdrop-blur">
                                <p className="text-sm text-white/80">Upcoming renewal</p>
                                <h3 className="mt-2 text-2xl font-bold">Passport</h3>
                                <p className="mt-1 text-white/80">Expires in 30 days</p>
                            </div>

                            <div className="mt-4 rounded-2xl bg-white p-5 text-slate-900">
                                <p className="text-sm font-semibold text-[#246df3]">
                                    Reminder active
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Renewly will notify you before the deadline.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="border-y border-slate-200 bg-white px-6 py-20">
                <div className="mx-auto max-w-7xl">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl font-black tracking-tight">
                            Built for practical life admin.
                        </h2>
                        <p className="mt-4 text-slate-600">
                            Simple enough for daily use. Structured enough for important records.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="rounded-3xl border border-slate-200 bg-[#f7fbff] p-8"
                            >
                                <div className="mb-6 h-12 w-12 rounded-2xl bg-[#246df3]" />
                                <h3 className="text-xl font-bold">{feature.title}</h3>
                                <p className="mt-3 leading-7 text-slate-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-6 py-20">
                <div className="mx-auto max-w-4xl rounded-[2rem] bg-[#246df3] px-8 py-14 text-center text-white shadow-xl shadow-blue-500/20">
                    <h2 className="text-4xl font-black tracking-tight">
                        Start tracking what matters.
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-blue-100">
                        Keep your documents, renewals, and important dates organized in one app.
                    </p>

                    <a
                        href={GOOGLE_PLAY_URL}
                        className="mt-8 inline-flex rounded-2xl bg-white px-7 py-4 font-bold text-[#246df3] transition hover:bg-blue-50"
                    >
                        Download Renewly
                    </a>
                </div>
            </section>

            <footer className="border-t border-slate-200 bg-white px-6 py-8">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} Renewly. All rights reserved.
                    </p>

                    <div className="flex gap-6 text-sm font-medium text-slate-500">
                        <a href="/privacy" className="hover:text-[#246df3]">
                            Privacy Policy
                        </a>
                        <a href="/terms" className="hover:text-[#246df3]">
                            Terms
                        </a>
                        <a href="mailto:support@renewly.app" className="hover:text-[#246df3]">
                            Support
                        </a>
                    </div>
                </div>
            </footer>
        </main>
    );
}