import {
  AlertCircle,
  ArrowLeft,
  Bug,
  CheckCircle2,
  HelpCircle,
  Mail,
  ShieldCheck,
  Trash2,
} from "lucide-react";

const SUPPORT_EMAIL = "cubelated@gmail.com";

export default function SupportPage() {
  const deletionMailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    "Renewables Account Deletion Request",
  )}&body=${encodeURIComponent(
    `Hello Renewables Support,

I would like to request deletion of my Renewables account and associated data.

Renewables account email:
Reason (optional):

I understand that this request will permanently delete my account data, renewal records, reminder settings, notification tokens, and related app data.

Thank you.`,
  )}`;

  const supportMailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    "Renewables Support Request",
  )}`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-100 py-16 text-slate-950">
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-40 h-[32rem] w-[32rem] rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <a
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#246df3] transition hover:opacity-80"
        >
          <ArrowLeft size={16} />
          Back to Renewables
        </a>

        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-xl shadow-blue-500/10 backdrop-blur sm:p-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#246df3]/10 px-4 py-2 text-sm font-bold text-[#246df3]">
              <HelpCircle size={16} />
              Renewables Support
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
              How can we help?
            </h1>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Contact Renewables support for account deletion, billing questions,
              bug reports, or general app support.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <SupportCard
              icon={<Trash2 size={26} />}
              title="Account Deletion Request"
              description="Request permanent deletion of your Renewables account and associated app data."
              buttonLabel="Request Account Deletion"
              href={deletionMailto}
              highlighted
            />

            <SupportCard
              icon={<Mail size={26} />}
              title="General Support"
              description="Get help with app usage, billing questions, subscriptions, or technical issues."
              buttonLabel="Contact Support"
              href={supportMailto}
            />
          </div>

          <section className="mt-12 rounded-[2rem] border border-slate-200 bg-slate-50/80 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#246df3]/10 text-[#246df3]">
                <ShieldCheck size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-black">
                  Account deletion details
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  When you request account deletion, Renewables will verify your
                  account and permanently delete associated account data,
                  renewal records, reminder settings, notification tokens, and
                  related application data.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <InfoItem
                    icon={<CheckCircle2 size={20} />}
                    title="What to include"
                    description="Your Renewables account email address and a clear request to delete your account."
                  />

                  <InfoItem
                    icon={<AlertCircle size={20} />}
                    title="Important"
                    description="Deletion is permanent and cannot be undone after processing."
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#246df3]/10 text-[#246df3]">
                <Bug size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-black">Reporting bugs</h2>

                <p className="mt-3 leading-7 text-slate-600">
                  For bug reports, please include your device model, operating
                  system version, Renewables app version, and a short description
                  of what happened.
                </p>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

type SupportCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
  highlighted?: boolean;
};

function SupportCard({
  icon,
  title,
  description,
  buttonLabel,
  href,
  highlighted = false,
}: SupportCardProps) {
  return (
    <div
      className={[
        "rounded-[2rem] border p-7 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl",
        highlighted
          ? "border-[#246df3]/20 bg-gradient-to-br from-[#246df3] to-[#7a5cff] text-white shadow-blue-500/20"
          : "border-slate-200 bg-white text-slate-950 shadow-blue-500/5",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-14 w-14 items-center justify-center rounded-2xl",
          highlighted
            ? "bg-white/15 text-white"
            : "bg-[#246df3]/10 text-[#246df3]",
        ].join(" ")}
      >
        {icon}
      </div>

      <h2 className="mt-6 text-2xl font-black">{title}</h2>

      <p
        className={[
          "mt-3 leading-7",
          highlighted ? "text-blue-100" : "text-slate-600",
        ].join(" ")}
      >
        {description}
      </p>

      <a
        href={href}
        className={[
          "mt-7 inline-flex rounded-2xl px-5 py-3 text-sm font-bold transition",
          highlighted
            ? "bg-white text-[#246df3] hover:bg-blue-50"
            : "bg-[#246df3] text-white hover:bg-[#1d5fd8]",
        ].join(" ")}
      >
        {buttonLabel}
      </a>
    </div>
  );
}

type InfoItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function InfoItem({ icon, title, description }: InfoItemProps) {
  return (
    <div className="rounded-2xl bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="text-[#246df3]">{icon}</div>
        <h3 className="font-black">{title}</h3>
      </div>

      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}