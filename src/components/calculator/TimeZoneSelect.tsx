import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe2 } from "lucide-react";

type ZoneOption = { value: string; label: string };
export default function TimeZoneSelect({ value, options, label, searchLabel, emptyLabel, onChange }: {
  value: string; options: ZoneOption[]; label: string; searchLabel: string; emptyLabel: string; onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const normalize = (text: string) => text.toLowerCase().replace(/_/g, " ");
  const filtered = options.filter((option) => normalize(option.label).includes(normalize(query.trim())));
  const active = Math.min(activeIndex, filtered.length - 1);
  const selected = options.find((option) => option.value === value)?.label ?? value;
  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  useEffect(() => {
    if (open) container.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [open, active, query]);
  function show() {
    setQuery(""); setActiveIndex(Math.max(0, options.findIndex((option) => option.value === value))); setOpen(true);
  }
  function choose(option: ZoneOption) { onChange(option.value); setOpen(false); setQuery(""); }

  return <div className="calc-field calc-zone" ref={container} onBlur={(event) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
  }}>
    <label className="calc-icon-label" htmlFor="calc-zone"><Globe2 size={15} aria-hidden="true" /><span>{label}</span></label>
    <div className="calc-zone-control">
      <input id="calc-zone" ref={input} type="text" role="combobox" aria-autocomplete="list"
        aria-expanded={open} aria-controls="calc-zone-options" aria-describedby="zone-hint"
        aria-activedescendant={open && active >= 0 ? `calc-zone-option-${active}` : undefined}
        value={open ? query : selected} placeholder={open ? searchLabel : selected} autoComplete="off" spellCheck={false}
        onFocus={show} onClick={() => { if (!open) show(); }}
        onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); setOpen(true); }}
        onKeyDown={(event) => {
          if (event.key === "Escape") { event.preventDefault(); setOpen(false); }
          else if (event.key === "Tab") setOpen(false);
          else if (event.key === "Enter") {
            event.preventDefault();
            if (open && filtered[active]) choose(filtered[active]); else if (!open) show();
          } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) show();
            else setActiveIndex(Math.max(0, Math.min(filtered.length - 1, active + (event.key === "ArrowDown" ? 1 : -1))));
          }
        }} />
      <button type="button" tabIndex={-1} className="calc-zone-toggle" aria-label={label} aria-expanded={open} aria-controls="calc-zone-options"
        onPointerDown={(event) => event.preventDefault()} onClick={() => { input.current?.focus(); if (open) setOpen(false); else show(); }}>
        <ChevronDown size={17} aria-hidden="true" />
      </button>
      {open && <div id="calc-zone-options" className="calc-zone-options" role="listbox" aria-label={label}>
        {filtered.map((option, index) => <div key={option.value} id={`calc-zone-option-${index}`} role="option"
          aria-selected={option.value === value} data-value={option.value} data-active={index === active}
          onPointerDown={(event) => event.preventDefault()} onClick={() => choose(option)}>
          <span>{option.label}</span>{option.value === value && <Check size={15} aria-hidden="true" />}
        </div>)}
        {!filtered.length && <p className="calc-zone-empty" role="status">{emptyLabel}</p>}
      </div>}
    </div>
  </div>;
}
