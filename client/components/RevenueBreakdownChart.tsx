import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Card } from "@/components/ui/card";
import { useState } from "react";

const byProduct = [
  { name: "Consulting", value: 38200 },
  { name: "SaaS", value: 29600 },
  { name: "Support", value: 14300 },
  { name: "Training", value: 8900 },
  { name: "Licenses", value: 6100 },
];

const byRegion = [
  { name: "Northeast", value: 31500 },
  { name: "Southeast", value: 24200 },
  { name: "Midwest", value: 18700 },
  { name: "West", value: 16400 },
  { name: "Intl.", value: 6300 },
];

const mrrGrowth = [
  { month: "Jul", mrr: 22000 },
  { month: "Aug", mrr: 23500 },
  { month: "Sep", mrr: 23000 },
  { month: "Oct", mrr: 25800 },
  { month: "Nov", mrr: 27400 },
  { month: "Dec", mrr: 29200 },
];

type Tab = "product" | "region" | "mrr";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg p-2.5 shadow-lg text-xs">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        <p className="text-muted-foreground">
          {payload[0].name === "mrr" ? "MRR" : "Revenue"}:{" "}
          <span className="text-foreground font-medium">
            ${payload[0].value.toLocaleString()}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export function RevenueBreakdownChart() {
  const [tab, setTab] = useState<Tab>("product");

  const tabs: { id: Tab; label: string }[] = [
    { id: "product", label: "By Product" },
    { id: "region", label: "By Region" },
    { id: "mrr", label: "MRR Trend" },
  ];

  const data = tab === "product" ? byProduct : tab === "region" ? byRegion : mrrGrowth;

  return (
    <Card className="fin-card">
      <div className="fin-card-header flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="font-semibold text-foreground">Revenue Breakdown</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Distribution by product line, region &amp; MRR
          </p>
        </div>
        <div className="flex items-center bg-muted rounded-lg p-0.5 gap-0.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`text-xs px-3 py-1.5 rounded-md transition-all font-medium ${
                tab === t.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="fin-card-content pb-4 px-4">
        <ResponsiveContainer width="100%" height={220}>
          {tab === "mrr" ? (
            <LineChart data={mrrGrowth} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradMRR2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} vertical={false} />
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
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="mrr"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 40, left: 0, bottom: 0 }} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                width={68}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                fill={tab === "product" ? "#6366f1" : "#38bdf8"}
                fillOpacity={0.85}
                label={{
                  position: "right",
                  formatter: (v: number) => `$${(v / 1000).toFixed(0)}k`,
                  fontSize: 11,
                  fill: "hsl(var(--muted-foreground))",
                }}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}