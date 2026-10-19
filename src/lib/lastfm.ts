export const LASTFM_PROFILE_URL = "https://www.last.fm/user/ImSoFuckingDumb";

export type ListeningStatus =
  | {
      listening: false;
      reason?: "missing_api_key" | "lastfm_api_error" | "http_error" | "invalid_response" | "timeout" | "request_failed";
      lastfmErrorCode?: number;
      upstreamStatus?: number;
    }
  | { listening: true; title: string; artist: string; url: string };

export function parseListeningStatus(data: unknown): ListeningStatus {
  if (data && typeof data === "object" && "error" in data && typeof data.error === "number") {
    return { listening: false, reason: "lastfm_api_error", lastfmErrorCode: data.error };
  }
  if (!data || typeof data !== "object" || !("recenttracks" in data)) {
    return { listening: false, reason: "invalid_response" };
  }

  const recent = data.recenttracks;
  if (!recent || typeof recent !== "object" || !("track" in recent)) {
    return { listening: false, reason: "invalid_response" };
  }

  if (Array.isArray(recent.track) && recent.track.length === 0) return { listening: false };
  const track = Array.isArray(recent.track) ? recent.track[0] : recent.track;
  if (!track || typeof track !== "object" || typeof track.name !== "string") {
    return { listening: false, reason: "invalid_response" };
  }
  if (track["@attr"]?.nowplaying !== "true") return { listening: false };
  if (
    typeof track.name !== "string" || !track.name.trim() ||
    typeof track.artist?.["#text"] !== "string" || !track.artist["#text"].trim() ||
    typeof track.url !== "string"
  ) {
    return { listening: false, reason: "invalid_response" };
  }

  try {
    const url = new URL(track.url);
    if (
      url.protocol !== "https:" ||
      !["www.last.fm", "last.fm"].includes(url.hostname) ||
      !url.pathname.startsWith("/music/") ||
      url.username || url.password
    ) {
      return { listening: false, reason: "invalid_response" };
    }
    return { listening: true, title: track.name, artist: track.artist["#text"], url: url.href };
  } catch {
    return { listening: false, reason: "invalid_response" };
  }
}
