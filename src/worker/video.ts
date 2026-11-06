type ByteRange = { start: number; end: number };

function parseRange(value: string, size: number): ByteRange | null {
  const match = /^bytes=(\d*)-(\d*)$/.exec(value);
  if (!match || (!match[1] && !match[2]) || size <= 0) return null;
  if (!match[1]) {
    const suffix = Number(match[2]);
    return Number.isSafeInteger(suffix) && suffix > 0
      ? { start: Math.max(0, size - suffix), end: size - 1 } : null;
  }
  const start = Number(match[1]);
  const end = match[2] ? Number(match[2]) : size - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= size || end < start) return null;
  return { start, end: Math.min(end, size - 1) };
}

// Forward only the requested slice. Never buffer the full recording in Worker memory.
function sliceStream(body: ReadableStream<Uint8Array>, start: number, length: number) {
  const reader = body.getReader();
  let skip = start;
  let remaining = length;
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        while (remaining > 0) {
          const { value, done } = await reader.read();
          if (done) throw new Error("The video asset ended before the requested range.");
          if (skip >= value.byteLength) { skip -= value.byteLength; continue; }
          const chunk = value.subarray(skip, Math.min(value.byteLength, skip + remaining));
          skip = 0;
          remaining -= chunk.byteLength;
          controller.enqueue(chunk);
          if (remaining === 0) {
            controller.close();
            // A binding may reject cancellation after the requested bytes have
            // already been delivered. That cleanup must not corrupt the slice.
            await reader.cancel().catch(() => {});
          }
          return;
        }
      } catch (error) {
        controller.error(error);
        await reader.cancel(error).catch(() => {});
      }
    },
    cancel(reason) { return reader.cancel(reason).catch(() => {}); },
  });
}

function matchesIfRange(value: string, headers: Headers) {
  if (value.startsWith('"')) return value === headers.get("ETag");
  if (value.startsWith("W/")) return false;
  const modified = Date.parse(headers.get("Last-Modified") ?? "");
  const since = Date.parse(value);
  return Number.isFinite(modified) && Number.isFinite(since) && modified <= since;
}

// Cloudflare Static Assets currently ignores Range. This exact-path handler adds
// single-range GET support (including Safari's bytes=0-1 probe) using the same asset.
export async function serveVideo(request: Request, assets: Pick<Fetcher, "fetch">, expectedSize?: number): Promise<Response> {
  const upstreamHeaders = new Headers(request.headers);
  upstreamHeaders.delete("Range");
  upstreamHeaders.delete("If-Range");
  upstreamHeaders.set("Accept-Encoding", "identity");
  const asset = await assets.fetch(new Request(request, { headers: upstreamHeaders }));
  if (asset.status !== 200) return asset;
  const headers = new Headers(asset.headers);
  headers.set("Content-Type", "video/mp4");
  const rawSize = headers.get("Content-Length");
  const size = rawSize === null ? (expectedSize ?? NaN) : Number(rawSize);
  if (!Number.isSafeInteger(size) || size < 0) return new Response(asset.body, { status: 200, headers });
  headers.set("Accept-Ranges", "bytes");
  headers.set("Content-Length", String(size));
  const rangeHeader = request.headers.get("Range");
  const ifRange = request.headers.get("If-Range");
  if (request.method === "HEAD" || !rangeHeader || !rangeHeader.startsWith("bytes=")
    || rangeHeader.includes(",") || (ifRange && !matchesIfRange(ifRange, headers))) {
    return new Response(request.method === "HEAD" ? null : asset.body, { status: 200, headers });
  }
  const range = parseRange(rangeHeader, size);
  if (!range) {
    await asset.body?.cancel();
    headers.set("Content-Range", `bytes */${size}`);
    headers.set("Content-Length", "0");
    return new Response(null, { status: 416, headers });
  }
  if (!asset.body) return new Response(null, { status: 502 });
  const length = range.end - range.start + 1;
  headers.set("Content-Range", `bytes ${range.start}-${range.end}/${size}`);
  headers.set("Content-Length", String(length));
  let body = sliceStream(asset.body, range.start, length);
  if (typeof FixedLengthStream !== "undefined") {
    // Workers derives Content-Length from the body, rather than trusting a header
    // on an arbitrary stream. Preserve it for native browser range playback.
    const sized = new FixedLengthStream(length);
    // The response keeps this streaming operation alive. A rejected pipe already
    // errors the readable side (including normal client aborts while seeking).
    void body.pipeTo(sized.writable).catch(() => {});
    body = sized.readable;
  }
  return new Response(body, { status: 206, headers });
}
