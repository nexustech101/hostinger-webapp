import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card } from "@/components/ui/card";

const agingData = [
  { bucket: "0–30 days", amount: 48200, count: 18, color: "#10b981" },
  { bucket: "31–60 days", amount: 31500, count: 11, color: "#f59e0b" },
  { bucket: "61–90 days", amount: 18700, count: 7, color: "#f97316" },
  { bucket: "90+ days", amount: 9400, count: 4, color: "#ef4444" },
];

const totalOutstanding = agingData.reduce((s, d) => s + d.amount, 0);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const entry = agingData.find((d) => d.bucket === label);
    return (
      <div className="bg-background border border-border rounded-lg p-3 shadow-lg text-xs">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        <p className="text-muted-foreground">
          Amount:{" "}
          <span className="text-foreground font-medium">
            ${payload[0].value.toLocaleString()}
          </span>
        </p>
        <p className="text-muted-foreground">
          Invoices:{" "}
          <span className="text-foreground font-medium">{entry?.count}</span>
        </p>
        <p className="text-muted-foreground">
          Share:{" "}
          <span className="text-foreground font-medium">
            {((payload[0].value / totalOutstanding) * 100).toFixed(1)}%
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export function ARAgingChart() {
  return (
    <Card className="fin-card">
      <div className="fin-card-header flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">AR Aging Summary</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Outstanding: ${totalOutstanding.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">40 total invoices</p>
        </div>
      </div>

      {/* Age buckets legend strip */}
      <div className="px-4 pb-2 flex gap-2">
        {agingData.map((d) => (
          <div
            key={d.bucket}
            className="flex-1 rounded-md p-2 text-xs"
            style={{ backgroundColor: `${d.color}14`, borderLeft: `2px solid ${d.color}` }}
          >
            <p className="font-semibold" style={{ color: d.color }}>
              ${(d.amount / 1000).toFixed(0)}k
            </p>
            <p className="text-muted-foreground mt-0.5 leading-tight">{d.bucket}</p>
          </div>
        ))}
      </div>

      <div className="fin-card-content pb-4 px-4">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={agingData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }} barSize={36}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              strokeOpacity={0.5}
              vertical={false}
            />
            <XAxis
              dataKey="bucket"
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
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
              {agingData.map((entry) => (
                <Cell key={entry.bucket} fill={entry.color} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}