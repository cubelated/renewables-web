import { useEffect, useRef, useState } from "react";
import { Check, Languages } from "lucide-react";
import type { CalculatorLanguage } from "../../content/expiry-calculator";

const languages: { value: CalculatorLanguage; label: string }[] = [
  { value: "en", label: "English" },
  { value: "zh-TW", label: "繁體中文" },
  { value: "id-ID", label: "Bahasa Indonesia" },
];

export default function LanguageMenu({ label, value, onChange }: {
  label: string; value: CalculatorLanguage; onChange: (value: CalculatorLanguage) => void;
}) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const initialFocus = useRef(0);
  useEffect(() => {
    if (!open) return;
    container.current?.querySelectorAll<HTMLButtonElement>("[role=menuitemradio]")[initialFocus.current]?.focus();
    function outside(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  function show(index: number) { initialFocus.current = index; setOpen(true); }
  function close() { setOpen(false); trigger.current?.focus(); }

  return <div className="calc-language-menu" ref={container} onBlur={(event) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
  }}>
    <button id="calc-language" type="button" className="calc-icon-button" ref={trigger}
      aria-label={label} title={label} aria-haspopup="menu" aria-expanded={open} aria-controls="calc-language-options"
      onClick={() => open ? close() : show(languages.findIndex((language) => language.value === value))}
      onKeyDown={(event) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault(); show(event.key === "ArrowDown" ? 0 : languages.length - 1);
        }
      }}><Languages size={20} aria-hidden="true" /></button>
    {open && <div id="calc-language-options" className="calc-language-options" role="menu" aria-label={label}
      onKeyDown={(event) => {
        const options = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("[role=menuitemradio]")];
        const index = options.indexOf(document.activeElement as HTMLButtonElement);
        if (event.key === "Escape") { event.preventDefault(); close(); }
        else if (event.key === "Tab") close();
        else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + options.length) % options.length;
          options[next]?.focus();
        }
      }}>
      {languages.map((language) => <button key={language.value} type="button" role="menuitemradio"
        aria-checked={language.value === value} data-language={language.value} lang={language.value}
        onClick={() => { onChange(language.value); close(); }}>
        <span>{language.label}</span>{language.value === value && <Check size={16} aria-hidden="true" />}
      </button>)}
    </div>}
  </div>;
}
