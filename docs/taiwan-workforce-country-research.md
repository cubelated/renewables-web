# Taiwan workforce country and document research

Source review: **2026-11-12**. This supports the public finder; it is not a
nationality-based immigration or job-eligibility assessment. No deployment was
performed.

## Populations researched

MOL's [migrant-worker table](https://statdb.mol.gov.tw/html/mon/c12050.pdf) separately
identifies **Indonesia, the Philippines, Thailand and Vietnam**. These core
profiles also have professional populations. Nationality never selects a job,
residence status or work-permit procedure.

The [September 2026 professional table](https://statdb.mol.gov.tw/html/mon/212110.pdf)
separately lists **Malaysia, Vietnam, Indonesia, Japan, the Philippines, India,
Hong Kong, the United States, South Korea, Thailand, the United Kingdom, Myanmar,
Eswatini, Germany, Singapore, South Africa, Macao, France, Canada and Russia**.
Values are permit person-cases, not unique-worker counts or teacher-origin
rankings. This monthly endpoint changes; the reviewed period is recorded here.

**Australia, New Zealand and Ireland** are additional passport and teaching
preparation profiles, not claimed entries in that professional table. The
[2026 MOE announcement](https://english.moe.gov.tw/fp-117-40175-873e6-1.html) uses
MOFA-recognized passport-language and role-specific qualifications. No
seven-country teacher whitelist is invented. TFETP public-school roles and WDA
private tutorial-school roles have separate guides. A passport, accent, TEFL
certificate or job offer alone does not establish eligibility.

There are **23 finite research profiles**, not an exhaustive list of every
nationality legally able to work in Taiwan. Hong Kong and Macao have distinct
regional document/residence cases. Their existing work-based resident permits
use a separate NIA route. India's [April 2026 MOL statement](https://www.mol.gov.tw/1607/1632/2660/89945/)
distinguishes its migrant-worker MOU from implementation conditions; no operational
recruitment timetable is inferred from it.

## Country-by-country results

The [generated matrix and source inventory](renewal-resource-expanded-inventory.md#workforce-countryregion-research)
lists every profile, passport guide or gap, additional record, review date,
official URL and access limitation. It derives from the same typed data as the
finder. Generation does not perform research or advance dates.

Twelve passport starting guides were added: British, Canadian, Australian, New
Zealand, Irish, HKSAR, Macao SAR, Malaysian, Japanese, Indian, German and Singapore.
Existing Indonesian, Philippine and Thai guides remain. The British guide is an
overseas-service starting point; an interactive Taiwan checklist was not completed,
so no universal document list or local counter procedure is invented.

**Unverified Taiwan passport checklists:** Vietnam, the United States, South
Korea, South Africa, France, Myanmar, Eswatini and Russia. Confirmed official
starting points are linked with limitations, but no passport-guide route or
sitemap entry is generated for these gaps. In particular:

- Vietnam's current MOFA-hosted Taipei office/contact was identified, but its
  consular page did not expose a current ordinary-passport checklist. Another
  Vietnamese mission's procedure is not substituted.
- AIT's current page returned 403. The 2022 archive and U.S. domestic mailing or
  payment rules are not published as current Taiwan instructions.
- Korean Taipei requirements were not verified; other-country Korean mission
  checklists are not reused.
- South African, French, Myanmar and Eswatini general references do not verify a
  Taiwan-specific checklist. Russian passport processing was not substantiated.
  These are research gaps, not claims that renewal is impossible.

## What to track, and what to skip

| Kind | Examples | Treatment |
| --- | --- | --- |
| Actual validity | Passport; applicable residence/work approval; existing identity card or professional licence | Read the issued record and track documents separately. |
| Transaction/change | Philippine OFW clearance and verified contract; applicable OWWA coverage; Hong Kong ID replacement; passport-linked travel records | Check when the event applies and use the actual authority conditions. |
| Requested recent evidence | FBI, RCMP, New Zealand MOJ and qualifying Garda records; application-specific health evidence | Confirm purpose, accepted age and verification before ordering; no default annual renewal. |
| Supporting record | Degree, birth/civil-status or family-register evidence | Organize it; a recently issued copy requirement does not mean the underlying record expires periodically. |

The Philippine guide separates MWO/DMW clearance, OWWA coverage and MECO passport
services. Its same-employer special-hiring source is not generalized to every
Filipino, student, employer change or journey. No universal OEC/OFW Pass validity,
OWWA interval, fee or travel window is published.

HKSAR passport preparation checks permanent-ID validity and collection options;
it does not invent a Chinese consular counter or guaranteed delivery in Taiwan.
The ID guide uses current invalidation/return arrangements. Card invalidation does
not itself determine loss of permanent residence. Macao postal applications and
passport entitlement have separate rules.

Teacher records depend on the actual role and qualification pathway. Degrees do
not receive invented expiry dates. Professional licences follow their issuer's
conditions. Tutorial-school initial/extension, previous-permit, additional-employer,
health and police-evidence rules are distinguished. No generic TEFL/TESOL renewal
interval is invented.

New home-record guides cover FBI, RCMP, New Zealand MOJ and qualifying Garda
requests. Garda restricts certificate purposes; this is not general overseas-job
vetting. MOJ distinguishes a record's request date from expiry and the recipient's
accepted age. UK ACRO, Australian AFP and South African SAPS details were not
sufficiently verified for new procedural guides.

Where no extra recurring home-country renewal was verified, no extra recurring
checklist item is added. **This is not proof that an individual can never need
another document.** Actual contracts, requested evidence, home professional
registrations and personal circumstances still control.

## Implementation and maintenance

- `workforce-sources.ts` records official URLs, supported claims, access method,
  limitations and actual review dates.
- `workforce-passports.ts` and `workforce-documents.ts` contain individually
  authored guides; no country/document permutations are generated.
- `workforce-profiles.ts` stores 23 profiles and conditional records. Validation
  rejects copied country rules, mismatched guide links, unavailable requirement
  evidence, unsafe sources, duplicated countries and invalid review dates.
- `WorkforceCountryNotes.tsx` shows notes after an explicit nationality selection
  for Taiwan or unspecified residence. It never sets a filter. Conditional records
  respect the selected status; localized UI transparently labels English notes.
- Time-zone-first/alphabetical sorting is retained. It does not infer nationality
  or select a country profile. Unverified profiles create no SEO page.
- No storage, uploads, location permission, analytics payload, runtime government
  scraping or database is added. Source changes remain inspectable.

For another country, verify its actual Taiwan context and home authority, then
add a country/profile and explicit source dates. Publish a substantive guide only
after the [editorial checklist](renewal-resource-center.md) passes. Keep referrals
and unresolved details separate from verified procedures. Regenerate the inventory,
run checks and relevant browser tests, and obtain approval before deployment.
