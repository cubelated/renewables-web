# Free date calculator and calendar converter

Public SEO route: `https://renewables.cubelated.com/tools/expiry-calculator`.
The marketing site calculates dates locally, without an account or backend. It
does not schedule notifications or determine official renewal deadlines.

## File inventory

Created:

- `src/pages/ExpiryCalculatorPage.tsx` and `src/pages/expiry-calculator.css`
- `src/lib/date-calculator.ts`, `src/lib/calculator-clock.ts`, and
  `src/lib/calculator-clipboard.ts`
- `src/content/expiry-calculator.ts`
- `src/components/calculator/LanguageMenu.tsx` and
  `src/components/calculator/TimeZoneSelect.tsx`
- `scripts/date-calculator.test.mjs`, `scripts/expiry-page.test.mjs`, and
  `scripts/calculator-browser-check.mjs`
- `docs/expiry-calculator.md`

Updated:

- `src/react-app/App.tsx`, `src/seo.ts`, and `src/pages/LandingPage.tsx`
- `scripts/prerender.mjs` and `scripts/validate-seo.mjs`
- `public/sitemap.xml` and `package.json`

The existing `entry-server.tsx` already exports the route list, so adding the
route to `INDEXED_PATHS` needs no duplicate route list there. Existing
`robots.txt` and `wrangler.json` already allow and serve the new static route.

## Modes

- **Expiry countdown:** compares the entered expiry date with today in the chosen
  IANA time zone. Today is zero, tomorrow is one, yesterday is one day overdue.
  Results include days remaining or overdue, full weeks plus remaining days,
  the expiry date, and the selected zone.
- **Date difference:** signed and absolute calendar days, full weeks and remaining
  days, and the ordering of the two dates. Counting excludes the start date:
  November 11 to November 12 is one day.
- **Add / subtract dates:** whole days, weeks, months, or years. Countdown quick
  actions copy the expiry into this mode and subtract 7, 14, 30, 60, or 90 days.
  The custom action opens an editable offset. No reminder is created.
- **Calendar converter:** select any source and target among Gregorian, Taiwan
  ROC, Thai Buddhist, and Japanese era calendars. All 16 pairs, including a
  same-calendar format conversion, are supported. A swap button exchanges the
  calendars and preserves valid entered dates. Gregorian is the default for
  both source and target. A target outside its supported range produces a clear
  error rather than restricting unrelated calendar pairs.

Results update immediately when required inputs are valid. Clear/reset empties
the date fields and returns arithmetic controls to subtract 30 days; it preserves
the selected mode, language, source/target calendars, formats, and time zone. Copy uses the browser
Clipboard API only on request, with a manual-copy message when unavailable.

## Calendar representation and validation

`src/lib/date-calculator.ts` separates parsing, validation, calendar arithmetic,
zone handling, and formatting. Internal values are validated Gregorian
`{ year, month, day }` tuples, independent of time zones. Gregorian years range
from 0001 to 9999. Gregorian input requires an explicit four-digit year and
the explicitly chosen date ordering; short years never silently mean ROC years.

### Input and result date formats

The default Gregorian input uses the device's native date picker; its visible
ordering follows browser/OS preferences, while its value is normalized to
`YYYY-MM-DD`. Choosing an explicit input ordering uses a text field so the
selected format is actually respected independently of the browser locale:

- Year / month / day (`2026-12-05`, `115/12/5`, `2569/12/5`, `R8/12/5`).
- Day / month / year (`05/12/2026`, `05/12/115`, `05/12/2569`, `05/12/R8`).
- Month / day / year (`12/05/2026`, `12/05/115`, `12/05/2569`, `12/05/R8`).

Gregorian years remain four digits. Numeric day/month order is never guessed:
`05/12/2026` means December 5 in DMY and May 12 in MDY. Written ROC and Japanese
era dates remain accepted in any ordering because their components are explicit.
Changing input format re-encodes valid dates without changing the actual day.

Result formatting is independent: choose any numeric ordering or a written date
localized in the chosen language and target calendar using `Intl`. It never
changes calculations or input values. Copied summaries include the converted
result plus an unambiguous Gregorian ISO reference. `convertCalendarDate` is the
testable entry point for parsing an explicit source/format and formatting the
chosen target/format.

ROC year = Gregorian year − 1911. Supported ROC years are 1–8088 (1912–9999).
Accepted ROC inputs include `115/11/11`, `115.11.11`, `115-11-11`, and
`民國115年11月11日`. All map to `2026-11-11`. `民國116年2月28日` maps to
`2027-02-28`. Mixed separators, ROC year zero, and impossible dates are rejected.
Minguo uses Gregorian months and days; it is not the Chinese lunar calendar.

