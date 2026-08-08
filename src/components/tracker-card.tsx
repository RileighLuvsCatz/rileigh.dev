import CalendarHeatmap from "@/components/calendar-heatmap";
import { computeStats, type Tracker } from "@/lib/trackers";

export default function TrackerCard({ tracker }: { tracker: Tracker }) {
  const stats = computeStats(tracker);
  const pct = Math.min(100, Math.round((stats.total / tracker.goal) * 100));
  const trend =
    stats.prev7 === 0
      ? stats.last7 > 0
        ? "new"
        : "flat"
      : `${stats.trend > 0 ? "+" : ""}${stats.trend}%`;
  const trendClass =
    stats.trend === 0 ? "text-muted" : stats.trend > 0 ? "text-green-500" : "text-red-500";

  return (
    <div className="flex flex-col gap-4 border border-border rounded-lg p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-sm font-medium">{tracker.title}</h2>
          <p className="text-xs text-muted mt-1">{tracker.description}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-medium leading-none">
            {stats.total}
            <span className="text-xs text-muted ml-1">{tracker.unit}</span>
          </p>
          <p className="text-[10px] text-muted mt-1.5">
            goal {tracker.goal} ·{" "}
            <span className={trendClass}>{trend} this week</span>
          </p>
        </div>
      </div>

      <div>
        <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-green-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-[10px] text-muted mt-1.5">{pct}% of goal</p>
      </div>

      <CalendarHeatmap events={tracker.events} unit={tracker.unit} />

      <div className="grid grid-cols-3 gap-2 border-t border-border pt-4">
        <MiniStat label="current streak" value={stats.currentStreak} />
        <MiniStat label="longest streak" value={stats.longestStreak} />
        <MiniStat label="last 7 days" value={stats.last7} />
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-[10px] text-muted mb-0.5">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
