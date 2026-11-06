import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Brand, CtaLink } from "./shared";

const navigation = [
  ["Features", "#features"], ["How It Works", "#how-it-works"],
  ["Pricing", "#pricing"], ["FAQ", "#faq"],
  ["Privacy", "/privacy"], ["Support", "/support"],
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function dismiss(event: PointerEvent) {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    }
    function resize() {
      if (window.innerWidth >= 1024) setOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    window.addEventListener("resize", resize);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
      window.removeEventListener("resize", resize);
    };
  }, [open]);

  return (
    <header className="relative z-20" ref={header} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
    }}>
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-6">
        <Brand />
        <nav aria-label="Main navigation" className="hidden items-center gap-5 text-sm font-semibold text-slate-700 lg:flex xl:gap-7">
          {navigation.map(([label, href]) => <a key={href} href={href} className="py-2 transition hover:text-[#246df3]">{label}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <CtaLink destination="web" location="header" className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#246df3] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition duration-300 hover:-translate-y-0.5 hover:bg-[#195edb] sm:px-5">Get Started</CtaLink>
          <button ref={toggle} className="menu-toggle flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-blue-100 bg-white/80 text-slate-900 lg:hidden" aria-expanded={open} aria-controls="mobile-navigation"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"} onClick={() => setOpen(!open)}>
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="absolute left-6 right-6 top-full rounded-2xl border border-blue-100 bg-white p-3 shadow-xl shadow-blue-500/10 lg:hidden" hidden={!open}>
          {navigation.map(([label, href]) => <a key={href} href={href} className="block rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-blue-50" onClick={() => setOpen(false)}>{label}</a>)}
        </nav>
      </div>
    </header>
  );
}
