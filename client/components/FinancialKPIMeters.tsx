import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

interface GaugeProps {
  value: number; // 0-100
  label: string;
  sublabel: string;
  displayValue: string;
  color: string;
  status: "good" | "warning" | "critical";
}

function RadialGauge({ value, label, sublabel, displayValue, color, status }: GaugeProps) {
  const statusStyles = {
    good: "text-emerald-500 bg-emerald-500/10",
    warning: "text-amber-500 bg-amber-500/10",
    critical: "text-rose-500 bg-rose-500/10",
  };
  const statusLabels = { good: "On Track", warning: "Watch", critical: "Alert" };

  const data = [
    { value: 100, fill: "hsl(var(--muted))" },
    { value, fill: color },
  ];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: 120, height: 120 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="90%"
            startAngle={210}
            endAngle={-30}
            data={data}
            barSize={8}
          >
            <RadialBar dataKey="value" background={false} cornerRadius={4} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xl font-bold text-foreground leading-none">{displayValue}</p>
          <p className="text-xs text-muted-foreground mt-1">{label}</p>
        </div>
      </div>
      <div className="text-center">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusStyles[status]}`}
        >
          {statusLabels[status]}
        </span>
        <p className="text-xs text-muted-foreground mt-1.5 leading-tight max-w-[100px]">{sublabel}</p>
      </div>
    </div>
  );
}

const metrics = [
  {
    value: 62,
    label: "DSO",
    sublabel: "28 day average",
    displayValue: "28d",
    color: "#10b981",
    status: "good" as const,
  },
  {
    value: 45,
    label: "CEI",
    sublabel: "Collection effectiveness",
    displayValue: "87%",
    color: "#f59e0b",
    status: "warning" as const,
  },
  {
    value: 78,
    label: "Margin",
    sublabel: "Gross profit margin",
    displayValue: "41%",
    color: "#6366f1",
    status: "good" as const,
  },
  {
    value: 30,
    label: "Burn",
    sublabel: "$18k/month runway",
    displayValue: "18m",
    color: "#ef4444",
    status: "critical" as const,
  },
];

const conversionStats = [
  { label: "Leads → Qualified", value: "64%", bar: 64, color: "#6366f1" },
  { label: "Qualified → Proposal", value: "48%", bar: 48, color: "#a78bfa" },
  { label: "Proposal → Closed", value: "31%", bar: 31, color: "#10b981" },
  { label: "Closed → Repeat", value: "72%", bar: 72, color: "#38bdf8" },
];

export function FinancialKPIMeters() {
  return (
    <Card className="fin-card">
      <div className="fin-card-header">
        <h3 className="font-semibold text-foreground">Key Performance Indicators</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          DSO, CEI, Margin &amp; Sales Funnel
        </p>
      </div>
      <div className="fin-card-content">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-4 border-b border-border">
          {metrics.map((m) => (
            <RadialGauge key={m.label} {...m} />
          ))}
        </div>

        {/* Sales funnel / conversion */}
        <div className="pt-4">
          <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            Sales Conversion Funnel
          </p>
          <div className="space-y-2.5">
            {conversionStats.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <p className="text-xs text-muted-foreground w-36 flex-shrink-0">{s.label}</p>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${s.bar}%`, backgroundColor: s.color }}
                  />
                </div>
                <p className="text-xs font-semibold text-foreground w-9 text-right flex-shrink-0">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}