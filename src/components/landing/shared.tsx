import { Check, ChevronRight, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { product } from "../../content/product";
import { campaignUrl } from "../../lib/cta-links";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}
const searchSnapshot = () => window.location.search;
const serverSnapshot = () => "";

type CtaLinkProps = {
  destination: "web" | "play";
  location: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "light";
  event?: "landing_pro_click";
  className?: string;
  showArrow?: boolean;
};

export function CtaLink({ destination, location, children, variant = "primary", event, className, showArrow = true }: CtaLinkProps) {
  const search = useSyncExternalStore(subscribe, searchSnapshot, serverSnapshot);
  const url = destination === "web" ? product.webAppUrl : product.googlePlayUrl;
  return (
    <a
      href={campaignUrl(url, search)}
      className={className ?? `cta cta-${variant}`}
      data-cta-location={location}
      data-cta-event={event ?? (destination === "web" ? "landing_web_app_click" : "landing_google_play_click")}
      data-cta-destination={destination}
    >
      {children}{showArrow && <ChevronRight size={17} aria-hidden="true" />}
    </a>
  );
}

export function FeaturePoint({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3 font-semibold text-slate-700">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <Check size={14} strokeWidth={3} aria-hidden="true" />
      </span>
      <span>{children}</span>
    </li>
  );
}

export function Brand() {
  return (
    <a className="flex items-center gap-3" href="/" aria-label="Renewables home">
      <img src="/logo.webp" width="128" height="128" alt="" className="h-11 w-11 rounded-xl shadow-md shadow-blue-500/20" />
      <span className="hidden text-2xl font-black tracking-tight sm:inline">Renewables</span>
    </a>
  );
}

export function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <FeatureEyebrow icon={Sparkles}>{eyebrow}</FeatureEyebrow>
      <h2 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">{title}</h2>
      <p className="mt-4 text-lg leading-8 text-slate-600">{description}</p>
    </div>
  );
}

export function FeatureEyebrow({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-[#246df3]/10 px-4 py-2 text-sm font-black text-[#246df3]">
      <Icon size={16} aria-hidden="true" />{children}
    </div>
  );
}

export function FeatureScreenshot({ src, alt, width = 640, height = 1138 }: { src: string; alt: string; width?: number; height?: number }) {
  return (
    <div className="relative mx-auto flex w-full max-w-xl justify-center overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#e8f2ff] via-white to-[#eeeaff] p-8 shadow-2xl shadow-blue-500/10 sm:p-12">
      <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-12 h-56 w-56 rounded-full bg-violet-300/30 blur-3xl" />
      <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async"
        className="relative max-h-[640px] w-auto max-w-full rounded-[1.75rem] object-contain shadow-slate-900/15 transition duration-500 hover:scale-[1.015]" />
    </div>
  );
}
