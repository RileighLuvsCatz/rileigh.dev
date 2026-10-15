import { parseListeningStatus } from "@/lib/lastfm";

export async function GET() {
  const headers = { "Cache-Control": "no-store" };
  const idle = () => Response.json({ listening: false }, { headers });
  const apiKey = process.env.LASTFM_API_KEY;
  if (!apiKey) return idle();

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
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return idle();
    return Response.json(parseListeningStatus(await response.json()), { headers });
  } catch {
    return idle();
  }
}
