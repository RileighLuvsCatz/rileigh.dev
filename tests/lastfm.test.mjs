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

test("an empty track list is idle", () => {
  assert.deepEqual(parseListeningStatus(recent([])), { listening: false });
});

test("distinguishes API errors from idle without exposing upstream messages", () => {
  for (const error of [10, 17, 29]) {
    assert.deepEqual(parseListeningStatus({ error, message: "private upstream details" }), {
      listening: false, reason: "lastfm_api_error", lastfmErrorCode: error,
    });
  }
});

test("distinguishes malformed responses from idle", () => {
  for (const data of [null, {}, recent(null), recent([null]), recent([{}]), recent([{ ...track, artist: {} }]), recent([{ ...track, name: " " }])]) {
    assert.deepEqual(parseListeningStatus(data), { listening: false, reason: "invalid_response" });
  }
});

test("rejects unsafe or unrelated track links", () => {
  for (const url of ["javascript:alert(1)", "https://example.com/music/song", "https://www.last.fm.evil.test/music/song", "https://www.last.fm/user/someone", "not a URL", "https://name:password@www.last.fm/music/song"]) {
    assert.deepEqual(parseListeningStatus(recent([{ ...track, url }])), { listening: false, reason: "invalid_response" });
  }
});
