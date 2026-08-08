export interface TrackerEvent {
  date: string;
  amount: number;
}

export interface Tracker {
  slug: string;
  title: string;
  unit: string;
  goal: number;
  description: string;
  events: TrackerEvent[];
}

export interface TrackerStats {
  total: number;
  currentStreak: number;
  longestStreak: number;
  activeDays: number;
  last7: number;
  prev7: number;
  trend: number;
}

export const DAY = 86400000;

export function isoKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return isoKey(d);
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateHistory(
  seed: number,
  days: number,
  chance: number,
  min: number,
  max: number,
  forceActive: number
): TrackerEvent[] {
  const rand = mulberry32(seed);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const map = new Map<string, number>();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * DAY);
    if (rand() < chance) {
      map.set(isoKey(d), min + Math.floor(rand() * (max - min + 1)));
    }
  }

  for (let i = 0; i < forceActive; i++) {
    const d = new Date(today.getTime() - i * DAY);
    const key = isoKey(d);
    if (!map.has(key)) {
      map.set(key, min + Math.floor(rand() * (max - min + 1)));
    }
  }

  return [...map.entries()]
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export const trackers: Tracker[] = [
  {
    slug: "github",
    title: "github",
    unit: "commits",
    goal: 500,
    description: "commits pushed across personal repos this year.",
    events: generateHistory(1337, 364, 0.55, 1, 12, 5),
  },
  {
    slug: "leetcode",
    title: "leetcode",
    unit: "problems",
    goal: 200,
    description: "problems solved across all difficulty levels.",
    events: generateHistory(4242, 364, 0.3, 1, 5, 3),
  },
  {
    slug: "jobs",
    title: "job search",
    unit: "applications",
    goal: 100,
    description: "applications sent to roles i actually want.",
    events: generateHistory(9001, 364, 0.2, 1, 3, 1),
  },
];

export function computeStats(tracker: Tracker): TrackerStats {
  const byDate = new Map(tracker.events.map((e) => [e.date, e.amount]));
  const active = new Set(
    tracker.events.filter((e) => e.amount > 0).map((e) => e.date)
  );
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let total = 0;
  for (const e of tracker.events) total += e.amount;

  let currentStreak = 0;
  for (let i = 0; i < 4000; i++) {
    const d = new Date(today.getTime() - i * DAY);
    if (active.has(isoKey(d))) currentStreak++;
    else break;
  }

  let longestStreak = 0;
  let running = 0;
  const sorted = [...active].sort();
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) {
      running = 1;
    } else {
      const prev = new Date(`${sorted[i - 1]}T00:00:00Z`);
      const cur = new Date(`${sorted[i]}T00:00:00Z`);
      const diff = Math.round((cur.getTime() - prev.getTime()) / DAY);
      running = diff === 1 ? running + 1 : 1;
    }
    if (running > longestStreak) longestStreak = running;
  }

  const sumRange = (offsetDays: number, length: number) => {
    let sum = 0;
    for (let i = 0; i < length; i++) {
      const d = new Date(today.getTime() - (offsetDays + i) * DAY);
      sum += byDate.get(isoKey(d)) ?? 0;
    }
    return sum;
  };

  const last7 = sumRange(0, 7);
  const prev7 = sumRange(7, 7);
  const trend =
    prev7 === 0
      ? last7 > 0
        ? 100
        : 0
      : Math.round(((last7 - prev7) / prev7) * 100);

  return {
    total,
    currentStreak,
    longestStreak,
    activeDays: active.size,
    last7,
    prev7,
    trend,
  };
}
