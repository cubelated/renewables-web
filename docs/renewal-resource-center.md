# Renewal resource center

This is a public, curated preparation library, not an immigration eligibility
engine or an application service. The user approved production deployment of the
completed discovery update on 2026-11-13; see the deployment record in
[Google and AI search discovery](search-and-ai-discovery.md).

## Architecture and routes

The existing React 19 / TypeScript / Vite site remains in place. Local typed
objects in `src/content/resources/` supply both the browser finder and the
prerendered pages. No CMS, database, account, API, or search dependency is added.

The current catalog has **52 logical published guides**, 55 guide URLs including
reviewed translations, and three localized directory URLs. The
[complete guide and source inventory](renewal-resource-expanded-inventory.md)
lists every route, applicability predicate, status scope, review date, and source.
The routes below show the original three guides and their reviewed translations;
the expanded catalog uses the same routing architecture.

- `/resources`, `/id/resources`, `/zh-tw/resources`: localized directory UI.
- `/resources/indonesian-passport-renewal-taiwan`: English passport guide.
- `/id/resources/indonesian-passport-renewal-taiwan`: reviewed Indonesian version.
- `/resources/taiwan-arc-extension-students`: English continued-study guide.
- `/resources/taiwan-arc-extension-workers`: English migrant-worker guide.
- `/zh-tw/resources/taiwan-arc-extension-students` and
  `/zh-tw/resources/taiwan-arc-extension-workers`: reviewed Traditional Chinese
  versions of the two ARC guides.

`App.tsx` resolves exact published routes using `resolveResourcePath`. Missing
slugs and unpublished translations render the existing not-found page. Production
Cloudflare assets use `404-page`, not SPA fallback; absent files return HTTP 404.
The original home, pricing, legal pages, OCR video, and calculator remain intact.
Navigation and footer link to resources. The existing free calculator links back
to the appropriate directory. No date arithmetic or countdown was duplicated.

`ResourceDirectoryPage.tsx` implements in-memory matching and native form controls.
`ResourceGuidePage.tsx` renders the structured content, adjacent source references,
ephemeral preparation checkboxes, authority links, calculator, and product CTA.
`components/resources/ResourceLayout.tsx` supplies the shared shell. Styling is
scoped in `resources.css`.

## Data schema

`types.ts` defines `ResourceGuide`, `GuideContent`, `OfficialSource`, and filters.
Each guide records:

- Stable ID and slug, nationality predicate, residence codes, document category,
  and optional residence statuses.
- Named responsible authority and source reference, primary official source,
  eligibility/scope, prerequisites, common and conditional requirements, optional
  suggestions, procedure overview, and important notes.
- Claim-level source IDs, original HTTPS URLs, source organization, checked date,
  optional source-update date, access method, and review limitations.
- Independent content-update, source-review, and translation-review dates;
  editorial status; reviewed language versions; search aliases.
- Optional action type (`renewal`, `application`, `replacement`, `benefit`, or
  `review`) and cited timing classification. A recurring NHI benefit, a recipient's
  certificate-age policy, and a contract review are not document expiry dates.
- Source role (`government` or `issuer`). Bank and examination-provider policies
  are explicitly scoped to that issuer; they are not government requirements.

`curation.ts` reduces repeated metadata for manually authored English definitions.
Every definition supplies an explicit `reviewedOn`; the helper never uses the
clock or generates nationality/document combinations. `reviewed-sources.ts`
records the expansion's source evidence. `source-policy.ts` validates exact HTTPS
hosts and a small allowlist of necessary query-bearing URLs; extra parameters,
credentials, fragments, and unapproved destinations fail validation.

Source access is `direct`, `official-index`, or `unavailable`. An unavailable
reference may be displayed transparently but cannot substantiate a procedural
statement or serve as primary/authority evidence. It is not silently replaced.

`validateGuides()` runs at catalog import (including builds) and in tests. It
rejects duplicate IDs/slugs, unsafe source hosts, invalid dates, absent authority
or applicability, missing evidence, placeholders, and unreviewed translations in
published content. Automated checks validate the recorded evidence structure;
they cannot prove that a human read a source or certify legal accuracy.

