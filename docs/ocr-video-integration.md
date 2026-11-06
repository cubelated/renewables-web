# OCR demonstration integration

The OCR section pairs the requested heading and copy with one inline, native HTML5 player. Desktop keeps text on the left and a vertical video on the right; narrow screens place text first and the player below. Following owner feedback, it now uses the original landing page's typography and rounded feature styling. Pricing facts, FAQs, metadata, legal pages, and API are retained. No new dependencies, video service, modal, analytics, or production deployment.

## Media inspection

- `public/media/ocr-demo.mp4` is present: **1,647,723 bytes** (~1.65 MB / 1.57 MiB), **18.517 seconds**, **1080 × 1920**, 9:16. It is not unusually large and was not transcoded.
- MP4 sample entries are `avc1` (H.264) and `mp4a` (AAC). Chrome decoded the recording and its audio successfully. Decoded stereo audio has zero RMS/peak across the entire clip: it is silent, with no spoken instructions. No caption file was supplied. The component accepts an optional caption track for future recordings.
- Reviewed one frame per second plus full-resolution key frames. The clip shows image selection, cropping, and the detected-details review sheet, with an Apply action available. It does **not** demonstrate completion of saving an item, so the copy does not claim that. Surrounding text explains the actions and the need for review.
- The card has a portrait and identifying fields. The user explicitly confirmed in this session that it is a public specimen or sanitized demo. No emails or authentication tokens were observed in the reviewed frames. Use equally sanitized media for replacements; do not infer permission or specimen status for another recording.
- The MP4 originally had `moov` after `mdat`. It was losslessly repackaged to put `moov` first, with chunk offsets adjusted. The media payload was checked byte-for-byte by SHA-256 and is unchanged; dimensions, duration, quality, audio, and file size are unchanged. The working original backup and one-off optimization helper are ignored under `.qa/`.
- **Missing:** `public/media/ocr-scanning-promo.webp`. The player currently uses the existing genuine `/screenshot-ocr-review.webp` (~41 KB). Add the intended promotional screenshot and rebuild to select it automatically. Do not publish a fabricated poster or duplicate the fallback under a misleading filename.

## Playback and accessibility

`FeatureVideo` owns its state and playback lifecycle. A labeled semantic button overlays the native poster. The video has `preload="none"` and **no `src` until direct interaction**, so scrolling to it does not request the MP4. The click attaches the source, enables native controls, focuses the player, and calls `play()` synchronously with user activation, including Safari's requirements. `playsInline` supports inline mobile playback.

Native controls handle pause, seek, fullscreen where supported, and replay. There is no autoplay or loop. Paused playback never resumes merely because it re-enters the viewport. Playback pauses when the page is hidden, on page exit, or when the video scrolls out of view; fullscreen/picture-in-picture is exempt from the intersection pause. Observers/listeners are removed and playback resources released on unmount.

The aspect-ratio frame reserves layout space before playback, uses `object-fit: contain`, and does not crop app controls or add a fake phone frame. A visible focus ring, large Play target, accessible video name/description, surrounding explanation, and native controls provide keyboard support. Reduced-motion styles apply. Without JavaScript, the poster and a direct MP4 link remain available. Missing video files produce a static screenshot at build time; media load errors also replace the player with that screenshot and an announced status.

The adjacent **Try Renewables Free** CTA uses the verified Google Play destination. The visible **Use Web App** alternative explicitly explains manual entry and the absence of web OCR. Both use the existing campaign-filtering/CTA attributes, with locations `ocr-video-play-store` and `ocr-video-web`. No events are collected.

## Delivery and maintenance

