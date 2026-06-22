export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#f7fbff] py-16">
      <div className="mx-auto max-w-4xl px-6">
        <a
          href="/"
          className="mb-8 inline-flex text-sm font-semibold text-[#246df3]"
        >
          ← Back to Renewly
        </a>

        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <h1 className="text-4xl font-black tracking-tight">
            Support
          </h1>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Need help with Renewly or want to request account deletion? Contact
            us using the information below.
          </p>

          <section className="mt-10">
            <h2 className="text-2xl font-bold">
              Account Deletion Request
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              You may request deletion of your Renewly account and associated
              data by sending an email to:
            </p>

            <p className="mt-4">
              <a
                href="mailto:cubelated@gmail.com?subject=Renewly%20Account%20Deletion%20Request"
                className="font-bold text-[#246df3] hover:underline"
              >
                cubelated@gmail.com
              </a>
            </p>

            <div className="mt-8 rounded-2xl bg-[#f7fbff] p-6">
              <h3 className="font-bold">
                Please include the following information:
              </h3>

              <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-600">
                <li>Your Renewly account email address</li>
                <li>A clear request to delete your account</li>
                <li>Any relevant details that help us identify your account</li>
              </ul>
            </div>

            <p className="mt-6 leading-7 text-slate-600">
              Once we receive your request, we will verify the account and
              process deletion of associated account data, renewal records,
              notification tokens, and related stored information.
            </p>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-bold">
              General Support
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              For bugs, questions, billing concerns, or other support requests,
              contact:
            </p>

            <p className="mt-4">
              <a
                href="mailto:cubelated@gmail.com?subject=Renewly%20Support%20Request"
                className="font-bold text-[#246df3] hover:underline"
              >
                cubelated@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}