## Nationality and residence matching

Country/region codes are explicit and independent of language and timezone.
Indonesian passport guidance requires Indonesian citizenship **and** Taiwan
residence. Taiwan ARC guides describe eligible foreign nationals, exclude TW/CN/
HK/MO cases from this initial scope, require Taiwan residence, and distinguish
student and migrant-worker statuses. A worker selection does not guarantee
eligibility; the migrant-worker scope is prominent on cards and the guide.

Passport guides cover ID/TW, ID/ID, TW/TW, PH/TW, TH/TW, and the additional
GB/CA/AU/NZ/IE/HK/MO/MY/JP/IN/DE/SG nationalities/regions residing in Taiwan.
The GB guide is a reviewed overseas-service starting point with an explicit
interactive-checklist limitation. Taiwan residence
and other resources use explicit foreign-national exclusions or any-nationality
predicates, subject to the visible scope. Language-certificate resources cover
residents of Taiwan and Indonesia. There are no other passport combinations.
The [workforce research](taiwan-workforce-country-research.md) documents 23
country/region profiles and remaining passport gaps. Their presence is a filter option, not
evidence of a verified passport procedure or immigration eligibility. The general
foreign-national ARC/APRC scope excludes TW/CN/HK/MO; separate Gold Card and
student-permit definitions retain their own exclusions. Hong Kong/Macao existing
work-based resident permits have a separate reviewed guide. The directory explains
these distinctions. No citizenship, eligibility, or immigration status is inferred
from interface language, IP, browser locale, or time zone. A recognized browser
time zone preselects an approximate residence after hydration, with localized
help asking the visitor to check or change it. This is a convenience suggestion,
not verified physical location or immigration eligibility.

Blank filters mean browse all reviewed guides, not an inferred user profile.
Keyword search intersects the other filters and searches published translations,
scope, authority, and aliases. Status is shown only when it affects the selected
document and matching scope: for example ARC, NHI, work, and health certificates.
Changing away from that combination clears its hidden status. Reset clears all
filters and disables residence preselection for the rest of that visit; changing
interface language preserves them. Unsupported combinations
display an honest empty state. Temporarily unavailable and incomplete-research
records have distinct generic messages; their unpublished instructions stay
hidden. Taiwan ARC empty states offer NIA's general residence information, with
the distinct Hong Kong/Macao source used for those regional cases. These links
are clearly distinguished from a matching guide. Draft and
unavailable guides never appear as results. There is no generated live advice.

### Browser residence suggestion and guide ordering

On a fresh directory visit, `Asia/Taipei` preselects Taiwan and Indonesia's named
zones preselect Indonesia. Unknown, hidden, or unmapped zones leave residence
blank. Nationality and residence status are never preselected. The first finder
interaction captures the current suggestion, so later focus/time-zone changes
cannot replace a residence while the visitor is using the form. Choosing or
clearing residence overrides the suggestion; Reset clears it without immediately
prefilling again. Locale navigation preserves these choices. A reload starts a
fresh suggestion, without restoring any earlier private selections.

After filtering, results sort first by a supported residence hint from the
browser's named time zone, then alphabetically by the displayed title within both
groups. English fallback titles are included in the active interface language's
`Intl.Collator` order. Equal titles use the stable slug as a tie-breaker.

`src/lib/resource-order.ts` explicitly maps `Asia/Taipei` to TW and Indonesia's
named zones to ID, including older aliases. UTC, unrecognized zones, and shared
offsets are inconclusive and yield alphabetical order for all results. No IP,
language, or UTC-offset inference is used. A selected residence (suggested or
chosen) filters the results, which then sort alphabetically. When residence is
cleared, the original time-zone-first ordering still applies to all matched guides.
The helper reorders a copy of the matched results and never changes eligibility,
publishes a draft, or adds a guide that failed matching.

Localized residence help and the order note explain the approximate hint. Server
rendering and hydration begin with blank filters and all published guides sorted
alphabetically, independent of the build/server time zone;
`useSyncExternalStore` reads the device preference after hydration and refreshes
it when the tab becomes visible or focused. This only affects residence while the
finder is untouched; ordering may still update after a visitor clears residence.
Static HTML remains useful without JavaScript. When adding another supported residence, add only verified
named-zone mappings and exclusion/fallback tests; do not infer a nationality.

