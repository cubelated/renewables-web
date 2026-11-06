import { ocrVideo } from "./ocr-video";

// Vite checks actual files for both client and prerender builds. Missing media
// falls back to the genuine existing review image instead of a broken player.
export const ocrMedia = {
  width: ocrVideo.width,
  height: ocrVideo.height,
  src: __OCR_DEMO_AVAILABLE__ ? "/media/ocr-demo.mp4" : null,
  poster: __OCR_POSTER_AVAILABLE__ ? "/media/ocr-scanning-promo.webp" : "/screenshot-ocr-review.webp",
  posterWidth: __OCR_POSTER_AVAILABLE__ ? 1080 : 700,
  posterHeight: __OCR_POSTER_AVAILABLE__ ? 1920 : 1501,
} as const;

