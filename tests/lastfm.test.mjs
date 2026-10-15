import assert from "node:assert/strict";
import test from "node:test";
import { parseListeningStatus } from "../src/lib/lastfm.ts";

const track = {
  name: "Song title",
  artist: { "#text": "Artist name" },
  url: "https://www.last.fm/music/Artist/_/Song",
  "@attr": { nowplaying: "true" },
};
const recent = (value) => ({ recenttracks: { track: value } });

test("returns the currently playing title, artist, and track link", () => {
  assert.deepEqual(parseListeningStatus(recent([track])), {
    listening: true,
    title: track.name,
    artist: track.artist["#text"],
    url: track.url,
  });
});

test("accepts the single-track object response", () => {
  assert.equal(parseListeningStatus(recent(track)).listening, true);
});

test("does not treat the last scrobbled song as currently playing", () => {
  assert.deepEqual(parseListeningStatus(recent([{ ...track, "@attr": undefined }])), { listening: false });
  assert.deepEqual(parseListeningStatus(recent([{ ...track, "@attr": { nowplaying: "false" } }])), { listening: false });
});

test("falls back to idle for empty, error, and malformed responses", () => {
  for (const data of [null, {}, { error: 10 }, recent([]), recent(null), recent([null]), recent([{}]), recent([{ ...track, artist: {} }]), recent([{ ...track, name: " " }])]) {
    assert.deepEqual(parseListeningStatus(data), { listening: false });
  }
});

test("rejects unsafe or unrelated track links", () => {
  for (const url of ["javascript:alert(1)", "https://example.com/music/song", "https://www.last.fm.evil.test/music/song", "https://www.last.fm/user/someone", "not a URL", "https://name:password@www.last.fm/music/song"]) {
    assert.deepEqual(parseListeningStatus(recent([{ ...track, url }])), { listening: false });
  }
});
