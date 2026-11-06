# Landing refresh: product evidence and operations

For the subsequent OCR demonstration integration, media inspection, delivery, and current checks, see [OCR video integration](ocr-video-integration.md).

## Scope and architecture

The design was subsequently restored to the original layout from `1910e81`, following the owner's feedback. The original pale background, large bold typography, layered hero screenshot, rounded translucent cards, alternating feature sections, widget/cloud illustrations, dark blue/violet pricing band, FAQ cards, download panel, and footer are retained. OCR video, Renewal Assistant, selected country templates, accurate Free/Pro comparisons, and updated descriptions use that existing visual language. Continuous animations and observer-dependent content hiding remain removed.

Implemented the Scan → Track → Prepare → Renew story, accessible navigation, authentic hero/scanning/checklist images, selected country templates, balanced Free/Pro cards, 11 FAQs, and a final download CTA. Blue/indigo/violet, logo, existing dependencies, Worker API, legal content, and public route names are retained. No deployment, app/database/RevenueCat changes, new billing, analytics service, or tracking pixel was performed.

The merged package scripts had dropped SSR/prerendering from the production build. Cloudflare's `404-page` routing requires generated files such as `dist/terms/index.html`; a client-only build does not produce them. `npm run build` now includes SSR and prerendering again. Both `check` and manual `deploy` validate the generated pages, including their actual legal-page headings, before proceeding. The Terms text itself is unchanged.

The starting local checkout (`d337032`) predates the upstream prerender setup. The current upstream `cubelated/renewables-web` versions of `App`, hydration entry, `entry-server`, `seo`, prerender/validation scripts, 404 page, robots, sitemap, and Worker asset routing were inspected and restored locally, then adapted for the refresh. This keeps the upstream React SSR-to-static HTML architecture and Hono Worker, rather than introducing a different hosting system. Legal page bodies are unchanged.

## Product facts checked (2026-11-06, Asia/Taipei)

