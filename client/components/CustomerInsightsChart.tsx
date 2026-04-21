import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

const segmentData = [
  { name: "Enterprise", value: 38, color: "#6366f1" },
  { name: "Mid-Market", value: 29, color: "#a78bfa" },
  { name: "SMB", value: 22, color: "#38bdf8" },
  { name: "Startup", value: 11, color: "#94a3b8" },
];

const kpis = [
  {
    label: "CAC",
    value: "$320",
    sub: "Cost to acquire",
    trend: "+8%",
    up: false,
  },
  {
    label: "CLV",
    value: "$8,400",
    sub: "Lifetime value",
    trend: "+14%",
    up: true,
  },
  {
    label: "Churn",
    value: "2.3%",
    sub: "Monthly rate",
    trend: "-0.4%",
    up: true,
  },
  {
    label: "CLV:CAC",
    value: "26.3×",
    sub: "Ratio",
    trend: "+2.1×",
    up: true,
  },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg p-2.5 shadow-lg text-xs">
        <p className="font-semibold text-foreground">{payload[0].name}</p>
        <p className="text-muted-foreground">
          Share:{" "}
          <span className="text-foreground font-medium">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export function CustomerInsightsChart() {
  return (
    <Card className="fin-card">
      <div className="fin-card-header">
        <h3 className="font-semibold text-foreground">Customer Insights</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Segmentation &amp; acquisition metrics
        </p>
      </div>
      <div className="fin-card-content">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Donut */}
          <div className="relative flex-shrink-0" style={{ width: 160, height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {segmentData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-xl font-bold text-foreground">142</p>
              <p className="text-xs text-muted-foreground">Clients</p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            {segmentData.map((seg) => (
              <div key={seg.name} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-xs text-muted-foreground truncate">{seg.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${seg.value * 1.2}px`,
                      backgroundColor: seg.color,
                      opacity: 0.6,
                    }}
                  />
                  <span className="text-xs font-medium text-foreground w-8 text-right">
                    {seg.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-border">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="flex flex-col gap-0.5">
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <p className="text-lg font-bold text-foreground leading-tight">{kpi.value}</p>
              <div className="flex items-center gap-1">
                <span
                  className={`text-xs font-medium ${
                    kpi.up ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {kpi.up ? "↑" : "↓"} {kpi.trend}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{kpi.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}