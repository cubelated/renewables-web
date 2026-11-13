/** Local Chromium + Cloudflare Worker integration checks; no new browser dependency. */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const base = process.env.RESOURCE_BASE_URL ?? "http://127.0.0.1:8789";
const sitemap = await readFile("dist/sitemap.xml", "utf8");
const paths = [...sitemap.matchAll(/<loc>https:\/\/renewables\.cubelated\.com([^<]+)<\/loc>/g)].map((match) => match[1]);
const guideCount = paths.filter((route) => /^\/resources\/[^/]+$/.test(route)).length;
for (const route of paths) {
  for (const method of ["GET", "HEAD"]) assert.equal((await fetch(`${base}${route}`, { method })).status, 200, `${method} ${route}`);
}
for (const route of ["/resources/not-a-guide", "/resources/indonesian-passport-renewal-mars", "/id/resources/taiwan-arc-extension-students"]) assert.equal((await fetch(`${base}${route}`)).status, 404, route);
const redirect = await fetch(`${base}/resources/`, { redirect: "manual" });
assert([301, 307, 308].includes(redirect.status));
assert.equal(new URL(redirect.headers.get("location"), base).pathname, "/resources");
const filterHtml = await (await fetch(`${base}/resources?nationality=ID`)).text();
assert(filterHtml.includes('rel="canonical" href="https://renewables.cubelated.com/resources"'));