The 4/100/400 Gregorian leap-year rules validate complete dates. Offset inputs
must be whole numbers no greater than 1,000,000 in magnitude, and the calculated
date must remain inside the supported Gregorian range. The UI accepts a
nonnegative magnitude and a separate Add/Subtract direction. The arithmetic
module also accepts signed offsets for reuse. Conversion to ROC of a date before
1912 produces a clear validation message. Switching input calendars clears
unrepresentable/invalid drafts with a visible notice, rather than reinterpreting
them as a different date.

Gregorian remains the default input calendar. Two additional solar calendar
inputs are supported:

- **Thai Buddhist (BE):** `2569/11/11`, `2569.11.11`, `2569-11-11`, or
  `BE 2569-11-11` represents `2026-11-11`. Subtract 543 from the Buddhist year.
  This tool supports modern Thai civil dates from BE 2484 (1941) onward,
  excluding earlier historical year-start conventions. The upper limit is
  BE 10542 (Gregorian 9999). Leap-day validation uses the Gregorian year.
- **Japanese era (Wareki):** `R8/11/11`, `Reiwa 8-11-11`, or
  `令和8年11月11日` represents `2026-11-11`. M/Meiji/明治, T/Taisho/大正,
  S/Showa/昭和, H/Heisei/平成, and R/Reiwa/令和 are recognized. `元` means year
  one in kanji input. Full dates must lie within the stated era; `H31/5/1` and
  `R1/4/30` are rejected, while `R1/5/1` is valid. Gregorian month/day rules
  are supported from 1873-01-01 (Meiji 6), excluding earlier lunar dates.

Switching calendars converts valid input while preserving the actual date.
The converter accepts every supported source/target combination. Arithmetic
always uses the normalized Gregorian date and displays a Gregorian result.
Use the converter to represent that result in another supported calendar.

