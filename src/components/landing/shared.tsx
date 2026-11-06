import { ArrowUpRight, Check } from "lucide-react";
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
};

export function CtaLink({ destination, location, children, variant = "primary", event }: CtaLinkProps) {
  const search = useSyncExternalStore(subscribe, searchSnapshot, serverSnapshot);
  const url = destination === "web" ? product.webAppUrl : product.googlePlayUrl;
  return (
    <a
      href={campaignUrl(url, search)}
      className={`cta cta-${variant}`}
      data-cta-location={location}
      data-cta-event={event ?? (destination === "web" ? "landing_web_app_click" : "landing_google_play_click")}
      data-cta-destination={destination}
    >
      {children}<ArrowUpRight size={17} aria-hidden="true" />
    </a>
  );
}

export function FeaturePoint({ children }: { children: ReactNode }) {
  return <li className="feature-point"><Check size={18} aria-hidden="true" /><span>{children}</span></li>;
}

export function Brand() {
  return (
    <a className="brand" href="/" aria-label="Renewables home">
      <img src="/logo.webp" width="36" height="36" alt="" />
      <span>Renewables<span className="brand-dot">.</span></span>
    </a>
  );
}
