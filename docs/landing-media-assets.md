# Landing media inventory

The landing page uses genuine existing app UI, the two supplied screenshots, and the supplied silent OCR recording. The user confirmed that the card in the recording is a public specimen or sanitized demo. No generated app screens are used.

| Path | Source / use | Dimensions | Notes |
| --- | --- | --- | --- |
| `public/media/ocr-demo.mp4` | User-supplied OCR demo; scanning section | 1080 × 1920, 9:16; 18.517 seconds; 1,647,723 bytes | H.264 video and silent AAC stereo. Fast-start metadata moved ahead of media data without re-encoding or changing the media payload. Source attached only after Play. |
| `public/media/ocr-scanning-promo.webp` | Requested promotional poster | **Missing**; recommend 1080 × 1920, 9:16, under 100 KB | Automatically used on the next build when supplied. Until then, the authentic `public/screenshot-ocr-review.webp` is the poster; no broken URL is rendered. |
| `public/app-phone.webp` | Existing `app-phone.png`; hero dashboard | 720 × 1280, 9:16; ~43 KB | Eager, high priority. Existing June 2026 demo data and Cubelated greeting; replace with a current, sanitized dashboard when available. The original decorative phone frame is retained. |
| `public/screenshot-ocr-review.webp` | Supplied `891705_0.jpg`; scan review | 700 × 1501; ~41 KB | Genuine review UI, no document image. Shows three reminders, so the visible caption explains plan-dependent settings. |
| `public/screenshot-renewal-checklist.webp` | Supplied `891706_0.jpg`; Renewal Assistant | 700 × 1501; ~45 KB | Genuine passport checklist and progress. Keep sources and informational caveats readable. |
| `public/logo.webp` | Existing `logo.png`; header/footer | 128 × 128; ~3 KB | Same logo; original header/footer sizing restored. Original PNG remains available. |
| `public/google-play-logo.svg` | Existing Google Play mark | 19 × 21 rendered | Decorative icon beside explicit CTA text. |
| `public/social-preview.png` | Existing social image, refreshed with current message and authentic dashboard | 1200 × 630 | Keep this URL stable for Open Graph/Twitter. |
| `public/screenshot-template.webp` | Optimized existing `screenshot-template.png` | 640 × 1138, ~34 KB | Restored in the original template feature layout. Described as a general picker; selected country examples appear separately as text. |
| `public/screenshot-calendar.webp` | Optimized existing `screenshot-calendar.png` | 640 × 1138, ~30 KB | Restored in the original calendar feature section; lazy-loaded. |
| `public/avatars/1.webp` through `4.webp` | Existing illustrated avatars | 256 × 256 | Original cloud-sync illustration restored. These are illustrations, not customer testimonials. |

The original PNG assets remain intact. WebP versions were resized and compressed without changing UI content. Supplied screenshots retain their full aspect ratio and are lazy-loaded below the fold. The original HTML widget illustration is retained and labeled as an illustration.

## Recommended replacements

- Replace `public/app-phone.webp` with a current demo dashboard: about 720 × 1280 or 1080 × 1920, transparent frame if retaining the existing composition. Update the hero `width`/`height` if the ratio changes. Integration: the hero in `src/pages/LandingPage.tsx` and the single preload in `index.html`.
- Add a current country-grouped picker at `public/screenshot-country-templates.webp`: 700–900 px wide, roughly 9:19 portrait. Use demo entries only. Integrate in `Templates` in `src/components/landing/ProductHighlights.tsx`; the current section is complete without it. Do not re-label the old picker as a current country screenshot.
- Future scan/checklist replacements should overwrite `public/screenshot-ocr-review.webp` and `public/screenshot-renewal-checklist.webp`, ideally keeping 700 × 1501. Update dimensions, alt text, and captions in `FeatureVideo` / `FeatureScreenshot` usage if content or aspect ratio changes. Review screenshots for private names, IDs, attachments, account addresses, and tokens before publishing.
- Prefer WebP or AVIF, a useful source resolution near 2× rendered width, and approximately 30–100 KB per portrait. Do not stretch, invent, or silently change sample scan results.

## OCR video integration

The supplied clip is now integrated inline in the scanning section through `src/components/FeatureVideo.tsx`. See [integration details and checks](ocr-video-integration.md). The original screenshot remains the fallback if the video is absent at build time or cannot load. It also serves as the temporary poster while the requested promotional WebP is missing.

Keep the clip at `public/media/ocr-demo.mp4`. For replacements, inspect privacy, codec, audio, duration, aspect ratio, and fast-start suitability, then update `src/content/ocr-video.ts`. The build validates its byte length for the Worker's range responses. Preserve user confirmation before saving in the demonstrated workflow. Rebuild after adding the requested poster; use its genuine app UI and update poster dimensions in `src/content/media.ts` if its source dimensions differ from 1080 × 1920. Avoid replacing a silent clip with narrated audio without captions or an equivalent accessible alternative.

## Future optional videos

If a genuine app recording is supplied, add `public/renewables-demo.mp4` and `public/renewables-demo-poster.webp`. Aim for 15–30 seconds, portrait 720 × 1280 or landscape 1280 × 720, H.264 MP4, a small download (ideally under 5 MB), no personal data. Provide native controls, a transcript/captions for meaningful audio, and text fallback. Use `preload="none"` or load after interaction; never autoplay with sound. Keep the page fully useful without playback and respect reduced-motion preferences.
