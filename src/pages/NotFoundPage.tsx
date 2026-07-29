export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7fbff] px-6 text-slate-950">
      <section className="max-w-xl text-center">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#246df3]">
          404 error
        </p>
        <h1 className="mt-4 text-5xl font-black tracking-tight">
          Page not found
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          This page does not exist. Return to Renewables to track expiry dates,
          renewals, and life admin reminders.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex rounded-xl bg-[#246df3] px-6 py-3 font-bold text-white transition hover:bg-[#195edb]"
        >
          Back to Renewables
        </a>
      </section>
    </main>
  );
}
