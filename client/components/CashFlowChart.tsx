import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";

const data = [
  { month: "Jul", actual: 52000, forecast: 55000, net: 28000 },
  { month: "Aug", actual: 61000, forecast: 58000, net: 34000 },
  { month: "Sep", actual: 47000, forecast: 60000, net: 21000 },
  { month: "Oct", actual: 68000, forecast: 62000, net: 39000 },
  { month: "Nov", actual: 73000, forecast: 70000, net: 42000 },
  { month: "Dec", actual: 79000, forecast: 75000, net: 47000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg text-xs">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground capitalize">{entry.name}:</span>
            <span className="font-medium text-foreground">
              ${entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function CashFlowChart() {
  return (
    <Card className="fin-card">
      <div className="fin-card-header flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Cash Flow</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Actual vs. Forecast — Last 6 months
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-2.5 rounded-sm bg-indigo-500 opacity-80" />
            Actual
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-2.5 rounded-sm bg-slate-400 opacity-60" />
            Forecast
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-0.5 rounded bg-emerald-400" />
            Net Flow
          </span>
        </div>
      </div>
      <div className="fin-card-content pb-4 px-4">
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }} barGap={3}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              strokeOpacity={0.5}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
            <Bar dataKey="actual" name="Actual" fill="#6366f1" fillOpacity={0.85} radius={[3, 3, 0, 0]} barSize={22} />
            <Bar dataKey="forecast" name="Forecast" fill="#94a3b8" fillOpacity={0.5} radius={[3, 3, 0, 0]} barSize={22} />
            <Line
              type="monotone"
              dataKey="net"
              name="Net Flow"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}