import assert from "node:assert/strict";
import test from "node:test";
import { CALCULATOR_LANGUAGES, CALCULATOR_LOCALES, calculatorLocaleForPath } from "../src/content/calculator-locales.ts";
import { calculatorCopy } from "../src/content/expiry-calculator.ts";

test("every interface language has one unique, public calculator URL", () => {
  assert.deepEqual([...CALCULATOR_LANGUAGES].sort(), Object.keys(calculatorCopy).sort());
  assert.equal(CALCULATOR_LOCALES.en.path, "/tools/expiry-calculator");
  assert.equal(CALCULATOR_LOCALES["zh-TW"].path, "/zh-tw/tools/expiry-calculator");
  assert.equal(CALCULATOR_LOCALES["id-ID"].path, "/id/tools/expiry-calculator");
  assert.equal(new Set(Object.values(CALCULATOR_LOCALES).map((locale) => locale.path)).size, 3);
  for (const [language, locale] of Object.entries(CALCULATOR_LOCALES)) {
    const url = new URL(locale.path, "https://renewables.cubelated.com");
    assert.equal(url.search, ""); assert.equal(url.hash, "");
    assert.equal(calculatorLocaleForPath(url.pathname)?.language, language);
  }
});

test("unsupported language paths stay unknown instead of becoming English duplicates", () => {
  for (const path of ["/fr/tools/expiry-calculator", "/zh/tools/expiry-calculator", "/id/tools/unknown", "/tools/expiry-calculator-extra"]) {
    assert.equal(calculatorLocaleForPath(path), null);
  }
});

test("localized search metadata and social descriptions are complete and distinct", () => {
  const locales = Object.values(CALCULATOR_LOCALES);
  for (const key of ["title", "description", "imageAlt", "browserRequirements"]) {
    assert.equal(new Set(locales.map((locale) => locale[key])).size, locales.length);
    assert(locales.every((locale) => locale[key].trim().length > 10));
  }
  assert.deepEqual(locales.map((locale) => locale.ogLocale), ["en_US", "zh_TW", "id_ID"]);
  assert(locales.every((locale) => locale.features.length === 6));
});
