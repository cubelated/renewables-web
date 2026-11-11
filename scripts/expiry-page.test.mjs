import assert from "node:assert/strict";
import test from "node:test";
import { createServer as createHttpServer } from "node:http";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

test("tool prerenders useful content with a stable clock and no visitor inputs", async () => {
  // SSR needs no listening HMR port; keep parallel Vite test servers isolated.
  const hmrServer = createHttpServer();
  const server = await createServer({ server: { middlewareMode: true, hmr: { server: hmrServer } }, appType: "custom", optimizeDeps: { noDiscovery: true, entries: [] } });
  try {
    const { default: Page } = await server.ssrLoadModule("/src/pages/ExpiryCalculatorPage.tsx");
    const first = renderToString(createElement(Page));
    const second = renderToString(createElement(Page));
    assert.equal(first, second);
    assert.equal([...first.matchAll(/<h1\b/g)].length, 1);
    assert(first.includes("Expiry date calculator"));
    assert(first.includes("How expiry countdowns work"));
    assert(first.includes("How date differences are counted") && first.includes("Choosing a date format"));
    assert(first.includes("185 days"));
    assert(first.includes("Your device’s current date"));
    assert(first.includes('aria-pressed="true"'));
    assert(first.includes('lang="en"'));
    assert(!first.includes("Days remaining: 185"));
    assert(first.includes('id="date-expiry"'));
    assert(first.includes('id="calc-language"') && first.includes('aria-haspopup="menu"'));
    assert(!first.includes('<select id="calc-language"'));
    assert(first.includes('role="combobox"') && !first.includes("<optgroup"));
    assert(first.includes('value="gregorian" selected=""'));
    assert(first.includes('value="buddhist"') && first.includes('value="japanese"'));
    assert(first.indexOf('id="date-expiry"') < first.indexOf('id="calculator-settings"'));
    assert(first.includes('id="calc-input-format"') && first.includes('id="calc-output-format"'));
    assert(!/<details[^>]*class="calc-settings"[^>]*\bopen(?:[=\s>])/.test(first));
    assert(!/<details[^>]*class="calc-help"[^>]*\bopen(?:[=\s>])/.test(first));
    assert(first.includes('class="calc-help"') && first.includes("How it works"));
    assert(!first.includes('class="calc-reminders"') && !first.includes('class="calc-button-copy"'));
    assert(!first.includes('class="calc-app-features"') && !first.includes('class="calc-other-calendars"'));
    const { getPageSeo, INDEXED_PATHS } = await server.ssrLoadModule("/src/seo.ts");
    const seo = getPageSeo("/tools/expiry-calculator/");
    assert(INDEXED_PATHS.includes("/tools/expiry-calculator"));
    assert.equal(seo.canonical, "https://renewables.cubelated.com/tools/expiry-calculator");
    assert(seo.robots.startsWith("index, follow"));
    assert(!JSON.stringify(seo.structuredData).includes("FAQPage"));
    assert.equal(seo.title, "Free Expiry Date Calculator & Calendar Converter | Renewables");
    const { default: App } = await server.ssrLoadModule("/src/react-app/App.tsx");
    const { renderSeoHead } = await server.ssrLoadModule("/src/lib/seo-head.ts");
    const { calculatorCopy } = await server.ssrLoadModule("/src/content/expiry-calculator.ts");
    const { CALCULATOR_LOCALES } = await server.ssrLoadModule("/src/content/calculator-locales.ts");
    for (const locale of Object.values(CALCULATOR_LOCALES)) {
      const body = renderToString(createElement(App, { path: locale.path }));
      assert.equal(body, renderToString(createElement(App, { path: locale.path })));
      assert(body.includes(calculatorCopy[locale.language].title));
      assert(body.includes(calculatorCopy[locale.language].guides[0][1]));
      assert(body.includes(calculatorCopy[locale.language].faqs[0][0]));
      assert(body.includes(`lang="${locale.language}"`));
      assert(body.includes('value="gregorian" selected=""'));
      const localizedSeo = getPageSeo(locale.path);
      assert.equal(localizedSeo.language, locale.language);
      assert.equal(localizedSeo.canonical, `https://renewables.cubelated.com${locale.path}`);
      const head = renderSeoHead(localizedSeo);
      for (const alternate of Object.values(CALCULATOR_LOCALES)) {
        assert(head.includes(`hreflang="${alternate.language}" href="https://renewables.cubelated.com${alternate.path}"`));
        assert(body.includes(`href="${alternate.path}"`));
      }
      assert(head.includes('hreflang="x-default" href="https://renewables.cubelated.com/tools/expiry-calculator"'));
    }
    assert(getPageSeo("/fr/tools/expiry-calculator").robots.startsWith("noindex"));
  } finally { await server.close(); }
});