The MP4 is a public static asset, served through the existing Worker for this exact path only. [Cloudflare currently documents that static assets ignore Range requests](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/#range-requests), which affects some native video clients. `src/worker/video.ts` provides single-range GETs, suffix/open-ended ranges, correct `206`/`416` responses, `If-Range` handling, bodyless HEAD, and accurate `video/mp4`, `Content-Length`, `Content-Range`, and `Accept-Ranges` headers. Multi-range/unknown-unit requests safely receive the full representation. It streams slices and uses Workers' `FixedLengthStream`, rather than buffering the entire clip.

The asset binding may omit its internal Content-Length. `src/content/ocr-video.ts` supplies inspected metadata; the prerender build fails if the actual video byte length differs. This prevents stale range sizes after replacement. Missing files remain a supported screenshot fallback. Regenerate binding types with `npm run cf-typegen`; this writes the small generated `src/worker/env.d.ts` while retaining the pinned runtime declarations. Neither compatibility date nor dependency versions were changed.

After a manual deployment, verify the **production** responses without downloading the full recording:

```powershell
curl.exe --head https://renewables.cubelated.com/media/ocr-demo.mp4
curl.exe --header "Range: bytes=0-1" --dump-header - --output NUL https://renewables.cubelated.com/media/ocr-demo.mp4
```

Expect HEAD `200` with `Content-Type: video/mp4`, `Content-Length: 1647723`, and `Accept-Ranges: bytes`; the range GET should be `206`, `Content-Length: 2`, and `Content-Range: bytes 0-1/1647723`. Production headers cannot be confirmed for this new file until it is deployed. Existing manual deployment instructions remain in [landing refresh notes](landing-refresh.md#manual-deployment).

## Files changed for this integration

- UI: `src/components/FeatureVideo.tsx`, `src/components/landing/ProductHighlights.tsx`, `src/react-app/index.css`.
- Media configuration: `src/content/media.ts`, `src/content/ocr-video.ts`, `vite.config.ts`, `src/react-app/vite-env.d.ts`.
- Delivery: `src/worker/video.ts`, `src/worker/index.ts`, generated `src/worker/env.d.ts`, `wrangler.json`.
- Build/verification: `src/react-app/entry-server.tsx`, `scripts/prerender.mjs`, `scripts/validate-seo.mjs`, `scripts/feature-video.test.mjs`, `scripts/video-range.test.mjs`, `package.json`, `eslint.config.js`.
- Media: `public/media/ocr-demo.mp4` (lossless fast-start optimization of the supplied file).
- Documentation: this file, `docs/landing-media-assets.md`, and `docs/landing-refresh.md`.

## Validation results

- `npm ci`: passed; dependencies and lockfile unchanged.
- `npm run lint`: passed, zero errors; two unused-disable warnings remain in the unchanged generated runtime declarations. Ignored `.wrangler` temporary build output is now excluded from linting.
- `npm test`: **20 passed**, covering attribution, source-free video prerendering, missing-video fallback, range bytes across stream boundaries, suffix/open-ended/invalid ranges, HEAD, If-Range, Cloudflare's missing internal size header, and cancellation cleanup.
- `npm run build` and `npm run check`: passed, including prerendered output for all five pages and a deployment dry run. The video is copied to `dist/media/ocr-demo.mp4`; the poster URL resolves to the real existing screenshot. No production deployment was performed.
- Headless desktop Chrome at **320, 375, 768, and 1440 px**: poster, keyboard Play, native keyboard Pause, seeking, replay, focus, off-screen pause, background pause, reduced motion, missing-file (404) fallback, and JavaScript-disabled direct-link fallback passed. One player only; no horizontal overflow. The MP4 was **not requested before interaction**, including after scrolling the poster into view. Player dimensions remained stable and observed local CLS was **0** at each width, before and after playback. These are local unthrottled checks, not field performance results.
- Actual local Worker HTTP tests passed: full GET/HEAD, Safari-style `bytes=0-1`, middle/suffix requests, invalid ranges, exact returned bytes, Content-Type/Content-Length/Content-Range/Accept-Ranges, existing home/legal/support/API routes, and 404 behavior. The full browser and HTTP suites passed again on **preinstalled Wrangler 4.156.1 at the unchanged `2026-06-22` compatibility date**. This newer CLI was already available in the adjacent main app checkout; no package was installed or changed. Production header checks and real-device playback remain necessary after manual deployment.
- An earlier attempt with this repository's older pinned CLI required a local-only compatibility-date override and emitted connection-cancellation diagnostics. Those diagnostics did not recur with the newer preinstalled runtime. The final evidence files reflect the newer-runtime pass. The pinned package versions and production compatibility date were preserved.
- Real Android Chrome, iOS Safari, and deployed production video responses were **not tested**. No caption track was tested because none was supplied and the inspected recording is silent.
- `git diff --check`: passed.

Ignored local evidence: `.qa/video-browser-results.json`, `.qa/video-http-results.json`, `.qa/ocr-video-320-poster.png`, `.qa/ocr-video-375-poster.png`, `.qa/ocr-video-768-poster.png`, `.qa/ocr-video-1440-poster.png`, review-state screenshots, and `.qa/ocr-video-error-fallback.png`. Four viewport layouts and the desktop/mobile preview states were visually inspected.
