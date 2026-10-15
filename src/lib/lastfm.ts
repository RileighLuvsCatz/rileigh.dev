export const LASTFM_PROFILE_URL = "https://www.last.fm/user/ImSoFuckingDumb";

export type ListeningStatus =
  | { listening: false }
  | { listening: true; title: string; artist: string; url: string };

export function parseListeningStatus(data: unknown): ListeningStatus {
  if (!data || typeof data !== "object" || !("recenttracks" in data)) {
    return { listening: false };
  }

  const recent = data.recenttracks;
  if (!recent || typeof recent !== "object" || !("track" in recent)) {
    return { listening: false };
  }

  const track = Array.isArray(recent.track) ? recent.track[0] : recent.track;
  if (
    !track ||
    track["@attr"]?.nowplaying !== "true" ||
    typeof track.name !== "string" || !track.name.trim() ||
    typeof track.artist?.["#text"] !== "string" || !track.artist["#text"].trim() ||
    typeof track.url !== "string"
  ) {
    return { listening: false };
  }

  try {
    const url = new URL(track.url);
    if (
      url.protocol !== "https:" ||
      !["www.last.fm", "last.fm"].includes(url.hostname) ||
      !url.pathname.startsWith("/music/") ||
      url.username || url.password
    ) {
      return { listening: false };
    }
    return { listening: true, title: track.name, artist: track.artist["#text"], url: url.href };
  } catch {
    return { listening: false };
  }
}
