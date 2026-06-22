// src/components/LegalLayout.tsx

type Props = {
    title: string;
    updatedAt: string;
    children: React.ReactNode;
};

export default function LegalLayout({
    title,
    updatedAt,
    children,
}: Props) {
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
                        {title}
                    </h1>

                    <p className="mt-3 text-sm text-slate-500">
                        Last Updated: {updatedAt}
                    </p>

                    <hr className="my-8" />

                    <div className="prose prose-slate max-w-none">
                        {children}
                    </div>
                </div>
            </div>
        </main>
    );
}