## Editorial standards and review checklist

Perform this checklist for every content addition and procedural change:

1. Identify the exact audience, residence purpose, authority, issuing country,
   document, and exclusions. Keep passport issuance and residence permission
   separate. Split materially different procedures rather than generalizing.
2. Start on the authority's official site and follow its service links. Verify
   domain ownership and redirects. Add a new host to the exact allowlist in
   `source-policy.ts` only after independent verification. Use HTTPS URLs without
   credentials, redirect parameters, or user-controlled destinations.
3. Read current instructions, supporting attachments, publication/update dates,
   and portal links. Record the actual check date and access method. Search-index
   text must be identified as such, never described as a full live-page review.
4. Compare older and newer sources. Exclude unsupported fees, processing promises,
   legal windows, or special-case requirements. Explain contradictions and refer
   the reader to the authority. Do not assume an attachment's contents from its
   title. Do not silently substitute an unrelated site for a failed link.
5. Write original, short summaries. Separate official requirements from optional
   organization suggestions; attach source IDs to procedural statements.
6. Check the complete rendered guide, common vs conditional requirements, scope,
   citations, review date, and report-correction link. No account or app install
   may block reading. No unsupported eligibility guarantee may be published.
7. Review translations against those same claims, preserving exclusions and
   uncertainty. Record each reviewed translation date. Do not publish a locale
   entry merely to make a language switch look complete.
8. Set `editorialStatus: "published"` only when there is enough verified content.
   Run source checks, tests, lint, build, generated HTML validation, and local
   browser checks. Inspect the diff and retain the revision in source control.

Source reviews are fixed editorial records, not build timestamps. A code-only
change must not advance them. Recheck before each content release and when users
report changes. If verified content becomes insufficient, set `draft` or
`unavailable`; the generated route and sitemap entry disappear on the next build.
Already-deployed content remains until a separately approved release.

## Current review record and limitations

All 52 guides, 23 country research profiles, the Indonesian passport translation, and the Traditional
Chinese ARC translations were reviewed on
**2026-11-12**. The [source inventory](renewal-resource-sources.md) records the
original evidence and the [expanded inventory](renewal-resource-expanded-inventory.md)
records all 91 unique guide/profile source URLs, their supported claims, and access limitations.
The application repository's three research
documents were inspected read-only; their distinction between personal reminders
and legal dates and their separate student ARC reference were reused. Their old
review dates were not copied into new public content. The Flutter app was not
modified.

- KDEI appointment text was reviewed through the official search index. Direct
  retrieval of the supplied KDEI pages returned HTTP 403. The passport guide makes
  that limitation explicit and omits fixed fees, processing estimates, payment
  mechanics, and eligibility windows. The newer April 2026 digital-payment notice
  was identified, but its attachment was not verified. Ask KDEI for current
  registration/payment and special-case instructions.
- Student guidance is deliberately limited to continued study with an existing
  study-based ARC. Graduation, first applications, and purpose changes are outside
  the guide. Mandarin cases need additional confirmation.
- Worker ARC guidance is limited to migrant workers continuing an approved
  employment purpose. Professionals, Gold Cards, APRC preparation, and qualifying
  graduate job-seeking work rights now have separate guides. Employer changes and
  family ARC extension procedures remain outside the published ARC scope. The
  worker online system is named from WDA's
  instructions; no unverified direct portal URL is invented.
- Student and worker guides are available in English and Traditional Chinese.
  Passport guidance is available in English and Indonesian. The remaining
  untranslated combinations explicitly offer English. No unpublished procedural
  translations get a URL or `hreflang`.
- Government source titles/access notes retain the reviewed source language.
- The 49 guides added after the original three are English only. All finder labels are localized, and
  the directory clearly offers English when procedural content is untranslated.
- NHI English pages retain older statutory references; specialist and family
  exceptions require current NHIA confirmation. No universal eligibility date is
  computed. Dental coverage is an adult benefit check, not an expiry deadline.
