import {
  ArrowRight, Bell, CalendarDays, Check, ClipboardCheck, CloudSync,
  FileDown, Fingerprint, Globe2, History, ListChecks, ScanLine, ShieldCheck,
  Smartphone, Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import Header from "../components/landing/Header";
import FeatureVideo from "../components/FeatureVideo";
import { ocrMedia } from "../content/media";
import { FAQ, Pricing } from "../components/landing/PricingAndFaq";
import { Brand, CtaLink, FeaturePoint } from "../components/landing/shared";
import { product, templateGroups } from "../content/product";

const steps = [
  { icon: ScanLine, title: "Scan or add", text: "Scan a document to find its expiry date, or add the details yourself." },
  { icon: Bell, title: "Stay reminded", text: "Choose when to receive notifications before important deadlines." },
  { icon: ClipboardCheck, title: "Prepare and renew", text: "Follow a renewal checklist, track your progress, and record your completed renewal." },
];

const supportingFeatures = [
  { icon: Bell, title: "Smart Reminders", text: "Choose when you want to be notified before important deadlines." },
  { icon: CalendarDays, title: "Calendar View", text: "See upcoming expiration dates together in one clear view." },
  { icon: Smartphone, title: "Home Screen Widgets", text: "Check upcoming and urgent items at a glance on supported devices. Android available; iOS coming soon." },
  { icon: CloudSync, title: "Cloud Sync", text: "Access your tracked items using the same account across supported platforms." },
  { icon: History, title: "Renewal History", text: "Keep a record of past renewals and your previous expiry dates." },
  { icon: FileDown, title: "CSV Export", text: "Export current item records in a spreadsheet-compatible format.", pro: true },
];

export default function LandingPage() {
  return (
    <div className="landing">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <HowItWorks />
        <DocumentScanning />
        <RenewalAssistant />
        <Templates />
        <SupportingFeatures />
        <Pricing />
        <FAQ />
        <DownloadCTA />
      </main>
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><span className="status-dot" />Your important dates, under control</p>
          <h1 id="hero-title">Scan your documents.<br />Track expiry dates.<br /><span className="gradient-text">Prepare for renewals.</span></h1>
          <p className="hero-description">Keep passports, permits, insurance, subscriptions, and other important deadlines organized with smart reminders and guided renewal checklists.</p>
          <div className="cta-row">
            <CtaLink destination="play" location="hero-play"><img src="/google-play-logo.svg" width="19" height="21" alt="" />Get Renewables</CtaLink>
            <CtaLink destination="web" location="hero-web" variant="secondary">Try the Web App</CtaLink>
          </div>
          <p className="hero-platforms">Android & Web available <span aria-hidden="true">·</span> iOS {product.iosStatus.toLowerCase()}</p>
          <div className="hero-benefits">
            <span><Check size={15} aria-hidden="true" /> Free to get started</span>
            <span><Fingerprint size={15} aria-hidden="true" /> On-device scanning</span>
          </div>
        </div>
        <figure className="hero-visual">
          <div className="hero-orbit" aria-hidden="true" />
          <span className="visual-label"><span /> A little more headspace.</span>
          <img className="hero-phone" src="/app-phone.webp" width="720" height="1280" fetchPriority="high"
            alt="Renewables dashboard showing an urgent vehicle deadline and upcoming insurance expiry" />
          <figcaption className="hero-caption"><ShieldCheck size={18} aria-hidden="true" /><span>Your deadlines.<br /><strong>One clear view.</strong></span></figcaption>
        </figure>
      </div>
      <div className="container hero-footnote"><span>For the dates that matter.</span><p>Passports <span> / </span> Permits <span> / </span> Insurance <span> / </span> Subscriptions <span> / </span> Warranties</p></div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="section how-section" aria-labelledby="how-title">
      <div className="container">
        <div className="section-heading centered">
          <p className="eyebrow">Scan → Track → Prepare → Renew</p>
          <h2 id="how-title">From a document to a reminder in three steps.</h2>
          <p>A simple routine for the important things you don’t want to leave until the last minute.</p>
        </div>
        <ol className="steps-grid">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="step-card">
              <div className="step-top"><span className="icon-tile"><Icon size={24} aria-hidden="true" /></span><span className="step-number">0{index + 1}</span></div>
              <h3>{title}</h3><p>{text}</p>
            </li>
          ))}
        </ol>
        <a className="text-link steps-link" href="#features">See what’s inside <ArrowRight size={16} aria-hidden="true" /></a>
      </div>
    </section>
  );
}

