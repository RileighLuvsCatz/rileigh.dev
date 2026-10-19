import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { afterEach, test } from "node:test";

// Resolve the app's TypeScript alias when running outside Next.js.
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "@/lib/lastfm") {
      return { url: new URL("../src/lib/lastfm.ts", import.meta.url).href, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});
const { GET } = await import("../src/app/api/now-playing/route.ts");
hooks.deregister();

const originalFetch = globalThis.fetch;
const originalKey = process.env.LASTFM_API_KEY;
afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.LASTFM_API_KEY;
  else process.env.LASTFM_API_KEY = originalKey;
});

test("reports missing configuration without calling Last.fm", async () => {
  process.env.LASTFM_API_KEY = "   ";
  globalThis.fetch = () => { throw new Error("Should not fetch"); };
  const response = await GET();
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.deepEqual(await response.json(), { listening: false, reason: "missing_api_key" });
});

test("requests fresh data with the trimmed key and preserves genuine idle", async () => {
  process.env.LASTFM_API_KEY = " test-key ";
  globalThis.fetch = async (url, options) => {
    assert.equal(url.searchParams.get("api_key"), "test-key");
    assert.equal(url.searchParams.get("user"), "ImSoFuckingDumb");
    assert.equal(options.cache, "no-store");
    return Response.json({ recenttracks: { track: [] } });
  };
  assert.deepEqual(await (await GET()).json(), { listening: false });
});

test("preserves Last.fm error codes for both HTTP success and failure", async () => {
  process.env.LASTFM_API_KEY = "test-key";
  for (const status of [200, 403]) {
    globalThis.fetch = async () => Response.json({ error: 10, message: "Never expose upstream text" }, { status });
    assert.deepEqual(await (await GET()).json(), {
      listening: false, reason: "lastfm_api_error", lastfmErrorCode: 10,
    });
  }
});

test("distinguishes HTTP failures and malformed JSON", async () => {
  process.env.LASTFM_API_KEY = "test-key";
  for (const status of [200, 502]) {
    globalThis.fetch = async () => new Response("not JSON", { status });
    assert.deepEqual(await (await GET()).json(), {
      listening: false, reason: status === 200 ? "invalid_response" : "http_error", upstreamStatus: status,
    });
  }
});

test("distinguishes timeouts and network failures without exposing exception details", async () => {
  process.env.LASTFM_API_KEY = "test-key";
  for (const name of ["TimeoutError", "TypeError"]) {
    globalThis.fetch = async () => { throw Object.assign(new Error("private request URL"), { name }); };
    assert.deepEqual(await (await GET()).json(), {
      listening: false, reason: name === "TimeoutError" ? "timeout" : "request_failed",
    });
  }
});