- Driving guidance uses the May 31, 2026 reform rather than the older age-75
  English summaries. Foreign holders still need their own category checked.
- The graduate work-rights guide uses WDA's 2026 guidance for qualifying recent
  Taiwan graduates. It does not grant work rights to every job seeker.
- Gold Card legal filing and platform cutoff information are distinguished;
  applicants must confirm their live route with the authority.
- The international driving guide covers an Indonesian-issued permit in Indonesia.
  Taiwan-issued permit recognition in Indonesia is not substantiated or promised.
- CTBC renewal policies are an issuer-specific example, not rules for every bank.
  IELTS acceptance recommendations, TOEIC/TOEFL score policies, and TOCFL record
  services are distinct. A TOCFL two-year reissue/verification service is not
  presented as proof that every certificate expires after two years.
- Some sources were accessible only through the official index; those limitations
  appear beside the source. Eight profiles retain unverified Taiwan passport
  checklists and create no guide URL. The detailed workforce report and generated
  inventory name every gap. No unavailable source substantiates a requirement.
- Country notes distinguish conditional criminal-record requests, supporting
  civil/education records and travel/identity events. No extra recurring renewal
  is added merely because a country profile exists. Teacher status is available;
  public-school and private tutorial-school procedures remain separate.
- Review dates are not guarantees of eligibility or future source availability.

## Adding another country or document

1. Add localized country/region names and an explicit code to `countries.ts`.
2. Research the exact authority and scope; create a new guide object in this
   folder using the existing schema. Supply an actual review date explicitly;
   never copy the helper's callers' dates without a new review. Add reviewed
   official hosts or exact query URLs if needed.
3. Import it into `resourceGuides` in `guides.ts`. No page component changes are
   necessary for another guide in an existing document/status category.
4. Add matching and exclusion tests, complete the editorial checklist, and publish
   only the reviewed content. New substantive pages enter routing, prerendering,
   and sitemap generation from the shared catalog automatically.
5. For an entirely new document or status type, extend the type and labels in all
   interface languages. Do not create country × document permutations.

To add a reviewed translation, add its `GuideContent` and corresponding
`translationReviews` date. Available language links, routes, reciprocal alternate
metadata, and sitemap entries then derive from the data. Keep the stable slug.

## SEO and sitemap

See [Google and AI search discovery](search-and-ai-discovery.md) for the public
editorial standards, published-guide discovery schema, live crawl checks and
owner account steps needed after an approved deployment.

`seo.ts` generates unique titles/descriptions, self-canonicals, Open Graph article
metadata, `Article` or `CollectionPage`, and `BreadcrumbList`. Resource pages do not
copy homepage FAQ or software schema. Alternates refer only to published content;
the three localized directories reciprocate their own alternates. The finder
language selector navigates to the corresponding stable directory URL using
browser history. The route controls both the visible language and the shared SEO
model; filters remain in page memory during language changes and Back/Forward.
Reloading retains the language URL and clears private filter state. Crawlable
language links work without JavaScript.

