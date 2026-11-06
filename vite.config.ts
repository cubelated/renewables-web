import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __OCR_DEMO_AVAILABLE__: JSON.stringify(existsSync(fileURLToPath(new URL("./public/media/ocr-demo.mp4", import.meta.url)))),
    __OCR_POSTER_AVAILABLE__: JSON.stringify(existsSync(fileURLToPath(new URL("./public/media/ocr-scanning-promo.webp", import.meta.url)))),
  },
});
