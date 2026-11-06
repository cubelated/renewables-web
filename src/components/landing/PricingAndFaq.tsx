import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { faqs } from "../../content/faqs";
import { product } from "../../content/product";
import { CtaLink, FeaturePoint } from "./shared";

export function Pricing() {
  const { free, pro } = product.plans;
  return (
    <section id="pricing" className="section pricing-section" aria-labelledby="pricing-title" data-section-event="landing_pricing_view">
      <div className="container">
        <div className="section-heading centered">
          <p className="eyebrow">A little less life admin</p>
          <h2 id="pricing-title">Start free. Make room when you need it.</h2>
          <p>Scanning and renewal checklists are essentials. Both are included in Free.</p>
        </div>
        <div className="pricing-grid">
          <article className="plan-card" aria-labelledby="free-title">
            <span className="plan-label">For your essentials</span>
            <h3 id="free-title">Renewables Free</h3>
            <p className="plan-description">Everything you need to stay on top of essential deadlines.</p>
            <p className="plan-price">Free forever</p>
            <CtaLink destination="web" location="pricing-free" variant="secondary">Get Started Free</CtaLink>
            <ul className="plan-features">
              {[
                `${free.activeItems} active items`, `${free.reminderTimes} reminder times per item`, `${free.images} image per item`,
                "Document scanning", "Renewal checklists", "Country-specific templates",
                "Calendar and widgets on supported platforms", "Cloud synchronization",
              ].map((point) => <FeaturePoint key={point}>{point}</FeaturePoint>)}
            </ul>
            <p className="plan-note">Recurring renewals and CSV export require Pro.</p>
          </article>
          <article className="plan-card pro-card" aria-labelledby="pro-title">
            <span className="plan-label"><Sparkles size={14} aria-hidden="true" /> More flexibility</span>
            <h3 id="pro-title">Renewables Pro</h3>
            <p className="plan-description">More room, more reminders, and less repetitive work.</p>
            <p className="plan-price pro-price">{product.pricing.proLabel}</p>
            <CtaLink destination="play" location="pricing-pro" event="landing_pro_click">Explore Pro</CtaLink>
            <ul className="plan-features">
              {[
                "Unlimited active items", `${pro.reminderTimes} reminder times per item`, `${pro.images} images per item`,
                "Smart recurring renewals", "CSV export", "Everything in Free",
              ].map((point) => <FeaturePoint key={point}>{point}</FeaturePoint>)}
            </ul>
            <p className="plan-note">Open Account in the mobile app to explore Pro and current subscription options.</p>
          </article>
        </div>
        <p className="pricing-disclosure">{product.pricing.storeNote} Scanning and widgets require a supported mobile device; the iOS app is coming soon.</p>
      </div>
    </section>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="section" aria-labelledby="faq-title">
      <div className="container faq-layout">
        <div className="section-heading">
          <p className="eyebrow">A few useful answers</p>
          <h2 id="faq-title">Good to know.<br />Before you go.</h2>
          <p>More clarity. Fewer things to wonder about.</p>
          <a className="text-link" href="/support">Visit support <ArrowRight size={16} aria-hidden="true" /></a>
        </div>
        <div className="faq-list">
          {faqs.map(({ question, answer }, index) => (
            <details key={question} className="faq-item" name="landing-faq">
              <summary><span className="faq-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span>{question}</span><ChevronDown size={18} aria-hidden="true" /></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