function Screenshot({ src, alt, caption }: { src: string; alt: string; caption: ReactNode }) {
  return (
    <figure className="feature-visual">
      <div className="screenshot-stage"><img src={src} alt={alt} width="700" height="1501" loading="lazy" decoding="async" /></div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function DocumentScanning() {
  return (
    <section id="features" className="section scanning-section" aria-labelledby="scan-title">
      <div className="container feature-layout">
        <div className="feature-copy">
          <p className="eyebrow"><ScanLine size={17} aria-hidden="true" /> Document scanning <span className="feature-badge">Free & Pro</span></p>
          <h2 id="scan-title">Scan your documents.<br /><span className="gradient-text">Save time.</span></h2>
          <p className="feature-description">Take a photo or choose an image. Renewables helps identify expiration dates, letting you review the details before saving.</p>
          <ul className="feature-points">
            <FeaturePoint>On-device document scanning and expiry-date detection.</FeaturePoint>
            <FeaturePoint>Manual review before saving, with editable details.</FeaturePoint>
            <FeaturePoint>Included in Free and Pro on supported Android and iOS devices.</FeaturePoint>
          </ul>
          <p className="feature-disclosure">Scanning works on supported Android and iOS devices, with iOS coming soon. Use manual entry in the web app.</p>
          <div className="cta-row scanning-actions">
            <CtaLink destination="play" location="ocr-video-play-store">Try Renewables Free</CtaLink>
            <CtaLink destination="web" location="ocr-video-web" variant="secondary">Use Web App</CtaLink>
          </div>
          <p className="feature-disclosure scanning-image-note">Attaching the image is optional: {product.plans.free.images} image per item on Free, {product.plans.pro.images} on Pro. The web app supports manual entry, not document scanning.</p>
          <a className="text-link" href="#faq">How scanning handles your documents <ArrowRight size={16} aria-hidden="true" /></a>
        </div>
        <FeatureVideo {...ocrMedia} />
      </div>
    </section>
  );
}

function RenewalAssistant() {
  return (
    <section id="renewal-assistant" className="section renewal-section" aria-labelledby="renewal-title">
      <div className="container feature-layout renewal-layout">
        <Screenshot src="/screenshot-renewal-checklist.webp" alt="Renewables passport renewal checklist showing two of six preparation steps completed, editable steps, and sources"
          caption="Actual Renewal Assistant screen. Your preparation, at your pace." />
        <div className="feature-copy">
          <p className="eyebrow"><ListChecks size={18} aria-hidden="true" /> Renewal Assistant <span className="feature-badge">Included in Free</span></p>
          <h2 id="renewal-title">Renewing is more<br />than remembering.</h2>
          <p className="feature-description">Prepare with guided checklists, follow your progress, and keep a record when the renewal is complete.</p>
          <ul className="feature-points">
            <FeaturePoint>Document-specific checklists, with steps you can edit.</FeaturePoint>
            <FeaturePoint>See your progress and pick up where you left off.</FeaturePoint>
            <FeaturePoint>Record completed renewals in your renewal history.</FeaturePoint>
          </ul>
          <div className="recurrence-note"><History size={21} aria-hidden="true" /><p><strong>Doing this again next year?</strong><br />Pro supports recurring renewals to help carry your tracking forward.</p></div>
          <p className="feature-disclosure">Checklists help you prepare. Follow the relevant authority’s official process to renew your document; Renewables does not submit applications.</p>
        </div>
      </div>
    </section>
  );
}

function Templates() {
  return (
    <section id="templates" className="section templates-section" aria-labelledby="templates-title">
      <div className="container">
        <div className="section-heading template-heading">
          <p className="eyebrow"><Globe2 size={17} aria-hidden="true" /> A useful starting point</p>
          <h2 id="templates-title">Prepared for the documents<br className="desktop-break" /> that matter to you.</h2>
          <p>Get started with templates for common documents, including location-specific examples and renewal guidance where available.</p>
        </div>
        <div className="templates-grid">
          {templateGroups.map(({ title, subtitle, items }, index) => (
            <article key={title} className="template-card">
              <div className="template-card-top"><Globe2 size={21} aria-hidden="true" /><span>{index === 0 ? "GENERAL" : index === 1 ? "TW" : "ID"}</span></div>
              <h3>{title}</h3><p className="template-subtitle">{subtitle}</p>
              <ul>{items.map((item) => <li key={item}><span aria-hidden="true">↗</span>{item}</li>)}</ul>
            </article>
          ))}
        </div>
        <p className="template-disclosure"><ShieldCheck size={19} aria-hidden="true" /><span>Selected examples, not comprehensive country coverage. Guidance is informational.<br />Requirements vary by authority and may change. Always confirm details with the relevant official source.</span></p>
      </div>
    </section>
  );
}

function SupportingFeatures() {
  return (
    <section className="section supporting-section" aria-labelledby="supporting-title">
      <div className="container">
        <div className="section-heading supporting-heading"><p className="eyebrow">The everyday details, covered</p><h2 id="supporting-title">A place for all your important dates.</h2><p>{product.description}</p></div>
        <div className="supporting-grid">
          {supportingFeatures.map(({ icon: Icon, title, text, pro }) => (
            <article key={title} className="supporting-card"><Icon size={23} aria-hidden="true" /><h3>{title}{pro && <span className="pro-badge">Pro</span>}</h3><p>{text}</p></article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DownloadCTA() {
  return (
    <section className="download-section" aria-labelledby="download-title">
      <div className="container"><div className="download-panel">
        <div><p className="eyebrow"><Sparkles size={17} aria-hidden="true" /> One less thing to keep in your head</p><h2 id="download-title">Make room for life.<br />Keep track with Renewables.</h2><p>Start with your next important date. Build a calmer routine from there.</p></div>
        <div className="download-actions"><CtaLink destination="web" location="footer-web" variant="light">Start Tracking for Free</CtaLink><CtaLink destination="play" location="footer-play" variant="secondary">Get Renewables on Google Play</CtaLink><span>Android & Web available · iOS coming soon</span></div>
      </div></div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer"><div className="container">
      <div className="footer-top"><div><Brand /><p>Scan. Track. Prepare. Renew.</p></div><nav aria-label="Resources"><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Service</a><a href="/support">Support</a></nav></div>
      <div className="footer-bottom"><span>© {new Date().getUTCFullYear()} Renewables by Cubelated.</span><span>A little less life admin.</span></div>
    </div></footer>
  );
}