Calendar references: [Unicode CLDR date/calendar rules](https://www.unicode.org/reports/tr35/tr35-dates.html#Calendar_Elements),
[Thai Buddhist chronology](https://docs.oracle.com/javase/10/docs/api/java/time/chrono/ThaiBuddhistChronology.html),
and [Japanese era definitions](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/time/chrono/JapaneseEra.html).

## Date-only arithmetic and exact timestamps

This release intentionally offers **calendar dates only**. No local date/time
input is resolved to an instant, so there is no ambiguous/nonexistent DST time
resolution policy to apply. A precise timestamp mode is a future enhancement
that would require a tested zone resolver and an explicit DST disambiguation
policy.

Calendar ordinals are calculated with UTC setters/getters solely as a stable
coordinate system. Dividing ordinal differences by 86,400,000 counts calendar
boundaries; it never represents the elapsed duration between local midnights.
For example, successive New York calendar dates count as one day even when
their midnight timestamps are 23 or 25 hours apart. `setUTCFullYear` avoids the
special JavaScript year-0-to-99 behavior. There is no locale-dependent parsing or
`new Date("YYYY-MM-DD")` followed by local getters.

Months and years clamp once to the last valid day in the destination month:

| Calculation | Result |
| --- | --- |
| 2027-01-31 + 1 month | 2027-02-28 |
| 2024-01-31 + 1 month | 2024-02-29 |
| 2024-02-29 + 1 year | 2025-02-28 |
| 2027-05-15 − 30 days | 2027-04-15 |

A month is never approximated as 30 days, nor a year as 365 days. One operation
of adding two months is applied directly to the original date; it does not
repeatedly clamp through an intermediate month.

## Time zones and hydration

The client detects the device zone by default. Featured choices are:

| Place | IANA identifier |
| --- | --- |
| Taiwan | `Asia/Taipei` |
| Indonesia (western) | `Asia/Jakarta` |
| Indonesia (central) | `Asia/Makassar` |
| Indonesia (eastern) | `Asia/Jayapura` |
| Coordinated Universal Time | `UTC` |

Additional zones come from `Intl.supportedValuesOf("timeZone")` in a single
alphabetical, ungrouped dropdown, searchable by identifier/city within the same
control. Typing filters options without changing the selected zone. Enter or a
pointer selection commits the choice; Escape, Tab, or clicking outside restores
the selected zone. Underscores and spaces are equivalent in city searches.
The device-zone choice is the first option. Browsers without that method get
a curated regional fallback including New York, London, Sydney, and Auckland.
`Intl.DateTimeFormat` applies the zone's real rules, including DST, when deriving
today from an instant. No offsets are manually added to timestamps.

Changing zones affects today and Today shortcuts, preserving entered calendar
dates. Human-readable zone names are localized with `Intl`. Today refreshes every
30 seconds and on focus/visibility changes. The server and initial hydration use
the same null clock snapshot, empty inputs, English text, and deterministic zone
options. Current time, device zone, and full browser-supported zone options only
appear after hydration. No build-time countdown is displayed as a live result.

To add a featured zone, add its valid IANA identifier to `FEATURED_ZONES` in
`src/lib/date-calculator.ts`, add a localized place label if appropriate, and add
zone-boundary tests. The searchable list already includes browser-supported
zones. Older engines can be supported by extending `FALLBACK_ZONES`.

## Localization and accessibility

An icon-only language button in the top navigation opens the three native
language names, with the current selection checked. The menu supports arrow
keys, Home/End, Enter/Space, Escape, Tab, and outside-click dismissal. It is
separate from the date settings card. The time zone uses an editable ARIA
combobox and flat listbox with active-option announcements and keyboard access.

The primary date inputs appear directly after the short title and mode
buttons. Additional calendar, format, and time zone controls live in a native
disclosure below the date fields and start collapsed on all screen sizes. In the
converter, source/target calendars remain directly visible; date formats stay in
Options. Mobile checks assert that the default date field
starts within the first 550px of the page, with results below the input card.
Copy and reminder shortcuts appear only for valid results. There are no status
badges, duplicate date displays, feature widgets, or large introductory copy.
Explanations and FAQs remain prerendered inside one collapsed “How it works”
disclosure, keeping the first visit focused on entering a date.

The header and title use Renewables' blue/violet gradient. Calculation
cards remain light for legibility. The product introduction uses a separate
compact gradient card with a reminder benefit and the existing app/store links.
Focus indicators on the dark background are white.
Small Lucide icons identify modes and key actions in neutral slate. Icons on
selected modes and dark controls use white for contrast. Only the localized
“Free” text in the privacy note uses green. A short localized description below
the title explains the calculator. Labels and result text convey meaning
independently of color; decorative icons are hidden from assistive technology.

`src/content/expiry-calculator.ts` is a small typed dictionary for English,
Traditional Chinese (`zh-TW`), and Indonesian (`id-ID`). It contains labels,
messages, actions, helper text, explanations, and FAQs. `Intl.DateTimeFormat`
formats dates with the Gregorian calendar explicitly; `Intl.NumberFormat`
formats counts and pluralized day/week units. Language never changes the date,
time zone, or calendar choice. The tool wrapper has its own `lang` attribute.

Segmented native buttons expose `aria-pressed` and ordinary Tab/Enter/Space
keyboard behavior. Controls have labels, described helper/error text, visible
focus, and at least 44px touch targets. A polite live region announces results;
invalid input hides stale results and disables copying. Mobile layouts place
inputs immediately above results. Existing reduced-motion rules apply. FAQs
remain native expandable details.

## Privacy and product integration

- No calculation API, database, Supabase integration, account, or tracking SDK.
- No entered dates in requests, logs, analytics events, links, or URL parameters.
- No localStorage, sessionStorage, persistent history, or automatic sharing.
- Refreshing the page clears inputs. Clipboard access requires an explicit click.
- CTA links use the exact verified destinations in `src/content/product.ts`.
  They do not prefill dates or create reminders. Visitors add items and configure
  notifications separately inside Renewables.

## SEO and performance

`App.tsx` preserves the existing path router. `INDEXED_PATHS` in `src/seo.ts`
automatically makes the existing prerender script emit
`dist/tools/expiry-calculator/index.html`. The output includes one H1, static
explanations/examples/FAQs, unique title/description/canonical, index/follow,
Open Graph/Twitter metadata, and linked WebSite/WebPage/WebApplication/
BreadcrumbList JSON-LD. The title is “Free Expiry Date Calculator & Calendar
Converter | Renewables” and the H1 is “Expiry date calculator.” The page schema
describes the prerendered English content; the application schema lists all three
available interface languages. It does not copy the homepage FAQ schema, add
invented reviews, or claim rich-result eligibility. Both the homepage navigation
and its Resources footer link to the route; the public sitemap
includes it and the existing robots.txt advertises the sitemap.

Seven guides and seven FAQs are included in the initial HTML inside the existing
collapsed help disclosure, including date-difference counting, numeric date
formats, and supported calendar ranges. The copy uses practical examples rather
than lists of unrelated-language keywords. `data-nosnippet` excludes the controls
and transient results from Google snippets while leaving the introduction and
explanations available. It does not prevent indexing or change calculator privacy.

Cloudflare's existing static-asset routing serves the real generated HTML with a
200 response. Missing routes retain the existing 404 behavior. No Worker or
Wrangler configuration changes are required. `scripts/validate-seo.mjs` validates
the new route, heading hierarchy, substantive prerendered content, navigation and
footer links, CTA destinations, connected schema IDs, and exact sitemap coverage.
Across all six generated pages it rejects duplicate or missing titles,
descriptions and canonicals, mismatched social metadata, nonexistent social images,
and incorrect PNG dimensions. Open Graph and Twitter include image alt text.

Search references: [Google's JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics),
[title links](https://developers.google.com/search/docs/appearance/title-link),
[snippet controls](https://developers.google.com/search/docs/appearance/snippet),
and [structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

There are no additional runtime or test packages, external fonts, images, or
date-library downloads. The page uses existing Lucide icons and a small brand
asset. Calculations are synchronous and bounded. The current application uses a
shared client bundle; route-level splitting is a possible future optimization
if more tools are added. Localized variants are client selections on one
canonical route, not separate indexable language pages or hreflang URLs.
Indexable Chinese and Indonesian versions would require real prerendered language
URLs with reciprocal alternate links; the current client language selection
does not provide separate search landing pages. No nonexistent alternates are
advertised.

## Validation and local preview

Use Node 24 (the existing test suite imports TypeScript modules directly).

```sh
npm ci
npm run lint
npm run test
npm run build
npm run check
npm run dev
```

Open the Vite URL printed by `npm run dev`, then `/tools/expiry-calculator`.
The `check` command rebuilds, validates SEO, and performs a Wrangler dry run; it
does not deploy. In a restricted Windows environment, direct Wrangler logs to
the workspace before running it:

```powershell
$env:WRANGLER_LOG_PATH = Join-Path (Get-Location) '.wrangler/logs'
$env:WRANGLER_SEND_METRICS = 'false'
npm run check
```

For HTTP routing and Chromium browser checks against the built assets, keep this
running in one terminal:

```sh
npx wrangler dev --local --port 8789 --config wrangler.json
```

Then, in another terminal:

```sh
npm run test:browser
```

The browser script uses an installed Chrome/Edge/Chromium and native Node
WebSocket/CDP; no browser test dependency is installed. Set `BROWSER_EXECUTABLE`
if the binary is elsewhere, and `CALCULATOR_BASE_URL` for a different local
origin. Reports and optional verification screenshots go to ignored `.qa/`.
It checks 320/375/768/1440px, all modes and languages, HTTP 200/404/redirects,
real hydration with an emulated Los Angeles device zone, date input, arithmetic,
copy success/failure, reset, keyboard focus, reduced motion, no-JavaScript
content, and absence of calculation requests, persisted inputs, and date URLs.

Unit/SSR tests cover conversions and all common ROC formats; leap years and
impossible dates; ROC/Gregorian boundaries; same-day/past/cross-year countdowns;
month/year clamping; signed and bounded offsets; Taiwan/UTC midnight; all three
Indonesian zones; DST boundaries; calendar days versus elapsed timestamps;
localized formatting; clipboard failure; and stable server rendering.

### Verification environment note (November 11, 2026)

`npm ci`, lint, all 52 Node tests, the production build, six-page SEO validation,
and `npm run check` (including Wrangler's deployment dry run) passed. Lint has two
pre-existing unused-disable warnings in generated `worker-configuration.d.ts`.
Chromium passed 48 mode/language/viewport combinations and the interaction,
keyboard, clipboard, hydration, privacy, and no-JavaScript checks described above.

The pinned local `workerd` binary supports compatibility dates only through
2026-05-11, earlier than this repository's 2026-06-22 setting. A local-only
`--compatibility-date 2026-05-11` override then encountered a native runtime crash
on this host. The deployment configuration was preserved. Browser verification
therefore used a temporary local static server over the generated `dist` files,
with successful GET/HEAD 200, unknown-path 404, and trailing-slash redirect
checks. These are static-preview checks, not a claim that the Cloudflare runtime
or a production deployment was tested. Repeat `npm run test:browser` against a
working Wrangler preview before deploying. The reusable browser suite defaults
to the local Wrangler origin and can run unchanged there.

## Deployment (requires approval)

1. Review changes and obtain approval to deploy production.
2. Run `npm ci`, `npm run lint`, `npm run test`, and `npm run check` in the
   approved checkout; optionally repeat the browser suite against the local Worker.
3. **Only after approval**, run the existing `npm run deploy` command using the
   project's established Cloudflare authentication and environment.
4. Verify the public tool route returns 200, its canonical is correct, the
   homepage link works, and unknown routes still return 404. Check the sitemap.

This implementation does not deploy or change the Flutter application, billing,
subscriptions, or databases.

## Future opportunities

Consider an exact date-time mode with a tested DST disambiguation policy, more
translations, optional explicit inclusive counting, or route-level client code
splitting as the tools collection grows. A reminder app prefill must wait for a
documented, supported deep-link contract. Keep any future history or sharing
feature opt-in and avoid putting personal dates in URLs by default.