const executable = process.env.BROWSER_EXECUTABLE ?? ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "/usr/bin/chromium", "/usr/bin/google-chrome"].find(existsSync);
assert(executable, "Set BROWSER_EXECUTABLE to an installed Chromium");
const output = path.resolve(".qa");
await mkdir(output, { recursive: true });
const port = 9500 + process.pid % 1000;
const browser = spawn(executable, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", `--remote-debugging-port=${port}`, `--user-data-dir=${path.join(output, `resources-browser-${process.pid}`)}`, "about:blank"], { windowsHide: true, stdio: "ignore" });
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let socket, call;
try {
  let target;
  for (let i = 0; i < 60; i++) {
    try { target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT", signal: AbortSignal.timeout(500) })).json(); break; } catch { await pause(150); }
  }
  assert(target, "Chromium debugging did not start");
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  const pending = new Map(), events = [];
  let sequence = 0;
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id) { events.push(message); return; }
    const item = pending.get(message.id);
    if (!item) return;
    pending.delete(message.id); clearTimeout(item.timer);
    if (message.error) item.reject(new Error(JSON.stringify(message.error))); else item.resolve(message.result);
  };
  call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence, timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timed out: ${method}`)); }, 10000);
    pending.set(id, { resolve, reject, timer }); socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    assert(!result.exceptionDetails, JSON.stringify(result.exceptionDetails)); return result.result.value;
  };
  const waitFor = async (expression) => { for (let i = 0; i < 80; i++) { if (await evaluate(expression)) return; await pause(70); } throw Error(`Condition failed: ${expression}`); };
  const navigate = async (route) => { await call("Page.navigate", { url: `${base}${route}` }); await waitFor("document.readyState==='complete'"); await pause(150); };
  const change = async (id, value) => {
    await evaluate(`(()=>{const el=document.getElementById(${JSON.stringify(id)});const proto=el.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(el,${JSON.stringify(value)});el.dispatchEvent(new Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}));})()`); await pause(80);
  };
  const cards = () => evaluate("Array.from(document.querySelectorAll('[data-guide]'),el=>el.dataset.guide)");
  const assertAlphabeticalCards = async () => assert(await evaluate(`(()=>{const titles=Array.from(document.querySelectorAll('[data-guide] h3'),el=>el.textContent);const collator=new Intl.Collator(document.getElementById('resource-language').value,{sensitivity:'base',numeric:true});return titles.every((title,i)=>!i||collator.compare(titles[i-1],title)<=0)})()`));
  const assertLocaleSeo = async (language, route) => {
    const canonical = `https://renewables.cubelated.com${route}`;
    await waitFor(`document.documentElement.lang===${JSON.stringify(language)}&&document.querySelector('link[rel=canonical]')?.href===${JSON.stringify(canonical)}`);
    assert.equal(await evaluate("location.pathname"), route);
    assert.equal(await evaluate("document.head.querySelectorAll('title').length"), 1);
    assert.equal(await evaluate("document.head.querySelectorAll('link[rel=canonical]').length"), 1);
    const html = await readFile(`dist${route}/index.html`, "utf8");
    const decode = (value) => value.replaceAll("&quot;", '"').replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
    assert.equal(await evaluate("document.title"), decode(html.match(/<title[^>]*>([^<]*)<\/title>/)[1]));
    for (const [attribute, key] of [["name", "description"], ["property", "og:title"], ["property", "og:description"], ["property", "og:locale"], ["property", "og:url"], ["property", "og:image:alt"], ["name", "twitter:title"], ["name", "twitter:description"], ["name", "twitter:image:alt"]]) {
      const selector = `meta[${attribute}="${key}"]`;
      assert.equal(await evaluate(`document.head.querySelectorAll(${JSON.stringify(selector)}).length`), 1, selector);
      const expected = html.match(new RegExp(`<meta\\b[^>]*${attribute}="${key}"[^>]*content="([^"]*)"`))[1];
      assert.equal(await evaluate(`document.head.querySelector(${JSON.stringify(selector)}).content`), decode(expected), key);
    }
    const expectedAlternates = [...html.matchAll(/<link\b[^>]*rel="alternate"[^>]*hreflang="([^"]*)"[^>]*href="([^"]*)"/g)].map(([, language, href]) => [language, href]);
    assert.deepEqual(await evaluate("Array.from(document.head.querySelectorAll('link[rel=alternate]'),a=>[a.hreflang,a.href])"), expectedAlternates);
    assert.deepEqual(await evaluate("Array.from(document.head.querySelectorAll('script[type=\"application/ld+json\"]'),s=>JSON.parse(s.textContent))"), [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(([, text]) => JSON.parse(text)));
  };
  const key = async (key, code, vk) => { await call("Input.dispatchKeyEvent", { type: "keyDown", key, code, windowsVirtualKeyCode: vk }); await call("Input.dispatchKeyEvent", { type: "keyUp", key, code, windowsVirtualKeyCode: vk }); await pause(60); };
  await call("Page.enable"); await call("Runtime.enable"); await call("Network.enable");
  await call("Page.addScriptToEvaluateOnNewDocument", { source: "window.__resourceGeolocationCalls=0;Object.defineProperty(navigator,'geolocation',{get(){window.__resourceGeolocationCalls++;throw new Error('Resource finder must not request geolocation')}});" });
  // Prefill only an explicitly mapped residence, never citizenship or status.
  for (const [timezoneId, expected, residence] of [
    ["Asia/Taipei", ["id-passport-tw"], "TW"],
    ["Asia/Jakarta", ["id-passport-domestic"], "ID"],
    ["Asia/Jayapura", ["id-passport-domestic"], "ID"],
    ["UTC", ["id-passport-domestic", "id-passport-tw"], ""],
    ["Asia/Shanghai", ["id-passport-domestic", "id-passport-tw"], ""],
  ]) {
    await call("Emulation.setTimezoneOverride", { timezoneId }); await navigate("/resources");
    assert.equal(await evaluate("document.getElementById('resource-nationality').value"), "");
    assert.equal(await evaluate("document.getElementById('resource-residence').dataset.residenceSource"), residence ? "time-zone" : "unavailable");
    await change("resource-nationality", "ID"); await change("resource-document", "passport"); assert.deepEqual(await cards(), expected, timezoneId);
    assert.equal(await evaluate("document.querySelector('[data-resource-order]').dataset.resourceOrder"), "alphabetical");
    assert.equal(await evaluate("document.getElementById('resource-nationality').value"), "ID");
    assert.equal(await evaluate("document.getElementById('resource-residence').value"), residence);
    assert.equal(await evaluate("document.getElementById('resource-residence').dataset.residenceSource"), residence ? "time-zone" : "manual");
    assert.equal(await evaluate("document.getElementById('resource-status')?.value??''"), "");
    await assertAlphabeticalCards();
    assert.equal(await evaluate("window.__resourceGeolocationCalls"), 0);
  }
  await call("Emulation.setTimezoneOverride", { timezoneId: "Asia/Taipei" }); await navigate("/resources");
  await change("resource-document", "arc"); await change("resource-status", "student");
  await call("Emulation.setTimezoneOverride", { timezoneId: "Asia/Jakarta" });
  await evaluate("window.dispatchEvent(new Event('focus'));document.dispatchEvent(new Event('visibilitychange'))"); await pause(80);
  assert.equal(await evaluate("document.getElementById('resource-residence').value"), "TW", "A device-setting change must not replace a residence while using the finder");
  assert.equal(await evaluate("document.getElementById('resource-status').value"), "student");
  await call("Emulation.setTimezoneOverride", { timezoneId: "Asia/Jakarta" }); await navigate("/resources");
  await change("resource-residence", "TW"); await assertAlphabeticalCards();
  assert.equal(await evaluate("document.querySelector('[data-resource-order]').dataset.resourceOrder"), "alphabetical");
  await change("resource-language", "id-ID"); await assertAlphabeticalCards();
  await change("resource-language", "zh-TW"); await assertAlphabeticalCards();
  assert.equal(await evaluate("document.getElementById('resource-residence').value"), "TW");
  // Explicit choices, including a blank choice and reset, survive focus changes
  // and locale navigation. Only a new visit starts a fresh browser suggestion.
  await call("Emulation.setTimezoneOverride", { timezoneId: "Asia/Taipei" });
  await evaluate("window.dispatchEvent(new Event('focus'));document.dispatchEvent(new Event('visibilitychange'))");
  assert.equal(await evaluate("document.getElementById('resource-residence').value"), "TW");
  for (const [route, phrase] of [["/resources", "browser time zone"], ["/id/resources", "zona waktu browser"], ["/zh-tw/resources", "瀏覽器時區"]]) {
    await navigate(route);
    assert.equal(await evaluate("document.getElementById('resource-residence').value"), "TW");
    assert(await evaluate(`document.getElementById('resource-residence-help').textContent.includes(${JSON.stringify(phrase)})`));
    assert.equal(await evaluate("document.getElementById('resource-residence').getAttribute('aria-describedby')"), "resource-residence-help");
    await call("Emulation.setDeviceMetricsOverride", { width: 320, height: 900, deviceScaleFactor: 1, mobile: false });
    assert(await evaluate("document.documentElement.scrollWidth<=innerWidth"), `Residence suggestion overflow: ${route} at 320px`);
    const prefillScreenshot = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    await writeFile(path.join(output, `resources-prefill-${route.replaceAll('/', '_')}-320.png`), Buffer.from(prefillScreenshot.data, "base64"));
    await call("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await change("resource-residence", "");
    await evaluate("window.dispatchEvent(new Event('focus'));document.dispatchEvent(new Event('visibilitychange'))");
    await change("resource-nationality", "ID"); await change("resource-document", "passport");
    assert.equal(await evaluate("document.getElementById('resource-residence').value"), "");
    assert.deepEqual(new Set(await cards()), new Set(["id-passport-domestic", "id-passport-tw"]));
    assert.equal(await evaluate("document.querySelector('[data-resource-order]').dataset.resourceOrder"), "TW");
    await change("resource-language", "en");
    assert.equal(await evaluate("document.getElementById('resource-residence').value"), "");
    await evaluate("document.querySelector('.resource-search-row button').click()"); await pause(80);
    assert.equal((await cards()).length, guideCount);
    assert.equal(await evaluate("document.getElementById('resource-residence').value"), "");
    await call("Emulation.setTimezoneOverride", { timezoneId: "Asia/Jakarta" });
    await evaluate("window.dispatchEvent(new Event('focus'));document.dispatchEvent(new Event('visibilitychange'))");
    assert.equal(await evaluate("document.getElementById('resource-residence').value"), "");
    await call("Emulation.setTimezoneOverride", { timezoneId: "Asia/Taipei" });
  }
  await call("Emulation.setTimezoneOverride", { timezoneId: "UTC" });
  // Country notes explain absent procedures without borrowing another country's
  // checklist, and teacher/Hong Kong routes remain status-specific.
  await navigate("/resources"); await change("resource-residence", "TW"); await change("resource-nationality", "VN"); await change("resource-document", "passport");
  assert.deepEqual(await cards(), []);
  assert(await evaluate("document.querySelector('[data-workforce-country=VN]').textContent.includes('checklist not yet verified')"));
  assert(await evaluate("!!document.querySelector('[data-workforce-country=VN] a[href=\"https://vnoffice-taipei.mofa.gov.vn/thu-tuc-lanh-su\"]')"));
  await evaluate("document.querySelector('[data-workforce-country] summary').focus()"); await key(" ", "Space", 32);
  assert(await evaluate("document.querySelector('[data-workforce-country] details').open"));
  await change("resource-nationality", "CA"); assert.deepEqual(await cards(), ["ca-passport-tw"]);
  await change("resource-nationality", "HK"); await change("resource-document", "arc"); await change("resource-status", "professional"); assert.deepEqual(await cards(), ["hk-mo-work-residence"]);
  await change("resource-status", "student"); assert.deepEqual(await cards(), []);
  assert(await evaluate("Array.from(document.querySelectorAll('.resource-empty a')).some(a=>a.href.includes('/41864/'))"));
  await change("resource-nationality", "US"); await change("resource-document", "work-permit"); await change("resource-status", "teacher");
  assert.deepEqual((await cards()).sort(), ["tw-public-teacher-docs", "tw-cram-teacher-docs"].sort());
  await call("Emulation.setDeviceMetricsOverride", { width: 320, height: 900, deviceScaleFactor: 1, mobile: false });
  assert(await evaluate("document.documentElement.scrollWidth<=innerWidth"), "Country notes overflow at 320px");
  await evaluate("document.querySelector('[data-workforce-country]').scrollIntoView()");
  const countryScreenshot = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  await writeFile(path.join(output, "workforce-country-notes-US-320.png"), Buffer.from(countryScreenshot.data, "base64"));
  await call("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await navigate("/resources");
  await waitFor(`document.querySelectorAll('[data-guide]').length===${guideCount}`);
  await change("resource-nationality", "ID"); await change("resource-residence", "TW"); await change("resource-document", "passport");
  assert.deepEqual(await cards(), ["id-passport-tw"]);
  await change("resource-nationality", "TW"); assert.deepEqual(await cards(), ["tw-passport-domestic"]);
  await change("resource-nationality", "US"); assert.deepEqual(await cards(), []);
  assert(await evaluate(`document.querySelector('.resource-empty').textContent.includes("We don't have a verified guide")`));
  await change("resource-nationality", "ID"); await change("resource-document", "arc");
  assert.deepEqual((await cards()).sort(), ["tw-arc-students", "tw-arc-workers", "tw-arc-professionals"].sort());
  await change("resource-status", "student"); assert.deepEqual(await cards(), ["tw-arc-students"]);
  await change("resource-status", "worker"); assert.deepEqual(await cards(), ["tw-arc-workers"]);
  await change("resource-status", "professional"); assert.deepEqual(await cards(), ["tw-arc-professionals"]);
  await change("resource-status", "overseas-student"); assert.deepEqual(await cards(), ["tw-arc-students"]);
  await change("resource-status", "dependent"); assert.deepEqual(await cards(), []);
  await change("resource-document", "visa"); assert.deepEqual(await cards(), []);
  assert.equal(await evaluate("document.getElementById('resource-status')"), null);
  await evaluate("document.querySelector('.resource-search-row button').click()"); await pause(100); assert.equal((await cards()).length, guideCount);
  await change("resource-document", "nhi"); await change("resource-status", "student"); assert.deepEqual(await cards(), ["tw-nhi-students"]);
  await change("resource-status", "worker"); assert.deepEqual(await cards(), ["tw-nhi-employees"]);
  await change("resource-document", "work-permit"); await change("resource-status", "job-seeker"); assert.deepEqual(await cards(), ["tw-graduate-work"]);
  await change("resource-document", "national-id"); assert.deepEqual((await cards()).sort(), ["hk-identity-tw", "tw-national-id"].sort());
  await change("resource-nationality", "ID"); assert.deepEqual(await cards(), []);
  await evaluate("document.querySelector('.resource-search-row button').click()"); await change("resource-residence", "TW");
  await change("resource-search", "KDEI passport"); assert.deepEqual(await cards(), ["id-passport-tw"]);
  await change("resource-language", "id-ID");
  assert(await evaluate("document.querySelector('h1').textContent.includes('Temukan')"));
  assert(await evaluate("document.querySelector('[data-guide] h3').textContent.includes('Perpanjangan')"));
  assert.equal(await evaluate("document.querySelector('#resource-search').value"), "KDEI passport");
  await assertLocaleSeo("id-ID", "/id/resources");
  await change("resource-language", "zh-TW"); await assertLocaleSeo("zh-TW", "/zh-tw/resources");
  assert.equal(await evaluate("document.querySelector('#resource-search').value"), "KDEI passport");
  assert.equal(await evaluate("document.querySelector('[data-guide] h3 a').getAttribute('href')"), "/resources/indonesian-passport-renewal-taiwan");
  await evaluate("history.back()"); await assertLocaleSeo("id-ID", "/id/resources");
  assert.equal(await evaluate("document.getElementById('resource-nationality').value"), "");
  assert.equal(await evaluate("document.querySelector('#resource-search').value"), "KDEI passport");
  await evaluate("history.forward()"); await assertLocaleSeo("zh-TW", "/zh-tw/resources");
  await call("Page.reload"); await pause(350); await assertLocaleSeo("zh-TW", "/zh-tw/resources");
  assert.equal(await evaluate("document.querySelector('#resource-search').value"), "");
  assert.equal(await evaluate("location.search"), "");
  await change("resource-language", "en"); await evaluate("document.querySelector('.resource-search-row button').click()");
  await evaluate("document.getElementById('resource-search').focus()"); await key("Tab", "Tab", 9);
  assert.equal(await evaluate("document.activeElement.textContent.trim()"), "Reset filters");
  assert.equal(await evaluate("getComputedStyle(document.activeElement).outlineStyle"), "solid");
  await key("Enter", "Enter", 13); assert.equal((await cards()).length, guideCount);
  await evaluate("document.getElementById('resource-nationality').focus()"); await key("Home", "Home", 36); await key("ArrowDown", "ArrowDown", 40); await key("Enter", "Enter", 13);
  assert.equal(await evaluate("document.getElementById('resource-nationality').value"), "ID");
  await navigate("/resources/indonesian-passport-renewal-taiwan");
  await evaluate("document.querySelector('a[href=\"/id/resources/indonesian-passport-renewal-taiwan\"][hreflang]').click()");
  await waitFor("location.pathname==='/id/resources/indonesian-passport-renewal-taiwan'&&document.readyState==='complete'");
  await assertLocaleSeo("id-ID", "/id/resources/indonesian-passport-renewal-taiwan");
  await navigate("/resources/indonesian-passport-renewal-taiwan");
  await evaluate("document.querySelector('.resource-checklist input').click()"); assert(await evaluate("document.querySelector('.resource-checklist input').checked"));
  assert(await evaluate("Array.from(document.querySelectorAll('.resource-official')).every(a=>a.protocol==='https:'&&a.target==='_blank'&&a.rel.includes('noopener'))"));
  await call("Page.reload"); await pause(350); assert.equal(await evaluate("document.querySelector('.resource-checklist input').checked"), false);
  const layouts = [];
  for (const route of ["/resources", "/id/resources", "/zh-tw/resources", "/resources/indonesian-passport-renewal-taiwan", "/id/resources/indonesian-passport-renewal-taiwan", "/resources/taiwan-arc-extension-students", "/resources/taiwan-arc-extension-workers", "/zh-tw/resources/taiwan-arc-extension-students", "/zh-tw/resources/taiwan-arc-extension-workers", "/resources/taiwan-employment-gold-card-renewal", "/resources/taiwan-nhi-dental-checkup-scaling", "/resources/taiwan-debit-credit-card-expiry", "/resources/tocfl-chinese-certificate-check", "/resources/indonesian-passport-renewal-indonesia", "/resources/canadian-passport-renewal-taiwan", "/resources/hong-kong-sar-passport-renewal-taiwan", "/resources/taiwan-hong-kong-macao-work-residence-extension", "/resources/taiwan-public-school-english-teacher-documents", "/resources/taiwan-cram-school-language-teacher-permit", "/"]) {
    await navigate(route);
    for (const width of [320, 375, 768, 1440]) {
      await call("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: false }); await pause(100);
      assert(await evaluate("document.documentElement.scrollWidth<=innerWidth"), `Horizontal overflow: ${route} at ${width}`);
      if (width === 320 || width === 1440) {
        const screenshot = await call("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
        await writeFile(path.join(output, `resources-${route.replaceAll('/', '_') || 'home'}-${width}.png`), Buffer.from(screenshot.data, "base64"));
      }
      layouts.push({ route, width });
    }
  }
  await call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await navigate("/resources"); assert(await evaluate("matchMedia('(prefers-reduced-motion:reduce)').matches"));
  assert.equal(await evaluate("document.querySelector('#resource-nationality').value"), "");
  assert.equal(await evaluate("window.__resourceGeolocationCalls"), 0);
  const networkRequests = events.filter((event) => event.method === "Network.requestWillBeSent" && ["XHR", "Fetch"].includes(event.params.type));
  // The production edge injects its own RUM/security scripts. Accept only their
  // exact same-origin endpoints AND matching initiators; local checks stay strict.
  const isCloudflareRequest = (event) => {
    if (base !== "https://renewables.cubelated.com") return false;
    const destination = new URL(event.params.request.url);
    if (destination.origin !== base) return false;
    const scripts = (event.params.initiator?.stack?.callFrames ?? []).map((frame) => frame.url);
    return destination.pathname === "/cdn-cgi/rum" && scripts.some((url) => url.startsWith("https://static.cloudflareinsights.com/beacon.min.js/")) ||
      destination.pathname.startsWith("/cdn-cgi/challenge-platform/") && scripts.some((url) => url.startsWith(`${base}/cdn-cgi/challenge-platform/`));
  };
  const platformRequests = networkRequests.filter(isCloudflareRequest);
  const resourceApiRequests = networkRequests.filter((event) => !isCloudflareRequest(event));
  assert.deepEqual(resourceApiRequests.map((event) => ({ url: event.params.request.url, initiator: event.params.initiator?.stack?.callFrames?.[0]?.url })), [], "Finder and checklists must not issue API requests");
  for (const event of platformRequests.filter((event) => new URL(event.params.request.url).pathname === "/cdn-cgi/rum")) {
    assert(!/"(?:nationality|citizenship|residenceStatus|resource-nationality|resource-status|resource-search)"\s*:|KDEI passport/i.test(event.params.request.postData ?? ""), "Cloudflare analytics must not receive finder selections or search text");
  }
  const errors = events.filter((event) => event.method === "Runtime.exceptionThrown" || event.method === "Runtime.consoleAPICalled" && /hydration|Minified React error/i.test(JSON.stringify(event.params)));
  assert.deepEqual(errors, []);
  await call("Emulation.setScriptExecutionDisabled", { value: true });
  await navigate("/resources/taiwan-arc-extension-students");
  assert(await evaluate("document.querySelector('#checklist').textContent.includes('enrollment')"));
  const report = { base, http: `All ${paths.length} sitemap routes GET/HEAD 200; missing translations/guides 404; trailing slash redirect; query canonical stable`, layouts, platformRequests: { analytics: platformRequests.filter((event) => new URL(event.params.request.url).pathname === "/cdn-cgi/rum").length, security: platformRequests.filter((event) => new URL(event.params.request.url).pathname.startsWith("/cdn-cgi/challenge-platform/")).length }, checks: ["browser time-zone residence prefill", "unsupported and shared-offset zone fallback", "explicit residence and clear override device suggestion", "reset stays blank after focus and time-zone changes", "prefill help in all three locales", "time-zone priority then alphabetical order when cleared", "localized title ordering", "no geolocation access or inferred nationality", "nationality and residence matching", "conditional student/worker status", "country notes with keyboard disclosure", "Hong Kong/Macao status-specific routing", "separate teacher procedures", "unsupported document empty states", "reset", "keyword search", "language independence", "localized SEO, URL, history and refresh", "translated guide language links", "native select keyboard input", "Tab/Enter and visible focus", "official links", "ephemeral checkboxes", "no application XHR/fetch requests", "reduced motion", "direct navigation and refresh", "content without JavaScript"], errors };
  await writeFile(path.join(output, "resources-browser-results.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ...report, layouts: report.layouts.length, widths: [320, 375, 768, 1440] }, null, 2));
} finally {
  if (call && socket?.readyState === WebSocket.OPEN) { try { await call("Browser.close"); } catch { /* Process cleanup follows. */ } }
  socket?.close(); browser.kill();
}
