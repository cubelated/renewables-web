/** Dependency-free Chromium integration checks. Start the local Worker first; see docs/expiry-calculator.md. */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const base = process.env.CALCULATOR_BASE_URL ?? "http://127.0.0.1:8789";
const route = `${base}/tools/expiry-calculator`;
const languagePages = [
  { language: "en", path: "/tools/expiry-calculator", heading: "Expiry date calculator", guide: "How expiry countdowns work" },
  { language: "zh-TW", path: "/zh-tw/tools/expiry-calculator", heading: "到期日計算器", guide: "到期倒數如何計算？" },
  { language: "id-ID", path: "/id/tools/expiry-calculator", heading: "Kalkulator kedaluwarsa", guide: "Cara kerja hitung mundur kedaluwarsa" },
];
const executable = process.env.BROWSER_EXECUTABLE ?? [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find(existsSync);
assert(executable, "Set BROWSER_EXECUTABLE to an installed Chromium browser");
const html = await fetch(route);
assert.equal(html.status, 200);
assert((await html.text()).includes("How expiry countdowns work"));
const head = await fetch(route, { method: "HEAD" });
assert.equal(head.status, 200);
const missing = await fetch(`${base}/tools/does-not-exist`);
assert.equal(missing.status, 404);
const trailing = await fetch(`${route}/`, { redirect: "manual" });
assert([301, 307, 308].includes(trailing.status));
assert.equal(new URL(trailing.headers.get("location"), base).pathname, "/tools/expiry-calculator");
for (const page of languagePages) {
  const response = await fetch(`${base}${page.path}`);
  assert.equal(response.status, 200);
  const source = await response.text();
  assert(source.includes(`<html lang="${page.language}">`) && source.includes(page.heading) && source.includes(page.guide));
  assert(source.includes(`rel="canonical" href="https://renewables.cubelated.com${page.path}"`));
  assert.equal((await fetch(`${base}${page.path}`, { method: "HEAD" })).status, 200);
}
assert.equal((await fetch(`${base}/fr/tools/expiry-calculator`)).status, 404);

const output = path.resolve(".qa");
await mkdir(output, { recursive: true });
const port = 9400 + (process.pid % 1000);
const browser = spawn(executable, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--disable-background-timer-throttling", `--remote-debugging-port=${port}`, `--user-data-dir=${path.join(output, `expiry-browser-profile-${process.pid}`)}`, "about:blank"], { windowsHide: true, stdio: "ignore" });
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let socket;
let call;
try {
  let target;
  for (let i = 0; i < 60; i++) {
    try { target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT", signal: AbortSignal.timeout(500) })).json(); break; }
    catch { await pause(150); }
  }
  assert(target, "Chromium debugging endpoint did not start");
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let sequence = 0;
  const pending = new Map();
  const events = [];
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id) { events.push(message); return; }
    const item = pending.get(message.id);
    if (!item) return;
    pending.delete(message.id); clearTimeout(item.timer);
    if (message.error) item.reject(new Error(JSON.stringify(message.error))); else item.resolve(message.result);
  };
  call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timed out: ${method}`)); }, 10000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true, userGesture: true });
    assert(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const waitFor = async (expression) => {
    for (let i = 0; i < 80; i++) { if (await evaluate(expression)) return; await pause(80); }
    throw new Error(`Condition did not become true: ${expression}`);
  };
  const change = async (selector, value) => {
    if (selector === "#calc-language") {
      await evaluate(`document.querySelector('#calc-language').click()`); await pause(70);
      await evaluate(`document.querySelector('[data-language="${value}"]').click()`); await pause(70);
      await waitFor(`document.documentElement.lang===${JSON.stringify(value)}`);
      assert.equal(await evaluate("location.pathname"), languagePages.find((page) => page.language === value).path);
      return;
    }
    if (selector === "#calc-zone") {
      await evaluate(`document.querySelector('#calc-zone').closest('details').open=true`);
      await evaluate(`document.querySelector('#calc-zone').focus();document.querySelector('#calc-zone').click()`); await pause(70);
      await evaluate(`(() => {const el=document.querySelector('#calc-zone');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,${JSON.stringify(value === "device" ? "" : value)});el.dispatchEvent(new Event('input',{bubbles:true}));})()`); await pause(70);
      await evaluate(`document.querySelector('[role="option"][data-value="${value}"]').click()`); await pause(70);
      return;
    }
    await evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) throw Error('Missing input: '+${JSON.stringify(selector)}); const details=el.closest('details');if(details)details.open=true; const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, ${JSON.stringify(value)}); el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', {bubbles:true})); })()`);
    await pause(70);
  };
  const click = async (selector) => { await evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});const details=el.closest('details');if(details)details.open=true;el.click()})()`); await pause(70); };
  const resultText = () => evaluate(`document.querySelector('.calc-result-content').textContent`);
  const goMode = async (index) => click(`.calc-modes button:nth-child(${index + 1})`);
  await call("Page.enable"); await call("Runtime.enable"); await call("Network.enable"); await call("Page.bringToFront");
  await call("Emulation.setTimezoneOverride", { timezoneId: "America/Los_Angeles" });
  await call("Page.addScriptToEvaluateOnNewDocument", { source: `
    window.__testNow = Date.parse('2026-11-10T16:30:00Z');
    const RealDate = Date;
    window.Date = class extends RealDate { constructor(...args) { super(...(args.length ? args : [window.__testNow])); } static now() { return window.__testNow; } };
    Object.defineProperty(navigator, 'clipboard', {configurable:true, value:{writeText:async text => {if(window.__denyCopy)throw Error('Denied');window.__copied=text;}}});
    window.__layoutShift=0;
    new PerformanceObserver(list=>list.getEntries().forEach(e=>{if(!e.hadRecentInput)window.__layoutShift+=e.value})).observe({type:'layout-shift',buffered:true});
  ` });
  const navigate = async () => {
    await call("Page.navigate", { url: route });
    await waitFor(`document.querySelector('#calc-zone')?.value.includes('America/Los_Angeles')`);
    assert.equal(await evaluate(`document.querySelector('#calc-calendar').value`), "gregorian");
    assert.equal(await evaluate(`document.querySelector('#calc-calendar').options.length`), 4);
    assert.equal(await evaluate(`document.querySelector('.calc-settings #calc-language')`), null);
    assert(await evaluate(`!!document.querySelector('header nav #calc-language svg')&&!document.querySelector('#calc-language').textContent.trim()`));
    assert.equal(await evaluate(`document.querySelector('#calc-zone').getAttribute('role')`), "combobox");
  };
  const reports = [];
  for (const width of [320, 375, 768, 1440]) {
    await call("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
    await navigate();
    await pause(200);
    const initialCls = await evaluate("window.__layoutShift");
    assert.equal(await evaluate(`document.querySelector('#calculator-settings').open`), false);
    if (width < 768) assert(await evaluate(`document.querySelector('#date-expiry').getBoundingClientRect().top < 550`), `Primary date input is too low at ${width}px`);
    await change("#calc-zone", "Asia/Taipei");
    await change("#date-expiry", "2027-05-15");
    assert.match(await resultText(), /185/);
    assert.equal(await evaluate(`document.querySelector('.calc-result-number').textContent`), "185");
    await evaluate(`document.querySelector('#calc-zone').click()`); await pause(70);
    assert(await evaluate(`document.documentElement.scrollWidth<=innerWidth`), `Open timezone dropdown overflows at ${width}px`);
    await evaluate(`document.querySelector('#calc-zone').dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))`); await pause(70);
    await click("#calc-language");
    assert(await evaluate(`document.documentElement.scrollWidth<=innerWidth`), `Open language menu overflows at ${width}px`);
    await evaluate(`document.activeElement.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))`); await pause(70);
    const layouts = [];
    for (const language of ["en", "zh-TW", "id-ID"]) {
      await change("#calc-language", language);
      for (let i = 0; i < 4; i++) {
        await goMode(i);
        const metrics = await evaluate(`({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,input:document.querySelector('.calc-input-card').getBoundingClientRect().toJSON(),result:document.querySelector('.calc-result-card').getBoundingClientRect().toJSON()})`);
        assert(metrics.scrollWidth <= width, `${language}, mode ${i}, ${width}px overflows`);
        assert.equal(metrics.h1, 1);
        if (width < 768) assert(metrics.result.top > metrics.input.top, "Mobile inputs must precede the result");
        layouts.push({ language, mode: i, scrollWidth: metrics.scrollWidth });
      }
    }
    await change("#calc-language", "en"); await goMode(0);
    await evaluate(`document.querySelector('#calculator-settings').open=false;window.scrollTo({top:0,behavior:'instant'})`); await pause(70);
    const { data } = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    await writeFile(path.join(output, `expiry-${width}.png`), Buffer.from(data, "base64"));
    reports.push({ width, layouts, initialCls, scriptedSessionCls: await evaluate("window.__layoutShift") });
  }

  // Freeze today to exercise timezone changes, not a hardcoded calculator clock.
  await navigate();
  await change("#calc-zone", "Asia/Taipei");
  await change("#date-expiry", "2026-11-11");
  assert.match(await resultText(), /Due today/);
  assert.equal(await evaluate(`document.querySelector('.calc-result-number').textContent`), "0");
  await change("#calc-zone", "UTC");
  assert.equal(await evaluate(`document.querySelector('.calc-result-number').textContent`), "1");
  assert.equal(await evaluate(`document.querySelector('#date-expiry').value`), "2026-11-11");
  for (const [zone, expected] of [["Asia/Jakarta", "1"], ["Asia/Makassar", "0"], ["Asia/Jayapura", "0"]]) {
    await change("#calc-zone", zone);
    assert.equal(await evaluate(`document.querySelector('.calc-result-number').textContent`), expected);
  }
  await change("#calc-zone", "Asia/Taipei");
  await change("#date-expiry", "2026-11-10");
  assert.match(await resultText(), /Days overdue/);
  await change("#date-expiry", "2027-05-15");
  await change("#calc-language", "zh-TW");
  assert.equal(await evaluate(`document.querySelector('#calc-calendar').value`), "gregorian");
  assert.equal(await evaluate(`document.querySelector('#date-expiry').value`), "2027-05-15");
  assert.match(await resultText(), /距離到期還有幾天/);
  await change("#calc-language", "id-ID");
  assert.match(await resultText(), /hingga kedaluwarsa/);
  await change("#calc-language", "en");
  for (const [calendar, expected] of [["buddhist", "2570/5/15"], ["japanese", "R9/5/15"], ["roc", "116/5/15"], ["gregorian", "2027-05-15"]]) {
    await change("#calc-calendar", calendar);
    assert.equal(await evaluate(`document.querySelector('#date-expiry').value`), expected);
    assert.equal(await evaluate(`document.querySelector('.calc-result-number').textContent`), "185");
  }
  await click(".calc-button-copy");
  assert.match(await evaluate("window.__copied"), /185/);
  assert.match(await evaluate("window.__copied"), /Asia\/Taipei/);
  await evaluate("window.__denyCopy=true"); await click(".calc-button-copy");
  assert(await evaluate(`document.body.textContent.includes('Copy unavailable')`));
  await evaluate("window.__denyCopy=false");
  await click(".calc-reminder-buttons button:nth-child(3)");
  assert.equal(await evaluate(`document.activeElement.id`), "calc-amount");
  assert.equal(await evaluate(`document.querySelector('#calc-amount').value`), "30");
  assert.match(await resultText(), /2027-04-15/);
  await change("#calc-amount", "14"); assert.match(await resultText(), /2027-05-01/);
  await change("#calc-amount", "1.5");
  assert(await evaluate(`document.querySelector('#calc-amount').getAttribute('aria-invalid')==='true'`));
  assert.equal(await evaluate(`document.querySelector('.calc-button-copy')`), null);
  await click(".calc-reset");
  assert.equal(await evaluate(`document.querySelector('#date-start').value`), "");
  assert.equal(await evaluate(`document.querySelector('#calc-amount').value`), "30");
  assert.match(await resultText(), /Enter a date/);
  await change("#date-start", "2027-01-31"); await change("#calc-operation", "add"); await change("#calc-amount", "1"); await change("#calc-unit", "months");
  assert.match(await resultText(), /2027-02-28/);
  await change("#date-start", "2024-02-29"); await change("#calc-unit", "years");
  assert.match(await resultText(), /2025-02-28/);
  await goMode(1); await change("#date-start", "2026-12-31"); await change("#date-end", "2027-01-01");
  assert.equal(await evaluate(`document.querySelector('.calc-result-number').textContent`), "+1");
  await change("#date-end", "2026-12-30");
  assert.equal(await evaluate(`document.querySelector('.calc-result-number').textContent`), "-1");
  await goMode(3); await change("#calc-calendar", "roc"); await change("#calc-target-calendar", "gregorian");
  for (const value of ["115/11/11", "115.11.11", "115-11-11", "民國115年11月11日"]) {
    await change("#date-convert", value); assert.match(await resultText(), /2026-11-11/);
  }
  await change("#date-convert", "115/2/30");
  assert(await evaluate(`document.querySelector('#date-convert').getAttribute('aria-invalid')==='true'`));
  await change("#date-convert", "0/1/1"); assert.match(await resultText(), /ROC years 1/);
  await change("#date-convert", "115/11/11"); await change("#calc-calendar", "gregorian");
  assert.equal(await evaluate(`document.querySelector('#date-convert').value`), "2026-11-11");
  await change("#calc-target-calendar", "roc");
  await change("#date-convert", "1911-12-31"); assert.match(await resultText(), /ROC years 1/);
  await change("#calc-calendar", "roc");
  assert(await evaluate(`document.body.textContent.includes('unsupported date was cleared')`));

  // The combobox is a single flat list. Typing filters choices without changing the selected zone.
  await change("#calc-zone", "Europe/London");
  await evaluate(`document.querySelector('#calc-zone').focus();document.querySelector('#calc-zone').click()`); await pause(70);
  assert.equal(await evaluate(`document.querySelectorAll('#calc-zone-options [role=option]').length>100`), true);
  assert.equal(await evaluate(`document.querySelectorAll('#calc-zone-options optgroup,#calc-zone-options [role=group]').length`), 0);
  const searchZone = async (text) => {
    await evaluate(`(()=>{const el=document.querySelector('#calc-zone');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,${JSON.stringify(text)});el.dispatchEvent(new Event('input',{bubbles:true}));})()`); await pause(70);
  };
  const key = async (key, code, vk, text) => {
    await call("Input.dispatchKeyEvent", { type: "keyDown", key, code, windowsVirtualKeyCode: vk, ...(text ? { text } : {}) });
    await call("Input.dispatchKeyEvent", { type: "keyUp", key, code, windowsVirtualKeyCode: vk }); await pause(70);
  };
  await searchZone("Tokyo");
  assert.equal(await evaluate(`document.querySelectorAll('#calc-zone-options [role=option]').length`), 1);
  assert.match(await evaluate(`document.querySelector('.calc-today').textContent`), /Europe\/London/);
  await key("Escape", "Escape", 27);
  assert.equal(await evaluate(`document.querySelector('#calc-zone').value`), "Europe/London");
  await evaluate(`document.querySelector('#calc-zone').click()`); await searchZone("NoSuchZone");
  assert(await evaluate(`document.querySelector('.calc-zone-empty').textContent.includes('No matching')`));
  await searchZone("New York");
  assert(await evaluate(`document.querySelector('[data-value="America/New_York"]')!==null`));
  await searchZone("Tokyo"); await key("Enter", "Enter", 13, "\r");
  assert.equal(await evaluate(`document.querySelector('#calc-zone').value`), "Asia/Tokyo");
  assert.equal(await evaluate(`document.querySelector('#calc-zone').getAttribute('aria-expanded')`), "false");
  await evaluate(`document.querySelector('#calc-zone').click()`); await searchZone("Asia/Ja");
  await key("ArrowDown", "ArrowDown", 40); await key("Enter", "Enter", 13, "\r");
  assert.equal(await evaluate(`document.querySelector('#calc-zone').value`), "Asia/Jayapura");
  await click("#calc-language");
  assert.equal(await evaluate(`document.activeElement.dataset.language`), "en");
  await key("ArrowDown", "ArrowDown", 40); await key("Enter", "Enter", 13, "\r");
  assert.equal(await evaluate(`document.querySelector('.expiry-page').lang`), "zh-TW");
  assert.equal(await evaluate(`document.activeElement.id`), "calc-language");
  await click("#calc-language"); await key("Escape", "Escape", 27);
  assert.equal(await evaluate(`document.querySelector('#calc-language').getAttribute('aria-expanded')`), "false");
  await change("#calc-language", "en");
  await click("#calc-language"); await key("Tab", "Tab", 9);
  assert.equal(await evaluate(`document.activeElement===document.querySelector('.calc-modes button')`), true);
  assert.equal(await evaluate(`document.querySelector('#calc-language').getAttribute('aria-expanded')`), "false");

  await change("#calc-calendar", "buddhist"); await change("#calc-target-calendar", "gregorian"); await change("#date-convert", "2569/11/11");
  assert.match(await resultText(), /2026-11-11/);
  await change("#calc-calendar", "japanese");
  assert.equal(await evaluate(`document.querySelector('#date-convert').value`), "R8/11/11");
  await change("#date-convert", "R1/4/30"); assert.match(await resultText(), /within its stated era/);
  await change("#date-convert", "R1/5/1"); assert.match(await resultText(), /2019-05-01/);
  const representations = {gregorian:"2026-12-05",roc:"115/12/5",buddhist:"2569/12/5",japanese:"R8/12/5"};
  for(const [from,input] of Object.entries(representations)) {
    await change('#calc-calendar',from);await change('#date-convert',input);
    for(const [to,expected] of Object.entries(representations)) {
      await change('#calc-target-calendar',to);
      assert.equal(await evaluate(`document.querySelector('.calc-result-date').textContent`),expected,`${from} → ${to}`);
    }
  }
  await change('#calc-calendar','gregorian');await change('#calc-target-calendar','buddhist');
  await change('#calc-input-format','dmy');
  assert.equal(await evaluate(`document.querySelector('#date-convert').value`),'05/12/2026');
  await change('#calc-output-format','mdy');
  assert.equal(await evaluate(`document.querySelector('.calc-result-date').textContent`),'12/05/2569');
  await change('#calc-input-format','mdy');
  assert.equal(await evaluate(`document.querySelector('#date-convert').value`),'12/05/2026');
  await click('.calc-button-copy');assert.match(await evaluate('window.__copied'),/12\/05\/2569/);assert.match(await evaluate('window.__copied'),/2026-12-05/);
  await change('#calc-language','zh-TW');await change('#calc-output-format','long');
  assert.match(await evaluate(`document.querySelector('.calc-result-date').textContent`),/2569/);
  await change('#calc-language','en');await change('#calc-input-format','native');await change('#calc-output-format','ymd');await change('#calc-target-calendar','japanese');
  await click('.calc-swap');
  assert.equal(await evaluate(`document.querySelector('#calc-calendar').value`),'japanese');
  assert.equal(await evaluate(`document.querySelector('#date-convert').value`),'R8/12/5');
  assert.equal(await evaluate(`document.querySelector('.calc-result-date').textContent`),'2026-12-05');

  // Exercise ordinary keyboard access and visible focus.
  await evaluate(`document.querySelector('.calc-modes button').focus()`);
  await call("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
  await call("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
  assert.equal(await evaluate(`document.activeElement===document.querySelector('.calc-modes button:nth-child(2)')`), true);
  assert.equal(await evaluate(`getComputedStyle(document.activeElement).outlineStyle`), "solid");
  await call("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13, text: "\r" });
  await call("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await pause(80);
  assert.equal(await evaluate(`document.querySelector('.calc-modes button:nth-child(2)').getAttribute('aria-pressed')`), "true");
  await call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  assert.equal(await evaluate(`getComputedStyle(document.documentElement).scrollBehavior`), "auto");

  // No calculations, form submits, or copy actions may cause requests or change URLs.
  await goMode(0); await change("#calc-calendar", "gregorian");
  await pause(200);
  const requestStart = events.filter((event) => event.method === "Network.requestWillBeSent").length;
  const originalUrl = await evaluate("location.href");
  await change("#date-expiry", "2033-08-19");
  await click(".calc-button-copy");
  await evaluate(`document.querySelector('form').requestSubmit()`); await pause(250);
  assert.equal(await evaluate("location.href"), originalUrl);
  assert.equal(events.filter((event) => event.method === "Network.requestWillBeSent").length, requestStart);
  const links = await evaluate(`Array.from(document.querySelectorAll('a')).map(a=>a.href)`);
  assert(links.every((link) => !link.includes("2033") && !link.includes("expiry=")));
  assert(links.includes("https://app.renewables.cubelated.com/"));
  assert(links.includes("https://play.google.com/store/apps/details?id=com.cubelated.renewly"));
  assert.equal(await evaluate("localStorage.length"), 0);
  assert.equal(await evaluate("sessionStorage.length"), 0);
  await navigate();
  assert.equal(await evaluate(`document.querySelector('#date-expiry').value`), "");

  // Language URLs update metadata without submitting or discarding calculator state.
  await change("#calc-zone", "Asia/Taipei"); await change("#date-expiry", "2027-05-15");
  await change("#calc-calendar", "roc");
  const savedDate = await evaluate(`document.querySelector('#date-expiry').value`);
  const languageRequestStart = events.filter((event) => event.method === "Network.requestWillBeSent").length;
  await change("#calc-language", "zh-TW");
  assert.equal(await evaluate(`document.querySelector('#date-expiry').value`), savedDate);
  assert.equal(await evaluate(`document.querySelector('#calc-calendar').value`), "roc");
  assert.equal(await evaluate(`document.querySelector('#calc-zone').value`), "Asia/Taipei");
  assert.equal(await evaluate(`document.querySelector('.calc-result-number').textContent`), "185");
  assert.equal(await evaluate("history.state"), null);
  const languageRequests = events.filter((event) => event.method === "Network.requestWillBeSent").slice(languageRequestStart);
  const browserAssets = new Set(["/favicon.ico", "/favicon.svg", "/favicon-96x96.png", "/apple-touch-icon.png", "/site.webmanifest", "/web-app-manifest-192x192.png", "/web-app-manifest-512x512.png"].map((path) => `${base}${path}`));
  assert(languageRequests.every(({ params }) => params.type !== "Document" && params.request.method === "GET" && browserAssets.has(params.request.url)), JSON.stringify(languageRequests.map(({ params }) => ({ type: params.type, url: params.request.url }))));
  assert.match(await evaluate("document.title"), /免費到期日/);
  await evaluate("history.back()"); await waitFor(`document.documentElement.lang==='en'`);
  assert.equal(await evaluate("location.pathname"), languagePages[0].path);
  assert.equal(await evaluate(`document.querySelector('#date-expiry').value`), savedDate);
  await evaluate("history.forward()"); await waitFor(`document.documentElement.lang==='zh-TW'`);
  assert.equal(await evaluate(`document.querySelector('#date-expiry').value`), savedDate);
  await navigate();
  // A focus event refreshes today across the selected zone's midnight.
  await change("#calc-zone", "Asia/Taipei"); await change("#date-expiry", "2026-11-11");
  await evaluate(`window.__testNow = Date.parse('2026-11-11T16:01:00Z');window.dispatchEvent(new Event('focus'))`);
  await waitFor(`document.querySelector('.calc-result-content').textContent.includes('Days overdue')`);

  for (const page of languagePages) {
    await call("Page.navigate", { url: `${base}${page.path}` });
    await waitFor(`document.querySelector('#calc-zone')?.value.includes('America/Los_Angeles')`);
    assert.equal(await evaluate("document.documentElement.lang"), page.language);
    assert.equal(await evaluate(`document.querySelector('h1').textContent`), page.heading);
    assert.equal(await evaluate(`document.querySelector('#calc-calendar').value`), "gregorian");
    assert.equal(await evaluate(`document.querySelector('#date-expiry').value`), "");
    assert.equal(await evaluate(`new URL(document.querySelector('link[rel=canonical]').href).pathname`), page.path);
    assert.equal(await evaluate(`document.querySelectorAll('link[rel=alternate][hreflang]').length`), 4);
    const graph = await evaluate(`JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@graph']`);
    assert.equal(graph.find((entry) => entry['@type'] === 'WebPage').inLanguage, page.language);
  }

  // The tool must also be discoverable from the homepage at navigation breakpoints.
  for (const width of [320, 375, 768, 1024, 1440]) {
    await call("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
    await call("Page.navigate", { url: base });
    await waitFor(`!!document.querySelector('header .menu-toggle')`);
    await pause(150);
    assert(await evaluate(`document.documentElement.scrollWidth<=innerWidth`), `Homepage overflows at ${width}px`);
    if (width < 1024) await click('header .menu-toggle');
    const navigation = width < 1024 ? '#mobile-navigation' : 'nav[aria-label="Main navigation"]';
    assert(await evaluate(`(() => {const link=document.querySelector(${JSON.stringify(navigation)}+' a[href="/tools/expiry-calculator"]');return !!link&&link.getBoundingClientRect().width>0&&link.getBoundingClientRect().right<=innerWidth})()`), `Calculator navigation link is missing or clipped at ${width}px`);
  }

  const exceptions = events.filter((event) => event.method === "Runtime.exceptionThrown");
  const hydrationErrors = events.filter((event) => event.method === "Runtime.consoleAPICalled" && JSON.stringify(event.params).match(/hydration|hydrated|Minified React error #(?:418|423|425)/i));
  assert.deepEqual(exceptions, []); assert.deepEqual(hydrationErrors, []);
  await call("Emulation.setScriptExecutionDisabled", { value: true });
  for (const page of languagePages) {
    await call("Page.navigate", { url: `${base}${page.path}` }); await pause(300);
    assert.equal(await evaluate("document.documentElement.lang"), page.language);
    assert.equal(await evaluate(`document.querySelector('h1').textContent`), page.heading);
    assert(await evaluate(`document.body.textContent.includes(${JSON.stringify(page.guide)})`));
    assert.equal(await evaluate(`document.querySelectorAll('noscript a[hreflang]').length`), 3);
  }
  const report = { http: "GET/HEAD 200; unknown route 404; trailing slash redirects", reports, checks: ["all modes and languages", "date validation", "copy success and denial", "reset", "ROC formats and boundaries", "Buddhist and Japanese inputs and calendar-preserving switches", "month/year clamping", "timezones and midnight rollover", "flat searchable timezone combobox with keyboard selection", "icon-only language menu with arrow, Escape and Tab support", "keyboard and visible focus", "reduced motion", "no calculation requests, storage, date URLs, or CTA prefills", "reload clears inputs", "hydration across different server/client zones", "content without JavaScript"], exceptions, hydrationErrors };
  await writeFile(path.join(output, "expiry-browser-results.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ http: report.http, widths: reports.map(({ width }) => width), layouts: reports.reduce((sum, item) => sum + item.layouts.length, 0), checks: report.checks, exceptions, hydrationErrors }, null, 2));
} finally {
  if (call && socket?.readyState === WebSocket.OPEN) { try { await call("Browser.close"); } catch { /* Process cleanup below. */ } }
  socket?.close(); browser.kill();
}
