"use client";

import { useEffect, useRef } from "react";
import { DAY, isoKey, type TrackerEvent } from "@/lib/trackers";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const LEVELS = ["bg-white/5", "bg-green-950", "bg-green-800", "bg-green-500"];

interface Cell {
  key: string;
  count: number;
  level: number;
}

interface Week {
  label: string | null;
  cells: Cell[];
}

export default function CalendarHeatmap({
  events,
  unit,
  weeks = 26,
}: {
  events: TrackerEvent[];
  unit: string;
  weeks?: number;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [events]);

  const byDate = new Map(events.map((e) => [e.date, e.amount]));
  const max = Math.max(1, ...events.map((e) => e.amount));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastWeekStart = new Date(today);
  lastWeekStart.setDate(today.getDate() - today.getDay());

  const earliest = events.length
    ? new Date(`${events.reduce((a, b) => (a.date < b.date ? a : b)).date}T00:00:00`)
    : today;
  let start = new Date(earliest);
  start.setDate(earliest.getDate() - earliest.getDay());
  start = new Date(Math.max(start.getTime(), lastWeekStart.getTime() - (weeks - 1) * 7 * DAY));
  const totalWeeks = Math.round((lastWeekStart.getTime() - start.getTime()) / DAY / 7) + 1;

  const weeksData: Week[] = [];
  for (let w = 0; w < totalWeeks; w++) {
    let label: string | null = null;
    const cells: Cell[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start.getTime() + (w * 7 + d) * DAY);
      const key = isoKey(date);
      if (date.getDate() === 1) label = MONTHS[date.getMonth()];
      const count = byDate.get(key) ?? 0;
      const ratio = count / max;
      const level = count === 0 ? 0 : ratio < 0.3 ? 1 : ratio < 0.6 ? 2 : 3;
      cells.push({ key, count, level });
    }
    weeksData.push({ label, cells });
  }

  return (
    <div ref={scrollerRef} className="overflow-x-auto pb-1">
      <div className="flex w-max gap-[3px]">
        {weeksData.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            <div className="h-3 overflow-visible whitespace-nowrap text-[9px] leading-none text-muted">
              {week.label ?? ""}
            </div>
            {week.cells.map((cell) => (
              <div
                key={cell.key}
                title={`${cell.count} ${unit} · ${cell.key}`}
                className={`h-[11px] w-[11px] rounded-[2px] ${LEVELS[cell.level]}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
