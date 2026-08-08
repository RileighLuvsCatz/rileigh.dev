import SiteHeader from "@/components/site-header";
import TrackerCard from "@/components/tracker-card";
import { computeStats, todayKey, trackers } from "@/lib/trackers";

export default function ProgressPage() {
  const today = todayKey();
  const stats = trackers.map((t) => computeStats(t));
  const totalLogged = stats.reduce((s, st) => s + st.total, 0);
  const longestStreak = Math.max(...stats.map((s) => s.longestStreak));
  const activeToday = trackers.filter(
    (t) => t.events.some((e) => e.date === today && e.amount > 0)
  ).length;

  return (
    <div className="flex flex-col flex-1 items-center px-8 md:px-16 lg:px-32 py-8">
      <div className="w-full max-w-3xl">
        <SiteHeader />

        <h1 className="text-xl font-medium mb-1 tracking-tight">progress</h1>
        <p className="text-sm text-muted mb-6">
          trackers running on mock data until the db lands.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <SummaryStat label="total logged" value={totalLogged} />
          <SummaryStat label="longest streak" value={`${longestStreak} days`} />
          <SummaryStat
            label="active today"
            value={`${activeToday}/${trackers.length}`}
          />
        </div>

        <div className="flex flex-col gap-4">
          {trackers.map((tracker) => (
            <TrackerCard key={tracker.slug} tracker={tracker} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="border border-border rounded-lg p-4">
      <p className="text-[10px] text-muted uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-lg font-medium">{value}</p>
    </div>
  );
}
