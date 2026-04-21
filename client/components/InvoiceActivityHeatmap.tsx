import { useMemo } from "react";
import { Card } from "@/components/ui/card";

// Generate 52 weeks × 7 days of mock invoice activity
function generateHeatmapData() {
  const today = new Date();
  const cells: { date: Date; value: number; label: string }[] = [];

  for (let w = 51; w >= 0; w--) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() - w * 7 - (6 - d));
      // Simulate invoice activity: business days busier
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const base = isWeekend ? 0 : Math.random();
      // Create some "hot streaks"
      const hotZone = w > 10 && w < 30 && !isWeekend;
      const value = isWeekend
        ? 0
        : hotZone
        ? Math.floor(Math.random() * 8 + 2)
        : Math.random() > 0.3
        ? Math.floor(Math.random() * 5)
        : 0;

      cells.push({
        date,
        value,
        label: `${date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}: ${value} invoice${value !== 1 ? "s" : ""}`,
      });
    }
  }
  return cells;
}

function getColor(value: number): string {
  if (value === 0) return "hsl(var(--muted))";
  if (value <= 2) return "#bfdbfe"; // blue-200
  if (value <= 4) return "#60a5fa"; // blue-400
  if (value <= 6) return "#3b82f6"; // blue-500
  return "#1d4ed8"; // blue-700
}

// Get month labels for the X axis
function getMonthLabels(cells: { date: Date }[]) {
  const labels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  cells.forEach((cell, i) => {
    const col = Math.floor(i / 7);
    const month = cell.date.getMonth();
    if (month !== lastMonth) {
      labels.push({
        label: cell.date.toLocaleDateString("en-US", { month: "short" }),
        col,
      });
      lastMonth = month;
    }
  });
  return labels;
}

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

export function InvoiceActivityHeatmap() {
  const cells = useMemo(() => generateHeatmapData(), []);
  const weeks = useMemo(() => {
    const w: (typeof cells)[] = [];
    for (let i = 0; i < cells.length; i += 7) w.push(cells.slice(i, i + 7));
    return w;
  }, [cells]);

  const monthLabels = useMemo(() => getMonthLabels(cells), [cells]);

  const totalInvoices = cells.reduce((s, c) => s + c.value, 0);
  const activeDays = cells.filter((c) => c.value > 0).length;

  return (
    <Card className="fin-card">
      <div className="fin-card-header flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Invoice Activity</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totalInvoices} invoices processed · {activeDays} active days
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
          <span>Less</span>
          {[0, 2, 4, 6, 9].map((v) => (
            <span
              key={v}
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: getColor(v) }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
      <div className="fin-card-content pb-4">
        <div className="w-full overflow-x-auto">
          <div className="min-w-full">
          {/* Month labels */}
          <div className="flex pl-8 mb-1">
            {monthLabels.map(({ label, col }) => (
              <div
                key={`${label}-${col}`}
                className="text-xs text-muted-foreground"
                style={{ position: "absolute", marginLeft: `${col * 14 + 32}px` }}
              >
                {label}
              </div>
            ))}
            <div className="h-4" />
          </div>

          <div className="flex gap-0.5 mt-5">
            {/* Day-of-week labels */}
            <div className="flex flex-col gap-0.5 mr-1 flex-shrink-0">
              {DAY_LABELS.map((d, i) => (
                <div
                  key={i}
                  className="text-xs text-muted-foreground flex items-center justify-end"
                  style={{ height: 13, width: 28 }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Grid */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((cell, di) => (
                  <div
                    key={di}
                    className="rounded-sm cursor-default transition-opacity hover:opacity-80 group relative"
                    style={{
                      width: 13,
                      height: 13,
                      backgroundColor: getColor(cell.value),
                    }}
                    title={cell.label}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </Card>
  );
}