Each published locale supplies its own title, meta description, social titles and
descriptions, social-image description, document language, Open Graph locale and
structured-data language. Guide metadata comes from that reviewed translation's
title and summary. HTML hreflang lists the exact published language set, including
itself and the English `x-default`; Open Graph alternatives match that set. An
English-only guide has no invented Indonesian or Traditional Chinese alternate.
The same metadata is prerendered and applied after browser navigation, with one
title/canonical/schema block. Collection pages do not claim article metadata.
This follows Google's [language URL and switching guidance](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
and [reciprocal alternate-language guidance](https://developers.google.com/search/docs/specialty/international/localized-versions).

`prerender.mjs` generates the sitemap using `INDEXED_PATHS` and explicit modification
dates, and renders substantive HTML for every published resource route. The
checked-in `public/sitemap.xml` is a readable snapshot; generated `dist/sitemap.xml`
is authoritative. Update the snapshot after adding content. Filters never enter
the URL, storage, or sitemap. Even incoming query parameters retain the stable
directory canonical. Unknown paths get noindex metadata and a real asset 404.

## Privacy and feedback

Filters, search terms, and checkbox state remain in React/native page memory.
There is no local/session storage, analytics event, precise location, document
upload, or backend request. Reloading clears private selections and makes a fresh
time-zone residence suggestion when supported. CTAs use the existing
product destinations without attaching filter data. Authority links use fixed,
validated URLs, `noopener noreferrer`, and no referrer. The optional correction
link opens an email draft containing public guide metadata only; the visitor
reviews and sends it. It never automatically emails anyone.

The browser time zone is read locally through
[`Intl.DateTimeFormat().resolvedOptions().timeZone`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/resolvedOptions).
It is an approximate device setting, not verified physical location. The finder
never invokes Geolocation or the Permissions API, requests a location prompt,
calls an IP-location service, or persists/transmits the inferred residence.
Time-zone preselection and ordering do not change guide source-review dates or SEO
URLs. All directory locale modification dates are explicitly set to 2026-11-13 for
this interface change; guide review dates remain unchanged. No filter URL or
personalized structured data is generated.

## Verification and local preview

```powershell
npm ci
npm run lint
npm run test
npm run build
npm run check
npm run resources:sources
npm run resources:inventory
```

`npm run check` rebuilds, validates all generated SEO output, and runs a Cloudflare
deployment **dry run**. It does not publish. `resources:sources -- --online` is an
optional editorial HEAD availability check. Redirects and failures require manual
review; HTTP 200 alone is not source verification. It does not rewrite dates or
scrape instructions, and it is never invoked by the public website.
`resources:inventory` regenerates the inspectable Markdown inventory from local
data. It does not access sources or advance any review dates.

For local browser checks, start the Cloudflare asset emulator in a separate shell
and run the two existing/new browser suites:

```powershell
$env:WRANGLER_LOG_PATH = '.qa/wrangler-local.log'
npx wrangler dev --local --port 8789 --config wrangler.json
# In another shell:
npm run test:resources:browser
npm run test:browser
```

Screenshots and machine-readable results are written to ignored `.qa/`. These
checks cover direct requests/refresh, 404s, native controls/keyboard, matching,
empty/reset states, external links, ephemeral selections, reduced motion,
JavaScript-free content, and 320/375/768/1440px overflow. See the verification
results recorded with this change for actual outcomes and runtime limitations.

The repository's pinned Wrangler 4.88.0 bundles an older local workerd binary
which rejected the configured 2026-06-22 compatibility date on this workstation.
Production configuration is preserved. A temporary newer CLI can be tested with
`npm exec --yes --package=wrangler@4.160.1 -- wrangler dev --local --port 8789 --config wrangler.json`
without changing dependency files. Do not lower production compatibility dates
just to make a local emulator start.

## Manual deployment — only after approval

Review and approve the code, content limitations, and generated output first.
Then, from an authenticated Cloudflare account for the existing site, run:

```powershell
npm ci
npm run lint
npm run test
npm run check
npm run deploy
```

The last command performs the real deployment and must not be run until approved.
After approval/deployment, smoke-test `/`, pricing, privacy, terms, support, the OCR
demo, calculator locales, all published resource routes, and an unknown guide URL.
Confirm sitemap/canonical values and HTTP 404 behavior on the public hostname.

## Executed verification — 2026-11-12

| Check | Result |
| --- | --- |
| `npm ci --cache .npm` | Passed; used a workspace cache and authorized network access after restricted installation attempts failed. Dependency versions and lockfile are unchanged. |
| `npm run lint` | Passed with zero errors; two existing unused-disable warnings in generated `worker-configuration.d.ts`. |
| Automated tests | 98 passed with `node --test --test-concurrency=1 scripts/*.test.mjs`, zero failures or skips. The first parallel run hit a Vite module-loading timeout; the complete suite was rerun one file at a time. Coverage includes site-name consistency, the catalog, workforce research, ordering, localized SEO, discovery schema and crawler exclusions. |
| `npm run build` | Passed: TypeScript, client build, SSR build, prerender. Also rerun successfully through the final `check`. |
| `npm run check` | Passed: production build, SEO validation of 66 HTML documents, and Wrangler deployment dry run with a workspace log path. Vite reports a 560.25 kB minified entry chunk (171.21 kB gzip); the in-memory catalog remains bundled, with no new dependencies. |
| `npm run check:discovery` | Passed against all 65 production sitemap URLs and all 65 local-preview URLs: no HTTP, robots, canonical, language, indexing-header or snippet exclusions detected. This is HTTP/robots verification, not proof of indexing or access from actual provider crawler IPs. |
| Approved production deployment | Completed 2026-11-13 (Asia/Taipei) using `npm run deploy`; Cloudflare version `99ec9822-8823-430b-9bab-f5fc6cd938de`. The post-deployment discovery audit passed all 65 live URLs. |
| Site-name correction deployment | Explicitly approved and deployed 2026-11-13, version `657d0eac-7b61-4a15-904f-dd76605a7cd8`. Preferred/alternate names, manifest, footer and bundle verified live; all 65 public URLs passed the discovery audit. |
| Production browser verification | Passed all 80 layouts and functional/localized-SEO checks on the public hostname. Zero application XHR/fetch requests or runtime/hydration errors; Cloudflare-injected analytics/security requests reported separately. |
| `npm run resources:sources` | Passed structural publication/source checks and printed the recorded access inventory. No claim that every source was directly accessible. |
| `npm run test:resources:browser` | Passed on the final build using installed headless Chrome and temporary Wrangler 4.160.1. All 65 sitemap routes GET/HEAD 200; unknown guides and unpublished translations 404; trailing slash redirect; stable query canonical. |
| Resource browser layout checks | 80 route/width combinations at 320, 375, 768, and 1440px; no horizontal overflow, runtime exceptions, or hydration errors. Filtering (including professional, overseas-student, NHI, graduate work and national-ID cases), search, reset, language independence, keyboard selection/Tab/Enter, visible focus, official link attributes, reload, reduced motion, no API requests, and no-JavaScript guide content passed. |
| Workforce browser checks | Passed: Vietnam passport gap and official referral, Canadian passport match, Hong Kong/Macao status-specific residence routing and fallback, separate teacher results, native source disclosure with Space, and 320px country-note layout. |
| Localized SEO browser checks | Language selection, Back/Forward and refresh keep the URL, visible language and full search/social/schema metadata synchronized with the prerendered HTML. Filters survive language navigation and clear on refresh. Reviewed guide-language links use their own localized SEO; English fallback links retain English URLs. |
| Device-zone browser checks (before residence preselection) | Passed with Asia/Taipei, Asia/Jakarta, Asia/Jayapura, UTC, and Asia/Shanghai overrides: region priority followed by alphabetical order, unknown/shared-offset fallback, explicit-residence override, and localized title ordering. Instrumented Geolocation access remained zero; no inferred filter selections or API requests, and no hydration errors. See the 2026-11-13 interface update below for current behavior. |
| `npm run test:browser` | Existing calculator/homepage regression suite passed: 48 layouts, three calculator languages, keyboard behavior, date calculations, no private URL/storage/API side effects, and JavaScript-free explanations. |
| Visual inspection | Initial directory/passport/Chinese ARC screenshots, expanded desktop Gold Card, mobile dental, Traditional Chinese directory, desktop Canadian passport, mobile tutorial-school teacher and mobile US country-note screenshots inspected. Images/results are local ignored `.qa/` artifacts. |
| `git diff --check` | Passed; only repository line-ending conversion notices. Sitemap source snapshot matches generated output. |

The initial local-runtime attempt failed with pinned Wrangler 4.88.0; the temporary
4.160.1 CLI ran successfully with the original production compatibility date.
Browser checks ran against the completed final build. The subsequent approved
production deployment is recorded in `search-and-ai-discovery.md`.

An earlier restricted localized-SEO test run hit a Vite module-loading timeout and
was canceled. The final discovery suite ran with native process access and passed
all 97 tests.

`npm ci` reported 18 audit findings in the existing locked dependency tree
(1 low, 9 moderate, 8 high). Dependency remediation was not part of this content
feature and no automatic version upgrades were applied.

## Residence preselection update — 2026-11-13

The directory now preselects Taiwan or Indonesia from a recognized browser time
zone. The suggestion is approximate, local, editable, and independent of nationality,
status, and interface language. English, Indonesian, and Traditional Chinese help
text explains the suggestion. Clearing residence and Reset stay cleared, including
after focus, time-zone changes, and locale navigation. Starting to use another
finder field also captures the residence, preventing later device-setting changes
from replacing it while the form is in use.

Executed for this update:

- All 98 automated tests passed with
  `node --test --test-concurrency=1 scripts/*.test.mjs`.
- `npm run lint` passed with the two existing generated-file warnings.
- `npm run check` passed the production build, all 66 prerendered HTML SEO checks,
  and the Cloudflare deployment dry run. The entry bundle is 561.46 kB minified
  (171.68 kB gzip); no dependencies were added.
- `npm run test:resources:browser` passed on local Cloudflare with installed
  Chrome and temporary Wrangler 4.160.1. It checked five time-zone overrides,
  approximate preselection and fallback, nationality/status independence, manual
  override/clear/reset, in-progress selections surviving a zone change, all three
  locales, keyboard controls, direct routes, and stable localized SEO.
- All 65 sitemap routes returned GET/HEAD 200; missing guides/translations returned
  404. All 80 route/width checks passed, plus 320px preselection checks in all three
  languages. There were zero geolocation accesses, application XHR/fetch requests,
  or runtime/hydration errors. English and Traditional Chinese preselection
  screenshots were visually inspected.
- The public sitemap matches generated output. Directory modification dates
  record this interface update; guide source-review dates are unchanged.

This preselection update is verified locally and has not been deployed. Earlier
production deployment records above describe the versions preceding this update.

## Files in this change

Created (including the expanded catalog):

- `src/content/resources/types.ts`, `countries.ts`, `guides.ts`, `locales.ts`,
  `indonesian-passport-taiwan.ts`, `taiwan-arc-students.ts`, `taiwan-arc-workers.ts`.
- `src/content/resources/passports.ts`, `taiwan-residence-work.ts`,
  `health-driving.ts`, `contracts-records.ts`, `language-certificates.ts`,
  `reviewed-sources.ts`, `source-policy.ts`, `curation.ts`, `expanded-locales.ts`.
- `src/components/resources/ResourceLayout.tsx`.
- `src/pages/ResourceDirectoryPage.tsx`, `ResourceGuidePage.tsx`, `resources.css`.
- `scripts/resources.test.mjs`, `resources-browser-check.mjs`,
  `check-resource-sources.mjs`.
- `scripts/resource-expansion.test.mjs`, `scripts/write-resource-inventory.mjs`.
- `src/lib/resource-order.ts`, `src/content/resources/order-locales.ts`,
  `scripts/resource-order.test.mjs` (device-zone ordering and localized feedback).
- `src/content/resources/workforce-sources.ts`, `workforce-passports.ts`,
  `workforce-documents.ts`, `workforce-profiles.ts`,
  `src/components/resources/WorkforceCountryNotes.tsx`,
  `scripts/workforce-resources.test.mjs`, `docs/taiwan-workforce-country-research.md`.
- `docs/renewal-resource-center.md`, `renewal-resource-sources.md`,
  `renewal-resource-expanded-inventory.md`.
- `src/content/resources/discovery.ts`,
  `src/components/resources/EditorialPolicy.tsx`,
  `scripts/check-search-discovery.mjs`, `scripts/search-discovery.test.mjs`,
  `docs/search-and-ai-discovery.md`.

Changed:

- `src/react-app/App.tsx`, `entry-server.tsx`.
- `src/seo.ts`, `src/lib/seo-head.ts`.
- `src/components/landing/Header.tsx`, `src/pages/LandingPage.tsx`.
- `src/pages/ExpiryCalculatorPage.tsx` (links only).
- `scripts/prerender.mjs`, `scripts/validate-seo.mjs`.
- `public/sitemap.xml`, `package.json` (scripts only).

No dependency versions, database configuration, production configuration, or
Flutter files were changed. The existing `robots.txt` already permits the public
routes and advertises the sitemap, so it did not need editing.
