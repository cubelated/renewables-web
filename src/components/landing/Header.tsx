import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Brand, CtaLink } from "./shared";

const navigation = [
  ["Features", "#features"], ["How It Works", "#how-it-works"],
  ["Pricing", "#pricing"], ["FAQ", "#faq"],
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
      if (window.innerWidth >= 900) setOpen(false);
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
    <header className="site-header" ref={header} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
    }}>
      <div className="container header-inner">
        <Brand />
        <nav aria-label="Main navigation" className="desktop-nav">
          {navigation.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <CtaLink destination="web" location="header">Get Started</CtaLink>
          <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="mobile-navigation"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"} onClick={() => setOpen(!open)}>
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="mobile-nav" hidden={!open}>
          {navigation.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
        </nav>
      </div>
    </header>
  );
}
