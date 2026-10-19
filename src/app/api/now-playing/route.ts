import { parseListeningStatus, type ListeningStatus } from "@/lib/lastfm";

export async function GET() {
  const headers = { "Cache-Control": "no-store" };
  const unavailable = (reason: Extract<ListeningStatus, { listening: false }>["reason"], upstreamStatus?: number) =>
    Response.json({ listening: false, reason, ...(upstreamStatus === undefined ? {} : { upstreamStatus }) }, { headers });
  const apiKey = process.env.LASTFM_API_KEY?.trim();
  if (!apiKey) return unavailable("missing_api_key");

  const url = new URL("https://ws.audioscrobbler.com/2.0/");
  url.search = new URLSearchParams({
    method: "user.getrecenttracks",
    user: "ImSoFuckingDumb",
    api_key: apiKey,
    format: "json",
    limit: "1",
  }).toString();

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      return unavailable(response.ok ? "invalid_response" : "http_error", response.status);
    }
    const status = parseListeningStatus(data);
    // Last.fm can return an API error in a JSON body even for HTTP 200 responses.
    if (!status.listening && status.reason === "lastfm_api_error") {
      return Response.json(status, { headers });
    }
    if (!response.ok) return unavailable("http_error", response.status);
    return Response.json(status, { headers });
  } catch (error) {
    return unavailable(error instanceof Error && error.name === "TimeoutError" ? "timeout" : "request_failed");
  }
}