- [Google Play listing](https://play.google.com/store/apps/details?id=com.cubelated.renewly) identifies Renewables by Cubelated, package `com.cubelated.renewly`. All Play CTAs use this URL.
- Web app: <https://app.renewables.cubelated.com/>. No inferred hostname or nonexistent billing route.
- No matching public Cubelated App Store listing was verified. The existing site's iOS coming-soon status is retained without a release date, App Store link, or inactive download button. iOS code support is not treated as proof of a public release.
- [App template catalog](https://github.com/cubelated/renewables/blob/main/lib/items/add/template/class.dart): general passport, visa, work permit, driver license, insurance and vehicle templates; Taiwan ARC and Employment Gold Card; Indonesia passport, SKCK, annual PKB/STNK validation, and a separate five-year STNK renewal. General work permit is not advertised as exclusively Taiwan-specific. Coverage is explicitly selected examples.
- `lib/services/ocr/ocr_service_native.dart` and `ocr_service_stub.dart` in the sibling application checkout confirm native Android/iOS recognition and unsupported web scanning. Recognition is on-device; saving optional attachments uses cloud storage. The supplied screenshots corroborate the review and checklist flows.
- `lib/items/renewal_assistant`, `lib/plans/guard.dart`, `lib/account/export`, and `docs/subscription-sync.md` were inspected for editable checklist progress, recurrence restrictions, current-record CSV export, and cancellation vs entitlement expiry. No broad claim that CSV is a full backup is made.
- The brief's authoritative live limits are centralized in `src/content/product.ts`: Free 10 active / 2 reminder times per item / 1 image per item; Pro unlimited active / 5 reminder times per item / 5 images per item. OCR and checklists are Free. Recurrence and CSV require Pro. No collaboration is advertised.
- [Application plan model](https://github.com/cubelated/renewables/blob/main/lib/plans/class.dart) contains `NT$29` as display copy, but this is not a confirmed current store product price. `docs/apple-subscriptions.md` says localized purchasable prices come from store/RevenueCat offerings. Neither monthly nor annual price was independently verified against a current store product. Both numbers are deliberately omitted; `product.pricing` is the single marketing price-copy source. Obtain a current store product confirmation before adding any number, period, or currency.

## SEO and performance

`src/seo.ts` supplies the landing title/description, canonical URLs, social metadata, SoftwareApplication features, and FAQPage JSON-LD. FAQ JSON-LD uses the same answers as the visible page. No invented ratings, reviews, Pro prices, or released iOS claim. The build writes real HTML for `/`, `/privacy`, `/terms`, `/support`, and `404.html`; the Worker serves static output with upstream `404-page` and `drop-trailing-slash` routing.

Optimized screenshot payloads, fixed intrinsic image dimensions, high-priority eager hero, lazy feature screenshots, local system fonts, and no new dependencies. Large continuously moving shapes and observer-dependent hiding were removed. Reduced motion disables smooth scrolling/transitions. The page remains readable without JavaScript. Browser dark preference retains the intentional light design, with the original dark pricing feature band.

## Conversion preparation (no collection enabled)

`CtaLink` supplies `data-cta-location`, `data-cta-destination`, and `data-cta-event`. Static attributes identify future events but do not send them anywhere.

| Event | Locations / trigger |
| --- | --- |
| `landing_google_play_click` | `hero-play`, `ocr-video-play-store`, `footer-play` |
| `landing_web_app_click` | `header`, `hero-web`, `ocr-video-web`, `pricing-free`, `footer-web` |
| `landing_pro_click` | `pricing-pro`; Google Play destination, purchase in mobile app |
| `landing_pricing_view` | `#pricing` has `data-section-event`; future observer should count once per visit |

Future implementation should use a reviewed first-party aggregate endpoint, minimal event/location fields, no account/document data, no persistent cross-site ID, limited retention, and a privacy notice appropriate to the final design. No first-party CTA measurement was found in the original site, so no endpoint or listener was silently added.

`src/lib/cta-links.ts` forwards only `utm_source`, `utm_medium`, `utm_campaign`, `utm_id`, `utm_term`, `utm_content`, restricted to 1–100 ASCII letters/digits or `_.~-`. Other query parameters and fragments are not forwarded. Email addresses, URLs, control characters, and long values are dropped. Web receives campaign parameters directly; Google Play receives an encoded install referrer with its package ID preserved. Baseline links work before hydration and without JavaScript. Use campaign tags for campaign identifiers only, never personal information.

## Manual deployment

From this repository, with Node 24+ (the attribution tests use native TypeScript support):

```powershell
npm ci
npm run lint
npm test
npm run build
npm run check
```

Review the generated `dist/index.html` and legal pages. Preview with `npm run preview`. Confirm live store availability/prices if editing plan copy, and review [media inventory](landing-media-assets.md) before replacing screenshots.

Only when ready to publish, authenticate to the intended Cloudflare account and run:

```powershell
npx wrangler login
npm run deploy
```

`npm run check` performs a dry run only. `npm run deploy` publishes the existing `renewables-web` Worker and `dist` assets using `wrangler.json`; no Sites hosting project or new service is needed. Verify `/`, `/privacy`, `/terms`, `/support`, `/robots.txt`, `/sitemap.xml`, an unknown route (404), navigation, and the two external destinations after a manual deployment.

Both scripts select `wrangler.json` explicitly, so an old ignored `.wrangler/deploy/config.json` from a previous toolchain cannot redirect publication to an unrelated/missing build. In a restricted workspace, set `$env:WRANGLER_LOG_PATH = Join-Path (Get-Location) '.wrangler/logs'` if Wrangler cannot write its global log directory.

## Changed files

- Page and UI: `src/pages/LandingPage.tsx`, `src/components/landing/Header.tsx`, `src/components/landing/ProductHighlights.tsx`, `src/components/landing/PricingAndFaq.tsx`, `src/components/landing/shared.tsx`, `src/react-app/index.css`.
- Shared product and attribution: `src/content/product.ts`, `src/content/faqs.ts`, `src/lib/cta-links.ts`, `scripts/cta-links.test.mjs`.
- Prerendering and SEO (restored from upstream, then adapted): `src/seo.ts`, `src/react-app/App.tsx`, `src/react-app/main.tsx`, `src/react-app/entry-server.tsx`, `src/pages/NotFoundPage.tsx`, `scripts/prerender.mjs`, `scripts/validate-seo.mjs`, `index.html`, `public/robots.txt`, `public/sitemap.xml`.
- Build and hosting: `package.json`, `wrangler.json`, `eslint.config.js`, `.gitignore`. Dependency versions and lockfile are unchanged.
- Media: `public/app-phone.webp`, `public/logo.webp`, `public/screenshot-ocr-review.webp`, `public/screenshot-renewal-checklist.webp`, `public/screenshot-template.webp`, `public/screenshot-calendar.webp`, `public/social-preview.png`.
- Documentation: `README.md`, `docs/landing-refresh.md`, `docs/landing-media-assets.md`.

## Validation results

### Original-design restoration and Terms fix

- `npm ci`, `npm run lint`, `npm test`, `npm run build`, and `npm run check` passed. All 20 current tests passed. Lint has only the two existing generated-type warnings. Check includes five-page SEO validation and a deployment dry run; no deployment occurred.
- Current client bundle: 265.36 KB (79.75 KB gzip); CSS: 67.60 KB (11.33 KB gzip). No dependency changes. These are build sizes, not a production performance score.
- Local Cloudflare routing returned 200 for home, Terms, Privacy, Support, and the existing API, with 404 for an unknown route. The Terms page rendered its own heading and canonical at 320, 375, 768, and 1440 px. Trailing-slash access, the footer Terms link, page refresh, and Back to Home passed.
- Headless Chrome passed the four landing widths, all 15 image elements, keyboard navigation and FAQ interaction, section anchors, campaign filtering, reduced motion, dark preference, and JavaScript-disabled rendering. No horizontal overflow, browser exceptions, failed asset requests, or measured initial layout shifts. The primary hero CTA fits the checked mobile viewports.
- OCR playback passed at all four widths: poster, zero MP4 requests before interaction, keyboard play/pause, native controls, seeking, replay, off-screen/hidden-page pause, static error fallback, and no-JavaScript link. Video MIME, full/partial byte responses, HEAD, and invalid range status were verified through the local Worker.
- The local Worker smoke checks used the already-installed compatible Wrangler 4.156.1 executable from the sibling app. The website's pinned dependencies and compatibility date remain unchanged. No real-device Android/iOS Safari, production, or throttled field-performance testing was performed.
- Review artifacts: `.qa/restored-landing-{320,375,768,1440}.png`, `.qa/restored-terms-{320,375,768,1440}.png`, feature screenshots, and `.qa/restored-design-results.json`. Requested promotional poster is still missing; the genuine scan-review screenshot remains the fallback, as documented in the media inventory.

### Initial refresh (before restoration)

- `npm ci`: passed; no dependency or lockfile changes.
- `npm run lint`: passed with zero errors and two unused-disable warnings in the unchanged generated `worker-configuration.d.ts`.
- `npm test`: all five campaign-link tests passed, including Play referrer encoding, approved destinations, and rejection of unrelated/sensitive query parameters.
- `npm run build`: passed; client bundle ~246.6 KB (~76.0 KB gzip), CSS ~57.6 KB (~11.0 KB gzip). These are local build sizes, not measured production transfer or field performance.
- `npm run check`: passed, including prerender build, SEO validation for five pages, and `wrangler deploy --dry-run --config wrangler.json`. Nothing was deployed. Initial attempts found a stale ignored Wrangler redirect and a global log-directory write restriction; explicit config selection and workspace-local logs resolved those checks.
- Headless Chrome against the final built HTML: passed at 320 × 640, 375 × 812, 768 × 900, and 1440 × 900. Confirmed no horizontal overflow, six successfully loaded image elements, one h1, 11 FAQs, live CTA destinations with campaign filtering, header-safe anchor positions, Enter/Tab/Escape mobile navigation and focus restoration, link-triggered menu closure, and keyboard FAQ open/close. Screenshots were visually inspected for the four widths and scanning, checklist, and pricing presentations.
- Reduced-motion, dark browser preference (intentional light page), and JavaScript-disabled content checks passed. No browser exceptions or failed asset requests. Local unthrottled initial-load CLS was zero at all four widths; this is not a Lighthouse score or production Core Web Vitals guarantee.
- Existing privacy, terms, and support pages passed browser heading, canonical, and overflow checks at 320 px. Their page bodies remain unchanged.
- `git diff --check`: passed.
- An additional `wrangler dev --local` runtime smoke check could not start: the pinned local workerd binary supports compatibility dates only through `2026-05-11`, while the existing project uses `2026-06-22`. The production compatibility date and pinned packages were preserved. Exact-runtime route/API smoke testing remains for an environment with a compatible Workers runtime; static routing settings were validated by the required deployment dry run and generated-page checks.

Local review artifacts are ignored under `.qa/`: `landing-320.png`, `landing-375.png`, `landing-768.png`, `landing-1440.png`, `desktop-features.png`, `desktop-renewal-assistant.png`, `desktop-pricing.png`, and `browser-results.json`. Browser checks used a local static preview, not production or an authenticated application session. No real-device iOS/Android or throttled field-performance test was performed.
