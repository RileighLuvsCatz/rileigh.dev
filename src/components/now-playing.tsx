"use client";

import { useEffect, useState } from "react";
import { LASTFM_PROFILE_URL, type ListeningStatus } from "@/lib/lastfm";
import styles from "./now-playing.module.css";

export default function NowPlaying() {
  const [status, setStatus] = useState<ListeningStatus>({ listening: false });

  useEffect(() => {
    let disposed = false;
    let timer: ReturnType<typeof setTimeout>;
    const controller = new AbortController();

    async function refresh() {
      try {
        const response = await fetch("/api/now-playing", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Listening status unavailable");
        const nextStatus: ListeningStatus = await response.json();
        if (!disposed) setStatus(nextStatus);
      } catch {
        if (!disposed) setStatus({ listening: false });
      } finally {
        if (!disposed) timer = setTimeout(refresh, 30_000);
      }
    }

    void refresh();
    return () => {
      disposed = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, []);

  const label = status.listening
    ? `Listening to ${status.title} by ${status.artist} on Last.fm`
    : "Last.fm profile (not currently listening)";

  return (
    <a
      href={status.listening ? status.url : LASTFM_PROFILE_URL}
      className={`${styles.link} ${status.listening ? styles.listening : ""}`}
      aria-label={label}
      title={label}
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg width="24" height="24" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 22v-8a8 8 0 0 1 16 0v8" />
        <rect x="6" y="17" width="5" height="9" rx="2" />
        <rect x="21" y="17" width="5" height="9" rx="2" />
        {status.listening && (
          <g>
            <path d="M3 11V5l3-1M28 12V6l3-1" />
            <circle cx="2" cy="12" r="1" />
            <circle cx="27" cy="13" r="1" />
          </g>
        )}
      </svg>
      {status.listening && (
        <span className={styles.tooltip} aria-hidden="true">
          <span className={styles.caption}>now playing</span>
          <span className={styles.title}>{status.title}</span>
          <span>{status.artist}</span>
        </span>
      )}
    </a>
  );
}
