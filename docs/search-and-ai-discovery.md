# Google and AI search discovery

Implementation and source review: 2026-11-12. This is a discoverability improvement,
not a promise of indexing, rankings or AI citations. The user approved production
deployment, which completed on 2026-11-13 (Asia/Taipei). Search-engine account
actions have not been performed.

## Implemented

- Search-focused directory titles in English, Indonesian and Traditional Chinese.
  Existing reviewed guide titles, descriptions, canonicals, language alternates,
  social metadata and substantive prerendering remain publication-gated.
- A directory `ItemList` of the actual published guides, with their real language,
  summary and canonical destination. An unavailable translation uses the English
  guide URL. The canonical index uses the prerendered alphabetical order; private
  filters and approximate device preferences do not create search pages.
- Stable `Organization` and `WebSite` identities connect the directory, articles
  and calculator. Renewables remains the independent editorial publisher. The
  responsible government authority stays a separate cited source, never the
  author of Renewables' article. Existing homepage FAQ and software descriptions
  retain their own scope.
- Visible localized editorial standards explain source reviews, translation
  reviews, incomplete evidence and corrections. Guide overviews show the issuing
  authority's official link, document category and residence in readable HTML,
  including on mobile. No extra immigration procedure has been added.
- Resource snippet eligibility is explicit with `max-snippet:-1`. Source dates
  and content dates remain fixed editorial records. No invented publication date,
  review credential, rating or authority affiliation is introduced.
- A read-only discovery audit detects robots exclusions, HTTP errors, wrong
  canonicals/languages, `noindex`, snippet restrictions, challenges, missing HTML
  content and sitemap drift.

Google's [AI-feature documentation](https://developers.google.com/search/docs/appearance/ai-features)
requires ordinary Search eligibility, including indexing and snippets; it does not
require a special AI file or special schema. The work therefore improves the
actual public pages rather than adding an unsupported ranking mechanism.
The [Article documentation](https://developers.google.com/search/docs/appearance/structured-data/article)
supports truthful author identity and content metadata. No representative article
image is invented from a brand logo, and no predeployment date is called a
publication date.

[Official OpenAI documentation](https://developers.openai.com/api/docs/bots)
distinguishes `OAI-SearchBot` for ChatGPT Search from `GPTBot` for training.
Search access is the relevant crawl check here. Existing training-bot preferences
are not changed by this feature.

## Local and live checks

Build first so the audit has an authoritative sitemap and expected HTML languages:

```powershell
npm run test
npm run lint
npm run check
npm run check:discovery
```

The final command performs GET requests to the production hostname, with a
maximum of four concurrent page requests. It never submits URLs to a search
engine, edits an account, changes Cloudflare settings or deploys anything.
To check the local Cloudflare preview instead:

```powershell
npm run check:discovery -- --base http://127.0.0.1:8789
npm run test:resources:browser
```

The audit uses the compiled sitemap's canonical production URLs even when fetching
a preview. It checks Googlebot, bingbot and OAI-SearchBot robots rules, including
merged groups, more specific agent groups, path wildcards and Allow ties. It is
a targeted diagnostic for the site's public paths, not a complete crawler or
assessment of nonstandard content-use signals. The resource browser suite also
verifies metadata synchronization, language links, history, private filtering and
320–1440px layout behavior.

An audit pass establishes HTTP/robots eligibility from the test environment.
It cannot establish indexing, provider citation selection, account ownership or
access from a provider's actual crawler IP addresses. It does not compare the
live page's entire content or metadata to an unreleased build.

## Live observations

Read-only requests on 2026-11-12 confirmed HTTP 200 for `/resources`, `/robots.txt`
and `/sitemap.xml`, with the expected HTML/text/XML types and no indexing-exclusion
response header on those responses. Cloudflare prepends managed robots content
that is absent from `public/robots.txt`: a general search allow rule, content-use
signals, and several separate bot restrictions. Always inspect the actual served
file; a repository-only check misses that layer.

Googlebot and OAI-SearchBot are not specifically blocked in the observed robots
file. This does not prove genuine crawler IPs are accepted by the WAF. The web
retrieval tool could not fetch these URLs, while direct public GETs succeeded;
that discrepancy alone does not identify a cause. If Search Console or provider
crawl reports show denial/challenges, inspect verified crawler traffic in
Cloudflare and use providers' current published verification guidance. No global
WAF bypass or user-agent-only security exemption has been added.

## Production and search-engine account steps

1. Review the code and preview, then obtain the requested production approval.
   Deploy using the existing `npm run deploy` workflow. Run `check:discovery`
   against production again after the deployment.
2. In the owner's [Google Search Console](https://search.google.com/search-console),
   select the verified property covering `https://renewables.cubelated.com/`.
   Existing ownership verification can be reused. If absent, the owner must
   complete Google's verification instructions; no verification token is guessed.
3. Submit `https://renewables.cubelated.com/sitemap.xml` in Sitemaps. Inspect the
   directory and representative guide URLs with URL Inspection, including the
   published `/id/` and `/zh-tw/` versions. Check Google's rendered HTML, selected
   canonical and crawl access, then request indexing for the important new pages.
4. Monitor indexing and the Web performance report for actual impressions,
   queries, locale and clicks. Correct crawl/quality problems shown in those
   tools. Deployment and sitemap submission do not guarantee inclusion or timing.

For Google's own account workflow, see its [sitemap management instructions](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
and [recrawl instructions](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).
No connected Search Console access was available for this task, so the account
steps remain for the owner. Do not report them as submitted or indexed.

## Executed checks

On 2026-11-12, all 97 automated tests passed; lint passed with the two existing
generated-file warnings; the build, SEO validation of 66 generated HTML pages and
Cloudflare deployment dry run passed. The discovery audit reported zero issues
for all 65 production URLs and all 65 local-preview URLs. These initial live
checks preceded deployment; no Search Console submission was performed.

The final resource browser suite passed all 80 route/width layouts, localized
metadata/navigation checks, official links, no-JavaScript content and HTTP
GET/HEAD checks for the 65 sitemap URLs, with no hydration/runtime errors.

## Approved production deployment — 2026-11-13

After the user's explicit approval, `npm run deploy` rebuilt the site, validated
all 66 generated HTML pages and deployed the existing `renewables-web` Worker.
Cloudflare reported version `99ec9822-8823-430b-9bab-f5fc6cd938de`.
The production discovery audit was rerun after deployment and passed all 65
canonical URLs with zero issues. This records an actual deployment, not a dry run.
