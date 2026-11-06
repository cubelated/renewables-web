import assert from "node:assert/strict";
import test from "node:test";
import { serveVideo } from "../src/worker/video.ts";

const bytes = Uint8Array.from({ length: 100 }, (_, i) => i);
function assets(status = 200) {
  return { fetch: async (request) => {
    assert.equal(request.headers.get("range"), null);
    return new Response(request.method === "HEAD" ? null : new ReadableStream({
      start(controller) {
        // Deliberate chunk boundaries to test skipping and slicing across chunks.
        controller.enqueue(bytes.subarray(0, 12));
        controller.enqueue(bytes.subarray(12, 49));
        controller.enqueue(bytes.subarray(49));
        controller.close();
      },
    }), { status, headers: { "Content-Length": "100", "ETag": '"demo-v1"', "Last-Modified": "Fri, 06 Nov 2026 00:00:00 GMT" } });
  } };
}
const request = (headers = {}, method = "GET") => new Request("https://renewables.cubelated.com/media/ocr-demo.mp4", { headers, method });

test("full video responses preserve bytes and advertise correct MIME and range support", async () => {
  const response = await serveVideo(request(), assets());
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Content-Type"), "video/mp4");
  assert.equal(response.headers.get("Accept-Ranges"), "bytes");
  assert.equal(response.headers.get("ETag"), '"demo-v1"');
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), bytes);
});
for (const [range, start, end] of [
  ["bytes=0-1", 0, 1], ["bytes=10-55", 10, 55], ["bytes=70-", 70, 99],
  ["bytes=-12", 88, 99], ["bytes=90-1000", 90, 99], ["bytes=-1000", 0, 99],
]) test(`range ${range} returns exactly the requested bytes`, async () => {
  const response = await serveVideo(request({ Range: range }), assets());
  assert.equal(response.status, 206);
  assert.equal(response.headers.get("Content-Range"), `bytes ${start}-${end}/100`);
  assert.equal(response.headers.get("Content-Length"), String(end - start + 1));
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), bytes.subarray(start, end + 1));
});
test("invalid and unsatisfiable byte ranges return 416", async () => {
  for (const range of ["bytes=100-", "bytes=80-20", "bytes=-0", "bytes=-", "bytes=oops", "bytes=999999999999999999999-"]) {
    const response = await serveVideo(request({ Range: range }), assets());
    assert.equal(response.status, 416);
    assert.equal(response.headers.get("Content-Range"), "bytes */100");
    assert.equal((await response.arrayBuffer()).byteLength, 0);
  }
});
test("HEAD is bodyless and ignores Range", async () => {
  const response = await serveVideo(request({ Range: "bytes=0-1" }, "HEAD"), assets());
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Content-Length"), "100");
  assert.equal((await response.arrayBuffer()).byteLength, 0);
});
test("Cloudflare responses without internal Content-Length use build-validated metadata", async () => {
  const binding = { fetch: async (req) => {
    const response = await assets().fetch(req);
    response.headers.delete("Content-Length");
    return response;
  } };
  const response = await serveVideo(request({ Range: "bytes=0-1" }), binding, bytes.length);
  assert.equal(response.status, 206);
  assert.equal(response.headers.get("Content-Range"), "bytes 0-1/100");
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), bytes.subarray(0, 2));
  const head = await serveVideo(request({}, "HEAD"), binding, bytes.length);
  assert.equal(head.headers.get("Content-Length"), "100");
  assert.equal(head.headers.get("Accept-Ranges"), "bytes");
});
test("unsupported multi-ranges and units fall back to the complete file", async () => {
  for (const range of ["bytes=0-1,10-20", "items=0-1"]) {
    const response = await serveVideo(request({ Range: range }), assets());
    assert.equal(response.status, 200);
    assert.equal((await response.arrayBuffer()).byteLength, 100);
  }
});
test("If-Range only enables partial responses for a matching strong validator", async () => {
  for (const [validator, expected] of [['"demo-v1"',206],['"older"',200],['W/"demo-v1"',200],['Fri, 06 Nov 2026 00:00:00 GMT',206],['Thu, 05 Nov 2026 00:00:00 GMT',200]]) {
    const response = await serveVideo(request({ Range: "bytes=0-1", "If-Range": validator }), assets());
    assert.equal(response.status, expected);
    await response.arrayBuffer();
  }
});
test("missing assets retain their actual error status", async () => {
  const response = await serveVideo(request({ Range: "bytes=0-1" }), assets(404));
  assert.equal(response.status, 404);
  assert.equal(response.headers.get("Content-Range"), null);
  await response.arrayBuffer();
});
test("upstream cancellation failures do not corrupt a completed range", async () => {
  const binding = { fetch: async () => new Response(new ReadableStream({
    start(controller) { controller.enqueue(bytes); },
    cancel() { return Promise.reject(new Error("Source was already disconnected")); },
  }), { headers: { "Content-Length": "100" } }) };
  const response = await serveVideo(request({ Range: "bytes=0-1" }), binding);
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), bytes.subarray(0, 2));
});
